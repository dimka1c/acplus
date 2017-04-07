var id_pay      = 0;
var dc          = '';
var oper        = '';
var lastSel     = '';
var right       = 0;
var modeEdit    = false;
var $Grid       = null;

$(document).ready(function() {
  $('#action_date').datepicker({
    dateFormat: 'yy-mm-dd',
    beforeShow: function (input, inst) {
      var offset = $(input).offset();
      var height = $(input).height();
      window.setTimeout(function () {
        inst.dpDiv.css({ top: (offset.top + height + 4) + 'px', left: offset.left + 'px' })
      }, 1);
    }
  });

  $('.close_edit').click(function (){
    $('#dv_edit').fadeOut(100);
    $('#dv_list').fadeIn(100);
    //clearEditForm();
  });

  $('.save_edit').click(function () {
    if (!userRights.edit) return;     // ниже описана функция по передаче данных через аджакс  SaveStat
    Save();
  });
  $('.rsave_edit').click(function () {
    if (!userRights.edit) return;
    Rsave();
  });
  $('.rclose_edit').click(function (){
    $('#rdv_edit').fadeOut(100);
    $('#dv_list').fadeIn(100);
    $('#rprimtext').text('');
  });

  List();

//ui-jqgrid-titlebar ui-jqgrid-caption ui-widget-header ui-corner-top ui-helper-clearfix
  //кастомизация шапки грида

  $("#list").setCaption('<div id = "divheader" style="height:19px;">'+
    '<table style="font-weight:bold;">'+
    '<tr>'+
    '<td id="divheader_c1" style="width:150px;height:19px;" align="center">Показать за период с</td>'+
    '<td><input type="text" id="dt1" style="height:16px;width:80px; text-align:center;"></td>'+
    '<td> по </td>'+
    '<td><input type="text" id="dt2" style="height:16px;width:80px; text-align:center;"></td>'+
    '<td> <button role="button" style="height:28px;width:32px; text-align:center;" id="dtclear"><i class="fa fa-calendar-times-o"></i></button></td>'+
    '<td> <button role="button" style="height:28px;width:32px; text-align:center;" id="dtfltr"><i class="fa fa-calendar-check-o"></i></button></td>'+
    '</tr>'+
    '</table>'+
    '</div>');

  $("#dt1").datepicker();
  $("#dt2").datepicker();
  $("#dtclear").button().click(cleardate);
  $("#dtfltr").button().click(dtfltr);



// ==============================================
  var input = document.getElementById("images"),
    formdata = false;

  if (window.FormData) {
    formdata = new FormData();
    //document.getElementById("btn").style.display = "none";
  }

});

////////////////////////////////////// end ready
function dtfltr(){

  var pd = $("#list").jqGrid('getGridParam', 'postData');
  pd.dt1 = $('#dt1').val();
  pd.dt2 = $('#dt2').val();
  $("#list").trigger('reloadGrid');
}

function dtfltr(){

  var pd = $("#list").jqGrid('getGridParam', 'postData');
  pd.dt1 = $('#dt1').val();
  pd.dt2 = $('#dt2').val();
  $("#list").trigger('reloadGrid');


}


function ChYear2() {
  var _year=$('#year').val();
  $('#year2').attr('disabled',false);
  $('#year2 option[value='+_year+']').attr('selected',true);
  $('#year2').attr('disabled',true);
}

function cleardate(){
  $("#dt1").datepicker('setDate', null);
  $("#dt2").datepicker('setDate', null);
  dtfltr();
}

function List() {

  $Grid = $('#list').jqGrid({
    url         : '/report/get_json/gps_car_16',
    datatype    : 'json',
    postData    : { dt1: "", dt2: ""},
    mtype       : 'POST',
    width       : '100%',
    height      : '100%',
    colNames    : [ 'Дата Нач','Время Нач.','Дата Окон', 'Время Окон.', 'Расстояние','Расход по ДРТ','Расход на 100 км',' Заправка '],
    colModel    : [
      {   name:'dt1',index:'dt1',align:'center',width:80,
        stype: 'select',search:false
      },
      /*{  name:'f_dispenser',index:'f_dispenser',align:'left',width:200,
       editoptions: {value: sDevices},stype: 'select',formatter:'select',search:true,searchoptions: { value:sDevices, clearSearch:false, dataInit:InitFilterSelectMenu }
       },*/
      {  name:'f_start',index:'f_start',align:'center',width:80,
        stype: 'select',search:false,searchoptions: { value:cStart, clearSearch:false, dataInit:InitFilterSelectMenu }
      },
      {   name:'dt2',index:'dt2',align:'center',width:80,
        stype: 'select',search:false
      },
      {  name:'f_end',index:'f_end',align:'center',width:80,
        stype: 'select',search:false,searchoptions: { value:cEnd, clearSearch:false, dataInit:InitFilterSelectMenu }
      },
      {   name:'drt',index:'drt',align:'center',width:100,search:false,
        stype: 'text',
      },
      {   name:'dut',index:'dut',align:'center',width:100,search:false,
        stype: 'text',
      },
      {   name:'dist', index:'dist', align:'center',width:100,search:false,
        stype: 'text',
      },
      {   name:'zapr', index:'zapr', align:'center',width:100,search:false,
        stype: 'text',
      },
    ],
    pager       : '#pager',
    rowNum      : 20,
    rowList     : [5,10,20,30,50,70,100],
    sortname    : 'f_id',
    sortorder   : "desc",
    viewrecords : true,
    caption     : '',
    hidegrid    : false,
    //footerrow   : true,
    //userDataOnFooter : true,
    //altRows     : true,
    rownumbers  : true,
    loadtext    : '<img src="images/blue_loading.gif" />'
  });

  $Grid.jqGrid('filterToolbar',{ autoseach:true, searchOnEnter : false, stringResult: true, defaultSearch:'cn', resetIcon:'<i class="fa fa-ban"> </i>' });

  $Grid.jqGrid('navGrid','#pager', { edit:false, add:false, del:false, search:false });
}


function reporttopdf(){
  /* var id = $("#list").jqGrid('getGridParam', 'selrow');
   var rd = $("#list").jqGrid('getRowData', id);
   /*if(rd.fri_cars < 1) {
   jAlert('Додайте хоча-б один автомобіль в запит','Увага');
   return;
   }*/
  // window.open(dir + 'gps-fuelling_pdf.php');
  //var pd = $("#list").jqGrid('getGridParam', 'postData');

  //$("#postdata").val(pd);
  //var w = window.open('','postform');
  //$("#postform").submit();
  //console.log($("#postdata").val());

  var params = $("#list").jqGrid('getGridParam', 'postData');


  var form = document.createElement("form");
  form.setAttribute("id", "postform");
  form.setAttribute("method", "post");
  form.setAttribute("target", "postform");
  form.setAttribute("action", "page/reports/scripts/gps-fuelling_pdf.php");

  for(var key in params) {
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", key);
    hiddenField.setAttribute("value",  params[key]);
    form.appendChild(hiddenField);
  }
  document.body.appendChild(form);
  var w = window.open('','postform');
  form.submit();
  form.remove();
}

function InitFilterSelectMenu(el, sopt) {
  var cm = $Grid.jqGrid('getGridParam', 'colModel'),
    c  = null;
  $.each(cm, function(k,v){ if(v.index == sopt.name){ c = v; return false; }});
  if(!c) return;
  var sel = $(el);
  sel.selectmenu({ width: c.width-10, change: function() { sel.change(); } });
}
