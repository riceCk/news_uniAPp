// vuex 状态管理

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

const store = new Vuex.Store({
	// 数据源
	state: {
		historyLists: []
	},
	mutations: {
		SET_HISTORY_LISTS (state, history) {
			state.historyLists = history
		},
	},
	// 处理异步的方法；调用mutaions中的方法
	actions: {
		set_history ({commit, state}, history) {
			let list = state.historyLists
			list.unshift(history)
			commit('SET_HISTORY_LISTS', list)
		}
	}
})

export default store