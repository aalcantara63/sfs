<template>
  <div id="order" class="screen">

    
    <ion-header>
          <ion-toolbar>
              <ion-buttons slot="start">
                <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'ControlPanel'})"></ion-back-button>
              </ion-buttons>
              <ion-label style="padding: 20px 100px;">
                <h1>{{$t('backoffice.titles.cateringOrders')}}</h1>          
              </ion-label> 
               <ion-label slot="end">  
                  <ion-chip style="font-size: 30px" outline color="primary" @click="createOrder()" v-if="hasPermission('canCreateOrder')">
                      <ion-label><ion-icon name="add"></ion-icon></ion-label>
                  </ion-chip>
              </ion-label> 
          </ion-toolbar>

           <div > 
                <ion-button @click="menuactive='list'" :style="menuactive==='list'? 'opacity: 1;;border: outset;' : 'opacity: 0.65;border: none;' ">
                  <span class="iconify" data-icon="foundation:list-bullet" data-inline="false" style="width: 20px;height: 20px;margin: 5px;"></span>
                </ion-button>  
                <ion-button    @click="menuactive='grid'" :style="menuactive==='grid'? 'opacity: 1;border: outset;' : 'opacity: 0.65;border: none;' ">
                  <span class="iconify" data-icon="clarity:grid-chart-solid" data-inline="false" style="width: 20px;height: 20px;margin: 5px;"></span>
                </ion-button>  
                <ion-button style="border: outset;" @click="reverseOrders()">
                  <span class="iconify" data-icon="fluent:chevron-up-down-20-filled" data-inline="false" style="width: 20px;height: 20px;margin: 5px;"></span>
                </ion-button>
            </div> 

          <ion-searchbar  
              @input="handleInput($event.target.value)" @ionClear="filterOrders = orders"
                :placeholder="$t('frontend.home.search')">           
            </ion-searchbar>
    </ion-header>

    <div v-if="spinner">
        <ion-spinner name="lines" class="spinner"></ion-spinner>
    </div>
    <div v-else>

        <div v-if="menuactive==='list'" >
          <paginate 
            name="languages"
            :list="filterOrders"
            :per="8"
          >
            <ion-list>
              <ion-item-sliding v-for="order in paginated('languages')" v-bind:key="order._id">
                <ion-item
                 :color="order.State == 5 ? 'success' : order.State == 6 ? 'danger' : order.State == 0 ? 'warning' : order.State == 4 ? 'primary' : 'light'">
                  <ion-label class="menu-col-4 elipsis-menu">
                    <h6 v-if="order.ClientId">{{ getCustomerById(order.ClientId).Name }}</h6>
                    <h6 v-else>{{ order.CustomerName }}</h6>
                  </ion-label>
                   <ion-label class="menu-col-4 elipsis-menu">
                     <h6>{{ getOrderState(order.State) }}</h6>
                    <h6>{{ getFormatedDate(order.Date) }}</h6>
                  </ion-label>
                  <ion-label class="menu-col-4 elipsis-menu">                        
                      <h6>{{ order.OrderType }}</h6>
                      <h6>{{ getFormatPrice(order.Total) }}</h6>                  
                      <div style="position: absolute;right: 0;top: 30%;">
                          <span class="iconify" data-icon="mdi:backburger" style="color: grey;margin:0;width: 20px; height: 20px;" data-inline="false"></span>
                      </div> 
                  </ion-label>
                </ion-item>

                 <ion-item-options side="end"> 
                    <ion-item-option v-if="order.State === 7" color="primary" @click="editOrder(order._id)">
                        <ion-icon slot="icon-only" name="create"></ion-icon>
                    </ion-item-option>

                     <ion-item-option v-if="order.State !== 7" color="primary" @click="viewOrder(order._id)">
                        <ion-icon slot="icon-only" name="list"></ion-icon>
                    </ion-item-option>
                    <ion-item-option v-if="order.State != 0 && order.State != 6 && order.State != 5" color="danger" @click="cancelOrder(order, getCustomerById(order.ClientId))">
                        <ion-icon slot="icon-only" name="close"></ion-icon>
                    </ion-item-option>
                    <ion-item-option v-if="order.State == 4 && order.IsAccept" color="warning" @click="showDeliveringLocation(order)">
                        <ion-icon slot="icon-only" name="locate"></ion-icon>
                    </ion-item-option>
                    <ion-item-option  v-if="order.State == 5" color="warning" @click="showTravel(order)">
                        <ion-icon slot="icon-only" name="car"></ion-icon>
                    </ion-item-option>
                     <ion-item-option  v-if="hasPermission('canEditOrder') && order.State == 0" color="danger" @click="deleteOrder(order._id)">
                        <ion-icon slot="icon-only" name="trash"></ion-icon>
                    </ion-item-option>
                       
                  </ion-item-options >

                <ion-item-group side="end">
                  <!-- <ion-button v-if="order.State === 7" color="primary" @click="editOrder(order._id)">
                    <ion-icon slot="icon-only" name="create"></ion-icon>
                  </ion-button> -->
                  <!-- <ion-button v-if="order.State !== 7" color="primary" @click="viewOrder(order._id)">
                    <ion-icon slot="icon-only" name="list"></ion-icon>
                  </ion-button> -->
                  <!-- <ion-button v-if="order.State != 0 && order.State != 6 && order.State != 5" color="danger" @click="cancelOrder(order, getCustomerById(order.ClientId))">
                    <ion-icon slot="icon-only" name="close"></ion-icon>
                  </ion-button> -->
                  <!-- <ion-button v-if="order.State == 4 && order.IsAccept" color="warning" @click="showDeliveringLocation(order)">
                    <ion-icon slot="icon-only" name="locate"></ion-icon>
                  </ion-button> -->
                  <!-- <ion-button v-if="order.State == 5" color="warning" @click="showTravel(order)">
                    <ion-icon slot="icon-only" name="car"></ion-icon>
                  </ion-button> -->
                  <!-- <ion-button v-if="hasPermission('canEditOrder') && order.State == 0" color="danger" @click="deleteOrder(order._id)">
                      <ion-icon slot="icon-only" name="trash"></ion-icon>
                  </ion-button> -->
                </ion-item-group>
              </ion-item-sliding>
          </ion-list>

          </paginate>

          <paginate-links for="languages" color="primary" 
            :simple="{
              next:'»' ,
              prev: '« ' }"
          ></paginate-links>
        </div>

        <div v-if="menuactive==='grid'">

            <v-breakpoint>
              <div slot-scope="scope" > 

                <div style="display: flex;flex-wrap: wrap;flex-direction: row;align-items: flex-start;">    

                  <ion-chip color="primary"
                    @click="scrollToTop()"
                    outline style="position: fixed; right: 0;top: 50%;padding: 0; z-index: 20;">
                    <span class="iconify" data-icon="ant-design:caret-up-filled" data-inline="false" style="margin: 0"></span>
                  </ion-chip>

                  <div  v-for="order in filterOrders" v-bind:key="order._id" 
                      style="text-align: right;"             
                      :class="scope.isLarge || scope.isXlarge ? 'menu-col-3 card-categories' : scope.isMedium? 'menu-col-4 card-categories' : scope.isSmall || scope.noMatch ?'menu-col-12 card-categories': 'menu-col-3 card-categories'">
                          
                        <ion-chip style="margin: 0;bottom: -10px; font-weight: bold;" outline
                          :color="order.State == 5 ? 'success' : order.State == 6 ? 'danger' : order.State == 0 ? 'warning' : order.State == 4 ? 'primary' : 'secondary'">
                          {{getFormateHour(order.Date)}}
                        </ion-chip>
                      <ion-card style="text-align: left;"   
                      :color="order.State == 5 ? 'success' : order.State == 6 ? 'danger' : order.State == 0 ? 'warning' : order.State == 4 ? 'primary' : 'secondary'">
                          <ion-card-header style="margin: 10px 5px 2px; padding: 10px;background:white;color: black;">
                            <ion-card-title  style="color: black;">{{ order.OrderType }} - 
                            <span style="text-transform: uppercase;"> {{order._id.slice(-4)}} </span>
                            <!-- <span v-if="order.CarArrived && order.State !==5"                      
                              class="iconify" data-icon="clarity:car-solid" data-inline="false" 
                              style="float: right; color: #48bc76; margin:0"></span>  -->
                            </ion-card-title>
                            
                            <ion-card-subtitle v-if="order.CustomerName"
                              style="color: black; display: flex;justify-content: space-between;">
                              <div style="text-align: center;"> 
                                <span class="iconify" data-icon="bx:bxs-user-circle" data-inline="false" 
                                style="color: #808080a6;width: 20px;  height: 20px; margin: 0;"></span>
                              </div>
                              <div style="text-align: right;"  >{{ order.CustomerName }}</div>
                            </ion-card-subtitle>

                            <ion-card-subtitle v-if="order.StaffName"
                              style="color: black; display: flex;justify-content: space-between;">
                              <div style="text-align: center;"> 
                                <span class="iconify" data-icon="grommet-icons:restaurant"
                                style="color: #808080a6; width: 20px;  height: 20px; margin: 0;" data-inline="false"></span>
                              </div>
                              <span style="text-align: right;"  > {{ order.StaffName }}</span>
                            </ion-card-subtitle>
                              
                            </ion-card-header>

                            <ion-card-content style="margin: 1px 5px; padding: 5px;background:white;color: black;" :key="cartKey + 'C'">
                              <div v-for="(prod, index) in order.Products" :key="index" >
                                    <div style="display: flex;justify-content: space-between; padding: 2px;margin:5px 0">
                                      <span :style="prod.State===1? 'text-decoration: line-through;':'text-decoration: none'">{{prod.Cant}} X {{prod.Name}} </span> 
                                      <ion-checkbox v-if="prod.State === 0 && order.State !== 7 && order.State !== 8 && order.State !== 6" color="secondary" @click="changeProductState(order, index)"></ion-checkbox>
                                      <ion-checkbox v-if="prod.State ===1 && order.State !== 7 && order.State !== 8 && order.State !== 6"  checked disabled color="secondary"></ion-checkbox>
                                      <ion-checkbox v-if="order.State === 7 || order.State === 8 || order.State === 6"  disabled color="secondary"></ion-checkbox>
                                    </div>

                                    <div v-if="prod.Aggregates.length > 0" style="padding-left: 5px;">
                                      <div v-for="(agg, index1) in prod.Aggregates" :key="index1"  style="padding-left: 2px; display: list-item; list-style: inside" >                                                          
                                      {{agg.Cant}} X {{agg.Name}} 
                                      </div>
                                    </div>
                                    <div v-if="prod.Note" style="padding-left: 15px;">                                                                                          
                                        <span style="background: #ffff0047;" >{{$t('frontend.order.notes')}}: {{prod.Note}}</span>                                 
                                    </div>                              
                              </div>
                              <div v-if="order.OtherCharges.length > 0">
                                  <ion-label class="ion-text-wrap" >
                                      <strong class="titles-order" >
                                        {{$t('frontend.order.otherCharges')}}
                                      </strong> 
                                  </ion-label>
                                                  
                                <div v-for="charge in order.OtherCharges" v-bind:key="charge.Id">                              
                                    <div style="padding-left: 2px; display: list-item; list-style: inside;">
                                        {{ charge.Name }}
                                    </div>                                
                                </div>

                            </div>
                            </ion-card-content>                           

                             <ion-card-content style="margin:5px; background:white;color: black;text-align: center; padding: 0;" :key="stateKey + 'S'">
                                <ion-select  :value="statesAll[order.State].name" interface="popover" icon="add"
                                    style="font-size: 16px;font-weight: 500;"
                                    @ionChange="stateToChange(order, $event.target.value)" >
                                    <ion-select-option
                                      v-for="(ps, index) in stateByOrder(order)" :key="index" :value="ps.name">
                                      {{ps.name}}
                                    </ion-select-option>
                                </ion-select>
                            </ion-card-content>

                        <div style="display: flex;justify-content: space-between;align-items: center;"> 
                          <div v-tooltip="$t('frontend.order.notes')" @click="showOrderNote(order)" >
                            <span  class="iconify" data-icon="bi:info-circle-fill" data-inline="false" style="width: 20px;height: 20px;"></span>
                          </div>
                            <h3 style="text-align: center;">{{ getFormatPrice(order.Total) }}</h3>
                            <div v-tooltip="$t('frontend.tooltips.editTicket')" @click="viewOrder(order._id)">
                              <span   class="iconify" data-icon="el:file-edit-alt" data-inline="false" style="width: 20px;height: 20px;"></span>
                            </div>
                        </div>                
                      </ion-card>
                  </div>

                </div>
              </div>
            </v-breakpoint>

        </div>

    </div>
  </div>
