var lastSel	= '';
var bNext	= false;
var $Grid 	= null;
var $Help 	= null;


$(function() {
	$('[id^=close_film]').click(function (){
		$('.flv').fadeOut(500);
	});
	$('#show_help').click(ShowHelp);
	$('#show_flv').click(ShowFlv);
	
	$Grid = $("#list").jqGrid({
		url				: dir + '/alert.php',
		loadComplete	: OnGridComplete,
		datatype		: 'json',
		postData		: { t:iType },
		mtype			: 'POST',
		height			: '500',
		colNames:[ 'Алерт', 'Тип алерта', 'Предприятие', 'Создан', 'Транспортное<br>средство', 'Гос.номер', 'Наряд', 'Контакт', 'Ур.', 'Причина',
					'Комментарий', 'Модификатор', 'Время отработки', 'История' ],
		colModel:[
			{ name:'id', index:'a.id', align:'center', width:50,sortable:true,editable:false, cellattr: AttrId, searchoptions: {sopt:['eq'], clearSearch:false} },
			{ name:'type', index:'a.type', align:'center', width:80,sortable:true, editable:false, formatter: FmtType,
				stype:'select', searchoptions: {defaultValue:iType, value:sTypes, dataEvents:[{ type: 'change', fn: SelectType }], clearSearch:false} },
			{ name:'name',index:'firm_id',align:'left',width:130,sortable:true,editable:false,stype:'select', cellattr: AttrFirm,
				searchoptions: { value: '0:--Все--;' + sFirms, clearSearch:false} },
			{ name:'date',index:'date',align:'center',search:true,width:100,editable:false,
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
							inst.dpDiv.css({ top: (offset.top + height + 4) + 'px', left: offset.left + 'px' })
						}, 1);
					}
				})
			}}},
			{ name:'name_ts', index:'name_ts', align:'left', search:true, width:100,editable:false },
			{ name:'nomer_ts', index:'nomer_ts', align:'left', width:70, sortable:true,editable:false, search:true, formatter: FmtFirst, cellattr: AttrNum },
			{ name:'info', index:'info', align:'center', width:100, sortable:true, editable:false, search:false, formatter: FmtInfo, cellattr: AttrInfo },
			{ name:'last_time', index:'last_time', align:'center', width:90, sortable:true,editable:false, search:false,
				formatter:'date', formatoptions: {srcformat: 'Y-m-d H:i:s', newformat: 'd.m.Y H:i'} },
			{ name:'lvl', index:'lvl', align:'center', width:20, sortable:true, editable:false, search:false, cellattr: AttrLvl },
			{ name:'reason', index:'reason', align:'center', width:90, search:true,editable:true,
				stype: 'select', searchoptions: { dataUrl: dir + '/empty.php', buildSelect: MakeTypeSelect, clearSearch:false }, edittype:'select', editoptions: { value:sStat } },
			{ name:'note',index:'note',align:'left',width:130,sortable:false,editable:true,search:false },
			{ name:'user_id',index:'user_id',align:'left',width:90,sortable:false,editable:false,search:false, formatter: FmtUser, cellattr: AttrUser },
			{ name:'timing',index:'timing',align:'left',width:130,sortable:false,editable:false,search:false },
			{ name:'history', index:'itrack_id',align:'center',width:50,sortable:true,editable:false,search:false,formatter:FmtHistory }
		],
		pager			 : '#pager',
		rowNum			 : 30,
		rowList			 : [5,10,20,30,50],
		sortname		 : 'date',
		sortorder		 : "desc",
		viewrecords		 : true,
		caption			 : 'Отработка алертов',
		footerrow		 : false,
		userDataOnFooter : true,
		hidegrid		 : false,
		editurl			 : dir+'/alert_action.php',
		onSelectRow		 : OnGridRowSelect,	
		ondblClickRow	 : OnGridDblClick
	});

	$Grid.jqGrid('navGrid','#pager', { edit:false, add:false, del:isAdmin, search:false, refresh:false })
	.navButtonAdd('#pager',{
		caption:"",
		id:'upd',
		buttonicon:"ui-icon-refresh",
		onClickButton: function() { $Grid.trigger('reloadGrid') },
		position:"first",
		title:'Обновить'
	})
	.navButtonAdd('#pager',{
		caption:"Мне",
		id:'copy',
		buttonicon:"ui-icon-copy",
		onClickButton: AlertReSend,
		position:"first",
		title:'Отправить копию алерта себе в Sender'
	});
	$('#copy').hide();
	
	$Grid.jqGrid('filterToolbar',{ autoseach:true, searchOnEnter : false, stringResult: true, defaultSearch:'cn' });
});

function OnGridComplete(aDat) {
	$('#loader').fadeOut(1000);
	$('.hist_cmd').button({ icons: {primary: 'ui-icon-calendar'}, text: false }).click(ShowHistory);
	if(!bNext) {
		$('.ui-jqgrid-labels').height(30);
		$('#jqgh_list_name_ts').height(30);
		$('#jqgh_list_lvl').attr('title', 'Уровень отработки');
		if(iType != 1) { SelectType(); }
		bNext = true;
	}
}

function OnGridDblClick(id) {
  if (!userRights.edit) return;
	if (id) {
		$Grid.jqGrid('restoreRow', lastSel);
		var cm = $Grid.jqGrid('getGridParam', 'colModel');
		var rd = $Grid.jqGrid('getRowData', id);
		if(rd.reason.length > 1) {
			jAlert('Алерт уже отработан!');
			return;
		}
		var t = $(rd.type).attr('t');
		var m = {};
		var r = [];
		$.each(aStat, function(k,v){
				if(v.t == t) {
					m = v;
					return false;
				}
		});
		if(!m.s) return;
		$.each(m.s, function(k,v){
				r.push(k + ':' + v);
		});
		cm[9].editoptions.value = r.join(';');
		$Grid.editRow(id, true);
		lastSel = id;
	}
}

