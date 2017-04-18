<?php

/* @var $this \yii\web\View */
/* @var $content string */

use yii\helpers\Html;
use app\assets\AppAsset;
use yii\helpers\Url;

if ( Yii::$app->user->isGuest) {
    AppAsset::register($this);
} else {
    \app\assets\AppAssetAdmin::register($this);
}


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

    <div id="wrap container">
        <!-- Static navbar -->
        <div class="row">
            <div class="col-md-12 col-lg-12 col-xs-12 col-sm-12">
                <nav class="navbar navbar-default navbar-static-top navbar-fixed-top navbar-fon-top">
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
                                    <li class="dropdown">
                                        <a href='#' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>
                                            <?= Yii::$app->user->identity->profile->name ? : 'Выход' ?>
                                            <span class='caret'>
                                        </a>
                                        <ul class='dropdown-menu'>
                                            <li class="top-menu">
                                                <a href="<?= Url::to(['/user/profile'])?>" title="">Профиль</a>
                                            </li>
                                            <li class="top-menu">
                                                <a href="<?= Url::to(['/user/account'])?>" title="">Настройка аккаунта</a>
                                            </li>
                                            <li class="top-menu">
                                                <a href="<?= Url::to(['/user/networks'])?>" title="">Соц. сети</a>
                                            </li>
                                            <li role="presentation" class="divider"></li>
                                            <li class="top-menu">
                                                <a href="<?= Url::to(['/logout'])?>" data-method="post" title="Выход">Выход</a>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            <?php endif; ?>
                        </div><!--/.nav-collapse -->
                    </div>
                </nav>
                <!-- content -->
                <div class="container backslash">
                    <?= $content ?>
                </div>
                <!-- end content -->
                <div class="clear"></div>
            </div>
        </div>

    </div>

    <?php $this->endBody() ?>
    </body>
    </html>
<?php $this->endPage() ?>