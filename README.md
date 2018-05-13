# Amis De La Mer

```bash
git clone git@github.com:amisdelamer/adlm.git
cd adlm
yarn
```

You need to setup a DB using Postgres 9.6 or over. You can dump `/src/db/schema.sql` to create init it and run `yarn db:seed` to insert basic data (mostly enums and admin user). Next you need to create env variables inside a `.env` file at the root of the project. You must change those values with the real ones (ask for.

```
DB_HOST="localhost"
DB_PORT=5432
DB_DATABASE="adlm"
DB_USER="adlm"
DB_PASSWORD="adlm"
DB_POOL_MIN=2
DB_POOL_MAX=10
```

```bash
# This will read from the DB so be sure it is running
yarn generate
# The two following commands must be ran in 2 terminals
yarn client
yarn server
```

You should be able to open [localhost:8080](http://localhost:8080) and login using `admin` / `admin`. (this is a lie currently)
