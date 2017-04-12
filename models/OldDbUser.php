<?php
/**
 * Created by PhpStorm.
 * User: v.spirin
 * Date: 12.04.2017
 * Time: 8:42
 */

namespace app\models;


use yii\db\ActiveRecord;

class OldDbUser extends ActiveRecord
{

    public static function tableName()
    {
        return 'users';
    }

}