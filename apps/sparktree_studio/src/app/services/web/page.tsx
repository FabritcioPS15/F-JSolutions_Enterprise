'use client';

import React from 'react';
import ServiceWeb from '@/views/services/Web';
import { useStudioNav } from '@/app/navigation-context';

export default function Page() {
  const { onNavigate } = useStudioNav();
  return <ServiceWeb onNavigate={onNavigate} />;
}
