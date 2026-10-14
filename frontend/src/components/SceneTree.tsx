import { ROOT_ID } from '../lib/editor/editor.shared';
import type { EditorNodeRecord, EditorNode, Environment, ID } from '../lib/editor/editor.types';
import { cn, ev } from '../lib/utils';
import EditorPanel from './EditorPanel';
import type { Setter } from '../lib/types';
import { getNodesByID, getRootNode } from '../lib/editor/node-utils';
import { useState } from 'react';
import { NodeIcon } from './canvas/CanvasNode';

function Details({ children, className, ...rest }: React.ComponentProps<'details'>) {
  return (
    <details open className={cn(className, 'text-nowrap')} {...rest}>
      {children}
    </details>
  );
}

function Title({ children, className, ...rest }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('ml-3', className)} {...rest}>
      {children}
    </div>
  );
}

function ArrowButton() {
  return (
    <svg
      className="arrow-icon"
      fill="none"
      height="20"
      width="12"
      stroke="currentColor"
      strokeWidth="3"
      viewBox="0 0 24 24"
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
}

// TODO: lines | under nodes with children
interface SceneTreeEntryProps {
  nodes: EditorNodeRecord;
  node: EditorNode;
  selectedNodeSetter: Setter<ID | null>;
}

function SceneTreeEntry({ nodes, node, selectedNodeSetter }: SceneTreeEntryProps) {
  const [selected, setSelected] = useState(false);

  const nodeChildren = getNodesByID(nodes, node.children);
  const hasChildren = nodeChildren.length > 0;

  const NodeElement = hasChildren ? Details : 'div';
  const TitleElement = hasChildren ? 'summary' : Title;

  const handleOnClick = () => {
    selectedNodeSetter(node.id);
    setSelected(true);
  };

  return (
    <NodeElement>
      <TitleElement
        className={cn(
          'flex list-none flex-row items-center gap-1 rounded-md px-2 select-none',
          ev(selected, 'bg-primary-light text-heading', 'hover:bg-primary-dark hover:text-heading'),
          ev(hasChildren, 'cursor-pointer'),
        )}
        onClick={handleOnClick}
      >
        {hasChildren && <ArrowButton />}
        <NodeIcon node={node} />
        <p>{node.name}</p>
      </TitleElement>
      {hasChildren && (
        <div className="ml-3 flex flex-col">
          {nodeChildren.map((child) => (
            <div key={child.id}>
              <SceneTreeEntry nodes={nodes} node={child} selectedNodeSetter={selectedNodeSetter} />
            </div>
          ))}
        </div>
      )}
    </NodeElement>
  );
}

// TODO: deselecting
export default function SceneTree({ environment }: { environment: Environment }) {
  const root = getRootNode(environment.nodes.value);
  const rootChildren = getNodesByID(environment.nodes.value, root.children);

  return (
    <EditorPanel title="Scene" minSize={100} defaultSize="15%">
      <div className="flex size-full flex-col overflow-auto p-2">
        {rootChildren.map((child) => {
          if (child.id !== ROOT_ID) {
            return (
              <SceneTreeEntry
                key={child.id}
                nodes={environment.nodes.value}
                node={child}
                selectedNodeSetter={environment.selected.setter}
              />
            );
          }
        })}
      </div>
    </EditorPanel>
  );
}
