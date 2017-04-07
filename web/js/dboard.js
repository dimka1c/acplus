var data;
var f_id;
var gridCaption;
var mark_err;
var $Grid;
var pm = {};
$(document).ready(function(){
    dateSelect = $('select[name="half_year"]').add('select[name="quarter"]').add('select[name="month"]');
    dateSelect.change(resetDate);
    
    $('#dash_form').submit(function(){
        var form = $(this);
        var pd = getFormData(form);
        $.post(
            form.attr('action'),
            pd,
            function(answer){
                if(answer){
                    var data_json = $.parseJSON(answer);
                    if(data_json.type == 'pie'){
                        showChartPie(data_json);
                    }else{
                        showChartBar(data_json);
                    }
                    if($Grid){
                        $Grid.setCaption('Не выбрано');
                        $Grid.jqGrid("clearGridData", true);
                    }
                }
            }
        );
        return false;
    });
    
    //showChart();
    
    
    
});//end ready

function getFormData(form){
    var fields = form.find('input').add(form.find('select'));
    var fData = {};
    $.each(fields, function(i, item){
        if($(item).val() && $(item).val() != "0"){
            fData[$(item).attr('name')] = $(item).val();
        }
    });
    return fData;
}

function showChartPie(data){
    var myChart = Highcharts.chart('result-bar', {
        plotOptions : {
            pie : {
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '{point.name}: {point.y:.0f}',
                },
                point : {
                    events : {
                        click : infoError
                    }
                }
            }
        },
        chart: {  
            type: data.type,            
        },
        credits : {
            enabled: false
        },
        title: { text: data.title },
        subtitle: { text: data.subtitle },
        series: [{
                data: data.data,
                name: 'Количество заправок'
            }]
    });
}

function showChartBar(data){
    var series = [];
    $.each(data.firm_id, function(j, firm){
        $.each(data.data, function(i, v){
            series[i] = {name: v.name, data: v.data, color: v.color, key: v.key, firm_id: firm};
        });
    });
    var myChart = Highcharts.chart('result-bar', {
        chart: { type: 'bar' },
        title: {
            text: data.title
        },
        subtitle: {
            text: data.subtitle
        },
        xAxis: {
            categories: data.firm,
            title: {  text: null }
        },
        yAxis: {
            min: 0,
            title: { text: 'Количество заправок' },
            labels: { overflow: 'justify' }
        },
        tooltip: { valueSuffix: '' },
        plotOptions: {
            bar: {
                dataLabels: { enabled: true},
                point : {
                    events : { click : infoError }
                }
            }
        },
        credits: { enabled: false },
        series: series
    });
}



/*get info error report*/
function infoError(){
    console.log(this);
    mark_err = (this.options.key) ? this.options.key : this.series.options.key;
    gridCaption = (this.options.name) ? this.options.name : this.series.options.name;
    if($Grid){
        pd = getFormData($('#dash_form'));
        pd['mark_err'] = mark_err;
        pd['firm_id'] = f_id;
        $Grid.setGridParam({postData : pd});
        $Grid.setCaption(gridCaption);
        $Grid.trigger('reloadGrid');
    }else{
        setGrid();
    }
}

function setGrid(){
    var pd = getFormData($('#dash_form'));
    pd['mark_err'] = mark_err;
    $Grid = $('#grid-error').jqGrid({
        url : '/dashboard/get_info_json/fuel_error',
        datatype : 'json',
        mtype : 'post',
        postData : pd,
        colNames : ['Дата', 'Время', 'Гос. номер', 'Номер кузова', 'Объем заправки(л)'],
        colModel : [
            {name : 'date', index : 'date', sortable:true},
            {name : 'time', index : 'time', sortable:true},
            {name : 'gNumber', index : 'gNumber',   sortable:true},
            {name : 'kNumber', index : 'kNumber', sortable:true},
            {name : 'volume', index : 'volume', sortable:true}
        ],
        pager : $('#grid-pager'),
        rowNum : 10,
        rowList : [10, 25, 50],
        sortname : 'date',
        sortorder : 'desc',
        viewrecords: true,
        gridview: true,
        autoencode: true,
        autowidth: true,
        caption : gridCaption,
        footerrow: true,
        userDataOnFooter: true,
        loadComplete: setFooterWidth
    });
}

function resetDate(){
    var curr = $(this);
    $.each(dateSelect, function(i, v){
        if($(v).attr('name') != curr.attr('name')){
            $(v).val(0);
        }
    })
}

function setFooterWidth(){
    var w = $('.ui-jqgrid-bdiv').css('width');
    $('.ui-jqgrid-ftable').css({'width': w});
}

function