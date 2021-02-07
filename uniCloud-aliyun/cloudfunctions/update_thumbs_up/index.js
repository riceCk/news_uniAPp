'use strict';
const db = uniCloud.database()
const dbCmd = db.command

exports.main = async (event, context) => {
	const {user_id, article_id} = event
	const userinfo = await db.collection('user').doc(user_id).get()
	const thumbs_up_article_ids = userinfo.data[0].thumbs_up_article_ids
	
	let dbCmdFuns = null
	let thumbsUpCount = null
	if (thumbs_up_article_ids.includes(article_id)) {
		dbCmdFuns = dbCmd.pull(article_id)
		thumbsUpCount = dbCmd.inc(-1)
	} else {
		dbCmdFuns = dbCmd.addToSet(article_id)
		thumbsUpCount = dbCmd.inc(1)
	}
	await db.collection('user').doc(user_id).update({
		thumbs_up_article_ids: dbCmdFuns
	})
	await db.collection('article').doc(article_id).update({
		thumbs_up_count: thumbsUpCount
	})
	//返回数据给客户端
	return {
		code: 200,
		msg: '数据请求成功',
		data: userinfo.data[0]
	}
};
