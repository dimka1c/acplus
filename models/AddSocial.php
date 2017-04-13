<?php
/**
 * Created by PhpStorm.
 * User: v.spirin
 * Date: 13.04.2017
 * Time: 8:44
 */

namespace app\models;


use yii\db\ActiveRecord;

class AddSocial extends ActiveRecord
{

    public static function tableName()
    {
        return 'social_account';
    }

}