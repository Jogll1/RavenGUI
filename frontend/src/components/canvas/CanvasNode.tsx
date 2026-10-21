import { useCallback, useEffect, useRef, useState } from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { FaRegCircle } from 'react-icons/fa6';

import type { Transform, EditorNode, ValueSetter, ID } from '../../lib/editor/editor.types';
import { cn, ev } from '../../lib/utils';

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
    default:
      return <></>;
  }
}

interface CanvasNodeProps {
  node: EditorNode;
  transformRef: React.RefObject<Transform>;
  selectedNode: ValueSetter<ID | null>;
  updateNodePosition: (id: string, newX: number, newY: number) => void;
}

export default function CanvasNode({ node, transformRef, selectedNode, updateNodePosition }: CanvasNodeProps) {
  const selected = selectedNode !== null && selectedNode.value === node.id;

  const elementRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const selectThis = useCallback(() => {
    selectedNode.setter(node.id);
  }, [selectedNode, node]);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    return draggable({
      element: el,
      onGenerateDragPreview({ nativeSetDragImage }) {
        disableNativeDragPreview({ nativeSetDragImage });
      },
      onDragStart() {
        selectThis();
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

          updateNodePosition(node.id, newX, newY);
        }

        setIsDragging(false);
        setDragOffset({ x: 0, y: 0 });
      },
    });
  }, [node.id, updateNodePosition, transformRef, dragOffset, node.x, node.y, selectThis]);

  const { newX, newY } = getNewCoords(node.x, node.y, dragOffset.x, dragOffset.y);

  return (
    <div
      ref={elementRef}
      style={{
        transform: `translate(${newX}px, ${newY}px)`,
        width: `${node.styles.width}px`,
        height: `${node.styles.height}px`,
        backgroundColor: `#${node.styles.backgroundColor ?? '181921'}`,
      }}
      className={cn(
        'text-surface-light absolute top-0 left-0 z-10 flex h-32 w-32 flex-col items-center justify-center border-3',
        ev(isDragging, 'cursor-grabbing shadow-2xl', 'cursor-grab shadow-md'),
        ev(selected, 'border-primary-light', 'hover:border-primary border-transparent'),
      )}
      onClick={(e) => {
        e.stopPropagation();
        selectThis();
      }}
    />
  );
}
