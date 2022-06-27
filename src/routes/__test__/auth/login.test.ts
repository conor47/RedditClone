import { send } from 'process';
import request from 'supertest';
import { getConnection } from 'typeorm';

import User from '../../../entity/User';
import app from '../../../server';
import { createTypeormConnection } from '../../../Utils/createTypeormConnection';

// beforeAll(async () => {
//   await createTypeormConnection();
// });

// afterAll(async () => {
//   await getConnection().dropDatabase();
//   await getConnection().close();
// });

it('responds with an HTTP 400 with invalid data', async () => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({ username: '', password: '' })
    .expect(400);
});

it('succeeds with correct credentials after valid register', async () => {
  await request(app)
    .post('/api/auth/register')
    .send({ username: 'bob', email: 'bob@mail.com', password: '123456' })
    .expect(200);

  await request(app)
    .post('/api/auth/login')
    .send({ username: 'bob', password: '123456' })
    .expect(200);
});

it('fails logins with incorrect credentials after valid a register', async () => {
  await request(app)
    .post('/api/auth/register')
    .send({ username: 'jane', email: 'jane@mail.com', password: '123456' })
    .expect(200);

  await request(app)
    .post('/api/auth/login')
    .send({ username: 'jane', password: '1234567' })
    .expect(401);
});
