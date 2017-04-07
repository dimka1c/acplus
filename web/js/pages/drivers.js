/**
 * Drivers Table script
 */

var oper            = '';
var lastSel         = '';
var right           = 0;
var modeEdit        = false;
var $Grid           = null;
var selectedRowData = {};
//var rfid_data       = [];
//var rfid_id         = '';

function InitFilterSelectMenu(el, sopt) {
  var cm = $Grid.jqGrid('getGridParam', 'colModel'),
    c  = null;
  $.each(cm, function(k,v){ if(v.index == sopt.name){ c = v; return false; }});
  if(!c) return;
  var sel = $(el);
  sel.selectmenu({ width: c.width-10, change: function() { sel.change(); } });
}

function rfid_element (value, options) {
  var el = document.createElement("input");
  el.type="text";
  el.value = value;
  return el;
}
function rfid_value(elem, operation, value) {
  if(operation === 'get') {
    return $(elem).val();
  } else if(operation === 'set') {
    $('input',elem).val(value);
  }
}

function GridDblClkRow(id, iR, iC, ev) {
  if (!userRights.edit) return;
  if(!id) return;
  $Grid.jqGrid('restoreRow',lastSel);
  var edit_parameters = {
    mtype             : "POST",
    reloadAfterSubmit : true,
    closeAfterEdit : true
  };
  modeEdit = true;
  selectedRowData.id = id;
  $Grid.jqGrid('editGridRow', id, edit_parameters);
  lastSel = id; // successfunc
}

// gets z-index of modal edit form
function DlgDriver_ZIndex() {
  return $('#editmoddrivers_list').css('z-index') + 1;
}

function Driverslist_SubGrid(subgrid_id, row_id) {
  // generating ID of subGrid
  var subgrid_table_id = 'ts_' + subgrid_id,
    pager_id = 'p_' + subgrid_id;

  // generating initial html of subGrid for jqGrid
  $("#" + subgrid_id).html("<table id='" + subgrid_table_id +
    "' class='scroll'></table><div id='" + pager_id + "' class='scroll'></div>");

  // initialisation of subGrid
  $("#" + subgrid_table_id).jqGrid({
    url         : "drivers/history.php",
    postData    : { driver_id:row_id },
    datatype    : "json",
    mtype       : "POST",
    width       : '100%',
    colNames    : ['Фирма', 'ФИО', 'Телефон', 'ИНН', 'Дата обновления', 'Кто обновил'],
    colModel    : [
      { // Фирма
        name:'firm',
        sortable:true,
        stype: 'select',
        searchoptions: {
          value:sFirms,
          clearSearch:false,
          dataInit:InitFilterSelectMenu
        },
        editable:false
      },
      { // ФИО
        name:'name',
        sortable:true,
        editable:false
      },
      { // Телефон
        name:'phone',
        sortable:true,
        editable:false,
        align:'center'
      },
      { // ИНН
        name:'inn',
        sortable:true,
        editable:false,
        align:'center'
      },
      { // Последнее обновление
        name:'last_update',
        sortable:true,
        align:'center',
        formatter: 'date',
        formatoptions:{
          srcformat: 'Y-m-d H:i:s',
          newformat: 'd-m-Y H:i:s'
        }
      },
      { // Кто обновил
        name:'manager',
        sortable:true,
        editable:false
      }
    ],
    rowNum      : 50,
    pager       : pager_id,
    sortname    : 'last_update',
    sortorder   : "desc",
    height      : '100%',
    altRows     : true,
    footerrow   : false,
    userDataOnFooter:true
  });
  jQuery("#"+subgrid_table_id).jqGrid('navGrid','#'+pager_id,
    {edit:false,add:false,del:false,search:false,refresh:false});
}

