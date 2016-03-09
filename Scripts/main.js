var clientID;
var gameCore;

var playerList = []; //玩家集合
var roleBox = [1, 2, 3, 4]; //角色箱(1+2一組, 3+4一組)
var Player = function (clientID, roleID, playerName) {
    this.clientID = clientID;
    this.roleID = roleID;
    this.name = playerName;
}

var stageHandler = new stageHandler();

var init = function () {
    roomID = Date.now();   //取得房間序號 

    $.connection.hub.start().done(function () {
        clientID = $.connection.hub.id;                                                                             //主畫面的clientID
        var gameLink = "http://" + location.host + "/Player_Join.aspx?room=" + roomID + "&mainid=" + clientID;      //產生手機端連結
        $('#tipBox').prepend('<img class="QRcode" src="http://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=' + encodeURIComponent(gameLink) + '" />');//產生QRCODE
    });

    setHubClientGetter();
    stageHandler.init();

    $('#StartBtn').bind('click', function () {
        startGame();
    });
}

var setHubClientGetter = function () {
    //建立core
    gameCore = $.connection.gameHub;     

    //玩家加入
    gameCore.client.playerConnected = function (returnRoomID, returnClientID, returnPlayerName) {
        if (returnRoomID == roomID && roleBox.length > 0) {
            var playerRoleID = roleBox[0];                                              //給予Player ID
            playerList.push(new Player(returnClientID, playerRoleID, returnPlayerName));//新增Player資料到playerList
            gameCore.server.returnOfferRole(roomID, returnClientID, playerRoleID);      //回覆Server 新進Player的Role及clientid
            roleBox.splice(0, 1);                                                       //將角色從箱子中拿走

            addReadyPlayer(); //新增畫面等待player
        }
    }
}

var playerColor = ['#ecf0e7', '#b8cca6', '#9fbed1', '#ebf3fa'];


//新增準備好之玩家
function addReadyPlayer() {
    var playerID = parseInt(playerList.length);

    $('#Player_' + playerID).attr('fill', playerColor[playerID - 1]).attr('fill-opacity',0.95);
    $('#Player_' + playerID + '_Name').html(playerList[playerID - 1].name).attr('fill', '#495d7a');
}

var startGame = function () {
    if (playerList.length < 4) {
        alert('玩家尚未全部進入，請稍等片刻');
    } else {
        intoGame();
    }
}

var intoGame = function () {
    stageHandler.intoGame();

    $('#introView').fadeOut(500);
}

var startGame = function () {
    gameCore.server.tellPlayerGameStart(roomID, 0);
    
}

init();
