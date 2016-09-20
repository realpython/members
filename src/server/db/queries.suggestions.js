var knex = require('./connection');

function getAllSuggestions() {
  return knex('suggestions')
  .select('*')
  .orderBy('created_at');
}

function addSuggestion(obj) {
  return knex('suggestions')
    .insert(obj)
    .returning('*');
}

module.exports = {
  getAllSuggestions: getAllSuggestions,
  addSuggestion: addSuggestion
};
