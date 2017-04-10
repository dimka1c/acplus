<?php

namespace app\commands;


use yii\console\Controller;
use Yii;

class RbController extends Controller
{

    public function actionIndex()
    {

        $auth = Yii::$app->authManager;

        // очищаем базу данных
        $auth->removeAll();

        // задаем роли admin и user
        $admin = $auth->createRole('admin');
        $user =$auth->createRole('user');

        // добавляем роли в БД
        $auth->add($admin);
        $auth->add($user);

        $accessAdminPage = $auth->createPermission('accessAdminPage');
        $accessAdminPage->description = 'Доступ к странице Админа';

        $accessAuthUserPage = $auth->createPermission('accessAuthUserPage');
        $accessAuthUserPage->description = 'Доступ только для авторизированных пользователей';

        // Запишем разрешения в БД
        $auth->add($accessAdminPage);
        $auth->add($accessAuthUserPage);



    }

}