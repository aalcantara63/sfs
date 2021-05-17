// import '@fortawesome/fontawesome-free/css/all.min.css'
// import 'bootstrap-css-only/css/bootstrap.min.css'
//import 'mdbvue/lib/css/mdb.min.css'
import Vue from 'vue'
import Vuex from 'vuex'
import VModal from 'vue-js-modal'
import { i18n } from '@/plugins/i18n'
import App from './App.vue'
import VuePaginate from 'vue-paginate'
import VTooltip from 'v-tooltip'
import Cors from 'cors'
// import orouter from './frontend/router'
import router from './backoffice/router/index.js'

import * as VueGoogleMaps from 'vue2-google-maps'

import Ionic from '@ionic/vue';
import '@ionic/core/css/ionic.bundle.css';
import { add } from "ionicons/icons";
import { remove } from "ionicons/icons";
import { trash } from "ionicons/icons";
import { create } from "ionicons/icons";
import { addIcons } from "ionicons";
import { cart } from "ionicons/icons";
import { contact } from "ionicons/icons";
import { hammer } from "ionicons/icons";
import { list } from "ionicons/icons";
import { arrowRoundBack } from "ionicons/icons";
import { eye } from "ionicons/icons";
import { share } from "ionicons/icons";
import { shareAlt } from "ionicons/icons";
import { call } from "ionicons/icons";
import { mail } from "ionicons/icons";
import { locate } from "ionicons/icons";
import { checkmark } from "ionicons/icons";
import { home} from "ionicons/icons"
import { globe} from "ionicons/icons"
import { pin} from "ionicons/icons"
import { close} from "ionicons/icons"
// import { reader} from "ionicons/icons"
import { refresh} from "ionicons/icons"
import { grid} from "ionicons/icons"
import { print} from "ionicons/icons"
import { checkmarkCircle} from "ionicons/icons"
import { car} from "ionicons/icons"
import { skipBackward} from "ionicons/icons"
import { arrowDropleft} from "ionicons/icons"





// import AppMenu from './Menu';
addIcons({
  "ios-add": add.ios,
  "md-add": add.md,
  "ios-remove": remove.ios,
  "md-remove": remove.md,
  "ios-trash": trash.ios,
  "md-trash": trash.md,
  "ios-create": create.ios,
  "md-create": create.md,
  "md-cart": cart.md,
  "ios-cart": cart.ios,
  "md-contact": contact.md,
  "ios-contact": contact.ios,
  "md-hammer": hammer.md,
  "ios-hammer": hammer.ios,
  "md-list": list.md,
  "ios-list": list.ios,
  "md-arrow-round-back": arrowRoundBack.md,
  "ios-arrow-round-back": arrowRoundBack.ios,
  "md-eye": eye.md,
  "ios-eye": eye.ios,
  "md-share": share.md,
  "ios-share": share.ios,
  "md-share-alt": shareAlt.md,
  "ios-share-alt": shareAlt.ios,
  "md-call": call.md,
  "ios-call": call.ios,
  "md-mail": mail.md,
  "ios-mail": mail.ios,
  "md-locate": locate.md,
  "ios-locate": locate.ios,
  "md-checkmark": checkmark.md,
  "ios-checkmark": checkmark.ios,
  "md-home": home.md,
  "ios-home" : home.ios,
  "md-globe": globe.md,
  "ios-globe" : globe.ios,
  "md-pin": pin.md,
  "ios-pin" : pin.ios,
  "md-close": close.md,
  "ios-close": close.ios,
 
  "md-refresh": refresh.md,
  "ios-refresh" : refresh.ios,
  "md-grid": grid.md,
  "ios-grid" : grid.ios,
  "md-print": print.md,
  "ios-print" : print.ios,
  "md-checkmarkCircle": checkmarkCircle.md,
  "ios-checkmarkCircle" : checkmarkCircle.ios,
  "md-car": car.md,
  "ios-car" : car.ios,

  "md-arrowDropleft": arrowDropleft.md,
  "ios-arrowDropleft" : arrowDropleft.ios,

  "md-skipBackward": skipBackward.md,
  "ios-skipBackward" : skipBackward.ios,

});

Vue.use(Ionic);
Vue.use(Vuex);
Vue.use(VModal);
Vue.use(Cors);
Vue.use(VTooltip);
Vue.use(VuePaginate)
Vue.use(VueGoogleMaps, {
  load: {
    // key: 'AIzaSyATqn9NEXjO84wIQKcw4i6_1fgb18Bz4TM'
    // key: 'AIzaSyDYCBGdIbp7XptHUOP2fDJogYvFTbmh5qw'
    key: 'AIzaSyBawocz2WyVtKJaJx58SBKZewY1JRONmjk'
  }
})

const store = new Vuex.Store({
  state: {
    authenticated: false,
    user: null,
    roles: [],
    // FRONTEND STATE
    customer: {},
    allRestaurant: [],   
    restaurantActive: {},   
    allReservations: [],
    cart: [],
    order: {}, 
    allOrders: [], 
    allTickets: [], 
    configuration: {}, 
    hasRating: false,  
    device: {},    
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
    // FRONTEND MUTATION
    setCustomer(state, customer){
      state.customer = customer;
    },
    setAllRestaurant(state, allRestaurant){
      state.allRestaurant = allRestaurant;
    },
    setAllReservations(state, allReservations){
      state.allReservations = allReservations;
    },   
    setRestaurantActive(state, restaurantActive){
      state.restaurantActive = restaurantActive;
    },
    setCart(state, cart){
      state.cart = cart;
    },
    setOrder(state, order){
      state.order = order;
    },
    setAllOrder(state, allOrders){
        state.allOrders = allOrders;
      },
    setAllTickets(state, allTickets){
      state.allTickets = allTickets;
    },      
    setConfiguration(state, configuration){      
      state.configuration = configuration;
    },
    setHasRating(state, hasRating){      
      state.hasRating = hasRating;
    },
    setDevice(state, device){
      state.device = device
    },
  
  }
});


export default store;

Vue.config.productionTip = false

new Vue({
  router,
  i18n,
  store: store,
  render: h => h(App) 
}).$mount('#app')
