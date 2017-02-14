<?php

/**
 * Created by PhpStorm.
 * User: jrey
 * Date: 19/09/2016
 * Time: 18:10
 */
include $_SERVER['DOCUMENT_ROOT'] . '/__settings.php';

global $app_data;

$postdata = null;

$actions = array('Login','Registro');

if( isset($_GET['r']) && in_array($_GET['r'], $actions) ){

    global $postdata;

    $accion   = 'action'.$_GET['r'];
    if(isset($_POST)){
        $postdata = $_POST;
    }
    call_user_func($accion);

}else{
    trigger_error('ERROR - Controller requires a valid action');
}


/* funciones */
function actionLogin(){

    global $postdata;

    $registro = Registro::singleton();

    if( ($user = $registro->doRegistro($postdata)) !== false){
        $_SESSION['user'] = $user;
        $status['status']   = 'OK';
        $status['redirect'] = '/registro.php';
    }else{
        $status = $registro->status;
    }

    print json_encode($status);

}

function actionRegistro(){

    global $postdata;
    global $app_data;

    $status = [];

    $registro = Registro::singleton();
    $user     = $registro->getUser($postdata);

    /* logic here */

    print json_encode($status);

}// actionRegistro




?>
