# Tasks

### Set up

1. Generate Express Boilerplate
1. Organize project structure
1. Update and install dependencies
1. Set up server side templates
1. Add flash messaging
1. Write tests
1. Set up Travis CI
1. Add code coverage
1. Add JSHint
1. Deploy to staging server
  - heroku run knex migrate:latest --env staging
  - heroku run knex seed:run --env staging

### Todo

1. Update search to knex.js
1. Convert ORM to massive.js from knex
1. Set up error logging
1. Add uncaught exception handler
1. Separate API routes from server side templating routes
1. Swagger docs for the handlers returning JSON
1. Add front end tests with selenium/webdriver
1. Add flash to res object for testing purposes
1. Add code quality/analysis tools
1. Add server side validation
1. Deploy to production
  - Add gulp for creating build/dist
1. Add Amazon S3 Bucket for Avatars
1. May need to refactor read status for chapters and lessons
