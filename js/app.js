window.app = {
	/**
	 * 后端服务器地址
	 * 
	 */
	serverUrl: "http://你的后端服务器地址:8080",
	/**
	 * im通讯地址
	 */
	imServerUrl: "ws://你的后端服务器地址:8090/ws",
	/**
	 * 图片服务器地址
	 */
	imgserverUrl: "http://你的后端服务器地址:8888/fdfs/",

	/**
	 * 全局ajax超时时间
	 */
	globalTimeout: 10000,
	/**
	 * 心跳评率,每5秒发送一次
	 */
	heartBeatIdle: 50 * 1000,

	/**
	 * 自定义header头
	 */
	customHeader: {
		userToken: 'X_USER_TOKEN'
	},

	/**
	 * 返回数据状态
	 */
	dataStatus: {
		success: 200,
		error: 500
	},

	/**
	 * 判断字符串是否为空
	 * @param {Object} str
	 */
	isNotEmpty: function(str) {
		if(str != null && str != "" && str != undefined) {
			return true;
		}
		return false;
	},

	/**
	 * 展示消息框
	 * @param {Object} msg
	 * @param {Object} type
	 */
	showToast: function(msg, type) {
		plus.nativeUI.toast(msg, {
			icon: "img/" + type + ".png",
			verticalAlign: "center"
		});
	},

	/**
	 * 将用户token保存到storage中
	 * @param {Object} token
	 */
	setUserGlobalToken: function(token) {
		plus.storage.setItem("token", token);
	},

	/**
	 * 返回用户token
	 */
	getUserGlobalToken: function() {
		// 从缓存中取出全局用户数据
		var token = plus.storage.getItem("token");
		return token;
	},

	/**
	 * 将缓存中的user token清除
	 */
	removeUserGlobalToken: function() {
		plus.storage.removeItem("token");
	},

	/**
	 * 保存全局用户数据
	 * @param {Object} user
	 */
	setUserGlobalInfo: function(user) {
		// 将json数据转换成字符串
		var userInfoStr = JSON.stringify(user);
		// 将用户数据写入缓存中
		plus.storage.setItem("userInfo", userInfoStr);
	},

	/**
	 * 从缓存中取出全局用户数据
	 */
	getUserGlobalInfo: function() {
		// 从缓存中取出全局用户数据
		var userInfoStr = plus.storage.getItem("userInfo");
		return JSON.parse(userInfoStr);
	},

	/**
	 * 清除缓存中全局用户数据
	 */
	removeUserGlobalInfo: function() {
		plus.storage.removeItem("userInfo");
	},

	/**
	 * 清空缓存
	 */
	clearStorage: function() {
		plus.storage.clear();
	},

	/**
	 * 全局ajax 不会封装等以后做优化
	 */
	globalAjax: function(option, successCallback) {
		// 显示稍等
		plus.nativeUI.showWaiting("请稍等...");
		mui.ajax(option.url, {
			type: option.type,
			data: option.data,
			processData: option.processData,
			contentType: option.contentType,
			headers: {
				'X_USER_TOKEN': app.getUserGlobalToken()
			},
			timeout: app.globalTimeout,
			success: function(data) {
				// 收到服务器响应,关闭等待框
				plus.nativeUI.closeWaiting();
				//服务器返回响应，根据响应结果，分析是否登录成功
				if(data.code == app.dataStatus.success) {
					// 成功后执行的回调
					successCallback(data);
				} else {
					app.showToast(data.info);
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				plus.nativeUI.closeWaiting();
				//异常处理；
				if(type == 'timeout') {
					app.showToast("连接服务器超时,请稍后再试");
				}
			}
		});
	}
};