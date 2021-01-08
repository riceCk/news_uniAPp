'use strict';
// 获取数据库的引用
const db = uniCloud.database()
const $ = db.command.aggregate
exports.main = async (event, context) => {
	const {value, user_id} = event
	
	// 获取用户信息数据
	const userinfo = await db.collection('user').doc(user_id).get()
	const article_likes_ids = userinfo.data[0].article_likes_ids
	// 聚合：更精细化的去处理数据 求和，分组，指定哪些字段
	const list = await db.collection('article')
	.aggregate()
	// 追加字段
	.addFields({
		// article 表中"_id" 里面是否存在 "article_likes_ids" 数组中
		is_like: $.in(['$_id', article_likes_ids])
	})
	.project({
		content: false
	})
	.match({
		title: new RegExp(value)
	})
	.end()
	//返回数据给客户端
	return {
		code: 200,
		msg: '数据请求成功',
		data: list.data
	}
};
