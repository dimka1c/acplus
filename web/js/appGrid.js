$(function () {
    $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
        if( originalOptions.type == 'POST' || options.type == 'POST' ) {
            var data = originalOptions.data;
            if (originalOptions.data !== undefined) {
                if (Object.prototype.toString.call(originalOptions.data) === '[object String]') {
                    data = $.deparam(originalOptions.data); // see http://benalman.com/code/projects/jquery-bbq/examples/deparam/
                }
            }
            else {
                data = {};
            }
            options.data = $.param($.extend(data, { csrf: $('meta[name="csrf"]').attr('content') }));
        }
    });

    $("#grid").jqGrid({
        url: "/site/cars-data",
        datatype: "json",
        mtype: "GET",
        postData    : { "<?php echo Yii::app()->request->csrfTokenName; ?>" : "<?php echo Yii::app()->request->csrfToken;?>" },
        colNames: ["Фирма", "Авто", "Кузов", "№", "Статус", "Тип", "Контроллеры", "Предприятие"],
        colModel: [
            { name: "owner_id", width: 10 },
            { name: "name_ts", width: 25, editable: true },
            { name: "kuzov", width: 25, align: "right" },
            { name: "nomer_ts", width: 25},
            { name: "gps_spr_status_car", width: 5},
            { name: "ts_type", width: 5},
            { name: "flags", width: 5},
            { name: "firm_id", width: 5}, // связанная

/*            { name: "tax", width: 80, align: "right" },
            { name: "total", width: 80, align: "right" },
            { name: "note", width: 150, sortable: false }*/

        ],
        pager: "#pager",
        rowNum: 10,
        rowList: [10, 20, 30],
        sortname: "invid",
        sortorder: "desc",
        viewrecords: true,
        gridview: true,
        autoencode: true,
        caption: "My first grid"
    });
});

// http://acplus.com/admin/grid-data?_search=false&nd=1492080857020&rows=10&page=1&sidx=invid&sord=desc

