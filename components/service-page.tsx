'use client'

import { ArrowRight, Check, ChevronDown, Code2, Headset, MonitorCog, Server, ShieldCheck, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ServicePageProps = { kind: 'cotizador' | 'soporte' | 'sistemas' }

const content = {
  cotizador: {
    eyebrow: 'Cotización personalizada', title: 'La tecnología correcta empieza con una buena recomendación.', description: 'Cuéntanos qué necesitas y recibe una propuesta clara para tu PC, oficina o empresa. Sin precios publicados por ahora: evaluamos tu caso y te asesoramos.', icon: MonitorCog, cta: 'Solicitar cotización', options: ['PC para gaming, estudio o trabajo', 'Servidores y almacenamiento para empresas', 'Equipamiento completo para oficinas', 'Componentes y periféricos compatibles'],
  },
  soporte: {
    eyebrow: 'Soporte TI', title: 'Tu operación no puede detenerse.', description: 'Resolvemos incidencias, mantenemos tus equipos y construimos una infraestructura tecnológica segura para que puedas enfocarte en tu negocio.', icon: Headset, cta: 'Hablar con un especialista', options: ['Soporte remoto y atención en sitio', 'Redes, Wi-Fi y cableado estructurado', 'Mantenimiento de PCs, laptops y servidores', 'Seguridad, respaldos y continuidad operativa'],
  },
  sistemas: {
    eyebrow: 'Desarrollo de sistemas', title: 'Convertimos tus procesos en soluciones digitales.', description: 'Diseñamos y desarrollamos sistemas a medida para automatizar tareas, ordenar información y hacer crecer tu negocio.', icon: Code2, cta: 'Cuéntanos tu proyecto', options: ['Sistemas web y plataformas internas', 'Automatización de procesos y reportes', 'Integración de inventario, ventas y facturación', 'Mantenimiento y evolución de software'],
  },
} as const

export function ServicePage({ kind }: ServicePageProps) {
  const item = content[kind]
  const Icon = item.icon
  return <main className="min-h-screen bg-[#f8fafc] text-[#172033]">
    <div className="bg-[#102a56] px-4 py-2 text-xs font-semibold text-blue-100"><div className="mx-auto flex max-w-[1180px] justify-between gap-3"><span>FJ TECH · Tecnología para tu siguiente etapa</span><a href="/" className="hover:text-white">Volver al inicio</a></div></div>
    <header className="border-b border-[#e5eaf0] bg-white"><div className="mx-auto flex max-w-[1180px] items-center justify-between px-4 py-4 sm:px-6"><a href="/" className="flex items-center gap-2 text-lg font-extrabold"><span className="flex size-9 items-center justify-center rounded-lg bg-[#155eef] text-sm text-white">FJ</span> FJ <span className="text-[#155eef]">TECH</span></a><nav className="hidden gap-6 text-sm font-semibold text-[#475569] sm:flex"><a href="/productos">Productos</a><a href="/cotizador">Cotizador</a><a href="/soporte-ti">Soporte TI</a><a href="/sistemas">Crear sistemas</a></nav><a href="/#cuenta" className="text-sm font-bold text-[#155eef]">Ingresar</a></div></header>
    <section className="mx-auto grid max-w-[1180px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-20"><div><div className="flex size-14 items-center justify-center rounded-2xl bg-[#e8f0ff] text-[#155eef]"><Icon /></div><p className="mt-7 text-sm font-bold uppercase tracking-[.18em] text-[#155eef]">{item.eyebrow}</p><h1 className="mt-3 max-w-2xl text-4xl font-black leading-tight tracking-[-.06em] sm:text-6xl">{item.title}</h1><p className="mt-6 max-w-xl text-base leading-7 text-[#64748b]">{item.description}</p><div className="mt-8 flex flex-wrap gap-3"><Button className="bg-[#155eef] font-bold hover:bg-[#104bc5]">{item.cta} <ArrowRight data-icon="inline-end" /></Button><Button variant="outline" render={<a href="/" />}>Ver productos</Button></div></div><div className="rounded-3xl border border-[#dbe2ea] bg-white p-6 shadow-sm sm:p-8"><p className="text-lg font-extrabold">¿En qué podemos ayudarte?</p><p className="mt-2 text-sm text-[#64748b]">Selecciona un punto de partida y un asesor se pondrá en contacto contigo.</p><div className="mt-6 flex flex-col gap-3">{item.options.map((option) => <label key={option} className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#e5eaf0] p-4 text-sm font-semibold transition hover:border-[#9dbaf5]"><input type="checkbox" className="size-4 accent-[#155eef]" />{option}</label>)}</div><label className="mt-5 block text-sm font-semibold">Cuéntanos brevemente<textarea className="mt-2 min-h-24 w-full rounded-xl border border-[#dbe2ea] p-3 font-normal outline-none focus:border-[#155eef]" placeholder="Describe tu necesidad..." /></label><Button className="mt-5 h-11 w-full bg-[#ff6b35] font-bold hover:bg-[#e85a26]">Enviar solicitud</Button></div></section>
    <section className="border-y border-[#e5eaf0] bg-white"><div className="mx-auto grid max-w-[1180px] gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6"><Trust icon={<ShieldCheck />} title="Asesoría real" copy="Te orientamos según tu contexto." /><Trust icon={<Server />} title="Soluciones escalables" copy="Pensadas para crecer contigo." /><Trust icon={<Wrench />} title="Acompañamiento" copy="Seguimos contigo después de la entrega." /></div></section>
  </main>
}
function Trust({ icon, title, copy }: { icon: React.ReactNode; title: string; copy: string }) { return <div className="flex gap-3"><span className="text-[#155eef]">{icon}</span><div><p className="font-bold">{title}</p><p className="mt-1 text-sm text-[#64748b]">{copy}</p></div></div> }
