# NC News

Link to hosted version: https://nc-news-phil-w.herokuapp.com/api

## Summary

This project was part of my NorthCoders' Coding Bootcamp back-end module. The challenge was to develop the API for a News app.

Provided with a database of ...

- users
- topics
- articles
- comments

... endpoints were then set up using express.js as the framework for HTTP utility methods and middleware, with logic to handle GET, POST, PATCH and DELETE requests, including query-handling (aimed at users) and error-handling (aimed at developers).

## Cloning

To clone this repo, click 'code', grab the url and run

`git clone >url_here<`

Install dependencies by running

`npm install`

## Setup

Ensure scripts include

```
"scripts": {
    "setup-dbs": "psql -f ./db/setup.sql"
    }
```
and
```
"scripts": {
    "seed": "node ./db/seeds/run-seed.js"
    }
```

Which, in that order, will create and seed the database locally.

## Testing

For convenience, the test file will re-seed on each run, with the following script
```
"scripts": {
    "test": "jest"
    }
```
## Hosting with Heroku

(See above for a link to an already-hosted version)

You will need a Heroku account to create your app in an active git directory. Doing this in the folder where your cloned server exists is a good start, as this is what you will be hosting.

Configure your add-ons to use **Heroku Postgres**

```
heroku addons:create heroku-postgresql:hobby-dev
```

When you are ready to host, the following script will establish the production environment variable, set it to whatever Heroku provides as your database's URL, and seed the production database.

```
"scripts": {
    "seed:prod": "NODE_ENV=production DATABASE_URL=$(heroku config:get DATABASE_URL) npm run seed"
  }
```

Ensure you have a start script
```
"scripts": {
    start": "node listen.js"
    }
```
Commit your changes with `git push heroku main`

... then run `heroku open`


# NOTES TO USERS

## Variable Environment

Anyone who wishes to clone this repo will not have access to the necessary environment variables.

You must add two .env files to the root directory, pointing to the databases you wish to connect to, eg:

- .env.test (PGDATABASE=<your_test_database>)
- .env.development (PGDATABASE=<your_dev_database>)

(See .env.example )

## Requirements

As a minumum, you will need

- Node.js v???? or later
- Postgres v???? or later
