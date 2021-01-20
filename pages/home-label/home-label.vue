<template>
	<view class="label">
		<view class="label-box">
			<view class="label-header">
				<view class="label-title">我的标签</view>
				<view class="label-edit" @click="editLabel">{{is_edit ? '完成' : '编辑'}}</view>
			</view>
			<uni-load-more v-if="loading" status="loading" iconType="snow"></uni-load-more>
			<view v-else class="label-content">
				<view  class="label-content__item" v-for="(item, index) in labelList" :key="item._id">
					{{item.name}}
					<uni-icons v-if="is_edit" type="clear" size="20" color="red" class="icons-close" @click="del(index)"></uni-icons>
				</view>
				<view v-if="labelList.length === 0 && !loading" class="no-data">
					当前没有数据
				</view>
			</view>
		</view>
		<view class="label-box">
			<view class="label-header">
				<view class="label-title">标签推荐</view>
			</view>
			<uni-load-more v-if="loading" status="loading" iconType="snow"></uni-load-more>
			<view v-else class="label-content">
				<view 
					class="label-content__item" 
					@click="add(index)"
					v-for="(item, index) in list" 
					:key="item._id">
					{{item.name}}
				</view>
				<view v-if="list.length === 0 && !loading" class="no-data">
					当前没有数据
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				is_edit: false,
				labelList: [],
				list: [],
				loading: true
			}
		},
		onLoad () {
			this.getLabel()
		},
		methods: {
			editLabel () {
				this.is_edit = !this.is_edit
				if (!this.is_edit) {
					const newArrIds = this.labelList.map(item => item._id)
					this.setUpdateLabel(newArrIds)
				}
			},
			async getLabel () {
				this.loading = true
				const {data} = await this.$api.get_label({type: 'all'})
				this.loading = false
				this.labelList = data.filter(item => item.current)
				this.list = data.filter(item => !item.current)
			},
			// 删除我的标签
			del (index) {
				this.list.push(this.labelList[index])
				this.labelList.splice(index, 1)
			},
			// 新增我的标签
			add (index) {
				if (!this.is_edit) return
				this.labelList.push(this.list[index])
				this.list.splice(index, 1)
			},
			async setUpdateLabel (label) {
				uni.showLoading()
				const res = await this.$api.update_label({label})
				uni.hideLoading()
				uni.showToast({
					title: '更新成功',
					icon: 'none'
				})
				uni.$emit('labelChange')
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f5f5f5;
	}
	.label {
		.label-box {
			background-color: #FFFFFF;
			margin-bottom: 10px;
			.label-header {
				display: flex;
				justify-content: space-between;
				padding: 10px 15px;
				font-size: 14px;
				color: #666;
				border-bottom: 1px #f5f5f5 solid;
				.label-edit {
					color: #30b33a;
					font-weight: bold;
				}
			}
			.label-content {
				display: flex;
				flex-wrap: wrap;
				padding: 15px;
				padding-top: 0;
				.label-content__item {
					position: relative;
					padding: 2px 5px;
					margin-top: 12px;
					margin-right: 10px;
					border-radius: 5px;
					border: 1px #666 solid;
					font-size: 14px;
					color: #666;
					.icons-close {
						position: absolute;
						right: -8px;
						top: -8px;
						background-color: #fff;
						border-radius: 8px;
					}
				}
			}
		}
	}
	.no-data {
		padding: 50px 0;
		width: 100%;
		color: #999;
		font-size: 14px;
		text-align: center;
	}
</style>
