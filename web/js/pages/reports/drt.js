var $Grid = null,
  regDt = /^(\d\d)\-(\d\d)\-(\d{4})\s(\d\d:\d\d)$/;

$(function() {
  var m = new moment(),
    start = m.format('DD-MM-YYYY HH:mm');

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
  end   += ':00';

  $Grid = $("#list").jqGrid({
    url: '/report/get_json/drt',
    datatype: "json",
    mtype: 'POST',
    postData : {beg:start, end:end},
    height: 300,
    colNames:
      [
        'id', 'itrack_id', 'Предприятие', 'Наимен. ТС', 'Гос №',
        'Ост. на начало ДУТ','Заправка ДУТ',
        'Ост. на конец ДУТ', 'Расход по ДРТ', 'Расход ДУТ', 'Расстояние', 'Расход на 100 км'
      ],
    colModel: [
      {name: 'id', index: 'id', hidden: true},
      {name: 'itrack_id', index: 'itrack_id', hidden: true},
      {name: 'firm_id', index:'firm_id', width: 150, sortable:true, /*editable:true, */search:true,
        /*edittype:'select', */stype: 'select',searchoptions:{ value:'0:-всi-;'+sSrvGrp},
        /*editoptions:{ value: sSrvGrp}, formatter:'select'*/},
      {name: 'name_ts', index: 'name_ts', width: 150, align: "left", sortable: true/*, editable: true*/},
      {name: 'nomer_ts', index: 'nomer_ts', width: 70, align: "left", sortable: true/*, editable: true*/},
      {name: 'dut_start', index: 'dut_start', width: 120, align: "center", sortable: true/*, editable: true*/},
      {name: 'zapr', index: 'zapr', width: 100, align: "center", sortable: true/*, editable: false*/},
      {name: 'dut_end', index: 'dut_end', width: 120, align: "center", sortable: true/*, editable: true*/},
      {name: 'drt', index: 'drt', width: 100, align: "center", sortable: true/*, editable: false*/},
      {name: 'dut_rashod', index: 'dut_rashod', width: 90, align: "center", sortable: true/*, editable: true*/},
      {name: 'distances', index: 'distances', width: 100, align: "center", sortable: true/*, editable: true*/},
      {name: 'distances100', index: 'distances100', width: 100, align: "center", sortable: true/*, editable: true*/}

    ],
    rowNum: 30,
    rowList: [30, 40, 50],
    altRows: true,
    pager: jQuery('#pager'),
    sortname: 'id',
    viewrecords: true,
    sortorder: "desc",
    multiselect: false,
    // editurl: 'reports/action/drt',
    caption: "",
    loadtext    : '<img src="/files/images/blue_loading.gif" />',
    loadComplete: function () {
      var rowIds = $("#list").jqGrid('getDataIDs');
      for (i = 0; i < rowIds.length; i++) {//iterate over each row
        rowData = $("#list").jqGrid('getRowData', rowIds[i]);
        if (rowData['name_ts'] === "Установка") {
          $("#list").jqGrid('setRowData', rowIds[i], false, {color: 'green'});
        }
      }
    },
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
  });

  $Grid.jqGrid('filterToolbar', {autoseach: true, searchOnEnter: false, stringResult: true, defaultSearch: 'cn'});
});

function sendInterval() {
  var pd = $Grid.jqGrid('getGridParam', 'postData'),
    beg = regDt.exec($('#start').val()),
    end = regDt.exec($('#end').val());
  if(beg && end) {
    pd.beg = beg[3] + '-' + beg[2] + '-' + beg[1] + ' ' + beg[4] + ':00';
    pd.end = end[3] + '-' + end[2] + '-' + end[1] + ' ' + end[4] + ':00';
    $Grid.trigger('reloadGrid');
  }
}

function onGridExpanded(sub_id, rid) {
  var tblId    = 't_' + sub_id,
    pgrId    = 'p_' + sub_id;

  $("#" + sub_id).html("<table id='" + tblId + "' class='scroll'></table><div id='" + pgrId + "' class='scroll'></div>");

  var pd = $Grid.jqGrid('getGridParam', 'postData');
  var tid = $Grid.jqGrid('getRowData', rid);

  var cStart = "0:-;1:test",
    cEnd   = "0:-;1:test";

  var $GridSub = $("#" + tblId).jqGrid({

    url       : sBaseUrl + "_sub.php",
    postData  : { sid: rid, beg:pd.beg, end:pd.end, itrack_id:tid.itrack_id },
    datatype  : "json",
    mtype     : "POST",
    colNames    : [ 'Дата Нач','Время Нач.','Дата Окон', 'Время Окон.', 'Расстояние','Расход по ДРТ','Расход на 100 км',' Заправка '],
    colModel    : [
      {   name:'dt1',index:'dt1',align:'center',width:80,
        stype: 'select',search:false
      },
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

//        scroll            : 5,
    page              : 1,
    rowNum            : 30,
    rowList           : [30, 40, 50],
    pager             : pgrId,
    height            : '100%',
    altRows           : false,
    footerrow         : false,
    viewrecords       : false,
    caption           : 'История движения топлива за период',
    prmNames          : {/*editoper:'edit_sub'*/},
    pagination        : true

  });
  $("#"+tblId).jqGrid(
    'navGrid',
    '#'+pgrId,
    {
      edit    : false,//true,
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