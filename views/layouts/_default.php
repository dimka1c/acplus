<?php

/* @var $this \yii\web\View */
/* @var $content string */

use yii\helpers\Html;
use yii\bootstrap\Nav;
use yii\bootstrap\NavBar;
use yii\widgets\Breadcrumbs;
use app\assets\AppAsset;
use dektrium\user\widgets\Connect;
use yii\helpers\Url;

AppAsset::register($this);
?>
<?php $this->beginPage() ?>
    <!DOCTYPE html>
    <html lang="<?= Yii::$app->language ?>">
    <head>
        <meta charset="<?= Yii::$app->charset ?>">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <?= Html::csrfMetaTags() ?>
        <title><?= Html::encode($this->title) ?></title>
        <?php $this->head() ?>
    </head>
    <body>
    <?php $this->beginBody() ?>

    <div id="wrap">

        <!-- Static navbar -->
        <nav class="navbar navbar-default navbar-static-top">
            <div class="container">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand" href="index.php"><div class="logo" title="10.61.131.15 via TCP/IP 5.7.10"></div></a>
                </div>
                <div id="navbar" class="navbar-collapse collapse">
                    <ul class="nav navbar-nav">
                        <?= \app\components\TopMenuWidget::widget() ?>
                    </ul>
                    <?php if ( Yii::$app->user->isGuest) : ?>
                        <ul class="nav navbar-nav navbar-right">
                            <li id="login-btn">
                                <a href="/login" title="Вход для авторизированных пользователей">Вход</a>
                            </li>
                        </ul>
                    <?php endif; ?>
                    <?php if ( !Yii::$app->user->isGuest) : ?>
                        <ul class="nav navbar-nav navbar-right">
                            <li id="login-btn">
                                <a href="<?= Url::to(['/logout'])?>" data-method="post"><?= Yii::$app->user->identity->username ?></a>
                            </li>
                        </ul>
                    <?php endif; ?>
                </div><!--/.nav-collapse -->
            </div>
        </nav>
        <div class="container">
            <div class="clear fontStyle"></div>
            <div class="content">
                <div class="border_box">
                    <div class="box_skitter box_skitter_large">
                        <ul>
                            <li><a href="#cube"><img src="/images/slider/wall/gpsControl.jpg" class="circles" /></a><div class="label_text"><p> Контроль сельскохозяйственной техники</p>
                                </div></li>
                            <li><a href="#cubeRandom"><img src="/images/slider/wall/gpsNavigation.jpg" class="circlesInside" /></a><div class="label_text"><p> Внедрение и сопровождение
                                        системы «под ключ»</p></div></li>
                            <li><a href="#cube"><img src="/images/slider/wall/petrolControl.jpg" class="cubeShow" /></a><div class="label_text"><p>Топливозаправщики. Контроль выдачи топлива</p></div></li>
                            <li><a href="#cube"><img src="/images/slider/wall/1C.jpg" class="circlesRotate" /></a><div class="label_text"><p>Интеграция с 1С</p></div></li>
                            <li><a href="#block"><img src="/images/slider/wall/thief2.jpg" class="cubeShow" /></a><div class="label_text"><p>Реагирование на внештатные ситуации</p></div></li>
                            <li><a href="#cubeStop"><img src="/images/slider/wall/controlPersonal.jpg" class="cubeShow" /></a><div class="label_text"><p>Контроль Сотрудников предприятия</p></div></li>
                            <li><a href="#cubeStop"><img src="/images/slider/wall/truck_monitor.jpg" class="cubeShow" /></a><div class="label_text"><p>Комплексный подход к решению задачи</p></div></li>
                        </ul>
                    </div>
                </div>
                <div class="worth">
                    <h2>Мы - это профессиональный мониторинг и контроль</h2>
                    <br>
                    <p> Как это работает? Всё очень просто – на с/х технику устанавливаются GPS-трекеры и датчики <br>
                        уровня топлива, всё остальное делает автоматизированная программа! </p>
                </div>
                <div class="box_solutions fontStyle">
                    <table cellspacing="15%" class="tab_solutions">
                        <tr>
                            <th colspan="3" id="head_solutions"> Наши решения </th>
                        </tr>
                        <tr>
                            <td id="green_car_ico"> <div class="main_item" lnk_page="car">
                                    <img src="/images/ico/green_car_ico.png" alt="Легковой транспорт" /></div></td>
                            <td id="green_truck_ico"> <div class="main_item" lnk_page="truck">
                                    <img src="/images/ico/green_truck_ico.png" alt="Грузовой транспорт"/></div></td>
                            <td id="tractor_ico"> <div class="main_item" lnk_page="harvester">
                                    <img src="/images/ico/green_tractor_ico.png" alt="Сельхозтехника" /></div></td>
                        </tr>
                        <tr>
                            <th><div class="main_item" lnk_page="car"> Контроль легкового транспорта </div></th>
                            <th> <div class="main_item" lnk_page="truck">Контроль грузового транспорта</div> </th>
                            <th> <div class="main_item" lnk_page="harvester">Контроль сельскохозяйственной техники</div> </th>
                        </tr>
                        <tr>
                            <td id="green_municipal_ico"> <div class="main_item" lnk_page="fuel_ctrl">
                                    <img src="/images/ico/green_municipal_ico.png" alt="Комунальный транспорт"/></div> </td>
                            <td id="green_petrol_ico"> <div class="main_item" lnk_page="azp">
                                    <img src="/images/ico/green_petrolstation_ico.png" alt="заправочный пункт"/> </div></td>
                            <td id="green_staff_ico"><div class="main_item" lnk_page="sender">
                                    <img src="/images/ico/green_sender_ico.png" alt="sender" /> </div></td>
                        </tr>
                        <tr>
                            <th> <div class="main_item" lnk_page="fuel_ctrl"> Полный контроль топлива </div> </th>
                            <th> <div class="main_item" lnk_page="azp"> Контроль автозаправочных пунктов </div> </th>
                            <th> <div class="main_item" lnk_page="sender"> Мобильное приложение для контроля техники </div> </th>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <div class="clear"></div>
    </div>
    </div>

    <?php $this->endBody() ?>
    </body>
    </html>
<?php $this->endPage() ?>