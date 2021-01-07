import $http from '../http.js';
export const get_label = (data) => {
	// 请求云函数
	return $http({
		url: 'get_label',
		data
	})
}

export const get_list = (data) => {
	// 请求云函数
	return $http({
		url: 'get_list',
		data
	})
}

export const update_like = (data) => {
	return $http({
		url: 'update_like',
		data
	})
}