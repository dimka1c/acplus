<?php

use himiklab\jqgrid\JqGridWidget;
use yii\helpers\Url;

$this->registerJsFile('@web/js/appGrid.js', ['depends' => \yii\web\JqueryAsset::className()]);

/*$this->registerJsFile('@web/js/i18n/grid.locale-ru.js', ['depends' => \yii\bootstrap\BootstrapPluginAsset::className()]);
$this->registerJsFile('@web/js/jquery.jqGrid.min.js', ['depends' => \yii\web\JqueryAsset::className()]);
$this->registerJsFile('@web/js/appGrid.js', ['depends' => \yii\web\JqueryAsset::className()]);
$this->registerCssFile('@web/css/ui.jqgrid-bootstrap.css', ['depends' => \yii\bootstrap\BootstrapPluginAsset::className()]);*/
?>

<table id="i_grid">
    <tr><td></td></tr>

</table>

<div id="pager"></div>


<div class="container-fluid">
    <?= JqGridWidget::widget([
        'requestUrl' => Url::to('/site/cars'),
        'gridSettings' => [
            //'colNames' => ['Фирма', 'Авто', 'Кузов'],
            'colNames'=> [ 'Владелец', 'Марка', 'Кузов/Зав.номер', 'Гос.номер', 'Сост.Авто','Вид ТС',
                'Прим.',
                'Контроллеры',
                'iTrackId',
                'Предприятие',
                'Водитель','RFID','Норма расх(л)','Объем бака (л)'],

            'colModel' => [
                [
                    'name' => 'owner_id',
                    'index' => 'owner_id',
                    'editable' => true,
                    'align' => 'center',
                    'editable' => true,
                    'search' => true,
                    'sortable' => false,
                    //'width' => 50,
                ],
                ['name' => 'name_ts', 'index' => 'name_ts', 'editable' => true],
                ['name' => 'kuzov', 'index' => 'kuzov', 'editable' => true],
                ['name' => 'nomer_ts', 'index' => 'nomer_ts', 'editable' => true],
                ['name' => 'gps_spr_status_car', 'index' => 'gps_spr_status_car', 'editable' => true],
                ['name' => 'ta_type', 'index' => 'ta_type', 'editable' => true],
                ['name' => 'prim', 'index' => 'prim', 'editable' => true],
                ['name' => 'flags', 'index' => 'flags', 'editable' => true],
                ['name' => 'itrack_id', 'index' => 'itrack_id', 'editable' => true],
                ['name' => 'firm_id', 'index' => 'firm_id', 'editable' => true],
                ['name' => 'firm_id', 'index' => 'language', 'editable' => true], // -- fio
                ['name' => 'firm_id', 'index' => 'language', 'editable' => true],      // --rfid
                ['name' => 'norma', 'index' => 'norma', 'editable' => true],
                ['name' => 'tank_volume', 'index' => 'tank_volume', 'editable' => true],

            ],
            'pager' => '#pager',
            'rowNum' => 20,
            'rowList' => [5,10,20,30,50,70,100, 150],
            'sortname' => 'nomer_ts',
            'autowidth' => true,
            'height' => 'auto',
            //---------------
            'sortorder' => "asc",
            'viewrecords' => true,
            'caption' => 'Автомобили',
            'hidegrid' => false,
        //footerrow   : true,
        //userDataOnFooter : true,
        //altRows     : true,
            'rownumbers' => true,
            'loadtext' => 'Загрузка...>',
            //'ondblClickRow' => 'GridDblClkRow',

        ],
        'pagerSettings' => [
            'edit' => true,
            'add' => true,
            'del' => true,
            'search' => ['multipleSearch' => true]
        ],
        'enableFilterToolbar' => true,
    ]) ?>
</div>
