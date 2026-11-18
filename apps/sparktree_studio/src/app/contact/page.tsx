'use client';

import React from 'react';
import Contact from '@/views/contact';
import { useStudioNav } from '@/app/navigation-context';

export default function Page() {
  const { onNavigate } = useStudioNav();
  return <Contact  />;
}
