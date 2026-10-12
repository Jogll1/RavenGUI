import { useEffect, useRef, useState } from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';

import { type Transform, type EditorNode } from '../../lib/editor/editor.types';
import { cn } from '../../lib/utils';

// TODO:
// - Small movements with arrow keys

const MOVE_STEP = 4;

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

  const currentX = Math.ceil((node.x + dragOffset.x) / MOVE_STEP) * MOVE_STEP;
  const currentY = Math.ceil((node.y + dragOffset.y) / MOVE_STEP) * MOVE_STEP;

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
        'bg-background text-surface-light flex h-32 w-32 flex-col items-center justify-center border-3',
        isDragging
          ? 'border-primary-light cursor-grabbing shadow-2xl'
          : 'hover:border-primary cursor-grab border-transparent shadow-md',
      )}
    >
      <p>{node.name}</p>
      <p>
        ({Math.round(currentX)}, {Math.round(currentY)})
      </p>
    </div>
  );
}
