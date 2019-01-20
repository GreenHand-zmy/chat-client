window.Packet = {
	/**
	 * 连接报文
	 * @param {Object} userId
	 */
	ConnectPacket: function(userId) {
		this.type = PacketType.CONNECT_PACKET;
		this.userId = userId;
	},
	/**
	 * 心跳包
	 */
	HeartBeatPacket: function() {
		this.type = PacketType.HEART_BEAT_PACKET;
	},
	/**
	 * 消息报文
	 * @param {Object} senderId
	 * @param {Object} receiverId
	 * @param {Object} msg
	 * @param {Object} msgId
	 */
	MsgPacket: function(senderId, receiverId, msg, msgId) {
		this.type = PacketType.NORMAL_MSG_PACKET;
		this.senderId = senderId;
		this.receiverId = receiverId;
		this.msg = msg;
		this.msgId = msgId;
	},

	/**
	 * 消息签收报文
	 * @param {Object} messageIdList
	 */
	SignPacket: function(messageIdList) {
		this.type = PacketType.SIGN_PACKET;
		this.messageIdList = messageIdList;
	}
}