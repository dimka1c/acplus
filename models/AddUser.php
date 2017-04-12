<?php
/**
 * Created by PhpStorm.
 * User: v.spirin
 * Date: 12.04.2017
 * Time: 13:31
 */

namespace app\models;


use yii\db\ActiveRecord;

class AddUser extends ActiveRecord
{

    public static function tableName()
    {
        return 'user';
    }


}