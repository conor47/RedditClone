import request from 'supertest';

import app from '../../../server';

it('fails when password is not supplied', async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ username: 'alice', email: 'alice@mail.com', password: '123456' })
    .expect(200);

  await request(app)
    .post('/api/auth/login')
    .send({ username: 'alice' })
    .expect(400);
});

it('fails when username is not supplied', async () => {
  await request(app)
    .post('/api/auth/register')
    .send({ email: 'alice@mail.com', password: '123456' })
    .expect(400);

  await request(app)
    .post('/api/auth/login')
    .send({ password: '123456' })
    .expect(400);
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

  await request(app)
    .post('/api/auth/login')
    .send({ username: 'jane1', password: '123456' })
    .expect(401);
});

it('succeeds with correct credentials after valid register', async () => {
  await request(app)
    .post('/api/auth/register')
    .send({ username: 'bob', email: 'bob@mail.com', password: '123456' })
    .expect(200);

  const res = await request(app)
    .post('/api/auth/login')
    .send({ username: 'bob', password: '123456' })
    .expect(200);

  expect(res.get('Set-Cookie')).toBeDefined();
});
