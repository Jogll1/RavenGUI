import { ROOT_ID } from '../lib/editor/editor.shared';
import type { EditorNodeRecord, EditorNode, Environment, ID, ValueSetter } from '../lib/editor/editor.types';
import { cn, ev } from '../lib/utils';
import EditorPanel from './EditorPanel';
import { getNodeByID, getNodesByID, getRootNode } from '../lib/editor/node-utils';
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
  selectedNode: ValueSetter<ID | null>;
}

function SceneTreeEntry({ nodes, node, selectedNode }: SceneTreeEntryProps) {
  const selected = selectedNode !== null && selectedNode.value === node.id;

  const nodeChildren = getNodesByID(nodes, node.children);
  const hasChildren = nodeChildren.length > 0;

  const NodeElement = hasChildren ? Details : 'div';
  const TitleElement = hasChildren ? 'summary' : Title;

  const handleOnClick = () => {
    selectedNode.setter(node.id);
  };

  return (
    <NodeElement>
      <TitleElement
        className={cn(
          'flex list-none flex-row items-center gap-1 rounded-md px-2 select-none',
          ev(selected, 'bg-primary-light text-heading', 'hover:bg-primary-dark hover:text-heading'),
          ev(hasChildren, 'cursor-pointer'),
        )}
        onClick={(e) => {
          e.stopPropagation();
          handleOnClick();
        }}
      >
        {hasChildren && <ArrowButton />}
        <NodeIcon node={node} />
        <p>{node.name}</p>
      </TitleElement>
      {hasChildren && (
        <div className="ml-3 flex flex-col">
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

// TODO: deselecting
export default function SceneTree({ environment }: { environment: Environment }) {
  const root = getRootNode(environment.nodes.value);
  const rootChildren = getNodesByID(environment.nodes.value, root.children);

  const handleOnClick = () => {
    environment.selected.setter(null);
  };

  return (
    <EditorPanel title="Scene" minSize={100} defaultSize="15%">
      <div className="flex size-full flex-col overflow-auto p-2" onClick={handleOnClick}>
        {rootChildren.map((child) => {
          if (child.id !== ROOT_ID) {
            return (
              <SceneTreeEntry
                key={child.id}
                nodes={environment.nodes.value}
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
