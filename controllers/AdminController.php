<?php
/**
 * Created by PhpStorm.
 * User: v.spirin
 * Date: 10.04.2017
 * Time: 9:58
 */

namespace app\controllers;


use app\models\OldDbUser;
use himiklab\jqgrid\actions\JqGridActiveAction;
use yii\web\Controller;
use Yii;
use yii\filters\AccessControl;

class AdminController extends Controller
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

    public function actionIndex()
    {
        if (!Yii::$app->user->isGuest) {
            $nameUser['name'] = \Yii::$app->user->identity->profile->name;
            if (!$this->isEmptyProfile()) $this->redirect('/user/profile');
            if (Yii::$app->user->can('admin')) {
                return $this->render('index', compact('nameUser'));
            } else {
                return $this->render('auth-user', compact('nameUser'));
            }
        }
        return $this->redirect('/site/index');
    }

    public function actionEditMenu()
    {
        return $this->render('edit-menu');
    }

    // Проверка на заполнение name.profile
    // Если имя не заполнено - вернем false
    protected function isEmptyProfile()
    {
        if (empty(Yii::$app->user->identity->profile->name)) {
            Yii::$app->session->setFlash('profile_name', 'Заполните, пожалуйста, поле <b>"Имя"</b>');
            return false;
        }
        return true;
    }

    public function actionAdminUsers()
    {
        $this->redirect('/admin/users');
    }

    public function actionAdminRoles()
    {
        $this->redirect('/admin/roles');
    }

    public function actionGrid()
    {
        return $this->render('grid');
    }

    public function actionGridData()
    {
        $this->layout = false;

        if (Yii::$app->request->isAjax) {
            $data = OldDbUser::find()->asArray()->limit(100)->all();
            $s = "<?xml version='1.0' encoding='utf-8'?>";
            $s .=  "<rows>";
            $s .= "<page>1</page>";
            $s .= "<total>5</total>";
            $s .= "<records>10</records>";

            // Обязательно передайте текстовые данные в CDATA
            foreach ($data as $val) {
                $s .= "<row id='". $val['u_name']."'>";
                $s .= "<cell>". $val['u_name']."</cell>";
                $s .= "<cell>". $val['u_name']."</cell>";
                $s .= "<cell>". $val['u_name']."</cell>";
                $s .= "<cell>". $val['u_name']."</cell>";
                $s .= "<cell>". $val['u_name']."</cell>";
                $s .= "<cell><![CDATA[". $val['u_name']."]]></cell>";
                $s .= "</row>";
            }
            $s .= "</rows>";
            return $s;
            //return json_encode($data);
        }
        return false;
    }

    public function actionGr()
    {
        $this->layout = false;

        if (Yii::$app->request->isAjax) {
            $data = OldDbUser::find()->asArray()->limit(100)->all();
            $s = "<?xml version='1.0' encoding='utf-8'?>";
            $s .=  "<rows>";
            $s .= "<page>1</page>";
            $s .= "<total>5</total>";
            $s .= "<records>10</records>";

            // Обязательно передайте текстовые данные в CDATA
            foreach ($data as $val) {
                $s .= "<row id='". $val['u_name']."'>";
                $s .= "<cell>". $val['u_name']."</cell>";
                $s .= "<cell>". $val['u_name']."</cell>";
                $s .= "<cell>". $val['u_name']."</cell>";
                $s .= "<cell>". $val['u_name']."</cell>";
                $s .= "<cell>". $val['u_name']."</cell>";
                $s .= "<cell><![CDATA[". $val['u_name']."]]></cell>";
                $s .= "</row>";
            }
            $s .= "</rows>";
            return $s;
            //return json_encode($data);
        }
        return false;
    }
}