<template>
	<view class="follow">
		<view class="follow-tab">
			<view class="follow-tab__box">
				<view class="follow-tab__item" :class="{active: activeIndex === 0}" @click="tab(0)">文章</view>
				<view class="follow-tab__item" :class="{active: activeIndex === 1}"@click="tab(1)">作者</view>
			</view>
		</view>
		<view class="follow-list">
			<swiper class="follow-list__swiper" :current="activeIndex" @change="change">
				<swiper-item >
					<list-scroll>
						<uni-load-more v-if="list.length === 0 && !followShow" iconType="snow" status="loading"></uni-load-more>
						<view class="no-data" v-if="followShow">没有收藏文章</view>
						<list-card 
							v-for="(item, index) in list" 
							types="follow"
							:mode="item.mode" 
							:key="index"
							:item="item">
						</list-card>
					</list-scroll>
				</swiper-item>
				<swiper-item>
					<list-scroll>
						<uni-load-more v-if="authorLists.length === 0 && !articleShow" iconType="snow" status="loading"></uni-load-more>
						<view class="no-data" v-if="articleShow">没有关注作者</view>
						<list-author v-for="(item, index) in authorLists" :key="index" :item="item"></list-author>
					</list-scroll>
				</swiper-item>
			</swiper>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeIndex: 0,
				list: [],
				authorLists: [],
				articleShow: false,
				followShow: false
			}
		},
		onLoad () {
			// 自定义事件只能在打开的页面触发
			uni.$on('update_article', (e) => {
				this.getFollow()
			})
			uni.$on('update_author', () => {
				this.getAuhtor()
			})
			this.getFollow()
			this.getAuhtor()
		},
		methods: {
			tab (index) {
				this.activeIndex = index
			},
			async getFollow () {
				const {data} = await this.$api.get_follow()
				this.list = data.data
				console.log(data.data, 88888888)
				this.followShow = this.list.length === 0 ? true : false
			},
			async getAuhtor () {
				const {data} = await this.$api.get_author()
				this.authorLists = data.data
				console.log(data.data, 87989789)
				this.articleShow = this.authorLists.length === 0 ? true : false
			},
			change (data) {
				this.activeIndex = data.detail.current
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		display: flex;
	}

	.follow {
		// height: 100%;
		display: flex;
		flex-direction: column;
		flex: 1;
		box-sizing: border-box;

		.follow-tab {
			height: 30px;
			padding: 10px 20px;
			border-bottom: 1px #f5f5f5 solid;

			.follow-tab__box {
				display: flex;
				width: 100%;
				height: 100%;
				border-radius: 5px;
				border: 1px $mk-base-color solid;

				.follow-tab__item {
					display: flex;
					justify-content: center;
					align-items: center;
					color: #666;
					font-size: 14px;
					width: 100%;

					&:first-child {
						border-right: 1px $mk-base-color solid;
					}

					&.active {
						color: $mk-base-color;
					}

				}
			}
		}

		.follow-list {
			flex: 1;

			.follow-list__swiper {
				height: 100%;

				.swiper-item {
					height: 100%;
				}
			}
		}
	}

	.no-data {
		padding: 50px;
		font-size: 14px;
		color: #999;
		text-align: center;
	}
</style>
