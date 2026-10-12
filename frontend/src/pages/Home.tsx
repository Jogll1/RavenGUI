import { Group } from 'react-resizable-panels';
import Header from '../components/Header';
import { useState } from 'react';
import { DEFAULT_TARGET_X, DEFAULT_TARGET_Y, stateToValueSetter } from '../lib/editor/editor.shared';
import Workspace from '../components/Workspace';
import { type EditorNodeRecord, type EditorNode, type Environment, type ID } from '../lib/editor/editor.types';
import SceneTree from '../components/SceneTree';
import Inspector from '../components/Inspector';

// TODO: I think root node should be implicit (i.e. not visible or editable)
const rootNode: EditorNode = {
  id: '#root',
  name: 'Root',
  x: 0,
  y: 0,
  children: ['#box1', '#box2'],
};

export default function Home() {
  // Editor environment variables
  const [nodes, setNodes] = useState<EditorNodeRecord>({
    '#root': rootNode,
    '#box1': {
      id: '#box1',
      name: 'Box 1',
      x: 100,
      y: 100,
      children: ['#box3'],
    },
    '#box2': {
      id: '#box2',
      name: 'Box 2',
      x: 200,
      y: 200,
    },
    '#box3': {
      id: '#box3',
      name: 'Box 3',
      x: 300,
      y: 300,
    },
  });

  const [selected, setSelected] = useState<ID | null>(null);

  const [xTargetResolution, setXTargetResolution] = useState<number>(DEFAULT_TARGET_X);
  const [yTargetResolution, setYTargetResolution] = useState<number>(DEFAULT_TARGET_Y);

  // Create environment
  const environment: Environment = {
    nodes: stateToValueSetter(nodes, setNodes),
    root: rootNode.id,
    selected: stateToValueSetter(selected, setSelected),

    xTargetResolution: stateToValueSetter(xTargetResolution, setXTargetResolution),
    yTargetResolution: stateToValueSetter(yTargetResolution, setYTargetResolution),
  };

  return (
    <main className="text-body bg-background font-default flex h-screen w-screen touch-none flex-col overflow-hidden overscroll-none font-medium">
      <Header environment={environment} />
      <Group className="mb-1 flex h-full min-w-screen flex-row">
        <SceneTree environment={environment} />
        <Workspace environment={environment} />
        <Inspector />
      </Group>
    </main>
  );
}
