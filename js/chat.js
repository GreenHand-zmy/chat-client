window.Chat = {
	socket: null,
	init: function() {
		// 查看是否支持WebSocket
		if(window.WebSocket) {
			// 如果当前的状态已经连接,那就不需要重复初始化websocket
			if(Chat.socket != null &&
				Chat.socket != undefined &&
				Chat.socket.readyState == WebSocket.OPEN) {
				return false;
			}
			Chat.socket = new WebSocket(app.imServerUrl);

			Chat.socket.onopen = Chat.wsOpen;

			Chat.socket.onclose = Chat.wsClose;

			Chat.socket.onerror = Chat.wsError;

			Chat.socket.onmessage = Chat.wsMessage;
		} else {
			alert("手机过久该升级啦~");
		}
	},

	/**
	 * 当ws连接打开
	 */
	wsOpen: function() {
		console.log("连接成功....");
		const userInfo = app.getUserGlobalInfo();

		// 产生连接报文,并发送
		const connectPacket = new Packet.ConnectPacket(userInfo.id);
		Chat.socket.send(JSON.stringify(connectPacket));

		// 保持和客户端的连接
		keepAlive();
	},

	/**
	 * 当ws连接关闭
	 */
	wsClose: function() {
		console.log("连接关闭....");
	},

	/**
	 * 当ws发生错误
	 */
	wsError: function() {
		console.log("发生错误....");
	},

	/**
	 * ws接受到消息
	 * @param {Object} message
	 */
	wsMessage: function(message) {
		console.log("服务端发来的包为 " + message.data);
		// 接受到消息
		var msgPacket = JSON.parse(message.data);
		// 包类型
		var packetType = msgPacket.type;
		switch(packetType) {
			// 包为普通消息类型
			case PacketType.NORMAL_MSG_PACKET:
				{
					processNormalMessage(msgPacket);
					break;
				}
				//普通的定向聊天包集合
			case PacketType.NORMAL_MSG_LIST_PACKET:
				{
					processNormalMessageList(msgPacket);
					break;
				}
			case PacketType.REFURBISH_PACKET:
				{
					refurbishResource(msgPacket);
					break;
				}
			default:
				{

				}
		}

	},
	/**
	 * 客户端发送包到服务端
	 * @param {Object} packet
	 */
	sendToServer: function(packet) {
		// 检查格式	
		packet = checkJsonFormat(packet);

		console.log("即将要被发送的包 " + JSON.stringify(packet));
		let packetType = packet.type;
		switch(packetType) {
			case PacketType.NORMAL_MSG_PACKET:
				{
					sendNormalMsgToFriend(packet);
					break;
				}
			default:
				{

				}
		}
	},
	/**
	 * 发送包
	 * @param {Object} packet
	 */
	socketSend: function(packet) {
		packet = packetFormat(packet);
		Chat.socket.send(packet);
	},

	/**
	 * 重新发送
	 * @param {Object} msg
	 */
	reSend: function(msg) {

		Chat.socket.send(msg);
	}
};

/**
 * 包格式化,将输出的包装换为String类型字符串
 * @param {Object} packet
 */
function packetFormat(packet) {
	// 如果包不为String类型,则进行转换
	if(typeof packet != 'string') {
		packet = JSON.stringify(packet);
	}
	return packet;
}
/**
 * 需要包为json对象形式
 * 检查是否为json对象
 * @param {Object} packet
 */
function checkJsonFormat(packet) {
	if(typeof packet == 'string') {
		packet = JSON.parse(packet);
	}
	return packet;
}

/**
 * 发送普通消息到服务器
 * @param {Object} msgPacket
 */
function sendNormalMsgToFriend(msgPacket) {
	console.log("发送给用户的包 " + JSON.stringify(msgPacket));

	var msg = msgPacket.msg;
	var friendId = msgPacket.receiverId;

	// 保存聊天记录,就算ws有异常也要先缓存到本地
	var msgItem = new MsgItem();
	msgItem.msgContent = msgPacket.msg;
	msgItem.friendUserId = msgPacket.receiverId;
	msgItem.status = HistoryCache.MSG_STATUS.SUCCESS;
	msgItem.owner = HistoryCache.OWNER_TYPE.ME;
	msgItem.localMsgId = new Date().getTime();
	console.log("查看刚生成的聊天记录缓存 " + JSON.stringify(msgItem))

	// 保存聊天信息快照
	ChatSnapshot.saveChatSnapshot(new Snapshot(friendId, msg, true));

	// 重新渲染快照
	mui.fire(plus.webview.getWebviewById("chat-list.html"), "refeshSnapshot");

	// 如果ws连接打开,则进行发送
	if(Chat.socket != null &&
		Chat.socket != undefined &&
		Chat.socket.readyState == WebSocket.OPEN) {
		// 通过ws发送包
		Chat.socketSend(msgPacket);
		// 保存聊天记录
		HistoryCache.saveMySingleMessage(msgItem);
	} else {
		// 如果ws连接关闭则试着重新打开ws
		// todo 一旦ws连接发生异常,现在只是提醒信息发送失败,后期需要标记信息失败,然后让信息重发
		console.log("发送时,ws连接关闭发生异常,可能是未连接服务器");
		/*
				var chatWebView = plus.webview.getWebviewById("chatting-" + friendId);
				chatWebView.evalJS(`sendMessageError("${msgItem.localMsgId}")`);*/
		// 保存聊天记录
		HistoryCache.saveMySingleMessage(msgItem);
		console.log(friendId, msgItem.localMsgId);
		HistoryCache.markMsgError(friendId, msgItem.localMsgId);
	}
}
/**
 * 签收信息
 */
