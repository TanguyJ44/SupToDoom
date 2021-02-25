<?php 

    include 'database.php';

    extract($_GET);

    session_start();

    if ($func == "userData") {
        getUserData();
    } else if ($func == "notif") {
        getUserNotif();
    } else if ($func == "disconnect") {
        disconnectUser();
    }

    function getUserData() {
        global $db;

        $stmt = $db->prepare("SELECT * FROM users WHERE id=:id");
        $stmt->execute(['id' => $_SESSION['user-id']]); 
        $data = $stmt->fetch(PDO::FETCH_BOTH);

        echo $data['pseudo'];
    }

    function getUserNotif() {
        global $db;

        $stmt = $db->prepare("SELECT * FROM notifs WHERE userId=:id ORDER BY id DESC");
        $stmt->execute(['id' => $_SESSION['user-id']]); 

        $datas = array();
         
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $datas[] = $row;
        }
             
        echo json_encode($datas);
    }

    function disconnectUser() {

        session_destroy();
        
        echo 'logout-success';
    }
    
?>