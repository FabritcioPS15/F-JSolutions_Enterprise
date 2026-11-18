'use client';

import React from 'react';
import Home from '@/views/home';
import { useStudioNav } from '@/app/navigation-context';

export default function Page() {
  const { onNavigate } = useStudioNav();
  return <Home onNavigate={onNavigate} />;
}
