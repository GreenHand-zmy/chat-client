window.UserInfoCache = {
	/**
	 * 缓存的key
	 */
	key: "userInfo",

	/**
	 * 保存用户信息
	 * @param {Object} userInfo
	 */
	save: function(userInfo) {
		plus.storage.setItem(UserInfoCache.key, JSON.stringify(userInfo));
	},
	/**
	 * 获取用户信息
	 */
	get: function() {
		return JSON.parse(plus.storage.getItem(UserInfoCache.key));
	}
}

function UserInfo(userInfo) {
	this.userInfo = userInfo;
}