'use client';

import React from 'react';
import ServiceBranding from '@/views/services/Branding';
import { useStudioNav } from '@/app/navigation-context';

export default function Page() {
  const { onNavigate } = useStudioNav();
  return <ServiceBranding onNavigate={onNavigate} />;
}
