export default {
  actions: {
    changeValue({commit}) {
      commit('updateTest')
    }
  },
  mutations: {
    updateTest(state) {
      state.sendTest = state.sendTest + 1
    }
  },
  state: {
    sendTest: 0
  },
  getters: {
    compTest(state) {
      return state.sendTest
    }
  },
}