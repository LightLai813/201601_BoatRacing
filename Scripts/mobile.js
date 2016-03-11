var roomID;

//var playerID;
var playerName;
var playerRoleID;
var ClientID;
var gameProgress;
var gameCore;
var shakeTimes = 0; //User晃動次數
var mainID;
var clientID;

/***************搖動處理*******************************************/
var SHAKE_THRESHOLD = 3000; //晃動閥值
var last_update = 0, updateTime = 100;

var x, pre_x;
var y, pre_y;
var z, pre_z;
/***************搖動處理*******************************************/

$(document).ready(function () {
    roomID = Get_URL_Parameter("room"); //取得房間代號
    playerName = decodeURI(Get_URL_Parameter("playername"));    //取得Player姓名
    mainID = Get_URL_Parameter("mainid"); //取得主畫面Client ID

    //目前進度
    gameProgress = "subbmitname";  

    //建立core
    gameCore = $.connection.gameHub;

    //接收Server端傳送之RoleID
    gameCore.client.getRole = function (retureRoomID, retureRoleID) {
        if (retureRoomID == roomID && gameProgress == "waitingothers") {
            playerRoleID = retureRoleID;
            $("#step2 .people").html("<div class='name color" + playerRoleID + "'>" + playerName + "<br>" + clientID + "</div>");
        }
    }

    //接收Server端遊戲開始通知
    gameCore.client.gameStart = function (retureRoomID, countDown) {
        

        if (retureRoomID == roomID) {
            startGame();
        }
    }

    //藉由晃動送出個人資訊,確保所有玩家的手機,皆支援加速器功能
    window.addEventListener('devicemotion', sendName, false);
});

//送出玩家姓名
function sendName(eventData) {
    // 獲取含重力的加速度
    var acceleration = eventData.accelerationIncludingGravity;

    // 獲取當前時間
    var curTime = new Date().getTime();
    var diffTime = curTime - last_update;
    // 固定時間段

    if (diffTime > updateTime) {
        last_update = curTime;

        x = acceleration.x;
        y = acceleration.y;
        z = acceleration.z;

        var speed = Math.abs(x + y + z - pre_x - pre_y - pre_z) / diffTime * 10000;

        if (speed > SHAKE_THRESHOLD) {
            //超過閥值時,送出姓名
            $.connection.hub.start().done(function () {

                clientID = $.connection.hub.id;
                gameCore.server.playerConnected(roomID, clientID, playerName, mainID);
            });
            window.removeEventListener('devicemotion', sendName, false);
            intoWaiting();
        }

        pre_x = x;
        pre_y = y;
        pre_z = z;
    }
}

//等待模式
function intoWaiting() {
    gameProgress = "waitingothers";

    $("#step1").addClass("close");
    $("#step2").removeClass("close");
}

//進入倒數
function countdown() {
    gameProgress = "countdown";

    $(".countdown").hide();
    $("#count3").show();

    $("#step2").addClass("close");
    $("#step3").removeClass("close");

    $("#step3 .people").html("<div class='name color" + playerRoleID + "'>" + playerName + "</div>");
}

//開始遊戲
function startGame() {
    gameProgress = "start";

    $(".final_second").addClass("close");
    $(".go_font").removeClass("close");

    window.addEventListener('devicemotion', playerShake, false);
}

//開始遊戲後取得玩家的晃動
var leftfoot = true;
function playerShake(eventData) {
    // 獲取含重力的加速度
    var acceleration = eventData.accelerationIncludingGravity;

    // 獲取當前時間
    var curTime = new Date().getTime();
    var diffTime = curTime - last_update;
    // 固定時間段

    if (diffTime > 100) {
        last_update = curTime;

        x = acceleration.x;
        y = acceleration.y;
        z = acceleration.z;

        var speed = Math.abs(x + y + z - pre_x - pre_y - pre_z) / diffTime * 10000;

        if (speed > SHAKE_THRESHOLD) {

            var footChoose = "";
            if (leftfoot) {
                leftfoot = false;
                footChoose = "";
            } else {
                leftfoot = true;
                footChoose = "_2"
            }

            $.connection.hub.start().done(function () {
                gameCore.server.playerShaking(roomID, clientID, 100, playerRoleID, mainID);
            });

        }

        pre_x = x;
        pre_y = y;
        pre_z = z;
    }
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
