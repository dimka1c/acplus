var dir='<?php print $fl?>/scripts';
var dat1='';
var dat2='';
var acc='';
var amt1='';
var amt2='';
var id_pay=0;
var dc='';
var oper='';
var lastSel='';
var right=0;

$(document).ready(function() {
    $('.promo').click(doEnter)
});

function doEnter() {
    jPrompt('Ключ', '', 'Вход', sendEnter);
}

function sendEnter(a) {
    if(!a || a.length < 5) return;
    $.post(
        'plus.php',
        { key:a, nd:Date.now() },
        function(r) {
            if(r.status == 'ok') {
                location.reload();
            }
        },
        'json'
    );
}
////////////////////////////////////// end ready
function List(){
    $('#loader').fadeIn(50);
    $('#dv_list').html('<table id="list"></table><div id="pager"></div>');

    jQuery("#list").jqGrid({
        url:dir+'/devices.php',
        datatype: 'json',
        postData:{ },
        loadComplete:function(id){ $('#loader').fadeOut(100); $(".ui-jqgrid-sortable").css('white-space', 'normal').css('height', 'auto'); },
        mtype: 'POST',
        width: '100%',
        height: '100%',
        colNames:[ 'id','IMEI','Закупка','Тип','Гарантия до','Статус','Монтаж/Демонтаж','Предприятие' ],
        colModel :[
            { name:'id',index:'id',align:'left',width:50,search:true,editable:false },
            { name:'imei',index:'imei',align:'left',width:150,search:true,editable:false },
            { name:'date_purchase','index':'date_purchase',align:'left',width:90,search:false,editable:false,
                formatter:'date',
                searchoptions: {dataInit: function (element) {
                    $(element).datepicker({ dateFormat: 'yy-mm-dd', onClose: function(){$('#list')[0].triggerToolbar();}})
                }},
                searchrules: { date: true },
            },
            { name:'type',index:'type',align:'center',width:90,editable:false,
                stype: 'select',
                searchoptions: {
                    defaultValue: "",
                    dataUrl: dir+'/spr_gps_device_types.php?fl=1'
                }/*,
                edittype:'select',
                editoptions: {
                    defaultValue: "",
                    dataUrl: dir+'/spr_firms.php?fl=1'
                }  */
            },
            { name:'warr_until',index:'warr_until',align:'center',width:90,search:false,editable:false, 
                formatter:'date',
                searchoptions: {dataInit: function (element) {
                    $(element).datepicker({ dateFormat: 'yy-mm-dd', onClose: function(){$('#list')[0].triggerToolbar();}})
                }},
                searchrules: { date: true },
                /*editoptions:{dataInit:function(elem){$(elem).datepicker({dateFormat:'yy-mm-dd'})}}*/
            },
            { name:'status',index:'status',align:'center',width:120,search:true,editable:true,
                stype: 'select',
                searchoptions: { value: '<?php $items=array();$items[]="0:--";foreach(Gps_devices::$Statuses as $key=>$val) { $items[] = $key.":".$val; }; echo implode(";",$items); ?>' }
            },
            { name:'actions',index:'actions',align:'left',width:120,search:false,editable:false,align:'center',sortable:false },
            { name:'firm_id',index:'firm_id',align:'left',width:150,search:true,editable:false,align:'center',sortable:false,
                stype: 'select',
                searchoptions: {
                    defaultValue: "",
                    dataUrl: dir+'/spr_firms.php?fl=1&worights=1'
                }
            }
            ],

        pager: '#pager',
        rowNum:30,
        rowList:[5,10,20,30,50,70,100,150],
        sortname: '`gps_devices`.`id`',
        sortorder: "desc",
        viewrecords: true,
        caption: 'Радиотерминал RV',
        footerrow : false,
        userDataOnFooter : false,
        altRows : true,
        rownumbers: true,
        ondblClickRow: function(id){
            if(id) {
                lastSel=id;
                ShowEdit(id);
            }
        },
        editurl: dir+'/device_actions.php',
        subGrid: true,
        subGridOptions: { 
            "plusicon" : "ui-icon-triangle-1-e", 
            "minusicon" : "ui-icon-triangle-1-s", 
            "openicon" : "ui-icon-arrowreturn-1-e",
            "reloadOnExpand" : true,
            "selectOnExpand" : true
        }, 
        subGridRowExpanded: function(subgrid_id, row_id) {
            var subgrid_table_id, pager_id; 
            subgrid_table_id = subgrid_id+"_t"; 
            pager_id = "p_"+subgrid_table_id; 
            $("#"+subgrid_id).html("<table id='"+subgrid_table_id+"' class='scroll'></table><div id='"+pager_id+"' class='scroll'></div>");
            jQuery("#"+subgrid_table_id).jqGrid({ 
                url: dir+"/devices_sub.php?dev_id="+row_id,
                datatype: "json",
                mtype:"POST",
                width:'890',
                colNames: ['dev_id','id','Транспортное средство','Гос.номер','Предприятие','Дата','Действие','Заявка N','М/л','sim','Телефон','Статус'],
                colModel: [
                    { name:"dev_id",index:"dev_id",hidden:true,editable:true,
                        editoptions: {disabled:false, value:row_id }
                    },
                    { name:"id",index:"id",width:30,key:true,hidden:true },
                    { name:"gps_carlist.name_ts",index:"gps_carlist.name_ts",width:150,editable:false,search:false },
                    { name:"gps_carlist.nomer_ts",index:"gps_carlist.nomer_ts",width:60,editable:false,search:false },
                    { name:"firm_id",index:"firm_id",width:130,editable:false,search:false },
                    { name:"dt",index:"dt",width:55,editable:false,search:false,
                        formatter:'date',
                        searchoptions: {dataInit: function (element) {
                            $(element).datepicker({ dateFormat: 'yy-mm-dd', onClose: function(){$('#list')[0].triggerToolbar();}})
                        }}
                    },
                    { name:"action",index:"action",width:70,editable:false,search:false,
                        stype: 'select',
                        searchoptions:{value:"<?php $items=array();$items[]='0:--';foreach(Gps_devices_history::$Actions as $key=>$val) { $items[] = $key.':'.$val; }; echo implode(';',$items); ?>"}
                    },
                    { name:"claim_id",index:"claim_id",width:45,editable:false,search:true,formatter:'showlink',formatoptions:{baseLinkUrl:'https://192.168.0.20/realagro/',addParam:'&fl=gps&action=gps_repair'} },
                    { name:"ml",index:"ml",width:35,editable:false,search:false },
                    { name:"sim",index:"sim",width:140,editable:false,search:false },
                    { name:"phone",index:"phone",width:70,editable:false,search:false },
                    { name:"status",index:"status",width:60,editable:false,search:false,
                        stype: 'select',
                        searchoptions:{value:"<?php $items=array();$items[]='0:--';foreach(Gps_devices_history::$Statuses as $key=>$val) { $items[] = $key.':'.$val; }; echo implode(';',$items); ?>"}
                    }
                ], 
                rowNum:50, 
                pager: pager_id, 
                sortname: 'dt', 
                sortorder: "desc", 
                height: '100%',
                altRows : false,
                footerrow : false,
                userDataOnFooter:true,
                ondblClickRow: function(id){
                    if(id) {
                        lastSel=id;
                        ShowEditHistory(id,0);
                        return false;
                    }
                },
            });
            jQuery("#"+subgrid_table_id).jqGrid('navGrid','#'+pager_id,
                {edit:false,add:false,del:false,search:false,refresh:false},
                { height:200,width:350, reloadAfterSubmit:true,closeAfterAdd:true,closeAfterEdit:true }, //options
                { height:200,width:350, reloadAfterSubmit:true,closeAfterAdd:true,closeAfterEdit:true }, // edit options
                { height:200,width:350, reloadAfterSubmit:true,closeAfterAdd:true,closeAfterEdit:true }, // add options
                { reloadAfterSubmit:true }
            );
            
            $("#"+subgrid_table_id).jqGrid('navGrid','#'+pager_id).navButtonAdd('#'+pager_id,{
                caption:"<b style=\"color:red\">Добавить </b>",
                id:'new',
                buttonicon:"",
                onClickButton: function(){
                    ShowEditHistory(0,row_id);
                },
                position:"last",
                title:'Добавить запись'
            });
            $("#"+subgrid_table_id).jqGrid('navGrid','#'+pager_id).navButtonAdd('#'+pager_id,{
                caption:"<b style=\"color:red\">Удалить </b>",
                id:'del',
                buttonicon:"",
                onClickButton: function(){
                    selectedRow = $('#'+subgrid_table_id).jqGrid('getGridParam','selrow');
                    if (selectedRow && confirm('Удалить?', 'Подтверждение')) {
                        $.post(
                            dir+'/device_actions.php',
                            {'id': selectedRow, 'oper': 'delsub'},
                            function(answ){
                                var answ = eval("(" + answ + ")");
                                $('#loader').fadeOut(100);
                                if (answ.status=='OK'){
                                    $('#'+subgrid_table_id).jqGrid('delRowData', selectedRow);
                                } /*else if (answ.status=='no_rights') {
                                    jAlert('Недостаточно прав!','Ошибка');
                                } */else {
                                    jAlert('Ошибка удаления!','Ошибка');
                                }
                            }
                        );
                    } else {
                        alert('Не выделена строка!');
                    }
                },
                position:"last",
                title:'Добавить запись'
            });
        }
    });
            
    /*jQuery("#list").jqGrid('destroyGroupHeader');
        jQuery("#list").jqGrid('setGroupHeaders', {
        useColSpanStyle: true,
        groupHeaders:[
        { startColumnName: 'phone_sms', numberOfColumns: 3, titleText: 'Телефон,статус' },
        ]
    });*/

    jQuery("#list").jqGrid('navGrid','#pager',
        { edit:false, add:false, del:true, search:false },
        { height:250,width:750, reloadAfterSubmit:true,closeAfterAdd:true,closeAfterEdit:true }, //options
        { height:250,width:750, reloadAfterSubmit:true,closeAfterAdd:true,closeAfterEdit:true }, // edit options
        { height:250,width:750, reloadAfterSubmit:true,closeAfterAdd:true,closeAfterEdit:true }, // add options
        { reloadAfterSubmit:true }, // del options
        {  } // search options
    );

    $("#list").jqGrid('filterToolbar',{ autosearch:true, searchOnEnter : false, stringResult: true, defaultSearch:'cn' });
    $('#list').setPostData({  });
    
    $("#list").jqGrid('navGrid','#pager').navButtonAdd('#pager',{
        caption:"<b style=\"color:red\">Добавить </b>",
        id:'new',
        buttonicon:"",
        onClickButton: function(){
            ShowEdit(0);
            /*$("#firm_id").attr("disabled",false);
            $("#car_id").attr("disabled",false);
            SprCarsFirm($('#firm_id').val(),0);
            $("#searchBlock").show();
            $('#dv_edit').fadeIn(1000);
            $('#dv_list').fadeOut(1000);
            oper='add';*/
        },
        position:"last",
        title:'Добавить запись'
    });
    /*
    $("#list").jqGrid('navGrid','#pager').navButtonAdd('#pager',{
        caption:"<b style=\"color:navy\">Удалить запись</b>",
        id:'del',
        buttonicon:"",
        onClickButton: function(){
            selectedRow = $('#list').jqGrid('getGridParam','selrow');
            if (selectedRow) {
                if (confirm('Удалить наряд?', 'Подтверждение')) {
                    $.post(
                        dir+'/order_save.php',
                        {'order_id': selectedRow, 'oper': 'del'},
                        function(answ){
                            var answ = eval("(" + answ + ")");
                            $('#loader').fadeOut(100);
                            if (answ.status=='OK'){
                                $('#list').jqGrid('delRowData', selectedRow);
                            } else if (answ.status=='no_rights') {
                                jAlert('Недостаточно прав!','Ошибка');
                            } else {
                                jAlert('Ошибка удаления!','Ошибка');
                            }
                        }
                    );
                }
            } else {
                jAlert('Не выделена строка!','Ошибка');
            }
        },
        position:"last",
        title:'Удалить выделенную запись'
    }); 
    */
}
isShowEdit = false;
function ShowEdit(id) {
    if(isShowEdit) return;
    $('#id').val(id);
    if (id > 0) {
        $.post( dir+'/device_actions.php',
            { 'id': id, 'oper': 'get' },
            function(data) {
                var data = eval("(" + data + ")");
                data = data.data;   
                $("#status [value='"+data.status+"']").attr("selected", "selected");
                $("#type [value='"+data.type+"']").attr("selected", "selected");
                $("#imei").val(data.imei);
                $("#date_purchase").val(data.date_purchase);
                $("#warr_until").val(data.warr_until);
                $("#firm_edit").val(data.firm_id);
            },
            "html"
        );
    } else {
        $("#status [value='0']").attr("selected", "selected");
        $("#type [value='0']").attr("selected", "selected");
        $("#imei").val('');
        $("#date_purchase").val('');
        $("#warr_until").val('');
        $("#firm_edit").val(0);
    }
    
    jQuery('#dv_edit').fadeIn(1000);
    jQuery('#dv_list').fadeOut(1000);
    oper='edit';
};

