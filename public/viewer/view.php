<?php

if (!empty($_POST['specific'])) {
	// AJAX Info
	include_once(__DIR__.'/../../private/api/init.php');
	$specific = $_POST['specific'];
} else {
	global $_page;
	$specific = $_page[1];
}

// TODO: show error message if variables are bad

include_once("/var/www/pn/private/api/posts.class.php");
$post = Posts::createFromPID($specific);
if ($post === false)
	exit("Post does not exist. Post PID: $specific");

$poster_name = $post->posterName();
$poster_username = $post->posterUsername();

$specific_data = "data-page-uniq=$specific";

?>

<div class="content_page view_page" data-link="/view/<?=$specific?>" <?=$specific_data?> >
	
	<?php if (!empty($post->info["media_file"])): ?>
	<div class="media-container">
		<img src="/img/post/<?=$post->info['media_file']?>">
	</div>
	<?php endif; ?>

	<div class="content_wrapper">
		<div class="content-card content-card-first">
			<div class="post-text">
				<p><?=$post->info['text']?></p>
			</div>
			<div class="post-info">
				<span class="post-by">By <a href="/profile/<?=$poster_username?>"><?=$poster_name?></a></span>
				<span class="post-time-cntr"><i cass="fa fa-clock-o"></i> <span data-timestamp="<?=$post->info['timestamp']?>"></span></span>
			</div>
		</div>
		<div class="content-card content-card-last">
			<div>42 Comments</div>
		</div>
	</div>
</div>
