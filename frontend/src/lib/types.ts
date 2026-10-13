export type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

export interface CommonProps {
  className?: string;
  children?: React.ReactNode;
}
