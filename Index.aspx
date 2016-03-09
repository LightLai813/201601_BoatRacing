<%@ Page Language="C#" %>

<!DOCTYPE html>

<script runat="server">

</script>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>e21 摩奇創意｜2016 龍舟大賽</title>
    <link href="css/style.css" rel="stylesheet" />
</head>
<body>
    
    <div class="main">
        <div id="threejsStage"></div>
        <div id="introView">
            <div id="tipBox">
                <div class="tip">請掃描QRcode以進入遊戲</div>
            </div>
            <div id="StartBtn">START</div>
            <!------------------------------顯示使用者清單開始------------------------------------------>
            <div id="teamA" class="readyPlayer">
                <p class="teamName">Team A</p>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"  width="300px" height="500px" xml:space="preserve">
                    <path id="Player_1" d="M145 50  A 40 50 1 0 0 145 400 z" stroke="#FFF" fill="#000" stroke-width="1" fill-opacity="0.5"/>
                    <text id="Player_1_Name" x="135" y="230" text-anchor="end" fill="#FFF" style="font-size: 14pt;">等待玩家</text>

                    <path id="Player_2" d="M155 50  A 40 50 0 0 1 155 400 z" stroke="#FFF" fill="#000" stroke-width="1" fill-opacity="0.5"/>
                    <text id="Player_2_Name" x="165" y="230" text-anchor="start" fill="#FFF" style="font-size: 14pt;">等待玩家</text>
                </svg>
            </div>

            <div id="teamB" class="readyPlayer">
                <p class="teamName">Team B</p>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"  width="300px" height="500px" xml:space="preserve">
                    <path id="Player_3" d="M145 50  A 40 50 1 0 0 145 400 z" stroke="#FFF" fill="#000" stroke-width="1" fill-opacity="0.5"/>
                    <text id="Player_3_Name" x="135" y="230" text-anchor="end" fill="#FFF" style="font-size: 14pt;">等待玩家</text>

                    <path id="Player_4" d="M155 50  A 40 50 0 0 1 155 400 z" stroke="#FFF" fill="#000" stroke-width="1" fill-opacity="0.5"/>
                    <text id="Player_4_Name" x="165" y="230" text-anchor="start" fill="#FFF" style="font-size: 14pt;">等待玩家</text>
                </svg>

            </div>
            <!------------------------------顯示使用者清單結束------------------------------------------>
        </div>
    </div>

    <script type="text/javascript" src="Scripts/jquery-2.2.0.min.js"></script>
    <script type="text/javascript" src="Scripts/jquery.signalR-2.2.0.min.js"></script>
    <script type="text/javascript" src='<%: ResolveClientUrl("~/signalr/hubs") %>'></script>

    <script type="text/javascript" src="Scripts/threejs/three.min.js"></script>
    <script type="text/javascript" src="Scripts/threejs/OBJLoader.js"></script>
    <script type="text/javascript" src="Scripts/threejs/threex.keyboardstate.js"></script>
    <script type="text/javascript" src="Scripts/threejs/Stats.js"></script>

    <script src="Scripts/common.js"></script>
    <script src="Scripts/stageHandler.js"></script>
    <script src="Scripts/main.js"></script>
</body>
</html>