function ShowEditHistory(id,dev_id) {
    isShowEdit = true;
    $('#search_car').val('');
    $("#firm_id").val(0);
    if (id > 0) {
        $('#div_search_car').hide();
        $.post( dir+'/device_actions.php',
            { 'id': id, 'oper': 'getsub' },
            function(data) {
                var data = eval("(" + data + ")");
                data = data.data;
                $('#sub_id').val(data.id);
                $("#dev_id").val(data.dev_id);
                $("#car_id").val(data.car_id);
                $("#firm_id [value='"+data.firm_id+"']").attr("selected", "selected");
                $('#name_ts').text(data.name_ts);
                $('#nomer_ts').text(data.nomer_ts);
                $("#dt").val(data.dt);
                $("#action [value='"+data.action+"']").attr("selected", "selected");
                $("#claim_id").val(data.claim_id);
                $("#ml").val(data.ml);
                $("#sim_id").val(data.sim_id);
                $("#value_sim").text(data.sim);
                $("#value_phone").text(data.phone);
                $("#value_old").text(data.sim_old);
                $("#status_sub [value='"+data.status+"']").attr("selected", "selected");
                $('#prim').text(data.prim);
            },
            "html"
        );
    } else {
        $('#sub_id').val(0);
        $("#dev_id").val(dev_id);
        $("#car_id").val(0);
        $('#name_ts').text('');
        $('#nomer_ts').text('');
        $("#dt").val('');
        $("#action [value='0']").attr("selected", "selected");
        $("#claim_id").val('');
        $("#ml").val('');
        $("#sim").val('');
        $("#status_sub [value='0']").attr("selected", "selected");
        $('#prim').text('');
        $('#div_search_car').show();
    }
    
    jQuery('#dv_edit_sub').fadeIn(1000);
    jQuery('#dv_list').fadeOut(1000);
    jQuery('#dv_edit').fadeOut();
    //oper='edit';
    isShowEdit = false;
}

