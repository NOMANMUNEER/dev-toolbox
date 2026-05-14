import React from 'react';

interface AdBlockProps {
  type: 'horizontal' | 'sidebar' | 'mobileSticky';
}

export default function AdBlock({ type }: AdBlockProps) {
  const styles = {
    horizontal:
      'w-full min-h-[90px] md:min-h-[250px] bg-muted/40 my-6 flex items-center justify-center border border-dashed border-border rounded-lg',
    sidebar:
      'w-[300px] min-h-[600px] bg-muted/40 hidden xl:flex items-center justify-center border border-dashed border-border rounded-lg sticky top-6',
    mobileSticky:
      'fixed bottom-0 left-0 right-0 h-[60px] bg-muted/90 border-t border-border flex items-center justify-center z-50 md:hidden backdrop-blur-sm',
  } as const;

  return (
    <div className={styles[type]} aria-hidden="true">
      <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
        Advertisement ({type})
      </span>
    </div>
  );
}
