<?php
/**
 * Created by PhpStorm.
 * User: v.spirin
 * Date: 10.04.2017
 * Time: 9:58
 */

namespace app\controllers;


use yii\web\Controller;
use Yii;

class AdminController extends Controller
{

    public $layout = 'default';

    public function actionIndex()
    {
        $role = Yii::$app->user->identity->role;
        $nameUser['name'] = \Yii::$app->user->identity->profile->name;
        if ($role == 'admin') {
            return $this->render('index', compact('nameUser'));
        } else {
            return $this->render('auth-user', compact('nameUser'));
        }
        return $this->render('index', compact('nameUser'));
    }

    public function actionEditMenu()
    {
        return $this->render('edit-menu');
    }



}