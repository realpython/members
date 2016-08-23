function parseVerifyCodes(verifyCodes) {
  return verifyCodes.map(function(firstEl) {
    return {
      id: firstEl.id,
      verify_code: firstEl.verify_code
    };
  });
}

module.exports = {
  parseVerifyCodes: parseVerifyCodes
};
