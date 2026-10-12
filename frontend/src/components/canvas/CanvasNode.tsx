import { useEffect, useRef, useState } from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';

import { type Transform, type EditorNode } from '../../lib/editor/editor.types';

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

  const currentX = node.x + dragOffset.x;
  const currentY = node.y + dragOffset.y;

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
      className={`bg-background text-body w-64 rounded-lg border px-4 py-3 transition-shadow duration-150 ${
        isDragging
          ? 'border-primary-light cursor-grabbing shadow-2xl'
          : 'cursor-grab border-slate-800 shadow-md hover:border-slate-700'
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="border-primary-light bg-primary-dark/50 text-primary-light rounded border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
          {node.name}
        </span>
        <span className="text-surface-light font-mono text-[10px]">
          {Math.round(node.x)},{Math.round(node.y)}
        </span>
      </div>

      <input
        type="text"
        placeholder="Focusable property text..."
        className="border-surface bg-background text-body focus:border-primary w-full rounded border px-2 py-1 text-xs focus:outline-none"
        onKeyDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      />
    </div>
  );
}
