exports.up = function(knex) {
  return knex.schema.createTable('accounts', function(table) {
    table.uuid('id').primary();
    table.uuid('business_id').notNullable().references('id').inTable('businesses').onDelete('CASCADE');
    table.uuid('parent_account_id').nullable().references('id').inTable('accounts').onDelete('SET NULL');
    table.string('name').notNullable();
    table.enum('account_type', ['asset', 'liability', 'equity', 'revenue', 'expense']).notNullable();
    table.string('account_code').notNullable();
    table.text('description').nullable();
    table.boolean('is_active').defaultTo(true);
    table.boolean('auto_generated').defaultTo(false);
    table.timestamps(true, true);
    
    table.unique(['business_id', 'account_code']);
    table.index(['business_id']);
    table.index(['account_type']);
    table.index(['is_active']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('accounts');
};