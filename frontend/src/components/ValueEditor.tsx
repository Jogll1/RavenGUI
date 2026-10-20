import type { BasicValueSetter } from '../lib/editor/editor.types';
import { cn } from '../lib/utils';

type InputType = number | string;

interface InputProps<T extends InputType> extends React.HTMLAttributes<HTMLInputElement> {
  name: string;
  valueSetter: BasicValueSetter<T>;
  unit?: string;
  className?: string;
  pattern?: string;
}

function GenericInput<T extends InputType>({ name, valueSetter, unit, className, pattern, ...rest }: InputProps<T>) {
  return (
    <div
      className={cn(
        'bg-background-dark border-surface focus-within:border-primary-light flex flex-row items-center rounded-md border px-2 py-1 font-mono',
        className,
      )}
    >
      <input
        type="text"
        name={name}
        pattern={pattern}
        value={valueSetter.value.toString()}
        className="placeholder:text-muted-dark text-muted block w-full border-0 focus:ring-0 focus:outline-none"
        {...rest}
      />
      <span className="text-surface-light select-none">{unit}</span>
    </div>
  );
}

interface NumericInputProps extends InputProps<number> {
  integerOnly?: boolean;
}

export function NumericValueEditor({ name, valueSetter, integerOnly = false, unit, ...rest }: NumericInputProps) {
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
    <GenericInput
      name={name}
      unit={unit}
      valueSetter={valueSetter}
      inputMode="numeric"
      pattern="[0-9]*"
      onChange={handleChange}
      {...rest}
    />
  );
}

export function StringValueEditor({ name, valueSetter, unit, ...rest }: InputProps<string>) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    valueSetter.setter(e.target.value);
  };

  return <GenericInput name={name} unit={unit} valueSetter={valueSetter} onChange={handleChange} {...rest} />;
}
