import { getNodeByID } from '../lib/editor/editor.shared';
import { type Environment } from '../lib/editor/editor.types';
import EditorPanel from './EditorPanel';

export default function SceneTree({ environment }: { environment: Environment }) {
  const root = getNodeByID(environment.nodes.value, environment.root);

  return (
    <EditorPanel title="Scene" defaultSize="15%">
      <div className="p-2">{root && root.name}</div>
    </EditorPanel>
  );
}
