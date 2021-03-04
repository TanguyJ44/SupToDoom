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
    } else if ($func == "createNewList") {
        onCreateNewList();
    } else if ($func == "deleteUserList") {
        onDeleteUserList();
    } else if ($func == "listTasks") {
        getListTasks();
    } else if ($func == "createListTask") {
        onCreateListTask();
    } else if ($func == "deleteListTask") {
        onDeleteListTask();
    } else if ($func == "markTaskAsDown") {
        onMarkTaskAsDone();
    } else if ($func == "doneAllTask") {
        onDoneAllTask();
    } else if ($func == "deleteAllDoneTask") {
        onDeleteAllDoneTask();
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
        global $sharePerms;

        $stmt = $db->prepare("SELECT * FROM users WHERE email=:search OR pseudo=:search");
        $stmt->execute(['search' => $friendShare]); 

        if ($stmt->rowCount() == 1) {

            $row = $stmt->fetch();

            $stmt = $db->prepare("SELECT * FROM friends WHERE hostId=:hostId AND friendId=:friendId AND state = 1");
            $stmt->execute(['hostId' => $_SESSION['user-id'], 'friendId' => $row["id"]]); 

            if ($stmt->rowCount() == 1) {

                $stmt = $db->prepare("INSERT INTO shares (userId, listId, perms, state) VALUES (:userId, :listId, :perms, 0)");
                $stmt->execute(array(
                    "userId" => $row["id"], 
                    "listId" => $listId,
                    "perms" => $sharePerms
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

    function onCreateNewList() {
        global $db;
        global $listeName;

        $stmt = $db->prepare("INSERT INTO lists (userId, title) VALUES (:userId, :title)");
        $stmt->execute(array(
            "userId" => $_SESSION['user-id'], 
            "title" => $listeName
        ));
    }

    function onDeleteUserList() {
        global $db;
        global $listId;

        $stmt = $db->prepare("SELECT * FROM lists WHERE id=:id AND userId=:userId");
            $stmt->execute(['id' =>$listId, 'userId' =>  $_SESSION['user-id']]); 

            if ($stmt->rowCount() == 1) {
                $stmt = $db->prepare("DELETE FROM lists WHERE id=:id");
                $stmt->execute(['id' => $listId]);

                $stmt = $db->prepare("DELETE FROM shares WHERE listId=:listId");
                $stmt->execute(['listId' => $listId]);
            } else {
                $stmt = $db->prepare("DELETE FROM shares WHERE userId=:userId AND listId=:listId");
                $stmt->execute(['userId' => $_SESSION['user-id'], 'listId' => $listId]);
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

    function onCreateListTask() {
        global $db;
        global $listId;
        global $taskName;

        if (checkUserIsListOwner($listId) == 1 || checkUserListPerms($listId) == 1) {
            $stmt = $db->prepare("INSERT INTO tasks (listId, content, state) VALUES (:listId, :content, 0)");
            $stmt->execute(array(
                "listId" => $listId, 
                "content" => $taskName
            ));
        }
    }

    function onDeleteListTask() {
        global $db;
        global $listId;
        global $taskId;

        if (checkUserIsListOwner($listId) == 1 || checkUserListPerms($listId) == 1) {
            $stmt = $db->prepare("DELETE FROM tasks WHERE id=:id AND listId=:listId");
            $stmt->execute(['id' => $taskId, 'listId' => $listId]);
        }
    }

    function onMarkTaskAsDone() {
        global $db;
        global $listId;
        global $taskId;

        if (checkUserIsListOwner($listId) == 1 || checkUserListPerms($listId) == 1) {
            $stmt = $db->prepare("SELECT state FROM tasks WHERE id=:id");
            $stmt->execute(['id' => $taskId]);

            $result = $stmt->fetch();

            echo ":: " . $result["state"];

            if ($result["state"] == 0) {
                $stmt = $db->prepare("UPDATE tasks SET state = 1 WHERE id=:id AND listId=:listId");
                $stmt->execute(['id' => $taskId, 'listId' => $listId]);
            } else {
                $stmt = $db->prepare("UPDATE tasks SET state = 0 WHERE id=:id AND listId=:listId");
                $stmt->execute(['id' => $taskId, 'listId' => $listId]);
            }
        }
    }

    function onDoneAllTask() {
        global $db;
        global $listId;

        if (checkUserIsListOwner($listId) == 1 || checkUserListPerms($listId) == 1) {
            $stmt = $db->prepare("UPDATE tasks SET state = 1 WHERE listId=:listId");
            $stmt->execute(['listId' => $listId]);
        }
    }

    function onDeleteAllDoneTask() {
        global $db;
        global $listId;

        if (checkUserIsListOwner($listId) == 1 || checkUserListPerms($listId) == 1) {
            $stmt = $db->prepare("DELETE FROM tasks WHERE listId=:listId AND state = 1");
            $stmt->execute(['listId' => $listId]);
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

    function checkUserIsListOwner($listId) {
        global $db;

        $stmt = $db->prepare("SELECT * FROM lists WHERE id=:id AND userId=:userId");
        $stmt->execute(['id' => $listId, 'userId' => $_SESSION['user-id']]); 

        if ($stmt->rowCount() == 1) {
            return 1;
        } else {
            return 0;
        }
    }

    function checkUserListPerms($listId) {
        global $db;

        $stmt = $db->prepare("SELECT perms FROM shares WHERE userId=:userId AND listId=:id");
        $stmt->execute(['userId' => $_SESSION['user-id'], 'listId' => $listId]); 

        $result = $stmt->fetch();

        return $result["perms"];
    }
    
?>