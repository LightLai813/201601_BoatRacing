<%@ Page Language="C#" %>

<!DOCTYPE html>

<script runat="server">

</script>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
    <link href="css/Mystyle.css" rel="stylesheet" />
    <script src="Scripts/jquery-2.2.0.min.js"></script>
    <script src="Scripts/jquery.signalR-2.2.0.min.js"></script>
    <script src='<%: ResolveClientUrl("~/signalr/hubs") %>'></script>
    <script src="Scripts/mobile.js"></script>
</head>
<body>
    <div id="step1">
        <div>請晃動手機</div>
        <div>送出個人資訊</div>
    </div>

    <div id="step2" class="close">
        <div class="wait_font">等待其它玩家進入遊戲</div>
        <div class="people"></div>
    </div>
    
    <div id="step3" class="close">
        <!---------------倒數----------------->
        <div class="final_second">
            <span id="count3" class="countdown">3</span>
            <span id="count2" class="countdown">2</span>
            <span id="count1" class="countdown">1</span>
            <span id="count0" class="countdown">Go!</span>
        </div>
        <!---------------倒數結束-------------->
        
        <div class="people"></div>
        <!------------------------------------->
        <div class="go_font close">
            <h3>加油!距離終點還剩下</h3>
            <div class="distance">
                <div class="number"><span class="num">99</span>m</div>
            </div>
        </div>
        <!---------------倒數結束-------------->   
    </div>

    <div id="step4" class="close">
        <h3>抵達終點!!</h3>
    </div>
    <script>
        $(function () {
            $.connection.hub.start();
        });
    </script>
</body>
</html>
