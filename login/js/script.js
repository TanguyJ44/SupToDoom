// Vérification des champs
function checkLabel(labeID, input) {
    let label = document.getElementById(labeID);
    input = input;

    if (input.value != '') {
        if (!label.classList.contains('label-active'))
            label.classList.add('label-active');
    } else {
        label.classList.remove('label-active');
    }
}

// Vérifier si l'utilisateur est connecté
function onCheckConnection() {
    $.ajax({
        url : 'php/load.php',
        type : 'GET',
        dataType : 'html',
        success : function(data_txt, statut){
            if (data_txt == "connected") {
                document.location.href="../index.html";
            }
        },
        error : function(result, statut, erreur){
            alert("Error !");
            console.log(erreur);
        }
    });
}

// Connexion de l'utilisateur
function onLogin() {
    $(".login-error-msg").css("display", "none");
    $.ajax({
        url : 'php/login.php',
        type : 'GET',
        data : 'email=' + $("#input-1").val() 
            + '&password=' + $("#input-2").val(),
        dataType : 'html',
        success : function(data_txt, statut){
            if (data_txt == "success") {
                document.location.href="../index.html";
            } else {
                $(".login-error-msg").css("display", "block");
            }
        },
        error : function(result, statut, erreur){
            alert("Error !");
            console.log(erreur);
        }
    });
}

// Enregistrer un nouvel utilisateur
function onRegister() {
    $(".register-error-msg").css("display", "none");
    $.ajax({
        url : 'php/register.php',
        type : 'GET',
        data : 'pseudo=' + $("#input-3").val() 
            + '&email=' + $("#input-4").val()
            + '&password=' + $("#input-5").val()
            + '&confirm_password=' + $("#input-6").val(),
        dataType : 'html',
        success : function(data_txt, statut){
            if (data_txt == "success") {
                document.location.href="../index.html";
            } else if (data_txt == "error-pseudo") {
                $(".register-error-msg").text('Le pseudo indiqué est déjà utilisé !');
                $(".register-error-msg").css("display", "block");
            } else if (data_txt == "error-email") {
                $(".register-error-msg").text('L\'email indiqué est déjà utilisé !');
                $(".register-error-msg").css("display", "block");
            } else if (data_txt == "error-password") {
                $(".register-error-msg").text('Les deux mots de passe ne correspondent pas !');
                $(".register-error-msg").css("display", "block");
            }
        },
        error : function(result, statut, erreur){
            alert("Error !");
            console.log(erreur);
        }
    });
}