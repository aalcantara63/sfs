<template>
  <div id="orderForDelivered" class="screen">

    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'ControlPanel'})"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>{{$t('backoffice.titles.ordersForDelivery')}}</h1>          
            </ion-label>

          </ion-toolbar>

          <ion-searchbar  
                @input="handleInput($event.target.value)" @ionClear="filterOrders = orders"
                :placeholder="$t('frontend.home.search')">           
            </ion-searchbar>
    </ion-header>

    <div v-if="spinner">
        <ion-spinner name="lines" class="spinner"></ion-spinner>
    </div>
    <div v-else>
      <div v-if="screenWidth < 600">
          <paginate
            name="languages"
            :list="filterOrders"
            :per="8"
          >
            <ion-list>
              <ion-item-sliding v-for="order in paginated('languages')" v-bind:key="order._id">
                <ion-item :color="order.IsAccept == false ? 'success' : 'light'">
                  <ion-label>
                      <h2>{{ getCustomerById(order.ClientId).Name }}</h2>
                      <h2>{{ getFormatedDate(order.Date) }}</h2>
                  </ion-label>
                  <span slot="end" class="iconify" data-icon="mdi:backburger" data-inline="false"></span>
                </ion-item>
                <ion-item-options side="end">
                  <ion-item-option v-if="!order.IsAccept && notAccepted" color="success" @click="acceptOrder(order)">
                    <ion-icon slot="icon-only" name="checkmark"></ion-icon>
                  </ion-item-option>
                  <ion-item-option v-if="order.IsAccept" color="primary" @click="viewLocalizationOrder(order)">
                    <ion-icon slot="icon-only" name="list"></ion-icon>
                  </ion-item-option>
                  <!-- <ion-item-option color="primary" @click="viewOrder(order._id)">
                    <ion-icon slot="icon-only" name="list"></ion-icon>
                  </ion-item-option>
                  <ion-item-option v-if="order.State != 6 && order.State != 5" color="danger" @click="cancelOrder(order, getCustomerById(order.ClientId))">
                    <ion-icon slot="icon-only" name="close"></ion-icon>
                  </ion-item-option> -->
                </ion-item-options>
              </ion-item-sliding>
          </ion-list>

        </paginate>

        <paginate-links for="languages" color="primary" 
          :simple="{
            next:'»' ,
            prev: '« ' }"
        ></paginate-links>
      </div>

      <div v-if="screenWidth >= 600">

          <paginate
            name="languages"
            :list="filterOrders"
            :per="8"
          >
            <ion-list>
              <ion-item v-for="order in paginated('languages')" v-bind:key="order._id" :color="order.IsAccept == false ? 'success' : 'light'">
                <ion-label>
                    <h2>{{ getCustomerById(order.ClientId).Name }}</h2>
                    <h2>{{ getFormatedDate(order.Date) }}</h2>
                </ion-label>
                <ion-item-group side="end">
                  <ion-button v-if="!order.IsAccept && notAccepted" color="success" @click="acceptOrder(order)">
                    <ion-icon slot="icon-only" name="checkmark"></ion-icon>
                  </ion-button>
                  <ion-button v-if="order.IsAccept" color="primary" @click="viewLocalizationOrder(order)">
                    <ion-icon slot="icon-only" name="list"></ion-icon>
                  </ion-button>
                  <!-- <ion-item-option color="primary" @click="viewOrder(order._id)">
                    <ion-icon slot="icon-only" name="list"></ion-icon>
                  </ion-item-option>
                  <ion-item-option v-if="order.State != 6 && order.State != 5" color="danger" @click="cancelOrder(order, getCustomerById(order.ClientId))">
                    <ion-icon slot="icon-only" name="close"></ion-icon>
                  </ion-item-option> -->
                </ion-item-group>
              </ion-item>
          </ion-list>

        </paginate>

        <paginate-links for="languages" color="primary" 
          :simple="{
            next:'»' ,
            prev: '« ' }"
        ></paginate-links>

      </div>

    </div>
  </div>
</template>

<script>

import { Api } from '../api/api.js';
import { Utils } from '../utils/utils.js';
// import { payAuthorizeNet } from '../api/payments.js';
import { EventBus } from '../../frontend/event-bus';
// import { parsePhoneNumber  } from 'libphonenumber-js'
// import { Twilio } from '../api/twilio.js';

