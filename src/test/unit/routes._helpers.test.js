process.env.NODE_ENV = 'test';

const routeHelpers = require('../../server/routes/_helpers');
const data = require('../fixtures/data');

// TODO: add more fixtures!
// TODO: DRY code

describe('routes : helpers', () => {
  describe('reducedResults()', () => {
    it('should format data correctly', (done) => {
      routeHelpers.reduceResults(data.base).should.eql(data.reduced);
      done();
    });
  });
  describe('convertArray()', () => {
    it('should format data correctly', (done) => {
      const reducedResults = routeHelpers.reduceResults(data.base);
      routeHelpers.convertArray(reducedResults).should.eql(
        data.converted);
      done();
    });
  });
  describe('sortLessonsByOrderNumber()', () => {
    it('should format data correctly', (done) => {
      const reducedResults = routeHelpers.reduceResults(data.base);
      const chapters = routeHelpers.convertArray(reducedResults);
      routeHelpers.sortLessonsByOrderNumber(chapters).should.eql(
        data.sorted);
      done();
    });
  });
  describe('getTotalActiveCompletedLessons()', () => {
    it('should format data correctly', (done) => {
      const reducedResults = routeHelpers.reduceResults(data.base);
      const chapters = routeHelpers.convertArray(reducedResults);
      const sorted = routeHelpers.sortLessonsByOrderNumber(chapters);
      const active = routeHelpers.getTotalActiveLessons(sorted);
      const completedLessons = [
        { id: 8, user_id: 1, lesson_id: 1, lesson_read: true },
        { id: 9, user_id: 1, lesson_id: 4, lesson_read: true },
        { id: 10, user_id: 1, lesson_id: 3, lesson_read: true }
      ];
      const expectedResults = routeHelpers.getTotalActiveCompletedLessons(
        active, completedLessons);
      const actualResults = [
        {
          id: 8,
          lesson_id: 1,
          lesson_read: true,
          user_id: 1
        },
        {
          id: 9,
          lesson_id: 4,
          lesson_read: true,
          user_id: 1
        },
        {
          id: 10,
          lesson_id: 3,
          lesson_read: true,
          user_id: 1
        }
      ];
      expectedResults.should.eql(actualResults);
      done();
    });
  });
  describe('getTotalActiveCompletedLessons()', () => {
    it('should format data correctly', (done) => {
      const reducedResults = routeHelpers.reduceResults(data.base);
      const chapters = routeHelpers.convertArray(reducedResults);
      const sorted = routeHelpers.sortLessonsByOrderNumber(chapters);
      const active = routeHelpers.getTotalActiveLessons(sorted);
      const completedLessons = [];
      const expectedResults = routeHelpers.getTotalActiveCompletedLessons(
        active, completedLessons);
      expectedResults.should.eql([]);
      done();
    });
  });

  describe('getPrevChapter()', () => {
    it('should return the previous chapter', (done) => {
      const result = routeHelpers.getPrevChapter(2, data.chapters);
      result.length.should.eql(1);
      done();
    });
  });
  describe('getPrevChapter()', () => {
    it('should not return the previous chapter', (done) => {
      const result = routeHelpers.getPrevChapter(1, data.chapters);
      result.length.should.eql(0);
      done();
    });
  });
  describe('getNextChapter()', () => {
    it('should return the next chapter', (done) => {
      const result = routeHelpers.getNextChapter(2, data.chapters);
      result.length.should.eql(1);
      done();
    });
  });
  describe('getNextChapter()', () => {
    it('should not return the next chapter', (done) => {
      const result = routeHelpers.getNextChapter(3, data.chapters);
      result.length.should.eql(0);
      done();
    });
  });
  describe('getParentMessages()', () => {
    it('should format data correctly', (done) => {
      const result = routeHelpers.getParentMessages(data.messages);
      result.length.should.eql(2);
      result[0].should.not.include.keys('replies');
      result[1].should.not.include.keys('replies');
      result.should.eql(data.parentMessages);
      done();
    });
  });
  describe('getChildMessages()', () => {
    it('should format data correctly', (done) => {
      const result = routeHelpers.getChildMessages(data.parentMessages, data.messages);
      result.length.should.eql(2);
      result[0].should.include.keys('replies');
      result[1].should.include.keys('replies');
      result[0].replies.length.should.eql(2);
      result[1].replies.length.should.eql(0);
      result.should.eql(data.childMessages);
      done();
    });
  });
  describe('getNextLessonOrderNum()', () => {
    it('should not return the next order number', (done) => {
      const result = routeHelpers.getNextLessonOrderNum(data.lessonOrders);
      result.should.eql(9);
      done();
    });
  });
  describe('getNextChapterOrderNum()', () => {
    it('should not return the next order number', (done) => {
      const result = routeHelpers.getNextChapterOrderNum(
        data.lessonChapterOrders);
      result.should.eql(7);
      done();
    });
  });
});
