'use client';

import React from 'react';
import ServiceConsulting from '@/views/services/Consulting';
import { useStudioNav } from '@/app/navigation-context';

export default function Page() {
  const { onNavigate } = useStudioNav();
  return <ServiceConsulting onNavigate={onNavigate} />;
}
