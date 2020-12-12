import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let store = new Vuex.Store({
  state: {
    products: []
  },
  mutations: {
    SET_PRODUCTS_TO_STATE: (state, products) => {
      state.products = products
    }
  },
  actions: {
    LOAD_PRODUCTS({commit}){
      let URL = 'data.json'
      return fetch(URL)
      .then(response => {
        return response.json()
      })
      .then(products => {
        console.log(products);
        commit('SET_PRODUCTS_TO_STATE', products)
        // return products
      })
      .catch((error) => {
        console.log(error);
        return error
      })
    }
  },
  getters: {
    GET_PRODUCTS(state){
      return state.products
    }
  }
  // modules: {
  // }
})

export default store;