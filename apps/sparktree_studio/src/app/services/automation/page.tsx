'use client';

import React from 'react';
import ServiceAutomation from '@/views/services/Automation';
import { useStudioNav } from '@/app/navigation-context';

export default function Page() {
  const { onNavigate } = useStudioNav();
  return <ServiceAutomation onNavigate={onNavigate} />;
}
