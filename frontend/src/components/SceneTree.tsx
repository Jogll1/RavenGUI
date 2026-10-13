import { FaRegCircle } from 'react-icons/fa6';
import { ROOT_ID } from '../lib/editor/editor.shared';
import type { EditorNodeRecord, EditorNode, Environment } from '../lib/editor/editor.types';
import { cn, ev } from '../lib/utils';
import EditorPanel from './EditorPanel';
import type { CommonProps } from '../lib/types';
import { getNodesByID, getRootNode } from '../lib/editor/node-utils';

function Details({ children, className }: CommonProps) {
  return (
    <details open className={cn(className, 'text-nowrap')}>
      {children}
    </details>
  );
}

function Title({ children, className }: CommonProps) {
  return <div className={cn('ml-5', className)}>{children}</div>;
}

function ArrowButton() {
  return (
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
  );
}

function NodeIcon({ node }: { node: EditorNode }) {
  switch (node.type) {
    case 'base':
      return <FaRegCircle size={12} />;
  }
}

// TODO: lines | under nodes with children
function SceneTreeEntry({ nodes, node }: { nodes: EditorNodeRecord; node: EditorNode }) {
  const nodeChildren = getNodesByID(nodes, node.children);
  const hasChildren = nodeChildren.length > 0;

  const NodeElement = hasChildren ? Details : 'div';
  const TitleElement = hasChildren ? 'summary' : Title;

  return (
    <NodeElement>
      <TitleElement
        className={cn('flex list-none flex-row items-center gap-1 select-none', ev(hasChildren, 'cursor-pointer'))}
      >
        {hasChildren && <ArrowButton />}
        <NodeIcon node={node} />
        <p>{node.name}</p>
      </TitleElement>
      {hasChildren && (
        <div className="ml-5 flex flex-col select-none">
          {nodeChildren.map((child) => (
            <div key={child.id} className="">
              <SceneTreeEntry nodes={nodes} node={child} />
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

  return (
    <EditorPanel title="Scene" defaultSize="15%">
      <div className="flex size-full flex-col overflow-auto p-2">
        {rootChildren.map((child) => {
          if (child.id !== ROOT_ID) {
            return <SceneTreeEntry key={child.id} nodes={environment.nodes.value} node={child} />;
          }
        })}
      </div>
    </EditorPanel>
  );
}
