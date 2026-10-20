import { ROOT_ID } from '../lib/editor/editor.shared';
import type { EditorNodeRecord, EditorNode, Environment, ID, ValueSetter } from '../lib/editor/editor.types';
import { cn, ev } from '../lib/utils';
import EditorPanel from './EditorPanel';
import { getNodesByID, getRootNode } from '../lib/editor/node-utils';
import { NodeIcon } from './canvas/CanvasNode';
import { useEffect } from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import useReparentDropTarget from '../lib/hooks/useReparentDropTarget';

function Details({ children, className, ...rest }: React.ComponentProps<'details'>) {
  return (
    <details open className={cn(className, 'text-nowrap')} {...rest}>
      {children}
    </details>
  );
}

function Title({ children, className, ...rest }: React.ComponentProps<'div'>) {
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
}

function ArrowButton() {
  return (
    <span
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        const details = e.currentTarget.closest('details');
        if (details) {
          details.open = !details.open;
        }
      }}
      className="cursor-pointer"
    >
      <svg
        className="arrow-icon"
        fill="none"
        height="20"
        width="16"
        stroke="currentColor"
        strokeWidth="3"
        viewBox="0 0 24 24"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </span>
  );
}

function RootDropZone({ nodes }: { nodes: ValueSetter<EditorNodeRecord> }) {
  const { ref, hovered } = useReparentDropTarget(nodes);

  return (
    <div className="grid list-none grid-cols-[16px_1fr]">
      <div></div>
      <div className={cn('h-1 w-full py-0.5', ev(hovered, 'bg-primary-dark'))} ref={ref}></div>
    </div>
  );
}

interface SceneTreeEntryProps {
  nodes: ValueSetter<EditorNodeRecord>;
  node: EditorNode;
  selectedNode: ValueSetter<ID | null>;
}

// TODO: lines | under nodes with children
// TODO: un-parenting nodes and rearranging
function SceneTreeEntry({ nodes, node, selectedNode }: SceneTreeEntryProps) {
  const { ref, hovered } = useReparentDropTarget(nodes, node.id);

  const selected = selectedNode !== null && selectedNode.value === node.id;

  const nodeChildren = getNodesByID(nodes.value, node.children);
  const hasChildren = nodeChildren.length > 0;

  const NodeElement = hasChildren ? Details : 'div';
  const TitleElement = hasChildren ? 'summary' : Title;

  const handleOnClick = () => {
    selectedNode.setter(node.id);
  };

  // Set up dragging
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return draggable({
      element: el,
      getInitialData: () => ({ node }),
    });
  }, [ref, node]);

  return (
    <NodeElement className="flex flex-col">
      <TitleElement
        className={cn('grid list-none grid-cols-[16px_1fr] items-center select-none')}
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        {hasChildren ? <ArrowButton /> : <div></div>}
        <div
          className={cn(
            'flex w-full flex-row items-center gap-1 rounded-md px-1',
            ev(selected, 'bg-primary-light text-heading', 'hover:bg-primary-dark hover:text-heading'),
            ev(hovered, 'bg-primary-dark text-heading'),
            ev(hasChildren, 'cursor-pointer'),
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleOnClick();
          }}
          ref={ref}
        >
          <NodeIcon node={node} />
          <p>{node.name}</p>
        </div>
      </TitleElement>
      {hasChildren && (
        <div className="ml-4 flex flex-col">
          {nodeChildren.map((child) => (
            <div key={child.id}>
              <SceneTreeEntry nodes={nodes} node={child} selectedNode={selectedNode} />
            </div>
          ))}
        </div>
      )}
    </NodeElement>
  );
}

export default function SceneTree({ environment }: { environment: Environment }) {
  const root = getRootNode(environment.nodes.value);
  const rootChildren = getNodesByID(environment.nodes.value, root.children);

  const handleOnClick = () => {
    environment.selected.setter(null);
  };

  return (
    <EditorPanel title="Scene" minSize={200} defaultSize="15%" collapsible>
      <div className="flex size-full flex-col overflow-auto p-2" onClick={handleOnClick}>
        <RootDropZone nodes={environment.nodes} />
        {rootChildren.map((child) => {
          if (child.id !== ROOT_ID) {
            return (
              <SceneTreeEntry
                key={child.id}
                nodes={environment.nodes}
                node={child}
                selectedNode={environment.selected}
              />
            );
          }
        })}
      </div>
    </EditorPanel>
  );
}
