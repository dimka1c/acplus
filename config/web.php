<?php

$config = parse_ini_file(__DIR__ . '/secure/data.ini', true);

$params = require(__DIR__ . '/params.php');

$config = [
    'id' => 'basic',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log'],
    'language' => 'Ru-ru',
    'defaultRoute' => 'site/index',
    'modules' => [
        'user' => [
            'class' => 'dektrium\user\Module',
            'modelMap' => [
                'RegistrationForm' => 'app\models\RegistrationForm',
                'Profile' => 'app\models\Profile',
            ],
            'controllerMap' => [
                'registration' => [
                    'class' => \dektrium\user\controllers\RegistrationController::className(),
                    'on ' . \dektrium\user\controllers\RegistrationController::EVENT_AFTER_REGISTER => function ($e) {
                        Yii::$app->response->redirect(array('/user/security/login'))->send();
                        Yii::$app->end();
                    },
                    'layout' => '@app/views/layouts/default',
                ],
                'security' => [
                    'class' => \dektrium\user\controllers\SecurityController::className(),
                    'on ' . \dektrium\user\controllers\SecurityController::EVENT_AFTER_LOGIN=> function ($e) {
                        Yii::$app->response->redirect(array('/admin/index'))->send();
                        Yii::$app->end();
                    },
                    'layout' => '@app/views/layouts/default',
                ],
                'admin' => [
                    'class' => \dektrium\user\controllers\AdminController::className(),
                    'layout' => '@app/views/layouts/default',
                ]

            ],
            'admins' => ['dimka1c'],
            'layout' => '@app/views/layouts/default',
            'mailer' => [
                'sender'                => 'no-reply@myhost.com', // or ['no-reply@myhost.com' => 'Sender name']
                'welcomeSubject'        => 'Welcome subject',
                'confirmationSubject'   => 'Confirmation subject',
                'reconfirmationSubject' => 'Email change subject',
                'recoverySubject'       => 'Recovery subject',
            ],
        ],
        'rbac' => [
            'class' => 'dektrium\rbac\RbacWebModule',
            'layout' => '@app/views/layouts/default',
        ],
        'adminMenu' => [
            'class' => 'app\module\adminMenu\Module',
        ],

    ],
    'components' => [
/*        'authManager' => [
            'class' => 'yii\rbac\DbManager',
        ],*/
        'view' => [
            'theme' => [
                'pathMap' => [
                    '@dektrium/user/views' => '@app/views/user',
                    '@dektrium/rbac/views' => '@app/views/rbac',
                ],
            ],
        ],
        'request' => [
            // !!! insert a secret key in the following (if it is empty) - this is required by cookie validation
            'cookieValidationKey' => 'd54paK6-6SgKZAmXGL5kQfPzyAh9usWD',
        ],
/*        'user' => [
            'class' => 'app\components\User',
            'identityClass' => 'dektrium\user\models\User',
        ],*/
        'cache' => [
            'class' => 'yii\caching\FileCache',
        ],
        'errorHandler' => [
            'errorAction' => 'site/error',
        ],
        'mailer' => [
            'class' => 'yii\swiftmailer\Mailer',
            // send all mails to a file by default. You have to set
            // 'useFileTransport' to false and configure a transport
            // for the mailer to send real emails.
            'useFileTransport' => false,
/*            'mailer' => [
                'sender'                => 'no-reply@myhost.com', // or ['no-reply@myhost.com' => 'Sender name']
                'welcomeSubject'        => 'Подтверждение регистрации acplus.com.ua',
                'confirmationSubject'   => 'Confirmation subject',
                'reconfirmationSubject' => 'Email change subject',
                'recoverySubject'       => 'Recovery subject',
            ],*/
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
        'db' => require(__DIR__ . '/db.php'),
        'urlManager' => [
            'enablePrettyUrl' => true,
            'showScriptName' => false,
            'rules' => [
                'login' => '/user/security/login',
                'registration' => '/user/registration/register',
                'remember-password' => '/user/recovery/request',
                'logout' => '/user/security/logout',
                'user/profile' => '/user/settings/profile',
                'user/account' => '/user/settings/account',
                '/user/networks' => '/user/settings/networks',
                'admin/users' => 'user/admin/index',
                'admin/roles' => 'rbac',
            ],
        ],
        'authClientCollection' => [
            'class' => yii\authclient\Collection::className(),
            'clients' => [
                'google' => [
                    'class' => 'dektrium\user\clients\Google',
                    'clientId' => $config['oauth_google_key'],
                    'clientSecret' => $config['oauth_google_secret'],
                ],
                'facebook' => [
                    'class'        => 'dektrium\user\clients\Facebook',
                    'clientId'     => 'APP_ID',
                    'clientSecret' => 'APP_SECRET',
                ],
                'vkontakte' => [
                    'class'        => 'dektrium\user\clients\VKontakte',
                    'clientId'     => 'CLIENT_ID',
                    'clientSecret' => 'CLIENT_SECRET',
                ],
                'twitter' => [
                    'class'          => 'dektrium\user\clients\Twitter',
                    'consumerKey'    => 'CONSUMER_KEY',
                    'consumerSecret' => 'CONSUMER_SECRET',
                ],
                'github' => [
                    'class'        => 'dektrium\user\clients\GitHub',
                    'clientId'     => $config['oauth_github_key'],
                    'clientSecret' => $config['oauth_github_secret'],
                ],
                'yandex' => [
                    'class'        => 'dektrium\user\clients\Yandex',
                    'clientId'     => 'CLIENT_ID',
                    'clientSecret' => 'CLIENT_SECRET'
                ],
                'linkedin' => [
                    'class'        => 'dektrium\user\clients\LinkedIn',
                    'clientId'     => 'CLIENT_ID',
                    'clientSecret' => 'CLIENT_SECRET'
                ],
            ],
        ],
    ],
    'params' => $params,
];

if (YII_ENV_DEV) {
    // configuration adjustments for 'dev' environment
    $config['bootstrap'][] = 'debug';
    $config['modules']['debug'] = [
        'class' => 'yii\debug\Module',
        // uncomment the following to add your IP if you are not connecting from localhost.
        //'allowedIPs' => ['127.0.0.1', '::1'],
    ];

    $config['bootstrap'][] = 'gii';
    $config['modules']['gii'] = [
        'class' => 'yii\gii\Module',
        // uncomment the following to add your IP if you are not connecting from localhost.
        //'allowedIPs' => ['127.0.0.1', '::1'],
    ];
}

return $config;
