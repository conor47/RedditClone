const rootDir =
  process.env.NODE_ENV === 'development' || 'test' ? 'src' : 'build';

module.exports = [
  {
    name: 'production',
    type: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    entities: [rootDir + '/entity/**/*{.ts,.js}'],
    migrations: [rootDir + '/migration/**/*{.ts,.js}'],
    subscribers: [rootDir + '/subscriber/**/*{.ts,.js}'],
    seeds: [rootDir + '/seeds/**/*{.ts,.js}'],
    cli: {
      entitiesDir: rootDir + '/entity',
      migrationsDir: rootDir + '/migration',
      subscribersDir: rootDir + '/subscriber',
    },
  },
  {
    name: 'development',
    type: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    entities: [rootDir + '/entity/**/*{.ts,.js}'],
    migrations: [rootDir + '/migration/**/*{.ts,.js}'],
    subscribers: [rootDir + '/subscriber/**/*{.ts,.js}'],
    seeds: [rootDir + '/seeds/**/*{.ts,.js}'],
    cli: {
      entitiesDir: rootDir + '/entity',
      migrationsDir: rootDir + '/migration',
      subscribersDir: rootDir + '/subscriber',
    },
  },
  {
    name: 'test',
    type: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_TEST,
    dropSchema: true,
    synchronize: true,
    logging: false,
    entities: [rootDir + '/entity/**/*.ts'],
    migrations: [rootDir + '/migration/**/*{.ts,.js}'],
    subscribers: [rootDir + '/subscriber/**/*{.ts,.js}'],
    cli: {
      entitiesDir: rootDir + '/entity',
      migrationsDir: rootDir + '/migration',
      subscribersDir: rootDir + '/subscriber',
    },
  },
  {
    name: 'default',
    type: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    entities: [rootDir + '/entity/**/*{.ts,.js}'],
    migrations: [rootDir + '/migration/**/*{.ts,.js}'],
    subscribers: [rootDir + '/subscriber/**/*{.ts,.js}'],
    seeds: [rootDir + '/seeds/**/*{.ts,.js}'],
    cli: {
      entitiesDir: rootDir + '/entity',
      migrationsDir: rootDir + '/migration',
      subscribersDir: rootDir + '/subscriber',
    },
  },
];
