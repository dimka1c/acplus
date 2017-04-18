<?php
/**
 * Created by PhpStorm.
 * User: v.spirin
 * Date: 14.04.2017
 * Time: 8:55
 */

// модель для автомобилей

namespace app\models;


use yii\db\ActiveRecord;

class GPScarlist extends ActiveRecord
{

    public static function tableName()
    {
        return 'gps_carlist';
    }

}