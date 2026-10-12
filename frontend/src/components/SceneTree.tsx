import { type CommonProps } from '../lib/common';
import { getNodesByID } from '../lib/editor/editor.shared';
import { type EditorNodeRecord, type EditorNode, type Environment } from '../lib/editor/editor.types';
import { cn } from '../lib/utils';
import EditorPanel from './EditorPanel';

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

// TODO: lines | under nodes with children
function SceneTreeEntry({ nodes, node }: { nodes: EditorNodeRecord; node: EditorNode }) {
  const nodeChildren = getNodesByID(nodes, node.children);
  const hasChildren = nodeChildren.length > 0;

  const NodeElement = hasChildren ? Details : 'div';
  const TitleElement = hasChildren ? 'summary' : Title;

  return (
    <NodeElement>
      <TitleElement className="flex cursor-pointer list-none flex-row items-center gap-1 select-none">
        {hasChildren && <ArrowButton />}
        <p>{node.name}</p>
      </TitleElement>
      {hasChildren && (
        <div className="ml-5 flex flex-col select-none">
          {nodeChildren.map((child, index) => (
            <div key={index} className="">
              <SceneTreeEntry nodes={nodes} node={child} />
            </div>
          ))}
        </div>
      )}
    </NodeElement>
  );
}

export default function SceneTree({ environment }: { environment: Environment }) {
  const rootChildren = getNodesByID(environment.nodes.value, environment.root.children);

  return (
    <EditorPanel title="Scene" defaultSize="15%">
      <div className="flex size-full flex-col overflow-auto p-2">
        {rootChildren.map((child, index) => (
          <SceneTreeEntry key={index} nodes={environment.nodes.value} node={child} />
        ))}
      </div>
    </EditorPanel>
  );
}
