process.env.NODE_ENV = 'test';

var routeHelpers = require('../../src/server/routes/_helpers');
var data = require('./data');

// TODO: add more fictures!

describe('routes : helpers', function() {
  describe('reducedResults()', function() {
    it('should format data correctly', function(done) {
      routeHelpers.reduceResults(data.base).should.eql(data.reduced);
      done();
    });
  });
  describe('convertArray()', function() {
    it('should format data correctly', function(done) {
      var reducedResults = routeHelpers.reduceResults(data.base);
      routeHelpers.convertArray(reducedResults).should.eql(
        data.converted);
      done();
    });
  });
  describe('sortLessonsByOrderNumber()', function() {
    it('should format data correctly', function(done) {
      var reducedResults = routeHelpers.reduceResults(data.base);
      var chapters = routeHelpers.convertArray(reducedResults);
      routeHelpers.sortLessonsByOrderNumber(chapters).should.eql(
        data.sorted);
      done();
    });
  });
  describe('getTotalLessons()', function() {
    it('should format data correctly', function(done) {
      var reducedResults = routeHelpers.reduceResults(data.base);
      var chapters = routeHelpers.convertArray(reducedResults);
      var sorted = routeHelpers.sortLessonsByOrderNumber(chapters);
      routeHelpers.getTotalLessons(sorted).should.eql(data.totalLessons);
      done();
    });
  });
  describe('getCompletedLessons()', function() {
    it('should format data correctly', function(done) {
      var reducedResults = routeHelpers.reduceResults(data.base);
      var chapters = routeHelpers.convertArray(reducedResults);
      var sorted = routeHelpers.sortLessonsByOrderNumber(chapters);
      var total = routeHelpers.getTotalLessons(sorted);
      routeHelpers.getCompletedLessons(total).should.eql(
        data.completedLessons);
      done();
    });
  });
});
