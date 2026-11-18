'use client';

import React from 'react';
import IaMarketingDigital from '@/views/blog/ia-marketing-digital';
import { useStudioNav } from '@/app/navigation-context';

export default function Page() {
  const { onNavigate } = useStudioNav();
  return <IaMarketingDigital  />;
}
