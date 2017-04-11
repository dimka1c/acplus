<?php

namespace app\module\adminMenu\controllers;

use app\models\TopMenu;
use yii\web\Controller;

/**
 * Default controller for the `adminMenu` module
 */
class MenuController extends Controller
{
    /**
     * Renders the index view for the module
     * @return string
     */
    public function actionIndex()
    {
        $menuAll = TopMenu::find()->asArray()->all();
        return $this->render('index');
    }
}
