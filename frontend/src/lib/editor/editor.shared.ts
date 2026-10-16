import type { EditorNode, ID, ValueSetter } from './editor.types';

export const DEFAULT_TARGET_X = 1920;
export const DEFAULT_TARGET_Y = 1080;

export const ROOT_ID: ID = '#root';

export function stateToValueSetter<T>(value: T, setter: React.Dispatch<React.SetStateAction<T>>): ValueSetter<T> {
  return {
    value,
    setter,
  };
}

export function isEditorNode(value: unknown): value is EditorNode {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  if (!('id' in value) || typeof value.id !== 'string') {
    return false;
  }

  return value.id.startsWith('#');
}
