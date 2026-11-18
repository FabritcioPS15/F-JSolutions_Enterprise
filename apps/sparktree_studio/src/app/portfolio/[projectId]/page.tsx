'use client';

import React from 'react';
import ProjectDetail from '@/views/portfolio/ProjectDetail';
import { useStudioNav } from '@/app/navigation-context';

export default function Page(props: { params: Promise<any> }) {
  const { onNavigate } = useStudioNav();
  const params = React.use(props.params); return <ProjectDetail projectId={params.projectId} onNavigate={onNavigate} />;
}
