import { useRef, useState} from "react"

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
            onDragEnd: () => void;
            onDragging: (e: MouseEvent) => void;
        }
    ) => React.ReactNode;
};

function Reorderlist<T extends ReorderableItem>(props: ReorderListProps<T>) {
    const [draggingItem, setDraggingItem] = useState<{ref: HTMLElement, item: T, index: number, rect: DOMRect, startPos: {x: number, y: number}} | null>(null);
    const itemRects = useRef<Map<string, {ref: HTMLElement, top: number, bottom: number, offsetPosition: number}>>(new Map());
    const reorderedList = useRef<T[]>([]);
    const prevDragPosition = useRef<{x: number, y: number}>({x: 0, y: 0});

    const handleDragStart = (id: string, e: React.MouseEvent) => {
        const listElements = document.querySelector(`.${props.className ?? 'reorder-list'}`)?.children;
        if(!listElements) return;
        const item = props.items.find(item => item.clientId === id)!;
        prevDragPosition.current = {y: e.clientY, x: e.clientX};
        const rectMap = new Map<string, {ref: HTMLElement, top: number, bottom: number, offsetPosition: number}>();
        Array.from(listElements).forEach(listElement => {
            listElement = listElement.firstChild as HTMLElement;
            if(listElement.id === item.clientId){
                setDraggingItem({ref: listElement as HTMLElement, item: item, index: item.index, rect: listElement.getBoundingClientRect(), startPos: {y: e.clientY, x: e.clientX}});
            } else {
                const rect = listElement.getBoundingClientRect();
                rectMap.set(listElement.id, {ref: listElement as HTMLElement, top: rect.top, bottom: rect.bottom, offsetPosition: 0});
            }
        });
        reorderedList.current = props.items;
        itemRects.current = rectMap;
    }

    const handleDragEnd = () => {
        if(!draggingItem) return;
        const newList = reorderedList.current.map((item, index) => ({...item, index: index}));
        document.querySelectorAll('.reorder-list :not(.dragging)').forEach(el => {
            (el as HTMLElement).style.transition = 'none';
            (el as HTMLElement).style.transform = 'translateY(0px)';
        });
        draggingItem.ref.style.transform = `translateY(0px)`;
        setDraggingItem(null);
        props.onReorder(newList);
    }

    const handleDragging = (e: MouseEvent) => {
        const mouseY = e.clientY;
        if(!draggingItem) return;
        let dy = mouseY - draggingItem.startPos.y;
        let velocity = mouseY - prevDragPosition.current.y;
        const itemIndex = draggingItem.index;
        const listGap = 20;
        draggingItem.ref.style.transform = `translateY(${dy}px)`;
        if(velocity > 0){
            const nextItem = reorderedList.current[itemIndex + 1];
            if(nextItem === undefined) return;
            const nextItemRect = itemRects.current.get(nextItem.clientId);
            if (nextItemRect === undefined) return;
            if (mouseY >= nextItemRect.bottom - (draggingItem.rect.height)) {
                nextItemRect.ref.style.transition = 'transform 0.2s ease';
                const newPosition = nextItemRect.offsetPosition + (draggingItem.rect.height * -1 - listGap)
                nextItemRect.ref.style.transform = `translateY(${newPosition}px)`;
                const newList = [...reorderedList.current];
                newList[itemIndex] = newList[itemIndex + 1];
                newList[itemIndex + 1] = draggingItem.item;
                draggingItem.index = itemIndex + 1;
                setDraggingItem({...draggingItem});
                
                const newRects = itemRects.current;
                newRects.set(nextItem.clientId, {...nextItemRect, bottom: nextItemRect.bottom - (draggingItem.rect.height + listGap), top: nextItemRect.top - (draggingItem.rect.height + listGap), offsetPosition: newPosition});
                itemRects.current = newRects;
                
                reorderedList.current = newList;
                prevDragPosition.current = {y: mouseY, x: e.clientX};
            }
            
        } else if (velocity <= 0) {  
            const prevItem = reorderedList.current[itemIndex - 1];
            if(prevItem === undefined) return;
            const prevItemRect = itemRects.current.get(prevItem.clientId);
            if (prevItemRect === undefined) return;
            if(mouseY <= prevItemRect.top){
                prevItemRect.ref.style.transition = 'transform 0.2s ease';
                const newPosition = prevItemRect.offsetPosition + (draggingItem.rect.height + listGap);
                prevItemRect.ref.style.transform = `translateY(${newPosition}px)`;
                const newList = [...reorderedList.current];
                newList[itemIndex] = newList[itemIndex - 1];
                newList[itemIndex - 1] = draggingItem.item;
                draggingItem.index = itemIndex - 1;
                setDraggingItem({...draggingItem});
    
                const newRects = itemRects.current;
                newRects.set(prevItem.clientId, {...prevItemRect, bottom: prevItemRect.bottom + (draggingItem.rect.height + listGap), top: prevItemRect.top + (draggingItem.rect.height + listGap), offsetPosition: newPosition});
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
                onDragEnd: () => handleDragEnd(),
                onDragging: (e: MouseEvent) => handleDragging(e),
            }))}
        </ol>
    )
}

export default Reorderlist