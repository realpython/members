# Textbook

[![Build Status](https://travis-ci.org/mjhea0/textbook.svg?branch=master)](https://travis-ci.org/mjhea0/textbook)
[![Coverage Status](https://coveralls.io/repos/github/mjhea0/textbook/badge.svg?branch=master)](https://coveralls.io/github/mjhea0/textbook?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/752d6403c16544b4aef8dca5ed6c2bb5)](https://www.codacy.com/app/hermanmu/textbook?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=mjhea0/textbook&amp;utm_campaign=Badge_Grade)

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

1. Users should be active to view the course content

**Active Users**

1. Active users should be able to view all the chapters
1. Active users should be able to view chapters on the sidebar
1. Active users should be able to view a single chapter
1. Active users should be able to view their profile
1. Active users should be able to view a single lesson
1. Active users should be able to view a chapter's lessons from the single chapter view
1. Active users should be able to view lessons on the sidebar
1. Active users should be able to view a checkmark next to read lessons on the sidebar
1. Active users should be able to mark a lesson as read or unread from the single lesson view
1. Active users should be able to view their overall progress on the dashboard (based on read lessons)
1. Active users should be able to move from lesson to lesson within the single lesson view
1. Active users should be able to view lessons on the sidebar in the correct order
1. Active users should be able to see the current chapter and lesson highlighted on the sidebar
1. Active users should be able to view a breadcrumb-like navigation
1. Active users should be able to view messages within the lesson view
1. Active users should have an avatar
1. Active users should be able to see who posted a particular message
1. Active users should be able to post new messages within the lesson view
1. Active users should be able to view a Github avatar on the navbar
1. Active users should be able to contact support
1. Active users should be able to search across all lessons
1. Active users should be able to hide/show lessons on the sidebar
1. Active users should only be able to view active lessons
1. Active users should be able to view their avatar link on the profile page
1. Active users should be able to update their display name on the profile page

**Admin**

1. Admin should be able to view all users
1. Admin should be able to add new users
1. Admin should be able to reply to messages within the lesson view
1. Admin should be able to delete messages, and all the respective replies, within the lesson view
1. Admin should be able to delete replies within the lesson view
1. Admin should be able to view all chapters
1. Admin should be able to add new chapters
1. Admin should be able to update users
1. Admin should be able to delete (change `active` to `false`) users
1. Admin should be able to view all lessons
1. Admin should be able to add new lessons to an existing chapter
1. Admin should be able to update lessons within the lesson view
1. Admin should be able to move the order of messages within the lesson view

#### Incomplete

1. Active users should be able to view a tag next to a message if it's posted by an admin within the lesson view (current)
1. Admin should be able to add an avatar link when adding a new user
1. Active users should be able to suggest new topics to be added to the course
1. Active users should be able to view a message and reply activity feed on the dashboard
1. Active users should be able to see their recent activity log on the dashboard
1. Active users should be able to view the total number of lessons in the course on the dashboard
1. Active users should be able to view the total number of enrolled students on the dashboard
1. Admin should be warned if they are deleting a message that contains replies within the lesson view
1. Admin should only be able to deactivate messages; they should not be deleted
1. Unregistered users should have to enter an email and a numeric code to register and become an unverified user
1. Unverified users should have to connect their Github account to become verified
1. Active users should be able to change courses
1. Admin should be able to switch courses within the lesson and chapter views
1. Admin should be able to filter table columns in the lesson, chapter, and user views
1. Active users should only be able to view active chapters
1. Admin should be able to delete (change `active` to `false`) lessons
1. Admin should be able to update lesson `content` with markdown
1. Active users should be able to update their email address on the profile page
1. Active users should be able to submit exercises for grading
1. Admin should be able to move the order of replies within the lesson view
1. Active users should be able to view a checkmark next to read chapters on the sidebar after all lessons have been read

### Todo

1. Set up error logging
1. Add uncaught exception handler
1. Separate API routes from server side templating routes
1. Swagger docs for the handlers returning JSON
1. Add front end tests with selenium/webdriver
1. Add flash to res object for testing purposes
1. Add code quality/analysis tools
1. Convert ORM to massive.js from knex
1. Add server side validation
1. Deploy to production
  - Add gulp for creating build/dist
1. Add Amazon S3 Bucket for Avatars
