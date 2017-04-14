var right       = 0;
var cSubGrid    = 0;
var cRuleId     = 0;
var $Grid       = null;
var $GridUsr    = null;
var regPhone    = /^(0{1}(39|50|6\d|9\d){1})(\d{7})$/;
var regSrcPhone = /^(\+38)(\d{10})$/;
var regInterval = /^(\d{2}):(\d{2})\s-\s(\d{2}):(\d{2})$/;
var regDate     = /^(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})$/;
var esc_sel     = null;
var parEscEd    = {
    height          : escHt,
    width           : escWd,
    closeAfterEdit  : true,
    closeAfterAdd   : true,
    editData        : { context:'esc' },
    beforeSubmit    : EscCheck,
    beforeShowForm  : EscInitForm,
    afterSubmit     : AfterSubmit,
    viewPagerButtons: false
};

$(function() {
    $('.close_edit').click(function (){
        $('#dv_edit').fadeOut(100);
        $('#dv_list').fadeIn(100);
        clearEditForm();
    });
    List();
    $('#fid').change(SelectFirm);
});

function SelectFirm(){
    $Grid.jqGrid('getGridParam', 'postData').firm_id = parseInt($('#fid').val());
    $Grid.trigger('reloadGrid');
}

function List(){
    $Grid = $('#list').jqGrid({
        url         : dir+'/escalation.php',
        datatype    : 'json',
        postData    : { firm_id:iSelFrm },
        //loadComplete: function(id){ $('#loader').fadeOut(100); $(subDivList).hide();},
        mtype       : 'POST',
        width       : '100%',
        height      : '100%',
        //scroll    : 1,
        colNames    : [ 'Инцидент', 'Период проверки','Частота,мин','Параметр','Значение','Стоп','Без наряда','Скрипт','Тип','Посл.запуск' ],
        colModel    : [
            { name:'description',index:'description',align:'left',width:170,editable:isAdmin,search:true, editoptions:{ size:50 } },
            { name:'periods',index:'periods',align:'center',width:170,editable:true,search:false, formatter:FmtPeriod },
            { name:'step',index:'step',align:'center',width:72,editable:true,search:false },
            { name:'var_name',index:'var_name',align:'left',width:150,editable:isAdmin, search:false, editoptions:{ size:50 } },
            { name:'var_val',index:'var_val',align:'center',width:65,editable:true, search:false },
            { name:'stop',index:'stop',align:'center',width:30,editable:true, edittype:'checkbox', editoptions: {value:'Да:Нет'}, search:false },
            { name:'no_order',index:'no_order',align:'center',width:60,editable:true, edittype:'checkbox', editoptions:{ value:'Да:Нет' }, search:false },
            { name:'script',index:'script',align:'left',width:90,editable:isAdmin,search:false,hidden:!isAdmin },
            { name:'type',index:'type',align:'center',width:20,editable:isAdmin,search:false,hidden:!isAdmin },
            { name:'last',index:'last',align:'center',width:72,editable:isAdmin,search:false,formatter:FmtLast, cellattr:AttrLast }
        ],
        pager       : '#pager',
        rowNum      : 50,
        rowList     : [],
        pginput     : false,
        sortname    : 'id',
        sortorder   : 'desc',
        viewrecords : true,
        caption     : sCap,
        loadtext    : '<img src="images/blue_loading.gif" />',
        footerrow   : false,
        userDataOnFooter: false,
        altRows     : false,
        //rownumbers  : true,
        ondblClickRow: EscEdit,
        subGrid     : true,
        subGridOptions: {
            plusicon        : 'ui-icon-triangle-1-e',
            minusicon       : 'ui-icon-triangle-1-s',
            openicon        : 'ui-icon-arrowreturn-1-e',
            reloadOnExpand  : true,
            selectOnExpand  : true
        },
        editurl     : dir + '/escalation_actions.php',
        subGridRowExpanded: ListSubGrid
    });

    // navGrid, #pager, params, editParam, addParam, delParam, searchParam, viewParam
    $Grid.jqGrid('navGrid','#pager', { edit:true, add:isAdmin, del:isAdmin, search:false }, parEscEd, parEscEd);
    $Grid.jqGrid('filterToolbar',{ autosearch:true, searchOnEnter : false, stringResult: true, defaultSearch:'cn' });
}

function FmtPeriod(cv, opt, row) {
    var lst = cv.split(',');
    return lst.join('<br>');
}

function FmtLast(cv) {
    var a = regDate.exec(cv),
        t = '-';
    if(a) {
        t = a[4] + ':' + a[5];
    }
    return '<span dt="' + cv + '">' + t + '</span>';
}

function AttrLast(rid, cv) {
    var dt = $(cv).attr('dt'),
        t  = dt;
        a  = regDate.exec(dt);
    if(a) {
        t = a[3] + '.' + a[2] + '.' + a[1] + ' ' + $(cv).text();
    }
    return ' title="' + t + '"';
}

