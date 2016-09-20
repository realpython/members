const knex = require('./connection');

function addCode(obj, callback) {
  return knex('codes')
  .insert(obj)
  .returning('*')
  .then((code) => {
    callback(null, code);
  })
  .catch((err) => {
    callback(err);
  });
}

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

function updateCodeFromVerifyCode(verifyCode) {
  return knex('codes')
  .update({
    used: true
  })
  .where('verify_code', verifyCode)
  .returning('*');
}

module.exports = {
  addCode,
  getUnunsedCodes: getUnunsedCodes,
  getCodeFromVerifyCode: getCodeFromVerifyCode,
  updateCodeFromVerifyCode: updateCodeFromVerifyCode
};
