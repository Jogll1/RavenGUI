import type { Setter } from '../types';
import { ROOT_ID } from './editor.shared';
import type { EditorNode, EditorNodeRecord, ID } from './editor.types';

var nodeCounter: number = 0;

function getNextID(): ID {
  return `#node${nodeCounter}`;
}

export function getNodeByID(nodes: EditorNodeRecord, id: ID) {
  return nodes[id] ?? null;
}

export function getNodesByID(nodes: EditorNodeRecord, ids: ID[] | undefined) {
  return (ids ?? []).map((child) => getNodeByID(nodes, child));
}

export function getRootNode(nodes: EditorNodeRecord) {
  return getNodeByID(nodes, ROOT_ID);
}

/**
 * Returns whether id2 is a descendant of id1.
 */
export function isNodeDescendent(nodes: EditorNodeRecord, id1: ID, id2: ID) {
  const node1 = getNodeByID(nodes, id1);

  if (node1.children.length === 0) {
    return false;
  }

  for (const childID of node1.children) {
    if (childID === id2 || isNodeDescendent(nodes, childID, id2)) {
      return true;
    }
  }

  return false;
}

export function canParent(nodes: EditorNodeRecord, id: ID, newParent: ID) {
  return (
    // Parent is not the same node
    id !== newParent &&
    // Don't parent a node to its descendent
    !isNodeDescendent(nodes, id, newParent) &&
    // Parent is already the node's parent
    !getNodeByID(nodes, newParent).children.includes(id)
  );
}

export function createBaseNode(id?: ID, name?: string, parentID?: ID) {
  // TODO: put in state?
  nodeCounter++;

  const validNodeID: ID = id ?? getNextID();
  const validParentID: ID = parentID ?? ROOT_ID;

  const node: EditorNode = {
    id: validNodeID,
    name: name ?? 'Node',
    x: 0,
    y: 0,
    type: 'base',
    children: [],
  };

  return { node, validParentID };
}

export function updateNodePosition(setNodes: Setter<EditorNodeRecord>, id: string, newX: number, newY: number) {
  setNodes((prev) => {
    const updated = Object.entries(prev).map(([key, node]) => {
      return [
        key,
        key === id
          ? {
              ...node,
              x: newX,
              y: newY,
            }
          : node,
      ];
    });

    return Object.fromEntries(updated) as EditorNodeRecord;
  });
}
