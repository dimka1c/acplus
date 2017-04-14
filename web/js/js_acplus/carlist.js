    $('#list').jqGrid({
        url         : '/site/cars', //dir + 'carlist.php',
        datatype    : 'json',
        //postData    : { },
        mtype       : 'GET',
        width       : '100%',
        height      : '100%',
        colNames    : [ 'Владелец', 'Марка', 'Кузов/Зав.номер', 'Гос.номер', 'Сост.Авто','Вид ТС','Прим.', 'Контроллеры', 'iTrackId', 'Предприятие','Водитель','RFID','Норма расх(л)','Объем бака (л)'], //,'Телефон','ИНН'
        colModel    : [
            { name:'owner_id', index:'cl.owner_id', align:'left', width:90,editable:false,
                stype: 'select', searchoptions: { value:sFirms, clearSearch:false, dataInit:InitFilterSelectMenu },
                edittype:'select', editoptions: { value:sFirmsE }
            },
            { name:'name_ts', index:'cl.name_ts', align:'left', width:80, search:true, editable:false },
            { name:'kuzov', index:'cl.kuzov', align:'center', width:80,editable:false },
            { name:'nomer_ts', index:'cl.nomer_ts', align:'center', width:70, search:true,editable:false },
            { name:'status_car', index:'cl.gps_spr_status_car', align:'center', width:72, editable:false, search:true,
                stype: 'select', searchoptions: { value:sCarSt, clearSearch:false, dataInit:InitFilterSelectMenu }, edittype:'select', editoptions:{ value:sCarStE }
            },
            { name:'car_type', index:'cartype.id', align:'center', width:70, editable:false, search:true,hidden:false,
                stype: 'select', searchoptions: { value:sCar, clearSearch:false, dataInit:InitFilterSelectMenu }, edittype:'select', editoptions:{ value:sCarE }
            },
            { name:'prim',index:'cl.prim',align:'center',width:40,search:true,editable:false },
            { name:'flags',index:'flags',align:'center',width:70,search:true,editable:false,sortable:false,
                stype: 'select', searchoptions:{value:sFlags, clearSearch:false, dataInit:InitFilterSelectMenu }, formatter:FmtFlag, cellattr:AttrFlag
            },
            { name:'itrack_id', index:'itrack_id', align:'center',width:45, search:true, editable:isAdmin, sortable:true, hidden:!isAdmin },
            { name:'firm_id', index:'cl.firm_id', align:'left', width:50, search:true, editable:isAdmin, sortable:true, hidden:!isAdmin,
                stype: 'select', searchoptions: { value:sFirms, clearSearch:false, dataInit:InitFilterSelectMenu },
                edittype:'select', editoptions: { value:sFirmsE }
            },
            { name:'fio',   index:'fio', align:'left',width:70, search:true, editable:false, sortable:true},
//            { name:'phone', index:'phone', align:'left',width:70, search:true, editable:false, sortable:true},
//            { name:'inn',   index:'inn', align:'left',width:70, search:true, editable:false, sortable:true},
            { name:'rfid',  index:'rfid', align:'left',width:70, search:true, editable:false, sortable:true,hidden:false,},
            { name:'norma', index:'norma', align:'left',width:70, search:true, editable:false, sortable:true},
            { name:'tank_volume', index:'tank_volume', align:'left',width:70, search:true, editable:false, sortable:true},
        ],
        pager       : '#pager',
        rowNum      : 20,
        rowList     : [5,10,20,30,50,70,100,150],
        sortname    : 'nomer_ts',
        sortorder   : "asc",
        viewrecords : true,
        caption     : '',
        hidegrid    : false,
        //footerrow   : true,
        //userDataOnFooter : true,
        //altRows     : true,
        rownumbers  : true,
        loadtext    : '<img src="images/blue_loading.gif" />',
        ondblClickRow: GridDblClkRow,
        gridComplete    : function() {
            $('.no-title').removeAttr('title');
        },
        editurl         : dir + 'carlist_action.php',
        subGrid         : true,
        subGridOptions  : { 
            "plusicon" : "ui-icon-triangle-1-e", 
            "minusicon" : "ui-icon-triangle-1-s", 
            "openicon" : "ui-icon-arrowreturn-1-e",
            "reloadOnExpand" : true,
            "selectOnExpand" : true
        }, 
        subGridRowExpanded: Carlist_SubGrid
    });

