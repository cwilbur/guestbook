$(document).ready(function() {

  $('#login-button').on('click', function() {
    window.location.href = '/auth/github';
  });

  $('#logout-button').on('click', function() {
    window.location.href = '/auth/logout';
  });

  $('#fake-login-button').on('click', function() {
    var username = $('#fake-username').val();
    if (username.length > 0) {
      $.ajax({
        url: '/auth/fakelogin',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
          username: username
        })
      }).done(function(data) {
        console.log('login post success');
      }).fail(function(jqXHR, textStatus, errorThrown) {
        console.log('login post failure - ' + textStatus + ' - ' + errorThrown);
      });
    }
  });

});
