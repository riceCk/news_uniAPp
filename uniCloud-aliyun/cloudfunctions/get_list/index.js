'use strict';
// 获取数据库的引用
const db = uniCloud.database()
exports.main = async (event, context) => {
	const {name} = event
	// 聚合：更精细化的去处理数据 求和，分组，指定哪些字段
	const list = await db.collection('article')
	.aggregate()
	.match({
		classify: name
	})
	.project({
		content: false
	})
	.end()
	//返回数据给客户端
	return {
		code: 200,
		msg: '数据请求成功',
		data: list.data
	}
};
