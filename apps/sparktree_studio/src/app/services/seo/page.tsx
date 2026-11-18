'use client';

import React from 'react';
import ServiceSEO from '@/views/services/SEO';
import { useStudioNav } from '@/app/navigation-context';

export default function Page() {
  const { onNavigate } = useStudioNav();
  return <ServiceSEO onNavigate={onNavigate} />;
}
