process.env.NODE_ENV = 'test';

var routeHelpers = require('../../src/server/routes/_helpers');
var data = require('../fixtures/data');

// TODO: add more fixtures!
// TODO: DRY code

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
      routeHelpers.getTotalLessons(sorted).should.eql(7);
      done();
    });
  });
  describe('getCompletedLessons()', function() {
    it('should format data correctly', function(done) {
      var reducedResults = routeHelpers.reduceResults(data.base);
      var chapters = routeHelpers.convertArray(reducedResults);
      var sorted = routeHelpers.sortLessonsByOrderNumber(chapters);
      routeHelpers.getCompletedLessons(sorted).should.eql(0);
      done();
    });
  });
  describe('getPrevChapter()', function() {
    it('should return the previous chapter', function(done) {
      var result = routeHelpers.getPrevChapter(2, data.chapters);
      result.length.should.eql(1);
      done();
    });
  });
  describe('getPrevChapter()', function() {
    it('should not return the previous chapter', function(done) {
      var result = routeHelpers.getPrevChapter(1, data.chapters);
      result.length.should.eql(0);
      done();
    });
  });
  describe('getNextChapter()', function() {
    it('should return the next chapter', function(done) {
      var result = routeHelpers.getNextChapter(2, data.chapters);
      result.length.should.eql(1);
      done();
    });
  });
  describe('getNextChapter()', function() {
    it('should not return the next chapter', function(done) {
      var result = routeHelpers.getNextChapter(3, data.chapters);
      result.length.should.eql(0);
      done();
    });
  });
  describe('getParentMessages()', function() {
    it('should format data correctly', function(done) {
      var result = routeHelpers.getParentMessages(data.messages);
      result.length.should.eql(2);
      result[0].should.not.include.keys('replies');
      result[1].should.not.include.keys('replies');
      result.should.eql(data.parentMessages);
      done();
    });
  });
  describe('getChildMessages()', function() {
    it('should format data correctly', function(done) {
      var result = routeHelpers.getChildMessages(data.parentMessages, data.messages);
      result.length.should.eql(2);
      result[0].should.include.keys('replies');
      result[1].should.include.keys('replies');
      result[0].replies.length.should.eql(2);
      result[1].replies.length.should.eql(0);
      result.should.eql(data.childMessages);
      done();
    });
  });
  describe('getNextLessonOrderNum()', function() {
    it('should not return the next order number', function(done) {
      var result = routeHelpers.getNextLessonOrderNum(data.lessonOrders);
      result.should.eql(9);
      done();
    });
  });
  describe('getNextChapterOrderNum()', function() {
    it('should not return the next order number', function(done) {
      var result = routeHelpers.getNextChapterOrderNum(
        data.lessonChapterOrders);
      result.should.eql(7);
      done();
    });
  });
});
