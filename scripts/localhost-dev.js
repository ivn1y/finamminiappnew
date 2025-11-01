#!/usr/bin/env node

const { execSync } = require('child_process');

function main() {
  const port = 3000;
  
  console.log('\n🚀 Запуск локальной версии (для компьютера)...\n');
  console.log('💻 Доступен по адресу:');
  console.log(`   http://localhost:${port}\n`);
  console.log('🔧 Режим разработки с hot reload\n');
  console.log('📱 Для мобильной версии используйте:');
  console.log('   npm run mobile\n');
  console.log('⚠️  Для остановки нажмите Ctrl+C\n');
  
  try {
    execSync(`npm run dev:local`, { stdio: 'inherit' });
  } catch (error) {
    if (error.signal !== 'SIGINT') {
      console.error('❌ Ошибка запуска:', error.message);
      process.exit(1);
    }
  }
}

if (require.main === module) {
  main();
}
