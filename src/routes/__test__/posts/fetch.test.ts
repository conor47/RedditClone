import request from 'supertest';

import app from '../../../server';

it('succeeds in fetching a single existing post', async () => {
  const cookie = await global.signin();

  await request(app)
    .post('/api/subs/')
    .set('Cookie', cookie)
    .send({ name: 'test', title: 'test', description: 'test' })
    .expect(200);

  const res = await request(app)
    .post('/api/posts/textPost')
    .set('Cookie', cookie)
    .send({ sub: 'test', body: 'test', title: 'test' })
    .expect(200);

  const identifier = res.body.identifier;
  const slug = res.body.slug;

  const post = await request(app)
    .get(`/api/posts/${identifier}/${slug}`)
    .send()
    .expect(200);

  expect(post.body).toBeDefined();
});

it('fails in fetching an non existing post', async () => {
  const cookie = await global.signin();

  const post = await request(app)
    .get(`/api/posts/asdas/asdas`)
    .send()
    .expect(404);
});
