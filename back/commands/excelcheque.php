<?php
/**
 * Created by PhpStorm.
 * User: jrey
 * Date: 03/10/2016
 * Time: 16:34
 */


define('ROOT', $_SERVER['DOCUMENT_ROOT']);
define('BACK_PATH', '/back');
define('VENDOR_PATH', '/vendor');
define('PUB_PATH', '/theme/pub');
define('CLASSES_PATH', '/back/classes');
define('IMAGES_PATH', PUB_PATH . '/images');


require_once dirname(__FILE__) . '/../back/config/prod.php';

$host      = SERVER;
$db        = DATABASE;
$usuario   = USER;
$password  = PASS;

$pdo = new PDO("mysql:host=$host; dbname=$db", $usuario, $password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$query = "select * from xxx where xxx=1 and xxx is not null;";
$cmd   = $pdo->prepare($query);
$datos = null;

define('FILE_PATH', dirname(__FILE__) . '/../../data/');
define('FILE_NAME', 'extraccion_');
define('FILE_EXT',  '.xls');

if(!$cmd->execute()){
    print_r($cmd->errorInfo());
}else{
    if($cmd->rowCount() > 0){
        $datos = $cmd->fetchAll(PDO::FETCH_OBJ);
    }else{
        die("No hay datos");
    }
};

/** Error reporting */
error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);
date_default_timezone_set('Europe/Madrid');

// define('EOL',(PHP_SAPI == 'cli') ? PHP_EOL : '<br />');

/** Include PHPExcel */
require_once dirname(__FILE__) . '/../vendor/phpexcel/PHPExcel.php';

$objPHPExcel = new PHPExcel();

$columnas = [
    'field1' => 'xxx',
    'field2' => 'xxx',
];

$datosExcel = array();
foreach ($datos as $usuario) {
    $item = array();
    foreach ($columnas as $campo => $alias) {
        $item[] = $usuario->$campo;
    }
    $datosExcel[] = $item;
}


$n = 0;
$f = 1;
foreach ($columnas as $key=>$nombre) {
    $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($n, $f, $nombre);
    $objPHPExcel->getActiveSheet()->getStyleByColumnAndRow($n, $f)->getFont()->setBold(true);
    // $objPHPExcel->getActiveSheet()->getStyle($key)->getAlignment()->setWrapText(true);
    $n++;
}

$f++;
foreach ($datosExcel as $cheque) {

    foreach ($cheque as $key => $value) {
        $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($key, $f, $value);
    }
    $f++;
}




$objPHPExcel->getActiveSheet()->setTitle('Cheque - estrenarenault.es');
// Set active sheet index to the first sheet, so Excel opens this as the first sheet
$objPHPExcel->setActiveSheetIndex(0);
// Save Excel 2007 file
// Use PCLZip rather than ZipArchive to create the Excel2007 OfficeOpenXML file
// PHPExcel_Settings::setZipClass(PHPExcel_Settings::PCLZIP);
$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');

$file_full_name = FILE_NAME . '_' . date('Y-m-d') . FILE_EXT;
if($objWriter->save( FILE_PATH . $file_full_name ) !== false){
    echo chr(10) . '-> Fichero "' . $file_full_name . '" generado correctamente.';
}else{
    echo '--> ERROR';
}

?>
