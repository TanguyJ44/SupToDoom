function menu() {
    document.getElementsByClassName('dropdown')[0].classList.toggle('down');
    document.getElementsByClassName('arrow')[0].classList.toggle('gone');
    if (document.getElementsByClassName('dropdown')[0].classList.contains('down')) {
        setTimeout(function() {
            document.getElementsByClassName('dropdown')[0].style.overflow = 'visible'
        }, 500)
    } else {
        document.getElementsByClassName('dropdown')[0].style.overflow = 'hidden'
    }
}

function dispfriends() {
    if (document.getElementById("clickfriend").display == "true") {
        document.getElementById("clickfriend").style.display = "block";
    } else {
        getUserFriends();

        document.getElementById("clickfriend").style.display = "block";
        document.getElementById("clickbox").style.display = "none";
        document.getElementById("shareL").style.display = "none";
    }
}

function dispbox() {
    if (document.getElementById("clickbox").display == "true") {
        document.getElementById("clickbox").style.display = "none";
    } else {
        getUserNotifs();

        document.getElementById("clickbox").style.display = "block";
        document.getElementById("clickfriend").style.display = "none";
        document.getElementById("shareL").style.display = "none";
    }
}

function dispshare(listId) {
    if (document.getElementById("shareL").display == "true") {
        document.getElementById("shareL").style.display = "none";
    } else {
        document.getElementById("shareL").style.display = "block";
        document.getElementById("clickfriend").style.display = "none";
        document.getElementById("clickbox").style.display = "none";

        $(".shareList").attr('id', listId);
    }
}

function hideShare() {
    document.getElementById("shareL").style.display = "none";
}


var countId = 1;

function createTask() {
    var corps = document.getElementById("insert");
    corps.innerHTML = corps.innerHTML + "<div id='deleteTask" + countId + "'><div class='row taskline box' id='taskline'><div class='col-md-10'><input id='task" + countId + "' class='taskname' value='task à faire1' disabled></div><div class='col-md-1'><i class='fas fa-check check' onclick='crosstask(&#x0027;task" + countId + "&#x0027;);'></i></div><div class='col-md-1'><i class='fas fa-trash-alt delete' onclick='deleteTask(&#x0027;deleteTask" + countId + "&#x0027);'></i></div></div></div>";
    countId++;
}

var countIdList = 1;

function createList() {
    var corpsL = document.getElementById("insertList");
    corpsL.innerHTML = corpsL.innerHTML + "<div id='deleteList" + countIdList + "'><div class='row taskline box' id='taskline'><div class='col-md-8'><input id='list" + countIdList + "' class='taskname' value='Listename' disabled></div><div class='col-md-2'><i class='fas fa-share share' onclick='dispshare();'></i></div><div class='col-md-2'><i class='fas fa-trash-alt delete' onclick='deleteList(&#x0027;deleteList" + countIdList + "&#x0027);'></i></div></div></div>";
    countIdList++;
}

var countIdMsg = 1;

function createMsg() {
    var corps = document.getElementById("insertmsg");
    corps.innerHTML = corps.innerHTML + "<div id='deletemsg" + countIdMsg + "'><div class='row taskline box' id='taskline'><div class='col-md-8'><p id='msg" + countIdMsg + "' class='taskname'>msgtext</p></div><div class='col-md-2'><i class='fas fa-check checkmsg' onclick='acceptmsg(&#x0027;msg" + countId + "&#x0027;);'></i></div><div class='col-md-2'><i class='fas fa-trash-alt deletemsg' onclick='deletemsg(&#x0027;deletemsg" + countIdMsg + "&#x0027);'></i></div></div></div>";
    countIdMsg++;
}


function createFriend() {
    var corpsF = document.getElementById("insertFriend");
    corpsF.innerHTML = corpsF.innerHTML + "<div class='row'><div class='row col-md-10'><input placeholder='Pseudo / Email de votre ami' class='namefriend' size=29></div><div class='col-md-2'><i class='fas fa-search search' onclick='onSearchFriend();'></i></div></div>"
}


function crosstask(id) {
    if (document.getElementById(id).style.textDecoration == "none") {
        document.getElementById(id).style.textDecoration = "line-through";
    } else {
        document.getElementById(id).style.textDecoration = "none";
    }
}

function deleteTask(id) {
    document.getElementById(id).remove();
}

function deletemsg(id) {
    document.getElementById(id).remove();
}

function acceptmsg(id) {
    document.getElementById(id).fadeOut();
}

function deleteList(id) {
    document.getElementById(id).remove();
}


function onCheckConnection() {
    $.ajax({
        url : 'php/load.php',
        type : 'GET',
        dataType : 'html',
        success : function(data_txt, statut){
            if (data_txt == "disconnected") {
                document.location.href="login/index.html";
            } else {
                getUserData();
                getUserLists();
            }
        },
        error : function(result, statut, erreur){
            alert("Error !");
            console.log(erreur);
        }
    });
}

