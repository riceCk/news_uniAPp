<template>
	<swiper :current="tabIndex" class="home-swiper" @change="change">
		<swiper-item v-for="(item, index) in tab" :key="index" class="swiper-item">
			<list-item :list="listCatchData[index]" :load="load[index]" @loadmore="loadmore"></list-item>
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
				load: {},
				pageSize: 10
			};
		},
		watch: {
			tab(newVal) {
				if(newVal.length === 0) return
				this.load = {}
				this.listCatchData = {}
				this.getList(this.tabIndex)
			}
		},
		created() {
			uni.$on('update_article', (e) => {
				if (e === 'follow') {
					this.load = {}
					this.listCatchData = {}
					this.getList(this.tabIndex)
				}
			})
		},
		methods: {
			loadmore () {
				if (this.load[this.tabIndex].loading === 'noMore') return
				this.load[this.tabIndex].page++
				this.getList(this.tabIndex)
			},
			change(e) {
				const {
					current
				} = e.detail
				this.$emit('change', current)
				if (!this.listCatchData[current]) {
					this.getList(current)
				}
			},
			async getList(current) {
				if (!this.load[current]) {
					this.load[current] = {
						page: 1,
						loading: 'loading'
					}
				}
				const {
					data
				} = await this.$api.get_list({
					name: this.tab[current].name,
					page: this.load[current].page,
					pageSize: this.pageSize
				})
				if (data.length === 0) {
					let oldLoad = {
						...this.load[current],
						loading: 'noMore'
					}
					this.$set(this.load, current, oldLoad)
					this.$forceUpdate()
					return
				}
				let oldList = this.listCatchData[current] || []
				oldList.push(...data)
				this.$set(this.listCatchData, [current], oldList)
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
