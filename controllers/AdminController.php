<?php
/**
 * Created by PhpStorm.
 * User: v.spirin
 * Date: 10.04.2017
 * Time: 9:58
 */

namespace app\controllers;


use yii\web\Controller;

class AdminController extends Controller
{

    public $layout = 'admin';

    public function actionIndex()
    {
        $nameUser['name'] = \Yii::$app->user->identity->profile->name;
        return $this->render('index', compact('nameUser'));
    }

}