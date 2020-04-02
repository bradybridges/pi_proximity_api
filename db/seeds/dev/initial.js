exports.seed = async function(knex) {
  try {
    await knex('log').del();
    await knex('log').insert([{ time: '00:00'}]);
  } catch(error) {
    console.log(`Error seeding data: ${error}`)
  }
}