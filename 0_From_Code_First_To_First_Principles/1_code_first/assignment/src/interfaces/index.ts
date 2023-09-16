import type { Pool } from 'pg';

export type Context = {
  db: Pool;
}