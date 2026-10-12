import Canvas from '../components/canvas/Canvas';
import EditorPanel from './EditorPanel';

export default function Workspace() {
  return (
    <EditorPanel>
      <Canvas />
    </EditorPanel>
  );
}
