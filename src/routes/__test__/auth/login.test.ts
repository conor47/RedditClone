import request from 'supertest';

import app from '../../../server';

it('responds with an HTTP 400 with invalid data', async () => {
  await request(app)
    .post('/api/auth/register')
    .send({ username: '', password: '' })
    .expect(400);
});

it('succeeds with correct credentials after valid register', async () => {
  await request(app)
    .post('/api/auth/register')
    .send({ username: 'bob', email: 'bob@mail.com', password: '123456' })
    .expect(200);

  const response = await request(app)
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
