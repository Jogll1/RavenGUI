import { type CommonProps } from '../lib/common';
import { getNodeByID } from '../lib/editor/editor.shared';
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

// TODO: lines | under nodes with children
function SceneTreeEntry({ nodes, node }: { nodes: EditorNodeRecord; node: EditorNode }) {
  const nodeChildren = (node.children ?? []).map((child) => getNodeByID(nodes, child));
  const hasChildren = nodeChildren.length > 0;

  const NodeElement = hasChildren ? Details : 'div';
  const TitleElement = hasChildren ? 'summary' : 'p';

  return (
    <NodeElement>
      <TitleElement className="select-none">{node.name}</TitleElement>
      {hasChildren && (
        <div className="flex flex-col select-none">
          {nodeChildren.map((child, index) => (
            <div key={index} className="flex flex-row">
              <span className="ml-4">
                <SceneTreeEntry nodes={nodes} node={child} />
              </span>
            </div>
          ))}
        </div>
      )}
    </NodeElement>
  );
}

export default function SceneTree({ environment }: { environment: Environment }) {
  const root = getNodeByID(environment.nodes.value, environment.root);

  return (
    <EditorPanel title="Scene" defaultSize="15%">
      <div className="size-full overflow-auto p-2">
        <SceneTreeEntry nodes={environment.nodes.value} node={root} />
      </div>
    </EditorPanel>
  );
}
