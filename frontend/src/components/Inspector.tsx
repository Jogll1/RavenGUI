import type { BasicValueSetter, EditorNode, EditorNodeRecord, Environment } from '../lib/editor/editor.types';
import {
  getNodeByID,
  updateNodeBackgroundColour,
  updateNodeName,
  updateNodePosition,
  updateNodeSize,
} from '../lib/editor/node-utils';
import type { Setter } from '../lib/types';
import { NodeIcon } from './canvas/CanvasNode';
import EditorPanel from './EditorPanel';
import { HexValueEditor, NumericValueEditor, StringValueEditor } from './ValueEditor';

interface Item<T> {
  valueSetter: BasicValueSetter<T>;
  name: string;
}

function PairEditor({ item1, item2, min }: { item1: Item<number>; item2: Item<number>; min?: number }) {
  return (
    <div className="cols flex flex-col gap-1">
      <span className="flex flex-row items-center gap-2">
        <p className="w-3 flex-none">{item1.name}</p>
        <NumericValueEditor name={`${item1.name}-editor`} valueSetter={item1.valueSetter} min={min} unit="px" />
      </span>
      <span className="flex flex-row items-center gap-2">
        <p className="w-3 flex-none">{item2.name}</p>
        <NumericValueEditor name={`${item2.name}-editor`} valueSetter={item2.valueSetter} min={min} unit="px" />
      </span>
    </div>
  );
}

interface EditorProps {
  setNodes: Setter<EditorNodeRecord>;
  selected: EditorNode;
}

function NameEditor({ setNodes, selected }: EditorProps) {
  return (
    <>
      <NodeIcon node={selected} />
      <StringValueEditor
        name="name-editor"
        valueSetter={{
          value: selected.name,
          setter: (value: string) => updateNodeName(setNodes, selected.id, value),
        }}
      />
    </>
  );
}

function PositionEditor({ setNodes, selected }: EditorProps) {
  return (
    <>
      <p>Position</p>
      <PairEditor
        item1={{
          valueSetter: {
            value: selected.x,
            setter: (value: number) => updateNodePosition(setNodes, selected.id, value, selected.y),
          },
          name: 'x',
        }}
        item2={{
          valueSetter: {
            value: selected.y,
            setter: (value: number) => updateNodePosition(setNodes, selected.id, selected.x, value),
          },
          name: 'y',
        }}
      />
    </>
  );
}

function SizeEditor({ setNodes, selected }: EditorProps) {
  return (
    <>
      <p>Size</p>
      <PairEditor
        item1={{
          valueSetter: {
            value: selected.styles.width,
            setter: (value: number) => updateNodeSize(setNodes, selected.id, value, selected.styles.height),
          },
          name: 'w',
        }}
        item2={{
          valueSetter: {
            value: selected.styles.height,
            setter: (value: number) => updateNodeSize(setNodes, selected.id, selected.styles.width, value),
          },
          name: 'h',
        }}
        min={0}
      />
    </>
  );
}

function BgColourEditor({ setNodes, selected }: EditorProps) {
  return (
    <>
      <p>Colour</p>
      <HexValueEditor
        name="bg-colour-editor"
        valueSetter={{
          value: selected.styles.backgroundColor ?? '181921',
          setter: (value: string) => updateNodeBackgroundColour(setNodes, selected.id, value),
        }}
      />
    </>
  );
}

export default function Inspector({ environment }: { environment: Environment }) {
  const selected = environment.selected.value ? getNodeByID(environment.nodes.value, environment.selected.value) : null;

  return (
    <EditorPanel title="Inspector" minSize={200} defaultSize="15%" collapsible>
      {selected && (
        <div className="flex size-full flex-col gap-2 overflow-auto p-2">
          <div className="border-surface flex flex-row items-center gap-1 border-b-4 pb-1">
            <NameEditor setNodes={environment.nodes.setter} selected={selected} />
          </div>
          <div className="grid w-full grid-cols-2 gap-2">
            <PositionEditor setNodes={environment.nodes.setter} selected={selected} />
            <SizeEditor setNodes={environment.nodes.setter} selected={selected} />
            <BgColourEditor setNodes={environment.nodes.setter} selected={selected} />
          </div>
        </div>
      )}
    </EditorPanel>
  );
}
