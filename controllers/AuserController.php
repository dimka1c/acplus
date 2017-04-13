<?php
/**
Контроллер для авторизированных пользователей
 */

namespace app\controllers;


use yii\web\Controller;
use Yii;


class AuserController extends Controller
{

    public $layout = 'default';

    /*
public function behaviors()
{
    return [
        'access' => [
            'class' => AccessControl::className(),
            'rules' => [
                [
                    'actions' => [
                        'admin-users',
                        'admin-roles',
                        'index',
                        'grid',
                    ],
                    'allow' => true,
                    'roles' => ['admin'],
                ],
                [
                    'actions' => [
                        'index',
                        'grid',
                    ],
                    'allow' => true,
                    'roles' => ['@'],
                ],
            ],
        ],
    ];
}
*/

    protected function isEmptyProfile()
    {
        if (empty(Yii::$app->user->identity->profile->name)) {
            Yii::$app->session->setFlash('profile_name', 'Заполните, пожалуйста, поле <b>"Имя"</b>');
            return false;
        }
        return true;
    }


    public function actionIndex()
    {
        if (!Yii::$app->user->isGuest) {
            if (!$this->isEmptyProfile()) $this->redirect('/user/profile');
            if (Yii::$app->user->can('authuser')) {
                return $this->render('index');
            }
            return $this->redirect('/site/index');
        }

    }

}