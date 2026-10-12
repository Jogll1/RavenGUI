import { type EditorNodeRecord, type ID, type ValueSetter } from './editor.types';

export const DEFAULT_TARGET_X = 1920;
export const DEFAULT_TARGET_Y = 1080;

export function stateToValueSetter<T>(value: T, setter: React.Dispatch<React.SetStateAction<T>>): ValueSetter<T> {
  return {
    value,
    setter,
  };
}

export function getNodeByID(record: EditorNodeRecord, id: ID) {
  return record[id] ?? null;
}
