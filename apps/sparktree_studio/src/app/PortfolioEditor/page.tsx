'use client';

import React from 'react';
import PortfolioEditor from '@/views/admin/PortfolioEditor';
import { useStudioNav } from '@/app/navigation-context';

export default function Page() {
  const { onNavigate } = useStudioNav();
  return <PortfolioEditor  />;
}
