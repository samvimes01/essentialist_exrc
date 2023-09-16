import { Context } from '../interfaces'

export type UserDTO = {
  id: number;
  email: string;
  password?: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

export type UserDb = {
  id: number;
  email: string;
  password: string;
  username: string;
  firstname?: string;
  lastname?: string;
}

export const getUserByEmail = async (email: string, context: Context): Promise<UserDb | null> => {
  const query = {
    text: 'SELECT * FROM users WHERE email = $1',
    values: [email],
  }

  const { rows } = await context.db.query<UserDb>(query);

  return rows[0] ?? null;
}

export const createUser = async (user: Omit<UserDTO, 'id'>, context: Context): Promise<UserDb | null> => {
  const query = {
    text: `
      INSERT INTO users (email, username, firstname, lastname, password)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
    values: [user.email, user.username, user.firstName, user.lastName, user.password],
  };

  try {
    const result = await context.db.query(query);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error creating user:', (error as Error).message);
    throw error;
  }
}

export const updateUser = async (user: UserDTO, context: Context): Promise<UserDb | null> => {
  const query = {
    text: `
      UPDATE users
      SET "email" = $2, "username" = $3, "firstname" = $4, "lastname" = $5
      WHERE "id" = $1
      RETURNING *
    `,
    values: [user.id, user.email, user.username, user.firstName, user.lastName],
  };

  try {
    const result = await context.db.query(query);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error updating user:', (error as Error).message);
    throw error;
  }
}