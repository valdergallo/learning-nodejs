import { all, get, run } from '../db';
import type { User } from '../models/user';

export const getAll = async (): Promise<User[]> => {
  return all<User>('SELECT id, name, email FROM users ORDER BY id');
};

export const getById = async (id: number): Promise<User | undefined> => {
  return get<User>('SELECT id, name, email FROM users WHERE id = ?', [id]);
};

export const getByEmail = async (email: string): Promise<User | undefined> => {
  return get<User>('SELECT id, name, email FROM users WHERE email = ?', [email]);
};

export const create = async (data: Omit<User, 'id'>): Promise<User> => {
  const info = await run('INSERT INTO users (name, email) VALUES (?, ?)', [
    data.name,
    data.email,
  ]);
  // @ts-ignore - sqlite3 RunResult has lastID
  const id = (info as any).lastID ?? (info as any).lastInsertRowid;
  return { id: Number(id), ...data };
};

export const update = async (
  id: number,
  data: Partial<Omit<User, 'id'>>
): Promise<User | undefined> => {
  const existing = await getById(id);
  if (!existing) return undefined;
  const name = data.name ?? existing.name;
  const email = data.email ?? existing.email;
  await run('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
  return { id, name, email };
};

export const remove = async (id: number): Promise<boolean> => {
  const info = await run('DELETE FROM users WHERE id = ?', [id]);
  // @ts-ignore
  return (info as any).changes > 0;
};
