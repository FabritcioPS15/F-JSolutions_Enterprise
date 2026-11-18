'use client';

import React from 'react';
import RedesSocialesEcommerce from '@/views/blog/redes-sociales-ecommerce';
import { useStudioNav } from '@/app/navigation-context';

export default function Page() {
  const { onNavigate } = useStudioNav();
  return <RedesSocialesEcommerce  />;
}
