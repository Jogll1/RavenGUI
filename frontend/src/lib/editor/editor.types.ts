export interface Transform {
  x: number;
  y: number;
  scale: number;
}

export interface Environment {
  xTargetResolution: number;
  yTargetResolution: number;
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

export interface EditorState {
  rootNodeID: ID;
  selectedNodeID: ID | null;
  nodes: Record<ID, EditorNode>;
}