function AfterSubmit(rsp, pd) {
    if(rsp.status != 200) {
        return [false, 'Код ответа : ' + rsp.status + ' (' + rsp.statusText + ')', 0];
    }
    var ans = $.parseJSON(rsp.responseText);
    if(ans.status != 'ok') {
        jError(ans.status);
        if(pd.oper && pd.oper == 'add') {
            return [false, ans.status, 0];
        }
    }
    var id = ans.id ? ans.id : 0;
    return [true, '', id];
}

function EscEdit(id) {
  if (!userRights.edit) return;
  if(!/^p-\d+-\d+$/.test(id)) return;
  $Grid.jqGrid('editGridRow', id, parEscEd);
}

var frm = null;
function EscInitForm($form) {
    frm = $form;
    $form.addClass('tbl_form');
    $('#description').keyup(KeyUpFio).addClass('tbl_ok');
    $('#var_name').keyup(KeyUpFio).addClass('tbl_ok');
    $('#script').keyup(KeyUpFio).addClass('tbl_ok');
    $('#step').keyup(KeyUpStep).addClass('tbl_ok');
    $('#var_val').keyup(KeyUpInt).addClass('tbl_ok');
    $('#type').keyup(KeyUpInt).addClass('tbl_ok');
    if(!isAdmin) {
        var id = $('#id_g').val(),
            rd = $Grid.jqGrid('getRowData', id);
        $('#var_val').parent().parent().find('td:eq(0) label').html(rd.var_name);
    }
    var $per = $('#periods'),
        lst  = $per.val().split('<br>');
    $per.val(lst.join(','));
    $per.tagsInput({
        width       : 'auto',
        height      : 100,
        defaultText : 'добавить',
        onInitInput : TagInit,
        onCheckTag  : TagCheck,
        onChange    : TagChange
    });
}

function TagInit(input) {
    $(input).mask("00:00 - 00:00", {placeholder: "00:00 - 00:00"});
}

function TagChange(inp) {
    $('#periods_tagsinput').removeClass('tbl_bad');
    if(inp.val() != '') return;
    $('#periods_tagsinput').addClass('tbl_bad');
}

function TagParseInt(i) {
    var a = regInterval.exec(i);
    if(!a) return [false, 0, 0];
    var bh  = a[1] * 60,
        bm  = a[2] * 1,
        eh  = a[3] * 60,
        em  = a[4] * 1;
    if(bh > 1380 || bm > 59 || eh > 1380 || em > 59) return [false, 0, 0];
    var beg = bh + bm,
        end = eh + em;
    if(beg >= end) return [false, 0, 0];
    return [true, beg, end];
}

function TagCheck(val, list) {
    var aNew = TagParseInt(val);
    var ret  = true;
    if(!aNew[0]) return false;
    $.each(list, function(k,v){
        var aInt = TagParseInt(v);
        if(aInt[0]) {
            if(aInt[2] >= aNew[1] && aInt[1] <= aNew[2]) {
                ret = false;
                return false;
            }
        }
    });
    return ret;
}

function EscCheckPeriods(pd) {
    var aList = pd.periods.split(',');
    var r;
    if(!aList || !aList[0]) return [false, 'Не указан период проверки'];
    if(aList.length == 1) {
        r = TagParseInt(aList[0]);
        if(!r[0]) return [false, 'Неверный интервал проверки'];
        return [true, ''];
    }
    var f = aList.shift();
    r = TagCheck(f, aList);
    return [r, r ? '' : 'Ошибка в интервалах проверки'];
}

function EscCheck(pd) {
    var aBad = [];
    var t = EscCheckPeriods(pd);
    if(!t[0]) { aBad.push({i:'periods_tagsinput', m:t[1]}); }
    t = parseInt(pd.step);
    if(isNaN(t) || t < 2) { aBad.push({i:'step', m:'Частота проверки не может быть менее 2-х минут'}); }
    if(pd.var_name != '-') {
        t = parseInt(pd.var_val);
        if(isNaN(t) || t < 0) { aBad.push({i:'var_val', m:pd.var_name + ' - не может быть отрицательным'}); }
    }
    if(isAdmin) {
        if(pd.description.length < 3) { aBad.push({i:'description', m:'Укажите имя инцидента'}); }
        if(pd.var_name != '-' && pd.var_name.length < 3) { aBad.push({i:'var_name', m:'Укажите имя параметра'}); }
        if(pd.script.length < 3) { aBad.push({i:'script', m:'Укажите имя скрипта'}); }
        t = parseInt(pd.type);
        if(isNaN(t) || t < 0) { aBad.push({i:'type', m:'Укажите тип алерта'}); }
    }
    if(aBad.length > 0) {
        var aMsg = [];
        $.each(aBad, function(k,v){
            aMsg.push(v.m);
            $('#' + v.i).addClass('tbl_bad');
        });
        jError(aMsg.join('<br>'))
        return [false, 'Исправьте ошибки'];
    }
    pd.fid = $('#fid').val();
    return [true, ''];
}

