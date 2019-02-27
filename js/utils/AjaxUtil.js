window.AjaxUtil = {
	/**
	 * 全局ajax 不会封装等以后做优化
	 */
	globalAjax: function(option, successCallback) {

		var settings = {
			headers: {}
		};

		// 设置api访问路径
		var baseUrl = app.serverUrl + option.url;
		if(option.externalUrl != undefined) {
			baseUrl = option.externalUrl
		}

		// 设置头部报文
		if(option.headers != undefined) {
			for(header in option.headers) {
				settings.headers[header] = option.headers[header];
			}
		}

		// 访问类型
		settings.type = option.type;
		
		// 发送的数据
		settings.data = option.data;
		
		// 设置发送的数据格式
		if(option.contentType === 'json') {
			settings.data = JSON.stringify(option.data);
			settings.headers['Content-Type'] = 'application/json';
		}

		// 是否对数据处理
		if(option.processData == undefined) {
			settings.processData = true;
		} else {
			settings.processData = option.processData;
		}

		// 设置是否异步 
		if(option.async != undefined) {
			settings.async = option.async;
		}

		// 超时时间
		settings.timeout = app.globalTimeout;

		// 成功的回调函数
		settings.success = function(data) {
			// 收到服务器响应,关闭等待框
			plus.nativeUI.closeWaiting();
			//服务器返回响应，根据响应结果，分析是否登录成功
			if(data.code == app.dataStatus.success) {
				// 成功后执行的回调
				successCallback(data);
			} else {
				app.showToast(data.info);
			}
		};

		// 出错的回调函数
		settings.error = function(xhr, type, errorThrown) {
			//异常处理；
			plus.nativeUI.closeWaiting();
			//异常处理；
			if(type == 'timeout') {
				app.showToast("连接服务器超时,请稍后再试");
			}
		};

		console.log("ajax调用的服务器地址: " + baseUrl);
		console.log("ajax调用服务器参数:" + JSON.stringify(settings));
		// 显示稍等
		plus.nativeUI.showWaiting("请稍等...");
		mui.ajax(baseUrl, settings);
	},
	/**
	 * 带上用户token访问api
	 * @param {Object} option
	 * @param {Object} successCallback
	 */
	ajaxWithToken: function(option, successCallback) {
		if(!option.headers) {
			option.headers = {};
		}

		option.headers[app.customHeader.userToken] = app.getUserGlobalToken();
		this.globalAjax(option, successCallback);
	},
	/**
	 * 访问外部api
	 * @param {Object} option
	 * @param {Object} successCallback
	 */
	externalAjax: function(option, successCallback) {
		option.externalUrl = option.url;
		this.globalAjax(option, successCallback);
	}
}