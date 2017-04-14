var $Grid = null;

$(document).ready(function() {
	$('#start' ).datetimepicker({
		lang		: 'ru',
		step		: 1,
		format		: 'd-m-Y H:i:s',
		formatTime	: 'H:i:s',
		formatDate	: 'd-m-Y',
		mask		: '39-19-3199 29:59:59'
	});
	$('#end' ).datetimepicker({
		lang		: 'ru',
		step		: 1,
		format		: 'd-m-Y H:i:s',
		formatTime	: 'H:i:s',
		formatDate	: 'd-m-Y',
		mask		: '39-19-3199 29:59:59'
	});
    $('#cmdApply').click(OnFormSubmit);
		
	$Grid = $("#list").jqGrid({
	    url				: dir + 'gps-dump.php',
	    datatype		: 'json',
	    postData		: { id:iId, start:sStart, end:sEnd },
		loadComplete	: OnGridLoad,
	    mtype			: 'POST',
	    width			: '100%',
	    height			: '550',
	    colNames		: [ 'Дата точки','Дата записи','Спут.','Координата','Выс.','Скор.','Расст.','Флаги' ],
	    colModel		: [
	        { name:'when1',index:'when1',align:'left',width:130,sortable:true,editable:false, cellattr:AttrWhen,
	        	formatter:'date', formatoptions: {srcformat: 'Y-m-d H:i:s', newformat: 'd-m-Y H:i:s'}, search:false},
	        { name:'time_stamp',index:'time_stamp',align:'left',width:130,sortable:true,editable:false,
	        	formatter:'date', formatoptions: {srcformat: 'Y-m-d H:i:s', newformat: 'd-m-Y H:i:s'}, search:false},
	        { name:'nsat',index:'nsat',align:'center',width:50,search:false, sortable:true },
	        { name:'coord',index:'coord',align:'center',width:200,search:false, sortable:false, formatter:FmtCoord },
	        { name:'altitude',index:'altitude',align:'center',width:50,search:false, sortable:true },
	        { name:'speed',index:'speed',align:'center',width:50,search:false, sortable:true },
	        { name:'distance',index:'distance',align:'center',width:50,search:false, sortable:true },
	        { name:'state',index:'state',align:'center',width:90,search:true, sortable:true, formatter:FmtState,
	        	stype:'select', searchoptions:{value: {0:"Любые", 1:"С флагом", 2:"Без флага"} } },
	        ],
	    pager			: '#pager',
	    rowNum			: 50,
	    rowList			: [10,25,50,100,200,500],
	    sortname		: 'when1',
	    sortorder		: "ASC",
	    viewrecords		: true,
	    caption			: 'iTrack события',
		footerrow		: true,
		userDataOnFooter: true,
		//altRows			: true,
	    rownumbers		: true
	    //ondblClickRow	: DblClick,
		//gridComplete	: OnGridComplete,
	});
	/*$Grid.jqGrid('setGroupHeaders', {
		useColSpanStyle: true,
		groupHeaders:[
		   { startColumnName: 'phone_sms', numberOfColumns: 3, titleText: 'Телефон,статус' },

	  ]
	});*/

	$Grid.jqGrid('navGrid','#pager', { edit:false, add:false, del:false, search:false } );
	$Grid.jqGrid('filterToolbar',{ autoseaach:true, searchOnEnter : false, stringResult: true, defaultSearch:'cn' });
	
	//$('#gview_list .ui-search-toolbar th:eq(3) div').html('шт.');
    var tlb = $('#gview_list .ui-search-toolbar th').height('auto');
    tlb.eq(3).find('div').html('<span style="color:#008000;font-size:smaller">шт</span>');
    tlb.eq(5).find('div').html('<span style="color:#008000;font-size:smaller">м</span>');
    tlb.eq(6).find('div').html('<span style="color:#008000;font-size:smaller">км/ч</span>');
    tlb.eq(7).find('div').html('<span style="color:#008000;font-size:smaller">м</span>');
});

function OnGridLoad(aDat) {
	//
}

function FmtCoord(cv) {
	return cv;
}

function AttrWhen(rId, cv) {
	return ' title="event_id=' + rId + '\n' + cv + '"';
}

function FmtState(cv) {
	if(cv == 0) return '&nbsp;';
	var a = [];
	$.each(aStat, function(k,v){
		if(cv & (1 << v.s)) {
			var st = v.c == 1 ? '' : ' ui-state-error';
			var li = '<li title="' + v.n + '" class="flg_stat' + st + '"><span class="ui-icon ' + v.i + '">&nbsp;</span></li>';
			a.push(li);
		}
	});
	if(a.length == 0) return '&nbsp;';
	return '<ul class="ui-widget ui-helper-clearfix stat_flag" was=' + cv + ' style="margin:0; padding:0;">' + a.join('', a) + '</ul>';
}

function OnFormSubmit() {
    var s = /^(\d\d)-(\d\d)-(\d{4}) (\d\d):(\d\d):*(\d\d)*$/.exec($('#start').val()),
        e = /^(\d\d)-(\d\d)-(\d{4}) (\d\d):(\d\d):*(\d\d)*$/.exec($('#end'  ).val());
    
    console.log(s);
    if(s) $('#h_start').val(s[3] + s[2] + s[1] + s[4] + s[5] + (s[6] ? s[6] : '00'));
    if(e) $('#h_end'  ).val(e[3] + e[2] + e[1] + e[4] + e[5] + (e[6] ? e[6] : '00'));
    $('#h_id').val($('#tid').val());
    $('#frmApply').submit();
}