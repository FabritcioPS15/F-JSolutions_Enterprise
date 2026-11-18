'use client';

import { useEffect, useRef, useState } from 'react';

interface SmoothCursorProps {
  visibilityRootSelector?: string; // CSS selector to limit visibility area
  primaryColor?: string; // Dot color
  ringColor?: string; // Trail ring color
  zIndexClass?: string;
  enableTap?: boolean; // show on touch
}

export default function SmoothCursor({
  visibilityRootSelector = 'body',
  primaryColor = '#111827',
  ringColor = 'rgba(107, 114, 128, 0.18)',
  zIndexClass = 'z-[100000]',
  enableTap = true,
}: SmoothCursorProps) {
  const dotRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState<'default' | 'link' | 'text'>('default');
  const [isClicking, setIsClicking] = useState(false);
  const targetPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const currentPos = useRef({ x: targetPos.current.x, y: targetPos.current.y });
  const rafRef = useRef<number | null>(null);
  const lastTrailRef = useRef<number>(0);

  useEffect(() => {
    const root = document.querySelector(visibilityRootSelector) as HTMLElement | null;
    if (!root) return;

    const show = () => setVisible(true);
    const hide = () => setVisible(false);
    const onMove = (x: number, y: number) => {
      targetPos.current.x = x;
      targetPos.current.y = y;
      const now = performance.now();
      // denser trail (lower interval)
      if (now - (lastTrailRef.current || 0) > 7) {
        lastTrailRef.current = now;
        const trail = document.createElement('div');
        trail.style.position = 'fixed';
        trail.style.left = `${x}px`;
        trail.style.top = `${y}px`;
        trail.style.width = '11px';
        trail.style.height = '11px';
        trail.style.borderRadius = '9999px';
        trail.style.pointerEvents = 'none';
        // Delicate black trail
        trail.style.background = 'radial-gradient(circle at 50% 50%, #000000 0%, #000000 60%, rgba(0,0,0,0) 70%)';
        trail.style.boxShadow = '0 0 0 6px rgba(0,0,0,0.12)';
        trail.style.zIndex = '100001';
        trail.style.willChange = 'transform, opacity, box-shadow';
        trail.style.transform = 'translate(-50%, -50%) scale(1)';
        trail.style.opacity = '0.85';
        trail.style.transition = 'opacity 950ms ease, transform 980ms ease, box-shadow 980ms ease';
        document.body.appendChild(trail);
        requestAnimationFrame(() => {
          trail.style.opacity = '0';
          trail.style.transform = 'translate(-50%, -50%) scale(0.35)';
          trail.style.boxShadow = '0 0 0 0px rgba(0,0,0,0)';
        });
        setTimeout(() => {
          trail.remove();
        }, 1100);
      }
    };

    const handleMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (!enableTap) return;
      const t = e.touches[0];
      if (t) onMove(t.clientX, t.clientY);
    };
    const handleTouchStart = (e: TouchEvent) => {
      if (!enableTap) return;
      const t = e.touches[0];
      if (t) onMove(t.clientX, t.clientY);
      show();
    };

    // hover variant detection
    const linkSelector = 'a, button, [role="button"], .cursor-pointer, [data-cursor="link"]';
    const editableSelector = 'input:not([type=button]):not([type=submit]):not([type=checkbox]):not([type=radio]), textarea, [contenteditable=""], [contenteditable="true"]';

    const onOverOut = (e: Event) => {
      const target = e.target as Element | null;
      if (!target) return;
      if (target.closest(editableSelector)) {
        setVariant('text');
      } else if (target.closest(linkSelector)) {
        setVariant('link');
      } else {
        setVariant('default');
      }
    };

    const onFocusIn = (e: Event) => {
      const target = e.target as Element | null;
      if (!target) return;
      if (target.matches(editableSelector)) setVariant('text');
    };
    const onFocusOut = () => {
      setVariant('default');
    };

    const onMouseDown = () => {
      // click ripple at current position
      const x = currentPos.current.x;
      const y = currentPos.current.y;
      const ripple = document.createElement('div');
      ripple.style.position = 'fixed';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.width = '18px';
      ripple.style.height = '18px';
      ripple.style.borderRadius = '9999px';
      ripple.style.pointerEvents = 'none';
      ripple.style.border = `2px solid ${primaryColor}`;
      ripple.style.transform = 'translate(-50%, -50%) scale(0.6)';
      ripple.style.opacity = '0.8';
      ripple.style.transition = 'opacity 360ms ease, transform 360ms ease';
      document.body.appendChild(ripple);
      requestAnimationFrame(() => {
        ripple.style.opacity = '0';
        ripple.style.transform = 'translate(-50%, -50%) scale(1.4)';
      });
      setTimeout(() => ripple.remove(), 420);

      // temporarily invert dot style with pulse
      setIsClicking(true);
      window.setTimeout(() => setIsClicking(false), 300);
    };

    root.addEventListener('mouseenter', show);
    root.addEventListener('mouseleave', hide);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    if (enableTap) {
      root.addEventListener('touchstart', handleTouchStart, { passive: true });
      root.addEventListener('touchmove', handleTouchMove, { passive: true });
      root.addEventListener('touchend', hide, { passive: true });
    }
    root.addEventListener('mouseover', onOverOut, true);
    root.addEventListener('mouseout', onOverOut, true);
    root.addEventListener('focusin', onFocusIn, true);
    root.addEventListener('focusout', onFocusOut, true);
    document.addEventListener('mousedown', onMouseDown, true);

    // Handle native select dropdowns: show native cursor while open
    const onSelectMouseDown = (e: Event) => {
      const target = e.target as Element | null;
      if (target && target instanceof HTMLSelectElement) {
        document.documentElement.classList.add('show-native-cursor');
      }
    };
    const onSelectBlur = (e: Event) => {
      const target = e.target as Element | null;
      if (target && target instanceof HTMLSelectElement) {
        document.documentElement.classList.remove('show-native-cursor');
      }
    };
    const onWindowClick = () => {
      // best-effort: remove when dropdown likely closed
      document.documentElement.classList.remove('show-native-cursor');
    };
    document.addEventListener('mousedown', onSelectMouseDown, true);
    document.addEventListener('blur', onSelectBlur, true);
    window.addEventListener('click', onWindowClick, true);

    // RAF loop for smoothing (lerp)
    const tick = () => {
      const dot = dotRef.current;
      if (dot) {
        const lerp = 0.2; // smoothing factor
        currentPos.current.x += (targetPos.current.x - currentPos.current.x) * lerp;
        currentPos.current.y += (targetPos.current.y - currentPos.current.y) * lerp;
        dot.style.left = `${currentPos.current.x}px`;
        dot.style.top = `${currentPos.current.y}px`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      root.removeEventListener('mouseenter', show);
      root.removeEventListener('mouseleave', hide);
      window.removeEventListener('mousemove', handleMouseMove as EventListener);
      if (enableTap) {
        root.removeEventListener('touchstart', handleTouchStart as EventListener);
        root.removeEventListener('touchmove', handleTouchMove as EventListener);
        root.removeEventListener('touchend', hide as EventListener);
      }
      root.removeEventListener('mouseover', onOverOut as EventListener, true);
      root.removeEventListener('mouseout', onOverOut as EventListener, true);
      root.removeEventListener('focusin', onFocusIn as EventListener, true);
      root.removeEventListener('focusout', onFocusOut as EventListener, true);
      document.removeEventListener('mousedown', onMouseDown as EventListener, true);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.removeEventListener('mousedown', onSelectMouseDown as EventListener, true);
      document.removeEventListener('blur', onSelectBlur as EventListener, true);
      window.removeEventListener('click', onWindowClick as EventListener, true);
    };
  }, [visibilityRootSelector, primaryColor, ringColor, enableTap]);

  return (
    <div
      ref={dotRef}
      className={`fixed pointer-events-none ${zIndexClass} hidden md:block transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-150 ${
        visible ? 'opacity-100' : 'opacity-0'
      } ${isClicking ? 'cursor-pulse' : ''}`}
      style={{
        width: variant === 'text' ? 2 : variant === 'link' ? 12 : 10,
        height: variant === 'text' ? 18 : variant === 'link' ? 12 : 10,
        borderRadius: 9999,
        background: isClicking ? '#ffffff' : primaryColor,
        border: isClicking ? '2px solid #111827' : 'none',
        boxShadow: variant === 'link' ? `0 0 0 6px ${ringColor}` : 'none'
      }}
      aria-hidden
    />
  );
}


