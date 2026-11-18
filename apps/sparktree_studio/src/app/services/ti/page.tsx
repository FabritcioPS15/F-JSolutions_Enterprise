'use client';

import React from 'react';
import ServiceTI from '@/views/services/TI';
import { useStudioNav } from '@/app/navigation-context';

export default function Page() {
  const { onNavigate } = useStudioNav();
  return <ServiceTI onNavigate={onNavigate} />;
}