function signMessage(msgId) {
	var msgIdList = [];
	msgIdList.push(msgId);
	var signPacket = new Packet.SignPacket(msgIdList);
	console.log(JSON.stringify(signPacket));
	Chat.socketSend(signPacket);
}
/**
 * 批量签收信息
 */
function batchSignMessage(msgIdList) {
	var signPacket = new Packet.SignPacket(msgIdList);
	console.log("批量签收消息：" + JSON.stringify(signPacket));
	Chat.socketSend(signPacket);
}
/**
 * 处理接受到的普通消息
 * {"msg":"x","msgId":"190118AT54W9FT0H","receiverId":"181116GNPNZ0RZ54","senderId":"181118DZ3XBANZMW","type":2}
 * @param {Object} msgPacket
 */
function processNormalMessage(msgPacket) {
	var senderId = msgPacket.senderId;
	var msg = msgPacket.msg;
	var msgId = msgPacket.msgId;
	var myId = msgPacket.receiverId;

	console.log("收到服务器转发过来的消息：" + JSON.stringify(msgPacket));

	var chatWebView = plus.webview.getWebviewById("chatting-" + senderId);
	var isRead;
	if(chatWebView != null) {
		isRead = true;
		// 说明聊天窗口打开着
		chatWebView.evalJS(`receiveMsg("${msg}")`);
	} else {
		isRead = false;
	}

	// 保存聊天记录到本地缓存
	let msgItem = new MsgItem();
	msgItem.msgContent = msg;
	msgItem.friendUserId = senderId;

	HistoryCache.saveFriendSingleMessage(msgItem);
	// 保存聊天信息快照
	ChatSnapshot.saveChatSnapshot(new Snapshot(senderId, msg, isRead));
	console.log("接受到消息,重新渲染快照列表");
	// 重新渲染快照
	mui.fire(plus.webview.getWebviewById("chat-list.html"), "refeshSnapshot");
	// 发送签收消息的报文
	signMessage(msgId);
}
/**
 * 处理消息集合
 * 先一股脑用处理单个请求的逻辑来处理
 */
function processNormalMessageList(msgListPacket) {
	console.log("批量处理未读信息");
	var msgList = msgListPacket.msgPacketList;
	var myId = app.getUserGlobalInfo().id;
	var msgIdList = [];

	/**
	 * TODO 这里需要优化,如果是用户首次打开app,
	 * 联系人列表这些都还没缓存,需要等联系人列表缓存好后再做处理,
	 * 现在粗暴的设置为3秒后再执行签收
	 */
	setTimeout(function() {
		// 第一次循环先一次性签收消息
		msgList.forEach((msgPacket) => {
			console.log(JSON.stringify(msgPacket));
			const msgId = msgPacket.msgId;
			const msg = msgPacket.msg;
			const friendId = msgPacket.senderId;
			console.log("friendId " + friendId);

			msgIdList.push(msgId);

			// 批量保存聊天记录
			HistoryCache.saveFriendSingleMessage(myId, friendId, msg);

			// 保存聊天快照
			var chatWebView = plus.webview.getWebviewById("chatting-" + friendId);
			var isRead;
			if(chatWebView != null) {
				isRead = true;
				// 说明聊天窗口打开着
				chatWebView.evalJS(`receiveMsg("${msg}")`);
			} else {
				isRead = false;
			}
			ChatSnapshot.saveChatSnapshot(new Snapshot(friendId, msg, isRead));
		});
		// 批量签收消息
		batchSignMessage(msgIdList);
		// 重新渲染快照
		mui.fire(plus.webview.getWebviewById("chat-list.html"), "refeshSnapshot");
	}, 3000);
}
/**
 * 发送心跳包保持和服务端的连接
 */
function keepAlive() {
	// 心跳包
	var heartBeatPacket = new Packet.HeartBeatPacket();

	// 定时发送心跳包
	setInterval(function() {
		Chat.socketSend(heartBeatPacket);
	}, app.heartBeatIdle);
}

function refurbishResource(msgPacket) {
	var resourceCode = msgPacket.resourceCode;
	switch(resourceCode) {
		// 刷新好友列表
		case ResourceCode.FRIEND_RESOURCE:
			{
				console.log("服务端喊我刷新好友列表啦");
				var chatContact = plus.webview.getWebviewById("chat-contact.html")
				mui.fire(chatContact, "refreshList");
				break;
			}
		case ResourceCode.FRIEND_REQUEST_LIST:
			{
				console.log("服务端喊我刷新好友请求列表啦");
				var friendRequest = plus.webview.getWebviewById("friend-request.html");
				mui.fire(friendRequest, "fetchAndFresh");
				break;
			}
		default:
			{

			}
	}
}