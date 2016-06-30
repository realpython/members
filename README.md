# Textbook

[![Build Status](https://travis-ci.org/mjhea0/textbook.svg?branch=master)](https://travis-ci.org/mjhea0/textbook)
[![Coverage Status](https://coveralls.io/repos/github/mjhea0/textbook/badge.svg?branch=master)](https://coveralls.io/github/mjhea0/textbook?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/752d6403c16544b4aef8dca5ed6c2bb5)](https://www.codacy.com/app/hermanmu/textbook?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=mjhea0/textbook&amp;utm_campaign=Badge_Grade)

Just a simple learning management system for textbook-like sites.

[Staging Server](http://textbook-lms.herokuapp.com/)

## Getting Started

1. Install dependencies
1. Create the Postgres DB
1. Run Migrations
1. Run Seed
1. Run server

> Make sure to drop the database before running the seed!

Update a user's admin status (`development` and `testing` only):

```sh
$ curl -X PUT -d admin=true http://localhost:3000/users/<USERNAME>/admin
```

## Development

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

### User Stories

#### Complete

**Unregistered Users**

1. Unregistered users should be able to log in via Github

**Users**

1. Users should be able to view all the chapters
1. Users should be able to view chapters on the sidebar
1. Users should be able to view a single chapter
1. Users should be able to view their profile
1. Users should be able to view a single lesson
1. Users should be able to view a chapter's lessons from the single chapter view
1. Users should be able to view a checkmark next to read lessons on the sidebar
1. Users should be able to mark a lesson as read or unread from the single lesson view

**Admin**

1. Admin should be able to view all chapters
1. Admin should be able to add new users
1. Users should be able to view lessons on the sidebar

#### Incomplete

1. Users should be able to view their overall progress on the dashboard (based on read lessons) (current)
1. Users should be able to view a checkmark next to read chapters on the sidebar after all lessons have been read
1. Users should be able to move from lesson to lesson within the single lesson view
1. Users should be able to hide/show lessons on the sidebar
1. Users should be able to see the current chapter and lesson highlighted on the sidebar
1. Users should be able to view all standards
1. Users should be able to view an about page detailing the relationship between chapters, lessons, standards, and exercises
1. Users should be able to post new messages within the lesson view
1. Users should be able to reply to messages within the lesson view
1. Admin should be able to view all chapters
1. Admin should be able to add new chapters
1. Unregistered users should have to enter an email and a numeric code to register and become an unverified user
1. Unverified users should have to connect their Github account to become verified
1. Users should be able to submit exercises for grading
1. Users should be able to hide/show the sidebar
1. Users should be able to view a Github avatar on the navbar
1. Admin should be able to update users
1. Users should be able to see their recent activity log on the dashboard
1. Users should be able to view a breadcrumb-like navigation
1. Users should be able to view the chapter overview from the single chapter view
1. Admin should be able to delete users
1. User should be able to contact support

### Todo

1. Set up error logging
1. Add uncaught exception handler
1. Separate API routes from server side templating routes
