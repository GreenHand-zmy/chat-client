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
		/**
		 * 构造cache对象
		 * {firendid:friend,...}
		 */
		let friendMap = {};

		friendList.forEach((friend) => {
			friendMap[friend.id] = friend;
		});

		console.log(JSON.stringify(friendMap));

		plus.storage.setItem(FriendCache.KEY, JSON.stringify(friendMap));
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
		// 保存用户
		var friendMap = FriendCache.getFriendList();
		friendMap[friend.id] = friend;
		plus.storage.setItem(FriendCache.KEY, JSON.stringify(friendMap));
	},
	/**
	 * 从缓存中读取好友列表
	 */
	getFriendListMap: function() {
		var friendMap = JSON.parse(plus.storage.getItem(FriendCache.KEY));
		if(friendMap) {
			return friendMap;
		} else {
			return {};
		}
	},
	/**
	 * 通过好友编号查询好友列表
	 * @param {Object} friendId
	 */
	getFriend: function(friendId) {
		const start = new Date().getTime();
		var friendMap = JSON.parse(plus.storage.getItem(FriendCache.KEY));

		if(friendMap) {
			console.log("获取用户消耗了" + (new Date().getTime() - start));
			return friendMap[friendId];
		}
	},
	/**
	 * 判断map是否为空
	 * @param {Object} friendMap
	 */
	isEmpty: function(friendMap) {
		return friendMap == null || JSON.stringify(friendMap) == "{}"
	}
}
/**
 * 缓存的好友对象
 */
function FriendMapItem() {

}