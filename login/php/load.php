<?php 

    session_start();

    if (isset($_SESSION['user-id'])) {
        echo 'connected';
    } else {
        echo 'disconnected';
    }
    
?>