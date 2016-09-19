# Members

Just a simple learning management system for textbook-like sites, powering Real Python.

[![Build Status](https://travis-ci.org/realpython/members.svg?branch=master)](https://travis-ci.org/realpython/members)
[![Coverage Status](https://coveralls.io/repos/github/realpython/members/badge.svg?branch=master)](https://coveralls.io/github/realpython/members?branch=master)
[![bitHound Overall Score](https://www.bithound.io/github/realpython/members/badges/score.svg)](https://www.bithound.io/github/realpython/members)
[![Code Climate](https://codeclimate.com/github/realpython/members/badges/gpa.svg)](https://codeclimate.com/github/realpython/members)
[![dependencies Status](https://david-dm.org/realpython/members/status.svg)](https://david-dm.org/realpython/members)
[![devDependencies Status](https://david-dm.org/realpython/members/dev-status.svg)](https://david-dm.org/realpython/members?type=dev)

1. [Staging Server](https://fast-mesa-25213.herokuapp.com/)

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
1. Run server
  - `gulp`

## Commands

1. Run dev server: `gulp`
1. Run tests: `gulp test`
1. Run tests with coverage: `gulp coverage`
1. Create build: `gulp build`

> Run `gulp help` to list all available commands

## Notes

1. Make sure to drop the database before running the seed!
1. Updates (`development` and `testing` only):
  - admin status: `curl -X PUT -d admin=true http://localhost:3000/users/<USERNAME>/admin`
  - active status: `curl -X PUT -d active=true http://localhost:3000/users/<USERNAME>/active`
1. Make sure to update the fixtures (*/test/fixtures/data.js*) whenever the DB schema is updated
1. User auth flow -> unregistered -> unverified -> active

## Development Notes

1. [Tasks](./tasks.md)
1. [User stories](./stories.md)