// onready shortcut
$(function () {

  $.widget( "custom.rfidSelect", $.ui.autocomplete, {
    _renderItem: function( ul, item ) {
      var warning = (item.owner > 0) ? '<i class="fa fa-exclamation-triangle fa-2 warning-fa" title="Карта уже привязана!"></i>' : '';
      return $( "<li>" )
        .attr( "data-value", item.cd_number )
        //.append( warning + "<strong>"+item.cd_number+"</strong><br><span style='font-size: .8em'>Артикул: "+item.article+"</span>")
        .append( warning + "<strong>"+item.article+"</strong>")
        .appendTo( ul );
    }//,
//    _resizeMenu: function() {
//      this.menu.element.outerWidth( 450 );
//    }
  });

  function searchRfid(req, rsp)  { searchItem('rfid', req, rsp); }

  // select event, setting
  function selectRfid(event, ui) {
    // ask for confirmation in case card in already in use
    if(ui.item.owner > 0){
      jConfirm(
        'Вы уверены, что хотите изменить владельца карты?',
        'Карта уже занята, подтвердите действие!',
        function(x){
          if(x){
            // set rfid_id to hidden input for insert/update into rfid history
            $("input#"+selectedRowData.id+"_rfid_id").val(ui.item.id);

            $("input#rfid_id").val(ui.item.id);

            // Подставляем значение в сам элемент редактирования.
            $(event.target).val(ui.item.article);
          }
        }
      )
    } else {
      // set rfid_id to hidden input for insert/update into rfid history
      $("input#"+selectedRowData.id+"_rfid_id").val(ui.item.id);

      $("input#rfid_id").val(ui.item.id);

      // Подставляем значение в сам элемент редактирования.
      $(event.target).val(ui.item.article);
    }

    // Останавливаем дальнейшую обработку события.
    return false;
  }

  // getting autocomplete results
  function searchItem(what, req, rsp) {
    var pd  = {
      // this is a key, to chose what data should be searched for
      // in this key it's 'rfid' - we are looking for rfid cards data
      a : what,
      // this is a search query we are filtering by our results
      s	: req.term
    };
    $.post('page/scripts/search.php', pd, rsp, 'json');
  }

  $Grid = $('#drivers_list').jqGrid({
    url           : 'drivers/get',
    datatype      : 'json',
    mtype         : 'POST',
    width         : '1000', // needed ?
    height        : '100%', // needed ?
//    postData      : { rfid:rfid_id },
    colNames      : ['Фирма', 'ФИО', 'Телефон', 'ИНН', 'ID RFID-карты', 'RFID Артикул', 'Последнее обновление'],
    colModel      : [
      { // Фирма
        name:'firm',
        sortable:true,
        stype: 'select',
        searchoptions: {
          value:sFirms,
          clearSearch:false,
          dataInit:InitFilterSelectMenu
        },
        editable:true,
        edittype:'select', editoptions: { value:sFirmsE }
      },
      { // ФИО
        name:'name',
        sortable:true,
        editable:true,
        edittype:'text'
      },
      { // Телефон
        name:'phone',
        sortable:true,
        editable:true,
        edittype:'text',
        align:'center'
      },
      { // ИНН
        name:'inn',
        sortable:true,
        editable:true,
        edittype:'text',
        align:'center'
      },
      { // ID RFID-карты
        name:'rfid_id',
        hidden: true,
        editable:true,
        edittype:'custom',
        editoptions: { custom_element: rfid_element, custom_value: rfid_value }
      },
      { // RFID-карта
        name:'rfid_article',
        sortable:true,
        editable:true,
        editoptions : {
          dataInit : function (el) {
            // Основная магия здесь.
            // Инициализируем jQuery autocomplete.
            $(el).rfidSelect({
              source        : searchRfid,
              select        : selectRfid,
              focus        : function (ev, ui) { return false; },
              appendTo    : 'body',
              minLength    : 2
            })
          }
        },
        align:'center'
      },
      { // Последнее обновление
        name:'last_update',
        sortable:true,
        align:'center',
        formatter: 'date',
        formatoptions:{
          srcformat: 'Y-m-d H:i:s',
          newformat: 'd-m-Y H:i:s'
        }
      }
    ],
    ondblClickRow : GridDblClkRow,
    editurl       : 'drivers/edit',
    pager         : '#pager',
    subGrid         : true,
    subGridOptions  : {
      "plusicon" : "ui-icon-triangle-1-e",
      "minusicon" : "ui-icon-triangle-1-s",
      "openicon" : "ui-icon-arrowreturn-1-e",
      "reloadOnExpand" : true,
      "selectOnExpand" : true
    },
    subGridRowExpanded: Driverslist_SubGrid,
    rowNum        : 20,
    rowList       : [5,10,20,30,50,70,100,150],
    sortname      : 'name',
    sortorder     : "asc",
    viewrecords   : true,
    caption       : '',
    hidegrid      : false,
    rownumbers    : true,
    loadtext      : '<img src="/files/images/blue_loading.gif" />'
  });
  $Grid.jqGrid('navGrid', '#pager', { add: true, edit: true, del: true, search: true, refresh: true });
  $Grid.jqGrid('filterToolbar',{ autoseach:true, searchOnEnter : false, stringResult: true, defaultSearch:'cn', resetIcon:'<i class="fa fa-ban"> </i>' });
});