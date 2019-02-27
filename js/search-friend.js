/**
 * 通过参数查找用户
 * 
 * @param {Object}
 * 参数对象内容{id:'',username:''}
 */
function search(params, callback) {
	var url = "/user/search/";
	AjaxUtil.ajaxWithToken({
		url: url,
		type: 'get',
		async: true,
		data: params
	}, function(data) {
		var userInfo = data.data;
		console.log("好友搜索结果：" + JSON.stringify(data))
		// 判断是否为好友,添加额外字段
		isFriendRelation(userInfo);

		callback(userInfo);
	});
}
/**
 * 查看搜索出来的好友是否为好友,
 * 如果是好友添加added字段到搜索结果中
 * 
 * @param {Object} userInfo
 */
function isFriendRelation(userInfo) {
	if(userInfo) {
		var url = "/user/isFriendRelation";

		AjaxUtil.ajaxWithToken({
			url: url,
			type: 'get',
			async: false,
			data: {
				'otherUserId': userInfo.id,
			}
		}, (data) => {
			if(data) {
				userInfo.added = data.data;
			}
		});
	}
}