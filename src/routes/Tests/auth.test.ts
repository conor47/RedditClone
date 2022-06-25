import request from 'supertest';
import app from '../../server';

it('responds with an HTTP 400 with invalid data', async () => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({ username: 'conor', email: 'conor', password: '123' })
    .expect(400);
});
