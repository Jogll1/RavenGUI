import { Group } from 'react-resizable-panels';
import Header from '../components/Header';
import EditorPanel from '../components/EditorPanel';
import { useState } from 'react';
import { DEFAULT_TARGET_X, DEFAULT_TARGET_Y } from '../lib/editor/editor.shared';
import Workspace from '../components/Workspace';
import { type Environment } from '../lib/editor/editor.types';

function SceneTree() {
  return <EditorPanel title="Scene" defaultSize="15%"></EditorPanel>;
}

function Inspector() {
  return <EditorPanel title="Inspector" defaultSize="15%"></EditorPanel>;
}

export default function Home() {
  // Canvas variables
  const [xTargetResolution, setXTargetResolution] = useState<number>(DEFAULT_TARGET_X);
  const [yTargetResolution, setYTargetResolution] = useState<number>(DEFAULT_TARGET_Y);

  const environment: Environment = {
    xTargetResolution,
    yTargetResolution,
  };

  return (
    <main className="text-body bg-background font-default flex h-screen w-screen touch-none flex-col overflow-hidden overscroll-none font-medium">
      <Header xAspectSetter={setXTargetResolution} yAspectSetter={setYTargetResolution} />
      <Group className="mb-1 flex h-full min-w-screen flex-row">
        <SceneTree />
        <Workspace environment={environment} />
        <Inspector />
      </Group>
    </main>
  );
}
