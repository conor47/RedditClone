import request from 'supertest';
import app from '../../server';
import { createTypeormConnection } from '../../Utils/createTypeormConnection';

beforeAll(async () => {
  await createTypeormConnection();
});

it('responds with an HTTP 400 with invalid data', async () => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({ username: 'conor', email: 'conor', password: '123' })
    .expect(400);
});

it('creates a user with valid information', async () => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({ username: 'bob', email: 'bob@mail.com', password: '123456' })
    .expect(200);
});
