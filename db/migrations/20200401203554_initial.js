
exports.up = function(knex) {
  return knex.schema
    .createTable('log', function(table){
      table.increments('id').primary();
      table.string('time').string;
      table.timestamps(true, true);
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('log')
};
