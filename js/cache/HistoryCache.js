window.HistoryCache = {
	MSG_CACHE_TYPE: {
		ME: 1,
		FRIEND: 2
	},
	KEY: {
		HISTORY_KEY: "history-",
	},
	/**
	 * 保存我发送单条信息到缓存中
	 */
	saveMySingleMessage: function(myId, friendId, msg) {
		saveSingleMessage(myId, friendId, msg, HistoryCache.MSG_CACHE_TYPE.ME);
	},
	/**
	 * 保存接受到的单条信息到缓存中
	 */
	saveFriendSingleMessage: function(myId, friendId, msg) {
		saveSingleMessage(myId, friendId, msg, HistoryCache.MSG_CACHE_TYPE.FRIEND);
	},

	/**
	 * 获取聊天记录缓存
	 * @param {Object} myId
	 * @param {Object} friendId
	 */
	getHistoryCache: function(myId, friendId) {
		// 从本地缓存中拿取缓存值
		var historyKey = HistoryCache.KEY.HISTORY_KEY + myId + '-' + friendId;
		var historyValue = plus.storage.getItem(historyKey);
		var historyList;
		if(isNotEmpty(historyValue)) {
			// 如果不为空,将缓存值变为json对象
			historyList = JSON.parse(historyValue);
			console.log("聊天记录的缓存对象为：" + JSON.stringify(historyList));

		} else {
			// 如果缓存中没有该值
			historyList = [];
		}
		
//		console.log("historyKey:"+historyKey);
//		console.log("historyValue："+JSON.stringify(historyValue));
		return historyList;
	}
};

function saveSingleMessage(myId, friendId, msg, cacheType) {
	var userGlobalInfo = app.getUserGlobalInfo();
	var historyKey = HistoryCache.KEY.HISTORY_KEY + myId + '-' + friendId;

//	console.log("缓存的key为" + historyKey);

	// 从本地缓存中拿取缓存值
	var historyValue = plus.storage.getItem(historyKey);
	var historyList;
	if(isNotEmpty(historyValue)) {
		// 如果不为空,将缓存值变为json对象
		historyList = JSON.parse(historyValue);
//		console.log("聊天记录的缓存对象为：" + JSON.stringify(historyList));

	} else {
		// 如果缓存中没有该值
		historyList = [];
	}

	// 构造单条聊天记录的缓存对象,并插入缓存数组中
	var chatHistoryItem = new ChatHistoryItem(myId, friendId, msg, cacheType);
	historyList.push(chatHistoryItem);

	// 最后将key-value 插入缓存中
	plus.storage.setItem(historyKey, JSON.stringify(historyList));
}
/**
 * 单条聊天记录的缓存对象
 * @param {Object} myId
 * @param {Object} friendId
 * @param {Object} msg
 * @param {Object} cacheType
 */
function ChatHistoryItem(myId, friendId, msg, cacheType) {
	this.myId = myId;
	this.friendId = friendId;
	this.msg = msg;
	this.cacheType = cacheType
}