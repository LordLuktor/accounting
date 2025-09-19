exports.up = function(knex) {
  return knex.schema.createTable('integrations', function(table) {
    table.uuid('id').primary();
    table.uuid('business_id').notNullable().references('id').inTable('businesses').onDelete('CASCADE');
    table.string('provider').notNullable();
    table.string('provider_account_id').nullable();
    table.text('access_token').nullable();
    table.text('refresh_token').nullable();
    table.string('webhook_secret').nullable();
    table.json('settings').notNullable();
    table.boolean('is_active').defaultTo(true);
    table.timestamp('last_sync').nullable();
    table.timestamps(true, true);
    
    table.unique(['business_id', 'provider']);
    table.index(['business_id']);
    table.index(['provider']);
    table.index(['is_active']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('integrations');
};