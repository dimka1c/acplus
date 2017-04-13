<?php
/**
 * Created by PhpStorm.
 * User: v.spirin
 * Date: 11.04.2017
 * Time: 14:51
 */

namespace app\models;

use dektrium\user\models\Profile as ProfileModel;
use dektrium\user\models\RegistrationForm as BaseRegistrationForm;
use dektrium\user\models\User;
use dektrium\user\models\Profile as BaseProfile;

class Profile extends BaseProfile
{

    public $phone;
    public $photo;

    public function rules()
    {
        $rules = parent::rules();
        //$rules['photo'] = ['photo', 'trim'];
        //$rules['phone'] = ['phone', 'trim'];

        return $rules;
    }

    public function attributeLabels()
    {
        $attrLabels = parent::attributeLabels();
        //$attrLabels['photo'] = \Yii::t('user', 'Фото');
        //$attrLabels['phone'] = \Yii::t('user', 'Телефон');

        return $attrLabels;
    }

    /*
    public function loadAttributes(User $user)
    {
        // here is the magic happens
        $user->setAttributes([
            'email'    => $this->email,
            'username' => $this->username,
            'password' => $this->password,
        ]);
        $profile = \Yii::createObject(BaseProfile::className());
        $profile->setAttributes([
            'phone' => $this->phone,
            'photo' => $this->photo,
        ]);
        $user->setProfile($profile);
    }
    */
}


