<?php
/**
 * Created by PhpStorm.
 * User: jrey
 * Date: 19/09/2016
 * Time: 18:14
 * aabbcc
 */
date_default_timezone_set('Europe/Madrid');

$entornoOptions = [
    'dev'     => [
        'hosts' => [
            'dev.dev',
        ],
        'ips'   => [
            '',// jes�s
        ],
        'env'   => 'dev',
    ],
    'testing'     => [
        'hosts' => [
            'test.es'
        ],
        'ips'   => [
            '',// jes�s
        ],
        'env'   => 'testing',
    ],
    'production'  => [
        'hosts' => [
            'xxx.es',
        ],
        'ips'   => [
            '',

        ],
        'env'   => 'prod',
    ],
];

$ip = $_SERVER['REMOTE_ADDR'];

if( in_array($ip,$entornoOptions['dev']['ips']) || in_array($ip,$entornoOptions['production']['ips']) ) {

    define('IP', true);
    ini_set('display_errors', '1');
    error_reporting(E_ALL);

} else {
    define('IP', false);
}

if (in_array($_SERVER['SERVER_NAME'], $entornoOptions['dev']['hosts'])) {
    defined('ENV') or define('ENV', 'dev');
    defined('ENV_DEV') or define('ENV_DEV', true);
    @define('BASEURL','');
}
else if (in_array($_SERVER['SERVER_NAME'], $entornoOptions['testing']['hosts'])) {
    defined('ENV') or define('ENV', 'testing');
    defined('ENV_TESTING') or define('ENV_TESTING', true);
    @define('BASEURL','');
}
else  {// (in_array($_SERVER['SERVER_NAME'], $entornoOptions['production']['hosts']))
    defined('ENV') or define('ENV', 'prod');
    defined('ENV_PROD') or define('ENV_PROD', true);
    @define('BASEURL','');
}

