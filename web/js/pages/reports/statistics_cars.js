var $Grid = null,
  regDt = /^(\d\d)\-(\d\d)\-(\d{4})\s(\d\d:\d\d)$/;



$(function() {
  /*var m = new moment(),
   cmonth = m.format('YYYY-MM'); */
  /*
   m.add(1,'hour');
   var end   = m.format('DD-MM-YYYY HH:mm');

   $('#snd').click(sendInterval);

   $('#start' ).datetimepicker({
   lang        : 'ru',
   todayButton : false,
   step        : 30,
   format      : 'd-m-Y H:i',
   formatTime  : 'H:i',
   formatDate  : 'd-m-Y',
   minTime     : '00:00',
   maxTime     : '23:30',
   value       : start,
   mask        : '39-19-3199 29:59',
   onSelectTime: function(){ $(this).hide(); },
   onShow      : function(){ $(this).trigger('changedatetime.xdsoft'); }
   });
   $('#end' ).datetimepicker({
   lang        : 'ru',
   todayButton : false,
   step        : 30,
   format      : 'd-m-Y H:i',
   formatTime  : 'H:i',
   formatDate  : 'd-m-Y',
   minTime     : '00:00',
   maxTime     : '23:30',
   value       : end,
   mask        : '39-19-3199 29:59',
   onSelectTime: function(){ $(this).hide(); },
   onShow      : function(){ $(this).trigger('changedatetime.xdsoft'); }
   });

   start += ':00';
   end   += ':00'; */

  List();
});

function List() {
  $Grid = $("#list").jqGrid({
    url: '/report/get_json/statistics_cars',
    datatype: "json",
    mtype: 'POST',
    postData: { month:$('#mn').val() },
    height: 300,
    width:'500px',
    colNames: [ 'id','Предприятие','Количество ТС' ],
    colModel: [
      {name: 'id', index: 'id', hidden: true},
      {name: 'firm_id', index:'firm_id', width: 200, sortable:true, editable:false, search:false,
        edittype:'select', editoptions:{ value: sSrvGrp}, /*formatter:'select',*/
        stype: 'select',searchoptions:{ value:'0:-всi-;'+sSrvGrp}
      },
      {name:'count',index:'count',width:50,align:"center",sortable:true,editable:false,search:false }
    ],
    rowNum: 20,
    rowList: [20, 40, 60],
    altRows: true,
    pager: $('#pager'),
    sortname: 'name',
    viewrecords: true,
    sortorder: "desc",
    multiselect: false,
    //editurl: sBaseUrl + '_actions.php',
    caption: "Движение техники предприятия",
    loadtext    : '<img src="images/blue_loading.gif" />',
    subGrid           : true,
    subGridOptions    : {
      "plusicon"       : "ui-icon-triangle-1-e",
      "minusicon"      : "ui-icon-triangle-1-s",
      "openicon"       : "ui-icon-arrowreturn-1-e",
      "reloadOnExpand" : true,
      "selectOnExpand" : true
    },
    subGridRowExpanded : onGridExpanded
  }).navGrid('#pager', {add:false, edit:false, del:false, search:false, refresh:false });

  /*
   // add custom button to export the data to pdf
   $Grid.jqGrid('navButtonAdd', '#pager', {
   caption: "",
   id: 'refresh',
   buttonicon: "ui-icon-refresh",
   onClickButton: function () {
   $Grid.trigger('reloadGrid');
   },
   title: 'Обновить таблицу'
   }).jqGrid('navButtonAdd', '#pager', {
   caption: "",
   id: 'print',
   buttonicon: "ui-icon-print",
   onClickButton: function () {
   $('#makePdf').submit();
   },
   title: 'Экспорт в PDF'
   });*/

  $Grid.jqGrid('filterToolbar', {autoseach: true, searchOnEnter: false, stringResult: true, defaultSearch: 'cn'});
}

function freshGrid() {
  var pd = $("#list").jqGrid('getGridParam', 'postData');
  pd.month = $('#mn').val();
  $("#list").trigger('reloadGrid');
}
/*
 function sendInterval() {
 var pd = $Grid.jqGrid('getGridParam', 'postData'),
 beg = regDt.exec($('#start').val()),
 end = regDt.exec($('#end').val());
 if(beg && end) {
 pd.beg = beg[3] + '-' + beg[2] + '-' + beg[1] + ' ' + beg[4] + ':00';
 pd.end = end[3] + '-' + end[2] + '-' + end[1] + ' ' + end[4] + ':00';
 $Grid.trigger('reloadGrid');
 }
 } */

function onGridExpanded(sub_id, rid) {
  var tblId    = 't_' + sub_id,
    pgrId    = 'p_' + sub_id;

  $("#" + sub_id).html("<table id='" + tblId + "' class='scroll'></table><div id='" + pgrId + "' class='scroll'></div>");

  var pd = $Grid.jqGrid('getGridParam', 'postData');
  var tid = $Grid.jqGrid('getRowData', rid);

  var $GridSub = $("#" + tblId).jqGrid({

    url       : "/report/sub_json/statistics_cars",
    postData  : { firm_id:sub_id, month:$('#mn').val() },
    datatype  : "json",
    mtype     : "POST",
    colNames    : [ 'car_id','Название','Гос.номер' ],
    colModel    : [
      { name:'car_id',index:'car_id',hidden:true,key:true },
      { name:'name_ts',index:'name_ts',align:'center',width:100 },
      { name:'nomer_ts',index:'nomer_ts',align:'center',width:80 }
    ],
//        scroll            : 5,
    page              : 1,
    rowNum            : 20,
    rowList           : [10, 20, 50],
    pager             : pgrId,
    sortname          : 'name_ts',
    //viewrecords: true,
    sortorder         : "asc",
    height            : 280,
    width             : '480px',
    altRows           : false,
    footerrow         : false,
    viewrecords       : false,
    caption           : '',
    //prmNames          : { editoper:'edit_sub' },
    pagination        : true

  });
  $("#"+tblId).jqGrid(
    'navGrid',
    '#'+pgrId,
    {
      edit    : true,
      add     : false,
      del     : false,
      search  : false,
      refresh : false
    }
  )
    .navButtonAdd('#'+pgrId, {
      caption:"",
      id:'upd_' + sub_id,
      buttonicon:"ui-icon-refresh",
      onClickButton: function() { $GridSub.trigger('reloadGrid') },
      position:"first",
      title:'Обновити'
    });

}


function InitFilterSelectMenu() {}