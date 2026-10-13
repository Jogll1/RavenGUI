import { Panel } from 'react-resizable-panels';
import { cn } from '../lib/utils';
import { type ElementType } from 'react';

export interface EditorPanelProps extends React.ComponentProps<typeof Panel> {
  title?: string;
  contentClassName?: string;
  Toolbar?: ElementType;
}

export default function EditorPanel({
  className,
  children,
  title,
  contentClassName,
  Toolbar,
  ...rest
}: EditorPanelProps) {
  return (
    <Panel
      className={cn(
        'bg-surface-dark border-background z-10 flex h-full flex-col rounded-md border-r-3 border-b-3 border-l-3',
        className,
      )}
      {...rest}
    >
      {title && <h1 className="text-muted px-3 pt-2 pb-1 text-sm font-bold">{title}</h1>}
      {Toolbar && <Toolbar />}
      <div className={cn('bg-background m-1 h-full overflow-clip', contentClassName)}>{children}</div>
    </Panel>
  );
}
