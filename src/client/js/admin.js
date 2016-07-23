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

  // confirm delete message
  $(document).on('click', '.delete-link', function() {
    var result = confirm('Are you sure?');
    if (result) {
      return true;
    } else {
      return false;
    }
  });

  // populate update user modal
  $(document).on('click', '.update-user-button', function() {
    var $this = $(this);
    var userID = parseInt($this.data('user-id'));
    $('#update-user-form')[0].reset();
    $.ajax({
      type: 'GET',
      url: '/admin/users/' + userID
    }).done(function(results) {
      var data = results.data;
      $('#update-user-form').data('user-id', data.id);
      $('#update-github-username').val(data.github_username);
      $('#update-github-id').val(data.github_id);
      $('#update-github-display-name').val(data.github_display_name);
      $('#update-github-avatar').val(data.github_avatar);
      $('#update-user-email').val(data.email);
      $('#update-github-token').val(data.github_access_token);
      if (data.admin) {
        $('#update-user-admin').prop('checked', true);
      }
      if (data.verified) {
        $('#update-user-verified').prop('checked', true);
      }
    }).fail(function(error) {
      // TODO: handle this error better!
      console.log(error);
    });
  });

  $('#update-user-form').on('submit', function(event) {
    event.preventDefault();
    var $this = $(this);
    var userID = parseInt($this.data('user-id'));
    var payload = {
      githubUsername: $('#update-github-username').val(),
      githubID: $('#update-github-id').val(),
      githubDisplayName: $('#update-github-display-name').val(),
      githubToken: $('#update-github-token').val(),
      githubAvatar: $('#update-github-avatar').val(),
      email: $('#update-user-email').val(),
      admin: $('#update-user-admin').prop('checked'),
      verified: $('#update-user-verified').prop('checked')
    };
    $.ajax({
      type: 'PUT',
      data: payload,
      url: '/admin/users/' + userID
    }).done(function(results) {
      // TODO: flash success message
      window.location.replace('/admin/users');
    }).fail(function(error) {
      // TODO: handle this error better!
      console.log(error);
    });
  });

});
