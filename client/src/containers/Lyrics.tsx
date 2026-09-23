import type { HTMLAttributes, ReactNode } from 'react';

export const MarkdownComponents = {
  code({
    className,
    children,
    ...props
  }: HTMLAttributes<HTMLElement> & {
    inline?: boolean;
    children?: ReactNode;
  }) {
    const match = /language-(\w+)/.exec(className || '');
    const content = String(children ?? '').replace(/\n$/, '');

    return match ? (
      <pre className="overflow-x-auto rounded-md bg-(--ink) p-4 text-xs text-white">
        <code className={className} {...props}>
          {content}
        </code>
      </pre>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};
