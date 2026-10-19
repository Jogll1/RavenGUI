import type { BasicValueSetter, Environment } from '../lib/editor/editor.types';
import { getNodeByID, updateNodePosition } from '../lib/editor/node-utils';
import { NodeIcon } from './canvas/CanvasNode';
import EditorPanel from './EditorPanel';
import { NumericValueEditor } from './ValueEditor';

interface Item<T> {
  valueSetter: BasicValueSetter<T>;
  name: string;
}

function PairEditor({ item1, item2 }: { item1: Item<number>; item2: Item<number> }) {
  return (
    <div className="cols flex flex-col gap-1">
      <span className="flex flex-row items-center gap-2">
        <p className="w-4 flex-none">{item1.name}</p>
        <NumericValueEditor name={`${item1.name}-editor`} valueSetter={item1.valueSetter} unit="px" />
      </span>
      <span className="flex flex-row items-center gap-2">
        <p className="w-4 flex-none">{item2.name}</p>
        <NumericValueEditor name={`${item2.name}-editor`} valueSetter={item2.valueSetter} unit="px" />
      </span>
    </div>
  );
}

export default function Inspector({ environment }: { environment: Environment }) {
  const nodes = environment.nodes.value;
  const selected = environment.selected.value ? getNodeByID(nodes, environment.selected.value) : null;

  return (
    <EditorPanel title="Inspector" minSize={100} defaultSize="15%" collapsible>
      {selected && (
        <div className="flex size-full flex-col gap-2 overflow-auto p-2">
          <div className="border-surface flex flex-row items-center gap-1 border-b-4 pb-1">
            <NodeIcon node={selected} />
            <h1>{selected.name}</h1>
          </div>
          {/* Position */}
          <div className="grid w-full grid-cols-2">
            <p>Position</p>
            <PairEditor
              item1={{
                valueSetter: {
                  value: selected.x,
                  setter: (value: number) =>
                    updateNodePosition(environment.nodes.setter, selected.id, value, selected.y),
                },
                name: 'x',
              }}
              item2={{
                valueSetter: {
                  value: selected.y,
                  setter: (value: number) =>
                    updateNodePosition(environment.nodes.setter, selected.id, selected.x, value),
                },
                name: 'y',
              }}
            />
          </div>
        </div>
      )}
    </EditorPanel>
  );
}
