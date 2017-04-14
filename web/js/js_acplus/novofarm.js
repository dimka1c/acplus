$Form        = null;

$(document).ready(function() {
    List();
    
    var input = document.getElementById("images"), 
        formdata = false;
        
    if (window.FormData) {
        formdata = new FormData();
        document.getElementById("btn").style.display = "none";
    }
    
    input.addEventListener("change", function (evt) {
        //document.getElementById("response").innerHTML = "Загрузка . . ."
        var i = 0, len = this.files.length, img, reader, file;
        formdata = new FormData();
        formdata.append("id", $('#id').val());
        for ( ; i < len; i++ ) {
            file = this.files[i];
    
            if (!!file.type.match(/image.*/)) {
                if ( window.FileReader ) {
                    reader = new FileReader();
                    reader.onloadend = function (e) { 
                        showUploadedItem(e.target.result, file.fileName);
                    };
                    reader.readAsDataURL(file);
                }
                if (formdata) {
                    formdata.append("images[]", file);
                }
            }    
        }
    
        if (formdata) {
            $.ajax({
                url: dir+'/novofarm_upload.php',
                type: "POST",
                data: formdata,
                processData: false,
                contentType: false,
                success: function (res) {
                    document.getElementById("response").innerHTML = res; 
                }
            });
        }
    }, false);
    
    $Form = $('#dlg_form').dialog({
        title       : 'Выбор филиала',
        autoOpen    : false,
        width       : 'auto',
        height      : 'auto',
        modal       : true,
        //focus       : moveSearchUp,
        //close       : FormCancel,
        closeOnEscape: false,
        buttons     : [
            { text:'Отмена', icons:{primary: 'ui-icon-cancel'}, click: function() { $Form.dialog('close') },id:'cancel_btn' },
            { text:'Утвердить', icons:{primary: 'ui-icon-disk'}, click: function() { Save(); },id:'approve_btn' },
            { text:'Отклонить', icons:{primary: 'ui-icon-close'}, click: function() { Reject(); },id:'rej_btn' }
        ]
    });
    
    $FormInfo = $('#dlg_info').dialog({
        title       : 'Заявка на ремонт',
        autoOpen    : false,
        width       : 'auto',
        height      : 'auto',
        modal       : true,
        closeOnEscape: false
    });
});

