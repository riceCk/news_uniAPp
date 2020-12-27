<template>
	<view class="home">
		<!-- 自定义组件 -->
		<navbar></navbar>
		<tab @tab="tab" :tableList="tableList"></tab>
		<list-scroll>
			<list-card mode="base"></list-card>
			<list-card mode="image"></list-card>
			<list-card mode="column"></list-card>
		</list-scroll>
	</view>
</template>

<script>
	// easyCom components/组件名/组件名.vue  局部引入
	import listCard from '../../../components/list-card/list-card.vue'
	export default {
		components: {
			listCard
		},
		data() {
			return {
				title: 'Hello',
				tableList: []
			}
		},
		onLoad() {
			this.getLabel()
		},
		methods: {
			async getLabel() {
				// 请求云函数
				const {
					code,
					data
				} = await this.$api.get_label()
				this.tableList = data
			},
			tab({
				data,
				index
			}) {
				console.log(data, index)
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		display: flex;
	}

	.home {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;

		.home-list {
			flex: 1;
			box-sizing: border-box;
		}
	}
</style>
