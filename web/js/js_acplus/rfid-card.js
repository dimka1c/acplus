$(document).ready(function() {

  $('#link_mode').buttonset();
  $('#owner_type').buttonset();

var regDt = /^(\d\d)\-(\d\d)\-(\d{4})\s(\d\d:\d\d)$/;

var selectedRowData = null,
    lastselIdSub    = null,
    $Grid           = null,
    ownerIcons      = ['question', 'user', 'car'];

var paramEdit = {
    afterShowForm: initForm,
    beforeSubmit: CheckParam,
    afterSubmit: parseAnswer,
    closeAfterAdd: true,
    closeAfterEdit: true,
    reloadAfterSubmit: true,
    viewPagerButtons: false
};

var paramEditSub = {
    afterShowForm: inicializeDravListSub,
    beforeSubmit: CheckParamSub,
    afterSubmit: function(resp, postdata) {
        $('#list').find('tr[id='+selectedRowData+'] td[aria-describedby="list_param"]').html(postdata.name);
        return [true,"",""];
    },
    closeAfterAdd: true,
    closeAfterEdit: true,
    reloadAfterSubmit: true
};

  List();
  
    var m = new moment(),
    start = m.format('DD-MM-YYYY HH:mm');

   // $('#snd').click(sendInterval);

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
    
    start += ':00';

    $CarList = $("#carlist").jqGrid({
        url             : baseUrl + '_cars.php',
        postData        : { firm:0 },
        mtype           : 'post',
        datatype        : 'json',
        width           : '100%',
        height          : '400',
        colNames        : [ '', '<i class="fa fa-car"> </i>', 'Наименование', 'Гос.номер', 'VIN' ],
        colModel        : [
            { name:'c_stat', index:'stat',     hidden:true },
            { name:'c_icon', index:'icon',     align:'center', width:50, formatter:fmtIcon },
            { name:'c_name', index:'name_ts',  align:'left',   width:200 },
            { name:'c_num',  index:'nomer_ts', align:'left',   width:80 },
            { name:'c_vin',  index:'kuzov',    align:'left',   width:100 }
        ],
        scroll          : true,
        rowNum          : 10000,
        caption         : '',
        sortname        : 'name_ts',
        sortorder       : "asc",
        hidegrid        : false,
        footerrow       : false,
        onSelectRow     : chooseCar
    });
    $DrvList = $("#drvlist").jqGrid({
      url             : baseUrl + '_drvs.php',
      postData        : { firm:0 },
      mtype           : 'post',
      datatype        : 'json',
      width           : '100%',
      height          : '400',
      colNames        : [ 'Фио', 'Телефон', 'ИНН' ],
      colModel        : [
        { name:'name',  index:'name',  align:'center',   width:150 },
        { name:'phone', index:'phone', align:'center',   width:120 },
        { name:'inn',   index:'inn',   align:'center',   width:120 }
      ],
      scroll          : true,
      rowNum          : 10000,
      caption         : '',
      sortname        : 'name',
      sortorder       : "asc",
      hidegrid        : false,
      footerrow       : false,
      onSelectRow     : chooseDrv
    });

	$Order = $('#dlg_order').dialog({
		title       : 'Привязать карту',
		autoOpen    : false,
		width       : 'auto',
		height      : 'auto',
		modal       : true,
    focus       : '',
    close       : OrderCancel,
    closeOnEscape: false,
		buttons     : [
			{ text:'Сохранить', icons:{primary: 'ui-icon-disk'}, click: OrderSave, id:'it_add'},
			{ text:'Отмена', icons:{primary: 'ui-icon-cancel'}, click: function() { $Order.dialog('close') } }
		]
	});
        

	$.widget( "custom.carselect", $.ui.autocomplete, {
		_renderItem: function( ul, item ) {
			var ct = item.c == '' ? '333333' : item.c;
			var ci = item.s == 1 ? '008000' : ct;
			var i = item.i == '' ? 'question' : item.i;
			var e = item.s != 1 ? ' (' + aCarSt[item.s] + ')' : '';
			if(item.label == '-') {
				return $( '<li>' ).prop('disabled', true).append('<hr>').appendTo( ul );
			}
			return $( "<li>" )
				.attr( "data-value", item.value )
				.append( "<i class='fa fa-2x fa-" + i + "' style='float:left;margin-right:5px;color:#" + ci +
          "'> </i><div class='car-item'><div style='color:#" + ct + "'>" + item.label + e +
          "</div><small>гос.№ <font color=#005800>" + item.n + "</font>,&nbsp;VIN:&nbsp;" +
          "<font color=teal>" + item.v + "</font></small></div>")
				.appendTo( ul );
		}//,
//		_resizeMenu: function() {
//			this.menu.element.outerWidth( 650 );
//		}
	});

  $.widget( "custom.drvselect", $.ui.autocomplete, {
    _renderItem: function( ul, item ) {
      if(item.label == '-') {
        return $( '<li>' ).prop('disabled', true).append('<hr>').appendTo( ul );
      }
      var txt = item.p != '' ? item.p : '-';
      return $( "<li>" )
        .attr( "data-value", item.value )
        .addClass( "li_drv" )
        .append( item.label + "<br><small>" + txt + "</small></div>")
        .appendTo( ul );
    }//,
//    _resizeMenu: function() {
//      this.menu.element.outerWidth( 300 );
//    }
  });

  console.log('init autocomplete');

  // ORDER DIALOG
  $('#car_id').carselect({
    source        : searchCar,
    select        : selectOwnerCar,
    focus        : FocusSkip,
    appendTo    : 'body',
    minLength    : 3
  });//.keyup(keyUpCar);
  // ToDo: add keyup regexp functionality

  $('#driver_id').drvselect({
    source        : searchDrv,
    select        : selectOwnerDrv,
    focus        : FocusSkip,
    appendTo    : 'body',
    minLength    : 3
  });//.keyup(keyUpDrv);
  // ToDo: add keyup regexp functionality

  function FocusSkip(ev, ui) { return false; }

  $CarDlg = $('#dlg_carlist').dialog({
     title: 'Выбор транспортного средства',
     autoOpen: false,
     width: 'auto',
     height: 'auto',
     modal: true,
     buttons: []
  });
  $DrvDlg = $('#dlg_drvlist').dialog({
    title: 'Выбор водителя',
    autoOpen: false,
    width: 'auto',
    height: 'auto',
    modal: true,
    buttons: []
  });

    
function OrderNew() {
  if (!userRights.edit) return;
	OrderCancel();
  bOrdInit = true;
  $('#firm_id option').eq(0).prop('selected', true);
  SelectFirm();
	$Order.dialog('open');
}

function showCarList() {  SelectFirm(); $CarDlg.dialog('open'); }
function showDriverList() {  SelectFirm(); $DrvDlg.dialog('open'); }

function OrderSave(id) {
  if (!userRights.edit) return;
  // ToDo: get indicator driver / car, get appropriate ID, set type of owner
  // ToDo: send data to server, save it, return response and handle it
	var aBad = [],
    owner_type = $('#car_owner').prop('checked') ? 'car' : 'drv';
    firm_id   = $('#firm_id').val(),
    car_id    = $('#car_id').attr('cid'),
    driver_id    = $('#driver_id').attr('did'),
    id        = $Order.attr('oid');

  beg       = regDt.exec($('#start').val()) ;
  beg       = beg[3] + '-' + beg[2] + '-' + beg[1] + ' ' + beg[4] + ':00';
            
	if (car_id == 0) { aBad.push({i:'car_id', t:'Выберите автомобиль!'}); }

  var pd = {
    id          : id,
    firm_id     : firm_id,
    owner_type  : owner_type,
    car_id      : car_id,
    drv_id   : driver_id,
    oper        : 'link',
    beg         : beg
  };

  $.post(
		baseUrl + '_action.php',
		pd,
		function(answ) {
      // $OrderLdr.hide();
			if (answ.warning) {
        jAlert(answ.warning,'Предупреждение!');
			}
			if (answ.status != 'ok'){
        jAlert(answ.status);
        return;
			}
      $Order.dialog('close');
      $Grid.trigger('reloadGrid');
		},
    'json'
	);
}

  // Car selector + carlist
  $('#choose_car').button().click(showCarList);

  // Car selector + carlist
  $('#choose_driver').button().click(showDriverList);


  function OrderCancel() {
    if (!userRights.edit) return;

  $('#firm_id option:eq(0)').prop('selected', true);
	$('#firm_id ').prop('disabled', false);
	$('#car_id')
		.val($('#car_id').attr('b'))
		.attr('cid', 0)
		.prop('disabled', false);
	$('#car_num').val('').attr('bt', '');

	$('#dlg_order select').val(0);

}

//}); // end ready


function fmtIcon(cv) {
  var a = cv.split('|'),
    t = a[0],
    c = a.length > 1 ? a[1] : '000000';
  return '<i class="fa fa-lg fa-' + t + '" style="color:#' + c + ';"> </i>';
}

function inicializeDravListSub(postdata) {
  selectedRowData = $('#list').jqGrid('getGridParam','selrow');
}

function CheckParamSub(postdata,formid) {
  var message = [];
  if(postdata.name == '') message.push('Владелец: Выберите владельца<br>');
  else if(lastselIdSub == null) message.push('Владелец: Выберите владельца<br>');
  postdata.nameId = lastselIdSub;
  return message.length > 0 ? [false,message] : [true,''];
}

function initForm($form) {
  $form.addClass('tbl_frm');
  $('.navButton').html('<div id="dlg_loader" style="float:left;margin-top:8px;"><img src="./images/loading.gif"></div>');
  $DlgLdr = $('#dlg_loader').hide();
  $('firm,number,cat,article,note', $form).attr('class', 'FormElement tbl_ok');
}

function CheckParam(pd) {
  var message = [];
  if(pd.firm == 0) message.push('Предпирятие: Выберите предприятие<br>');
  if(pd.number == '') message.push('Номер карты: Введите номер карты<br>');
  if(pd.article == '') message.push('Код карты: Введите код карты<br>');
  var reg = /^[\da-f]+$/i;
  if(!reg.test(pd.number)) message.push('Номер карты: Номер карты должен быть HEX формата<br>');
  var own = $(pd.owner);
  pd.owner = own.attr('hid') + '|' + own.attr('tid');
  return message.length > 0 ? [false,message] : [true,''];
}

function parseAnswer(rsp, pd) {
  if(rsp.status != 200) {
    return [false, 'Код ответа : ' + rsp.status + ' (' + rsp.statusText + ')', 0];
  }
  var ans = $.parseJSON(rsp.responseText);
  if(!ans.status || ans.status != 'ok') {
    jError(ans.status ? ans.status : 'Неизвестная ошибка');
    if(pd.oper && pd.oper == 'add') {
      return [false, ans.status, 0];
    }
  }
  var id = ans.id ? ans.id : 0;
  return [true, '', id];
}

  // select Car in autocomplete field
  function selectOwnerCar(ev, ui) {
    $('#car_id')
      .val(ui.item.label)
      .attr('cid', ui.item.value);
    $('#car_num').val(ui.item.n);
    return false;
  }

  // select Driver in autocomplete field
  function selectOwnerDrv(ev, ui) {
    $('#driver_id')
      .val(ui.item.label)
      .attr('did', ui.item.value);
    return false;
  }

function selectDrv(ev, ui) { selectOwner(ev, ui, 'p'); }
function selectCar(ev, ui) { selectOwner(ev, ui, 'n'); }
function selectOwner(ev, ui, sub) {
    $(ev.target)
        .val(ui.item.label)
        .attr('hid', ui.item.value)
        .attr('sub', ui.item[sub])
        .removeClass('tbl_bad');
    ev.preventDefault();
    //return false;
}

function searchCar(req, rsp)  { searchItem('car', req, rsp); }
function searchDrv(req, rsp)  { searchItem('drv', req, rsp); }
function searchOper(req, rsp) { searchItem('techop', req, rsp); }
function searchObj(req, rsp)  { searchItem('obj', req, rsp); }
function searchItem(what, req, rsp) {
    var pd  = {
        a    : what,
        s    : req.term,
        f    : $('#firm_id').val(),
        nd    : Date.now()
    };
//    $DlgLdr.show();
    $.post(dir + '/search.php', pd, rsp, 'json');//.always(function(){$DlgLdr.hide();});
}

function fmtCardNumber(cv) {
    return parseInt(cv).toString(16).toUpperCase();
}

function getOwnerDiv(tid, hid, txt, sub) {
    tid = parseInt(tid);
    return '<div hid="' + hid + '" tid="' + tid + '" class="owner">' +
               '<i class="fa fa-fw fa-lg fa-' + ownerIcons[tid] + '"> </i>' +
               '<div>' + txt + '</div><small>' + sub + '</small>' +
           '</div>';
}

function fmtOwner(cv) {
    var a = cv.split('|');
    return getOwnerDiv(a[3], a[2], a[0], a[1]);
}

function FmtCar(cv) {
	var a = cv.split('|');
	if(a.length < 3) return cv;
	return '<span cid="' + a[2] + '">' + a[0] + '</span>&nbsp;<small>' + a[1] + '</small>';
}

function AttrCar(rid, cv, ar) {
	var pd = /^(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})$/;
	var st = pd.exec(ar[3]); // start
	var cr = pd.exec(ar[5]); // dt_create
	if(st && cr) {
		st = new Date(st[1], st[2], st[3], 10, 0, 0, 0);
		cr = new Date(cr[1], cr[2], cr[3], cr[4], cr[5], cr[5], 0);
		var c = cr > st ? ' late' : '';
	} else {
		return ' title="' + ar[3] + '"';
	}
	var t = $(cv).eq(0).text();
	return ' title="' + t + '" class="trOrd' + c + '"';
}

function currencyFmatter (cellvalue)
{
//cv = "2999-12-31 23:59:59";
m = moment(cellvalue);
return (m.year() == 2999) ? "-" : m.format("DD.MM.YYYY HH:mm");
}


function ListSubGrid(subId, rowId) {
    var subTbl = 'stbl_' + subId;
    var subPgr = 'spgr_' + subId;
    var $Sub   = null;
    var fid    = $('#fid').val();
    $('#' + subId).html('<table id="' + subTbl + '" class="scroll"></table>' +
      '<div id="' + subPgr + '" class="scroll"></div><br>');

    $Sub = $('#' + subTbl).jqGrid({
      url             : baseUrl + '_sub.php',
      datatype        : 'json',
      mtype           : 'POST',
      postData        : { card:rowId },
      colNames        : ['Получил', 'Сдал', 'Владелец'],
      colModel        : [
        { name:'begin',index:'cdo_beg',align:'center', width:200, search:false, editable:false,formatter:'date', formatoptions: {srcformat: 'Y-m-d H:i:s', newformat: 'd.m.Y H:i'}},
        { name:'end',index:'cdo_end',align:'center', width:200, search:false, editable:false, formatter:currencyFmatter},
        { name:'name',
          index:'name',
          align:'center',
          //edittype:'select',
          width:200,
          search:false,
          editable:true,
          editoptions:{
              dataInit : function (el) {
                  $(el).autocomplete( {
                      source : function (request, response) {
                          lastselIdSub = null;
                          $.ajax({
                              type : "POST",
                              url :  dir + 'autocomplete-rfid.php',
                              data : {
                                  term : request.term,
                                  firmId : $('#list').find('tr[id='+selectedRowData+'] td[aria-describedby="list_firm"]').html()
                              },
                              success : function(ret, textStatus, jqXhr) {
                                  response(ret);
                              },
                              error : function (jqXhr, textStatus, errorThrown) {
                                  if (console)
                                      console.log("Autocomplete failed.");
                              }
                          });
                      },
                      select : function (event, ui) {
                          $(el).val(ui.item.label);
                          lastselIdSub = ui.item.value;
                          return false;
                      },
                      open : function ( event, ui ) {
                          $(".ui-autocomplete").css("zIndex", 10000);
                      }
                  });
                  $(el).on("keydown", function (event) {
                      var code = event.which;
                      if(code==13) event.preventDefault();
                  });
              }
          },
          editrules:{required:true},
          formatter: fmtOwner,
          cellattr: AttrCar
        }
      ],
      page            : 1,
      rowNum          : 5,
      rowList         : [5,10,20,30,50,70,100,150],
      pginput         : true,
      pager           : subPgr,
      sortname        : 'cdo_beg',
      sortorder       : "desc",
      height          : "auto",
      footerrow       : false,
      userDataOnFooter: false,
      altRows         : false,
      viewrecords     : true,
      caption         : '',
      loadonce        : false,
      gridview        : true,
      autoencode      : true,
      editurl         : dir + "rfid-card_sub_action.php?id="+rowId,
      rownumbers  : true,
      hidegrid    : false,
      pagination  : true
    });
    $Sub.jqGrid('navGrid','#' + subPgr,{ edit:false, add:true, del:false, search:false, refresh:true },paramEditSub,paramEditSub);
}

function searchUp() {
    var zInd = $('.ui-jqdialog[aria-hidden="false"]').css('z-index') + 2;
    $(".ui-autocomplete").css({'z-index':zInd});
}

function ownerChanged(ev) {
    var a = $(this).attr('id').split('_'),
        i = parseInt(a[1]);
    $('#own_1i').prop('disabled', i != 1);
    $('#own_2i').prop('disabled', i != 2);
}

function ownerInit(el) {
    $(el).find('#own_1i').autocomplete({
        source: searchDrv,
        select: selectDrv,
        open : searchUp,
        minLength: 3
    });
    $(el).find('#own_2i').autocomplete({
        source: searchCar,
        select: selectCar,
        open : searchUp,
        minLength: 3
    });

    $(el).find('#own_0, #own_1, #own_2').change(ownerChanged);
/*            source      : SearchFirm,
            select      : SelectFirm,
            appendTo    : 'body',
            minLength   : 1*/

}

function ownerCreate(cv, opt) {
    var val = ['', '', ''],
        sub = ['', '', ''],
        sel = ['', '', ''],
        hid = [0, 0, 0],
        dis = ['', ' disabled', ' disabled'],
        t = parseInt($(cv).attr('tid'));

    sel[t] = ' checked';
    dis[t] = '';
    val[t] = $(cv).find('div').text();
    sub[t] = $(cv).find('small').text();
    hid[t] = parseInt($(cv).attr('hid'));
    var tbl = $('<table>' +
             '<tr><td><input type="radio" name="own_t" id="own_0"' + sel[0] + '><label for="own_0">Нет</label></td><td> </td></tr>' +
             '<tr><td><input type="radio" name="own_t" id="own_1"' + sel[1] + '><label for="own_1">Водитель</label></td><td>' +
                  '<input type="text" id="own_1i" hid="' + hid[1] + '" value="' + val[1] + '" sub="' + sub[1] + '"' + dis[1] +
                  ' class="tbl_ok" size="40"></td></tr>' +
             '<tr><td><input type="radio" name="own_t" id="own_2"' + sel[2] + '><label for="own_2">Авто</label></td><td>' +
                  '<input type="text" id="own_2i" hid="' + hid[2] + '" value="' + val[2] + '" sub="' + sub[2] + '"' + dis[2] +
                  ' class="tbl_ok" size="40"></td></tr>' +
             '</table>'

            );
    //console.log($('#own_1i').css({'border-color':'red'}));
    return tbl;
}

function ownerValue(ctrl, oper, cv) {
    console.log(oper + ' = ' + cv);
    if(oper == 'get') {
        var id = parseInt($('[name="own_t"]:checked').attr('id').split('_')[1]);
        if(!id) return '<div hid="0" tid="0" class="owner"><div>не задан</div><small></small></div>';
        var h = $('#own_' + id + 'i').attr('hid'),
            s = $('#own_' + id + 'i').attr('sub'),
            v = $('#own_' + id + 'i').val();
        return '<div hid="'+h+'" tid="'+id+'" class="owner"><div>'+v+'</div><small>'+s+'</small></div>';
    } else {
        var tx = ['','',''],
            id = [0, 0, 0],
            t  = parseInt($(cv).attr('tid'));

        tx[t] = $(cv).find('div').text();
        id[t] = parseInt($(cv).attr('hid'));
        $('#own_' + t).prop('selected', true);
        $('#own_1i').val(tx[1]).attr('hid', id[1]);
        $('#own_2i').val(tx[2]).attr('hid', id[2]);
    }
}


function List() {
  var lastsel;
  $('#link_mode input').change(changeLink);
  $('#owner_type input').change(changeType);

  $Grid = $('#list').jqGrid({
    url         : baseUrl + '.php',
    datatype    : 'json',
    postData    : {link:1},
    mtype       : 'POST',
    width       : '100%',
    height      : '100%',
    colNames    : [ 'Предприятие', 'Код карты', 'Артикул', 'Категория', 'Владелец', 'Заведена', 'Param', 'Прим.'],
    colModel    : [
      {name:'firm',
        index:'cd_firm',
        align:'left',
        width:150,
        editable:true,
        search:true,
        edittype:'select',
        editoptions: { value:sFirmEdit },
        stype: 'select',
        searchoptions: { value:sFirmFlt },
        formatter: 'select'
      },
      {name:'number',
        index:'cd_number',
        align:'center',
        width:120,
        editable:true,
        search:true,
        edittype:'text',
        hidden: !isAdmin, // show this column only to admins
        formatter:fmtCardNumber,
        editrules:{required:true}
      },
      {name:'article',
        index:'cd_article',
        align:'center',
        width:150,
        editable:true,
        search:true,
        edittype:'text',
        editrules:{required:false}
      },
      {name:'cat',
        index:'cd_cat',
        align:'center',
        width:80,
        editable:true,
        search:true,
        edittype:'select',
        editoptions:{value:sCatList},
        //editrules:{required:true},
        stype: 'select',
        searchoptions: { value:sCatList },
        formatter: 'select'
      },
      {name:'owner',
        index:'owner',
        align:'left',
        width:200,
        editable:true,
        search:true,
        edittype:'custom',
        editoptions:{
          custom_element: ownerCreate,
          custom_value: ownerValue,
          dataInit: ownerInit
        },
        formatter: fmtOwner,
        cellattr: AttrCar
      },
      {name:'created',
        index:'cd_created',
        align:'center',
        width:100,
        editable:false,
        search:true,
        formatter:'date', formatoptions: {srcformat: 'Y-m-d H:i:s', newformat: 'd.m.Y H:i'},
        searchoptions: {dataInit: function (element) {
        $(element).datepicker({
          showAnim:'slideDown',
          showOptions:{direction:'down'},
          dateFormat: 'yy-mm-dd',
          onClose: function(){$('#list')[0].triggerToolbar();},
          beforeShow: function (input, inst) {
            var offset = $(input).offset();
            var height = $(input).height();
            window.setTimeout(function () {
                inst.dpDiv.css({ top: (offset.top + height + 4) + 'px', left: offset.left + 'px' });
            }, 1);
          }
        });
      }}
      },
      {name:'param',
        index: 'cd_param',
        hidden:true
      },
      {name:'note',
        index:'cd_note',
        align:'left',
        width:200,
        editable:true,
        search:true,
        edittype:'textarea',
        editrules:{required:false}
      }
    ],
    pagination  : true,
    pager       : '#pager',
    page        : 1,
    rowNum      : 10,
    rowList     : [5,10,20,30,50,70,100,150],
    sortname    : 'cd_number',
    sortorder   : "asc",
    viewrecords : true,
    caption     : '',
    loadonce    : false,

    gridview: true,
    autoencode: true,
    height: "auto",
    editurl     : baseUrl + '_action.php',
    rownumbers  : true,
    hidegrid    : false,
    subGrid     : true,
    subGridOptions  : {
      "plusicon" : "ui-icon-triangle-1-e",
      "minusicon" : "ui-icon-triangle-1-s",
      "openicon" : "ui-icon-arrowreturn-1-e",
      "reloadOnExpand" : true,
      "selectOnExpand" : true
    },
    subGridRowExpanded: ListSubGrid,
    ondblClickRow: cardDblClick
  });
  $Grid.jqGrid('filterToolbar',{ autoseach:true, searchOnEnter : false, stringResult: true, defaultSearch:'cn'});
  $Grid.jqGrid('navGrid','#pager', { edit:true, add:true, del:true, search:false },paramEdit,paramEdit);

  function changeLink() {
    if (!userRights.edit) return;
    var pd   = $Grid.jqGrid('getGridParam', 'postData'),
      link = $('#link').prop('checked') ? 1 : 0;
    if(pd.link != link) {
      pd.link = link;
      $Grid.trigger('reloadGrid');
    }
  }
  function changeType() {
    if (!userRights.edit) return;
    var link = $('#car_owner').prop('checked') ? 1 : 0;
    if(link) {
      $('#car_group').show().parent().find('#driver_group').hide();
    } else {
      $('#driver_group').show().parent().find('#car_group').hide();
    }
  }

  function cardDblClick(id) {
    if (!userRights.edit) return;
    var pd   = $Grid.jqGrid('getGridParam', 'postData');
    if(pd.link == 1) {
        ServiceUnlink(id);
    } else {
        ServiceLink(id);
    }
  }

  function ServiceLink(id) {
    if (!userRights.edit) return;
    $Order.attr('oid', id);
    var rd = $Grid.jqGrid('getRowData', id);
    // var fid = parseInt($(rd.firm).attr('val'));
    var fid = rd.firm;

    if (fid > 0)	{
      $('#firm_id').val(fid).prop('disabled', true);
    } else {
      $('#firm_id').val(fid).prop('selected', true);
    }

    var $car = $(rd.owner);
    $('#car_id')
      .val($car.eq(0).text())
      .attr('cid', parseInt($car.attr('cid')))
      .prop('disabled', fid <= 0);
    $('#car_num').val($car.eq(2).text());

    SelectFirm();

    $Order.dialog('open');
  }

  function ServiceUnlink(id) {
    if (!userRights.edit) return;
    var rd = $Grid.jqGrid('getRowData', id);
    jConfirm('Отвязать карту <b>' + rd.article +' №'+rd.number + '</b> ?', 'Внимание!', function(a){
        if(!a) return;
        $.post(
             'page/scripts/rfid-card_action.php',
             { id:id, oper:'unlink' },
             function(rsp) {
                if(rsp && rsp.status == 'ok') {

                     $Grid.trigger('reloadGrid');
                     jAlert('Карта отвязана успешно.');
                     return;
                }
                else {
                    jAlert(rsp.status);
                    return;
                }

            },
            'json'
        );
    });
}


}

function SelectFirm() {
    
  var fid = parseInt($('#firm_id').val());

  $('#car_id').val('').attr('cid', 0);
  $('#car_num').val('');

  $('#driver_id').val('').attr('did', 0);

  $CarList.jqGrid('getGridParam', 'postData').firm = fid;
  $CarList.trigger('reloadGrid');

  $DrvList.jqGrid('getGridParam', 'postData').firm = fid;
  $DrvList.trigger('reloadGrid');

  $('#choose_car,#car_id,#choose_driver,#driver_id').prop('disabled', false);
    
}

// select Car from table of available for this Firm
function chooseCar(id) {
    var rd = $CarList.jqGrid('getRowData', id);
    $CarDlg.dialog('close');
    $('#car_id')
        .val(rd.c_name)
        .attr('cid', id);
    $('#car_num').val(rd.c_num);

    return false;
}

// select Driver from table of available for this Firm
function chooseDrv(id) {
  var rd = $DrvList.jqGrid('getRowData', id);
  $DrvDlg.dialog('close');
  $('#driver_id')
    .val(rd.name)
    .attr('did', id);

  return false;
}

});