</template>

<script>

import { Api } from '../api/api.js';
import { Utils } from '../utils/utils.js';
import { payAuthorizeNet } from '../api/payments.js';
import Modal from './cancelOrderModal.vue';
import { EventBus } from '../../frontend/event-bus';
 import { VBreakpoint } from 'vue-breakpoint-component'

export default {

  name: 'order',
  created: function(){
   this.screenWidth = screen.width;
   this.initialize();
   this.getRestaurantConfig(); 

  //  this.update = setInterval(() => {
  //     this.initialize();
  //  }, 30000);
  //  this.getRestaurantCustomer();
  },
  destroyed: function(){
      if (this.update != null){
          clearInterval(this.update);
      }
  },
  components:{   
    VBreakpoint: VBreakpoint,  
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

      update: null,
      loading: null,

      // workflowOrderStaus: ['Pending of pay', 'Started', 'In kitchen', 'Cooked', 'Delivering', 'Delivered', 'Canceled'],
      workflowOrderStaus: [this.$t('frontend.order.state0'), this.$t('frontend.order.state1'), this.$t('frontend.order.state2'), this.$t('frontend.order.state3'), this.$t('frontend.order.state4'), this.$t('frontend.order.state5'), this.$t('frontend.order.state6'), this.$t('frontend.order.state7'), this.$t('frontend.order.state8')],

      paginate: ['languages'],

      spinner: false,
      screenWidth: 0,

      //colors
      primaryColor: "",
      secondaryColor: "",
      tertiaryColor: "",

      menuactive: 'list',
      cartKey: 0,
      stateKey: 0,
      statesAll: [
        { state: 0,
          name: this.$t('frontend.order.state0')},
        { state: 1,
          name: this.$t('frontend.order.state1')},
        { state: 2,
          name: this.$t('frontend.order.state2')},
        { state: 3,
          name: this.$t('frontend.order.state3')},
        { state: 4,
          name: this.$t('frontend.order.state4')},
        { state: 5,
          name: this.$t('frontend.order.state5')},
        { state: 6,
          name: this.$t('frontend.order.state6')},
        { state: 7,
          name: this.$t('frontend.order.state7')},
        { state: 8,
          name: this.$t('frontend.order.state8')}],
    }
  }, 
  methods: {
    initialize(){
        this.fetchOrders();
        this.fetchCustomers();
        //console.log("Update order");
    },
    loadColors(){
        Api.fetchById(this.modelName, this.id)
          .then(response => {
              let color = response.date.Primary.split('-');
              this.primaryColor = color[0];

              color = response.date.Secondary.split('-');
              this.secondaryColor = color[0];

              color = response.date.Secondary.split('-');
              this.tertiaryColor = color[0];

              return response;
          })
          .catch(e => {
              console.log(e);
              this.ifErrorOccured(this.init);
          })
    },
    ifErrorOccured(action){
      return this.$ionic.alertController.create({
          title: this.$t('backoffice.list.messages.connectionError'),
          message: this.$t('backoffice.list.messages.connectionErrorMessage'),
          buttons: [
            {
              text: this.$t('backoffice.list.messages.buttons.goToAdministration'),
              handler: () => {
                  this.$router.push({
                      name: 'ControlPanel',
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
    showToastMessage(message, tColor){
      return this.$ionic.toastController.create({
        color: tColor,
        position: 'top',
        duration: 3000,
        message: message,
        showCloseButton: false
      }).then(a => a.present())
    },
    deleteOrder: function(id){

        this.$ionic.alertController.create({
        title: this.$t('backoffice.list.messages.confirmDelete'),
        message: this.$t('backoffice.list.messages.deleteOrder'),
        buttons: [
          {
            text: this.$t('backoffice.list.messages.buttons.cancel'),
            role: 'cancel',
            handler: () => {
              
            }
          },
          {
            text: this.$t('backoffice.list.messages.buttons.delete'),
            handler: () => {
              
              this.spinner = true;
              Api.putIn(this.modelName, {"_id": id, "Deleted": true})
                .then(response => {
                  // this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'), 
                  //                       this.$t('backoffice.list.messages.messageDeleteSuccessCategory'), 
                  //                               this.$t('backoffice.list.messages.deleteSubtitleCategory'));
                  this.showToastMessage(this.$t('backoffice.list.messages.messageDeleteSuccessOrder'), "success");
                  this.fetchOrders();
                  this.spinner = false;
                  return response;
                })
                .catch(e => {
                  console.log(e);
                  this.ifErrorOccured(mess => {
                      this.deleteOrder(id)
                      this.spinner = false
                      return mess
                  });
                })

            }
          }
        ]
      })
      .then(a => a.present());

    },
    // showLoading(){
    //     return this.$ionic.loadingController
    //     .create({
    //       cssClass: 'my-custom-class',
    //       message: this.$t('backoffice.titles.loading'),
    //       // duration: 1000,  
    //       backdropDismiss: true
    //     })
    //     .then(a => a.present())
    // },
    handleInput(value){
      this.filterOrders = this.orders
      const query = value.toLowerCase();
      requestAnimationFrame(() => {   
        // let cat2 = this.orders.filter(item => 
        //                                   item.Date.indexOf(query) > -1 || 
        //                                        this.getOrderState(item.State).toLowerCase().indexOf(query) > -1)
        let cat2 = this.getOrdersByCustomerName(query);
        if(cat2.length> 0)
          this.filterOrders = cat2
        else
          this.filterOrders = this.orders
      });
    },
    getOrdersByCustomerName(name){
        let ordersList = []
        this.orders.forEach(order => {
            if (order.ClientId){
              if ((this.getCustomerById(order.ClientId).Name).toLowerCase() == name)
                  ordersList.push(order);
            }
            else{
               if (order.CustomerName.toLowerCase() == name)
                  ordersList.push(order);
            }
        })
        return ordersList
    },
    filterHomeOreders(){

        if (this.homeOrders == false)
        {
            if(this.restaurantCustomer)
            {
                let cat2 = this.orders.filter(item => 
                                              item.ClientId.indexOf(this.restaurantCustomer._id) > -1)
                //console.log(cat2)
                if(cat2.length > 0)
                {
                    this.filterOrders = cat2
                }    
            }
            this.homeOrders = true   
        }
        else{
            this.filterOrders = this.orders
            this.homeOrders = false
        }

    },
    pay: function(){
        payAuthorizeNet.pay({})
          .then(() => {
             //console.log(response);
        })
        .catch(e => {
          console.log(e)
        });
    },
    editOrder: function(id){
        this.$router.push({
        name: 'OrderCateringForm',
        params: { orderId: id }
      });
    },
    viewOrder: function(id){
        this.$router.push({
          name: 'OrderDetails', 
          params: { 
              orderId: id,
              type: 'catering'
            }
          });
    },
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
        // duration: 1000,  
        backdropDismiss: true
      })
      .then(loading => {
          loading.present()
          setTimeout(() => {  // Some AJAX call occurs
              Api.fetchAll(this.modelName).then(response => {
                this.orders = response.data.filter(order => !order.Deleted);
                this.orders = this.orders.filter(order => order.OrderForCatering == true);
                this.orders.reverse();
                this.filterOrders = this.orders; 
                loading.dismiss();
              })
              .catch(e => {
                console.log(e)
                loading.dismiss()
                this.ifErrorOccured(this.initialize)
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
                //console.log(this.restaurantCustomer)
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
    createOrder: function(){
      if(this.$store.state.restaurantActive.restaurantUrl){
                        return this.$router.push({ name: 'Home', params: {url: this.$store.state.restaurantActive.restaurantUrl}  })

          // this.$router.push({ name: 'Catering', params: {isCatering: true, url: this.$store.state.restaurantActive.restaurantUrl }})
    } 
     
    },
    hasPermission(permission){
        
        let res = false;
        if (this.$store.state.authenticated)
        {
            let roles = this.$store.state.roles;
            for (let index = 0; index < roles.length; index++) {
                switch(permission){                        
                      case 'canCreateOrder':
                          res = roles[index].canCreateOrder;
                          break;
                      case 'canEditOrder':
                          res = roles[index].canEditOrder;
                          break;
                      default:
                          break;
                }
                if (res)
                { 
                    return res;
                }              
            }
        }
        return res;
    },
    createCustomer(client){
      Api.postIn('Customer', client)
      .then(response => {
        // this.spinner = false
        //console.log("Success creted with _id" + response.data._id);
        //console.log(JSON.stringify(response.data));
        client['id'] = response.data._id;
        // this.CustomerName = response.data.Name;
          EventBus.$emit('clientHasId', client.id );
          EventBus.$emit('clientHasName', client.Name );
          EventBus.$emit('clientHasPhone', client.Phone );
          EventBus.$emit('clientHasEmail', client.EmailAddress ); 
          EventBus.$emit('updateRestaurantSelectedId', this.$store.state.user.RestaurantId); 
          EventBus.$emit('staffName', this.$store.state.user.FirstName + ' ' + this.$store.state.user.LastName);       
        // this.order.ClientId = this.clientId
        //console.log('' + this.order);
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
    cancelOrder(order, customer){
      return this.$ionic.modalController
          .create({
          component: Modal,
          cssClass: 'my-custom-class',
          componentProps: {
              data: {
                  content: order._id,
              },
              propsData: {
                  title: this.$t('backoffice.form.titles.cancelOrder'),
                  button: this.$t('backoffice.list.messages.buttons.close'),
                  button2: this.$t('backoffice.form.buttons.cancelOrder'),
                  order: order,
                  customer: customer,
                  parent: this,
              },
          },
          })
          .then(m => m.present())
      },
      showDeliveringLocation(orderP){
        this.$router.push({
            name: 'Localization',
            params: {
              order: orderP,
              fun: 'read'
            }
        });
      },
      showTravel(orderP){
        this.$router.push({
            name: 'Localization',
            params: {
              order: orderP,
              fun: 'travel'
            }
        });
      },

      reverseOrders(){
      this.filterOrders.reverse();
    },
    getFormatPrice: function(price){
        return Utils.getFormatPrice(price);         
    },

     scrollToTop() {
      document.querySelector('ion-card-content').scrollToTop(500);
    },

     getFormateHour: function(date){
        return Utils.getFormatHour(date);         
    },

    async changeProductState(order, index){
      order.Products[index].State = 1;
      await Api.putIn('Order', order);
      this.cartKey ++;

    },

    async showOrderNote(order){
      const alert = await this.$ionic.alertController
      .create({
        cssClass: 'my-custom-class',
        header: this.$t('frontend.order.notes') ,
        message: order.Note,
        inputs: [  
          { type:'textarea', name: 'address', placeholder: this.$t('frontend.order.add') },               
        ],  
        buttons: [
          {text: this.$t('frontend.home.cancel'),role: 'cancel', cssClass: 'secondary',
            handler: () => {                
            },
          },
          {
            text: this.$t('frontend.home.acept'),
            handler: async (data) => {
                if(data.address !== order.Note){
                  const n = order.Note || ''
                  order.Note = n + "\n" + data.address;
                  await Api.putIn('Order', order);
                }              
            },
          },
        ],
      })
      // .then(a => a.present())
      return alert.present();
    },

  stateByOrder(order){
      const possibleStates = [];
      let stateLeng = this.statesAll.length;
      if(order.State < 7) stateLeng -= 2;
          for (let i = order.State; i < stateLeng ; i++) {
              const element = this.statesAll[i];
              if (order.OrderType != "Delivery" && this.statesAll[i].name == "On the way")
                    continue;
              if (!possibleStates.includes(element))
                    possibleStates.push(element);
          }
      return possibleStates
    },

    
  async stateToChange(order, state){      
      const index = this.statesAll.findIndex(s => s.name === state)
      //console.log(index);
      if(index !== -1 ){
        order.State = index;
        await Api.putIn('Order', order);
        this.fetchOrders();
        this.stateKey ++;
      }      
    },
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