process.env.NODE_ENV = 'test';

var chai = require('chai');

var logger = require('../../server/utils/logger.js');

var should = chai.should();

describe('utils : logger', function() {

  describe('The default logger', function () {
    it('should log without errors', function () {
      logger.debug('Test debug');
      logger.verbose('Test verbose');
      logger.info('Test info');
      logger.warn('Test warn');
      logger.error('Test error');
    });
  });

});
