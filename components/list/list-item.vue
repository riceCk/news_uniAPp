<template>
	<list-scroll class="list-scroll">
		<list-card 
			:mode="item.mode" 
			:item="item"
			v-for="(item, index) in list" 
			:key="index">
		</list-card>
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
			}
		}
	}
</script>

<style>
	.list-scroll {
		height: 100%;
	}
</style>
