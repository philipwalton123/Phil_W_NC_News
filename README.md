# NOTES TO USERS

## Variable Environment

Anyone who wishes to clone this repo will not have access to the necessary environment variables.

You must add two .env files to the root directory, pointing to the databases you wish to connect to, eg:

- .env.test (PGDATABASE=<your_test_database>)
- .env.development (PGDATABASE=<your_dev_database>)

(See .env.example )
