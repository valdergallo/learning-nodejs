import { describe, it, expect, vi } from 'vitest';

vi.mock('../repositories/userRepo', () => ({
  getAll: vi.fn(),
  getById: vi.fn(),
  getByEmail: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
}));

import * as service from '../services/userService';
import * as repo from '../repositories/userRepo';

describe('userService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('throws when creating with existing email', async () => {
    (repo.getByEmail as any).mockResolvedValue({ id: 1, name: 'X', email: 'a@b' });
    await expect(service.create({ name: 'X', email: 'a@b' })).rejects.toMatchObject({ message: 'EmailAlreadyExists' });
  });

  it('allows create when email not exists', async () => {
    (repo.getByEmail as any).mockResolvedValue(undefined);
    (repo.create as any).mockResolvedValue({ id: 1, name: 'Y', email: 'y@x' });
    const res = await service.create({ name: 'Y', email: 'y@x' });
    expect(res).toEqual({ id: 1, name: 'Y', email: 'y@x' });
  });

  it('throws on update when email used by another', async () => {
    (repo.getByEmail as any).mockResolvedValue({ id: 2, name: 'Z', email: 'z@x' });
    await expect(service.update(1, { email: 'z@x' })).rejects.toMatchObject({ message: 'EmailAlreadyExists' });
  });
});
