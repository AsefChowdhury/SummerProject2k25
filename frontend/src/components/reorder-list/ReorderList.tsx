import { useEffect, useRef } from "react"

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
    const draggingItem = useRef<{ref: HTMLElement, item: T, index: number, rect: DOMRect, startPos: {x: number, y: number}} | null>(null);
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
                draggingItem.current = ({ref: listElement as HTMLElement, item: item, index: item.index, rect: rect, startPos: {y: e.clientY, x: e.clientX}});
            } else {
                const rect = listElement.getBoundingClientRect();
                itemRects.current.set(props.items[index].clientId, {ref: listElement as HTMLElement, center: rect.top + (rect.height / 2), offsetPosition: 0});
            }
        });
        reorderedList.current = props.items;
    }

    const handleDragEnd = () => {
        if(!draggingItem.current) return;
        const newList = reorderedList.current.map((item, index) => ({...item, index: index}));
        itemRects.current.forEach((itemRect) => itemRect.ref.style.transform = `translateY(0px)`);
        props.onReorder(newList);
        animations.current.forEach((a) => a.cancel())
        animations.current.clear()
        itemRects.current.clear();
        draggingItem.current.ref.style.transform = `translateY(0px)`;
        draggingItem.current.ref.style.zIndex = '';
        draggingItem.current.ref.style.position = '';
        draggingItem.current.ref.style.boxShadow = '';
        draggingItem.current.ref.classList.remove('dragging');
        draggingItem.current = null;
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
        if (!draggingItem.current || !container.current) return;
        const scrollDelta = checkAutoScroll(mousePos.current.y);
        if (scrollDelta !== 0) {
            window.scrollBy(0, scrollDelta);
            const newDy = mousePos.current.y - draggingItem.current.startPos.y + (window.scrollY - scroll.current);
            applyDragTranslation(newDy);
            checkReordering(mousePos.current.y);

        } else if (autoScrollInterval.current !== null) {
            clearInterval(autoScrollInterval.current);
            autoScrollInterval.current = null;
        }
    };

    const applyDragTranslation = (mouseY: number) => {
        if(!draggingItem.current || !container.current) return;
        const origTop = draggingItem.current.rect.top;
        const height = draggingItem.current.rect.height;

        const minTranslate = container.current.top - origTop; 
        const maxTranslate = container.current.bottom - (origTop + height);

        let translate = mouseY - draggingItem.current.startPos.y + (window.scrollY - scroll.current);

        if (translate < minTranslate) {
            translate = minTranslate;
        } else if (translate > maxTranslate) {
            translate = maxTranslate;
        }
        draggingItem.current.ref.style.transform = `translateY(${translate}px)`;
    }

    const checkReordering = (mouseY: number) => {
        if(!draggingItem.current) return;
        const itemIndex = draggingItem.current.index;
        const nextItem = reorderedList.current[itemIndex + 1];
        const prevItem = reorderedList.current[itemIndex - 1];
        const listGap = 20;
        if (nextItem) {
            const nextItemRect = itemRects.current.get(nextItem.clientId);
            if (nextItemRect && mouseY + mouseOffsets.current.bottom + (window.scrollY - scroll.current)>= nextItemRect.center) {
                console.log(nextItem.index, itemIndex);
                const newPosition = nextItemRect.offsetPosition + (draggingItem.current.rect.height * -1 - listGap)
                reorderedList.current[itemIndex] = nextItem;
                reorderedList.current[itemIndex + 1] = draggingItem.current.item;
                draggingItem.current.index = itemIndex + 1;
                
                itemRects.current.set(nextItem.clientId, {...nextItemRect, center: nextItemRect.center - (draggingItem.current.rect.height + listGap), offsetPosition: newPosition});
                nextItemRect.ref.style.transform = `translateY(${newPosition}px)`;
                const anim = nextItemRect.ref.animate(
                    [{transform: `translateY(${nextItemRect.offsetPosition}px)`}, { transform: `translateY(${newPosition}px)` }],
                    { duration: 200, easing: "ease"}
                );
                animations.current.set(nextItem.clientId, anim)
                return;
            }
        }
        if(prevItem){
            const prevItemRect = itemRects.current.get(prevItem.clientId);
            if(prevItemRect && mouseY - mouseOffsets.current.top + (window.scrollY - scroll.current) <= prevItemRect.center){
                console.log(prevItem.index, itemIndex);
                const newPosition = prevItemRect.offsetPosition + (draggingItem.current.rect.height + listGap);
                reorderedList.current[itemIndex] = prevItem;
                reorderedList.current[itemIndex - 1] = draggingItem.current.item;
                draggingItem.current.index = itemIndex - 1;
                
                itemRects.current.set(prevItem.clientId, {...prevItemRect, center: prevItemRect.center + (draggingItem.current.rect.height + listGap), offsetPosition: newPosition});
                prevItemRect.ref.style.transform = `translateY(${newPosition}px)`;
                const anim = prevItemRect.ref.animate(
                    [ {transform: `translateY(${prevItemRect.offsetPosition}px)`}, { transform: `translateY(${newPosition}px)` }],
                    { duration: 200, easing: "ease"}
                );
                animations.current.set(prevItem.clientId, anim)
            }
        }
    }

    const handleDragging = (e: MouseEvent) => {
        const mouseY = e.clientY;
        if(!draggingItem.current || !container.current) return;
        mousePos.current.y = mouseY;
        applyDragTranslation(mouseY);
        checkReordering(mouseY);
        
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