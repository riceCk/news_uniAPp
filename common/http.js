export default function $http(options) {
	const {url, data} = options
	return new Promise((reslove, reject) => {
		uniCloud.callFunction({
			name: url,
			data
		}).then(({result}) => {
			if (result.code === 200) {
				reslove(result)
			} else {
				reject(result)
			}
		}, () => {
			reject(result)
		})
	})
}