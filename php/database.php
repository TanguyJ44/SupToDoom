<?php 

    try {

        $db = new PDO("mysql:host=localhost;dbname=suptodoom", "root", "S9wg8NJp$-59G?a",array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    } catch(PDOException $e) {

        echo "Erreur : " . $e->getMessage();
        
    }

?>