/**
 * 聊天快照的缓存
 */
window.ChatSnapshot = {
	KEY: 'chat-snapshot',
	/**
	 * 保存快照
	 * @param {Object} snapshot
	 */
	saveChatSnapshot: function(snapshot) {
		console.log("保存快照 " + JSON.stringify(snapshot));
		// 从本地缓存中获取聊天快照的list
		var chatSnapshotListStr = plus.storage.getItem(ChatSnapshot.KEY);
		var chatSnapshotList;
		if(StringUtil.isNotEmpty(chatSnapshotListStr)) {
			// 如果不为空,装换为json对象
			chatSnapshotList = JSON.parse(chatSnapshotListStr);
			//			console.log("保存快照前数组：" + JSON.stringify(chatSnapshotList));
			// 遍历快照list,如果已经存在当前需要保存的快照,则进行删除,然后将快照放在数组首位
			chatSnapshotList.forEach((chatSnapshot, index) => {
				// 如果该快照已经存在,移除该快照
				if(chatSnapshot.friendId == snapshot.friendId) {
					chatSnapshotList.splice(index, 1);
					//					console.log("移除快照后： " + JSON.stringify(chatSnapshotList));
				}
			});
		} else {
			chatSnapshotList = [];
		}

		// 将快照插入数组头部
		chatSnapshotList.unshift(snapshot);
		//		console.log("塞入头部之后： " + JSON.stringify(chatSnapshotList));

		// 将快照列表保存到缓存中
		plus.storage.setItem(ChatSnapshot.KEY, JSON.stringify(chatSnapshotList));
	},
	/**
	 * 从缓存中获取快照列表
	 */
	getChatSnapshot: function() {
		// 从本地缓存中获取聊天快照的list
		var chatSnapshotListStr = plus.storage.getItem(ChatSnapshot.KEY);
		var chatSnapshotList;
		if(StringUtil.isNotEmpty(chatSnapshotListStr)) {
			// 如果不为空,装换为json对象
			chatSnapshotList = JSON.parse(chatSnapshotListStr);
		} else {
			chatSnapshotList = [];
		}

		return chatSnapshotList;
	},
	/**
	 * 将快照设置为已读
	 * @param {Object} snapshot
	 */
	snapshotReaded: function(snapshot) {
		var chatSnapshotList = ChatSnapshot.getChatSnapshot();
				console.log("改变前数组"+JSON.stringify(chatSnapshotList));
		chatSnapshotList.forEach((item) => {
			if(item.friendId == snapshot.friendId) {
				item.isRead = true;
				return;
			}
		});
				console.log("改变后数组"+JSON.stringify(chatSnapshotList));
		// 将快照列表保存到缓存中
		plus.storage.setItem(ChatSnapshot.KEY, JSON.stringify(chatSnapshotList));
	}
}

/**
 * 聊天快照对象
 */
function Snapshot(friendId, msg, isRead) {
	this.friendId = friendId;
	this.msg = msg;
	this.isRead = isRead;
}