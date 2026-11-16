import React from 'react'

export function InstagramIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

export function TikTokIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.35a6.33 6.33 0 0 0-.85-.06A6.34 6.34 0 0 0 3 15.63a6.34 6.34 0 0 0 10.82 4.49 6.3 6.3 0 0 0 1.88-4.49V8.77a8.28 8.28 0 0 0 4.89 1.57v-3.65a4.85 4.85 0 0 1-1 0z" />
    </svg>
  )
}

export function WhatsAppIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
      <path d="M9.4 8.9c.2-.5.9-.5 1.1-.1l.9 1.6c.1.3 0 .5-.1.7l-.6.6c.4 1.2 1.4 2.2 2.6 2.6l.6-.6c.2-.1.5-.2.7-.1l1.6.9c.4.2.4.9-.1 1.1-1.4.7-3 .3-4.7-.8a7.6 7.6 0 0 1-2.8-2.8c-1.1-1.7-1.5-3.3-.8-4.7z" />
    </svg>
  )
}
