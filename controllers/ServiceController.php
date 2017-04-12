<?php
/**
 * Created by PhpStorm.
 * User: v.spirin
 * Date: 12.04.2017
 * Time: 8:45
 */

namespace app\controllers;

use app\models\AddUser;
use app\models\OldDbUser;
use app\models\SocialAccount;
use dektrium\user\helpers\Password;
use yii\web\Controller;

class ServiceController extends Controller
{


    protected function rus2translit($string) {
        $converter = array(
            'а' => 'a',   'б' => 'b',   'в' => 'v',
            'г' => 'g',   'д' => 'd',   'е' => 'e',
            'ё' => 'e',   'ж' => 'zh',  'з' => 'z',
            'и' => 'i',   'й' => 'y',   'к' => 'k',
            'л' => 'l',   'м' => 'm',   'н' => 'n',
            'о' => 'o',   'п' => 'p',   'р' => 'r',
            'с' => 's',   'т' => 't',   'у' => 'u',
            'ф' => 'f',   'х' => 'h',   'ц' => 'c',
            'ч' => 'ch',  'ш' => 'sh',  'щ' => 'sch',
            'ь' => '',  'ы' => 'y',   'ъ' => '',
            'э' => 'e',   'ю' => 'yu',  'я' => 'ya',
            'А' => 'A',   'Б' => 'B',   'В' => 'V',
            'Г' => 'G',   'Д' => 'D',   'Е' => 'E',
            'Ё' => 'E',   'Ж' => 'Zh',  'З' => 'Z',
            'И' => 'I',   'Й' => 'Y',   'К' => 'K',
            'Л' => 'L',   'М' => 'M',   'Н' => 'N',
            'О' => 'O',   'П' => 'P',   'Р' => 'R',
            'С' => 'S',   'Т' => 'T',   'У' => 'U',
            'Ф' => 'F',   'Х' => 'H',   'Ц' => 'C',
            'Ч' => 'Ch',  'Ш' => 'Sh',  'Щ' => 'Sch',
            'Ь' => '',  'Ы' => 'Y',   'Ъ' => '',
            'Э' => 'E',   'Ю' => 'Yu',  'Я' => 'Ya',
        );
        return strtr($string, $converter);
    }
        //транслитерация
    protected function str2url($str) {
        // переводим в транслит
        $str = $this->rus2translit($str);
        // в нижний регистр
        $str = strtolower($str);
        $str = str_replace(' ', '.', $str);
        // заменям все ненужное нам на "-"
        //$str = preg_replace('~[^-a-z0-9_]+~u', '-', $str);
        // удаляем начальные и конечные '-'
        //$str = trim($str, "-");
        return $str;
    }

    // добавление гугл-аккаунтов социальных сетей
    public function actionAddSocial()
    {
        $data = OldDbUser::find()->asArray()->all();
        $this->addUser($data);
    }


    protected function addUser($user)
    {
        if (!empty($user)) {
            foreach ($user as $data) {
                $db = new AddUser();
                $db->username = $this->str2url($data['u_name']);
                $db->password_hash = Password::hash('12345678');   // ($this->password);
                $db->email = $data['u_email'] ? : NULL;
                $db->auth_key = \Yii::$app->security->generateRandomString();
                $db->confirmed_at = '1491988447';
                $db->unconfirmed_email = NULL;
                $db->blocked_at = '';
                $db->role = NULL;
                $db->registration_ip = '127.0.0.1';
                $db->created_at = '1491988447';
                $db->updated_at = '1491988447';
                $db->flags = '0';
                $db->last_login_at = '';
                $db->save();
                unset($db);
             }
        }
    }



    public function actionGoogleAuth()
    {

        $client_id = '41005698866-jlnlo539t607qs5iln941nppot16tmkf.apps.googleusercontent.com'; // Client ID
        $client_secret = 'fZTMBQVTyWk4cRyFFN5gNVPB'; // Client secret
        //$redirect_uri = 'http://localhost/google-auth'; // Redirect URI
        $redirect_uri = 'http://acplus.com/google-auth'; // Redirect URI

        // Генерация ссылки для аутентификации

        $url = 'https://accounts.google.com/o/oauth2/auth';

        $params = array(
            'redirect_uri'  => $redirect_uri,
            'response_type' => 'code',
            'client_id'     => $client_id,
            'scope'         => 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
        );

        //
        echo $link = '<p><a href="' . $url . '?' . urldecode(http_build_query($params)) . '">Аутентификация через Google</a></p>';

    }


    public function actionAuth()
    {
        $client_id = '41005698866-jlnlo539t607qs5iln941nppot16tmkf.apps.googleusercontent.com'; // Client ID
        $client_secret = 'fZTMBQVTyWk4cRyFFN5gNVPB'; // Client secret
        $redirect_uri = 'http://acplus.com/google-auth'; // Redirect URI

        if (isset($_GET['code'])) {
            $result = false;

            $params = array(
                'client_id'     => $client_id,
                'client_secret' => $client_secret,
                'redirect_uri'  => $redirect_uri,
                'grant_type'    => 'authorization_code',
                'code'          => $_GET['code']
            );

            $url = 'https://accounts.google.com/o/oauth2/token';

            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL, $url);
            curl_setopt($curl, CURLOPT_POST, 1);
            curl_setopt($curl, CURLOPT_POSTFIELDS, urldecode(http_build_query($params)));
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
            $result = curl_exec($curl);
            curl_close($curl);

            $tokenInfo = json_decode($result, true);


            if (isset($tokenInfo['access_token'])) {
                $params['access_token'] = $tokenInfo['access_token'];

                $userInfo = json_decode(file_get_contents('https://www.googleapis.com/oauth2/v1/userinfo' . '?' . urldecode(http_build_query($params))), true);
                if (isset($userInfo['id'])) {
                    $userInfo = $userInfo;
                    $result = true;
                    var_dump($userInfo);
                }
            }
        }

    }
}