import request from 'supertest';
import Comment from '../../../entity/Comment';

import app from '../../../server';

it('it fails when not authenticated', async () => {
  const cookie = await global.signin();

  await request(app)
    .patch('/api/comments/asdas')
    .send({ name: 'test', title: 'test', description: 'test' })
    .expect(401);
});

it('fails when comments does not exist', async () => {
  const cookie = await global.signin();

  await request(app)
    .patch(`/api/comments/asdsa`)
    .set('Cookie', cookie)
    .send({ body: 'test' })
    .expect(500);
});

it('fails when comments does not exist', async () => {
  const cookie = await global.signin();

  await request(app)
    .patch(`/api/comments/asdsa`)
    .set('Cookie', cookie)
    .send({ body: 'test' })
    .expect(500);
});

it('succeeds when the comment exists', async () => {
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

  const { identifier: postIdentifier, slug } = res.body;

  const res2 = await request(app)
    .post(`/api/comments/${postIdentifier}/${slug}`)
    .set('Cookie', cookie)
    .send({ body: 'test' })
    .expect(201);

  const { identifier: commentIdentifier } = res2.body;

  await request(app)
    .patch(`/api/comments/${commentIdentifier}`)
    .set('Cookie', cookie)
    .send({ body: 'update' })
    .expect(200);

  const comment = await Comment.findOne({ where: { body: 'update' } });
  expect(comment).toBeDefined();
});
