<?php
session_start([
    'cookie_lifetime' => 86400,
]);

// statics
define('ROOT', $_SERVER['DOCUMENT_ROOT']);
define('BACK_PATH', '/back');
define('VENDOR_PATH', '/vendor');
/*
define('PUB_PATH', '/theme/pub');
define('CLASSES_PATH', '/back/classes');
define('IMAGES_PATH', PUB_PATH . '/images');
*/
define('DIST_PATH', '/dist');
define('THEME_PUB', '/theme/pub');
define('IMAGES_PATH', DIST_PATH . '/images');

// configs
include_once '__init.php';// enviroment definer


// vendor mailer
require_once ROOT . VENDOR_PATH . '/phpmailer/phpmailer/PHPMailerAutoload.php';
// helpers
include_once ROOT . BACK_PATH . '/Helpers.php';

// models
/*
include_once ROOT . BACK_PATH . '/classes/xxx.php';
include_once ROOT . BACK_PATH . '/classes/xxx.php';
include_once ROOT . BACK_PATH . '/classes/xxx.php';
*/

// app array data
/*
include_once ROOT . BACK_PATH . '/data/appdata.php';
*/

// urls


// check for logout
if(isset($_GET['r']) && $_GET['r'] == 'logout'){
    unset($_SESSION['user']);
    session_destroy();
}


