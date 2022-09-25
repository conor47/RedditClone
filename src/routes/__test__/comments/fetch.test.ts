import request from 'supertest';

import app from '../../../server';

it('fails when when comment does not exist', async () => {
  await request(app).get(`/api/comments/asdas`).send().expect(400);
});

it('succeeds fetching single comment when comment exists', async () => {
  const cookie = await global.signin();

  await request(app)
    .post('/api/subs/')
    .set('Cookie', cookie)
    .send({ name: 'test', title: 'test', description: 'test' })
    .expect(200);

  const post = await request(app)
    .post('/api/posts/textPost')
    .set('Cookie', cookie)
    .send({ title: 'test', body: 'test', sub: 'test' })
    .expect(200);

  const { identifier: postIdentifier, slug } = post.body;

  const comment = await request(app)
    .post(`/api/comments/${postIdentifier}/${slug}`)
    .set('Cookie', cookie)
    .send({ body: 'test' })
    .expect(201);
  const { identifier: commentIdentifier } = comment.body;

  const fetchedComment = await request(app)
    .get(`/api/comments/${commentIdentifier}`)
    .send()
    .expect(200);

  expect(fetchedComment.body).toBeDefined();
});

it('succeeds fetching all comments', async () => {
  const cookie = await global.signin();

  await request(app)
    .post('/api/subs/')
    .set('Cookie', cookie)
    .send({ name: 'test', title: 'test', description: 'test' })
    .expect(200);

  const post = await request(app)
    .post('/api/posts/textPost')
    .set('Cookie', cookie)
    .send({ title: 'test', body: 'test', sub: 'test' })
    .expect(200);

  const { identifier: postIdentifier, slug } = post.body;

  await request(app)
    .post(`/api/comments/${postIdentifier}/${slug}`)
    .set('Cookie', cookie)
    .send({ body: 'test' })
    .expect(201);
  await request(app)
    .post(`/api/comments/${postIdentifier}/${slug}`)
    .set('Cookie', cookie)
    .send({ body: 'test2' })
    .expect(201);

  const comments = await request(app).get('/api/comments').send().expect(200);

  expect(comments.body).toHaveLength(2);
});

it('succeeds fetching all comments on a single post', async () => {
  const cookie = await global.signin();

  await request(app)
    .post('/api/subs/')
    .set('Cookie', cookie)
    .send({ name: 'test', title: 'test', description: 'test' })
    .expect(200);

  const post = await request(app)
    .post('/api/posts/textPost')
    .set('Cookie', cookie)
    .send({ title: 'test', body: 'test', sub: 'test' })
    .expect(200);

  const { identifier: postIdentifier, slug } = post.body;

  await request(app)
    .post(`/api/comments/${postIdentifier}/${slug}`)
    .set('Cookie', cookie)
    .send({ body: 'test' })
    .expect(201);
  await request(app)
    .post(`/api/comments/${postIdentifier}/${slug}`)
    .set('Cookie', cookie)
    .send({ body: 'test2' })
    .expect(201);

  const comments = await request(app)
    .get(`/api/comments/${postIdentifier}/${slug}/comments`)
    .send()
    .expect(200);

  expect(comments.body).toHaveLength(2);
});
