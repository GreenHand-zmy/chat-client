/**
 * 获取好友列表并缓存好友列表
 */
function fetchAndSaveFriendList() {
	const url = app.serverUrl + '/user/friendList';

	AjaxUtil.ajaxWithToken({
		url: '/user/friendList',
		type: 'get',
		async: false
	}, (data) => {
		// 缓存好友列表
		console.log("成功从服务器拉取好友列表...");
		FriendCache.saveFriendList(data.data);
	});

	/*app.globalAjax({
		url: url,
		type: 'get',
	}, (data) => {
		// 缓存好友列表
		console.log("成功从服务器拉取好友列表...");
		FriendCache.saveFriendList(data.data);
	})*/
}