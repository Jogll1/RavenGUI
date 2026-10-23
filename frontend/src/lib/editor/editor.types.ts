import { Setter } from '../types';

export interface Transform {
  x: number;
  y: number;
  scale: number;
}

export interface ValueSetter<T> {
  readonly value: T;
  setter: Setter<T>;
}

export interface BasicValueSetter<T> {
  readonly value: T;
  setter: (value: T) => void;
}

// Could add a getter to this?
export type EditorNodeRecord = Record<ID, EditorNode>;

export interface Environment {
  nodes: ValueSetter<EditorNodeRecord>;
  selected: ValueSetter<ID | null>;

  xTargetResolution: ValueSetter<number>;
  yTargetResolution: ValueSetter<number>;
}

export type ID = `#${string}`;

export interface EditorNodeStyles {
  width: number;
  height: number;
  backgroundColor?: string;
  zIndex?: number;
  visible: boolean;
  opacity?: number;
}

export type EditorNodeType = 'root' | 'base';

export interface EditorNode {
  id: ID;
  x: number;
  y: number;
  name: string;
  type: EditorNodeType;
  children: ID[];
  styles: EditorNodeStyles;
}
