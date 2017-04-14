var idOrdEd		= '',
    idDrvEd		= '',
    idDrvCnt    = 1,
    bOrdInit    = false,
    $Grid		= null,
    $GridDrv	= null,
    $Order		= null,
    $OrderLdr	= null,
    $OrderDrv	= null, // DriverSelector
    $OrderBegD  = null, // Driver begin date
    $OrderEndD  = null, // Driver end   date
    $Drv		= null,
    $DrvLdr		= null,
    $CarDlg     = null, // Car selector dialog
    $CarList    = null, // Car selector grid
    $DestLstDlg = null, // Destination selector dialog
    $DestDlg    = null, // Destination create dialog
    $DestLdr    = null, // Destination create dialog loader
    $DestList   = null, // Destination selector grid
    destStyle  = {
        hold : {i:'h-square', c:'000080'},
        self : {i:'map-marker', c:'008000'}
    }
    $Help		= null,
    regDateTm   = /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/,
    regPhone    = /^(0{1}(39|50|6\d|9\d){1})(\d{7})$/,
    regItn      = /^(\d{10}|)$/,
    regFio      = /^.+\s.+\s.+$/,
    sDtFmt      = 'DD-MM-YYYY HH:mm'; // moment.js

$(document).ready(function() {

    ListOrders();


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
				.append( "<i class='fa fa-2x fa-" + i + "' style='color:#" + ci +
						 "'> </i><div class='car-item'><div style='color:#" + ct + "'>" + item.label + e +
						 "</div><small>гос.№ <font color=#005800>" + item.n + "</font>,&nbsp;VIN:&nbsp;" +
						 "<font color=teal>" + item.v + "</font></small></div>")
				.appendTo( ul );
		},
		_resizeMenu: function() {
			this.menu.element.outerWidth( 450 );
		}
	});

	$.widget( "custom.topselect", $.ui.autocomplete, {
		_renderItem: function( ul, item ) {
			if(item.label == '-') {
				return $( '<li>' ).prop('disabled', true).append('<hr>').appendTo( ul );
			}
			return $( "<li>" )
				.attr( "data-value", item.value )
				.append( '<div class="dv_top_n">' + item.label + '</div><div class="dv_top_g">' + item.grp +
						 '</div><div class="dv_top_d">Топл.: <b>' +
						 item.fuel + '</b>, Усл.: <b>' + item.srv + '</b>, ЗП: <b>' + item.sal + '</b></div>')
				.appendTo( ul );
		},
		_resizeMenu: function() {
			this.menu.element.outerWidth( 300 );
		}
	});

    $.widget( "custom.objselect", $.ui.autocomplete, {
        _renderItem: function( ul, item ) {
            if(item.label == '-') {
                return $( '<li>' ).prop('disabled', true).append('<hr>').appendTo( ul );
            }
            var s = item.f == 1 ? destStyle.hold : destStyle.self;
            return $( "<li>" )
                .attr( "data-value", item.value )
                .append( '<i class="fa fa-2x fa-' + s.i + '" style="color:#' + s.c +
                         '"> </i><div class="car-item"><div>' + item.label + '</div><div><span class="sp_city">'
                         + item.c + '</span>,&nbsp;<span class="sp_adr">' + item.a + '</span></div></div>')
                .appendTo( ul );
        },
        _resizeMenu: function() {
            this.menu.element.outerWidth( 450 );
        }
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
		},
		_resizeMenu: function() {
			this.menu.element.outerWidth( 450 );
		}
	});

    // Top buttons
	$('#cmd_new').button().click(OrderNew);
	$('#cmd_help').button().click(ShowHelp);
	//$('#cmd_guide').button().click(ShowGuide);

    // ORDER DIALOG
    $('#car_id').carselect({
        source        : searchCar,
        select        : selectCar,
        focus        : FocusSkip,
        appendTo    : 'body',
        minLength    : 3
    }).keyup(keyUpCar);

    $('#oper_id').topselect({
        source        : searchOper,
        select        : selectOper,
        focus        : FocusSkip,
        appendTo    : 'body',
        minLength    : 3
    }).keyup(keyUpOper);

    $('#dest_id').objselect({
        source        : searchObj,
        select        : selectObj,
        focus        : FocusSkip,
        appendTo    : 'body',
        minLength    : 3
    }).keyup(keyUpDest);

    $('#dev_id' ).keyup(keyUpCar);

    $('#firm_id').change(SelectFirm);
    $('#type_id').change(SelectType);

	$Order = $('#dlg_order').dialog({
		title       : 'Новый наряд',
		autoOpen    : false,
		width       : 'auto',
		height      : 'auto',
		modal       : true,
        focus       : moveSearchUp,
        close       : OrderCancel,
        closeOnEscape: false,
		buttons     : [
			{ text:'Сохранить', icons:{primary: 'ui-icon-disk'}, click: OrderSave, id:'it_add'},
			{ text:'Отмена', icons:{primary: 'ui-icon-cancel'}, click: function() { $Order.dialog('close') } }
		]
	});
	$Order.parent().find('.ui-dialog-buttonset').before('<div id="dlg_order_loader" style="float:left;margin-top:8px;"><img src="./images/loading.gif"></div>');
	$OrderLdr = $('#dlg_order_loader');

    $GridDrv = $("#drv").jqGrid({
        datatype        : ListDrivers,
        width            : '100%',
        height            : 'auto',
        colNames        : [ 'Водитель', 'Телефон', 'id', 'Начало', 'Окончание' ],
        colModel        : [
            { name:'d_name', index:'d_name', align:'left', width:200, editable:true },
            { name:'d_phone', index:'d_phone', align:'left', width:80, editable:true },
            { name:'d_id',    index:'d_id', hidden: true },
            { name:'d_beg', index:'d_beg', align:'center', width:120, editable:true },
            { name:'d_end', index:'d_end', align:'center', width:120, editable:true },
        ],
        rowNum            : 30,
        caption            : 'Водители',
        hidegrid        : false,
        footerrow        : false,
        ondblClickRow    : DrvEdit,
        gridComplete    : DrvComplete
    });

    $('#drv_add').button({ icons:{primary: 'ui-icon-plusthick'}}).click(DrvAdd);
    $('#drv_del').button({ icons:{primary: 'ui-icon-trash'}}).click(DrvDel);
    $('#drv_new').button({ icons:{primary: 'ui-icon-person'}}).click(DrvNew);


    // NEW DRIVER DIALOG
    $('#dd_fio').keyup(keyUpFio);
    $('#dd_itin').keyup(keyUpItin);
    $('#dd_phone').keyup(keyUpPhone);

	$Drv = $('#dlg_driver').dialog({
		title: 'Новый водитель',
		autoOpen: false,
		width: 'auto',
		height: 'auto',
		modal: true,
		buttons: [
			{ text:'Сохранить', icons:{primary: 'ui-icon-disk'}, click: DrvNewSave, id:'it_add'},
			{ text:'Отмена', icons:{primary: 'ui-icon-cancel'}, click: function() { $Drv.dialog('close') } }
		],
		focus: moveSearchUp,
		close: DrvNewCancel
	});
	$Drv.parent().find('.ui-dialog-buttonset').before('<div id="dlg_driver_loader" style="float:left;margin-top:8px;"><img src="./images/loading.gif"></div>');
	$DrvLdr = $('#dlg_driver_loader');

    // Car selector + carlist
    $('#choose_car').button().click(showCarList);

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

    $CarDlg = $('#dlg_carlist').dialog({
        title: 'Выбор транспортного средства',
        autoOpen: false,
        width: 'auto',
        height: 'auto',
        modal: true,
        buttons: []
    });

    // Destination selector dialog
    $('#choose_dest').button().click(showDestList);
    $('#new_dest').button().click(showNewDest);

    $DestList = $("#destlist").jqGrid({
        url             : baseUrl + '_destinations.php',
        postData        : { firm:0 },
        mtype           : 'post',
        datatype        : 'json',
        width           : '100%',
        height          : '400',
        colNames        : [ 'Наименование', 'Город', 'Адрес' ],
        colModel        : [
            { name:'d_name', index:'o_name', align:'left', width:200, formatter:fmtObject },
            { name:'d_city', index:'c_name', align:'left', width:200 },
            { name:'d_adr',  index:'o_adr',  align:'left', width:300 }
        ],
        scroll          : true,
        rowNum          : 10000,
        caption         : '',
        sortname        : 'o_name',
        sortorder       : "asc",
        hidegrid        : false,
        footerrow       : false,
        onSelectRow     : chooseDest
    });

    $DestLstDlg = $('#dlg_destlist').dialog({
        title: 'Выбор места назначения',
        autoOpen: false,
        width: 'auto',
        height: 'auto',
        modal: true,
        buttons: []
    });

    // New destination dialog
    $('#ds_name'  ).keyup(KeyUp_Text);
    $('#ds_adr'   ).keyup(KeyUp_Text);
    $('#ds_city').autocomplete({
        source: searchCity,
        //position: { my: "left top", at: "left bottom", collision: "none", of:'#ds_city' },
        appendTo: 'body',
        select: selectCity
    });

    $('#ds_region').change(selectRegion);
    $('#ds_area').change(selectArea);

    $DestDlg = $('#dlg_dest').dialog({
        title: 'Новое место назначения',
        autoOpen: false,
        width: 'auto',
        height: 'auto',
        modal: true,
        focus: moveDestUp,
        buttons: [
            { text:'Сохранить', icons:{primary: 'ui-icon-disk'}, click: destSave, id:'it_add'},
            { text:'Отмена', icons:{primary: 'ui-icon-cancel'}, click: function() { $DestDlg.dialog('close') } }
        ],
        close: destCancel
    });
    $DestDlg.parent().find('.ui-dialog-buttonset').before('<div id="dst_loader" style="float:left;margin-top:8px;"><img src="./images/loading.gif"></div>');
    $DestLdr = $('#dst_loader');
});