////////////////////////////////////// end ready
function List(){
    $('#loader').fadeIn(50);
    $('#dv_list').html('<table id="list"></table><div id="pager"></div>');

    $("#list").jqGrid({
        url:dir+'/novofarm.php',
        datatype: 'json',
        postData:{ },
        loadComplete:function(id){ $('#loader').fadeOut(100); $(".ui-jqgrid-sortable").css('white-space', 'normal').css('height', 'auto'); },
        mtype: 'POST',
        width: '90%',
        height: '100%',
        colNames:[ 'id','Дата','Предприятие','Наименование техники','Гос.номер','Серийный номер','Местонахождение техники','Нараб. м/ч','Краткое описание неисправности','Статус','Сотрудник предприятия','Телефон сотрудника' ],
        colModel :[
            { name:'id',index:'id',align:'left',width:40,search:true,editable:false },
            { name:'create',index:'create',align:'left',width:60,search:true,editable:false,
                formatter:'date',
                searchoptions: {dataInit: function (element) {
                    $(element).datepicker({ dateFormat: 'yy-mm-dd', onClose: function(){$('#list')[0].triggerToolbar();}})
                }},
                searchrules: { date: true }
            },
            { name:'firm_id',index:'firm_id',align:'left',width:110,search:true,editable:false,
                stype: 'select', searchoptions: { value:sFirms, clearSearch:false /*,dataInit:InitFilterSelectMenu*/ },
            },
            { name:'ts_name',index:'ts_name',align:'center',width:150,editable:false,search:true },
            { name:'gos_num',index:'gos_num',align:'center',width:60,editable:false,search:true },
            { name:'vin',index:'vin',align:'center',width:110,editable:false,search:true },
            { name:'place',index:'place',align:'center',width:110,search:false,editable:false },
            { name:'hours_operating',index:'hours_operating',align:'center',width:50,search:false,editable:false },
            { name:'description',index:'description',align:'center',width:200,search:false,editable:false },
            { name:'status',index:'status',align:'center',width:80,search:false,editable:false },
            { name:'firm_user_name',index:'firm_user_name',align:'center',width:80,search:false,editable:false },
            { name:'firm_user_phone',index:'firm_user_phone',align:'center',width:100,search:false,editable:false,
              classes:"grid-col"
            }
        ],
        pager: '#pager',
        rowNum:30,
        rowList:[5,10,20,30,50,70,100,150],
        sortname: '`create`',
        sortorder: "desc",
        viewrecords: true,
        caption: 'Заявки на ремонт',
        footerrow : false,
        userDataOnFooter : false,
        altRows: true,
        rownumbers: true,
        ondblClickRow: function(id){
            if(id) {
                lastSel=id;
                ShowEdit(id);
            }
        },
        editurl: dir+'/novofarm_actions.php',
        /*subGrid: true,
        subGridOptions: { 
            "plusicon" : "ui-icon-triangle-1-e", 
            "minusicon" : "ui-icon-triangle-1-s", 
            "openicon" : "ui-icon-arrowreturn-1-e",
            "reloadOnExpand" : true,
            "selectOnExpand" : true
        }
        , 
        subGridRowExpanded: function(subgrid_id, row_id) {
            var subgrid_table_id, pager_id; 
            subgrid_table_id = subgrid_id+"_t"; 
            pager_id = "p_"+subgrid_table_id; 
            $("#"+subgrid_id).html("<table id='"+subgrid_table_id+"' class='scroll'></table><div id='"+pager_id+"' class='scroll'></div>");
            $("#"+subgrid_table_id).jqGrid({ 
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
                            dir+'/novofarm_actions.php',
                            {'id': selectedRow, 'oper': 'delsub'},
                            function(answ){
                                var answ = eval("(" + answ + ")");
                                $('#loader').fadeOut(100);
                                if (answ.status=='OK'){
                                    $('#'+subgrid_table_id).jqGrid('delRowData', selectedRow);
                                } else {
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
        */
    });
            
    /*jQuery("#list").jqGrid('destroyGroupHeader');
        jQuery("#list").jqGrid('setGroupHeaders', {
        useColSpanStyle: true,
        groupHeaders:[
        { startColumnName: 'phone_sms', numberOfColumns: 3, titleText: 'Телефон,статус' },
        ]
    });*/

    $("#list").jqGrid('navGrid','#pager',
        { edit:false, add:false, del:true, search:false },
        { height:250,width:750, reloadAfterSubmit:true,closeAfterAdd:true,closeAfterEdit:true }, //options
        { height:250,width:750, reloadAfterSubmit:true,closeAfterAdd:true,closeAfterEdit:true }, // edit options
        { height:250,width:750, reloadAfterSubmit:true,closeAfterAdd:true,closeAfterEdit:true }, // add options
        { reloadAfterSubmit:true }, // del options
        {  } // search options
    );

    $("#list").jqGrid('filterToolbar',{ autosearch:true, searchOnEnter : false, stringResult: true, defaultSearch:'cn' });
    //$('#list').setPostData({  });
    
    $("#list").jqGrid('navGrid','#pager').navButtonAdd('#pager',{
        caption:"<b style=\"color:red\">Инфо </b>",
        id:'info',
        buttonicon:"",
        onClickButton: function(){
            selectedRow = $('#list').jqGrid('getGridParam','selrow');
            if (selectedRow) {
                showInfo(selectedRow);
            } else {
                jAlert('Не выделена строка!','Ошибка');
            }
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

function showInfo(id) {
    $.post( dir+'/novofarm_actions.php',
            { id:id,oper:'get' },
            function(data) {
                if (data.status=='OK') {
                    values = data.data;
                    $('#ts_name').text(values.ts_name);
                    $('#gos_num').text(values.gos_num);
                    $('#vin').text(values.vin);
                    $('#description').text(values.description);
                    $('#hours_operating').text(values.hours_operating);
                    $('#place').text(values.place);
                    $FormInfo.dialog('open');
                } else {
                    jAlert(data.error,'Error!');
                }
            },
            "json"
        );
}

function ShowEdit(id) {
    $('#id').val(id);
    var title = '';
    if (id > 0) {
        $('#st_0').hide();
        $('#st_1').hide();
        $('#st_2').hide();
        $('#st_3').hide();
        $('#dlg_reason').hide();
        $('#rej_btn').hide();
        $('#cancel_btn').hide();
        $('#approve_btn').hide();
        $.post( dir+'/novofarm_actions.php',
            { id:id,oper:'get' },
            function(data) {
                if (data.status=='OK') {
                    values = data.data;
                    $('#status').val(values.status);
                    switch(values.status){
                        case '0':
                            $("#filial [value='"+data.filial+"']").attr("selected", "selected");
                            $('#st_0').show();
                            title = 'Выбор филиала';
                            $('#cancel_btn').show();
                            $('#approve_btn').show();
                            $('#rej_btn').show();
                            break;
                        case '1':
                            $('#performer').empty();
                            options = '';
                            $.each(data.users, function(key, value) {
                                options+= '<option value="'+key+'">'+value+'</options>';
                            });
                            $('#performer').append(options);
                            $('#dispetcher_1').text(data.dispetcher);
                            $('#st_1').show();
                            title = 'Выбор исполнителя';
                            $('#cancel_btn').show();
                            $('#approve_btn').show();
                            $('#rej_btn').show();
                            break;
                        case '2':
                            $('#dispetcher_2').text(data.dispetcher);  
                            $('#performer_2').text(data.performer);
                            $('#st_2').show();
                            $('#cancel_btn').show();
                            $('#approve_btn').show();
                            title = 'Загрузка акта';
                            break;
                        case '3':
                            $('#dispetcher_3').text(data.dispetcher);  
                            $('#performer_3').text(data.performer);
                            $('#st_3').show();
                            title = 'Заявка выполнена';
                            break;
                    }
                    //$Form.title = title;
                    //var newtitle= '<b>HTML TITLE</b>';
                    $("#dlg_form").parent().find("span.ui-dialog-title").html(title);
                    $Form.dialog('open');
                } else {
                    jAlert(data.error,'Error!');
                }
            },
            "json"
        );
    } 
};

/*
function ShowEditHistory(id,dev_id) {
    isShowEdit = true;
    $('#search_car').val('');
    $("#firm_id").val(0);
    if (id > 0) {
        $('#div_search_car').hide();
        $.post( dir+'/novofarm_actions.php',
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
    
    $.post( dir+'/search_car.php',
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
    $.post( dir+'/novorafm_actions.php',
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
*/
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
/*
function resetSelect(dom_id, data, name_key, name_value) {
    jQuery('#'+dom_id).empty();
    jQuery('#'+dom_id).append('<option value="0">--</option>');
    jQuery.each(data, function(key, value) {
        jQuery('#'+dom_id).append('<option value="'+value[name_key]+'">'+value[name_value]+'</option>');
    });
} */

function Save() {
    var id     = parseInt($('#id').val()),
        status = parseInt($('#status').val()),
        filial = parseInt($('#filial').val()),
        performer = parseInt($('#performer').val());
    if (!id || !filial) {
        jAlert('Не всі дані внесені','Помилка !');
        return false;
    }
    var params = {};
    switch(status) {
        case 0: params = { id:id,status:status,filial:filial,oper:'accept' };break;
        case 1: params = { id:id,status:status,performer:performer,oper:'accept' };break;
        case 2: params = { id:id,status:status,oper:'accept' };break;
    }

    $.post(
        dir+'/novofarm_actions.php',
        params,
        function(answ){
            $('#loader').fadeOut(100);
            if (answ.status=='OK'){
                $('#dv_list').fadeIn(100);
                $('#list').trigger('reloadGrid');
                $Form.dialog('close');
            } else {
                if (answ.error==='') {
                    jAlert('Невозможно сохранить!','Ошибка');
                } else {
                    jAlert(answ.error,'Ошибка!');
                }
            }
        },
        "json"
    );
}

function showAct() {
    var id = $('#id').val();
    var img_name = dir_act+id+'_1.jpg';
    window.open('https://acplus.com.ua/'+img_name,'report','menubar=no,location=no,resizable=yes,scrollbars=yes,status=no');
}

function FormCancel() {
    //$OrderLdr.hide();
    //$('.tbl_bad').removeClass('tbl_bad');
    //$('#trCarInfo').hide();
    //$('#trDest').hide();
    //$('#trComment').hide();
    //$('#firm_id option:eq(0)').prop('selected', true);
    //$('#firm_id ').prop('disabled', false);
    //$('#car_id')
        //.val($('#car_id').attr('b'))
        //.attr('cid', 0)
        //.prop('disabled', false);
    //$('#car_num').val('').attr('bt', '');
    //$('#type_id').val(0);
    //$('#dest_id option').show().eq(0).prop('selected', true);
    //$('#comment').val('');
    //$('#dlg_order select').val(0);

    $Form.attr('id', 0);
}

function Reject() {
    var status = $('#status').val();
    if (status>1) return false;
    
    if(!$('#dlg_reason').is(":visible")) {
        $('#dlg_reason').show();
        return;
    } else if ($('#reason').val().length==0) {
        jAlert('Заполните причину отклонения','Alert');
        return;
    } else {
        $.post(
            dir+'/novofarm_actions.php',
            { id:$('#id').val(),reason:$('#reason').val(),oper:'reject' },
            function(answ) {
                if (answ.status == 'OK'){
                    $Form.dialog('close');
                    $('#list').trigger('reloadGrid');
                } else {
                    jAlert(answ.error);
                    return;
                }
            },
            'json'
        );
    }
}