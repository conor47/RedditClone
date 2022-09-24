import request from 'supertest';

import User from '../../../entity/User';
import app from '../../../server';

it('fails when password is not supplied', async () => {
  await request(app)
    .post('/api/auth/register')
    .send({ username: 'alice', email: 'alice@mail.com' })
    .expect(400);
});

it('fails when email is not supplied', async () => {
  await request(app)
    .post('/api/auth/register')
    .send({ password: 'testing', username: 'sean' })
    .expect(400);
});

it('fails when username is not supplied', async () => {
  await request(app)
    .post('/api/auth/register')
    .send({ password: 'testing', email: 'sean@mail.com' })
    .expect(400);
});

it('fails with invalid password', async () => {
  await request(app)
    .post('/api/auth/register')
    .send({ username: 'conor', email: 'conor', password: '123' })
    .expect(400);
});

it('succeeds with valid data', async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ username: 'conor', email: 'conor@mail.com', password: '123456' })
    .expect(200);

  const users = await User.find({ email: 'conor@mail.com' });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual('conor@mail.com');
  expect(user.username).toEqual('conor');
});
