import { Transform } from '../../lib/editor/editor.types';

export default function CanvasInfoBar({ transform }: { transform: Transform }) {
  return (
    <div className="border-surface bg-surface/50 absolute z-50 m-4 rounded-md border px-4 py-2 font-mono text-xs shadow-md backdrop-blur">
      X: {-Math.round(transform.x)}, Y: {-Math.round(transform.y)}, Zoom: {Math.round(transform.scale * 100)}%
    </div>
  );
}
