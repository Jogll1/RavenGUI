import { type EditorNodeRecord, type ID, type ValueSetter } from './editor.types';

export const DEFAULT_TARGET_X = 1920;
export const DEFAULT_TARGET_Y = 1080;

export function stateToValueSetter<T>(value: T, setter: React.Dispatch<React.SetStateAction<T>>): ValueSetter<T> {
  return {
    value,
    setter,
  };
}

export function getNodeByID(nodes: EditorNodeRecord, id: ID) {
  return nodes[id] ?? null;
}

export function getNodesByID(nodes: EditorNodeRecord, ids: ID[] | undefined) {
  return (ids ?? []).map((child) => getNodeByID(nodes, child));
}
