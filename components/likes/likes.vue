<template>
	<view class="icons" @click.stop="likeTap">
		<uni-icons type="heart"></uni-icons>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		methods: {
			likeTap () {
				console.log('收藏')
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
