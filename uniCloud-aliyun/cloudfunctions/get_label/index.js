'use strict';
// 获取数据库的引用
const db = uniCloud.database()
const $ = db.command.aggregate
exports.main = async (event, context) => {
	// let label = await db.collection("label").get();
	const {user_id, type} = event
	let matchObj = {}
	if (type !== 'all') {
		matchObj = {
			current: true
		}
	}
	let userinfo = await db.collection('user').doc(user_id).get()
	userinfo = userinfo.data[0]
	// 会有label_ids = ['leabel_id']
	let label = await  db.collection('label')
	.aggregate()
	.addFields({
		// 新增current参数，判断"label_ids"里面是否有$_id参数
		current: $.in(['$_id', $.ifNull([userinfo.label_ids, []])])
	})
	// match 相当于sql中where，条件判断
	.match(matchObj)
	.end()
	
	//返回数据给客户端
	return {
		code: 200,
		msg: '数据请求成功',
		data: label.data
	}
};
