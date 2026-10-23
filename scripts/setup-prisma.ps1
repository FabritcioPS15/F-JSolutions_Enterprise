# Script para configurar Prisma en el monorepo (Windows)

Write-Host "Configurando Prisma..."

# Ir a la carpeta de la API
Set-Location apps/api

# Instalar Prisma CLI temporalmente con npm (ignorando el workspace)
Write-Host "Instalando Prisma CLI..."
npm install -D prisma@5.14.0 --no-save

# Generar el cliente de Prisma
Write-Host "Generando cliente de Prisma..."
npx prisma generate --schema=..\..\database\schema.prisma

# Limpiar la instalación temporal
Write-Host "Limpiando instalacion temporal..."
Remove-Item -Recurse -Force node_modules\.prisma -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules\@prisma -ErrorAction SilentlyContinue

# Volver a la raíz
Set-Location ..

Write-Host "Prisma configurado exitosamente!"
