exports.up = function(knex) {
  return knex.schema.createTable('businesses', function(table) {
    table.uuid('id').primary();
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('name').notNullable();
    table.text('description').nullable();
    table.string('industry').notNullable();
    table.string('tax_id').nullable();
    table.text('address').nullable();
    table.json('settings').notNullable();
    table.timestamps(true, true);
    
    table.index(['user_id']);
    table.index(['industry']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('businesses');
};