export default {

  name: 'order',
  created: function(){
      this.init();
      this.getRestaurantConfig();
      this.screenWidth = screen.width;

      this.update = setInterval(() => {
          this.init();
      }, 30000);
  //  this.getRestaurantCustomer();
  },
  destroyed: function(){
    if (this.update != null){
        clearInterval(this.update);
    }
  },
  data () {
    return {
      modelName: 'Order',
      orders: [],
      customers: [],

      filterOrders: [],
      resConf: null,
      homeOrders: false,
      restaurantCustomer: null,

      notAccepted: true,

      update: null,

      workflowOrderStaus: ['Pending of pay', 'Started', 'In kitchen', 'Cooked', 'Delivering', 'Delivered', 'Canceled'],

      paginate: ['languages'],

      spinner: false,
      screenWidth: 0,
    }
  }, 
  methods: {
    init(){
        this.fetchOrders();
        this.fetchCustomers();
    },
    ifErrorOccured(action){
      return this.$ionic.alertController.create({
          title: this.$t('backoffice.list.messages.connectionError'),
          message: this.$t('backoffice.list.messages.connectionErrorMessage'),
          buttons: [
              {
              text: this.$t('backoffice.list.messages.buttons.goToList'),
              handler: () => {
                  this.$router.push({
                      name: 'OrderForDelivered',
                  });
              }
              },
              {
              text: this.$t('backoffice.list.messages.buttons.retry'),
              handler: () => {
                  action();
              }
              }
          ]
          })
          .then(a => a.present());
    },
    acceptOrder(orderP){
        const item = {
            "_id": orderP._id,
            'IsAccept': true
        }
        this.spinner = true;
        Api.putIn('order', item)
            .then(response => {
                orderP = response.data
                this.spinner = false;
                this.$router.push({
                    name: 'Localization',
                    params: {
                        order: orderP,
                        fun: 'write'  
                    }
                });
            })
            .catch(e => {
              console.log(e);
              this.ifErrorOccured(mess => {
                  this.acceptOrder(orderP)
                  this.spinner = false
                  return mess
              });
            })   
    },
    viewLocalizationOrder(orderP){
        this.$router.push({
            name: 'Localization',
            params: {
                order: orderP,
                fun: 'write'  
            }
        });
    },
    // showLoading(){
    //     return this.$ionic.loadingController
    //     .create({
    //       cssClass: 'my-custom-class',
    //       message: this.$t('backoffice.titles.loading'),
    //       duration: 1000,
    //       backdropDismiss: true
    //     })
    //     .then(a => a.present())
    // },
    handleInput(value){
      this.filterOrders = this.orders
      const query = value.toLowerCase();
      requestAnimationFrame(() => {   
        let cat2 = this.orders.filter(item => 
                                          item.Date.indexOf(query) > -1 || 
                                               this.getOrderState(item.State).toLowerCase().indexOf(query) > -1)
        if(cat2.length> 0)
          this.filterOrders = cat2
        else
          this.filterOrders = this.orders
      });
    },
    // pay: function(){
    //     payAuthorizeNet.pay({})
    //       .then(response => {
    //          console.log(response);
    //     })
    //     .catch(e => {
    //       console.log(e)
    //     });
    // },
    // viewOrder: function(id){
    //     this.$router.push({
    //     name: 'OrderDetails', 
    //     params: { orderId: id }
    //   });
    // },
    getOrderState(state){
        return this.workflowOrderStaus[state];
    },
    getFormatedDate: function(date){
        return Utils.getFormatedDate(date);         
    },
    /****** CRUD category methods ******/
    fetchOrders: function(){
        this.$ionic.loadingController
        .create({
          cssClass: 'my-custom-class',
          message: this.$t('backoffice.titles.loading'),
          backdropDismiss: true
        })
        .then(loading => {
            loading.present()
            setTimeout(() => {
                //llamada ajax						
                Api.fetchAll(this.modelName).then(response => {
                    const user_login = this.$store.state.user;
                    this.orders = response.data
                    this.orders = this.orders.filter(item => item.State == 4 && item.Driver == user_login._id)
                    this.orders.reverse();
                    this.filterOrders = this.orders;

                    //Ver si hay al menos una orden aceptada
                    let o = this.orders.find(item => item.IsAccept == true)
                    if (o){
                      this.notAccepted = false
                    }
                    loading.dismiss();
                  })
                  .catch(e => {
                    console.log(e)
                    loading.dismiss()
                    this.ifErrorOccured(this.init)
                  });
            })
        })
    },
    fetchCustomers: function(){
        Api.fetchAll('Customer').then(response => {
          // console.log(response.data)
          this.customers = response.data
          return response
        })
        .catch(e => {
          console.log(e)
        });
    },
    getRestaurantCustomer: function(){
        Api.findCustomerByEmail(this.resConf.Email)
        .then(response => { 
            if(response.data.length != 0 ) {
                this.restaurantCustomer = response.data[0]
                console.log(this.restaurantCustomer)
            }
        })
    },
    getRestaurantConfig: function(){
      Api.fetchById('Restaurant', this.$store.state.user.RestaurantId).then(response => {
            this.resConf = response.data;
            this.getRestaurantCustomer();
      })
      .catch(e => {
        console.log(e)
      });
    },
    // hasPermission(permission){
        
    //     let res = false;
    //     if (this.$store.state.authenticated)
    //     {
    //         let roles = this.$store.state.roles;
    //         for (let index = 0; index < roles.length; index++) {
    //             switch(permission){                        
    //                   case 'canCreateOrder':
    //                       res = roles[index].canCreateOrder;
    //                       break;
    //                   default:
    //                       break;
    //             }
    //             if (res)
    //             { 
    //                 return res;
    //             }              
    //         }
    //     }
    //     return res;
    // },
    createCustomer(client){
      Api.postIn('Customer', client)
      .then(response => {
        // this.spinner = false
        console.log("Success creted with _id" + response.data._id);
        console.log(JSON.stringify(response.data));
        client['id'] = response.data._id;
        // this.CustomerName = response.data.Name;
          EventBus.$emit('clientHasId', client.id );
          EventBus.$emit('clientHasName', client.Name );
          EventBus.$emit('clientHasPhone', client.Phone );
          EventBus.$emit('clientHasEmail', client.EmailAddress ); 
          EventBus.$emit('updateRestaurantSelectedId', this.$store.state.user.RestaurantId); 
          EventBus.$emit('staffName', this.$store.state.user.FirstName + ' ' + this.$store.state.user.LastName);       
        // this.order.ClientId = this.clientId
        console.log('' + this.order);
        this.$router.push({
          path: '/home', 
        }); 
        return response;            
      })
      .catch(e => {
         console.log(e) 
      })
    },
    getCustomerById: function(id){
        var custom = '';
        this.customers.forEach(customer => {
            if (customer._id == id) {
                custom = customer;                
            }
        });
        return custom;
    },
  //   cancelOrder(order, customer){
  //     return this.$ionic.modalController
  //         .create({
  //         component: Modal,
  //         cssClass: 'my-custom-class',
  //         componentProps: {
  //             data: {
  //                 content: order._id,
  //             },
  //             propsData: {
  //                 title: this.$t('backoffice.form.titles.cancelOrder'),
  //                 button: this.$t('backoffice.list.messages.buttons.close'),
  //                 button2: this.$t('backoffice.form.buttons.cancelOrder'),
  //                 order: order,
  //                 customer: customer,
  //                 parent: this,
  //             },
  //         },
  //         })
  //         .then(m => m.present())
  //     },
  // },
  },
}
</script>

<style>

.menu-col-3{
    flex: 0 0 calc(calc(3 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(3 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(3 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
}
  
ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

.paginate-list {
  width: 159px;
  margin: 0 auto;
  text-align: left;
 
}
 .paginate-list li {
    display: block;   
  }

.paginate-list li:before {
    content: '⚬ ';
    font-weight: bold;
    color: slategray;
  }

.paginate-links.items {
  user-select: none;
}

a {
  cursor: pointer;
}

li.active a {
  font-weight: bold;
}

li.next:before {
  content: ' | ';
  margin-right: 13px;
  color: #ddd;
}

li.disabled a {
  color: #ccc;
  cursor: no-drop;
}

.prev, .next{
  font-size: 40px;
}

@media only screen and (min-width : 1024px){

    .screen{
        padding-left: 10%;
        padding-right: 10%;
        border: #edf1ee solid 1px;
        margin-right: 10%;
        margin-left: 10%;
        /* border-radius: 25px; */
    }

}

</style>