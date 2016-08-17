# Members

Just a simple learning management system for textbook-like sites, powering Real Python.

1. [Staging Server]()
1. [Production]()

## Getting Started

1. Fork/Clone
1. Install dependencies
1. Rename *.env-sample* to *.env* and then update
1. Create the development and test Postgres DBs:
  - `createdb members`
  - `createdb members_test`
1. Run development migrations:
  - `knex migrate:latest --env development`
1. Run seed:
  - `knex seed:run --env development`
1. Run tests:
  - `npm test`
1. Run server
  - `gulp`

## Create build

Run: `gulp build`

This will minify and uglify code, copy all files over to a *build* directory, and then run a development server.

Then run the tests:
- `npm run build`
- `npm run coverage`

## Notes

1. Make sure to drop the database before running the seed!
1. Updates (`development` and `testing` only):
  - admin status: `curl -X PUT -d admin=true http://localhost:3000/users/<USERNAME>/admin`
  - active status: `curl -X PUT -d active=true http://localhost:3000/users/<USERNAME>/active`
1. Make sure to update the fixtures (*/test/fixtures/data.js*) whenever the DB schema is updated
1. User auth flow -> unregistered -> unverified -> active

## Development

1. [Tasks](./tasks.md)
1. [User stories](./stories.md)
