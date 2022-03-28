const state = {
    token: '',
    userInfo: {},
    userRights: []
}

const getters = {
    token: state => state.token,
    userInfo(state) {
        return state.userInfo
    },
    userRights: state => state.userRights
}

const actions = {
    // userInfoAct(store, userInfo) {
        // store是一个对象，在引入对象的时候，可以进行解构引入
        // store.commit('mutationUserInfo', userInfo)
    userInfoAct({ commit }, userInfo) {
        commit('mutationUserInfo', userInfo)
    }
}

const mutations = {
    mutationToken(state, token) {
        state.token = token
    },
    mutationUserInfo(state, userInfo) {
        state.userInfo = userInfo
    },
    mutationRights(state, rights) {
        state.userRights = rights
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
// export default {
//     namespaced: true,
//     state: {
//         token: '',
//         userInfo: {}
//     },
//     getters: {
//         token: state => state.token,
//         userInfo(state) {
//             return state.userInfo
//         }
//     },
//     actions: {
//         // userInfoAct(store, userInfo) {
//             // store是一个对象，在引入对象的时候，可以进行解构引入
//             // store.commit('mutationUserInfo', userInfo)
//         userInfoAct({ commit }, userInfo) {
//             commit('mutationUserInfo', userInfo)
//         }
//     },
//     mutations: {
//         mutationToken(state, token) {
//             state.token = token
//         },
//         mutationUserInfo(state, userInfo) {
//             state.userInfo = userInfo
//         }
//     }
// }