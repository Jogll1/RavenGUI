import type { BasicValueSetter } from '../lib/editor/editor.types';
import { cn } from '../lib/utils';

interface NumericInputProps {
  name: string;
  valueSetter: BasicValueSetter<number>;
  integerOnly?: boolean;
  unit?: string;
  className?: string;
}

export function NumericValueEditor({ name, valueSetter, integerOnly = false, unit, className }: NumericInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    let numberValue: number = Number(rawValue);

    if (integerOnly) {
      const integerValue = rawValue.replace(/[^0-9]/g, '').replace(/^0+/, '');

      numberValue = Number(integerValue);
    } else {
      // TODO
    }

    valueSetter.setter(numberValue);
  };

  return (
    <div
      className={cn(
        'bg-background-dark border-surface focus-within:border-primary-light flex flex-row items-center rounded-md border px-2 py-1 font-mono',
        className,
      )}
    >
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        name={name}
        value={valueSetter.value.toString()}
        // placeholder={defaultValue.toString()}
        className="placeholder:text-muted-dark text-muted block w-full border-0 focus:ring-0 focus:outline-none"
        onChange={handleChange}
      />
      <span className="text-surface-light select-none">{unit}</span>
    </div>
  );
}
