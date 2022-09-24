import { getConnection } from 'typeorm';
import app from '../server';
import request from 'supertest';
import { createTypeormConnection } from '../Utils/createTypeormConnection';

declare global {
  var signin: () => Promise<string[]>;
}

beforeAll(async () => {
  await createTypeormConnection();
});

beforeEach(async () => {
  const entities = getConnection().entityMetadatas;
  for (const entity of entities) {
    const repository = getConnection().getRepository(entity.name); // Get repository
    await repository.query(
      `TRUNCATE ${entity.tableName} RESTART IDENTITY CASCADE;`
    );
  }
});

afterAll(async () => {
  await getConnection().close();
});

global.signin = async () => {
  const username = 'john';
  const email = 'jonh@mail.com';
  const password = '123456';

  await request(app)
    .post('/api/auth/register')
    .send({ username, email, password })
    .expect(200);

  const response = await request(app)
    .post('/api/auth/login')
    .send({ username, password })
    .expect(200);

  const cookies = response.get('Set-Cookie');
  return cookies;
};
