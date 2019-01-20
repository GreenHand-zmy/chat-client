/**
 * 缓存联系人列表
 */
window.FriendCache = {
	/**
	 * 缓存键
	 */
	KEY: 'friendList',
	/**
	 * 缓存用户列表
	 * @param {Object} friendList
	 */
	saveFriendList: function(friendList) {

		plus.storage.setItem(FriendCache.KEY, JSON.stringify(friendList));
		console.log("保存好友列表完毕");
	},
	/**
	 * 缓存用户
	 * @param {Object} friend
	 * {
      "faceImage": "string",
      "faceImageBig": "string",
      "id": "string",
      "nickname": "string",
      "qrcode": "string",
      "username": "string"
    }
	 */
	saveFriend: function(friend) {
		var friendList = FriendCache.getFriendList();

		// 如果要保存的用户列表中没有的话则进行保存,如果列表中已经有该用户,则不进行保存
		var existed = false;
		friendList.forEach((item, index) => {
			if(item.id == friend.id) {
				existed = true;
			}
		});
		if(!existed) {
			console.log("成功保存了用户" + JSON.stringify(friend));
			friendList.push(friend);
			FriendCache.saveFriendList(friendList);
		}
	},
	/**
	 * 从缓存中读取好友列表
	 */
	getFriendList: function() {
		var friendListStr = plus.storage.getItem(FriendCache.KEY);
		var friendList = JSON.parse(friendListStr);
		if(friendList) {
			return friendList;
		} else {
			return [];
		}
	},
	/**
	 * 通过好友编号查询好友列表
	 * @param {Object} friendId
	 */
	getFriend: function(friendId) {
		var friendList = plus.storage.getItem(FriendCache.KEY);
		friendList = JSON.parse(friendList);
		var friend;
		if(friendList) {
			// 查找是否
			friendList.forEach((item) => {
				if(item.id === friendId) {
					console.log("使用friendId: " + friendId + " " + JSON.stringify(item));
					friend = item;
					return;
				}
			});
			return friend;
		}
	}
}
/**
 * 缓存的好友对象
 */
function FriendCache() {

}