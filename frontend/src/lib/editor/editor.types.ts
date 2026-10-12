export interface Transform {
  x: number;
  y: number;
  scale: number;
}

export interface ValueSetter<T> {
  value: T;
  setter: React.Dispatch<React.SetStateAction<T>>;
}

// Could add a getter to this?
export type EditorNodeRecord = Record<ID, EditorNode>;

export interface Environment {
  nodes: ValueSetter<EditorNodeRecord>;
  root: ID;
  selected: ValueSetter<ID | null>;

  xTargetResolution: ValueSetter<number>;
  yTargetResolution: ValueSetter<number>;
}

export type ID = string;

export interface EditorNodeStyles {
  width: string;
  height: string;
  backgroundColor?: string;
}

export interface EditorNode {
  id: ID;
  x: number;
  y: number;
  name: string;
  children?: ID[];
  styles?: EditorNodeStyles;
}
