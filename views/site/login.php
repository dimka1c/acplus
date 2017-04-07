<?php

/* @var $this yii\web\View */
/* @var $form yii\bootstrap\ActiveForm */
/* @var $model app\models\LoginForm */

use yii\helpers\Html;
use yii\bootstrap\ActiveForm;
use dektrium\user\widgets\Connect;

$this->title = 'Login';
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="site-login">
    <h1><?= Html::encode($this->title) ?></h1>

    <p>Пожалуйста, авторизируйтесь:</p>

    <div class="panel-body">

        <?= Connect::widget([
            'baseAuthUrl' => ['/user/security/auth']
        ]) ?>

    </div>

</div>
