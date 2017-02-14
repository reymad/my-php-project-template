<?php

class Registro {

    private static $instancia;
    protected $dbh;

    private $campos = [
        'id', 'nombre', 'apellido1', 'apellido1_particulas', 'apellido2', 'apellido2_particulas', 'email', 'telefono', 'nif', 'sexo', 'cp', 'localidad', 'provincia', 'via_tipo',
        'via_nombre', 'via_numero', 'via_resto', 'fecha_registro', 'fecha_mod',
    ];

    private $camposObligatorios = [
        'form_corto' => [
            'email', 'nif'
        ],
        'form_largo' => [
            'nombre', 'apellido1', 'nif', 'email', 'telefono'
        ]
    ];

    private $tableName    = 'xxx';

    // mensajes de error
    public $status   = array();
    const KO = 'KO';
    const OK = 'OK';

    public $isNewRecord = true;

    public $id;

    //establecemos la conexión con la extensión PDO
    private function __construct()
    {
        $this->dbh = Helpers::DBConnect();
    }

    public static function singleton()
    {
        if (!isset(self::$instancia)) {
            $miclase = __CLASS__;
            self::$instancia = new $miclase;
        }
        return self::$instancia;
    }

    public function doRegistro($post){

        foreach($post as $k=>$v){
            $post[$k] = trim($v);
        }

        switch($post['scenario']){
            case 'form_largo':



                break;
            case 'form_corto':
            default:
                    // vemos si existe el user o hay que guardar solo su nombre y nif
                    if( ($user = $this->getUser($post)) !== false ){
                        return $user;
                    }else{// no existe user en registro

                        if( ($user = $this->doSaveRegistro($post)) !== false ){
                            return $user;
                        }else{
                            return false;
                        }
                    }
                break;
        }

    }

    public function getUser($post){

        $nif   = $post['nif'];
        $email = $post['email'];

        $query = "select * from " . $this->tableName . " where nif = :nif and email = :email;";
        $cmd   = $this->dbh->prepare($query);
        $cmd->bindParam(':nif', $nif);
        $cmd->bindParam(':email', $email);
        if(!$cmd->execute()){
            if(IP_ORBITAL) print_r($cmd->errorInfo());
        }else{
            if($cmd->rowCount() > 0){
                return $cmd->fetch(PDO::FETCH_OBJ);
            }else{
                return false;
            }
        };

    }

    public function doSaveRegistro($post){

         if($this->validateData($post)){

             $post['fecha_registro'] = date('Y-m-d H:i:s');
             $post['fecha_mod']      = date('Y-m-d H:i:s');

             $query = "INSERT INTO " . $this->tableName . " ( ";
             $i=0;
             $postsize = count($post);
             foreach($post as $formfieldname=>$formfieldvalue){
                 $i++;
                 if(in_array($formfieldname, $this->campos)){

                    $query .= $formfieldname;
                    if($postsize > $i){
                        $query .= " , ";
                    }else if($postsize == $i){
                        $query .= " ) VALUES ( ";
                    }

                 }
             }
             $i=0;
             $postsize = count($post);
             foreach($post as $formfieldname=>$formfieldvalue){
                 $i++;
                 if(in_array($formfieldname, $this->campos)){

                     $query .= ':'.$formfieldname;
                     if($postsize > $i){
                         $query .= " , ";
                     }else if($postsize == $i){
                         $query .= " );";
                     }

                 }
             }

             $this->dbh->exec('LOCK TABLES ' . $this->tableName . ' WRITE');
             $cmd   = $this->dbh->prepare($query);
             foreach($post as $formfieldname => &$formfieldvalue){// IMPORTANTE POR REFERENCIA!!!!  Si no, usa bindValue instead
                 $i++;
                 if(in_array($formfieldname, $this->campos)){
                    $cmd->bindParam(':'.$formfieldname, $formfieldvalue);
                 }
             }

             if(!$cmd->execute()){
                 if(IP_ORBITAL) print_r($cmd->errorInfo());
             }else{
                 $this->dbh->exec('UNLOCK TABLES');
                 return $this->getUser($post);
             };


         }else{
             return false;
         }

    }

    public function doUpdateRegistro($post){

        if($this->validateData($post)){

            $post['fecha_mod']      = date('Y-m-d H:i:s');

            $query = "UPDATE " . $this->tableName . " SET ";
            $i=0;
            $postsize = count($post);

            foreach($post as $formfieldname=>$formfieldvalue){
                $i++;
                if(in_array($formfieldname, $this->campos)){
                    $query .= $formfieldname . ' = ' . ':' . $formfieldname;
                    if($postsize > $i){
                        $query .= " , ";
                    }else if($postsize == $i){
                        $query .= " WHERE (id = " . $this->id ." ) ";
                    }
                }
            }

            $this->dbh->exec('LOCK TABLES ' . $this->tableName . ' WRITE');
            $cmd   = $this->dbh->prepare($query);
            foreach($post as $formfieldname => &$formfieldvalue){// IMPORTANTE POR REFERENCIA!!!!  Si no, usa bindValue instead
                $i++;
                if(in_array($formfieldname, $this->campos)){
                    $cmd->bindParam(':'.$formfieldname, $formfieldvalue);
                }
            }

            if(!$cmd->execute()){
                if(IP_ORBITAL) print_r($cmd->errorInfo());
            }else{
                $this->dbh->exec('UNLOCK TABLES');
                return true;
            };


        }else{
            return false;
        }

    }

    public function validateData($data){

        $campos_obligatorios_escenario = $this->camposObligatorios[$data['scenario']];

        foreach($data as $key => $fields)
        {
            if(in_array($key, $campos_obligatorios_escenario ) && trim($fields) == '') {
                $this->status['status'] = self::KO;
                $this->status['msg'] = 'Hay campos obligatorios sin cumplimentar.';
                return false;
            }

            if($key == 'nif' && !Helpers::esNif($fields)) {
                $this->status['status'] = self::KO;
                $this->status['msg'] = 'Dni, nif o cif es incorrecto.';
                return false;
            }

            if($key == 'email' && !filter_var($fields, FILTER_VALIDATE_EMAIL)) {
                $this->status['status'] = self::KO;
                $this->status['msg'] = 'El E-mail introducido no es v&aacute;lido.';
                return false;
            }

            if($key!='email') $data[$key] = ($fields=='' || $fields==NULL) ? NULL : mb_strtoupper($fields);
        }

        return $data;

    }


}// fin class

?>
