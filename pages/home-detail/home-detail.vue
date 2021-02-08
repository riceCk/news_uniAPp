<template>
	<view class="detail">
		<view class="detail-title">
			{{formData.title}}
		</view>
		<view class="detail-header">
			<view class="detail-header__logo">
				<image :src="formData.author.avatar" mode="aspectFill"></image>
			</view>
			<view class="detail-header__content">
				<view class="detail-header__content-title">
					{{formData.author.author_name}}
				</view>
				<view class="detail-header__content-info">
					<text>{{formData.create_time}}</text>
					<text>{{formData.browse_count}} 浏览</text>
					<text>{{formData.thumbs_up_count}} 赞</text>
				</view>
			</view>
			<button class="detail-header__button" type="defualt" @click="follow(formData.author.id)">{{formData.is_author_like ? '取消关注' : '关注'}}</button>
		</view>
		<view class="detail-content">
			<div class="detail-html" >
				<u-parse :content="formData.content" :noData="noData"></u-parse>
			</div>
			<view class="detail-comment">
				<view class="comment-title">最新评论</view>
				<view class="comment-content" v-for="item in commentsList" :key="item.comment_id">
					<comments-box :comments="item" @reply="reply"></comments-box>
				</view>
			</view>
		</view>
		<view class="detail-bottom">
			<view class="detail-bottom__input" @click="openComment">
				<text>谈谈你的看法</text>
				<uni-icons type="compose" size="16" color="#f07373"></uni-icons>
			</view>
			<view class="detail-bottom__icons">
				<view class="detail-bottom__icons-box" @click="open">
					<uni-icons type="chat" size="22" color="#f07373"></uni-icons>
				</view>
				<view class="detail-bottom__icons-box" @click="likeTap">
					<uni-icons :type="formData.is_like ? 'heart-filled' : 'heart'" size="22" color="#f07373"></uni-icons>
				</view>
				<view class="detail-bottom__icons-box">
					<uni-icons :type="formData.is_thumbs_up ? 'hand-thumbsup-filled' : 'hand-thumbsup'" size="22" color="#f07373" @click="thumbsUpTap"></uni-icons>
				</view>
			</view>
		</view>
		<release ref="popup" @submit="submit"></release>
	</view>
</template>

<script>
	import uParse from '@/components/gaoyia-parse/parse.vue'
	export default {
		components: {
			uParse
		},
		data() {
			return {
				formData: {},
				replyFormData: {},
				noData: '<p style="text-align: center: color: #666">详情加载中</p>',
				commentsList: [],
			}
		},
		onLoad(query) {
			this.formData = JSON.parse(query.params)
			this.getDetail()
			this.getComments()
		},
		onReady () {
			
		},
		methods: {
			// 打开评论详情页面
			open () {
				uni.navigateTo({
					url: `../detail-comments/detail-comments?id=${this.formData._id}`
				})
			},
			openComment () {
				this.$refs.popup.open()
			},
			async getDetail () {
				const {data} = await this.$api.get_detail({article_id: this.formData._id})
				this.formData = data
			},
			// 发布
			submit(content){
				this.setUpdateComment({content,...this.replyFormData})
			},
			/**
			 * 更新评论
			 * @param {Object} content
			 */
			async setUpdateComment (content) {
				const formdata = {
					article_id: this.formData._id,
					...content
				}
				uni.showLoading()
				const res = await this.$api.update_comment(formdata)
				uni.hideLoading()
				uni.showToast({
					title: '评论发布成功',
					icon: 'none'
				})
				this.getComments()
				this.$refs.popup.close()
				this.replyFormData = {}
			},
			// 请求评论内容
			async getComments () {
				const {data} = await this.$api.get_comments({
					article_id: this.formData._id,
				})
				this.commentsList = data
			},
			// 调用回复方法
			reply (e) {
				console.log(e, 8978978)
				this.replyFormData = {
					"comment_id": e.comments.comment_id,
					"is_reply": e.is_reply
				}
				if (e.comments.reply_id) {
					this.replyFormData.reply_id = e.comments.reply_id
				}
				this.openComment()
			},
			// 关注、取消关注作者
			 follow (author_id) {
				this.setUpdateAuthor(author_id)
			},
			async setUpdateAuthor (author_id) {
				uni.showLoading()
				await this.$api.update_author({author_id})
				uni.$emit('update_author')
				uni.hideLoading()
				this.formData.is_author_like = !this.formData.is_author_like
				uni.showToast({
					title: this.formData.is_author_like ? '关注成功' : '取消关注',
					icon: "none"
				})
			},
			// 收藏喜欢
			async likeTap (article_id) {
				uni.showLoading()
				await this.$api.update_like({article_id: this.formData._id})
				uni.hideLoading()
				this.formData.is_like = !this.formData.is_like
				uni.$emit('update_article')
				uni.showToast({
					title: this.formData.is_like ? '收藏成功' : '取消收藏',
					icon: "none"
				})
			},
			thumbsUpTap () {
				this.setThumbsUp()
			},
			// 是否点赞
			async setThumbsUp () {
				uni.showLoading()
				await this.$api.update_thumbs_up({article_id: this.formData._id})
				uni.hideLoading()
				this.formData.is_thumbs_up = !this.formData.is_thumbs_up
				this.formData.is_thumbs_up ? this.formData.thumbs_up_count++ : this.formData.thumbs_up_count--
				uni.$emit('update_article')
				uni.showToast({
					title: this.formData.is_thumbs_up ? '点赞成功' : '取消点赞',
					icon: "none"
				})
			}
		}
	}
</script>

<style lang="scss">
	.detail {
		padding: 15px 0;
		padding-bottom: 54px;
	}

	.detail-title {
		padding: 0 15px;
		font-size: 18px;
		font-weight: bold;
		color: #333;
	}

	.detail-header {
		display: flex;
		align-items: center;
		margin-top: 10px;
		padding: 0 15px;

		.detail-header__logo {
			flex-shrink: 0;
			width: 40px;
			height: 40px;
			border-radius: 50%;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.detail-header__content {
			width: 100%;
			padding-left: 10px;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			font-size: 12px;

			.detail-header__content-title {
				font-size: 14px;
				color: #333;
			}

			.detail-header__content-info {
				color: #999;

				text {
					margin-right: 10px;
				}
			}
		}
		.detail-header__button {
			flex-shrink: 0;
			height: 30px;
			font-size: 12px;
			color: #fff;
			background-color: $mk-base-color;
		}
	}

	.detail-content {
		margin-top: 20px;
		min-height: 500px;
		.detail-html {
			padding:0 15px;
		}
		.detail-comment {
			margin-top: 30px;
			.comment-title {
				padding: 10px 15px;
				font-size: 14px;
				color: #666;
				border-bottom: 1px #f5f5ff solid;
			}
			.comment-content {
				padding: 0 15px;
				border-top: 1px #eee solid;
			}
		}
	}

	.detail-bottom {
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: center;
		width: 100%;
		height: 44px;
		border-top: 1px #f5f5f5 solid;
		background-color: #fff;
		box-sizing: border-box;

		.detail-bottom__input {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-left: 10px;
			padding: 0 10px;
			width: 100%;
			height: 30px;
			border: 1px #ddd solid;
			border-radius: 5px;

			text {
				font-size: 14px;
				color: #999;
			}
		}

		.detail-bottom__icons {
			display: flex;
			flex-shrink: 0;
			padding: 0 10px;

			.detail-bottom__icons-box {
				position: relative;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 44px;
			}
		}
	}
	

</style>