function searchCar() {
    firmId  = $('#firm_id').val();
    search  = $('#search_car').val();
    new_set = $('#new_set').is(':checked') ? 1 : 0;
    $('#search_car').css("color", "red");
    $('#car_id').val(0);
    if (firmId==0 && search.length<3) return false;
    
    $.post( dir+'/search-car.php',
        { 'search':search, 'firm_id':firmId, 'new_set':new_set },
        function(data) {
            var data = eval("(" + data + ")");
            $('#foundCars').empty();
            if (data.status == 'OK') {
                ss = '';
                $.each(data.cars, function(key, value) {
                    ss += "<div><a href='#' onclick='setCar("+key+",this);return false;'>"+value+"</a></div>";
                });
                $('#foundCars').html(ss);
                $('#foundCars').show();
            }
        },
        "html"
    )
}

function setCar(id, obj) {
    $('#car_id').val(id);
    $('#search_car').css("color", "#333333");
    $('#search_car').val($(obj).text());
    $('#foundCars').hide();
    $.post( dir+'/device_actions.php',
        { 'oper': 'getcar', 'id': id },
        function(data) {
            var data = eval("(" + data + ")");
            if (data.status == 'OK') {
                $('#name_ts').text(data.data.name_ts);
                $('#nomer_ts').text(data.data.nomer_ts);
            }
        },
        "html"
    )
}

