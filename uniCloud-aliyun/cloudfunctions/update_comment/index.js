'use strict';
const db = uniCloud.database()
const $ = db.command.aggregate
const dbCmd = db.command

exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		user_id,  // 用户id
		article_id, // 文章的id
		content,  // 评论id
		comment_id = '', // 评论id
		is_reply=false, // 是否子回复
		reply_id=""
	} = event;
	let user = await db.collection('user').doc(user_id).get()
	user = user.data[0]
	// 获取当前文章信息
	const article = await db.collection('article').doc(article_id).get()
	// 获取文章下的所有评论
	const comments = article.data[0].comments
	let commentObj = {
		comment_id: genID(5), // 评论id
		comment_content: content, // 评论内容
		create_time: new Date().getTime(), // 创建时间
		is_reply, // 当前主回复还是子回复
		author: { // 作者信息
			author_id: user._id,
			author_name: user.author_name, //作者名称
			avatar: user.avatar, // 作者头像
			professional: user.professional, // 作者专业
		},
		replys: [], // 回复字段
	}
	// 评论文章
	if(comment_id === '') {
		commentObj.replys = []
		commentObj = dbCmd.unshift(commentObj)
	} else {
		// 回复文章的评论
		// 获取评论索引
		let commentIndex = comments.findIndex(item => item.comment_id === comment_id)
		let commentAuthor = ''
		if (is_reply) {
			// 子回复
			commentAuthor = comments[commentIndex].replys.find(item => item.comment_id === reply_id)
		} else {
			// 主回复
			// 获取作者信息
			commentAuthor = comments.find(item => item.comment_id === comment_id)
		}
		commentAuthor = commentAuthor.author.author_name
		commentObj.to = commentAuthor
		// 更新回复信息
		commentObj = {
			[commentIndex]: {
				replys: dbCmd.unshift(commentObj)
			}
		}
		/**
		 * 
		let obj = {
			arr: [{name: 1}, {name: 2}]
		 }
		 xxx.undate({
			 arr: {
				 1: {
					 name: 3
				 }
			 }
		 })
		 */
	}
	await db.collection('article').doc(article_id).update({
		comments: commentObj
	})
	//返回数据给客户端
	return {
		code: 200,
		msg: '数据更新成功'
	}
};

// 简单生成一个id
function genID(length) {
	return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36)
}
