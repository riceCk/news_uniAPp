'use strict';
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event, context) => {
	const {user_id, author_id} = event
	const user = await db.collection('user').doc(user_id).get()
	const author_likes_ids = user.data[0].author_likes_ids
	let author_ids = null
	if (author_likes_ids.includes(author_id)) {
		author_ids = dbCmd.pull(author_id) // 删除当前传入的值
	} else {
		author_ids = dbCmd.addToSet(author_id) // addTost 存在相同的内容就不作处理，不存在就进行添加
	}
	await db.collection('user').doc(user_id).update({
		author_likes_ids: author_ids
	})
	//返回数据给客户端
	return {
		code: 200,
		msg: "更新成功"
	}
};
