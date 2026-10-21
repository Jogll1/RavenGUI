import { useRef, useState, useEffect } from 'react';
import type { BasicValueSetter } from '../lib/editor/editor.types';
import { cn } from '../lib/utils';

type InputType = number | string;

interface InputProps<T extends InputType> extends React.HTMLAttributes<HTMLInputElement> {
  name: string;
  valueSetter: BasicValueSetter<T>;
  unit?: string;
  className?: string;
  pattern?: string;
  type?: string;
  value?: string; // value override
  unitOnLeft?: boolean;
}

function GenericInput<T extends InputType>({
  name,
  valueSetter,
  unit,
  className,
  type,
  value,
  unitOnLeft = false,
  ...rest
}: InputProps<T>) {
  return (
    <div
      className={cn(
        'bg-background-dark border-surface focus-within:border-primary-light flex flex-row items-center gap-0.5 rounded-md border px-2 py-1 font-mono',
        className,
      )}
    >
      {unitOnLeft && <span className="text-surface-light select-none">{unit}</span>}
      <input
        name={name}
        type={type ?? 'text'}
        value={value ?? String(valueSetter.value)}
        className="placeholder:text-muted-dark text-muted block w-full border-0 focus:ring-0 focus:outline-none"
        {...rest}
      />
      {!unitOnLeft && <span className="text-surface-light select-none">{unit}</span>}
    </div>
  );
}

interface NumericInputProps extends InputProps<number> {
  min?: number;
  max?: number;
}

export function NumericValueEditor({ name, valueSetter, unit, min, max, ...rest }: NumericInputProps) {
  const [inputValue, setInputValue] = useState<string>(valueSetter.value.toString());
  const lastSyncValue = useRef<number>(valueSetter.value);

  // Sync
  useEffect(() => {
    if (valueSetter.value !== lastSyncValue.current) {
      setInputValue(String(valueSetter.value));
      lastSyncValue.current = valueSetter.value;
    }
  }, [valueSetter.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    let testValue;

    if (min !== undefined && min >= 0) {
      testValue = rawValue.replace(/[^\d]/g, '').replace(/^0+(?=\d)/, '');
    } else {
      testValue = rawValue
        .replace(/[^-0-9]/g, '')
        .replace(/(?<=.)-/g, '')
        .replace(/^(-)?0+(?=\d)/, '$1');
    }

    setInputValue(testValue);

    if (testValue === '' || testValue === '-') {
      return;
    }

    let numValue = Number(testValue);

    if (max !== undefined && numValue > max) {
      numValue = max;
      setInputValue(String(max));
    }

    if (min !== undefined && numValue < min) {
      numValue = min;
      setInputValue(String(max));
    }

    lastSyncValue.current = numValue;
    valueSetter.setter(numValue);
  };

  const handleBlur = () => {
    if (inputValue === '' || inputValue === '-') {
      setInputValue(String(0));
      lastSyncValue.current = 0;
      valueSetter.setter(0);
    } else {
      setInputValue(String(valueSetter.value));
    }
  };

  return (
    <GenericInput<number>
      name={name}
      unit={unit}
      valueSetter={valueSetter}
      value={inputValue}
      inputMode="numeric"
      onChange={handleChange}
      onBlur={handleBlur}
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

export function HexValueEditor({ name, valueSetter, ...rest }: InputProps<string>) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    valueSetter.setter(e.target.value);
  };

  return <GenericInput name={name} unit="#" valueSetter={valueSetter} onChange={handleChange} unitOnLeft {...rest} />;
}
