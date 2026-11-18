'use client';

import React from 'react';
import ServiceApps from '@/views/services/Apps';
import { useStudioNav } from '@/app/navigation-context';

export default function Page() {
  const { onNavigate } = useStudioNav();
  return <ServiceApps onNavigate={onNavigate} />;
}
