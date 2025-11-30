import { useEffect, useRef, useState} from "react"

type ReorderableItem = {
    clientId: string;
    index: number;
}

type ReorderListProps<T extends ReorderableItem> = {
    className?: string;
    items: T[];
    onReorder: (newOrder: T[]) => void;
    children: (
        item: T,
        helpers: {
            onDragStart: (id: string, e: React.MouseEvent) => void;
        }
    ) => React.ReactNode;
};

function Reorderlist<T extends ReorderableItem>(props: ReorderListProps<T>) {
    const [draggingItem, setDraggingItem] = useState<{ref: HTMLElement, item: T, index: number, rect: DOMRect, startPos: {x: number, y: number}} | null>(null);
    const itemRects = useRef<Map<string, {ref: HTMLElement, center: number, offsetPosition: number}>>(new Map());
    const reorderedList = useRef<T[]>([]);
    const prevDragPosition = useRef<{x: number, y: number}>({x: 0, y: 0});
    const container = useRef<{ref: HTMLOListElement, top: number, bottom: number} | null>(null);
    const mouseOffsets = useRef<{left: number, right: number, top: number, bottom: number}>({left: 0, right: 0, top: 0, bottom: 0});
    const scroll = useRef(0);
    const mousePos = useRef<{x: number, y: number}>({x: 0, y: 0});
    const autoScrollInterval = useRef<number | null>(null);
    const animations = useRef<Map<string, Animation>>(new Map())

    useEffect(() => {
        if (draggingItem) {
            window.addEventListener("mousemove", handleDragging);
            window.addEventListener("mouseup", handleDragEnd);
            return () => {
                window.removeEventListener("mousemove", handleDragging);
                window.removeEventListener("mouseup", handleDragEnd);
            };
        }
    }, [draggingItem]);

    const handleDragStart = (id: string, e: React.MouseEvent) => {
        const listElement = (e.target as HTMLElement).closest('ol');
        if(!listElement) return;
        container.current = {ref: listElement, top: listElement.getBoundingClientRect().top, bottom: listElement.getBoundingClientRect().bottom};
        const listElements = document.querySelector(`.${props.className ?? 'reorder-list'}`)?.children;
        if(!listElements) return;
        scroll.current = window.scrollY;
        const item = props.items.find(item => item.clientId === id)!;
        const itemEl = (e.target as HTMLElement).closest('li');
        prevDragPosition.current = {y: e.clientY, x: e.clientX};
        Array.from(listElements).forEach((listElement, index) => {
            if(listElement === itemEl){
                listElement.classList.add('dragging');
                (listElement as HTMLElement).style.zIndex = '100';
                (listElement as HTMLElement).style.position = 'relative';
                (listElement as HTMLElement).style.boxShadow = '0px 0px 20px 1px rgba(0, 0, 0, 0.7)';
                const rect = listElement.getBoundingClientRect();
                mouseOffsets.current = {left: e.clientX - rect.left, right: rect.right - e.clientX, top: e.clientY - rect.top, bottom: rect.bottom - e.clientY};
                setDraggingItem({ref: listElement as HTMLElement, item: item, index: item.index, rect: rect, startPos: {y: e.clientY, x: e.clientX}});
            } else {
                const rect = listElement.getBoundingClientRect();
                itemRects.current.set(props.items[index].clientId, {ref: listElement as HTMLElement, center: rect.top + (rect.height / 2), offsetPosition: 0});
            }
        });
        reorderedList.current = props.items;
    }

    const handleDragEnd = () => {
        if(!draggingItem) return;
        const newList = reorderedList.current.map((item, index) => ({...item, index: index}));
        animations.current.forEach((a) => a.cancel())
        animations.current.clear()
        itemRects.current.clear();
        draggingItem.ref.style.transform = `translateY(0px)`;
        draggingItem.ref.style.zIndex = '';
        draggingItem.ref.style.position = '';
        draggingItem.ref.style.boxShadow = '';
        draggingItem.ref.classList.remove('dragging');
        setDraggingItem(null);
        props.onReorder(newList);
        scroll.current = 0;
        if(autoScrollInterval.current !== null){
            clearInterval(autoScrollInterval.current);
            autoScrollInterval.current = null;
        }
    }

    const checkAutoScroll = (mouseY: number) => {
        const threshold = 50;
        const scrollSpeed = 12;

        if (mouseY < threshold) {
            return -scrollSpeed;
        } else if (window.innerHeight - mouseY < threshold) {
            return scrollSpeed;
        }
        return 0;
    };

    const runAutoScroll = () => {
        if (!draggingItem || !container.current) return;
        const scrollDelta = checkAutoScroll(mousePos.current.y);
        if (scrollDelta !== 0) {
            window.scrollBy(0, scrollDelta);
            const newDy = mousePos.current.y - draggingItem.startPos.y + (window.scrollY - scroll.current);
            applyDragTranslation(newDy);
            checkReordering(newDy);

        } else if (autoScrollInterval.current !== null) {
            clearInterval(autoScrollInterval.current);
            autoScrollInterval.current = null;
        }
    };

    const applyDragTranslation = (dy: number) => {
        if(!draggingItem || !container.current) return;
        const origTop = draggingItem.rect.top;
        const height = draggingItem.rect.height;

        const minTranslate = container.current.top - origTop; 
        const maxTranslate = container.current.bottom - (origTop + height);

        let translate = dy;

        if (translate < minTranslate) {
            translate = minTranslate;
        } else if (translate > maxTranslate) {
            translate = maxTranslate;
        }
        draggingItem.ref.style.transform = `translateY(${translate}px)`;
    }

    const checkReordering = (mouseY: number) => {
        if(!draggingItem) return;
        const itemIndex = draggingItem.index;
        const nextItem = reorderedList.current[itemIndex + 1];
        const prevItem = reorderedList.current[itemIndex - 1];
        const listGap = 20;
        console.log(mouseY)
        if (nextItem) {
            const nextItemRect = itemRects.current.get(nextItem.clientId);
            if (nextItemRect && mouseY + mouseOffsets.current.bottom + (window.scrollY - scroll.current) >= nextItemRect.center) {
                const newPosition = nextItemRect.offsetPosition + (draggingItem.rect.height * -1 - listGap)
                const anim = nextItemRect.ref.animate(
                    [{ transform: `translateY(${newPosition}px)` }],
                    { duration: 200, easing: "ease", fill: "forwards" }
                );
                animations.current.set(nextItem.clientId, anim)
                const newList = [...reorderedList.current];
                newList[itemIndex] = newList[itemIndex + 1];
                newList[itemIndex + 1] = draggingItem.item;
                draggingItem.index = itemIndex + 1;
                setDraggingItem({...draggingItem});
                
                itemRects.current.set(nextItem.clientId, {...nextItemRect, center: nextItemRect.center - (draggingItem.rect.height + listGap), offsetPosition: newPosition});
                reorderedList.current = newList;
            }
        }
        if(prevItem){
            const prevItemRect = itemRects.current.get(prevItem.clientId);
            if(prevItemRect && mouseY - mouseOffsets.current.top + (window.scrollY - scroll.current) <= prevItemRect.center){
                const newPosition = prevItemRect.offsetPosition + (draggingItem.rect.height + listGap);
                const anim = prevItemRect.ref.animate(
                    [{ transform: `translateY(${newPosition}px)` }],
                    { duration: 200, easing: "ease", fill: "forwards" }
                );
                animations.current.set(prevItem.clientId, anim)
                const newList = [...reorderedList.current];
                newList[itemIndex] = newList[itemIndex - 1];
                newList[itemIndex - 1] = draggingItem.item;
                draggingItem.index = itemIndex - 1;
                setDraggingItem({...draggingItem});
    
                itemRects.current.set(prevItem.clientId, {...prevItemRect, center: prevItemRect.center + (draggingItem.rect.height + listGap), offsetPosition: newPosition});
                reorderedList.current = newList;
            }
        }
    }

    const handleDragging = (e: MouseEvent) => {
        const mouseY = e.clientY;
        if(!draggingItem) return;
        if (!container.current) return;
        let dy = mouseY - draggingItem.startPos.y + (window.scrollY - scroll.current);
        mousePos.current.y = mouseY;
        applyDragTranslation(dy);
        checkReordering(dy);
        
        const scrollDelta = checkAutoScroll(mouseY);
        if (scrollDelta !== 0) {
            if (autoScrollInterval.current === null) {
                autoScrollInterval.current = window.setInterval(runAutoScroll, 16);
            }
        } else {
            if (autoScrollInterval.current !== null) {
                clearInterval(autoScrollInterval.current);
                autoScrollInterval.current = null;
            }
        }
    }

    return (
        <ol className={`reorder-list ${props.className ?? ''}`}>
            {props.items.map((item) => props.children(item, {
                onDragStart: (id: string, e: React.MouseEvent) => handleDragStart(id, e),
            }))}
        </ol>
    )
}

export default Reorderlist