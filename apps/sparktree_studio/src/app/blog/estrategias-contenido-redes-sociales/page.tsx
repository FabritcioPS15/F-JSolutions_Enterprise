'use client';

import React from 'react';
import EstrategiasContenidoRedesSociales from '@/views/blog/estrategias-contenido-redes-sociales';
import { useStudioNav } from '@/app/navigation-context';

export default function Page() {
  const { onNavigate } = useStudioNav();
  return <EstrategiasContenidoRedesSociales  />;
}
