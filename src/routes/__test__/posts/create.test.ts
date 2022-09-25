import request from 'supertest';
import Post from '../../../entity/Post';

import app from '../../../server';

it('text post fails without title', async () => {
  const cookie = await global.signin();

  await request(app)
    .post('/api/posts/textPost')
    .set('Cookie', cookie)
    .send({ sub: 'test', body: 'test' })
    .expect(400);
});

it('text post fails without sub / invalid sub', async () => {
  const cookie = await global.signin();

  await request(app)
    .post('/api/posts/textPost')
    .set('Cookie', cookie)
    .send({ title: 'test', body: 'test' })
    .expect(400);

  await request(app)
    .post('/api/posts/textPost')
    .set('Cookie', cookie)
    .send({ title: 'test', body: 'test', sub: 'asdas' })
    .expect(400);
});

it('Succeeds with valid data', async () => {
  const cookie = await global.signin();

  await request(app)
    .post('/api/subs/')
    .set('Cookie', cookie)
    .send({ name: 'test', title: 'test', description: 'test' })
    .expect(200);

  await request(app)
    .post('/api/posts/textPost')
    .set('Cookie', cookie)
    .send({ title: 'test', body: 'test', sub: 'test' })
    .expect(200);

  const post = await Post.findOne({ where: { title: 'test', body: 'test' } });
  expect(post).toBeDefined();
});
