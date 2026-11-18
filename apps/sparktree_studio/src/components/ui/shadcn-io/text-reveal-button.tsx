"use client";
import React from 'react';
import { cn } from '@/lib/utils';

export interface TextRevealButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  revealColor?: string;
  strokeColor?: string;
  forceReveal?: boolean;
}

export const TextRevealButton = React.forwardRef<HTMLButtonElement, TextRevealButtonProps>(
  (
    {
      text = 'shadcn.io',
      revealColor = '#111827',
      strokeColor = 'rgb(160, 14, 14)',
      forceReveal = false,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const isForced = forceReveal || (('data-force-reveal' in (props as any)) && (props as any)['data-force-reveal'] !== false);
    return (
      <button
        ref={ref}
        className={cn(
          'group relative inline-flex items-center align-middle cursor-pointer bg-transparent border-none p-0 m-0 h-auto leading-none',
          className,
        )}
        style={{
          WebkitTextStroke: '0px transparent',
          ...style,
        }}
        {...props}
      >
        <span className="relative z-10 block whitespace-nowrap">{text}</span>
        <span
          aria-hidden="true"
          className={`absolute inset-y-0 left-0 overflow-hidden transition-all duration-500 ease-out pointer-events-none ${isForced ? 'w-full' : 'w-0'} group-hover:w-full`}
          style={{
            color: revealColor,
            filter: 'drop-shadow(0 0 0 rgb(30, 71, 124), 0)) drop-shadow(0 0 23px currentColor)',
          }}
        >
          <span className="block whitespace-nowrap relative">
            {text}
            <span
              className={`absolute top-1/2 -translate-y-1/2 right-[-12px] w-[4px] rounded-full ${isForced ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100`}
              style={{ height: '1.2em', background: revealColor, boxShadow: `0 0 18px ${revealColor}` }}
            />
          </span>
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-[-12px] top-1/2 -translate-y-1/2 w-[4px] rounded-full opacity-100 group-hover:opacity-0"
          style={{ height: '1.2em', background: revealColor, boxShadow: `0 0 18px ${revealColor}` }}
        />
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 rounded-md transition-opacity duration-500 ease-out ${isForced ? 'opacity-40' : 'opacity-0'} group-hover:opacity-40`}
          style={{ background: revealColor, filter: 'blur(18px)' }}
        />
      </button>
    );
  },
);

TextRevealButton.displayName = 'TextRevealButton';

export default TextRevealButton;


