<?php
/**
 * Created by PhpStorm.
 * User: v.spirin
 * Date: 06.04.2017
 * Time: 16:20
 */

namespace app\components;


use app\models\TopMenu;
use yii\base\Widget;
use Yii;

class TopMenuWidget extends Widget
{

    public $menuHtml;
    public $tpl;
    public $tree;
    public $data;

    public function init()
    {
        parent::init();
        if(Yii::$app->user->isGuest) {
            $this->tpl = 'menu_user';   // меню не авторизованного пользователя
        } else {
            $this->tpl = 'menu_user';    // не авторизованного пользователя
        }
    }

    public function run()
    {
        //$this->tree = $this->getTree($this->id);
        $this->tree = $this->getTreeNew();
        $this->menuHtml = $this->getMenuHtml($this->tree);
        return $this->menuHtml;
    }


    /**
     * @param $id_main_group
     * @return mixed
     *
     * ИСПОЛЬЗОВАЛОСЬ ДЛЯ СТАРОЙ ТАБЛИЦЫ MENU.
     * БЫЛА ДРУГАЯ СТРУКТУРА ТАБЛИЦЫ
     */
/*
    protected function getTree($id_main_group)
    {
        $menu = [];
        $result = TopMenu::find()->indexBy('m_id')->asArray()->all();
        foreach ($result as $key => $val) {           //меняем ключи массива на m_id
            $data[$val['m_id']] = $val;
        }
        unset($result);
        unset($val);
        foreach ($data as $id => $node) {
            if($node['m_menu'] == $id_main_group) {
                //$this->data[$id] = $node;
                if($node['m_param'] != 5) {     // пункты меню с m_param= 5 не втсавляем, это пункты админа
                    $this->data[$node['m_link']] = $node;
                }
            } elseif ($node['m_menu'] > 2) {
                //$this->data[$node['m_menu']]['childs'][$node['m_id']] = $node;

                // делаем только для двухуровнего меню, так как БД сконфигурировано изначально неверно
                if(isset($this->data[$node['m_menu']])) {
                    $this->data[$node['m_menu']]['childs'][$node['m_id']] = $node;
                }
            }
        }
        return $this->data;
    }
*/


    protected function getTreeNew()
    {
        $menu = [];
        if (Yii::$app->user->isGuest) {             // если неавторизованный пользователь
            $data = TopMenu::find()->indexBy('id')->where(['menu_user_na' => 1])->asArray()->all();
        } elseif (!Yii::$app->user->isGuest) {      // если авторизованный пользователь
            $data = TopMenu::find()->indexBy('id')->where(['menu_user_auth' => 1])->asArray()->all();
        }

        foreach ($data as $id => $node) {
            if ($node['parent_id'] == 0) {   // главный пункт меню
                $this->data[$id] = $node;
            } else {
                $this->data[$node['parent_id']]['childs'][$node['id']] = $node;
            }
        }
        return $this->data;
    }


    /**
     * @param $tree
     * @return string
     */
    protected function getMenuHtml($tree)
    {
        $str = '';
        foreach ($tree as $category) {
            $str .= $this->callToTemplate($category);
        }
        return $str;
    }

    /**
     * @param $category
     * @return string
     */
    protected function callToTemplate($category)
    {
        // $tpl - имя файла-шаблона для меню
        ob_start();
        include __DIR__. '/menu_tpl/' . $this->tpl . '.php';
        return ob_get_clean();
    }



}