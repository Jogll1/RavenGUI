import { Group } from 'react-resizable-panels';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import { DEFAULT_TARGET_X, DEFAULT_TARGET_Y, ROOT_ID, stateToValueSetter } from '../lib/editor/editor.shared';
import Workspace from '../components/Workspace';
import type { EditorNodeRecord, EditorNode, Environment, ID } from '../lib/editor/editor.types';
import SceneTree from '../components/SceneTree';
import Inspector from '../components/Inspector';
import useHandleCreateNode from '../lib/hooks/useHandleCreateNode';
import useShortcuts from '../lib/hooks/useShortcuts';
import useHandleDeleteNode from '../lib/hooks/useHandleDeleteNode';
import KEYBINDS from '../lib/keybinds';

// TODO:
// - Multiple select (replace selected with an array and only show inspector when size == 1)

const rootNode: EditorNode = {
  id: ROOT_ID,
  name: 'Root',
  x: 0,
  y: 0,
  type: 'root',
  children: [],
  styles: {
    width: 0,
    height: 0,
    visible: false,
  },
};

export default function Home() {
  const { register, unregister } = useShortcuts();

  // Editor environment variables
  const [nodes, setNodes] = useState<EditorNodeRecord>({
    [ROOT_ID]: rootNode,
  });

  const selectedState = useState<ID | null>(null);
  const selected = stateToValueSetter(selectedState[0], selectedState[1]);

  const [xTargetResolution, setXTargetResolution] = useState<number>(DEFAULT_TARGET_X);
  const [yTargetResolution, setYTargetResolution] = useState<number>(DEFAULT_TARGET_Y);

  // Create environment
  const environment: Environment = {
    nodes: stateToValueSetter(nodes, setNodes),
    selected,

    xTargetResolution: stateToValueSetter(xTargetResolution, setXTargetResolution),
    yTargetResolution: stateToValueSetter(yTargetResolution, setYTargetResolution),
  };

  // Register Ctrl+A to create a new node
  const { handleCreateNode } = useHandleCreateNode(setNodes);
  const createNode = () =>
    handleCreateNode(undefined, undefined, undefined, { width: 128, height: 128, visible: true });

  // Register Delete to delete a selected node
  const { handleDeleteNode } = useHandleDeleteNode(environment.nodes, selected);
  const deleteNode = () => selected.value && handleDeleteNode(selected.value);

  // Register keybinds
  useEffect(() => {
    register(KEYBINDS.newNode, createNode);
    register(KEYBINDS.deleteNode, deleteNode);

    return () => {
      unregister(KEYBINDS.newNode);
      unregister(KEYBINDS.deleteNode);
    };
  });

  return (
    <main className="text-body bg-background font-default flex h-screen w-screen touch-none flex-col overflow-hidden overscroll-none font-medium">
      <Header environment={environment} />
      <Group className="mb-1 flex h-full min-w-screen flex-row">
        <SceneTree environment={environment} />
        <Workspace environment={environment} />
        <Inspector environment={environment} />
      </Group>
    </main>
  );
}
