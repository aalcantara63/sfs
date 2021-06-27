import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
      authenticated: false,
      user: null,
      roles: [],
    },
    mutations: {
      setAuthentication(state, status) {
        state.authenticated = status;
      },
      setUser(state, userl){
        state.user = userl;
      },
      setRoles(state, roles){
        state.roles = roles;
      },
    }
  });
  
  
  export default store;