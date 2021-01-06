<template>
	<view class="home">
		<!-- 自定义组件 -->
		<navbar></navbar>
		<tab @tab="tab" :tabIndex="tabIndex" :tableList="tableList"></tab>
		<view class="home-list">
			<list :tabIndex="tabIndex" :tab="tableList" @change="change"></list>
		</view>
	</view>
</template>

<script>
	// easyCom components/组件名/组件名.vue  局部引入
	export default {
		data() {
			return {
				title: 'Hello',
				tableList: [],
				tabIndex: 0, // 内容滑动index
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
			tab({data,index}) {
				this.tabIndex = index
			},
			change (current) {
				this.tabIndex = current
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