function ListOrders(){
	$Grid = $("#list").jqGrid({
		url				: baseUrl + '.php',
		datatype		: 'json',
		postData		: getVars,
		loadComplete	: function(id){ $('#loader').fadeOut(100); },
		mtype			: 'POST',
		width			: '100%',
		height			: '100%',
		colNames		: [ 'Наряд', 'Предприятие', 'ТС', 'Дата с', 'Дата по', 'Создан', 'Вид', 'Комментарий', 'Автор', 'Flags', 'Водитель' ],
		colModel		: [
			{ name:'id',index:'o.id',align:'center',width:50,search:false, cellattr:AttrId },
			{ name:'name',index:'name',align:'left',width:160, formatter: FmtNameValue,
				editable:true, stype: 'select',
				searchoptions: { value:vFirm, clearSearch: false }
			},
			{ name:'ts_name',index:'name_ts',align:'left',width:200,search:true, formatter:FmtCar, cellattr:AttrCar },
			{ name:'start',  index:'start',align:'left',width:90,search:true,formatter:'date',
				formatoptions: {srcformat: 'Y-m-d H:i:s', newformat: 'd.m.Y H:i'},
				searchoptions: {dataInit: function (element) {
					$(element).datepicker({
							showAnim:'slideDown',
							showOptions:{direction:'down'},
							dateFormat: 'dd.mm.yy',
							yearSuffix:'г.',
							onClose: function(){$('#list')[0].triggerToolbar();},
							beforeShow: function (input, inst) {
								var offset = $(input).offset();
								var height = $(input).height();
								window.setTimeout(function () {
									inst.dpDiv.css({ top: (offset.top + height + 4) + 'px', left: offset.left + 'px' })
								}, 1);
							}
					})
				}}
			},
			{ name:'end',index:'end',align:'left',width:90,search:true,formatter:'date',
				formatoptions: {srcformat: 'Y-m-d H:i:s', newformat: 'd.m.Y H:i'},
				searchoptions: {dataInit: function (element) {
					$(element).datepicker({
							showAnim:'slideDown',
							showOptions:{direction:'down'},
							dateFormat: 'dd.mm.yy',
							yearSuffix:'г.',
							onClose: function(){$('#list')[0].triggerToolbar();},
							beforeShow: function (input, inst) {
								var offset = $(input).offset();
								var height = $(input).height();
								window.setTimeout(function () {
									inst.dpDiv.css({ top: (offset.top + height + 4) + 'px', left: offset.left + 'px' })
								}, 1);
							}
					})
				}},
				searchrules: { date: true }
			},
			{ name:'dt_create',index:'dt_create',align:'left',width:90,search:true,formatter:'date',
				formatoptions: {srcformat: 'Y-m-d H:i:s', newformat: 'd.m.Y H:i'},
				searchoptions: {dataInit: function (element) {
					$(element).datepicker({
							showAnim:'slideDown',
							showOptions:{direction:'down'},
							dateFormat: 'dd.mm.yy',
							yearSuffix:'г.',
							onClose: function(){$('#list')[0].triggerToolbar();},
							beforeShow: function (input, inst) {
								var offset = $(input).offset();
								var height = $(input).height();
								window.setTimeout(function () {
									inst.dpDiv.css({ top: (offset.top + height + 4) + 'px', left: offset.left + 'px' })
								}, 1);
							}
					})
				}},
				searchrules: { date: true }
			},
			{ name:'type',index:'type_name',align:'left',width:140, formatter: FmtNameValue,
				editable:false, stype: 'select', searchoptions: { value:fType }
			},
			{ name:'comment',index:'comment',align:'left',width:100,editable:false,search:false },
			{ name:'user_id',index:'user_id',align:'left',width:100,editable:false,search:false },
			{ name:'flags',index:'flags',align:'center',width:50,editable:false,search:false, formatter:FmtFlags },
			{ name:'driver',index:'driver',align:'left',width:100,editable:false,search:false, formatter:FmtDrv, cellattr:AttrDrv }
		],

		pager: '#pager',
		rowNum:30,
		rowList:[5,10,20,30,50,70,100,150],
		sortname: 'o.id',
		sortorder: "desc",
		viewrecords: true,
		caption: 'Наряды',
        loadtext    : '<img src="images/blue_loading.gif" />',
		footerrow : false,
		userDataOnFooter : true,
		altRows : true,
		ondblClickRow: OrderEdit,

		gridComplete: function(){
			var ids = $Grid.jqGrid('getDataIDs');
			for(var i=0; i < ids.length; i++) {
				var cl = ids[i];
				var trek=$('#'+ids[i]).find('td').eq(5).text();
			}
		}
	});

	$Grid.jqGrid('filterToolbar',{ autosearch:true, searchOnEnter : false, stringResult: true, defaultSearch:'cn' });
	$Grid.jqGrid('navGrid','#pager', { edit:false,add:false,del:false,search:false })
		.navButtonAdd('#pager',{
			caption:"<b>Добавить наряд</b>",
			id:'ord_new',
			buttonicon:"ui-icon-plus",
			onClickButton: OrderNew,
			position:"last",
			title:'Добавить запись'
		})
		.navButtonAdd('#pager',{
			caption:"Удалить наряд",
			id:'ord_del',
			buttonicon:"ui-icon-trash",
			onClickButton: OrderDelete,
			position:"last",
			title:'Удалить выделенную запись'
		});
    $('.clearsearchclass')
        .addClass('fa')
        .addClass('fa-ban')
        .width(7)
        .html('')
        .attr('title', 'Очистить поле');
}

