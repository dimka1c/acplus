$DlgNew2 = $('#dlg_new_item2').dialog({
  title: 'Удалить',
  autoOpen: false,
  width: window.width - 40,
  height: window.height,
  modal: true,
  buttons: [{
    text: 'Удалить',
    icons: {
      primary: 'ui-icon-plusthick'
    },
    id: 'it_del',
    onclick: "onDelCarConfirm();$DlgNew2.dialog('close');"
  }, {
    text: 'Отмена',
    icons: {
      primary: 'ui-icon-cancel'
    },
    onclick: "$DlgNew2.dialog('close');"
  }]
});
$DlgNew2.dialog('option', 'title', 'Удалить позицию');



function KeyUpCar(ev) {
  if (ev.keyCode == 40 ||
    ev.keyCode == 38 ||
    ev.keyCode == 13) {
    var keyEvent = $.Event("keydown");
    keyEvent.keyCode = ev.keyCode;
    // $('#car_id').trigger(keyEvent)
    return;
  }
  var v = $('#car').val();
  if (v.length < 1) {
    // $('#car_id').val('').carselect('close');
    var availableTags = [];
    $("#car").autocomplete({
      source: availableTags
    });
    $("#car_id").val('');
    return;
  }

  if (v.length > 1) {
    SearchCar(v);
  }
}



function SearchCar(v) {
  availableTags = '';
  $.post(dir + 'search-car.php', {
    firm_id: $('#firms').val(),
    car: v
  }).success(function(data) {
    //availableTags = JSON.parse(data);
    //var obj = jQuery.parseJSON( data );
    availableTags = JSON.parse(data);
    // availableTags = [{id: "4793", value: "АЕ 80-83 В"}];

    $("#car").autocomplete({
      minLength: 0,
      source: availableTags,
      focus: setValues,
      select: setValues
    });
  });
}

var car, car_id, speedometer, dt_beg, volume, f_amount;

function setValues(event, ui){
  car = ui.item.value; console.log(car);
  car_id = ui.item.id;
  speedometer = ui.item.speedometer;
  dt_beg = ui.item.date;
//  volume = ui.item.volume;
//  f_amount = ui.item.f_amount;

  $("#car").val(car);
  $("#car_id").val(car_id);
  $("#speedometer").val(speedometer);
  $("#dt_beg").val(dt_beg);
//  $("#fuel_ost").val(volume - f_amount);
  TableRefresh();
  return false;
}

function Save() {
  var id_row = $("#id_row").val();
  $.post(dir + "002-dispetcher_action.php", {
    id_row: id_row,
    oper: parseInt(id_row) ? 'edit' : 'add',
    car_id: $('#car_id').val(),
    dt_beg: $('#dt_beg').val(),
//    speedometer_beg: $('#speedometer_beg').val(),
    speedometer: $('#speedometer').val()//, // main
//    fuel_ost: $('#fuel_ost').val()//,
//    expense_fact: $('#expense_fact').val()
  })
    .done(function(data) {
      TableRefresh();
      $DlgNew.dialog('close');
    });
}

/*function SelectCar(ev, ui) {
 $('#car').val(ui.item.label).attr('car_id', ui.item.i);

 }*/


function TableRefresh() {
  var pd = $("#list").jqGrid('getGridParam', 'postData');
  pd.car_id = $('#car_id').val();
  pd.dt1 = $('#dt1').val();
  pd.dt2 = $('#dt2').val();
  $("#list").trigger('reloadGrid');
}


function List() {
  var lastsel;
  $Grid = $('#list').jqGrid({
    url: dir + '002-dispetcher_cars.php',
    datatype: 'json',
    mtype: 'POST',
    postData: {
      car_id: 0,
      dt1: $('#dt1').val(),
      dt2: $('#dt2').val()
    },
    width: '100%',
//    height: '100%',
    colNames: [
      'Дата',
      'Водитель',
      'вначале',
      'вконце',
      'Норма л/100км',
      'Расход по нормам',
      'Расход по факту',
      'Заправлено',
      'Разница'
    ],
    colModel: [
      {
        name: 'dt_beg',
        index: 'dt_beg',
        align: 'left',
        width: 70,
        stype: 'select'
      },
      {
        name: 'name',
        index: 'name',
        align: 'left',
        width: 180,
        edittype: 'text'
      },
      {
        name: 'speedometer_beg',
        index: 'speedometer_beg',
        align: 'center',
        width: 120
      },
      {
        name: 'speedometer',
        index: 'speedometer',
        align: 'center',
        width: 120
      },
      {
        name: 'norma1',
        align: 'center',
        sortable: false,
        width: 100
      },
      {
        name: 'expense_norma',
        index: 'expense_norma',
        align: 'center',
        width: 120
      },
      {
        name: 'expense_fact',
        index: 'expense_fact',
        align: 'center',
        width: 110
      },
      {
        name: 'expense_fact2',
        index: 'expense_fact2',
        align: 'center',
        width: 110
      },
      {
        name: 'expense_saldo',
        index: 'expense_saldo',
        align: 'center',
        width: 80
      }
    ],
    pagination: true,
    pager: '#pager',
    page: 1,
    rowNum: 50,
    rowList: [5, 10, 20, 30, 50, 70, 100, 150],
    sortname: 'dt_beg',
    sortorder: "desc",
    viewrecords: true,
    caption: '',
    loadonce: false,
    ondblClickRow: GridDblClkRow,
    gridview: true,
    autoencode: true,
    height: "auto",
    rownumbers: true,
    hidegrid: false
  });
  $Grid.jqGrid('navGrid', '#pager', {
    edit: false,
    add: false,
    del: false,
    search: false
  })
    .navButtonAdd('#pager', {
      caption: "Удалить",
      id: 'DelCar',
      buttonicon: "ui-icon-trash",
      onClickButton: onDelCar,
      position: "last",
      title: 'Удалить'
    });
  $Grid.jqGrid('setGroupHeaders',{
    useColSpanStyle: true,
    groupHeaders:[
      {startColumnName: 'speedometer_beg',   numberOfColumns: 2, titleText: 'Спидометр'}
    ]
  });
}


