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
      if (data.active) {
        $('#update-user-active').prop('checked', true);
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
      verified: $('#update-user-verified').prop('checked'),
      active: $('#update-user-active').prop('checked')
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

  // populate update lesson modal
  $(document).on('click', '.update-lesson-button', function() {
    var $this = $(this);
    var lessonID = parseInt($this.data('lesson-id'));
    $('#update-lesson-form')[0].reset();
    $.ajax({
      type: 'GET',
      url: '/admin/lessons/' + lessonID
    }).done(function(results) {
      var data = results.data;
      $('#update-lesson-form').data('lesson-id', data.id);
      $('#update-lesson-order-number').val(data.lesson_order_number);
      $('#update-lesson-chapter-number').val(data.chapter_order_number);
      $('#update-lesson-name').val(data.name);
      $('#update-lesson-content').val(data.content);
      $('#update-lesson-chapter').val(data.chapter_id);
      if (data.read) {
        $('#update-lesson-read').prop('checked', true);
      }
      if (data.active) {
        $('#update-lesson-active').prop('checked', true);
      }
    }).fail(function(error) {
      // TODO: handle this error better!
      console.log(error);
    });
  });

  $('#update-lesson-form').on('submit', function(event) {
    event.preventDefault();
    var $this = $(this);
    var lessonID = parseInt($this.data('lesson-id'));
    var payload = {
      lessonOrderNumber: $('#update-lesson-order-number').val(),
      chapterOrderNumber: $('#update-lesson-chapter-number').val(),
      lessonName: $('#update-lesson-name').val(),
      lessonContent: $('#update-lesson-content').val(),
      lessonRead: $('#update-lesson-read').val(),
      lessonActive: $('#update-lesson-active').prop('checked'),
      chapter: $('#update-lesson-chapter').val()
    };
    $.ajax({
      type: 'PUT',
      data: payload,
      url: '/admin/lessons/' + lessonID
    }).done(function(results) {
      // TODO: flash success message
      window.location.replace('/admin/lessons');
    }).fail(function(error) {
      // TODO: handle this error better!
      console.log(error);
    });
  });

});
