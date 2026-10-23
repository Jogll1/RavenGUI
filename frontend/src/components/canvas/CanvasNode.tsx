import { Resizable, type ResizeCallbackData } from 'react-resizable';
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview';
import { FaRegCircle } from 'react-icons/fa6';
import type { Transform, EditorNode, ValueSetter, ID } from '../../lib/editor/editor.types';
import { cn, ev } from '../../lib/utils';

// TODO:
// - Small movements with arrow keys
// - Make resize handles and border always have the same size on the screen
// - Make dragging not have the red circle icon
// - Make block outline and resize handles always on top

/** Minimum move step in pixels. */
const MOVE_STEP = 4;

function getNewCoords(oldX: number, oldY: number, dX: number, dY: number) {
  return {
    newX: dX !== 0 ? Math.ceil((oldX + dX) / MOVE_STEP) * MOVE_STEP : oldX,
    newY: dY !== 0 ? Math.ceil((oldY + dY) / MOVE_STEP) * MOVE_STEP : oldY,
  };
}

export function NodeIcon({ node }: { node: EditorNode }) {
  let Icon = <></>;
  switch (node.type) {
    case 'base':
      Icon = <FaRegCircle size={16} className="pb-0.5" />;
      break;
    default:
      break;
  }

  return <div className="w-4">{Icon}</div>;
}

const ResizeHandle = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { handleAxis?: string; selected: boolean }
>((props, ref) => {
  const { handleAxis, ...restProps } = props;

  const getHandle = (axis: string | undefined) => {
    switch (axis) {
      case 'sw':
        return '-bottom-1.75 -left-1.75 cursor-sw-resize';
      case 'se':
        return '-bottom-1.75 -right-1.75 cursor-se-resize';
      case 'nw':
        return '-top-1.75 -left-1.75 cursor-nw-resize';
      case 'ne':
        return '-top-1.75 -right-1.75 cursor-ne-resize';
      default:
        return '';
    }
  };

  return (
    <div
      className={cn(
        'border-primary-light absolute! size-3 border-3 bg-white',
        ev(props.selected, 'block', 'hidden'),
        getHandle(handleAxis),
      )}
      ref={ref}
      {...restProps}
    />
  );
});

interface CanvasNodeProps {
  node: EditorNode;
  canvasScale: number;
  transformRef: React.RefObject<Transform>;
  selectedNode: ValueSetter<ID | null>;
  updateNodePosition: (id: ID, newX: number, newY: number) => void;
  updateNodeSize: (id: ID, newW: number, newH: number) => void;
}

export default function CanvasNode({
  node,
  canvasScale,
  transformRef,
  selectedNode,
  updateNodePosition,
  updateNodeSize,
}: CanvasNodeProps) {
  const selected = selectedNode !== null && selectedNode.value === node.id;

  const elementRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);

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
      canDrag: () => !isResizingRef.current,
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

  const onResize = (_e: React.SyntheticEvent, data: ResizeCallbackData) => {
    // Use newX and newY
    const newW = Math.ceil(data.size.width / MOVE_STEP) * MOVE_STEP;
    const newH = Math.ceil(data.size.height / MOVE_STEP) * MOVE_STEP;
    let dX = 0;
    let dY = 0;

    switch (data.handle) {
      case 'sw':
        dX = newW - node.styles.width;
        break;
      case 'nw':
        dX = newW - node.styles.width;
        dY = newH - node.styles.height;
        break;
      case 'ne':
        dY = newH - node.styles.height;
        break;
    }

    updateNodePosition(node.id, node.x - dX, node.y - dY);
    updateNodeSize(node.id, newW, newH);
  };

  return (
    <Resizable
      width={node.styles.width}
      height={node.styles.height}
      onResize={onResize}
      onResizeStart={() => {
        isResizingRef.current = true;
      }}
      onResizeStop={() => {
        isResizingRef.current = false;
      }}
      resizeHandles={['sw', 'nw', 'se', 'ne']}
      handle={<ResizeHandle selected={selected} />}
      transformScale={canvasScale}
      className="absolute!"
    >
      <div
        ref={elementRef}
        style={{
          transform: `translate(${newX}px, ${newY}px)`,
          width: `${node.styles.width}px`,
          height: `${node.styles.height}px`,
          backgroundColor: `#${node.styles.backgroundColor ?? 'ffffff'}`,
          zIndex: node.styles.zIndex ?? 0,
          opacity: (node.styles.opacity ?? 100) / 100,
        }}
        className={cn(
          'text-surface-light absolute top-0 left-0 h-32 w-32 border-3',
          ev(isDragging, 'cursor-grabbing', 'cursor-grab'),
          ev(selected, 'border-primary-light', 'hover:border-primary border-transparent'),
          ev(node.styles.visible ?? true, 'block', 'hidden'),
        )}
        onClick={(e) => {
          e.stopPropagation();
          selectThis();
        }}
      />
    </Resizable>
  );
}
