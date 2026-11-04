/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    agentUpgrade: 'security',
  },
  async redirects() {
    return [
      {
        source: '/servicios/soporte-remoto-y-presencial',
        destination: '/servicios/soporte-tecnico',
        permanent: true,
      },
      {
        source: '/servicios/configuracion-de-equipos-de-red',
        destination: '/servicios/redes-y-conectividad',
        permanent: true,
      },
    ]
  },
  output: 'standalone',
  turbopack: {},
}

export default nextConfig
