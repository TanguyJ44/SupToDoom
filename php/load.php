<?php 

    session_start();

    // Vérifier si l'utilisateur est connecté
    if (isset($_SESSION['user-id'])) {
        echo 'connected';
    } else {
        echo 'disconnected';
    }
    
?>