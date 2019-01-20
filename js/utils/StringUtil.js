/**
 * 判断字符串是否为空
 * @param {Object} str
 */
function isNotEmpty(str) {
	if(str != null && str != "" && str != undefined) {
		return true;
	}
	return false;
}