var knex = require('./knex');

function getUnunsedCodes() {
  return knex('codes')
  .where('used', false)
  .select('*');
}

function getActiveUnunsedCodes() {
  return knex('codes')
  .where('used', false)
  .where('active', true)
  .select('*');
}

function getCodeFromVerifyCode(verifyCode) {
  return knex('codes')
  .where('verify_code', verifyCode)
  .select('*');
}

function getActiveUnunsedCodesFromVerifyCode(verifyCode) {
  return knex('codes')
  .where('used', false)
  .where('active', true)
  .where('verify_code', verifyCode)
  .select('*');
}

function getCodeFromID(verifyID) {
  return knex('codes')
  .where('id', verifyID)
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

function markCodeInactiveFromVerifyCode(verifyCode) {
  return knex('codes')
  .update({
    active: false
  })
  .where('verify_code', verifyCode)
  .returning('*');
}

module.exports = {
  getUnunsedCodes: getUnunsedCodes,
  getActiveUnunsedCodes: getActiveUnunsedCodes,
  getCodeFromVerifyCode: getCodeFromVerifyCode,
  getActiveUnunsedCodesFromVerifyCode: getActiveUnunsedCodesFromVerifyCode,
  getCodeFromID: getCodeFromID,
  addCode: addCode,
  updateCodeFromVerifyCode: updateCodeFromVerifyCode,
  markCodeInactiveFromVerifyCode: markCodeInactiveFromVerifyCode
};
