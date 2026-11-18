'use client';

import React from 'react';
import Blog from '@/views/blog';
import { useStudioNav } from '@/app/navigation-context';

export default function Page() {
  const { onNavigate } = useStudioNav();
  return <Blog onViewPost={(slug) => onNavigate(`/blog/${slug}`)} />;
}
