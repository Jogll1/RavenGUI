import type { Setter } from '../types';
import { ev } from '../utils';
import { ROOT_ID } from './editor.shared';
import type { EditorNode, EditorNodeRecord, EditorNodeStyles, EditorNodeType, ID } from './editor.types';

var nodeCounter: number = 0;

function getNodeID(nodeType: EditorNodeType): ID {
  return `#${nodeType}${nodeCounter}`;
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

export function createBaseNode(id?: ID, name?: string, parentID?: ID, styles?: EditorNodeStyles) {
  nodeCounter++;

  const validNodeID: ID = id ?? getNodeID('base');
  const validParentID: ID = parentID ?? ROOT_ID;

  const node: EditorNode = {
    id: validNodeID,
    name: name ?? `Node${ev(nodeCounter > 1, ' (' + nodeCounter + ')', '')}`,
    x: 0,
    y: 0,
    type: 'base',
    children: [],
    styles: styles ?? {
      width: 0,
      height: 0,
      backgroundColor: '#18192',
    },
  };

  return { node, validParentID };
}

function updateNodeAttributes(nodesSetter: Setter<EditorNodeRecord>, id: string, newAttributes: Partial<EditorNode>) {
  nodesSetter((prev) => {
    const updated = Object.entries(prev).map(([key, node]) => {
      return [
        key,
        key === id
          ? {
              ...node,
              ...newAttributes,
            }
          : node,
      ];
    });

    return Object.fromEntries(updated) as EditorNodeRecord;
  });
}

function updateNodeStyles(nodesSetter: Setter<EditorNodeRecord>, id: string, newStyles: Partial<EditorNodeStyles>) {
  nodesSetter((prev) => {
    const updated = Object.entries(prev).map(([key, node]) => {
      return [
        key,
        key === id
          ? {
              ...node,
              styles: { ...node.styles, ...newStyles },
            }
          : node,
      ];
    });

    return Object.fromEntries(updated) as EditorNodeRecord;
  });
}

export function updateNodePosition(nodesSetter: Setter<EditorNodeRecord>, id: string, newX: number, newY: number) {
  updateNodeAttributes(nodesSetter, id, { x: newX, y: newY });
}

export function updateNodeName(nodesSetter: Setter<EditorNodeRecord>, id: string, newName: string) {
  updateNodeAttributes(nodesSetter, id, { name: newName });
}

export function updateNodeSize(nodesSetter: Setter<EditorNodeRecord>, id: string, newW: number, newH: number) {
  updateNodeStyles(nodesSetter, id, { width: newW, height: newH });
}

export function updateNodeBackgroundColour(nodesSetter: Setter<EditorNodeRecord>, id: string, newBgColour: string) {
  updateNodeStyles(nodesSetter, id, { backgroundColor: newBgColour });
}
