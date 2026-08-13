import request from 'supertest';
import { vi, describe, it, expect, afterEach } from 'vitest';

process.env.NODE_ENV = 'test';
process.env.DB_PATH = ':memory:';

import app from '../app';
import * as userService from '../services/userService';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('userController edge cases', () => {
  it('returns 404 when user not found', async () => {
    vi.spyOn(userService, 'getById').mockResolvedValue(undefined as any);
    const res = await request(app).get('/users/999');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'User not found' });
  });

  it('createUser: missing name returns 400', async () => {
    const res = await request(app).post('/users').send({ email: 'a@b.com' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Name is required' });
  });

  it('createUser: invalid email returns 400', async () => {
    const res = await request(app).post('/users').send({ name: 'A', email: 'not-an-email' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Invalid email format' });
  });

  it('createUser: email already exists -> 409', async () => {
    vi.spyOn(userService, 'create').mockRejectedValue(new Error('EmailAlreadyExists'));
    const res = await request(app).post('/users').send({ name: 'A', email: 'a@b.com' });
    expect(res.status).toBe(409);
    expect(res.body).toEqual({ message: 'Email already in use' });
  });

  it('createUser: service throws -> 500', async () => {
    vi.spyOn(userService, 'create').mockRejectedValue(new Error('boom'));
    const res = await request(app).post('/users').send({ name: 'A', email: 'a@b.com' });
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Internal Server Error' });
  });

  it('updateUser: invalid email format -> 400', async () => {
    const res = await request(app).put('/users/1').send({ email: 'bad' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Invalid email format' });
  });

  it('updateUser: invalid name -> 400', async () => {
    const res = await request(app).put('/users/1').send({ name: '   ' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Name must be a non-empty string' });
  });

  it('updateUser: not found -> 404', async () => {
    vi.spyOn(userService, 'update').mockResolvedValue(undefined as any);
    const res = await request(app).put('/users/1').send({ name: 'New' });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'User not found' });
  });

  it('updateUser: email conflict -> 409', async () => {
    const err: any = new Error('EmailAlreadyExists');
    err.status = 409;
    vi.spyOn(userService, 'update').mockRejectedValue(err);
    const res = await request(app).put('/users/1').send({ email: 'a@b.com' });
    expect(res.status).toBe(409);
    expect(res.body).toEqual({ message: 'Email already in use' });
  });

  it('deleteUser: not found -> 404', async () => {
    vi.spyOn(userService, 'remove').mockResolvedValue(false as any);
    const res = await request(app).delete('/users/1');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'User not found' });
  });
});
