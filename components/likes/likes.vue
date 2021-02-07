<template>
	<view class="icons" @click.stop="likeTap">
		<uni-icons size="20" color="#f07373" :type="item.is_like ? 'heart-filled' : 'heart'"></uni-icons>
	</view>
</template>

<script>
	export default {
		props: {
			item: {
				type: Object,
				default () {
					return {}
				}
			},
			types: {
				type: String,
				default: ''
			}
		},
		data() {
			return {};
		},
		methods: {
			likeTap () {
				this.item.is_like = !this.item.is_like
				this.setUpdateLikes()
			},
			async setUpdateLikes () {
				uni.showLoading()
				const param = {
					user_id: '5fe08853ee98e30001c0e7ca',
					article_id: this.item._id
				}
				const {code} = await this.$api.update_like(param)
				if (code === 200) {
					uni.showToast({
						title: this.item.is_like ? '收藏成功' : '取消收藏',
						icon: 'none'
					})
					uni.$emit('update_article', this.types)
				}
				uni.hideLoading()
			}
		}
	}
</script>

<style>
	.icons {
		position: absolute;
		right: 0;
		top: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 20px;
		height: 20px;
	}
</style>
