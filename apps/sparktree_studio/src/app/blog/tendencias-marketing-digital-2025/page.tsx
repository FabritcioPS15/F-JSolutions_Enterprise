'use client';

import React from 'react';
import TendenciasMarketingDigital2025 from '@/views/blog/tendencias-marketing-digital-2025';
import { useStudioNav } from '@/app/navigation-context';

export default function Page() {
  const { onNavigate } = useStudioNav();
  return <TendenciasMarketingDigital2025  />;
}
