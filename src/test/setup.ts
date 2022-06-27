import { getConnection } from 'typeorm';
import { createTypeormConnection } from '../Utils/createTypeormConnection';

beforeAll(async () => {
  const dbConnection = await createTypeormConnection();
  console.log(dbConnection.isConnected);
  console.log('running before all');
});

beforeEach(async () => {
  const connection = getConnection();
  console.log('running before each test', connection);
});

afterAll(async () => {
  const connection = getConnection();
  await connection.close();
});
