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
                                <a href="<?= Url::to(['/logout'])?>" data-method="post" title="Выход"><?= Yii::$app->user->identity->profile->name ?></a>
                            </li>
                        </ul>
                    <?php endif; ?>


                </div><!--/.nav-collapse -->
            </div>

        </nav>
        <div class="container-fluid">
            <?= $content ?>
        </div>
    </div>
    </div>

    <?php $this->endBody() ?>
    </body>
    </html>
<?php $this->endPage() ?>