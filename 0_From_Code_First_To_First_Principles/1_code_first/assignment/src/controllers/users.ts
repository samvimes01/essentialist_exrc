import type { RequestHandler } from 'express';

import { Context } from '../interfaces';
import { UserDTO, UserDb, createUser, getUserByEmail, updateUser } from '../models';

const userDbToUser = (u: UserDb): UserDTO => ({ id: u.id, email: u.email, username: u.username, firstName: u.firstname, lastName: u.lastname });

function generateRandomPassword(length = 10) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }
  return password;
}

export const userCreate: (context: Context) => RequestHandler = (context) => async (req, res) => {
  const { email, username, firstName, lastName } = req.body;
  const password = req.body.password ?? generateRandomPassword();
  if (!(email && username && password)) {
    return res.status(400).json({ error: 'ValidationError', data: undefined, success: false });
  }
  try {
    const user = await createUser({ email, username, firstName, lastName, password }, context);
    if (!user) {
      return res.status(400).json({ error: 'DbCreateError', data: undefined, success: false });
    }
    return res.status(201).json({ error: undefined, data: userDbToUser(user), success: true });
  } catch (error) {
    if ((error as any)?.constraint === 'users_email_key') {
      return res.status(409).json({ error: 'EmailAlreadyInUse', data: undefined, success: false });
    }
    if ((error as any)?.constraint === 'users_username_key') {
      return res.status(409).json({ error: 'UsernameAlreadyTaken', data: undefined, success: false });
    }
    return res.status(409).json({ error: `Unknown: ${String(error)}`, data: undefined, success: false });
  }
};

export const userEdit: (context: Context) => RequestHandler = (context) => async (req, res) => {
  const id = req.params.userId;

  const { email, username, firstName, lastName } = req.body;
  if (!(id && email && username)) {
    return res.status(400).json({ error: 'ValidationError', data: undefined, success: false });
  }
  try {
    const user = await updateUser({ id: +id, email, username, firstName, lastName }, context);
    if (!user) {
      return res.status(400).json({ error: 'UserNotFound', data: undefined, success: false });
    }
    return res.status(201).json({ error: undefined, data: userDbToUser(user), success: true });
  } catch (error) {
    if ((error as any)?.constraint === 'users_email_key') {
      return res.status(409).json({ error: 'EmailAlreadyInUse', data: undefined, success: false });
    }
    if ((error as any)?.constraint === 'users_username_key') {
      return res.status(409).json({ error: 'UsernameAlreadyTaken', data: undefined, success: false });
    }
    return res.status(409).json({ error: `Unknown: ${String(error)}`, data: undefined, success: false });
  }
};

export const userGet: (context: Context) => RequestHandler = (context) => async (req, res) => {
  const email = req.query.email;
  if (!email) res.send(null);

  try {
    const user = await getUserByEmail(String(email), context);

    if (user) {
      res.json({ error: undefined, data: userDbToUser(user), success: true });
    } else {
      res.status(404).json({ error: 'UserNotFound', data: undefined, success: false });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
