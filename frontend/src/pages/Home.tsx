import { Group } from 'react-resizable-panels';
import Header from '../components/Header';
import EditorPanel from '../components/EditorPanel';
import Canvas from '../components/editor/Canvas';

function SceneTree() {
  return <EditorPanel title="Scene" defaultSize="15%"></EditorPanel>;
}

function Workspace() {
  return (
    <EditorPanel>
      <Canvas />
    </EditorPanel>
  );
}

function Inspector() {
  return <EditorPanel title="Inspector" defaultSize="15%"></EditorPanel>;
}

export default function Home() {
  return (
    <main className="text-body bg-background font-default flex h-screen w-screen touch-none flex-col overflow-hidden overscroll-none font-medium">
      <Header />
      <Group className="mb-1 flex h-full min-w-screen flex-row">
        <SceneTree />
        <Workspace />
        <Inspector />
      </Group>
    </main>
  );
}
