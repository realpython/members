// scripts for when an admin is logged in

$(function() {
  // add stuff here
});

// ** messages ** //

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

// confirm deactivate message
$(document).on('click', '.deactivate-link', function() {
  var $this = $(this);
  var result;
  if ($this.hasClass('deactivate-parent')) {
    result = confirm('Are you sure? This will deactivate all replies.');
  } else {
    result = confirm('Are you sure?');
  }
  if (result) {
    return true;
  } else {
    return false;
  }
});

// ** admin chapters ** //

// confirm deactivate chapter
$(document).on('click', '.deactivate-chapter-link', function() {
  var $this = $(this);
  var result = confirm('Are you sure? This will deactivate all associated lessons.');
  if (result) {
    return true;
  } else {
    return false;
  }
});

// populate update chapter modal
$(document).on('click', '.update-chapter-button', function() {
  var $this = $(this);
  var chapterID = parseInt($this.data('chapter-id'));
  $('#update-chapter-form')[0].reset();
  $.ajax({
    type: 'GET',
    url: '/admin/chapters/' + chapterID
  })
  .done(function(results) {
    var data = results.data;
    $('#update-chapter-form').data('chapter-id', data.id);
    $('#update-chapter-order-number').val(data.order_number);
    $('#update-chapter-name').val(data.name);
    if (data.active) {
      $('#update-chapter-active').prop('checked', true);
    }
  })
  .fail(function(error) {
    // TODO: handle this error better!
    console.log(error);
  });
});

$('#update-chapter-form').on('submit', function(event) {
  event.preventDefault();
  var $this = $(this);
  var chapterID = parseInt($this.data('chapter-id'));
  var payload = {
    chapterOrderNumber: $('#update-chapter-order-number').val(),
    chapterName: $('#update-chapter-name').val(),
    chapterActive: $('#update-chapter-active').prop('checked')
  };
  $.ajax({
    type: 'PUT',
    data: payload,
    url: '/admin/chapters/' + chapterID
  })
  .done(function(results) {
    // TODO: flash success message
    window.location.replace('/admin/chapters');
  })
  .fail(function(error) {
    // TODO: handle this error better!
    console.log(error);
  });
});

// ** admin users ** //

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
    // clear old append (if necessary)
    $("#update-verify-code > option").each(function() {
      if ($(this).attr('selected')) {
        $(this).remove();
      }
    });
    // append current code and id to select
    if (data.verify_code_id === null) {
      data.verify_code_id = '';
    } else {
      $('#update-verify-code')
        .append($('<option></option>')
        .attr('value', data.verify_code_id)
        .attr('selected', 'selected')
        .text(data.verify_code));
    }
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
    active: $('#update-user-active').prop('checked'),
    verify_code: $('#update-verify-code').val()
  };
  $.ajax({
    type: 'PUT',
    data: payload,
    url: '/admin/users/' + userID
  }).done(function(results) {
    // TODO: flash success message
    console.log('success!');
    window.location.replace('/admin/users');
  }).fail(function(error) {
    // TODO: handle this error better!
    console.log(error);
  });
});

// ** admin lessons ** //

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
