using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;

public class gameHub : Hub
{
    //Game 使用者連線時呼叫
    public void playerConnected(string roomID, string clientID, string playerName, string mainClientID)
    {
        //Server 通知大螢幕有新的Player進入
        Clients.Client(mainClientID).playerConnected(roomID, clientID, playerName); 
    }

    //Server 回覆Player其Role
    public void returnOfferRole(string roomID, string clientID, int roleID)
    {
        //Game 通知Player其RoleID
        //也可用 Context.ConnectionId 取得目前的Client ID
        Clients.Client(clientID).getRole(roomID, roleID);
    }

    //Server 回覆Player遊戲開始
    public void tellPlayerGameStart(string roomID, int countDown)
    {
        //Game 通知除了大螢幕之外的全部Player遊戲開始
        Clients.Others.gameStart(roomID, countDown);
    }

    //Game 傳送player搖動次數
    public void playerShaking(string roomID, string clientID, int shakeTimes,int playerRoleID, string mainClientID)
    {
        //Server 主畫面更新Player搖動次數
        Clients.Client(mainClientID).updateShakeTimes(roomID, clientID, playerRoleID, shakeTimes);
    }

    ////Server 傳送player rank
    //public void playerRank(string roomID, string clientID, int Rank)
    //{
    //    //Game 玩家畫面顯示自己隊伍的名次
    //    Clients.Client(clientID).playerRank(roomID, clientID, Rank);
    //}
}
