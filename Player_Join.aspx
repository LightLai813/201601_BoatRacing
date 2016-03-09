<%@ Page Language="C#" %>

<!DOCTYPE html>

<script runat="server">

</script>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
    <script src="Scripts/jquery-2.2.0.min.js"></script>
    <script>
        var roomID; //房間ID
        var mainID; //主畫面Client ID
        $(document).ready(function () {
            roomID = Get_URL_Parameter("room"); //取得房間代號
            mainID = Get_URL_Parameter("mainid"); //取得主畫面Client ID

            $("#enterBtn").unbind().bind("click", function () {
                var playerName = $("#playerName").val();
                location.href = "Player_Game.aspx?room=" + roomID + "&playername=" + escape(playerName) + "&mainid=" + mainID;
            });
        });

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
    </script>
</head>
<body>
    <h1>請輸入姓名</h1>
    <input id="playerName" name="" type="text" />
    <a href="javascript:void(0);" id="enterBtn">ENTER</a>
</body>
</html>
