// scripts for when an admin is logged in

$(function() {

  // show/hide message reply input
  $(document).on('click', '.reply-link', function() {
    var $this = $(this);
    var messageID = parseInt($this.data('message-id'));
    var $replyInput = $('#message-reply-input-' + messageID);
    $replyInput.toggle();
    if ($replyInput.attr('data-status') === 'hidden') {
      $replyInput.attr('data-status', 'visible');
    } else {
      $replyInput.attr('data-status', 'hidden');
    }
  });

});
