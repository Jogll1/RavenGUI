import type { Environment } from '../lib/editor/editor.types';
import { NumericValueEditor } from './ValueEditor';

// TODO:
// - View should have an option to reset the resizable panels, reset panning, and reset zoom, change grid size etc.

export default function Header({ environment }: { environment: Environment }) {
  return (
    <header className="top-0 z-50 grid min-w-screen grid-cols-3">
      <nav className="bg-background text-muted col-start-1 flex items-center gap-8 px-4 py-2 text-sm">
        <div>File</div>
        <div>Edit</div>
        <div>View</div>
        <div>Help</div>
      </nav>
      <div className="col-start-2 flex w-full flex-row items-center justify-center gap-4">
        <nav className="bg-background text-muted flex items-center gap-1 px-4 py-2 text-sm">
          Target:
          <NumericValueEditor
            name="target-x-editor"
            integerOnly
            valueSetter={environment.xTargetResolution}
            className="max-w-12.5"
          />
          ×
          <NumericValueEditor
            name="target-y-editor"
            integerOnly
            valueSetter={environment.yTargetResolution}
            className="max-w-12.5"
          />
        </nav>
      </div>
    </header>
  );
}
