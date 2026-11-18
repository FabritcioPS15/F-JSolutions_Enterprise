'use client';

import React from 'react';
import Nosotros from '@/views/nosotros';
import { useStudioNav } from '@/app/navigation-context';

export default function Page() {
  const { onNavigate } = useStudioNav();
  return <Nosotros onNavigate={onNavigate} />;
}
