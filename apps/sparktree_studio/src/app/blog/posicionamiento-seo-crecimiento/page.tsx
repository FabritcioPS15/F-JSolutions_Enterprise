'use client';

import React from 'react';
import PosicionamientoSeoCrecimiento from '@/views/blog/posicionamiento-seo-crecimiento';
import { useStudioNav } from '@/app/navigation-context';

export default function Page() {
  const { onNavigate } = useStudioNav();
  return <PosicionamientoSeoCrecimiento  />;
}
