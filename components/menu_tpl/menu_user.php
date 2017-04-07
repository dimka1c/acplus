<?php if(isset($category['childs'])) : ?>
    <li class="dropdown">
        <a href='#' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>
            <?=$category['category']?>
            <span class='caret'>
        </a>
        <ul class='dropdown-menu'>
            <?php foreach ($category['childs'] as $key => $val) : ?>
                <li>
                    <a href="<?=$val['link']?>" title="<?=$val['title']?>"><?=$val['category']?></a>
                </li>
            <?php endforeach; ?>
        </ul>
    </li>
<?php endif; ?>
<?php if(!isset($category['childs'])) : ?>
    <li><a href="<?=$category['link']?>"><?=$category['category']?></a></li>
<?php endif; ?>