import { Panel } from 'react-resizable-panels';
import { cn } from '../lib/utils';

export interface EditorPanelProps extends React.ComponentProps<typeof Panel> {
  title?: string;
  contentClassName?: string;
}

export default function EditorPanel({ className, children, title, contentClassName, ...rest }: EditorPanelProps) {
  return (
    <Panel
      className={cn(
        'bg-surface-dark border-background flex h-full flex-col rounded-md border-r-3 border-b-3 border-l-3',
        className,
      )}
      {...rest}
    >
      {title && <h1 className="text-muted px-3 pt-2 pb-1 text-sm font-bold">{title}</h1>}
      <div className={cn('bg-background m-1 h-full', contentClassName)}>{children}</div>
    </Panel>
  );
}
