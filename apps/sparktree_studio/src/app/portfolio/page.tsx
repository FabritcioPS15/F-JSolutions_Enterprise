'use client';

import React from 'react';
import Portfolio from '@/views/portfolio';
import { useStudioNav } from '@/app/navigation-context';

export default function Page() {
  const { onNavigate } = useStudioNav();
  return <Portfolio onViewProject={(id) => onNavigate(`/portfolio/${id}`)} />;
}
