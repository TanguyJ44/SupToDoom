<?php 

    include 'database.php';

    extract($_GET);

    session_start();

    if ($func == "userList") {
        getUserLists();
    } else if ($func == "userShareList") {
        getUserShareLists();
    } else if ($func == "newShareList") {
        onShareList();
    } else if ($func == "listTasks") {
        getListTasks();
    }

    function getUserLists() {
        global $db;

        $stmt = $db->prepare("SELECT * FROM lists WHERE userId=:id ORDER BY id DESC");
        $stmt->execute(['id' => $_SESSION['user-id']]); 

        $datas = array();
         
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $datas[] = $row;
        }
             
        echo json_encode($datas);
    }

    function getUserShareLists() {
        global $db;

        $stmt = $db->prepare("SELECT shares.*, lists.* 
                                FROM shares INNER JOIN lists 
                                ON shares.listId = lists.id 
                                WHERE shares.userId=:id AND shares.state = 1");
        $stmt->execute(['id' => $_SESSION['user-id']]); 

        $datas = array();
         
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $datas[] = $row;
        }
             
        echo json_encode($datas);
    }

    function onShareList() {
        global $db;
        global $friendShare;
        global $listId;

        $stmt = $db->prepare("SELECT * FROM users WHERE email=:search OR pseudo=:search");
        $stmt->execute(['search' => $friendShare]); 

        if ($stmt->rowCount() == 1) {

            $row = $stmt->fetch();

            $stmt = $db->prepare("SELECT * FROM friends WHERE hostId=:hostId AND friendId=:friendId AND state = 1");
            $stmt->execute(['hostId' => $_SESSION['user-id'], 'friendId' => $row["id"]]); 

            if ($stmt->rowCount() == 1) {

                $stmt = $db->prepare("INSERT INTO shares (userId, listId, perms, state) VALUES (:userId, :listId, 0, 0)");
                $stmt->execute(array(
                    "userId" => $row["id"], 
                    "listId" => $listId
                ));

                $stmt = $db->query("SELECT id FROM shares ORDER BY id DESC LIMIT 1");

                $maxId = $stmt->fetch();

                $stmt = $db->prepare("INSERT INTO notifs (userId, type, targetId, content) VALUES (:userId, :type, :targetId, :content)");
                $stmt->execute(array(
                    "userId" => $row["id"], 
                    "type" => "share",
                    "targetId" => $maxId["id"],
                    "content" => getUserPseudo($_SESSION['user-id']) . " souhaite vous partager une liste"
                ));

                echo "success";
            } else {
                echo "error";
            }
        } else {
            echo "error";
        }
    }

    function getListTasks() {
        global $db;
        global $listId;

        $stmt = $db->prepare("SELECT * FROM tasks WHERE listId=:id ORDER BY id DESC");
        $stmt->execute(['id' => $listId]); 

        $datas = array();
         
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $datas[] = $row;
        }
             
        echo json_encode($datas);
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