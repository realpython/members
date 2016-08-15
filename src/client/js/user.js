// scripts for when a user is logged in

$(function() {
  addActiveClass();
  expandFirstUnreadChapter();
});

function addActiveClass() {
  var current = (location.pathname).split('/');
  if (current[1] === 'lessons') {
    $('#sidebar-chapters li ul li a').each(function() {
      var $this = $(this);
      if (($this.attr('href').indexOf(current[2]) !== -1) && ($this.attr('href').indexOf('lessons') !== -1)) {
        $this.closest('li').addClass('active-side');
        $this.closest('ul').addClass('in');
        return true;
      }
    });
  }
  return false;
}

function expandFirstUnreadChapter() {
  var current = (location.pathname).split('/');
  if (current[1] !== 'lessons' && current[1] !== 'search') {
    var elements = $('.sidebar-chapter-name');
    for (var i = 0; i < elements.length; i++) {
      var lessonReadElements = $(elements[i]).next().find('.side-nav-lessons');
      for (var j = 0; j < lessonReadElements.length; j++) {
        if (!($(lessonReadElements[j]).find('i').length)) {
          $($(elements[i]).attr('data-target')).addClass('in');
          return true;
        }
      }
    }
    $($(elements[0]).attr('data-target')).addClass('in');
    return true;
  }
  return false;
}
