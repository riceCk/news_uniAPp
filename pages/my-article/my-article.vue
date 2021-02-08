<template>
	<view>
		<list-card v-for="item in lists" :key="item._id" :item="item" :mode="item.mode"></list-card>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				lists: []
			}
		},
		onLoad () {
			this.getMyArticle()
		},
		methods: {
			async getMyArticle () {
				const {data} = await this.$api.get_my_article()
				this.lists = data.data
				console.log(data, 9789789)
			}
		}
	}
</script>

<style>

</style>
