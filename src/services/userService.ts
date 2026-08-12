import type { User } from '../models/user';
import * as repo from '../repositories/userRepo';

export const getAll = async (): Promise<User[]> => repo.getAll();

export const getById = async (id: number): Promise<User | undefined> => repo.getById(id);

export const create = async (data: Omit<User, 'id'>): Promise<User> => {
	const existing = await repo.getByEmail(data.email);
	if (existing) {
		const err = new Error('EmailAlreadyExists');
		// attach status for convenience
		(err as any).status = 409;
		throw err;
	}
	return repo.create(data);
};

export const update = async (
	id: number,
	data: Partial<Omit<User, 'id'>>
): Promise<User | undefined> => {
	if (data.email) {
		const existing = await repo.getByEmail(data.email);
		if (existing && existing.id !== id) {
			const err = new Error('EmailAlreadyExists');
			(err as any).status = 409;
			throw err;
		}
	}
	return repo.update(id, data);
};

export const remove = async (id: number): Promise<boolean> => repo.remove(id);
