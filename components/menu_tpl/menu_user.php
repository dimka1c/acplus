<?php if(isset($category['childs'])) : ?>
    <li class="dropdown">
        <a href='#' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>
            <?=$category['category']?>
            <span class='caret'>
        </a>
        <ul class='dropdown-menu menu-top-background'>
            <?php foreach ($category['childs'] as $key => $val) : ?>
                <li class="top-menu">
                    <a href="<?= \yii\helpers\Url::to($val['link'])?>" title="<?=$val['description']?>"><?=$val['category']?></a>
                </li>
            <?php endforeach; ?>
        </ul>
    </li>
<?php endif; ?>
<?php if(!isset($category['childs'])) : ?>
    <li class="top-menu"><a href="<?= \yii\helpers\Url::to($category['link'])?>"><?=$category['category']?></a></li>
<?php endif; ?>