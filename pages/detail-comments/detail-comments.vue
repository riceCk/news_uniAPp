<template>
	<view>
		<view class="comments-content" v-for="item in commentsList" :key="item.comment_id">
			<comments-box :comments="item" @reply="reply"></comments-box>
		</view>
		<uni-load-more  v-if="commentsList.length === 0 || commentsList.length > 5" iconType="snow" :status="loading"></uni-load-more>
		<release ref="popup" @submit="submit"></release>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				commentsList: [],
				formData: {
					page: 1, 
					pageSize: 5,
					article_id: ''
				},
				replyFormData: {},
				loading: 'loading'
			}
		},
		onLoad (query) {
			this.formData.article_id = query.id
			this.getComments()
		},
		/**
		 * 向上加载
		 */
		onReachBottom () {
			if (this.loading === 'noMore') return
			console.log(this.formData.page, 90890890)
			this.formData.page++
			this.getComments()
		},
		methods: {
			
			// 请求评论内容
			async getComments () {
				const {data} = await this.$api.get_comments(this.formData)
				if (data.length === 0) {
					this.loading = 'noMore'
					return
				}
				let oldFormData = JSON.parse(JSON.stringify(this.commentsList))
				oldFormData.push(...data)
				this.commentsList = oldFormData
				
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
					article_id: this.formData.article_id,
					...content
				}
				// 数据重置，避免key重复，添加重复数据
				this.commentsList =  []
				this.formData.page = 1
				this.loading = 'loading'
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
			// 调用回复方法
			reply (e) {
				this.replyFormData = {
					"comment_id": e.comments.comment_id,
					"is_reply": e.is_reply
				}
				if (e.comments.reply_id) {
					this.replyFormData.reply_id = e.comments.reply_id
				}
				this.openComment()
			},
			openComment () {
				this.$refs.popup.open()
			},
		}
	}
</script>

<style lang="scss">
	.comments-content {
		padding: 0 15px;
	}
</style>