function OnGridRowSelect(id) {
	if(bCopy) {
		$('#copy').show();
	} else {
		$('#copy').hide();
	}
}

function AttrFirm(rowId, cellVal, aRow) { // cellattr: AttrFirm,
	var attr = ' title="' + cellVal + ' - ' + rowId + '"';
	return attr;
}

function AttrId() {	return ' class="ui-state-default"'; }
function AttrLvl(r, cv) {
	var t = 'Уровень ' + cv;
	var c = '';
	if(cv == 'X') {
		t = 'Не отработан в срок';
		c = ' class="lvlMax"';
	}
	return ' title="' + t + '"' + c;
}
function AttrNum(rowId, cellVal, aRow) {
	var x = aRow[5].split('|');
	return ' title="car_id=' + x[1] + '"';
}
function AttrUser(rowId, cellVal, aRow) {
	var x = aRow[11].split('|'),
        t = parseInt(x[4]),
	    f = 'через ',
		wf = 0;
	if(t == 0) {
		f = 'не отработан';
	} else {
		wf = t & 7;
		f += aFlags[wf];
        if(x[3]) f+= "\n" + x[3];
	}
	return ' title="' + f + '" class="via' + wf + '"';
}

function FmtUser(cv) {
    var x = cv.split('|'),
        n = x[2] == '' ? x[1] : x[2];
    return '<span uid=' + x[0] + ' ph="' + x[3] + '" fl="' + x[4] + '">' + n + '</span>';
}

function FmtFirst(cv) {
	var x = cv.split('|');
	return x[0];
}

function FmtType(cv, opt) {
	var t = '--';
	var a = opt.colModel.searchoptions.value.split(';');
	for(i in a) {
		var o = a[i].split(':');
		if(o[0] == cv) {
			t = o[1];
			break;
		}
	}
	return '<span t=' + cv + '>' + t + '</span>';
}

function FmtHistory(cv) {
	var a = cv.split('|');
	if(a.length < 2) return '&nbsp;';
    if(isNaN(a[0]) || a[0] < 1) return '&nbsp;';
	var c = '<button role="button" id="hist_' + a[0] + '_' + a[1] +
			'" class="hist_cmd" title="iTrack = ' + a[0] + '">&nbsp;</button>';
	return c;
}

function FmtInfo(cv) {
	var t = '--';
	switch(cv.type) {
		case 1:
			var s = /^(\d{4})-(\d{2})-(\d{2})\s(\d{2}:\d{2})/.exec(cv.WorkStart);
			var e = /^(\d{4})-(\d{2})-(\d{2})\s(\d{2}:\d{2})/.exec(cv.WorkEnd);
			if(s && e) {
				t = s[3] + '.' + s[2] + '.' + s[1] + ' ' + s[4] + '<br>' +
					e[3] + '.' + e[2] + '.' + e[1] + ' ' + e[4];
			}
			break;
		
		case 3:
			t = cv.Dist + 'км.';
			break;
			
		case 6:
			t = cv.Val + 'л. за ' + cv.time + ' мин.';
			break;
	}
	return t;
}

var ordWarn = [6, 7];
function AttrInfo(rowId, cellVal, aRow) {
	var cv = aRow[6],
		pw = aRow[5].split('|');
	t = '-';
	e = '';
	switch(cv.type) {
		case 1:
			t = aOType[cv.Order];
			if(ordWarn.indexOf(cv.Order) >= 0) e = ' class="ordWarn"';
			break;
			
		case 3:
			t = 'Напряжение : ' + (pw[2] / 1000).toFixed(2) + ' В.';
			break;
			
		case 6:
			t = 'Скорость\n' +
				'Min = ' + cv.Vmin + '\n' +
				'Max = ' + cv.Vmax + '\n' +
				'Напр. = ' + cv.power;
			break;
	}
	return ' title="' + t + '"' + e;
}

function SelectType() {
	var t = parseInt($('#gs_type').val());
	var tmp_inf = $('#jqgh_list_info').children()[0];
	var tmp_lst = $('#jqgh_list_last_time').children()[0];
	var inf = '-';
	var lst = 'Когда';
	switch(t) {
		case 1:
			inf = 'Наряд';
			lst = 'Контакт';
			break;
		case 3:
			inf = 'Проехал';
			break;
		case 6:
			inf = 'Сколько';
			break;
	}
	$('#jqgh_list_info').text(inf).append(tmp_inf);
	$('#jqgh_list_last_time').text(lst).append(tmp_lst);
}

function MakeTypeSelect() {
	var n = [];
	$.each(aStat, function(k,v){
		if(v.s) {
			var p = [];
			$.each(v.s, function(k,v){
				p.push('<option value=' + k + '>' + v + '</option>');
			});
			n.push('<optgroup label="' + v.n + '">' + p.join('') + '</optgroup>');
		}
	});
	return '<select><option value=0>Любая</option>' + n.join('') + '</select>';
}

function ShowHistory() {
	var a = $(this).attr('id').split('_');
	if(a.length < 3) return;
	var i = parseInt(a[1]),
		n = parseInt(a[2]);
	window.open('./?p=dump&id=' + i + '&near=' + n, '_blank');
}

function ShowHelp() {
	if($Help == null) {
		$Help = $('#dv_help').dialog({
			title: 'Справка по отработке через СМС',
			width: 900,
			buttons: [
				{text:'Закрыть', icons:{primary:'ui-icon-close'}, click: function(){ $Help.dialog('close'); }}
			]
		});
	}
	$Help.dialog('open');
}

function ShowFlv() {
	$('#dv_film').fadeIn(600);
}