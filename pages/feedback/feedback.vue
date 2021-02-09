<template>
	<view>
		<view class="feedback-title">意见反馈：</view>
		<view class="feedback-content">
			<textarea class="feedback-textarea" v-model="content" placeholder="请输入您要反馈的问题" />
		</view>
		<view class="feedback-title">反馈图片：</view>
		<view class="feedback-image-box">
			<view class="feedback-image-item" v-for="(item, index) in imageLists" :key="index">
				<view class="close-icon" @click="del(index)">
					<uni-icons type="closeempty" size="18" color="#fff"></uni-icons>
				</view>
				<view class="image-box">
					<image :src="item.url" mode="aspectFill"></image>
				</view>
			</view>
			<view v-if="imageLists.length < 5" class="feedback-image-item" @click="addImage">
				<view class="image-box">
					<uni-icons type="plusempty" size="50" color="#eee"></uni-icons>
				</view>
			</view>
		</view>
		<button class="feedback-button" type="primary" @click="submit">提交反馈意见</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imageLists: [],
				content: ''
			}
		},
		methods: {
			addImage () {
				const count = 5 - this.imageLists.length
				// 选择图片
				uni.chooseImage({
					count: count, // 最多选择五张
					success: (res) => {
						const tempFilePaths = res.tempFilePaths
						const tempFiles = res.tempFiles
						tempFilePaths.forEach((item, index) => {
							// 处理H5多选的情况
							if (index < count) {
								this.imageLists.push({
									url: item,
									name: tempFiles[index].name
								})
							}
							
						})
					}
				})
			},
			del (index) {
				this.imageLists.splice(index, 1)
			},
			async submit () {
				let feedbackImages = []
				uni.showLoading()
				// 文件只能一张一张上传
				for(let i = 0; i < this.imageLists.length; i++) {
					const file = this.imageLists[i]
					const filePath = await this.uploadFiles(file)
					feedbackImages.push(filePath)
				}
				
				this.updateFeedback({content: this.content, feedbackImages})
			},
			// 上传图片
			async uploadFiles (file) {
				const result = await uniCloud.uploadFile({
					filePath: file.url,
					cloudPath: file.name,
				})
				return result.fileID
			},
			// 上传反馈接口
			async updateFeedback (formData) {
				try{
					const res = await this.$api.update_feedback(formData);
					uni.showToast({
						title: "反馈提交成功",
						icon: "none"
					})
					uni.hideLoading()
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/tabar/my/my'
						}, 2000)
					})
				}catch(e){
					uni.showToast({
						title: "反馈提交失败",
						icon: "none"
					})
					uni.hideLoading()
				}
			}
		}
	}
</script>

<style lang="scss">
	.feedback-title {
		margin: 15px;
		margin-bottom: 0;
		font-size: 14px;
		color: #666;
	}
	.feedback-content {
		margin: 15px;
		padding: 10px;
		box-sizing: border-box;
		border: 1px #eee solid;
		.feedback-textarea {
			font-size: 12px;
			width: 100%;
			height: 100px;
		}
	}
	.feedback-image-box {
		display: flex;
		flex-wrap: wrap;
		padding: 10px;
		.feedback-image-item {
			position: relative;
			width: 33.33%;
			height: 0;
			padding-top: 33.33%;
			box-sizing: border-box;
			.close-icon {
				display: flex;
				justify-content: center;
				align-items: center;
				position: absolute;
				right: 0;
				top: 0;
				width: 22px;
				height: 22px;
				border-radius: 50%;
				background-color: #ff5a5f;
				z-index: 2;
			}
			.image-box {
				display: flex;
				justify-content: center;
				align-items: center;
				position: absolute;
				top: 5px;
				right: 5px;
				bottom: 5px;
				left: 5px;
				border: 1px #eee solid;
				border-radius: 5px;
				overflow: hidden;
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
	.feedback-button {
		margin: 0 15px;
		background-color: $mk-base-color;
	}
</style>
