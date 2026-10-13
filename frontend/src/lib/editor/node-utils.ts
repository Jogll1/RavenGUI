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

export function createBaseNode(id?: ID, name?: string, parentID?: ID) {
  // TODO: put in state
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
