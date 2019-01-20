/**
 * 打开好友聊天界面
 * @param {Object} webViewParms
 * {
 * 	url: "../chat/chatting.html",//webview URL
	id: "chatting-" + friendUserId, // webview id
 * }
 */
function openChatWebView(webViewParms, friendUserId) {
	mui.openWindow({
		url: webViewParms.url,
		id: "chatting-" + friendUserId,
		extras: {
			'friendUserId': friendUserId,
		}
	});
}