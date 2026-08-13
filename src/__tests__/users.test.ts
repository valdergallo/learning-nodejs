import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';

// set test env before importing app so DB uses in-memory
process.env.NODE_ENV = 'test';
process.env.DB_PATH = ':memory:';

import app from '../app';

describe('Users API', () => {
  it('creates and lists users', async () => {
    const resCreate = await request(app)
      .post('/users')
      .send({ name: 'Test', email: 't@x.com' })
      .set('Accept', 'application/json');
    expect(resCreate.status).toBe(201);
    const resList = await request(app).get('/users');
    expect(resList.status).toBe(200);
    expect(Array.isArray(resList.body)).toBe(true);
    expect(resList.body.length).toBeGreaterThanOrEqual(1);
  });
  it('returns 409 for duplicate email', async () => {
    await request(app)
      .post('/users')
      .send({ name: 'Dup', email: 'dup@x.com' })
      .set('Accept', 'application/json');
    const res = await request(app)
      .post('/users')
      .send({ name: 'Dup2', email: 'dup@x.com' })
      .set('Accept', 'application/json');
    expect(res.status).toBe(409);
  });
  it('returns 404 when updating non-existent user', async () => {
    const res = await request(app).put('/users/9999').send({ name: 'No' });
    expect(res.status).toBe(404);
  });
  it('deletes a user', async () => {
    const create = await request(app)
      .post('/users')
      .send({ name: 'ToDelete', email: 'del@x.com' })
      .set('Accept', 'application/json');
    const id = create.body.id;
    const del = await request(app).delete(`/users/${id}`);
    expect(del.status).toBe(204);
  });
});
