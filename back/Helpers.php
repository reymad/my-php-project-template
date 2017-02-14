<?php
/**
 * Created by PhpStorm.
 * User: jrey
 * Date: 19/09/2016
 * Time: 18:29
 */

class Helpers
{

    const EMAIL_FROM = 'noresponder@template.es';
    const EMAIL_FROM_NAME = 'Jesús Rey';

    public static function DBConnect(){

        require_once 'config/'.ENV.'.php';

        $host      = SERVER;
        $db        = DATABASE;
        $usuario   = USER;
        $password  = PASS;
        $pdo = new PDO("mysql:host=$host; dbname=$db", $usuario, $password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        return $pdo;
    }

    public static function isUserLogged(){

        if(isset($_SESSION['user']) && is_object($_SESSION['user'])){
            return true;
        }else{
            return false;
        }

    }

    public static function getUser(){

        if(self::isUserLogged()){
            return $_SESSION['user'];
        }else{
            return false;
        }

    }


    public static function sendMail($modelo, $tipo_envio){


        $mail = new PHPMailer(true);

        if(ENV=='dev'){
            $host = 'localhost';
        }else if(ENV=='testing'){
            $host = 'xx.xx.x.x';
        }else{
            // prod host
            $host = 'localhost';
        }

        $mail->Host = $host;
        $mail->IsSMTP(true);
        $mail->SMTPAuth = false;

        $mail->SMTPDebug = 0;//(ENV=='dev') ? 3 : 0;

        $mail->From = self::EMAIL_FROM;;
        $mail->FromName  = self::EMAIL_FROM_NAME;

        // below we want to set the email address we will be sending our email to.
        $mail->AddAddress($modelo->email);
        $mail->AddBCC('jrey@proximity.es');

        // set word wrap to 50 characters
        $mail->WordWrap = 100;
        // set email format to HTML
        $mail->IsHTML(true);

        switch($tipo_envio){
            case 'mail_cheque':
                $mail->Subject = "";
                break;
            case 'mail_info':
                $mail->Subject = "";
                break;
        }

        // definimos message en este partial
        $message = '';
        include(ROOT . "/mail/{$tipo_envio}.php");// creates $message
        // $message = "tipo de email es: " . $tipo_envio;


        // echo ROOT . "/mail/{$tipo_envio}.php";

        // $message is the user's message they typed in
        // on our contact us page. We set this variable at
        // the top of this page with:
        // $message = $_REQUEST['message'] ;
        $mail->Body    = $message;
        /*$mail->AltBody = 'test';*/

        $mail->CharSet = 'UTF-8';

        // $mail->AddAttachment( $_SERVER['DOCUMENT_ROOT'] . '/bbdd/' . $filesaved );

        /* antes de mandar email voy a guardar una copia*/
        $mail->PreSend();
        $message = $mail->GetSentMIMEMessage();
        $emlfile =  ROOT . BACK_PATH . "/runtime/".ENV."/mail/{$modelo->nif}_{$modelo->email}_{$tipo_envio}_".date('YmsHis').".eml";
        $handle=fopen( $emlfile,'w');
        fwrite($handle, $message);
        fclose($handle);

        if(ENV=='prod' || ENV=='dev'){
            try{
                return $mail->Send();
                // echo 'mail sent';
            } catch(Exception $e){
                //Something went bad
                echo "ERROR - " . $mail->ErrorInfo;
            }
        }else{
            return true;
        }
        // echo "Message has been sent";



    }

    public static function esNif($cif) {

        $cif = strtoupper($cif);
        for ($i = 0; $i < 9; $i++) $num[$i] = substr($cif, $i, 1);

        // si no tiene un formato valido devuelve error
        if (!preg_match('/((^[A-Z]{1}[0-9]{7}[A-Z0-9]{1}$|^[T]{1}[A-Z0-9]{8}$)|^[0-9]{8}[A-Z]{1}$)/', $cif)) {
            return false;
        }

        // comprobacion de NIFs estandar
        if (preg_match('/(^[0-9]{8}[A-Z]{1}$)/', $cif)) {
            if ($num[8] == substr('TRWAGMYFPDXBNJZSQVHLCKE', substr($cif, 0, 8) % 23, 1)) {
                return 'nif';
            } else {
                return false;
            }
        }

        // algoritmo para comprobacion de codigos tipo CIF
        $suma = $num[2] + $num[4] + $num[6];
        for ($i = 1; $i < 8; $i += 2) {
            $suma += substr((2 * $num[$i]), 0, 1) + substr((2 * $num[$i]), 1, 1);
        }
        $n = 10 - substr($suma, strlen($suma) - 1, 1);

        // comprobacion de NIFs especiales (se calculan como CIFs o como NIFs)
        if (preg_match('/^[KLM]{1}/', $cif)) {
            if ($num[8] == chr(64 + $n) || $num[8] == substr('TRWAGMYFPDXBNJZSQVHLCKE', substr($cif, 1, 8) % 23, 1)) {
                return 'nif';
            } else {
                return false;
            }
        }

        // comprobacion de CIFs
        if (preg_match('/^[ABCDEFGHJNPQRSUVW]{1}/', $cif)) {
            if ($num[8] == chr(64 + $n) || $num[8] == substr($n, strlen($n) - 1, 1)) {
                return 'cif';
            } else {
                return false;
            }
        }

        // comprobacion de NIEs
        if (preg_match('/^[XYZ]{1}/', $cif)) {
            if ($num[8] == substr('TRWAGMYFPDXBNJZSQVHLCKE', substr(str_replace(array('X', 'Y', 'Z'), array('0', '1', '2'), $cif), 0, 8) % 23, 1)) {
                return 'nie';
            } else {
                return false;
            }
        }

        // si todavia no se ha verificado devuelve error
        return false;

    }

}