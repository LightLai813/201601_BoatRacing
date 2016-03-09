var gameCore;
var gameProgress;
var playerList = []; //玩家集合
var roleBox = [1, 2, 3, 4]; //角色箱(1+2一組, 3+4一組)
var gameLink;
var clientID;

$(document).ready(function () {
    //取得房間序號
    roomID = Date.now();
    //進入等待畫面
    intoWaiting();

    //建立core
    gameCore = $.connection.gameHub;

    //接收Server playerConnected 訊號
    gameCore.client.playerConnected = function (returnRoomID, returnClientID, returnPlayerName) {
        if (returnRoomID == roomID && roleBox.length > 0 && gameProgress == "waiting") {
            //給予Player ID
            var playerRoleID = roleBox[0];

            //新增Player資料到playerList
            playerList.push(new Player(returnClientID, playerRoleID, returnPlayerName));

            //新增畫面等待player
            addWaitingPlayer();

            //回覆Server 新進Player的Role及clientid
            $.connection.hub.start().done(function () {
                gameCore.server.returnOfferRole(roomID, returnClientID, playerRoleID);
            });

            //將角色從箱子中拿走
            roleBox.splice(0, 1);

            //額滿時隱藏Qrcode, 顯示StartGame
            if (roleBox.length <= 0) {
                $("#QrCode").addClass("close");
                $("#StartGame").removeClass("close");
            }
        }
    }

    //更新各Player搖動次數
    gameCore.client.updateShakeTimes = function (returnRoomID, returnClientID, playerRoleID, leftDistance) {
        if (returnRoomID == roomID && gameProgress == "start") {
            //抵達終點判斷
            if (leftDistance <= 0) {
                $("#" + returnClientID + " span").html("<br>YOU WIN!");
            } else {
                $("#" + returnClientID + " span").html("<br>還剩" + leftDistance + "m");
            }
        }
    }
});

//Player Object
function Player(clientID, roleID, playerName) {
    this.clientID = clientID;
    this.roleID = roleID;
    this.name = playerName;
    this.rank = 0;
}

//進入等待畫面
function intoWaiting() {
    gameProgress = "waiting";
    $.connection.hub.start().done(function () {
        //主畫面的clientID
        clientID = $.connection.hub.id;
        console.log('Now connected, connection ID=' + clientID);

        //產生Client端連結
        gameLink = "http://" + location.host + "/Player_Join.aspx?room=" + roomID + "&mainid=" + clientID

        //產生QRCODE
        $("#QrCode img").attr("src", "http://chart.googleapis.com/chart?cht=qr&chs=280x280&chl=" + encodeURIComponent(gameLink));
        $("#Link a").attr("href", gameLink);
    });

    //綁定StartGame文字 點擊後開始遊戲
    $("#StartGame").unbind().bind("click", function () {
        gameProgress = "ready";

        //進入倒數
        countDown();
    });
}

//新增等待的玩家
function addWaitingPlayer() {
    var playerID = parseInt(playerList.length);

    var playerString = "";
    playerString += "<div id='" + playerList[playerID - 1].clientID + "' class='name color" + playerList[playerID - 1].roleID + "'>" + playerList[playerID - 1].name + "<br>ClientID=" + playerList[playerID - 1].clientID + "<br>RoleID=" + playerList[playerID - 1].roleID + "<br><span></span></div>";

    if (playerList[playerID - 1].roleID <= 2) {
        $("#UserListA").append(playerString);
    }else{
        $("#UserListB").append(playerString);
    }

    //增加點擊玩家移除的事件
    $(".userList #" + playerList[playerID - 1].clientID).unbind().bind("click", function () {
        removeWaitingPlayer($(this));
    });
}

//移除選定的玩家
function removeWaitingPlayer(target) {
    //取得欲被移除Player之位置
    var playerPosition = target.attr("class");
    playerPosition = parseInt(playerPosition.replace("name color", ""));

    //取得欲被移除Player之roleID
    var playerRoleID = playerPosition;

    //從畫面移除該Player
    target.remove();

    //從playerList移除該Player
    playerList.splice(playerPosition - 1, 1);

    //把被刪掉的角色重新加回roleBox
    roleBox.push(playerRoleID);

    //roleBox重新照大小排序
    roleBox.sort();

    //$("#UserAdd").removeClass("close");
    $("#QrCode").removeClass("close");
    $("#StartGame").addClass("close");
}

//倒數處理
function countDown() {
    $(".final_second").removeClass("close");
    $("#StartGame").addClass("close");
    $.connection.hub.start().done(function () {
        gameCore.server.tellPlayerGameStart(roomID, 4);
    });
    $("#count3").show().fadeOut(1000, "linear", function () {

        $("#count3").remove();
        $.connection.hub.start().done(function () {
            gameCore.server.tellPlayerGameStart(roomID, 3);
        });
        $("#count2").show().fadeOut(1000, "linear", function () {

            $("#count2").remove();
            $.connection.hub.start().done(function () {
                gameCore.server.tellPlayerGameStart(roomID, 2);
            });
            $("#count1").show().fadeOut(1000, "linear", function () {

                $("#count1").remove();
                $.connection.hub.start().done(function () {
                    gameCore.server.tellPlayerGameStart(roomID, 1);
                });
                $("#count0").show().fadeOut(1000, "linear", function () {

                    $("#count0").remove();
                    $.connection.hub.start().done(function () {
                        gameCore.server.tellPlayerGameStart(roomID, 0);
                    });
                    $(".final_second").addClass("close");
                    startGame();
                });
            });
        });
    });
}

//遊戲開始
function startGame() {
    gameProgress = "start";
    //timerCountDown();
}

//取得網址參數
function Get_URL_Parameter(sParameter) {
    var url = window.location.toString();
    var str = "";
    var str_value = "";
    if (url.indexOf("?") != -1) {
        var ary = url.split("?")[1].split("&");
        for (var i in ary) {
            str = ary[i].split("=")[0];
            if (str == sParameter) {
                str_value = decodeURI(ary[i].split("=")[1]);
            }
        }
    }
    return str_value;
}