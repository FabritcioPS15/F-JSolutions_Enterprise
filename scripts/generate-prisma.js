const { execSync } = require('child_process');
const path = require('path');

console.log('Generando cliente de Prisma...');

try {
  // Generar cliente de Prisma
  execSync('npx prisma generate --schema=../../database/schema.prisma', {
    cwd: path.join(__dirname, '../apps/api'),
    stdio: 'inherit'
  });
  console.log('✓ Cliente de Prisma generado exitosamente');
} catch (error) {
  console.error('Error generando cliente de Prisma:', error);
  process.exit(1);
}
