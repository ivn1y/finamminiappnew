#!/usr/bin/env node

const { execSync } = require('child_process');

function main() {
  const port = 3000;
  
  console.log('\n🚀 Запуск сервера для локальной разработки (localhost)...\n');
  console.log(`💻 Откройте в браузере:`);
  console.log(`   http://localhost:${port}\n`);
  console.log('🔧 Режим разработки с hot reload');
  console.log('📱 Для мобильного тестирования используйте:');
  console.log('   npm run mobile:192 или npm run mobile:196');
  console.log('');
  
  // Запускаем Next.js сервер
  try {
    execSync(`npm run dev:local`, { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Ошибка запуска сервера:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
