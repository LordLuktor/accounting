exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.uuid('id').primary();
    table.string('email').unique().notNullable();
    table.string('password_hash').notNullable();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.enum('role', ['admin', 'user']).defaultTo('user');
    table.enum('account_type', ['paid', 'free', 'invited', 'super_free']).defaultTo('paid');
    table.enum('subscription_status', ['active', 'inactive', 'trial', 'free']).defaultTo('trial');
    table.uuid('invited_by').nullable();
    table.timestamps(true, true);
    
    table.index(['email']);
    table.index(['account_type']);
    table.index(['subscription_status']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};