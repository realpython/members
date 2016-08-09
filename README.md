# Textbook

[![Build Status](https://travis-ci.org/mjhea0/textbook.svg?branch=master)](https://travis-ci.org/mjhea0/textbook)
[![Coverage Status](https://coveralls.io/repos/github/mjhea0/textbook/badge.svg?branch=master)](https://coveralls.io/github/mjhea0/textbook?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/752d6403c16544b4aef8dca5ed6c2bb5)](https://www.codacy.com/app/hermanmu/textbook?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=mjhea0/textbook&amp;utm_campaign=Badge_Grade)
[![bitHound Overall Score](https://www.bithound.io/github/mjhea0/textbook/badges/score.svg)](https://www.bithound.io/github/mjhea0/textbook)
[![Code Climate](https://codeclimate.com/github/mjhea0/textbook/badges/gpa.svg)](https://codeclimate.com/github/mjhea0/textbook)
[![dependencies Status](https://david-dm.org/mjhea0/textbook/status.svg)](https://david-dm.org/mjhea0/textbook)
[![devDependencies Status](https://david-dm.org/mjhea0/textbook/dev-status.svg)](https://david-dm.org/mjhea0/textbook?type=dev)

Just a simple learning management system for textbook-like sites.

1. [Staging Server](http://textbook-lms.herokuapp.com/)
1. [Production](http://fullweb.co/)

## Getting Started

1. Install dependencies
1. Rename *.env-sample* to *.env* and then update
1. Create the Postgres DB
1. Run migrations
1. Run seed
1. Run server

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
