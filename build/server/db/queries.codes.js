var knex = require('./knex');

function getUnunsedCodes() {
  return knex('codes')
  .where('used', false)
  .select('*');
}

function getCodeFromVerifyCode(verifyCode) {
  return knex('codes')
  .where('verify_code', verifyCode)
  .select('*');
}

function addCode(obj) {
  return knex('codes')
  .insert(obj)
  .returning('*');
}

function updateCodeFromVerifyCode(verifyCode) {
  return knex('codes')
  .update({
    used: true
  })
  .where('verify_code', verifyCode)
  .returning('*');
}

module.exports = {
  getUnunsedCodes: getUnunsedCodes,
  getCodeFromVerifyCode: getCodeFromVerifyCode,
  addCode: addCode,
  updateCodeFromVerifyCode: updateCodeFromVerifyCode
};
