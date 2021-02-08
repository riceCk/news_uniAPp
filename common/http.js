export default function $http(options) {
	const {url, data} = options
	const dataObj  = {
		"user_id": "5fe08853ee98e30001c0e7cc",
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