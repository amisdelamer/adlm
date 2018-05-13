const Knex = require('knex');

function createTableDivingTeamKind(knex) {
  return knex.schema.createTable('DivingTeamKind', function(table) {
    table.text('value').primary();
  });
}

function createTableDiverStatus(knex) {
  return knex.schema.createTable('DiverStatus', function(table) {
    table.text('value').primary();
  });
}

function createTableDivingTeam(knex) {
  return knex.schema.createTable('DivingTeam', function(table) {
    table.uuid('id').primary();
    table
      .uuid('sessionId')
      .notNullable()
      .references('id')
      .inTable('DivingSession');
    table
      .text('kind')
      .notNullable()
      .references('value')
      .inTable('DivingTeamKind');
    table.integer('maxTime').notNullable();
    table.integer('maxDepth').notNullable();
    table.timestamp('startedAt');
    table.timestamp('endedAt');
    table.integer('measuredTime');
    table.integer('measuredMaxDepth');
    table.specificType('stops', 'integer[2][]');
    table.text('notes');
  });
}

function createTableDiver(knex) {
  return knex.schema.createTable('Diver', function(table) {
    table
      .uuid('userId')
      .notNullable()
      .references('id')
      .inTable('User');
    table
      .uuid('teamId')
      .notNullable()
      .references('id')
      .inTable('DivingTeam');
    table
      .text('status')
      .notNullable()
      .references('value')
      .inTable('DiverStatus');
    table.primary(['userId', 'teamId']);
  });
}

function main() {
  const knex = Knex({
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'adlm',
      password: 'adlm',
      database: 'adlm',
    },
  });

  return createTableDivingTeam(knex)
    .then(() => createTableDiver(knex))
    .return(true);
}

main();
