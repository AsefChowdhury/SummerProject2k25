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
                (listElement as HTMLElement).style.zIndex = '0';
                (listElement as HTMLElement).style.transition = 'transform 0.2s ease';
                itemRects.current.set(props.items[index].clientId, {ref: listElement as HTMLElement, center: rect.top + (rect.height / 2), offsetPosition: 0});
            }
        });
        reorderedList.current = props.items;
    }

    const handleDragEnd = () => {
        if(!draggingItem) return;
        const newList = reorderedList.current.map((item, index) => ({...item, index: index}));
        document.querySelectorAll('.reorder-list :not(.dragging)').forEach(el => {
            (el as HTMLElement).style.transition = 'none';
            (el as HTMLElement).style.transform = 'translateY(0px)';
        });
        draggingItem.ref.style.transform = `translateY(0px)`;
        draggingItem.ref.style.zIndex = '';
        draggingItem.ref.style.position = '';
        draggingItem.ref.classList.remove('dragging');
        setDraggingItem(null);
        props.onReorder(newList);
    }

    const handleDragging = (e: MouseEvent) => {
        const mouseY = e.clientY;
        if(!draggingItem) return;
        if (!container.current) return;
        let dy = mouseY - draggingItem.startPos.y;
        let velocity = mouseY - prevDragPosition.current.y;
        const itemIndex = draggingItem.index;
        const listGap = 20;

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
        if(velocity > 0){
            const nextItem = reorderedList.current[itemIndex + 1];
            if(nextItem === undefined) return;
            const nextItemRect = itemRects.current.get(nextItem.clientId);
            if (nextItemRect === undefined) return;
            if (mouseY + mouseOffsets.current.bottom >= nextItemRect.center) {
                const newPosition = nextItemRect.offsetPosition + (draggingItem.rect.height * -1 - listGap)
                nextItemRect.ref.style.transform = `translateY(${newPosition}px)`;
                const newList = [...reorderedList.current];
                newList[itemIndex] = newList[itemIndex + 1];
                newList[itemIndex + 1] = draggingItem.item;
                draggingItem.index = itemIndex + 1;
                setDraggingItem({...draggingItem});
                
                const newRects = itemRects.current;
                newRects.set(nextItem.clientId, {...nextItemRect, center: nextItemRect.center - (draggingItem.rect.height + listGap), offsetPosition: newPosition});
                itemRects.current = newRects;
                reorderedList.current = newList;
                prevDragPosition.current = {y: mouseY, x: e.clientX};
            }
            
        } else if (velocity <= 0) {  
            const prevItem = reorderedList.current[itemIndex - 1];
            if(prevItem === undefined) return;
            const prevItemRect = itemRects.current.get(prevItem.clientId);
            if (prevItemRect === undefined) return;
            if(mouseY - mouseOffsets.current.top <= prevItemRect.center){
                const newPosition = prevItemRect.offsetPosition + (draggingItem.rect.height + listGap);
                prevItemRect.ref.style.transform = `translateY(${newPosition}px)`;
                const newList = [...reorderedList.current];
                newList[itemIndex] = newList[itemIndex - 1];
                newList[itemIndex - 1] = draggingItem.item;
                draggingItem.index = itemIndex - 1;
                setDraggingItem({...draggingItem});
    
                const newRects = itemRects.current;
                newRects.set(prevItem.clientId, {...prevItemRect, center: prevItemRect.center + (draggingItem.rect.height + listGap), offsetPosition: newPosition});
                itemRects.current = newRects;
                reorderedList.current = newList;
                prevDragPosition.current = {y: mouseY, x: e.clientX};
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