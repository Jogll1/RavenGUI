import { useEffect, useRef, useState } from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';

import { type Transform, type EditorNode } from '../../lib/editor/editor.types';
import { cn } from '../../lib/utils';

// TODO:
// - Small movements with arrow keys

interface CanvasNodeProps {
  node: EditorNode;
  transformRef: React.RefObject<Transform>;
  onDragComplete: (id: string, deltaX: number, deltaY: number) => void;
}

export default function CanvasNode({ node, transformRef, onDragComplete }: CanvasNodeProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    return draggable({
      element: el,
      onGenerateDragPreview({ nativeSetDragImage }) {
        disableNativeDragPreview({ nativeSetDragImage });
      },
      onDragStart() {
        setIsDragging(true);
      },
      onDrag({ location }) {
        const { scale } = transformRef.current;
        // Project structural offsets live
        const deltaX = location.current.input.clientX - location.initial.input.clientX;
        const deltaY = location.current.input.clientY - location.initial.input.clientY;

        setDragOffset({
          x: deltaX / scale,
          y: deltaY / scale,
        });
      },
      onDrop({ location }) {
        setIsDragging(false);
        setDragOffset({ x: 0, y: 0 });

        const deltaX = location.current.input.clientX - location.initial.input.clientX;
        const deltaY = location.current.input.clientY - location.initial.input.clientY;

        if (deltaX !== 0 || deltaY !== 0) {
          onDragComplete(node.id, deltaX, deltaY);
        }
      },
    });
  }, [node.id, onDragComplete, transformRef]);

  const step = 4;
  const currentX = Math.ceil((node.x + dragOffset.x) / step) * step;
  const currentY = Math.ceil((node.y + dragOffset.y) / step) * step;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    transform: `translate(${currentX}px, ${currentY}px)`,
    zIndex: isDragging ? 100 : 10,
  };

  return (
    <div
      ref={elementRef}
      style={style}
      className={cn(
        'bg-background text-surface-light flex h-32 w-32 items-center justify-center rounded-lg border-3 transition-shadow duration-150',
        isDragging
          ? 'border-primary-light cursor-grabbing shadow-2xl'
          : 'hover:border-primary cursor-grab border-transparent shadow-md',
      )}
    >
      {Math.round(currentX)}, {Math.round(currentY)}
      {/* <input
        type="text"
        placeholder="Focusable property text..."
        className="border-surface bg-background text-body focus:border-primary w-full rounded border px-2 py-1 text-xs focus:outline-none"
        onKeyDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      /> */}
    </div>
  );
}
