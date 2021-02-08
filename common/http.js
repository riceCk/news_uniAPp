import store from '../store/index.js'
export default function $http(options) {
	const {url, data} = options
	const dataObj  = {
		"user_id": store.state.userinfo._id,
		...data
	}
	return new Promise((reslove, reject) => {
		uniCloud.callFunction({
			name: url,
			data: dataObj
		}).then(({result}) => {
			if (result.code === 200) {
				reslove(result)
			} else {
				reject(result)
			}
		}, (error) => {
			reject(error)
		})
	})
}