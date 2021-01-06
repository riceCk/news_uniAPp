<template>
	<swiper :current="tabIndex" class="home-swiper" @change="change">
		<swiper-item v-for="(item, index) in tab" :key="index" class="swiper-item">
			<list-item :list="listCatchData[index]"></list-item>
		</swiper-item>
	</swiper>
</template>

<script>
	import listItem from './list-item.vue'
	export default {
		components: {
			listItem
		},
		props: {
			tab: {
				type: Array
			},
			tabIndex: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				list: [],
				listCatchData: {},
			};
		},
		watch: {
			tab(newVal) {
				if(newVal.length === 0) return
				this.getList(this.tabIndex)
			}
		},
		created() {},
		methods: {
			change(e) {
				const {
					current
				} = e.detail
				this.$emit('change', current)
				console.log(this.listCatchData[current], 99999999)
				if (!this.listCatchData[current]) {
					this.getList(current)
				}
			},
			async getList(current) {
				const {
					data
				} = await this.$api.get_list({
					name: this.tab[current].name
				})
				this.$set(this.listCatchData, current, data)
			}
		}
	}
</script>

<style lang="scss">
	.home-swiper {
		height: 100%;

		.swiper-item {
			height: 100%;
			overflow: auto;

			.list-scroll {
				height: 100%;
			}
		}
	}
</style>
