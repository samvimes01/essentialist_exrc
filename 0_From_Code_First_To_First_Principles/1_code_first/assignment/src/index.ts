import express, { Request, Response } from 'express';
import 'dotenv/config'

import { disconnectDb, connectDb } from './db';
import { userRouter } from './routes';
import { Context } from './interfaces';

async function start() {
  const dbClient = await connectDb();
  const app = express();
  
  let shuttingDown = false;
  const context: Context = {
    db: dbClient,
  };

  app.use(express.json());
  app.use((err: Error, req: Request, res: Response) => {
    console.error(err.stack);
    res.status(500).send("Unexpected error");
  });

  app.get('/', (req, res) => {
    res.send('OK');
  })

  const usersHandler = userRouter(context);
  app.use('/users', usersHandler);

  const port = process.env.PORT || 6000;
  const server = app.listen(port, () => {
    console.log(`Server started on: ${port}`);
  });

  function shutDown() {
    if (!shuttingDown) {
      shuttingDown = true;
      console.log('Server is shutting down gracefully...');
      server.close(async () => {
        console.log('Server has been gracefully shut down.');
        await disconnectDb(dbClient);
      });
    }
  }
  process.on('SIGABRT', async () => {
    console.info('SIGABRT');
    shutDown();
  })
  process.on('SIGINT', async () => {
    console.info('SIGINT');
    shutDown();
  })
  process.on('SIGTERM', async () => {
    console.info('SIGTERM');
    shutDown();
  })
  process.on('uncaughtException', async (e) => {
    console.info('uncaughtException', e);
    shutDown();
  })
  process.on('unhandledRejection', async (e) => {
    console.info('unhandledRejection', e);
    shutDown();
  })
}


start();