function onDelCar() {
  $DlgNew2.dialog('open');
}

function onDelCarConfirm() {
  var selectedRowId = $('#list').jqGrid('getGridParam', 'selrow');
  $.post(dir + '002-dispetcher_action.php', {
    oper : 'del',
    id_row : selectedRowId,
    car_id : $('#car_id').val()
  }).done(function() {
    $Grid.trigger("reloadGrid");
    $DlgNew2.dialog('close');
  });

}

function GridDblClkRow(id, iR, iC, ev) {
  if (!userRights.edit) {
    return false;
  }
//  $('#fuel_left').prop('hidden', false);
//  $('#fuel_spent').prop('hidden', false);
  $("#id_row").val($Grid.jqGrid('getGridParam', 'selrow'));
  $("#dt_beg").val($Grid.jqGrid('getCell', $Grid.jqGrid('getGridParam', 'selrow'), 'dt_beg'));
//  $("#fuel_ost").val($Grid.jqGrid('getCell', $Grid.jqGrid('getGridParam', 'selrow'), 'fuel_ost'));
//  $("#speedometer_beg").val($Grid.jqGrid('getCell', $Grid.jqGrid('getGridParam', 'selrow'), 'speedometer_beg'));
  $("#speedometer").val($Grid.jqGrid('getCell', $Grid.jqGrid('getGridParam', 'selrow'), 'speedometer'));
//  $("#expense_fact").val($Grid.jqGrid('getCell', $Grid.jqGrid('getGridParam', 'selrow'), 'expense_fact'));
  $DlgNew.dialog('open');
}

// обработка карты
$("#car").on('change', function(e) {
  TableRefresh();
});

// обработка карты
$("#dt1").on('change', function(e) {
  TableRefresh();
});

// обработка карты
$("#dt2").on('change', function(e) {
  TableRefresh();
});

function InDsp() {
  if (!userRights.edit) return;
  if ($('#car_id').val() != '') {
//    var date = new Date();
//    var newdate = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();
//    $("#fuel_ost").val(0);
    $("#id_row").val(0);
//    $("#speedometer").val(0);
//    $("#expense_fact").val(0);

//    $("#car").val(car);
    $("#car_id").val(car_id);
//    $("#speedometer_beg").val(speedometer_beg);
    $("#dt_beg").val(dt_beg);
//    $("#fuel_ost").val(volume - f_amount);

//    $('#fuel_left').prop('hidden', true);
//    $('#fuel_spent').prop('hidden', true);

    $DlgNew.dialog('open');
    $("#speedometer").val(speedometer).focus();
  }
}

$(document).ready(function() {
  $(firm_select.split(";").map(function(x) {
    var z = x.split(":");
    return {
      id: parseInt(z[0]),
      value: z[1]
    };
  })).each(function() {
    //this refers to the current item being iterated over
    var option = $('<option />');
    option.attr('value', this.id).text(this.value);
    $('#firms').append(option);
  });
  $('#firms').selectmenu({
    width: 430,
    change: function(event, ui) {
      $('#car').val('');
      $('#car_id').val('');
    }
  });

  $(cat_select.split(";").map(function(x) {
    var z = x.split(":");
    return {
      id: parseInt(z[0]),
      value: z[1]
    };
  })).each(function() {
    //this refers to the current item being iterated over
    var option = $('<option />');
    option.attr('value', this.id).text(this.value);
    $('#cat').append(option);
  });
  $('#cat').selectmenu({
    width: 430
  });

  $('#bsave').button({
    width: 120
  });
  $('#besc').button({
    width: 120
  });
  $('#report').button({
    width: 120
  });
  $('#rfidFltr').button();
  $('#own_0').prop('checked', true);

  tmp = $('#car').keyup(KeyUpCar);
  tmp.val(tmp.attr('b'));



  $('#dt_beg').datepicker();
  $('#dt1').datepicker();
  $('#dt2').datepicker();

  $DlgNew = $('#dlg_new_item').dialog({
    title: 'Автомобиль',
    autoOpen: false,
    width: window.width - 40,
    height: window.height,
    modal: true,
    buttons: [{
      text: 'Сохранить',
      icons: {
        primary: 'ui-icon-plusthick'
      },
      id: 'it_add',
      onclick: "Save();"
    }, {
      text: 'Отмена',
      icons: {
        primary: 'ui-icon-cancel'
      },
      onclick: "$DlgNew.dialog('close');"
    }]
  });
  $DlgNew.dialog('option', 'title', 'Оформить');

  List();
});