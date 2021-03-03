<?php 

    include 'database.php';

    extract($_GET);

    session_start();

    if ($func == "userFriends") {
        getUserFriends();
    } else if ($func == "userSearchFriends") {
        searchUserFriend();
    }

    function getUserFriends() {
        global $db;

        $stmt = $db->prepare("SELECT friends.*, users.pseudo, users.isOnline 
                                FROM friends INNER JOIN users ON friends.friendId = users.id WHERE hostId=:id");
        $stmt->execute(['id' => $_SESSION['user-id']]); 

        $datas = array();
         
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $datas[] = $row;
        }
             
        echo json_encode($datas);
    }

    function searchUserFriend() {
        global $db;
        global $friendSearch;

        $stmt = $db->prepare("SELECT * FROM users WHERE email=:search OR pseudo=:search");
        $stmt->execute(['search' => $friendSearch]); 

        if ($stmt->rowCount() == 1) {

            $row = $stmt->fetch();

            $stmt = $db->prepare("INSERT INTO friends (hostId, friendId, state) VALUES (:hostId, :friendId, 0)");
            $stmt->execute(array(
                "hostId" => $_SESSION['user-id'], 
                "friendId" => $row["id"]
            ));

            $stmt = $db->query("SELECT id FROM friends ORDER BY id DESC LIMIT 1");

            $maxId = $stmt->fetch();

            $stmt = $db->prepare("INSERT INTO notifs (userId, type, targetId, content) VALUES (:userId, :type, :targetId, :content)");
            $stmt->execute(array(
                "userId" => $row["id"], 
                "type" => "friend",
                "targetId" => $maxId["id"],
                "content" => getUserPseudo($_SESSION['user-id']) . " souhaite vous ajouter à sa liste d'amis"
            ));

            echo "success";
        } else {
            echo "error";
        }   
        
    }

    // function utils

    function getUserPseudo($userId) {
        global $db;

        $stmt = $db->prepare("SELECT pseudo FROM users WHERE id=:id");
        $stmt->execute(['id' => $userId]); 

        $result = $stmt->fetch();

        return $result["pseudo"];
    }
    
?>