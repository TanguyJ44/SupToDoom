<?php 

    include 'database.php';

    extract($_GET);

    session_start();

    if ($func == "userData") {
        getUserData();
    } else if ($func == "notif") {
        getUserNotif();
    } else if ($func == "denyShare") {
        denyShare();
    } else if ($func == "allowShare") {
        allowShare();
    } else if ($func == "denyFriend") {
        denyFriend();
    } else if ($func == "allowFriend") {
        allowFriend();
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

    function allowShare() {
        global $notifId;
        global $db;
        global $targetId;

        $stmt = $db->prepare("UPDATE shares SET state=1 WHERE id=:id");
        $stmt->execute(['id' => $targetId]);

        onDeleteNotif($notifId);
    }

    function denyShare() {
        global $notifId;
        global $targetId;
        global $db;

        $stmt = $db->prepare("DELETE FROM shares WHERE id=:id");
        $stmt->execute(['id' => $targetId]);

        onDeleteNotif($notifId);
    }

    function allowFriend() {
        global $notifId;
        global $targetId;
        global $db;

        $stmt = $db->prepare("UPDATE friends SET state=1 WHERE id=:id");
        $stmt->execute(['id' => $targetId]);

        // SELECT hostId WHERE targetId
        $stmt = $db->prepare("SELECT hostId FROM friends WHERE id=:id");
        $stmt->execute(['id' => $targetId]);
        
        $row = $stmt->fetch();

        $stmt = $db->prepare("INSERT INTO friends (hostId, friendId, state) VALUES (:hostId, :friendId, 1)");
        $stmt->execute(array(
            "hostId" => $_SESSION['user-id'], 
            "friendId" => $row["hostId"]
        ));
        
        onDeleteNotif($notifId);
    }

    function denyFriend() {
        global $notifId;
        global $targetId;
        global $db;

        $stmt = $db->prepare("DELETE FROM friends WHERE id=:id");
        $stmt->execute(['id' => $targetId]);

        onDeleteNotif($notifId);
    }

    function disconnectUser() {
        global $db;

        $stmt = $db->prepare("UPDATE users SET isOnline=0 WHERE id=:id");
        $stmt->execute(['id' => $_SESSION['user-id']]);

        session_destroy();
        
        echo 'logout-success';
    }

    // fonction utils

    function onDeleteNotif($id) {
        global $db;

        $stmt = $db->prepare("DELETE FROM notifs WHERE id=:id");
        $stmt->execute(['id' => $id]);
    }
    
?>