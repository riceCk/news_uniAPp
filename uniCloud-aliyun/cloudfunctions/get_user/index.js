'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
	const {user_id = ''} = event;
	const userinfo = await db.collection('user').doc(user_id).get()
	if (!user_id) {
		return {
			code: 201,
			msg: '获取用户信息失败'
		}
	}
	//返回数据给客户端
	return {
		code: 200,
		msg: '获取数据成功',
		data: userinfo.data[0]
	}
};
