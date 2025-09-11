const { createTables } = require('./init-db');

const runInit = async () => {
  console.log('Iniciando criação das tabelas...');
  await createTables();
  console.log('Inicialização do banco de dados concluída!');
  process.exit(0);
};

runInit().catch(console.error);
