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
    public $timeCache = 3600 * 24;     // время хранения меню в кеше 24 часа

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
        $menuFor = null; // для кого записываем меню
        if ( Yii::$app->user->isGuest) {        // меню для неавторизованного пользователя
            $menuFor = 'menu_not_auth_user';
            if ($menuCache = Yii::$app->cache->get('menu_not_auth_user')) {
                // если есть в кеше - возвращаем из кеша
                return $menuCache;
            }
        } else {
            if (Yii::$app->user->can('admin')) {
                $menuFor = 'menu_admin';
                if ($menuCache = Yii::$app->cache->get('menu_admin')) {
                    return $menuCache;
                }
            } else {
                $menuFor = 'menu_auth_user';
                if ($menuCache = Yii::$app->cache->get('menu_auth_user')) {
                    return $menuCache;
                }
            }
        }
        // формируем меню
        $this->tree = $this->getTreeNew();
        $this->menuHtml = $this->getMenuHtml($this->tree);
        // записываем к кэш;
        if (!empty($menuFor) || !empty($this->menuHtml)) {
            // Записываем меню в кеш
            //Yii::$app->cache->set($menuFor, $this->menuHtml, $this->timeCache);
        }
        return $this->menuHtml;
    }


    /**
     * @param $id_main_group
     * @return mixed
     *
     * ИСПОЛЬЗОВАЛОСЬ ДЛЯ СТАРОЙ ТАБЛИЦЫ MENU.
     * БЫЛА ДРУГАЯ СТРУКТУРА ТАБЛИЦЫ
     */

    protected function getTreeNew()
    {
        $menu = [];
        if (Yii::$app->user->isGuest) {
            // меню для неавторизированного пользователя
            $data = TopMenu::find()->indexBy('id')
                                    ->where(['menu_user_na' => 1])
                                    ->orderBy('parent_id')
                                    ->addOrderBy('position')
                                    ->asArray()
                                    ->all();
        } elseif (!Yii::$app->user->isGuest) {      // если авторизованный пользователь
            if (Yii::$app->user->can('admin')) {
                // меню для Админа
                $data = TopMenu::find()->indexBy('id')
                                        ->where(['menu_admin' => 1])
                                        ->orderBy('parent_id')
                                        ->addOrderBy('position')
                                        ->asArray()
                                        ->all();
            } else {
                // меню для Авторизированного пользователя
                $data = TopMenu::find()->indexBy('id')
                                        ->where(['menu_user_auth' => 1])
                                        ->orderBy('parent_id')
                                        ->addOrderBy('position')
                                        ->asArray()
                                        ->all();
            }

        }

        if (empty($data)) die;

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