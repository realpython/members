# Tasks

## Set up

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

## Todo

### Alpha

1. Refactor read status for chapters and lessons
  - join table vs json field?
1. Update search to knex.js
1. Set up error logging
1. Add uncaught exception handler
1. Set up production mailer
1. Update auth helpers to actually check the database for permissions
1. Update styles
1. Deploy to production

### Beta

1. Add stripe/braintree for user verification in beta
1. Separate API routes from server side templating routes
1. Swagger docs for the handlers returning JSON
1. Add front end tests with selenium/webdriver
1. Convert ORM to massive.js from knex
1. Add flash to res object for testing purposes
1. Add server side validation
1. Add Amazon S3 Bucket for Avatars
1. Convert Swig to Nunjucks
1. Add [sonar](http://xseignard.github.io/2013/04/25/quality-analysis-on-node.js-projects-with-mocha-istanbul-and-sonar/)
