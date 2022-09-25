import request from 'supertest';
import Comment from '../../../entity/Comment';

import app from '../../../server';

it('fails when not authenticated', async () => {
  const cookie = await global.signin();

  await request(app)
    .post('/api/subs/')
    .set('Cookie', cookie)
    .send({ name: 'test', title: 'test', description: 'test' })
    .expect(200);

  const res = await request(app)
    .post('/api/posts/textPost')
    .set('Cookie', cookie)
    .send({ title: 'test', body: 'test', sub: 'test' })
    .expect(200);

  const { identifier, slug } = res.body;

  await request(app)
    .post(`/api/comments/${identifier}/${slug}`)
    .send({ body: 'test' })
    .expect(401);
});

it('fails when post does not exist', async () => {
  const cookie = await global.signin();

  await request(app)
    .post(`/api/comments/asda/asdas`)
    .set('Cookie', cookie)
    .send({ body: 'test' })
    .expect(404);
});

it('succeeds with valid data', async () => {
  const cookie = await global.signin();

  await request(app)
    .post('/api/subs/')
    .set('Cookie', cookie)
    .send({ name: 'test', title: 'test', description: 'test' })
    .expect(200);

  const res = await request(app)
    .post('/api/posts/textPost')
    .set('Cookie', cookie)
    .send({ title: 'test', body: 'test', sub: 'test' })
    .expect(200);

  const { identifier, slug } = res.body;

  await request(app)
    .post(`/api/comments/${identifier}/${slug}`)
    .set('Cookie', cookie)
    .send({ body: 'test' })
    .expect(201);

  const comment = Comment.findOne({ where: { body: 'test' } });
  expect(comment).toBeDefined();
});
