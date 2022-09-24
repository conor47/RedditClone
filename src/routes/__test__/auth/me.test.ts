import request from 'supertest';
import app from '../../../server';

it('responds with a 401 when not logged in', async () => {
  await request(app).get('/api/auth/me').expect(401);
});

it('responds with a 200 when a user is logged in', async () => {
  const cookie = await global.signin();
  console.log('Cooke is =', cookie);

  const res = await request(app)
    .get('/api/auth/me')
    .set('Cookie', cookie)
    .expect(200);

  expect(res.body.username).toBeDefined();
  expect(res.body.email).toBeDefined();
});
