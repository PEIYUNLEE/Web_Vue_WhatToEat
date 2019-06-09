import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        order: [
        ],
        totalPrice:0
    }
})
export default store //用export default 封裝程式碼，讓外部可以引用