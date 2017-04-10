<?php
/**
 * Created by PhpStorm.
 * User: v.spirin
 * Date: 10.04.2017
 * Time: 8:37
 */

namespace app\models;


use dektrium\user\models\RegistrationForm as BaseRegistrationForm;

class RegistrationForm extends BaseRegistrationForm
{

    public $captcha;


    public function rules()
    {
        $rules = parent::rules();
        $rules[] = ['captcha', 'captcha'];
        $rules[] = ['captcha', 'required'];
        return $rules;
    }
}