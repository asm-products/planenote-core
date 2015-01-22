<?php

include_once('/var/www/pn/private/api/init.php');

?>

<div class="content_page home_page" data-link="/">
    <div class="content_wrapper">
    
        <div class="home-post-container content-card">
            <div class="post-img-placeholder"><img src></div>
            <textarea class="postText post-text-input" placeholder="Type your post here..."></textarea>
            <div class="upload-file-controls uk-button-group">
                <button class="uploadImg uk-button uk-button-small"><i class="fa fa-image"></i> Add Image</button>
                <button class="uk-button uk-button-small"><i class="fa fa-video-camera"></i> Add Video</button>
            </div>
            <div class="upload-image-controls uk-button-group">
                <button class="uploadImgChange uk-button uk-button-small"><i class="fa fa-exchange"></i> Change Image</button>
                <button class="uploadImageRemove uk-button uk-button-danger uk-button-small"><i class="fa fa-times"></i> Remove Image</button>
            </div>
            
            <button class="postButton uk-button uk-button-primary uk-button-small" style="float:right;">Post <i class="fa fa-long-arrow-right"></i></button>
        </div>
        
        <?php

        /* Display posts */
        include_once('/var/www/pn/private/api/posts.class.php');
        $posts = array();
        $friends = User::getFriends($_user->info['id']);
        
        if (count($friends) > 0)
            $posts = DB::query('SELECT * from posts where poster in %ls and active=1 order by timestamp desc limit 11', $friends);

        if (!empty($posts)):
        
        $more = false;
        if (count($posts) > 10) {
            $more = true;
            array_pop($posts);
        }
        ?>
        
        <div class="home-content-container content-card content-item-cntr">
            <?=Posts::showPostItems($posts)?>
        </div>
        
        <?php
        if ($more) {
            echo '
                <div class="load-more-cntr">
                    <button class="loadMoreHome uk-button">Load More Posts</button>
                </div>
            ';
        }
        ?>
        
        <?php else: ?>
        
        <div class="empty-message">
            <p>Posts from the people you are connected with will appear here.</p>
        </div>
        
        <?php endif;?>
    
    </div>
</div>
