function controllerChanged(e)
{
  let newController = $(this).val();
  // console.log(controllers[newController].methods);

  let $methods = $("#method");
  $methods.empty(); // remove old options
  $.each(controllers[newController].methods, function(key,value) {
    $methods.append($("<option></option>")
      .attr("value", value).text(value));
  });

  let $models = $("#model");
  $models.empty(); // remove old options
  $models.append($("<option></option>").attr("value", "none").text("none")); // none as default
  $.each(controllers[newController].models, function(key,value) {
    $models.append($("<option></option>")
      .attr("value", value).text(value));
  });
}

function constructedLinkSave()
{
  let data = {
    'controller': $("#controller").val(),
    'method': $("#method").val(),
    'model': $("#model").val()
  };
  // constructing url
  data['url'] = data['controller'];
  if(data['method'] && 'index' != data['method'])
    data['url'] += '/' + data['method'];
  if(data['model'] && 'none' != data['model'] && 'index' != data['method'])
    data['url'] += '/' + data['model'];

  $.post(
    '/admin/save_url_func',
    data,
    function(response){
      console.log(response);
    },
    'json'
  );
  // cancel click propagation
  return false;
}

// onready shortcut
$(function () {
  $('#controller').on('change', controllerChanged);
  $('#construct_link button').on('click', constructedLinkSave)
});