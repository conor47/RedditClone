import request from 'supertest';

import app from '../../../server';

it('fails when not logged in', async () => {
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

  const newPost = await request(app)
    .patch(`/api/posts/${identifier}/${slug}`)
    .send({ body: 'update' })
    .expect(401);
});

it('fails when post does not exist', async () => {
  const cookie = await global.signin();

  await request(app)
    .post('/api/subs/')
    .set('Cookie', cookie)
    .send({ name: 'test', title: 'test', description: 'test' })
    .expect(200);

  await request(app)
    .patch(`/api/posts/asdlkj/laksjd`)
    .set('Cookie', cookie)
    .send({ body: 'update' })
    .expect(500);
});

it('successfully updates existing post', async () => {
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

  const newPost = await request(app)
    .patch(`/api/posts/${identifier}/${slug}`)
    .set('Cookie', cookie)
    .send({ body: 'update' })
    .expect(200);

  expect(newPost.body.body).toEqual('update');
});
