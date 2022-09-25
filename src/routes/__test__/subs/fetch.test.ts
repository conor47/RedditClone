import request from 'supertest';
import Sub from '../../../entity/Sub';

import app from '../../../server';

it('succeeds fetching all subs', async () => {
  const cookie = await global.signin();

  await request(app)
    .post('/api/subs/')
    .set('Cookie', cookie)
    .send({ title: 'name', name: 'test', description: 'test' })
    .expect(200);

  await request(app)
    .post('/api/subs/')
    .set('Cookie', cookie)
    .send({ title: 'test1', name: 'test1', description: 'test1' })
    .expect(200);

  const res = await request(app).get('/api/subs').send().expect(200);

  expect(res.body).toHaveLength(2);
});

it('succeeds searching for subs', async () => {
  const cookie = await global.signin();

  await request(app)
    .post('/api/subs/')
    .set('Cookie', cookie)
    .send({ title: 'name', name: 'askreddit', description: 'test' })
    .expect(200);

  await request(app)
    .post('/api/subs/')
    .set('Cookie', cookie)
    .send({ title: 'test1', name: 'gaming', description: 'test1' })
    .expect(200);

  const res = await request(app).get('/api/subs/search/ask').send().expect(200);

  expect(res.body).toHaveLength(1);
});
