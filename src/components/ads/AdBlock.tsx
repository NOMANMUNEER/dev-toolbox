"use html"
import React from 'react';

interface AdBlockProps {
  type: 'horizontal' | 'sidebar' | 'mobileSticky';
}

export default function AdBlock({ type }: AdBlockProps) {
  // Mapping your assets to the layout types
  const adAssets = {
    horizontal: '/ads1.png',   // Replace with your actual file path
    sidebar: '/ads2.png',      // Replace with your actual file path
    mobileSticky: '/ads3.png', // Replace with your actual file path
  };

  const styles = {
    horizontal:
      'w-full h-[90px] md:h-[250px] bg-muted/40 my-6 flex items-center justify-center border border-border rounded-lg overflow-hidden relative',
    sidebar:
      'w-[300px] h-[600px] bg-muted/40 hidden xl:flex items-center justify-center border border-border rounded-lg sticky top-6 overflow-hidden',
    mobileSticky:
      'fixed bottom-0 left-0 right-0 h-[60px] bg-muted/90 border-t border-border flex items-center justify-center z-50 md:hidden backdrop-blur-sm overflow-hidden',
  } as const;

  return (
    <div className={styles[type]} aria-hidden="true">
      {/* Actual Ad Image */}
      <img 
        src={adAssets[type]} 
        alt={`Promotional Ad - ${type}`}
        className="w-full h-full object-cover"
      />
      
      {/* Tiny Ad Badge (Required for most ad networks) */}
      <span className="absolute top-1 right-1 bg-black/50 text-[8px] text-white px-1 rounded uppercase tracking-tighter">
        Ad
      </span>
    </div>
  );
}