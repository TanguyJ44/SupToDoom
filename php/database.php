<?php 

    try {
        // Initialiser la connexion à la BDD
        $db = new PDO("mysql:host=__HOST__;dbname=__BDD__", "__USER__", "__MDP__", array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

        // Définir les EXCEPTIONS
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    } catch(PDOException $e) {
        echo "Erreur : " . $e->getMessage();
    }

?>