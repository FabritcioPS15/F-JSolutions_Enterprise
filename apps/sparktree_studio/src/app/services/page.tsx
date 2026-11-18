'use client';

import React from 'react';
import Services from '@/views/services';
import { useStudioNav } from '@/app/navigation-context';

export default function Page() {
  const { onNavigate } = useStudioNav();
  return <Services onNavigate={onNavigate} />;
}
