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
        document.getElementById("clickfriend").style.display = "block";
        document.getElementById("clickbox").style.display = "none";
        document.getElementById("shareL").style.display = "none";
    }
}

function dispbox() {
    if (document.getElementById("clickbox").display == "true") {
        document.getElementById("clickbox").style.display = "none";
    } else {
        getUserNotif();

        document.getElementById("clickbox").style.display = "block";
        document.getElementById("clickfriend").style.display = "none";
        document.getElementById("shareL").style.display = "none";
    }
}

function dispshare() {
    if (document.getElementById("shareL").display == "true") {
        document.getElementById("shareL").style.display = "none";
    } else {
        document.getElementById("shareL").style.display = "block";
        document.getElementById("clickfriend").style.display = "none";
        document.getElementById("clickbox").style.display = "none";
    }
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
    corpsF.innerHTML = corpsF.innerHTML + "<div class='row'><div class='col-md-2'><p class='test'>🔴</p></div><div class='row col-md-8'><input placeholder='FriendNameId' class='namefriend'></div><div class='col-md-2'><i class='fas fa-search search'></i></div></div>"
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

function getUserNotif() {
    $.ajax({
        url : 'php/user.php',
        type : 'GET',
        data : 'func=notif',
        dataType : 'html',
        success : function(data_txt, statut){
            $.each(JSON.parse(data_txt), function(i, obj) {
                $("#insertmsg").append("<p id='notif-msg'>⚈ " + obj.content + "</p>");
           });
        },
        error : function(result, statut, erreur){
            alert("Error !");
            console.log(erreur);
        }
    });
}