function FmtCar(cv) {
	var a = cv.split('|');
	if(a.length < 3) return cv;
	return '<span cid="' + a[2] + '">' + a[0] + '</span>&nbsp;<small>' + a[1] + '</small>';
}

function FmtNameValue(cv) {
	var a = cv.split('|');
	if(a.length < 2) return cv;
	return '<span val="' + a[1] + '">' + a[0] + '</span>';
}

function FmtFlags(cv, opt, row) {
	var ret = [];
	var type = parseInt(row[6].split('|')[1]);
	$.each(aFlag, function(k, v){
        if(v.s == 1 && type != 4) return true; // That flag is only for business-trips
		var flg = ((1<<v.s) & cv) > 0;
			ico = flg ? v.i1 : v.i0,
			tit = flg ? v.t1 : v.t0,
			clr = flg ? v.c1 : v.c0;
		if(ico != '') {
			if(clr) clr = 'style="color:' + clr + '"';
			ret.push('<i ' + clr + ' class="fa fa-lg fa-' + ico + '" title="' + tit + '"> </i>');
		}
	});
	return '<span flg="' + cv + '">' + ret.join('&nbsp;') + '</span>';
}

function FmtDrv(cv) {
	var drv = [];
	var txt = '', tit = '';
	$.each(cv, function(k,v){
		drv.push('d_' + v.id + '="' + v.name + '|' + v.inn + '|' + v.ph + '|' + v.beg + '|' + v.end + '"');
		if(txt == '') {
			var a = v.name.split(' ');
			if(a.length > 2) {
				txt = a[0] + '&nbsp;' + a[1].charAt(0) + '.' + a[2].charAt(0) + '.';
			} else {
				txt = v.name;
			}
			if(cv.length > 1) {
				tit = 'И еще ' + (cv.length - 1).toString() + ' вод.';
			} else {
				tit = v.name + ' (' + v.ph + ')';
			}
		}
	});
	return '<span ' + drv.join(' ') + ' tit="' + tit + '">' + txt + '</span>';
}

