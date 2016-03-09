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

//Function 亂數Float========================================================
function RndFloat(min, max) {
    return Math.random() * (max - min) + min;
}

//Function 亂數Int==========================================================
function RndInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}