function DateNow(){
    var now= new Date(); var _day=now.getDate(); var _month=(now.getMonth()+1); var _year=(1900+now.getYear());
    var _date="";
    _date=((_day < 10) ? "0" : "") + _day;
    _date+= '-'+((_month < 10) ? "0" : "") + _month;
    _date+="-"+_year;
    return _date;
}

function aftersavefunc(){
       $("#list").trigger("reloadGrid");
}

function resetSelect(dom_id, data, name_key, name_value) {
    jQuery('#'+dom_id).empty();
    jQuery('#'+dom_id).append('<option value="0">--</option>');
    jQuery.each(data, function(key, value) {
        jQuery('#'+dom_id).append('<option value="'+value[name_key]+'">'+value[name_value]+'</option>');
    });
}

function Save_sub() {
  if (!userRights.edit) return;
    var id            = $('#sub_id').val();
    var dev_id        = $('#dev_id').val();
    var car_id        = $('#car_id').val();
    var firm_id       = $('#firm_id').val();
    var dt            = $('#dt').val();
    var action        = $('#action').val();
    var claim_id      = $('#claim_id').val();
    var ml            = $('#ml').val();
    //var sim           = $('#sim').val();
    var sim_id        = $('#sim_id').val();
    var status        = $('#status_sub').val();
    var prim          = $('#prim').val();
    $('#loader').fadeIn(100);
    $('#dv_edit_sub').fadeOut(100);
    $('#dv_edit').fadeOut(100);
    $.post(
        dir+'/device_actions.php',
        { 'id':id,'dev_id':dev_id,'car_id':car_id,'firm_id':firm_id,'dt':dt,'action':action,'claim_id':claim_id,'ml':ml,'sim_id':sim_id,'status':status,'prim':prim,'oper':'save_sub' },
        function(answ){
            var answ = eval("(" + answ + ")");
            $('#loader').fadeOut(100);
            if (answ.status=='OK'){
                $('#dv_list').fadeIn(100);
                $('#list').trigger('reloadGrid');
            } else {
                if (answ.error==='') {
                    jAlert('Невозможно сохранить!','Ошибка');
                } else {
                    jAlert(answ.error,'Ошибка!');
                }
            }
        }
    );
}

