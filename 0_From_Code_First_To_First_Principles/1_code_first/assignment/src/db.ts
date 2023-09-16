import { Pool, Client } from 'pg';

const dbConfig = {
  host: process.env.PGHOST as string,
  port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
  database: process.env.POSTGRES_DB as string,
  user: process.env.POSTGRES_USER as string,
  password: process.env.POSTGRES_PASSWORD as string,
};

export function connectDb() {
  const pool = new Pool(dbConfig);
  return pool;
}

export async function disconnectDb(pool: Pool, shouldExit = true) {
  pool.end(() => {
    console.log('Database pool has been gracefully closed.');
    shouldExit && process.exit(0);
  });
}

export async function getClient() {
  const client = new Client(dbConfig);

  try {
    await client.connect();
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting the database:', error);
    throw new Error('Db connect error');
  }
  return client;
}

export async function disconnectClient(client: Client) {
  try {
    await client.end();
    console.log('Disconnected from the database');
  } catch (error) {
    console.error('Error disconnecting from the database:', error);
  }
}