'use strict';
const db = uniCloud.database()
exports.main = async (event, context) => {
	const {
		user_id,
		article_id
	} = event
	const userinfo = await db.collection('user').doc(user_id).get()
	console.log(8988888)
	//返回数据给客户端
	return userinfo
};
