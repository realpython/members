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
    client: 'postgresql',
    connection: {
      database: 'textbook_test'
    },
    migrations: {
      directory: __dirname + '/src/server/db/migrations'
    },
    seeds: {
      directory: __dirname + '/src/server/db/seeds/test'
    }
  },
  staging: {
    client: 'postgresql',
    connection: {
      database: 'textbook_staging'
    },
    migrations: {
      directory: __dirname + '/src/server/db/migrations'
    },
    seeds: {
      directory: __dirname + '/src/server/db/seeds/test'
    }
  }

};
