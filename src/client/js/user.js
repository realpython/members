// scripts for when a user is logged in

$(function() {
  addActiveClass();
});

function addActiveClass() {
  var current = (location.pathname).split('/');
  if (current[1] === 'chapter') {
    $('#chapter-list li a').each(function() {
      var $this = $(this);
      if ($this.attr('href').indexOf(current[2]) !== -1) {
        $this.closest('li').addClass('list-group-item-success active-chapter');
        return true;
      }
    });
  }
  return false;
}
