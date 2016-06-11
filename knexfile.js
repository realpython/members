module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'textbook'
    },
    migrations: {
      directory: __dirname + '/src/server/db/migrations'
    },
    seeds: {
      directory: __dirname + '/src/server/db/seeds/dev'
    }
  },
  test: {
    client: 'sqlite3',
    connection: {
      filename: './test.db'
    },
    migrations: {
      directory: __dirname + '/src/server/db/migrations'
    },
    seeds: {
      directory: __dirname + '/src/server/db/seeds/test'
    }
  },
};