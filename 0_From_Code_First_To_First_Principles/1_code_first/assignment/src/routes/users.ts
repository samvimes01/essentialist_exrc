import express from 'express';

import { userCreate, userEdit, userGet } from '../controllers';
import type { Context } from '../interfaces';

export const userRouter = (context: Context) => {
  const router = express.Router();
  
  router.get('/', userGet(context));

  router.post('/new', userCreate(context));
  
  router.post('/edit/:userId', userEdit(context));
  
  return router;
}

