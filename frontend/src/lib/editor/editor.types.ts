export interface Coordinates {
  x: number;
  y: number;
}

export type ID = string;

export interface EditorNodeStyles {
  width: string;
  height: string;
  backgroundColor?: string;
}

export interface EditorNode {
  id: ID;
  coordinates: Coordinates;
  name: string;
  children: ID[];
  styles: EditorNodeStyles;
}

export interface EditorState {
  rootNodeID: ID;
  selectedNodeID: ID | null;
  nodes: Record<ID, EditorNode>;
}
