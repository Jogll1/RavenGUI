import { Group } from 'react-resizable-panels';
import Header from '../components/Header';
import EditorPanel from '../components/EditorPanel';
import { useState } from 'react';
import { DEFAULT_TARGET_X, DEFAULT_TARGET_Y } from '../lib/editor/editor.shared';
import Workspace from '../components/Workspace';

function SceneTree() {
  return <EditorPanel title="Scene" defaultSize="20%"></EditorPanel>;
}

function Inspector() {
  return <EditorPanel title="Inspector" defaultSize="20%"></EditorPanel>;
}

export default function Home() {
  // Canvas variables
  const [_xTargetResolution, setXTargetResolution] = useState<number>(DEFAULT_TARGET_X);
  const [_yTargetResolution, setYTargetResolution] = useState<number>(DEFAULT_TARGET_Y);

  return (
    <main className="text-body bg-background font-default flex h-screen w-screen touch-none flex-col overflow-hidden overscroll-none font-medium">
      <Header xAspectSetter={setXTargetResolution} yAspectSetter={setYTargetResolution} />
      <Group className="mb-1 flex h-full min-w-screen flex-row">
        <SceneTree />
        <Workspace />
        <Inspector />
      </Group>
    </main>
  );
}
