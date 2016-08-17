module.exports = {

  development: {
    client: 'postgresql',
    connection: 'postgres://localhost:5432/textbook',
    migrations: {
      directory: __dirname + '/src/server/db/migrations'
    },
    seeds: {
      directory: __dirname + '/src/server/db/seeds'
    }
  },
  test: {
    client: 'postgresql',
    connection: 'postgres://localhost:5432/textbook_test',
    migrations: {
      directory: __dirname + '/src/server/db/migrations'
    },
    seeds: {
      directory: __dirname + '/src/server/db/seeds'
    }
  },
  staging: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: __dirname + '/build/server/db/migrations'
    },
    seeds: {
      directory: __dirname + '/build/server/db/seeds'
    }
  },
  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: __dirname + '/build/server/db/migrations'
    },
    seeds: {
      directory: __dirname + '/build/server/db/seeds'
    }
  }

};
