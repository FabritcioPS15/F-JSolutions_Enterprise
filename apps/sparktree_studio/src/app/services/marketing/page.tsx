'use client';

import React from 'react';
import ServiceMarketing from '@/views/services/Marketing';
import { useStudioNav } from '@/app/navigation-context';

export default function Page() {
  const { onNavigate } = useStudioNav();
  return <ServiceMarketing onNavigate={onNavigate} />;
}
