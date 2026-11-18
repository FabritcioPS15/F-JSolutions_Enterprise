'use client';

import React from 'react';
import AumentarTasaConversion from '@/views/blog/aumentar-tasa-conversion';
import { useStudioNav } from '@/app/navigation-context';

export default function Page() {
  const { onNavigate } = useStudioNav();
  return <AumentarTasaConversion  />;
}