function AttrDrv(rid, cv) {
	return ' title="' + $(cv).attr('tit') + '"';
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

function DlgOrder_ZIndex() {
    return $('[aria-describedby="dlg_order"]').css('z-index') + 1;
}
function DlgDest_ZIndex() {
    return $('[aria-describedby="dlg_dest"]').css('z-index') + 1;
}

function AttrId() {    return ' class="ui-state-default"'; }

function fmtObject(cv) {
    var a = cv.split('|'),
        s = a[1] == 1 ? destStyle.hold : destStyle.self;
    return '<i class="fa fa-fw fa-' + s.i + '" style="color:#' + s.c + ' !important;"> </i>&nbsp; <span>' + a[0] + '</span>';
}

function KeyUpRegEx(o, r, a) {
	o.removeClass('tbl_bad');
	if(!r.test(o.val())) {
        o.addClass('tbl_bad');
        if(a) o.attr(a, 0);
    }
}
function keyUpFio(ev)   { KeyUpRegEx($(this), regFio,   null); }
function keyUpItin(ev)  { KeyUpRegEx($(this), regItn,   null); }
function keyUpPhone(ev) { KeyUpRegEx($(this), regPhone, null); }
function keyUpDrv(ev)   { KeyUpRegEx($(this), /.+/,    'uid'); }
function keyUpOper(ev)  { KeyUpRegEx($(this), /.+/,   'toid'); }
function keyUpDest(ev)  { KeyUpRegEx($(this), /.+/,    'cid'); }
function keyUpCar(ev) {
    var $o = $(this);
    KeyUpRegEx($o, /.+/, 'cid');
    var v = $o.val();
    if($o.val().length < 1) {
        $('#car_num').val('');
    }
}
function KeyUp_Text(ev) {
    var o = $(ev.target);
    var n = o.attr('min');
    if(!n) { n = 1; }
    var v = o.val();
    //v = v.replace(/['"]/gi, '`');
    //o.val(v);
    if(n && v.length < n) {
        o.addClass('tbl_bad');
    } else {
        o.removeClass('tbl_bad');
    }
}

function SelectFirm() {
    var fid = parseInt($('#firm_id').val());
	$('#car_id').val('').attr('cid', 0);
	$('#car_num').val('');
    $CarList.jqGrid('getGridParam', 'postData').firm = fid;
    $CarList.trigger('reloadGrid');
    $DestList.jqGrid('getGridParam', 'postData').firm = fid;
    $DestList.trigger('reloadGrid');
	ResetDrivers();
    $('#choose_car,#car_id').prop('disabled', fid <= 0);
}

function SelectType() {
	var t = $('#type_id').val();
	if(t == 4) {
		$('#trDest').show();
	} else {
		$('#trDest').hide();
	}
}

function CheckType() {
	type = jQuery('#type_id').val();
	if (type==4) {
		jQuery('#firm_trip_div').show();
	} else {
		jQuery('#firm_trip_div').hide();
	}
}

function FocusSkip(ev, ui) { return false; }
function selectCar(ev, ui) {
	$('#car_id')
		.val(ui.item.label)
		.attr('cid', ui.item.value);
	$('#car_num').val(ui.item.n);
	if(ui.item.s != 1) {
		$('#trCarInfo a').attr('href', './?fl=gps&action=carlist&carid=' + ui.item.value);
		$('#trCarInfo').show();
	} else {
		$('#trCarInfo').hide();
	}
	return false;
}

function selectOper(ev, ui) {
	$('#oper_id')
		.val(ui.item.label)
		.attr('toid', ui.item.value);
	return false;
}

function selectObj(ev, ui) {
    $('#dest_id')
        .val(ui.item.label)
        .attr('cid', ui.item.value);
    return false;
}

function SelectDrv(ev, ui) {
	var id  = this.id,
	    x   = id.split('_'),
        ph  = x[0] + '_d_phone';
	$('#' + id).val(ui.item.label);
	$('#' + x[0] + ' td:eq(2)').text(ui.item.value);
	$('#' + ph).val(ui.item.p);
	return false;
}

function searchCar(req, rsp)  { searchItem('car', req, rsp); }
function searchDrv(req, rsp)  { searchItem('drv', req, rsp); }
function searchOper(req, rsp) { searchItem('techop', req, rsp); }
function searchObj(req, rsp)  { searchItem('obj', req, rsp); }
function searchCity(req, rsp) {
    var iArea = $('#ds_area').val();
    if(isNaN(iArea)) return;
    $.post(dir + '/search.php', {a:'city', s:req.term, i:iArea, nd:Date.now()}, rsp, 'json');
}
function searchItem(what, req, rsp) {
	var oid = $Order.attr('oid');
	var pd  = {
		a	: what,
		s	: req.term,
		o	: $Order.attr('oid'),
		f	: $('#firm_id').val(),
		c	: $('#car_id').attr('cid'),
		nd	: Date.now()
	};
	$OrderLdr.show();
	$.post(dir + '/search.php', pd, rsp, 'json').always(function(){$OrderLdr.hide();})
}

function showCarList() { $CarDlg.dialog('open'); }
function showDestList() { $DestLstDlg.dialog('open'); }

function fmtIcon(cv) {
    var a = cv.split('|'),
        t = a[0],
        c = a.length > 1 ? a[1] : '000000';
    return '<i class="fa fa-lg fa-' + t + '" style="color:#' + c + ';"> </i>';
}

function chooseCar(id) {
    var rd = $CarList.jqGrid('getRowData', id);
    $CarDlg.dialog('close');
    $('#car_id')
        .val(rd.c_name)
        .attr('cid', id);
    $('#car_num').val(rd.c_num);
    if(rd.c_stat != 1) {
        $('#trCarInfo a').attr('href', './?fl=gps&action=carlist&carid=' + ui.item.value);
        $('#trCarInfo').show();
    } else {
        $('#trCarInfo').hide();
    }
    return false;
}

function chooseDest(id) {
    var rd = $DestList.jqGrid('getRowData', id);
    $DestLstDlg.dialog('close');
    $('#dest_id')
        .val($(rd.d_name).eq(2).text())
        .attr('cid', id);
    return false;
}

function OrderSave() {
  if (!userRights.edit) return;
	$('.tbl_bad').removeClass('tbl_bad');
    if(idDrvEd != '') {
	    $GridDrv.jqGrid('saveRow', idDrvEd, {url:'clientArray', aftersavefunc:DrvSave});
    }
	var aBad = [];

	var firm_id   = $('#firm_id').val(),
	    car_id    = $('#car_id').attr('cid'),
	    car_trip  = $('#car_num').attr('bt'),
	    type      = $('#type_id').val(),
	    order_id  = $Order.attr('oid'),
	    dest_id   = $('#dest_id').attr('cid'),
	    comment   = $('#comment').val();

	if (car_id == 0) { aBad.push({i:'car_id', t:'Выберите автомобиль!'}); }
	if (type == 0) { aBad.push({i:'type_id', t:'Нужно задать тип наряда!'}); }
	if (type == 4 && car_trip != '') { aBad.push({i:'type_id', t:'Нужно сперва вернуть авто из командировки в ' + car_trip + '!' }); }
	if (type == 4 && dest_id == 0) { aBad.push({i:'dest_id', t:'Для командировки нужно выбрать место назначения (Куда)!'}); }

    var mtBeg = null,
        mtEnd = null,
        aDrv  = [];
	$.each(oDrv.rows, function(k,v){
		if(v.id == 'new') {
			{ aBad.push({i:'new', t:'Остался незаданный водитель!'}); }
            return false;
		}
        var tmBeg = moment(v.cell[3], sDtFmt),
            tmEnd = moment(v.cell[4], sDtFmt);
        if(mtBeg != null && !mtEnd.isSame(tmBeg)) {
            aBad.push({i:v.id, t:'Начало работы водителя <b>' + v.cell[0] + '</b> должно совпадать с окончанием предыдущего!'});
        }
        mtBeg = tmBeg;
        mtEnd = tmEnd;
        aDrv.push(v.cell);
		console.log("Drv=" + v.cell[0] + ", ph=" + v.cell[1] + ", id=" + v.cell[2]);
	});

	var aMsg = [];
	if(aBad.length > 0) {
		var cFocus = null;
		$.each(aBad, function(k,v){
			if(cFocus == null) cFocus = v.i;
			aMsg.push(v.t);
			$('#' + v.i).addClass('tbl_bad');
		});
		$('#' + cFocus).focus();
		jAlert(aMsg.join('<br>'), 'Внимание!');
		idDrvEd = 'new';
		DrvStartEdit();
		return;
	}

  var pd = {
      order_id    : order_id,
      firm_id     : firm_id,
      car_id      : car_id,
      data        : aDrv,
      oper        : order_id == 0 ? 'add' : 'edit',
      type        : type,
      dest_id     : dest_id,
      tech_op     : 0,
      trailer     : 0,
      flds        : [],
      comment     : comment
  };

  $OrderLdr.show();

	$.post(
		baseUrl + '_actions.php',
		pd,
		function(answ) {
      $OrderLdr.hide();
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

function OrderCancel() {
  if (!userRights.edit) return;
	$OrderLdr.hide();
	$('.tbl_bad').removeClass('tbl_bad');
	$('#trCarInfo').hide();
	$('#trDest').hide();
	$('#trComment').hide();
	$('#firm_id option:eq(0)').prop('selected', true);
	$('#firm_id ').prop('disabled', false);
	$('#car_id')
		.val($('#car_id').attr('b'))
		.attr('cid', 0)
		.prop('disabled', false);
	$('#car_num').val('').attr('bt', '');
	$('#type_id').val(0);
	$('#dest_id option').show().eq(0).prop('selected', true);
	$('#comment').val('');
	$('#dlg_order select').val(0);
	ResetDrivers();

	$Order.attr('oid', 0);
}
function OrderNew() {
  if (!userRights.edit) return;
	OrderCancel();
    bOrdInit = true;
    $GridDrv.trigger('reloadGrid');
	$('#firm_id option').eq(0).prop('selected', true);
    SelectFirm();
	$Order.dialog('open');
}

function OrderEdit(id) {
  if (!userRights.edit) return;
	if(!id) return;
	idOrdEd = id;
	OrderCancel();
	$Order.attr('oid', id);
	var rd = $Grid.jqGrid('getRowData', id);
	var type = parseInt($(rd.type).attr('val'));
	//SprCarsFirm(data.order.firm_id,data.order.car_id); // car already selected!!!
	//SprRentCars(data.order.firm_id,data.order.rent_car_id);
	var fid = parseInt($(rd.name).attr('val'));
	$('#firm_id')
		.val(fid)
		.prop('disabled', true);
	$('#dest_id [value="' + fid + '"]').hide();
	var $car = $(rd.ts_name);
	//console.log($car);
	$('#car_id')
		.val($car.eq(0).text())
		.attr('cid', parseInt($car.attr('cid')))
		.prop('disabled', true);
	$('#car_num').val($car.eq(2).text());
	$('#type_id').val(type);
	$('#comment').val(rd.comment);

    oDrv.records = 0;
    oDrv.rows    = [];
    $sDrv = $(rd.driver);
    $.each($sDrv[0].attributes, function(k,v){
        var a = v.name.split('_');
        if(a.length != 2) return true;
        var did = parseInt(a[1]),
            par = v.value.split('|');
        var o = {
            id   : 'd_' + (++idDrvCnt),
            cell : [
                par[0],
                par[2],
                did,
                par[3],
                par[4]
            ]
        };
        oDrv.rows.push(o);
        oDrv.records++;
    });


	if (type == 4) {
		$('#trDest').show();
		//$('#dest_id').val(rd.frm_trip);
	}

    //bOrdInit = true;
    $GridDrv.trigger('reloadGrid');
	$Order.dialog('open');
}

function OrderDelete() {
  if (!userRights.edit) return;
	var id = $Grid.jqGrid('getGridParam','selrow');
	if (id) {
		jConfirm('Удалить наряд?', 'Подтверждение', function(a) {
			if(!a) return;
			$.post(
				baseUrl + '_actions.php',
				{order_id: id, oper: 'del'},
				function(answ){
					if (answ.status != 'ok') {
						jError(answ.status);
					}
                    $Grid.trigger('reloadGrid');
				},
                'json'
			);
		});
	} else {
		jError('Не выделена строка!','Ошибка');
	}
}

function moveSearchUp(ev) {
    setTimeout(function() {
        lastZ = DlgOrder_ZIndex();
        lastZ++;
        $('#car_id').carselect('widget').css('z-index', lastZ);
        $('#oper_id').topselect('widget').css('z-index', lastZ);
        $('#dest_id').objselect('widget').css('z-index', lastZ);
        if($OrderDrv) $OrderDrv.drvselect('widget').css('z-index', lastZ);
        //if($OrderBegD) $OrderBegD.datepicker('widget').css('z-index', lastZ);
        //if($OrderEndD) $OrderEndD.datepicker('widget').css('z-index', lastZ);
    }, 100);
}

function moveDestUp(ev) {
    setTimeout(function() {
        lastZ = DlgDest_ZIndex();
        lastZ++;
        $('#ds_city').autocomplete('widget').css('z-index', lastZ);
    }, 100);
}

var oDrv = {
    total    : 1,
    page    : 1,
    records    : 1,
    rows    : [$.extend(true, {}, oDef)]
}

function ResetDrivers() {
    idDrvEd = '';
    oDrv.records = 1;
    oDrv.rows = [$.extend(true, {}, oDef)];
    if($OrderDrv) $OrderDrv.drvselect('destroy');
    $OrderDrv = null;
    $GridDrv.trigger('reloadGrid');
}

function ListDrivers(pd) {
	var grid = $('#drv')[0];
	grid.addJSONData(oDrv);
}

function DrvAdd() {
  if (!userRights.edit) return;
    var lst, prv, cur, nxt,
        o = $.extend(true, {}, oDef);

	if(idDrvEd != '') {
        if(parseInt($('#' + idDrvEd + ' td:eq(2)').text()) <= 0) {
            jError('Не выбран водитель! Выберите водителя из списка.<br>' +
                    'Для добавления нового нажмите <b class="ui-button ui-button-text-icon-primary">' +
                    '<span class="ui-button-icon-primary ui-icon ui-icon-person">' +
                    '</span><span class="ui-button-text">Создать</span></b>');
            return;
        }
        $GridDrv.jqGrid('saveRow', idDrvEd, {url:'clientArray', aftersavefunc:DrvSave});
        //console.log('DrvAdd after DrvSave');
    }

    var lst = DrvGetPrevCurNext('new');
    if(lst[1] == null) {
        var prv = oDrv.rows[oDrv.rows.length - 1],
            beg = moment(prv.cell[4], sDtFmt),
            end = moment(prv.cell[4], sDtFmt).add(8, 'h');
        o.cell[3] = beg.format(sDtFmt);
        o.cell[4] = end.format(sDtFmt);
        oDrv.rows.push(o);
        $GridDrv.trigger('reloadGrid');
    }
	idDrvEd = 'new';
	DrvStartEdit();
}

function DrvDel() {
  if (!userRights.edit) return;
    if(oDrv.rows.length < 2) {
        jError('Должен быть один водитель!');
        return;
    }
    var sel = $GridDrv.jqGrid('getGridParam', 'selrow');
    if((sel == null || sel == idDrvEd) && idDrvEd != '') {
        sel = idDrvEd;
        $OrderDrv.drvselect('destroy');
        $GridDrv.jqGrid('restoreRow', idDrvEd);
        $OrderDrv = null;
        $OrderBegD = null;
        $OrderEndD = null;
        idDrvEd = '';
    }
    if(sel != null) {
        var lst = DrvGetPrevCurNext(sel),
            cur = lst[1];
        oDrv.rows.splice(oDrv.rows.indexOf(cur), 1);
        $GridDrv.trigger('reloadGrid');
    }
}

function DrvNewCancel() {
  if (!userRights.edit) return;
	$DrvLdr.hide();
	$Drv.find('input').val('').removeClass('tbl_bad');
}

function DrvNewSave() {
  if (!userRights.edit) return;
	$('.tbl_bad').removeClass('tbl_bad');
	var aBad = [];

	var fio		= $('#dd_fio').val();
	var itin	= $('#dd_itin').val();
	var phone	= $('#dd_phone').val();

	if (!regFio.test(fio)) { aBad.push({i:'dd_fio', t:'Укажите Фамилию Имя и Отчество водителя!'}); }
	if (!regItn.test(itin)) { aBad.push({i:'dd_itin', t:'Укажите ИНН - 10 цифр!'}); }
	if (!regPhone.test(phone)) { aBad.push({i:'dd_phone', t:'Укажите телефон в формате 0CCNNNNNNN!'}); }

	var aMsg = [];
	if(aBad.length > 0) {
		var cFocus = null;
		$.each(aBad, function(k,v){
			if(cFocus == null) cFocus = v.i;
			aMsg.push(v.t);
			$('#' + v.i).addClass('tbl_bad');
		});
		$('#' + cFocus).focus();
		jAlert(aMsg.join('<br>'), 'Внимание!');
		return;
	}
	$DrvLdr.show();
	$.post(
		baseUrl + '_actions.php',
		{
            oper    : 'add_drv',
			firm_id	: $('#firm_id').val(),
			name	: fio,
			phone	: phone,
			inn		: itin
		},
		function(a) {
			$DrvLdr.hide();
			if(a.status != 'ok') {
				jError(a.status);
				return;
			}
			$Drv.dialog('close');
			if(!$OrderDrv) DrvStartEdit();
			$OrderDrv.val(fio);
            $('#' + idDrvEd +' td:eq(2)').text(a.id)
			$('#' + idDrvEd + '_d_phone').val(phone);
		},
		'json'
	);
}

function DrvNew() {
  if (!userRights.edit) return;
	DrvNewCancel();
	$Drv.dialog('open');
}

function DrvComplete() {
  if (!userRights.edit) return;
    //console.log('DrvComplete ' + bOrdInit);
	if(!bOrdInit) return;
    bOrdInit = false;
    if($Order.attr('oid') == 0) {
	    idDrvEd = 'new';
	    DrvStartEdit();
    } else {
        idDrvEd = '';
    }
}
function DrvStartEdit() {
  if (!userRights.edit) return;
  $GridDrv.jqGrid('editRow', idDrvEd, {keys:true, url:'clientArray', oneditfunc:DrvBeforeEdit, aftersavefunc:DrvSave});
}

function DrvDate_beforeShow(input, inst) {
  var offset = $(input).offset();
  var height = $(input).height();
  var lastZ = DlgOrder_ZIndex();
  window.setTimeout(function () {
      inst.dpDiv.css({ top: (offset.top + height + 4) + 'px', left: offset.left + 'px', 'z-index':lastZ })
  }, 1);

}
function DrvTime_click(ev) {
  var lastZ = DlgOrder_ZIndex();
  window.setTimeout(function(){
      $('.ui-timepicker-container').css({'z-index':lastZ});
  }, 1);
}
function DrvDate_close(val, input) {
}
function DrvBeforeEdit(r) {
  if (!userRights.edit) return;
	var rd  = $GridDrv.jqGrid('getRowData', idDrvEd),
	    x   = '#' + r,
        lst = DrvGetPrevCurNext(r),
        prv = lst[0],
        cur = lst[1],
        nxt = lst[2];
	$(x + ' input').addClass('tbl_ok');
	$OrderDrv = $(x + '_d_name').drvselect({
		source		: searchDrv,
		select		: SelectDrv,
		focus		: FocusSkip,
		appendTo	: 'body',
		minLength	: 1
	});
    if(cur == null) {
        //console.log('Driver row ' + r + ' not found!');
        return;
    }

    var dtpck1 = {
        lang        : 'ru',
        todayButton : false,
        step        : 30,
        format      : 'd-m-Y H:i',
        formatTime  : 'H:i',
        formatDate  : 'd-m-Y',
        minTime     : '00:00',
        maxTime     : '23:30',
        minDate     : dtMin,
        startDate   : cur.cell[3],
        value       : cur.cell[3],
        mask        : '39-19-3199 29:59',
        onSelectTime: function(){ $(this).hide(); },
        onShow      : function(){ $(this).trigger('changedatetime.xdsoft'); }
        },
        dtpck2 = {
        lang        : 'ru',
        todayButton : false,
        step        : 30,
        format      : 'd-m-Y H:i',
        formatTime  : 'H:i',
        formatDate  : 'd-m-Y',
        minTime     : '00:00',
        maxTime     : '23:30',
        minDate     : dtMin,
        startDate   : cur.cell[4],
        mask        : '39-19-3199 29:59',
        onSelectTime: function(){ $(this).hide(); },
        onShow      : function(){ $(this).trigger('changedatetime.xdsoft'); }
        };
    $OrderBegD = $(x + '_d_beg');
    $OrderEndD = $(x + '_d_end');

    // User begin
    if(prv == null) {
        $OrderBegD.datetimepicker(dtpck1).click(function(){ $(this).trigger('changedatetime.xdsoft'); });
        //$OrderBegD.datetimepicker({value:dtpck1.startDate});
    } else {
        $OrderBegD.prop('disabled', true).val(dtpck1.startDate);
    }

    // User end
    if(nxt == null) {
        $OrderEndD.datetimepicker(dtpck2);
        $OrderEndD.datetimepicker({value:dtpck2.startDate});
    } else {
        $OrderEndD.prop('disabled', true).val(dtpck2.startDate);
    }

	moveSearchUp();
    //console.log('Edit row : ' + r + ', Rows cnt : ' + oDrv.rows.length);

	if(r == 'new') {
		$('#new input').addClass('tbl_ok')
	}
}

function DrvSave(id, ret) {
  if (!userRights.edit) return;
    //console.log('DrvSave id=' + id + ', ret=' + ret);
	var rd = $GridDrv.jqGrid('getRowData', id);
	var o = null;
	$.each(oDrv.rows, function(k,v){
		if(v.id == id) {
			o = v;
			return false;
		}
	});
	if(!o) {
		DrvStartEdit();
		return;
	}

    if(parseInt(rd.d_id) <= 0) {
        jError('Выберите водителя из списка');
        DrvStartEdit();
        return;
    }
    var beg = moment(rd.d_beg, sDtFmt),
        end = moment(rd.d_end, sDtFmt);
    if(!beg.isBefore(end)) {
        jError('Дата окончания раньше или равна дате начала!');
        DrvStartEdit();
        return;
    }
	if(id == 'new') {
		o.id = 'drv-' + idDrvCnt++;
	}
	idDrvEd = '';
    $OrderDrv = null;
    $OrderBegD = null;
    $OrderEndD = null;
	o.cell[0] = rd.d_name;
	o.cell[1] = rd.d_phone;
	o.cell[2] = rd.d_id;
	o.cell[3] = rd.d_beg;
	o.cell[4] = rd.d_end;
    idDrvEd   = '';
	$GridDrv.trigger('reloadGrid');
}

function DrvEdit(id) {
  if (!userRights.edit) return;
	if(!id) return;
	if(idDrvEd != '') $GridDrv.jqGrid('restoreRow', idDrvEd);
	idDrvEd = id;
	DrvStartEdit();
}

function DrvGetPrevCurNext(rId) {
  if (!userRights.edit) return;
    var lst = null,
        prv = null,
        cur = null,
        nxt = null;
    $.each(oDrv.rows, function(k,v){
        if(v.id == rId) {
            prv = lst;
            cur = v;
        } else {
            if(cur != null && nxt == null) {
                nxt = v;
            }
        }
        lst = v;
    });
    return [prv, cur, nxt];
}

function destCancel() {
  if (!userRights.edit) return;
    $DestLdr.hide();
    $('#ds_name').val('');
    $('#ds_adr').val('');
    $('#ds_city').val('').attr('i', 0);
    $('#ds_type').val(0);
    $('#ds_region').val(0);
    selectRegion();
}

function showNewDest() {
  if (!userRights.edit) return;
    if(!$('#firm_id').val()) {
        jError('Сперва укажите предприятие!');
        return;
    }
    destCancel();
    $DestDlg.dialog('open');
}

function destSave() {
  if (!userRights.edit) return;
    var aBadData = [];
    $('.tbl_bad').removeClass('tbl_bad');

    if($('#ds_region').val() == 0) {
        aBadData.push({id:'ds_region', txt:'Выберите область.'});
    } else {
        if($('#ds_area').val() == 0) {
            aBadData.push({id:'ds_area', txt:'Виберите район.'});
        } else {
            if($('#ds_city').attr('i') == 0) { aBadData.push({id:'ds_city', txt:'Виберите населеный пункт из поискового списка.'}); }
        }
    }
    var iMin = $('#ds_adr').attr('min');
    if($('#ds_adr').val().length < iMin) { aBadData.push({id:'ds_adr', txt:"Укажите адрес объекта не менее " + iMin + " символов."}); }
    if($('#ds_name').val().length < iMin) { aBadData.push({id:'ds_name', txt:"Укажите название объекта не менее " + iMin + " символов."}); }
    if($('#ds_type').val() < 1) { aBadData.push({id:'ds_type', txt:"Укажите тип объекта."}); }

    if(aBadData.length > 0) {
        var msg = [];
        var fst = null;
        $.each(aBadData, function(k, v){
            msg.push(v.txt);
            if(fst == null) fst = '#' + v.id;
            $('#' + v.id).addClass('tbl_bad');
        });
        if(fst != null) $(fst).focus();
        jAlert(msg.join('\n'),'Внимание!');
        return;
    }
    $DestLdr.show();
    $.post(
        baseUrl + '_actions.php',
        {
            oper    : 'new_dest',
            firm_id : $('#firm_id').val(),
            ds_name : $('#ds_name').val(),
            ds_city : $('#ds_city').attr('i'),
            ds_adr  : $('#ds_adr').val(),
            ds_type : $('#ds_type').val()
        },
        function(a) {
            $DestLdr.hide();
            if(a.status && a.status != 'ok') {
                jError(a.status ? a.status : 'Ошибка сохранения');
                return;
            } else {
                if(a.id == 0) {
                    gridReload();
                } else {
                    RowReload(pid);
                }
            }
            $DestDlg.dialog('close');
        },
        'json'
    );
}

function setArea(ar) {
    var isDisabled = ar[0].i == 0,
        txt        = '';

    ar.forEach(function(a){
        txt += '<option value="' + a.i + '">' + a.n + '</option>';
    });

    $('#ds_area')
        .html(txt)
        .prop('disabled', isDisabled);
    if(isDisabled) {
        $('#ds_area').addClass('tbl_disabled');
    } else {
        $('#ds_area').removeClass('tbl_disabled');
    }
    $('#ds_city')
        .attr('i', 0)
        .prop('disabled', true)
        .addClass('tbl_disabled');
}

function selectRegion(iArea) {
    var iReg  = $('#ds_region').val(),
        iCity = $('#ds_city').attr('i'),
        iReg  = isNaN(iReg)  ? 0 : iReg,
        iArea = isNaN(iArea) ? 0 : iArea,
        bOk   = false;

    aReg.forEach(function(reg){
        if(reg.i == iReg) {
            setArea(reg.a);
            return false;
        }
    });

    if(iArea) {
        $('#ds_area').val(iArea);
        $('#ds_city')
            .attr('i', iCity)
            .prop('disabled', false)
            .removeClass('tbl_disabled');
    }
}

function selectArea() {
    var iArea = $('#ds_area').val(),
        $txt = $('#ds_city');
    $txt.attr('i', 0).val('');
    if(iArea == 0) {
        $txt.prop('disabled', true)
            .addClass('tbl_disabled');
    } else {
        $txt.prop('disabled', false)
            .removeClass('tbl_disabled');
    }
}

function selectCity(ev, ui) {
    $('#ds_city')
        .val(ui.item.label)
        .attr('i', ui.item.value);
    return false;
}

function ShowHelp() {
	if($Help == null) {
		$Help = $('#dlg_help').dialog({
			title: 'Справка по работе с нарядами',
			width: 1200,
			buttons: [
				{text:'Закрыть', icons:{primary:'ui-icon-close'}, click: function(){ $Help.dialog('close'); }}
			]
		});
	}
	$Help.dialog('open');
}

function ShowGuide() {
	window.open('/files/order.pdf');
}
