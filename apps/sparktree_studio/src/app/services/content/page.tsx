'use client';

import React from 'react';
import ServiceContentMarketing from '@/views/services/ContentMarketing';
import { useStudioNav } from '@/app/navigation-context';

export default function Page() {
  const { onNavigate } = useStudioNav();
  return <ServiceContentMarketing onNavigate={onNavigate} />;
}
