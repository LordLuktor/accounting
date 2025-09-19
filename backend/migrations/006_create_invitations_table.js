exports.up = function(knex) {
  return knex.schema.createTable('invitations', function(table) {
    table.uuid('id').primary();
    table.string('email').notNullable();
    table.uuid('invited_by').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('invited_by_name').notNullable();
    table.enum('status', ['pending', 'accepted', 'expired']).defaultTo('pending');
    table.string('token').unique().notNullable();
    table.timestamp('expires_at').notNullable();
    table.timestamp('used_at').nullable();
    table.timestamps(true, true);
    
    table.index(['email']);
    table.index(['token']);
    table.index(['status']);
    table.index(['expires_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('invitations');
};