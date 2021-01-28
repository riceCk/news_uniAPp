'use strict';
const db = uniCloud.database()
const $ = uniCloud.aggregate // 聚合的操作符
exports.main = async (event, context) => {
	//event为客户端上传的参数
	cosnt {user_id, article_id} = event;

	let user = await db.collection('user').doc(user_id).get()
	user = user.data[0]
	let list = await db.collection('article')
	.aggregate()
	.addFields({ // 新增is_author_like 字段，聚合author.id 在不在 user.author_likes_ids 中
		// 是否关注作者
			is_author_like: $.in(['$author.id', user.author_likes_ids]),
			// 是否收藏文章
			is_like: $.in(['$_id', user.article_likes_ids]),
			// 是否点赞
			is_thumbs_up: $.in(['$_id', user.thumbs_up_article_ids])
	})
	.match({
		_id: article_id
	})
	.project({
		coments: 0
	})
	.end()

	//返回数据给客户端
	return {
		code:200,
		msg:'数据请求成功',
		data:list.data[0]
	}
};
