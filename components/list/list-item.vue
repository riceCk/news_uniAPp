<template>
	<list-scroll class="list-scroll" @loadmore="loadmore">
		<list-card 
			:mode="item.mode" 
			:item="item"
			v-for="(item, index) in list" 
			:key="index">
		</list-card>
		<uni-load-more v-if="list.length === 0 || list.length > 9" iconType="snow" :status="load.loading"></uni-load-more>
	</list-scroll>
</template>

<script>
	export default {
		props: {
			list: {
				type: Array,
				default () {
					return []
				}
			},
			load: {
				type: Object,
				default () {
					return {
						loading: 'loading'
					}
				}
			}
		},
		data () {
			return {}
		},
		methods: {
			loadmore () {
				this.$emit('loadmore')
			}
		}
	}
</script>

<style>
	.list-scroll {
		height: 100%;
	}
</style>
