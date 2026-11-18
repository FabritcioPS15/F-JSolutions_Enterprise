'use client';

import React from 'react';
import Privacy from '@/views/privacy';
import { useStudioNav } from '@/app/navigation-context';

export default function Page() {
  const { onNavigate } = useStudioNav();
  return <Privacy onNavigate={onNavigate} />;
}
