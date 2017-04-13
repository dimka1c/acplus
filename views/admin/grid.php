<?php


use yii\helpers\Url;


$this->registerJsFile('@web/js/i18n/grid.locale-ru.js', ['depends' => \yii\bootstrap\BootstrapPluginAsset::className()]);
$this->registerJsFile('@web/js/jquery.jqGrid.min.js', ['depends' => \yii\web\JqueryAsset::className()]);
$this->registerJsFile('@web/js/appGrid.js', ['depends' => \yii\web\JqueryAsset::className()]);
$this->registerCssFile('@web/css/ui.jqgrid-bootstrap.css', ['depends' => \yii\bootstrap\BootstrapPluginAsset::className()]);
?>

<h1>Таблица JqGrid </h1>

<div class="container-fluid">
    <table id="grid">
    </table>

</div>
