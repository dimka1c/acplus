<?php
/**
 * Created by PhpStorm.
 * User: v.spirin
 * Date: 12.04.2017
 * Time: 8:38
 */

namespace app\models;


use yii\db\ActiveRecord;

class SocialAccount extends ActiveRecord
{

    public static function tableName()
    {
        return 'social_account';
    }

}