function disconnect() {
    $.ajax({
        url : 'php/user.php',
        type : 'GET',
        data : 'func=disconnect',
        dataType : 'html',
        success : function(data_txt, statut){
            if (data_txt == "logout-success") {
                document.location.href="login/index.html";
            }
        },
        error : function(result, statut, erreur){
            alert("Error !");
            console.log(erreur);
        }
    });
}

function getUserData() {
    $.ajax({
        url : 'php/user.php',
        type : 'GET',
        data : 'func=userData',
        dataType : 'html',
        success : function(data_txt, statut){
            $("#title-name").text(data_txt);
        },
        error : function(result, statut, erreur){
            alert("Error !");
            console.log(erreur);
        }
    });
}

function getUserNotifs() {
    $.ajax({
        url : 'php/user.php',
        type : 'GET',
        data : 'func=notif',
        dataType : 'html',
        success : function(data_txt, statut) {
            $("#insertmsg").empty();
            $.each(JSON.parse(data_txt), function(i, obj) {
                if (obj.type == "friend") {
                    $("#insertmsg").append("<div id='notif" + obj.id + "'><div class='row taskline box' id='taskline'><div class='col-md-8'><p id='msg' class='taskname'>" + obj.content + "</p></div><div class='col-md-2'><i class='fas fa-check checkmsg' onclick='setActionNotif(1, " + obj.id + ", " + obj.targetId + ", 1);'></i></div><div class='col-md-2'><i class='fas fa-times-circle deletemsg' onclick='setActionNotif(1, " + obj.id + ", " + obj.targetId + ", 0);'></i></div></div></div>");
                } else {
                    $("#insertmsg").append("<div id='notif" + obj.id + "'><div class='row taskline box' id='taskline'><div class='col-md-8'><p id='msg' class='taskname'>" + obj.content + "</p></div><div class='col-md-2'><i class='fas fa-check checkmsg' onclick='setActionNotif(0, " + obj.id + ", " + obj.targetId + ", 1);'></i></div><div class='col-md-2'><i class='fas fa-times-circle deletemsg' onclick='setActionNotif(0, " + obj.id + ", " + obj.targetId + ", 0);'></i></div></div></div>");
                }
           });
        },
        error : function(result, statut, erreur){
            alert("Error !");
            console.log(erreur);
        }
    });
}

// type : 0 = share & 1 = friend
function setActionNotif(type, id, targetId, action) {
    if (type == 0) {
        if (action == 0) {
            $.ajax({
                url : 'php/user.php',
                type : 'GET',
                data : 'func=denyShare&notifId=' + id + '&targetId=' + targetId,
                dataType : 'html',
                success : function(data_txt, statut) {
                    getUserNotifs();
                },
                error : function(result, statut, erreur){
                    alert("Error !");
                    console.log(erreur);
                }
            });
        } else {
            $.ajax({
                url : 'php/user.php',
                type : 'GET',
                data : 'func=allowShare&notifId=' + id + '&targetId=' + targetId,
                dataType : 'html',
                success : function(data_txt, statut) {
                    getUserNotifs();
                    getUserLists();
                },
                error : function(result, statut, erreur){
                    alert("Error !");
                    console.log(erreur);
                }
            });
        }
    } else {
        if (action == 0) {
            $.ajax({
                url : 'php/user.php',
                type : 'GET',
                data : 'func=denyFriend&notifId=' + id + '&targetId=' + targetId,
                dataType : 'html',
                success : function(data_txt, statut) {
                    getUserNotifs();
                },
                error : function(result, statut, erreur){
                    alert("Error !");
                    console.log(erreur);
                }
            });
        } else {
            $.ajax({
                url : 'php/user.php',
                type : 'GET',
                data : 'func=allowFriend&notifId=' + id + '&targetId=' + targetId,
                dataType : 'html',
                success : function(data_txt, statut) {
                    getUserNotifs();
                },
                error : function(result, statut, erreur){
                    alert("Error !");
                    console.log(erreur);
                }
            });
        }
    }
}

function getUserFriends() {
    $.ajax({
        url : 'php/friends.php',
        type : 'GET',
        data : 'func=userFriends',
        dataType : 'html',
        success : function(data_txt, statut) {
            $("#insertFriend").empty();
            $.each(JSON.parse(data_txt), function(i, obj) {
                if (obj.state == 0) {
                    $("#insertFriend").append("<div class='row'><div class='col-md-8'><h4 class='namefriend' style='color: grey;font-style: italic;'>" + obj.pseudo + " (En attente)</h4></div></div>");
                } else {
                    if (obj.isOnline == 0) {
                        $("#insertFriend").append("<div class='row'><div class='col-md-8'><h4 class='namefriend'>🔴 " + obj.pseudo + "</h4></div></div>");
                    } else {
                        $("#insertFriend").append("<div class='row'><div class='col-md-8'><h4 class='namefriend'>🟢 " + obj.pseudo + "</h4></div></div>");
                    }
                }
           });
        },
        error : function(result, statut, erreur){
            alert("Error !");
            console.log(erreur);
        }
    });
}

