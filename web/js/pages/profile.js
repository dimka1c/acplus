;
var jCropApi = null, oCropFile, imgUrl, ajaxProcessing = false, oSel = null;

function saveUser () {
  // if (ajaxProcessing) return;
  //
  // ajaxProcessing = true;

  // ToDo: get and validate data on profile form
  if (jCropApi) oSel = jCropApi.tellSelect();

  if (window.FormData)
  {
    // jCropApi.destroy();
    // jCropApi = null;

    // preparing data for ajax request
    let oFormData = new FormData();
    oFormData.append("uid", $('#uid').val());
    oFormData.append("name", $('#name').val());
    oFormData.append("photo", $('#photo').val());
    oFormData.append("login", $('#login').val());
    oFormData.append("email", $('#email').val());
    oFormData.append("phone", $('#phone').val());
    oFormData.append("pwd", $('#pwd').val());
    oFormData.append("pwd_confirm", $('#pwd_confirm').val());

    if (oSel) {
      oFormData.append("x", oSel.x);
      oFormData.append("y", oSel.y);
      oFormData.append("w", oSel.w);
      oFormData.append("h", oSel.h);
      oFormData.append("photo[]", oCropFile);
    }

    $.ajax(
      {
        url: '/profile/update',
        type: "POST",
        data: oFormData,
        processData: false,
        contentType: false,
        success: function(response)
        {
          // allow subsequent requests
          // ajaxProcessing = false;
          // ToDo: handle server errors
          if (response.reload === 1) {
            console.log(response.files);
            // $('#pwd').val('');
            // $('#pwd_confirm').val('');
            location.reload();
          }
        },
        error: function()
        {
          $('#status-messages')
            .removeClass('hide')
            .html('<p>Ошибка отправки формы</p>');
        }
      }
    );
  }
  else
  {
    resetImage();
    $('#status-messages')
      .removeClass('hide')
      .html('<p>Браузер не поддерживает javascript-объект FormData</p>');
  }

  // stop propagation of click event
  return false;
}

// clear file input, destroy Jcrop, return Profile src
function resetImage() {
  $('#photo').val('');
  if (jCropApi) jCropApi.destroy();
  $('#user-image').attr('src', imgUrl).removeAttr("style");
  return false;
}

// on document ready alternative
(function() {
  $('#profile-form').submit(saveUser);
  $('#profile-save').click(saveUser);

  $('#photo-add').click(function(){
    // emulate click on input
    $('#photo').click();
  });

  // save original image information
  imgUrl = $('#user-image').prop('src');
  // Reset image button click event
  $('#photo-reset').click(resetImage);

  // DONE: modify this agro.loc code for acplus profile page
  // Event that trigger on change of input element
  $('#photo').on('change', function(event){
    // on subsequent change events Jcrop should be reinitialised
    if (jCropApi) jCropApi.destroy();

    // get data of input field (!!!) the most important part of the code
    let $Files = $('#photo').prop('files');

    // validate input data
    let len = $Files.length, reader;
    // only one image acceptable
    if (len == 0 || len > 1) return;

    // saving image object
    oCropFile = $Files[0];
    // validation for images
    if (!!oCropFile.type.match(/image.*/) && oCropFile.size < 2097152) {
      $('#status-messages').addClass('hide');
      // check support of FileReader object in browser
      if ( window.FileReader ) {
        // init FileReader object
        reader = new FileReader();
        // on successful load of the file data run...
        reader.onloadend = function (e) {
          let imgCrop = $('#user-image');

          // set image src
          // Data URI src === e.target.result
          imgCrop.attr('src', e.target.result);
          // init Jcrop plugin to this newly created image
          imgCrop.Jcrop({setSelect: [50,5,200,100]}, function() { jCropApi = this; });
        };
        reader.readAsDataURL(oCropFile);
      } else {
        $('#status-messages')
          .removeClass('hide')
          .html('<p>Браузер не поддерживает javascript-объект FileReader()!</p>');
      }
    } else {
      // collect errors
      let $errors = [];
      if(!oCropFile.type.match(/image.*/))
        $errors.push('<p>Файл должен быть картинкой!</p>');
      if(oCropFile.size >= 2097152)
        $errors.push('<p>Файл должен меньше 2МБ!</p>');
      // show errors if some
      if ($errors.length) {
        $('#status-messages').removeClass('hide').html($errors.join());
        // clear input
        $('#photo').val('');
      }
    }
  });
}());