$( document ).ready(function() {

    $("#grid").jqGrid({
        url: "/admin/grid-data",
        datatype: "xml",
        mtype: "POST",
        colNames: ["Пользователь", "Последний вход", "Amount", "Tax", "Total", "Notes"],
        colModel: [
            { name: "name", width: 55 },
            { name: "invdate", width: 90 },
            { name: "amount", width: 80, align: "right" },
            { name: "tax", width: 80, align: "right" },
            { name: "total", width: 80, align: "right" },
            { name: "note", width: 150, sortable: false }
        ],
        pager: "#pager",
        rowNum: 10,
        rowList: [10, 20, 30],
        sortname: "invid",
        sortorder: "desc",
        viewrecords: true,
        gridview: true,
        autoencode: true,
        altRows:true,
        //caption: "Таблица jqGrid"
    });

});

// http://acplus.com/admin/grid-data?_search=false&nd=1492080857020&rows=10&page=1&sidx=invid&sord=desc

