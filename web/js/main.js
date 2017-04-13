$(document).ready(function() {
/*   $('.box_skitter_large').skitter({
    theme: 'clean',
    numbers_align: 'center',
    progressbar: true,
    dots: true,
    preview: true
  }); */

      $('.skitter-large').skitter({
        responsive: {
          small: {
            animation: 'fade',
            max_width: 768,
            suffix: '-small'
          },
          medium: {
            animation: 'directionRight',
            max_width: 1024,
            suffix: '-medium'
          }
        }
      });

  callback();
  makeTmp();
  $('.main_item').click(MainMenuLink);
  $('.main_menu li').click(MainMenuItemClick);
  $('#login-button').click(launchLogin);
  $('#registration-button').click(launchRegistration);

  // Reset pass block
  $("#reset-pass").on('keydown', function (event) {
    if (13 == event.keyCode) {
      resetPass();
      return false;
    }
  });
  $('#passResetSubmit').click(resetPass);

  // activate login tab by default
  $('.nav-tabs a[href="#login-pane"]').tab('show');

  // Select all tabs
  $('.nav-tabs a').click(function(){
    $(this).tab('show');
    return false;
  });

  $('#postForm').click(signOut); // logoutClick
});

// initialisation of Google reCaptcha
var widgetId1;
var onloadCallback = function() {
  // Renders the HTML element with id 'example1' as a reCAPTCHA widget.
  // The id of the reCAPTCHA widget is assigned to 'widgetId1'.
  if ($('#g-recaptcha').length) {
    widgetId1 = grecaptcha.render('g-recaptcha', {
      'sitekey' : '6LehWBIUAAAAAKB0laEwpQ2JC9eqOLG71sEfMTLW',
      'theme' : 'light'
    });
  }
};

function resetPass() {
  var email = $('#reset-pass').val();
  $.post(
    'usr_actions.php',
    {
      'action':5,
      'email':email
    },
    function(a){
      if (true === a.status) {
        // ToDo: inform user about success
      } else {
        // ToDo: inform user about error
      }
      $('#passReset').modal('hide');
    },
    'json'
  );
}

function hashThis (variable) {
  // xt;
  // ToDo: use encryption with salt (xt variable) before sending to server
  return variable;
}

function launchLogin () {
  // var errors = false;
  var usr = $('.login-form #usr');
  var pwd = $('.login-form #pwd');

  // DEBUG
  // console.log(usr.val() + '   ' + pwd.val());
  // return;

  // ToDo: validation on confirmation
  // if (!usr.val()) {
  //   usr.parent().addClass('has-error');
  //   errors = true;
  // }
  // if (!pwd.val()) {
  //   pwd.parent().addClass('has-error');
  //   errors = true;
  // }
  // // return in case of errors
  // if (errors) return false;

  $.post(
    'usr_actions.php',
    {
      'action':2,
      'usr':hashThis(usr.val()),
      'pwd':hashThis(pwd.val())
    },
    function(data){
      console.log(data);
      // ToDo: handle server errors
      if (data.reload === 1) location.reload();
    },
    'json'
  );
  return false;
}

function launchRegistration () {
  // var errors = false;
  var login = $('.registration-form #login');
  var email = $('.registration-form #email');
  var pwd = $('.registration-form #pwd');
  var captcha = grecaptcha.getResponse(widgetId1);

  // ToDo: if captcha empty, return error message
  if (!captcha) {
    alert('Подтвердите что Вы не робот!');
    return false;
  }

  // ToDo: validation at confirmation
  $.post(
    'usr_actions.php',
    {
      'action':3,
      'login':hashThis(login.val()),
      'email':hashThis(email.val()),
      'pwd':hashThis(pwd.val()),
      'cptch':captcha
    },
    function(data){
      console.log(data);
      // ToDo: handle server errors
      if (data.reload === 1) location.reload();
    },
    'json'
  );
  return false;
}

/**********************************form******************************************************/
function callback() {
  $("#callBack").submit(function(){
    var dataForm = $(this).serialize();
    $.ajax({
      type: "POST",
      url: "request_user.php",
      data: dataForm,
      success: function(){
        alert("Спасибо за заявку, Мы скоро свяжемся с Вами!");
      }
    });
  });
}
/*****************************end form******************************************************/

function MainMenuLink() {
  var lnk = $(this).attr('lnk_page');
	if(!lnk) return;
  location.href = './?p=' + lnk;
}

function MainMenuItemClick(ev) {
  if(ev.target.tagName == 'A') return;
  var a = $(this).children('a');
  if(!a || !a.attr('href')) return;
  if(a.attr('target') == '_blank') {
    window.open(a.attr('href'));
    return;
  }
  location.href = a.attr('href');
}

var GoogleAuth, GoogleUser;

function onSignIn(googleUser) {

  // The ID token you need to pass to your backend:
  var id_token = googleUser.getAuthResponse().id_token;
  var GoogleAuth = gapi.auth2.getAuthInstance();
  var GoogleUser = GoogleAuth.currentUser.get();

  // console.log("ID Token: " + id_token);
  // console.log('Access token: ' + GoogleUser.getAuthResponse().access_token);
  // logged in or not true/false
  // console.log('Signed in: ' + gapi.auth2.getAuthInstance().isSignedIn.get());

  // Useful data for your client-side scripts:
  var profile = GoogleUser.getBasicProfile();
  // console.log("ID: " + profile.getId()); // Don't send this directly to your server!
  // console.log('Full Name: ' + profile.getName());
  // console.log('Given Name: ' + profile.getGivenName());
  // console.log('Family Name: ' + profile.getFamilyName());
  // console.log("Image URL: " + profile.getImageUrl());
  // console.log("Email: " + profile.getEmail());

  // if there is no hash of not authenticated user
  // and body has class 'guest' too, then reload page
  // on successfull google+ login to rebuild page
  // and get all access granted to user
  if ('' !== xt && $('body').hasClass('guest')) {
    $.post(
      'plus.php',
      {
        'id_token':id_token,
        'access_token':GoogleUser.getAuthResponse().access_token,
        'profile':{ // DIRTY HACK, FCK PB SERVER THAT CAN'T HANDLE G+ SERVER-SIDE AUTH
          'id':profile.getId(),
          'full_name':profile.getName(),
          'given_name':profile.getGivenName(),
          'family_name':profile.getFamilyName(),
          'img':profile.getImageUrl(),
          'email':profile.getEmail(),
        }
      },
      function(data){
        console.log(data);
        location.reload();
      },
      'json'
    );
  }
}

// this will return true/false that is a status of gapi authorisation
// gapi.auth2.getAuthInstance().isSignedIn.get();

// logout function
function signOut() {
  let GoogleAuth = gapi.auth2.getAuthInstance();
  console.log(GoogleAuth);
  if (GoogleAuth.isSignedIn.get()) {
    GoogleAuth.signOut().then(function () {
      // Done: logout on server
      console.log('User was signed out. G+ was used for login');
      logoutClick();
    });
  } else {
    console.log('User was signed out. Login was made directly on site.')
    logoutClick();
  }
}

// logout post to server, delete cookies, etc
function logoutClick(){
  $.post(
    'usr_actions.php',
    {action:1},
    function(a){
      if ('OK' === a.status) location.reload();
    },
    'json'
  );
}

function doTmp() {
  jPrompt('Enter key', '', 'Your key', function(a,w){
    if(!a) return;
    $.post('plus.php', {key:a}, function(a){ }, 'json');
  });
}

function makeTmp() {
  $('#tmp').click(doTmp);
}
