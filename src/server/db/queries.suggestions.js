var knex = require('./knex');

function addSuggestion(obj) {
  return knex('suggestions')
    .insert(obj)
    .returning('*');
}

module.exports = {
  addSuggestion: addSuggestion
};
