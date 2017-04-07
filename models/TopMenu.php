<?php
/**
 * Created by PhpStorm.
 * User: v.spirin
 * Date: 06.04.2017
 * Time: 16:35
 */

namespace app\models;


use yii\db\ActiveRecord;

class TopMenu extends ActiveRecord
{

    public static function tableName()
    {
        return 'menu_yii';
    }

}