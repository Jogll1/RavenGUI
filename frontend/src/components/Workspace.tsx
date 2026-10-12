import Canvas from '../components/canvas/Canvas';
import { type Environment } from '../lib/editor/editor.types';
import EditorPanel from './EditorPanel';

export default function Workspace({ environment }: { environment: Environment }) {
  return (
    <EditorPanel>
      <Canvas environment={environment} />
    </EditorPanel>
  );
}
