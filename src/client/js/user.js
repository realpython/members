// scripts for when a user is logged in

$(function() {
  addActiveClass();
});

function addActiveClass() {
  var current = (location.pathname).split('/');
  if (current[1] === 'chapters') {
    $('#sidebar-chapters li a').each(function() {
      var $this = $(this);
      if (($this.attr('href').indexOf(current[2]) !== -1) && ($this.attr('href').indexOf('chapters') !== -1)) {
        $this.addClass('active-side');
        // $this.siblings('ul').addClass('in');
        return true;
      }
    });
  }
  if (current[1] === 'lessons') {
    $('#sidebar-chapters li ul li a').each(function() {
      var $this = $(this);
      if (($this.attr('href').indexOf(current[2]) !== -1) && ($this.attr('href').indexOf('lessons') !== -1)) {
        $this.closest('li').addClass('active-side');
        // $this.closest('ul').addClass('in');
        return true;
      }
    });
  }
  return false;
}
