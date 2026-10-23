#!/bin/bash

# Script para configurar Prisma en el monorepo

echo "🔧 Configurando Prisma..."

# Ir a la carpeta de la API
cd apps/api

# Instalar Prisma CLI temporalmente con npm (ignorando el workspace)
echo "📦 Instalando Prisma CLI..."
npm install -D prisma@5.14.0 --no-save

# Generar el cliente de Prisma
echo "⚙️  Generando cliente de Prisma..."
npx prisma generate --schema=../../database/schema.prisma

# Limpiar la instalación temporal
echo "🧹 Limpiando instalación temporal..."
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma

echo "✅ Prisma configurado exitosamente!"
