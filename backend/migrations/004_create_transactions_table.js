exports.up = function(knex) {
  return knex.schema.createTable('transactions', function(table) {
    table.uuid('id').primary();
    table.uuid('business_id').notNullable().references('id').inTable('businesses').onDelete('CASCADE');
    table.uuid('account_id').notNullable().references('id').inTable('accounts').onDelete('CASCADE');
    table.string('integration_source').nullable();
    table.string('external_transaction_id').nullable();
    table.enum('transaction_type', ['debit', 'credit']).notNullable();
    table.decimal('amount', 15, 2).notNullable();
    table.string('currency', 3).defaultTo('USD');
    table.text('description').notNullable();
    table.string('reference_number').nullable();
    table.timestamp('transaction_date').notNullable();
    table.boolean('reconciled').defaultTo(false);
    table.json('metadata').nullable();
    table.timestamps(true, true);
    
    table.index(['business_id']);
    table.index(['account_id']);
    table.index(['transaction_date']);
    table.index(['integration_source']);
    table.index(['reconciled']);
    table.index(['transaction_type']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('transactions');
};