'use client';

import React from 'react';
import SparkBots from '@/views/services/SparkBots';
import { useStudioNav } from '@/app/navigation-context';

export default function Page() {
  const { onNavigate } = useStudioNav();
  return <SparkBots onNavigate={onNavigate} />;
}
