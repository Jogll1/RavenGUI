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
import { Shortcut } from '../lib/shortcuts.types';
import useHandleDeleteNode from '../lib/hooks/useHandleDeleteNode';

// TODO:
// - Multiple select (replace selected with an array and only show inspector when size == 1)

const rootNode: EditorNode = {
  id: ROOT_ID,
  name: 'Root',
  x: 0,
  y: 0,
  type: 'root',
  children: [],
};

export default function Home() {
  const { register, unregister } = useShortcuts();

  // Editor environment variables
  const [nodes, setNodes] = useState<EditorNodeRecord>({
    [ROOT_ID]: rootNode,
  });

  const [selected, setSelected] = useState<ID | null>(null);

  const [xTargetResolution, setXTargetResolution] = useState<number>(DEFAULT_TARGET_X);
  const [yTargetResolution, setYTargetResolution] = useState<number>(DEFAULT_TARGET_Y);

  // Create environment
  const environment: Environment = {
    nodes: stateToValueSetter(nodes, setNodes),
    selected: stateToValueSetter(selected, setSelected),

    xTargetResolution: stateToValueSetter(xTargetResolution, setXTargetResolution),
    yTargetResolution: stateToValueSetter(yTargetResolution, setYTargetResolution),
  };

  // Register Ctrl+A to create a new node
  const { handleCreateNode } = useHandleCreateNode(setNodes);
  const createNode = () => handleCreateNode();

  const newNodeShortcut: Shortcut = { key: 'a', modifiers: ['Ctrl'] };

  // Register Delete to delete a selected node
  const { handleDeleteNode } = useHandleDeleteNode(environment.nodes, setSelected);
  const deleteNode = () => selected && handleDeleteNode(selected);

  const deleteNodeShortcut: Shortcut = { key: 'delete' };

  // Register keybinds
  useEffect(() => {
    register(newNodeShortcut, createNode);
    register(deleteNodeShortcut, deleteNode);

    return () => {
      unregister(newNodeShortcut);
      unregister(deleteNodeShortcut);
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
