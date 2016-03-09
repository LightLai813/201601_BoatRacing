<%@ Page Language="C#" %>

<!DOCTYPE html>

<script runat="server">

</script>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
    <link href="css/Mystyle.css" rel="stylesheet" />
    
</head>
<body>
    <div id="QrCode" style="width:280px;text-align:center">
        <img src=""/><br />
        <span id="Link"><a href="javascript: void(0);" target="_blank">LINK</a></span>
    </div>
    
    <!------------------------------第一步 加入完成等待按下開始------------------------------------------>
    <div id="StartGame" class="close" style="width:280px;height:280px;text-align:center">Start Game</div>
    <!------------------------------第一步 加入完成等待按下開始------------------------------------------>

    <!------------------------------第二步 倒數開始------------------------------------------>
    <div class="final_second close">
        <span id="count3" style="display:none;">3</span>
        <span id="count2" style="display:none;">2</span>
        <span id="count1" style="display:none;">1</span>
        <span id="count0" style="display:none;">GO!</span>
    </div>
    <!------------------------------第二步 倒數結束------------------------------------------>

    
    <!------------------------------顯示使用者清單開始------------------------------------------>
    <div class="userList" id="UserListA" style="width:280px;margin:0 auto;display:inline-block;"><h1>UserListA</h1></div>
    <div class="userList" id="UserListB" style="width:280px;margin:0 auto;display:inline-block;"><h1>UserListB</h1></div>
    <!------------------------------顯示使用者清單結束------------------------------------------>

    <div id="Info">
        
    </div>

    <script src="Scripts/jquery-2.2.0.min.js"></script>
    <script src="Scripts/jquery.signalR-2.2.0.min.js"></script>
    <script src='<%: ResolveClientUrl("~/signalr/hubs") %>'></script>

    <script type="text/javascript" src="Scripts/threejs/three.min.js"></script>
    <script type="text/javascript" src="Scripts/threejs/OBJLoader.js"></script>
    <script type="text/javascript" src="Scripts/threejs/threex.keyboardstate.js"></script>
    <script type="text/javascript" src="Scripts/threejs/Stats.js"></script>

    <script src="Scripts/game.js"></script>

    <script>
        $(function () {
            $.connection.hub.start();
        });
    </script>
</body>
</html>
