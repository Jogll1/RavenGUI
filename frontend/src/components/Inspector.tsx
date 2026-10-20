import type { BasicValueSetter, EditorNode, EditorNodeRecord, Environment } from '../lib/editor/editor.types';
import { getNodeByID, updateNodeName, updateNodePosition } from '../lib/editor/node-utils';
import type { Setter } from '../lib/types';
import { NodeIcon } from './canvas/CanvasNode';
import EditorPanel from './EditorPanel';
import { NumericValueEditor, StringValueEditor } from './ValueEditor';

interface Item<T> {
  valueSetter: BasicValueSetter<T>;
  name: string;
}

function PairEditor({ item1, item2 }: { item1: Item<number>; item2: Item<number> }) {
  return (
    <div className="cols flex flex-col gap-1">
      <span className="flex flex-row items-center gap-2">
        <p className="w-3 flex-none">{item1.name}</p>
        <NumericValueEditor name={`${item1.name}-editor`} valueSetter={item1.valueSetter} integerOnly unit="px" />
      </span>
      <span className="flex flex-row items-center gap-2">
        <p className="w-3 flex-none">{item2.name}</p>
        <NumericValueEditor name={`${item2.name}-editor`} valueSetter={item2.valueSetter} integerOnly unit="px" />
      </span>
    </div>
  );
}

interface EditorProps {
  nodesSetter: Setter<EditorNodeRecord>;
  selected: EditorNode;
}

function NameEditor({ nodesSetter, selected }: EditorProps) {
  return (
    <>
      <NodeIcon node={selected} />
      <StringValueEditor
        name="name-editor"
        valueSetter={{
          value: selected.name,
          setter: (value: string) => updateNodeName(nodesSetter, selected.id, value),
        }}
      />
    </>
  );
}

function PositionEditor({ nodesSetter, selected }: EditorProps) {
  return (
    <>
      <p>Position</p>
      <PairEditor
        item1={{
          valueSetter: {
            value: selected.x,
            setter: (value: number) => updateNodePosition(nodesSetter, selected.id, value, selected.y),
          },
          name: 'x',
        }}
        item2={{
          valueSetter: {
            value: selected.y,
            setter: (value: number) => updateNodePosition(nodesSetter, selected.id, selected.x, value),
          },
          name: 'y',
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
            <NameEditor nodesSetter={environment.nodes.setter} selected={selected} />
          </div>
          <div className="grid w-full grid-cols-2">
            <PositionEditor nodesSetter={environment.nodes.setter} selected={selected} />
          </div>
        </div>
      )}
    </EditorPanel>
  );
}
