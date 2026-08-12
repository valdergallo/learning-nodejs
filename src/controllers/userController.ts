import type { Request, Response } from 'express';
import * as userService from '../services/userService';

export const getUsers = async (_req: Request, res: Response) => {
  const users = await userService.getAll();
  return res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = await userService.getById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json(user);
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    const user = await userService.create({ name: name.trim(), email: email.trim() });
    return res.status(201).json(user);
  } catch (err: any) {
    if (err && (err.status === 409 || err.message === 'EmailAlreadyExists')) {
      return res.status(409).json({ message: 'Email already in use' });
    }
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const { email, name } = req.body;
    if (email !== undefined) {
      if (typeof email !== 'string' || !email.trim()) {
        return res.status(400).json({ message: 'Email is required' });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }
      req.body.email = email.trim();
    }
    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ message: 'Name must be a non-empty string' });
      }
      req.body.name = name.trim();
    }
    const user = await userService.update(id, req.body);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user);
  } catch (err: any) {
    if (err && (err.status === 409 || err.message === 'EmailAlreadyExists')) {
      return res.status(409).json({ message: 'Email already in use' });
    }
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const ok = await userService.remove(id);
  if (!ok) return res.status(404).json({ message: 'User not found' });
  return res.status(204).send();
};