function onSearchFriend() {
    $(".namefriend").prop('disabled', true);
    $("#noUserFound").empty();
    $.ajax({
        url : 'php/friends.php',
        type : 'GET',
        data : 'func=userSearchFriends&friendSearch=' + $(".namefriend").val(),
        dataType : 'html',
        success : function(data_txt, statut) {
            console.log(data_txt);
            if (data_txt == "success") {
                getUserFriends();
            } else {
                $(".namefriend").prop('disabled', false);
                $("#insertFriend").append("<h4 id='noUserFound' style='color: red;'>Aucun utilisateur trouvé !</h4>");
            }
        },
        error : function(result, statut, erreur){
            alert("Error !");
            console.log(erreur);
        }
    });
}

function getUserLists() {
    $.ajax({
        url : 'php/lists.php',
        type : 'GET',
        data : 'func=userList',
        dataType : 'html',
        success : function(data_txt, statut) {
            $("#insertList").empty();
            $.each(JSON.parse(data_txt), function(i, obj) {
                $("#insertList").append("<div id='" + obj.id + "' onclick='getListTasks(" + obj.id + ");'><div class='row taskline box' id='taskline'><div class='col-md-8'><h4 class='taskname'>" + obj.title + "</h4></div><div class='col-md-2'><i class='fas fa-share share' onclick='dispshare(" + obj.id + ");'></i></div><div class='col-md-2'><i class='fas fa-trash-alt delete' onclick='deleteList(" + obj.id + ");'></i></div></div>");
           });
           getShareLists();
        },
        error : function(result, statut, erreur){
            alert("Error !");
            console.log(erreur);
        }
    });
}

function getShareLists() {
    $.ajax({
        url : 'php/lists.php',
        type : 'GET',
        data : 'func=userShareList',
        dataType : 'html',
        success : function(data_txt, statut) {
            $.each(JSON.parse(data_txt), function(i, obj) {
                $("#insertList").append("<div id='" + obj.id + "' onclick='getListTasks(" + obj.id + ");'><div class='row taskline box' id='taskline'><div class='col-md-8'><h4 class='taskname'>" + obj.title + "</h4></div><div class='col-md-2'><i class='fas fa-retweet share' onclick='hideShare();'></i></div><div class='col-md-2'><i class='fas fa-trash-alt delete' onclick='deleteList(" + obj.id + ");'></i></div></div>");
           });
        },
        error : function(result, statut, erreur){
            alert("Error !");
            console.log(erreur);
        }
    });
}

function onShareList() {
    $(".shareList").prop('disabled', true);
    $("#noUserFound").empty();
    $.ajax({
        url : 'php/lists.php',
        type : 'GET',
        data : 'func=newShareList&friendShare='+ $(".shareList").val() + '&listId=' + $(".shareList").attr('id'),
        dataType : 'html',
        success : function(data_txt, statut) {
            if (data_txt == "success") {
                $(".inputF").empty();
                $(".sharebtn").empty();
                $("#shareL").append("<h4 id='noUserFound' style='color: green;'>Liste partagée avec succès !</h4>");
            } else {
                $(".shareList").prop('disabled', false);
                $("#shareL").append("<h4 id='noUserFound' style='color: red;'>Aucun utilisateur trouvé !</h4>");
            }
        },
        error : function(result, statut, erreur){
            alert("Error !");
            console.log(erreur);
        }
    });
}

function getListTasks(listId) {
    $.ajax({
        url : 'php/lists.php',
        type : 'GET',
        data : 'func=listTasks&listId=' + listId,
        dataType : 'html',
        success : function(data_txt, statut) {
            $("#insert").empty();
            $.each(JSON.parse(data_txt), function(i, obj) {
                if (obj.state == 0) {
                    $("#insert").append("<div id='task" + obj.id + "'><div class='row taskline box' id='taskline'><div class='col-md-10'><input class='taskname' style='text-decoration: none;' size=60 id='taskline" + obj.id + "' value='" + obj.content + "' disabled></div><div class='col-md-1'><i class='fas fa-check check' onclick='crosstask(taskline" + obj.id + ");'></i></div><div class='col-md-1'><i class='fas fa-trash-alt delete' onclick='deleteTask(task" + obj.id + ");'></i></div></div></div>");
                } else {
                    $("#insert").append("<div id='task" + obj.id + "'><div class='row taskline box' id='taskline'><div class='col-md-10'><input class='taskname' style='text-decoration: line-through;' size=60 id='taskline" + obj.id + "' value='" + obj.content + "' disabled></div><div class='col-md-1'><i class='fas fa-check check' onclick='crosstask(taskline" + obj.id + ");'></i></div><div class='col-md-1'><i class='fas fa-trash-alt delete' onclick='deleteTask(task" + obj.id + ");'></i></div></div></div>");
                }
           });
        },
        error : function(result, statut, erreur){
            alert("Error !");
            console.log(erreur);
        }
    });
}