<template>
	<view class="icons" @click.stop="likeTap">
		<uni-icons size="20" color="#f07373" :type="like ? 'heart-filled' : 'heart'"></uni-icons>
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
			}
		},
		data() {
			return {
				like: false
			};
		},
		methods: {
			likeTap () {
				console.log('收藏')
				this.like = !this.like
				this.setUpdateLikes()
			},
			setUpdateLikes () {
				this.$api.update_like({
					user_id: '5fe08853ee98e30001c0e7ca',
					article_id: this.item._id
				})
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
