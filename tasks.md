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
  - heroku run knex migrate:latest --env staging --remote stage
  - heroku run knex seed:run --env staging --remote stage
1. Deploy to production server
  - heroku run knex migrate:latest --env staging --remote prod
  - heroku run knex seed:run --env staging --remote prod

## Todo

### Alpha

1. Deploy to production
  - add gulp
  - add build process
  - update testing directory
  - prep 'build'
  - set up production server
  - update contact page
  - verification
    - add verify codes to users
    - add list of verify codes to .env
    - update admin users page
  - style/rebrand for real python
  - update gulp tasks
  - update production seed

### Beta

1. Add stripe/braintree for user verification in beta
1. Separate API routes from server side templating routes
1. Swagger docs for the handlers returning JSON
1. Add front end tests with selenium/webdriver
1. Convert ORM to massive.js from knex
1. Add full text search indexing with massive.js
1. Add flash to res object for testing purposes
1. Add server side validation
1. Add Amazon S3 Bucket for Avatars
1. Convert Swig to Nunjucks
1. Add [sonar](http://xseignard.github.io/2013/04/25/quality-analysis-on-node.js-projects-with-mocha-istanbul-and-sonar/)
1. Refactor into es6
1. Update all dependencies
1. Address code complexity issues
1. Format search results page
1. Add mentor schedule
1. Add calendar for blog posts (drafts, submissions) and marketing campaigns
1. Add Google Analytics
1. Add express-validator
1. Update error pages
1. Add more/better tests for error handling
1. Modularize code
1. Compotenize project structure
1. set up production mailer
1. Install https://github.com/RafalWilinski/express-status-monitor
1. Close source the repo
