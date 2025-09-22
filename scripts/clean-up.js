const { execSync } = require('child_process');

try {
  console.log('Removendo container Docker do MySQL...');
  execSync('docker rm -f mysql-test', { stdio: 'inherit' });
  console.log('Limpeza concluída.');
} catch (error) {
  console.error('Erro ao limpar o ambiente:', error);
  process.exit(1);
}