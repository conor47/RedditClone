import request from 'supertest';

import app from '../../../server';

it('fails when not logged in', async () => {
  await request(app).get('/api/auth/logout').send().expect(401);
});

it('succeeds when logged in. Cookie is expired', async () => {
  const cookie = await global.signin();

  const res = await request(app)
    .get('/api/auth/logout')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  let expiredCookie = res.get('Set-Cookie');
  expect(expiredCookie[0].substring(24, 54)).toEqual(
    'Thu, 01 Jan 1970 00:00:00 GMT;'
  );
});
