import request from 'supertest';
import Sub from '../../../entity/Sub';

import app from '../../../server';

it('fails in creating a sub when not logged in', async () => {
  await request(app)
    .post('/api/subs/')
    .send({ name: 'test', title: 'test', description: 'test' })
    .expect(401);
});

it('fails without name value', async () => {
  const cookie = await global.signin();

  await request(app)
    .post('/api/subs/')
    .set('Cookie', cookie)
    .send({ title: 'test', description: 'test' })
    .expect(400);
});

it('fails without a title value', async () => {
  const cookie = await global.signin();

  await request(app)
    .post('/api/subs/')
    .set('Cookie', cookie)
    .send({ name: 'test', description: 'test' })
    .expect(400);
});

it('succeeds with valid values', async () => {
  const cookie = await global.signin();

  await request(app)
    .post('/api/subs/')
    .set('Cookie', cookie)
    .send({ title: 'name', name: 'test', description: 'test' })
    .expect(200);

  const sub = Sub.findOne({ where: { name: 'test' } });
  expect(sub).toBeDefined();
});

it('fails when sub already exists', async () => {
  const cookie = await global.signin();

  await request(app)
    .post('/api/subs/')
    .set('Cookie', cookie)
    .send({ title: 'test', name: 'test', description: 'test' })
    .expect(200);

  await request(app)
    .post('/api/subs/')
    .set('Cookie', cookie)
    .send({ title: 'test', name: 'test', description: 'test' })
    .expect(400);
});
