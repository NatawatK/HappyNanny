import Vue from "vue";
import Vuex from "vuex";
import { SET_CHANNEL } from './mutation-types';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    channels: []
  },
  mutations: {
    [SET_CHANNEL](state, channels){
      state.channels = channels
    }
  },
  actions: {},
  modules: {}
});
