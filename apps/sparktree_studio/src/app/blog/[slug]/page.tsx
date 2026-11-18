'use client';

import React from 'react';
import BlogPost from '@/views/blog/Post';
import { useStudioNav } from '@/app/navigation-context';

export default function Page(props: { params: Promise<any> }) {
  const { onNavigate } = useStudioNav();
  const params = React.use(props.params); return <BlogPost slug={params.slug} onBack={() => onNavigate('/blog')} />;
}
