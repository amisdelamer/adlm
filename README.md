# Amis De La Mer

## Requirements

Before beginning the setup process, ensure you have the following:

- Node 8+
- Yarn globally installed
- Postgres 9.6+

## Source code

```bash
git clone git@github.com:amisdelamer/adlm.git
cd adlm
yarn
touch .env
```

## Database

You need to setup a DB using Postgres 9.6 or over. First create a user for this project wit a password and give it login permission. Then create a new DB with this user at its creator. After that, you can dump `/src/db/schema.sql` to create the full schema and then run `yarn db:seed` to insert basic data (mostly enums and admin user). Next you need to copy/paste the following snippet to the `.env` file at the root of the project. You must change those values with the real ones you used.

```
DB_HOST="localhost"
DB_PORT=5432
DB_DATABASE="[db name]"
DB_USER="[user login]"
DB_PASSWORD="[user password]"
DB_POOL_MIN=2
DB_POOL_MAX=10
```

## Server configuration

You will need a few other configuration properties before running the server. They also go to the `.env` file.

```
SECRET="[at least 32 characters long password]"
```

## Run

```bash
# This will read from the DB so be sure it is running
yarn generate
# The two following commands must be ran in 2 terminals
yarn client
yarn server
```

You should be able to open [localhost:8080](http://localhost:8080) and login using `admin` / `admin`. (this is a lie currently)
