import request from 'supertest';
import { getConnection } from 'typeorm';

import User from '../../../entity/User';
import app from '../../../server';
import { createTypeormConnection } from '../../../Utils/createTypeormConnection';

beforeAll(async () => {
  await createTypeormConnection();
});

afterAll(async () => {
  await getConnection().dropDatabase();
  await getConnection().close();
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
    .send({ username: 'conor', email: 'conor@mail.com', password: '123456' })
    .expect(200);

  const users = await User.find({ email: 'conor@mail.com' });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual('conor@mail.com');
});
