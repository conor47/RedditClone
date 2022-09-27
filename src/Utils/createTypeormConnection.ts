import { createConnection, getConnectionOptions } from 'typeorm';

export const createTypeormConnection = async () => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  console.log('connectin options', connectionOptions);
  console.log('node env', process.env.NODE_ENV);

  return createConnection({ ...connectionOptions, name: 'default' });
};