function ListSubGrid(subId, rowId) {
    var subTbl = 'stbl_' + subId;
    var subPgr = 'spgr_' + subId;
    var $Sub   = null;
    var fid    = $('#fid').val();
    $('#' + subId).html('<table id="' + subTbl + '" class="scroll"></table>' +
                        '<div id="' + subPgr + '" class="scroll"></div>');
    $Sub = $('#' + subTbl).jqGrid({
        url             : dir + '/escalation_sub.php',
        datatype        : 'json',
        mtype           : 'POST',
        postData        : { eid:rowId, fid:fid },
        colNames        : [ 'Этап','Получатель', 'Ожидание', 'Телефон','Сендер' ],
        colModel        : [
            { name:'lvl',index:'lvl',align:'center', width:30, search:false, editable:false },
            { name:'user',index:'user',align:'center', width:300, search:false, editable:true, editoptions:{ size:50 } },
            { name:'wait',index:'wait',align:'center', width:80, search:false, editable:true },
            { name:'phone',index:'phone',align:'left', width:100, search:false, editable:true },
            { name:'sender',index:'sender',align:'center', width:80, search:false, editable:true, edittype:'checkbox', editoptions:{ value:'Да:Нет' } }
        ],
        rowNum          : 50,
        rowList         : [],
        pginput         : false,
        pager           : subPgr,
        sortname        : 'lvl',
        sortorder       : "asc",
        height          : '100%',
        footerrow       : false,
        userDataOnFooter: false,
        altRows         : false,
        ondblClickRow   : LevelEdit,
        editurl         : dir + '/escalation_actions.php',
    });
    $Sub.attr('esc_id', rowId);
    $Sub.jqGrid('navGrid','#' + subPgr,
        { edit:true, add:true, del:true, search:false, refresh:true },
        { closeAfterEdit:true, editData:{ context:'level', eid:rowId, fid:fid }, beforeSubmit:LevelCheck, beforeShowForm:LevelInitForm, viewPagerButtons:false }, // edit
        { closeAfterAdd:true, editData:{ context:'level', eid:rowId, fid:fid }, beforeSubmit:LevelCheck, beforeShowForm:LevelInitForm, viewPagerButtons:false }, // add
        { delData:{ context:'level' } }, { /* search */  }, { /* view */ }
    ); /*
    .navButtonAdd('#' + subPgr, {
        caption     : '',
        id          : 'add',
        buttonicon  :'ui-icon-plusthick',
        onClickButton: function(){},
        position:"last",
        title:'Добавить запись'
    });*/
}

function LevelEdit(rowId, iRow, iCol, e) {
  if (!userRights.edit) return;
  if(!rowId) return;
  var tbl = $(this).attr('id');
  $('#' + tbl).jqGrid('editGridRow', rowId, {
      closeAfterEdit   : true,
      editData         : { context:'level', fid:$('#fid').val() },
      beforeSubmit     : LevelCheck,
      beforeShowForm   : LevelInitForm,
      viewPagerButtons : false
  });
}

function LevelCheck(pd) {
    var aMsg = [];
    if(!regPhone.test(pd.phone)) { aMsg.push('Неверный формат телефона 0670000000'); }
    if(pd.user.length < 3) { aMsg.push('Имя короче трех букв'); }
    if(pd.wait < 5) { aMsg.push('Время на отработку должно біть не менее 5мин.'); }
    if(aMsg.length > 0) {
        return [false, aMsg.join('<br>')];
    }
    return [true, ''];
}

function KeyUpRegEx(o, r) {
    o.removeClass('tbl_bad');
    if(!r.test(o.val())) o.addClass('tbl_bad');
}
function KeyUpFio(ev) { KeyUpRegEx($(this), /^.{3,}$/); }
function KeyUpPhone(ev) { KeyUpRegEx($(this), regPhone); }
function KeyUpIntVal(o, iMin) {
    o.removeClass('tbl_bad');
    var v = o.val();
    if(isNaN(v) || v < iMin) o.addClass('tbl_bad');
}
function KeyUpStep(ev) { KeyUpIntVal($(this), 2); }
function KeyUpInt(ev) { KeyUpIntVal($(this), 0); }

function LevelInitForm($form) {
    $form.addClass('tbl_form');
    $form.find('#user').keyup(KeyUpFio).addClass('tbl_ok');
    var $ph = $form.find('#phone').keyup(KeyUpPhone).addClass('tbl_ok');
    $form.find('label[for="phone"]').append('&nbsp;<b style="float:right;">+38</b>');
    var p = regSrcPhone.exec($ph.val());
    if(!p) p = ['','',''];
    $ph.val(p[2]);
}
