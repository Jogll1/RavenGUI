import { useEffect, useRef, useState } from 'react';
import { pointer, select } from 'd3-selection';
import { zoom, ZoomTransform } from 'd3-zoom';

import { type Transform, type Environment } from '../../lib/editor/editor.types';
import CanvasNode from './CanvasNode';
import CanvasInfoBar from './CanvasInfoBar';
import { DEFAULT_TARGET_X, DEFAULT_TARGET_Y, ROOT_ID } from '../../lib/editor/editor.shared';
import useShortcuts from '../../lib/hooks/useShortcuts';
import { updateNodePosition } from '../../lib/editor/node-utils';
import KEYBINDS from '../../lib/keybinds';

// Goals
// - Select: Left click drag
// - SVG components so zooming in is clean
// - On screen zoom controls: +, -, x (reset)

// TODO:
// - Remember coordinates should be (0, 0) in top-left, (+x, +x) bottom-right
// - Press F to center canvas on the target aspect box, ideally should put the aspect outline in frame,
//   so set zoom appropriately
// - Press R to reset zoom to 100%
// - Tool bar, command bar, zoom info
// - Fix quality of nodes when zooming in?

/**
 * Check if the input from an event is using a mousewheel.
 */
function isMouseWheel(event: any) {
  if (Math.abs(event.deltaX) > 0) {
    return false;
  }

  const isInteger = Number.isInteger(event.deltaY);
  const isLargeStep = Math.abs(event.deltaY) >= 100;

  return isInteger && isLargeStep;
}

export default function Canvas({ environment }: { environment: Environment }) {
  const { register, unregister } = useShortcuts();

  // Store nodes
  const [nodes, setNodes] = [environment.nodes.value, environment.nodes.setter];

  // Current scale and panning offset
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });

  // Canvas refs
  const transformRef = useRef<Transform>({ x: 0, y: 0, scale: 1 });
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Deselect nodes when canvas clicked
  const handleOnClick = () => {
    environment.selected.setter(null);
  };

  // Set-up D3 pan and zoom
  useEffect(() => {
    const container = containerRef.current;

    if (!container || !viewportRef.current) return;

    // Set-up d3 zooming and panning
    const zoomBehaviour = zoom<HTMLDivElement, unknown>()
      .scaleExtent([0.1, 8])
      .filter((event) => {
        if (event.type === 'wheel' && !event.ctrlKey) {
          return false;
        }
        return event.type === 'wheel' || event.type === 'dblclick' || event.button === 1;
      })
      .wheelDelta((event) => {
        return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002);
      })
      .on('zoom', (event) => {
        const t: ZoomTransform = event.transform;
        const currentTransform: Transform = { x: t.x, y: t.y, scale: t.k };

        setTransform(currentTransform);
        transformRef.current = currentTransform;

        if (viewportRef.current) {
          viewportRef.current.style.transform = `translate(${t.x}px, ${t.y}px) scale(${t.k})`;
        }
      });

    const selection = select(container);
    selection.call(zoomBehaviour).on('wheel.zoom', (event: WheelEvent) => {
      event.preventDefault();

      const currentZoom = selection.property('__zoom').k || 1;

      if (event.ctrlKey) {
        // Zoom
        const zoomSensitivity = isMouseWheel(event) ? 0.002 : 0.01;
        const nextZoom = currentZoom * Math.pow(2, -event.deltaY * zoomSensitivity);
        zoomBehaviour.scaleTo(selection, nextZoom, pointer(event));
      } else {
        // Pan
        zoomBehaviour.translateBy(selection, -(event.deltaX / currentZoom), -(event.deltaY / currentZoom));
      }
    });

    return () => {
      selection.on('.zoom', null);
    };
  }, []);

  // Register Ctrl+R to reset the target aspect
  useEffect(() => {
    const resizeTargetOutline = () => {
      environment.xTargetResolution.setter(DEFAULT_TARGET_X);
      environment.yTargetResolution.setter(DEFAULT_TARGET_Y);
    };

    register(KEYBINDS.resetTargetAspect, resizeTargetOutline);
    return () => unregister(KEYBINDS.resetTargetAspect);
  });

  return (
    <div className="text-body bg-background-dark relative flex size-full flex-col overflow-hidden select-none">
      <CanvasInfoBar transform={transform} />

      <div
        ref={containerRef}
        className="relative size-full overflow-hidden bg-[linear-gradient(to_right,#3b354f45_1px,transparent_1px),linear-gradient(to_bottom,#3b354f45_1px,transparent_1px)] outline-none"
        style={{
          backgroundSize: `${48 * transform.scale}px ${48 * transform.scale}px`,
          backgroundPosition: `${transform.x}px ${transform.y}px`,
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleOnClick();
        }}
      >
        {/* Aspect target outline */}
        <div
          className="border-surface/60 absolute inset-0 border-3 border-dashed"
          style={{
            width: `${environment.xTargetResolution.value * transform.scale}px`,
            height: `${environment.yTargetResolution.value * transform.scale}px`,
            top: `${transform.y}px`,
            left: `${transform.x}px`,
          }}
        />
        {/* Nodes */}
        <div ref={viewportRef} className="relative inset-0 origin-top-left will-change-transform">
          {Object.values(nodes).map((node) => {
            if (node.id !== ROOT_ID) {
              return (
                <CanvasNode
                  key={node.id}
                  node={node}
                  transformRef={transformRef}
                  selectedNode={environment.selected}
                  updateNodePosition={(id: string, newX: number, newY: number) => {
                    updateNodePosition(setNodes, id, newX, newY);
                  }}
                />
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
