window.HistoryCache = {
	/**
	 * history-friendUserId
	 */
	KEY: {
		HISTORY_KEY: "history-",
	},
	/**
	 * 消息状态
	 */
	MSG_STATUS: {
		SUCCESS: 1,
		ERROR: 2
	},
	/**
	 * 聊天记录消息归属
	 */
	OWNER_TYPE: {
		ME: 1,
		FRIEND: 2
	},
	/**
	 * 保存我发送单条信息到缓存中
	 */
	saveMySingleMessage: function(msgItem) {
		msgItem.owner = HistoryCache.OWNER_TYPE.ME;
		msgItem.status = HistoryCache.MSG_STATUS.SUCCESS;
		saveSingleMessage(msgItem);
	},
	/**
	 * 保存接受到的单条信息到缓存中
	 */
	saveFriendSingleMessage: function(msgItem) {
		msgItem.owner = HistoryCache.OWNER_TYPE.FRIEND;
		msgItem.status = HistoryCache.MSG_STATUS.SUCCESS;
		saveSingleMessage(msgItem);
	},
	/**
	 * 保存消息集合
	 */
	saveMsgItemArray: function(friendId, msgItemArray) {
		let meId = app.getUserGlobalInfo().id;
		// 先将对象转化为符合缓存的对象
		msgItemArray = msgItemArray.map(function(msgItem) {
			let item = new MsgItem(msgItem);

			item.status = HistoryCache.MSG_STATUS.SUCCESS;
			// 判定聊天信息归属 
			if(msgItem.sendUserId == meId) {
				item.owner = HistoryCache.OWNER_TYPE.ME;
			} else {
				item.owner = HistoryCache.OWNER_TYPE.FRIEND;
			}
			item.localMsgId = "";
			return item;
		});

		var historyCacheArray = this.getHistoryCache(friendId);
		msgItemArray.concat(historyCacheArray);

		var historyKey = HistoryCache.KEY.HISTORY_KEY + friendId;
		plus.storage.setItem(historyKey, JSON.stringify(msgItemArray));
	},
	/**
	 * 获取聊天记录缓存
	 * @param {Object} myId
	 * @param {Object} friendId
	 */
	getHistoryCache: function(friendId) {
		// 从本地缓存中拿取缓存值
		var historyKey = HistoryCache.KEY.HISTORY_KEY + friendId;
		var historyValue = plus.storage.getItem(historyKey);
		var historyList;
		if(StringUtil.isNotEmpty(historyValue)) {
			// 如果不为空,将缓存值变为json对象
			historyList = JSON.parse(historyValue);
			console.log("聊天记录的缓存对象为：" + JSON.stringify(historyList));
		} else {
			// 如果缓存中没有该值
			historyList = [];
		}

		return historyList;
	},
	/**
	 * 根据本地id标记消息未发送成功
	 */
	markMsgError: function(friendId, localMsgId) {
		let historyCacheArray = this.getHistoryCache(friendId);
		// 遍历聊天记录,找出未发送成功的编号
		for(let i = historyCacheArray.length - 1; i > 0; i--) {
			// 标记为失败
			if(localMsgId == historyCacheArray[i].localMsgId) {
				historyCacheArray[i].status = HistoryCache.MSG_STATUS.ERROR;
				break;
			}
		}

		var historyKey = HistoryCache.KEY.HISTORY_KEY + friendId;
		plus.storage.setItem(historyKey, JSON.stringify(historyCacheArray));
	}
};
/**
 * 保存单条聊天记录
 * @param {Object} status
 * @param {Object} owner
 * @param {Object} localMsgId
 */
function saveSingleMessage(msgItem) {
	const friendId = msgItem.friendUserId;
	// 先通过好友编号查找聊天记录
	let historyCacheArray = HistoryCache.getHistoryCache(friendId);

	// 直接将记录插入到聊天记录末尾
	historyCacheArray.push(msgItem);

	// 写入缓存
	var historyKey = HistoryCache.KEY.HISTORY_KEY + friendId;
	plus.storage.setItem(historyKey, JSON.stringify(historyCacheArray));
}
/**
 * 消息缓存对象
 * 
 * 服务端{
        "id": "190202ASC0CZ1A5P",
        "sendUserId": "181118DZ3XBANZMW",
        "acceptUserId": "181116GNPNZ0RZ54",
        "msg": "我等你好久了",
        "signFlag": 1,
        "gmtCreated": "2019-02-02T15:08:03"
      }
 */
function MsgItem(msgVO) {
	// 服务端数据
	this.msgId = (msgVO == undefined ? null : msgVO.id);
	this.msgContent = (msgVO == undefined ? null : msgVO.msg);
	this.friendUserId = (msgVO == undefined ? null : msgVO.sendUserId);
	this.createdTime = (msgVO == undefined ? null : msgVO.gmtCreated);

	// 客户端数据
	this.status = (msgVO == undefined ? null : msgVO.status); // 信息状态
	this.owner = (msgVO == undefined ? null : msgVO.owner); // 聊天信息归属
	this.localMsgId = (msgVO == undefined ? null : msgVO.localMsgId); // 本地聊天信息编号
}