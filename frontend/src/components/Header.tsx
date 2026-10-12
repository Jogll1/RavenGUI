import { useState } from 'react';
import { DEFAULT_TARGET_X, DEFAULT_TARGET_Y } from '../lib/editor/editor.shared';

type AspectSetter = (v: number) => void;

interface AspectInputProps {
  name: string;
  defaultValue: number;
  aspectSetter: AspectSetter;
}

function AspectInput({ name, defaultValue, aspectSetter }: AspectInputProps) {
  const [value, setValue] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const integerValue = rawValue.replace(/[^0-9]/g, '').replace(/^0+/, '');

    setValue(integerValue);

    const numberValue = Number(integerValue);
    aspectSetter(numberValue === 0 ? defaultValue : numberValue);
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      name={name}
      value={value}
      placeholder={defaultValue.toString()}
      className="bg-background-dark border-surface focus:border-primary-light max-w-12.5 rounded-md border px-2 py-1 font-mono focus:ring-0 focus:outline-none"
      onChange={handleChange}
    />
  );
}

interface HeaderProps {
  xAspectSetter: AspectSetter;
  yAspectSetter: AspectSetter;
}

export default function Header({ xAspectSetter, yAspectSetter }: HeaderProps) {
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
          <AspectInput name="x-input" defaultValue={DEFAULT_TARGET_X} aspectSetter={xAspectSetter} />
          ×
          <AspectInput name="y-input" defaultValue={DEFAULT_TARGET_Y} aspectSetter={yAspectSetter} />
        </nav>
      </div>
    </header>
  );
}
