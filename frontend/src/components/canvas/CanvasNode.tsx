import { useEffect, useRef, useState } from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { FaRegCircle } from 'react-icons/fa6';

import type { Transform, EditorNode } from '../../lib/editor/editor.types';
import { cn } from '../../lib/utils';

// TODO:
// - Small movements with arrow keys

/** Minimum drag move step in pixels. */
const MOVE_STEP = 4;

function getNewCoords(oldX: number, oldY: number, dX: number, dY: number) {
  return {
    newX: Math.ceil((oldX + dX) / MOVE_STEP) * MOVE_STEP,
    newY: Math.ceil((oldY + dY) / MOVE_STEP) * MOVE_STEP,
  };
}

export function NodeIcon({ node }: { node: EditorNode }) {
  switch (node.type) {
    case 'base':
      return <FaRegCircle size={12} className="pb-0.5" />;
  }
}

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

        const dX = location.current.input.clientX - location.initial.input.clientX;
        const dY = location.current.input.clientY - location.initial.input.clientY;

        setDragOffset({
          x: Math.round(dX / scale),
          y: Math.round(dY / scale),
        });
      },
      onDrop() {
        const { x, y } = dragOffset;

        if (x !== 0 || y !== 0) {
          const { newX, newY } = getNewCoords(node.x, node.y, x, y);

          onDragComplete(node.id, newX, newY);
        }

        setIsDragging(false);
        setDragOffset({ x: 0, y: 0 });
      },
    });
  }, [node.id, onDragComplete, transformRef, dragOffset, node.x, node.y]);

  const { newX, newY } = getNewCoords(node.x, node.y, dragOffset.x, dragOffset.y);

  return (
    <div
      ref={elementRef}
      style={{
        transform: `translate(${newX}px, ${newY}px)`,
      }}
      className={cn(
        'bg-background text-surface-light absolute top-0 left-0 flex h-32 w-32 flex-col items-center justify-center border-3',
        isDragging
          ? 'border-primary-light z-100 cursor-grabbing shadow-2xl'
          : 'hover:border-primary z-10 cursor-grab border-transparent shadow-md',
      )}
    >
      <p>{node.name}</p>
      <p>
        ({Math.round(newX)}, {Math.round(newY)})
      </p>
    </div>
  );
}
