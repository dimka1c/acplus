<?php

namespace app\controllers;

use app\models\GPScarlist;
use Yii;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\filters\VerbFilter;
use app\models\LoginForm;
use app\models\ContactForm;
use yii\helpers\Url;
use himiklab\jqgrid\actions\JqGridActiveAction;

class SiteController extends Controller
{

    public $layout = 'default';

    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'only' => ['logout'],
                'rules' => [
                    [
                        'actions' => ['logout'],
                        'allow' => true,
                        'roles' => ['@'],
                    ],
                ],
            ],
            'verbs' => [
                'class' => VerbFilter::className(),
                'actions' => [
                    'logout' => ['post'],
                ],
            ],
        ];
    }

    /**
     * @inheritdoc
     */
    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
            'captcha' => [
                'class' => 'yii\captcha\CaptchaAction',
                'fixedVerifyCode' => YII_ENV_TEST ? 'testme' : null,
            ],
            'jqgrid' => [
                'class' => JqGridActiveAction::className(),
                'model' => GPScarlist::className(),
                'scope' => function ($query) {
                    /** @var \yii\db\ActiveQuery $query */
                    $query->select(['title', 'author', 'language']);
                },
            ],
        ];
    }

    public function actionRb()
    {
        $this->layout = 'empty';
        return $this->render('rb');
    }

    /**
     * Displays homepage.
     *
     * @return string
     */
    public function actionIndex()
    {
        if (Yii::$app->user->isGuest) {
            $this->view->title = 'Системы GPS мониторинга и контроля | Агроцентр-плюс';
            return $this->render('index');
        } else {
            if (Yii::$app->user->can('admin')) {
                return $this->redirect('/admin/index');
            }
            return $this->redirect(Url::to('/auser/index'));
        }
    }

    /**
     * Login action.
     *
     * @return string
     */
    public function actionLogin()
    {
        if (!Yii::$app->user->isGuest) {
            return $this->goHome();
        }

        $model = new LoginForm();
        if ($model->load(Yii::$app->request->post()) && $model->login()) {
            return $this->goBack();
        }
        return $this->render('login', [
            'model' => $model,
        ]);
    }

    /**
     * Logout action.
     *
     * @return string
     */
    public function actionLogout()
    {
        Yii::$app->user->logout();

        return $this->goHome();
    }

    /**
     * Displays contact page.
     *
     * @return string
     */
    public function actionContact()
    {
        $model = new ContactForm();
        if ($model->load(Yii::$app->request->post()) && $model->contact(Yii::$app->params['adminEmail'])) {
            Yii::$app->session->setFlash('contactFormSubmitted');

            return $this->refresh();
        }
        return $this->render('contact', [
            'model' => $model,
        ]);
    }

    /**
     * Displays about page.
     *
     * @return string
     */
    public function actionAbout()
    {
        return $this->render('about');
    }

    public function actionCreateRole()
    {
        echo 'create role admin<br>';

        $role = Yii::$app->authManager->createRole('admin');
        $role->description = 'Админ';
        Yii::$app->authManager->add($role);

        echo 'create role user<br>';

        $role = Yii::$app->authManager->createRole('user');
        $role->description = 'Юзер';
        Yii::$app->authManager->add($role);
    }

    public function actionCreatePermission()
    {
        $permit = Yii::$app->authManager->createPermission('deleteUser');
        $permit->description = 'Право удалять пользователя';
        Yii::$app->authManager->add($permit);
    }

    public function actionCars()
    {
        if (Yii::$app->request->isAjax) {
            if ( $name = Yii::$app->request->post('sidx')) {
                $sort = Yii::$app->request->post('sord');
                $cars = GPScarlist::find()->asArray()->orderBy([$name => $sort])->all();
            } else {
                $cars = GPScarlist::find()->asArray()->all();
            }
            $this->layout = false;
            $data = json_encode($cars);
            echo $data;
            return;
        }
        return $this->render('cars', compact('cars'));
    }

/*    public function actionCarsData()
    {
        if (Yii::$app->request->isAjax) {
            $cars = Cars::find()->asArray()->all();
            $this->layout = false;
            $cars = Cars::find()->asArray()->all();
            $data = json_encode($cars);
            echo $data;
        }
    }*/

}
