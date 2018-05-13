const { spawnSync } = require('child_process');
const path = require('path');

spawnSync('pg_dump', [
  `--host=${process.env.DB_HOST}`,
  `--port=${process.env.DB_PORT}`,
  `--username=${process.env.DB_USER}`,
  `--password`,
  `--encoding=utf8`,
  `--file=${path.join(process.cwd(), 'src', 'db', 'schema.sql')}`,
  `--schema-only`,
  `--quote-all-identifiers`,
  `--oids`,
  `${process.env.DB_DATABASE}`,
]);
