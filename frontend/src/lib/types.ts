export type Setter<T> = React.Dispatch<React.SetStateAction<T>>;
export type BasicSetter<T> = (value: T) => void;

export interface CommonProps {
  className?: string;
  children?: React.ReactNode;
}
