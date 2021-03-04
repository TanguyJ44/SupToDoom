<?php 

    include '../../php/database.php';

    extract($_GET);

    session_start();

    $stmt = $db->prepare("SELECT id FROM users WHERE pseudo=:pseudo");
    $stmt->execute(['pseudo' => $pseudo]); 
    $dataPseudo = $stmt->fetch(PDO::FETCH_BOTH);

    $stmt = $db->prepare("SELECT id FROM users WHERE email=:email");
    $stmt->execute(['email' => $email]); 
    $dataEmail = $stmt->fetch(PDO::FETCH_BOTH);

    if (!isset($dataPseudo[0])) {
        if (!isset($dataEmail[0])) {
            if (strcmp($password, $confirm_password) == 0) {
                
                $stmt = $db->prepare("INSERT INTO users (email, passwd, pseudo, isOnline) VALUES (:email, :passwd, :pseudo, 1)");
                $stmt->execute(array(
                        "email" => $email, 
                        "passwd" => hash('sha512', $password),
                        "pseudo" => $pseudo
                        ));

                $_SESSION['user-id'] = getNewUserId($email);

                echo 'success';
            } else {
                echo 'error-password';
            }
        } else {
            echo 'error-email';
        }
    } else {
        echo 'error-pseudo';
    }


    function getNewUserId($userEmail) {
        global $db;

        $stmt = $db->prepare("SELECT id FROM users WHERE email=:email");
        $stmt->execute(['email' => $userEmail]); 
        $data = $stmt->fetch(PDO::FETCH_BOTH);

        return $data['id'];
    }
    
?>