function Save() {
  if (!userRights.edit) return;
    var id            = $('#id').val();
    var imei          = $('#imei').val();
    var date_purchase = $('#date_purchase').val();
    var warr_until    = $('#warr_until').val();
    var status        = $('#status').val();
    var type          = $('#type').val();
    var firm_id       = $('#firm_edit').val();

    /*if(isNaN(probeg)) { 
        jAlert('Пробiг GPS повинен бути числом, приклад 12.2','Помилка !');
        return;
    } */
    if (id==0) {
        if(status==0 || type==0 || imei==''){
            jAlert('Не всі дані внесені','Помилка !');
            return;
        }
    }

    $('#loader').fadeIn(100);
    $('#dv_edit').fadeOut(100);

    $.post(
        dir+'/device_actions.php',
        {'id':id,'imei':imei,'date_purchase':date_purchase,'warr_until':warr_until,'status':status,'type':type,'firm_id':firm_id,'oper':'save'},
        function(answ){
            var answ = eval("(" + answ + ")");
            $('#loader').fadeOut(100);
            if (answ.status=='OK'){
                $('#dv_list').fadeIn(100);
                $('#list').trigger('reloadGrid');
                clearEditForm();
            } else {
                if (answ.error==='') {
                    jAlert('Невозможно сохранить!','Ошибка');
                } else {
                    jAlert(answ.error,'Ошибка!');
                }
                $('#dv_edit').fadeIn(100);
            }
        }
    );
}

function clearEditForm() {
    $('#car_id').val("0");
    $('#firm_id').val("0");
    $('#type_id').val("0");
    $("#driver1id [value='0']").attr("selected", "selected");
    $("#drv1tmstart").val('');
    $("#drv1tmend").val('');
    $("#drv1dtstart").val(DateNow());
    $("#drv1dtend").val(DateNow());
    $("#linkeditems").empty();
    while (jQuery('#drivers tr.drr').length > 0) {
        jQuery('#drivers tr.drr:last').remove();
    }
    driversCount = 0;
    
}

function CheckType() {
    type = jQuery('#type_id').val();
    if (type==4) {
        jQuery('#firm_trip_div').show();
    } else {
        jQuery('#firm_trip_div').hide();
    }
}

function set_sim(id) {
  if (!userRights.edit) return;
    if(id) {
        $('#sim_id').val(id);
        $.post( dir+'/get_sim.php',
            { 'id':id },
            function(data){
                var data = eval("(" + data + ")");
                if (data.status=='OK') {
                    $('#value_sim').text(data.sim.sim);
                    $('#value_phone').text(data.sim.phone);
                }
            },
            "html"
        );
        $('#found_sims').hide();
    }
}

function search_sim() {
    phone = $('#search_phone').val();
    sim   = $('#search_sim').val();
    if (phone.length<3 && sim.length<3) return false;
    
    $.post( dir+'/search_sim.php',
        { 'phone':$('#search_phone').val(), 'sim':$('#search_sim').val() },
        function(data){
            var data = eval("(" + data + ")");
            $('#found_sims').empty();
            if (data.status == 'OK') {
                ss = '';
                $.each(data.found, function(key, value) {
                    ss += "<div><a href='#' onclick='set_sim("+value.id+");return false;'>"+value.phone+" : "+value.sim+"</a></div>";
                });
                $('#found_sims').html(ss);
                $('#found_sims').show();
            }
        },
        "html"
    );
}
;$("#RV101button").click(function (){
        $("#RV101description").slideToggle(1000);
        });
$("#RV201button").click(function (){
        $("#RV201description").slideToggle(1000);
        });