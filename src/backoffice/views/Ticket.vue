<template>
  <div id="order" class="screen">

    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'ControlPanel'})"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>{{$t('backoffice.titles.tickets')}}</h1>            
            </ion-label>

            <ion-label slot="end">
                <!-- <ion-chip style="font-size: 30px" v-if="homeOrders == false" outline color="primary" @click="filterHomeOreders()">
                    <ion-label><ion-icon name="home"></ion-icon></ion-label>
                </ion-chip>
                <ion-chip style="font-size: 30px" v-else color="success" @click="filterHomeOreders()">
                    <ion-label><ion-icon name="home"></ion-icon></ion-label>
                </ion-chip> -->
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
          <div style="width: 100%">
              <ion-segment scrollable color="tertiary" @ionChange="changeFilterStatus($event.target.value)" :value="filterStatus">
                  <ion-segment-button value="home">
                        <ion-icon name="home"></ion-icon>
                  </ion-segment-button>
                  <ion-segment-button value="all">
                        {{$t('frontend.reservation.all')}}
                  </ion-segment-button>
                  <ion-segment-button value="open"> <!-- state0 -->
                        {{$t('frontend.reservation.open')}}
                  </ion-segment-button>
                  <ion-segment-button value="close"> <!-- state5 -->
                        {{$t('frontend.reservation.state6')}}
                  </ion-segment-button>
              </ion-segment>
          </div>
    </ion-header>

    <div v-if="spinner">
        <ion-spinner name="lines" class="spinner"></ion-spinner>
    </div>
    <div v-else>
      
        <div >
          <paginate v-if="filterOrders.length > 0 && menuactive==='list'"
            name="languages"
            :list="filterOrders"
            :per="8"
          >
            <ion-list>
              <ion-item-sliding v-for="order in paginated('languages')" v-bind:key="order._id"
                :color="order.State == 5 ? 'success' : 'light'">

                <ion-item :color="order.State == 5 ? 'success' : 'light'">                  
                  <ion-label class="menu-col-4 elipsis-menu">
                      <h6 v-if="order.ClientId">{{ getCustomerById(order.ClientId).Name }}</h6>
                      <h6 v-if="order.CustomerName">{{ order.CustomerName}}</h6>
                      <h6>{{ order.StaffName }}</h6>
                  </ion-label>
                  <ion-label class="menu-col-4 elipsis-menu">
                    <h6>{{ getFormatedDate(order.Date) }}</h6>
                  </ion-label>
                  <ion-label class="menu-col-4 elipsis-menu">
                      <h6>{{ order.OrderType }}</h6>
                      <h6 v-if="order.State != 0">{{$t('frontend.order.closed')}}</h6>
                      <h6 v-else>{{$t('frontend.reservation.open')}}</h6>
                  </ion-label>
                  <ion-label class="menu-col-4 elipsis-menu">
                      <h6>{{ getFormatPrice(order.Total) }}</h6>   
                      <div style="position: absolute;right: 0;top: 30%;">
                          <span class="iconify" data-icon="mdi:backburger" style="color: grey;margin:0;width: 20px; height: 20px;" data-inline="false"></span>
                      </div>                 
                  </ion-label>
                </ion-item>

                <ion-item-options side="end">
                   <ion-item-option color="primary"  @click="viewOrder(order)">
                       <ion-icon slot="icon-only" name="list"></ion-icon>
                    </ion-item-option>
                </ion-item-options>
              </ion-item-sliding>
          </ion-list>

          </paginate>

          <div v-if="filterOrders.length > 0 && menuactive==='list'">
              <paginate-links for="languages" color="primary" 
                :simple="{
                  next:'»' ,
                  prev: '« ' }"
              ></paginate-links>
          </div>

          <div v-if="menuactive==='grid'"  id="gridView">
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
                                  <ion-card-title  style="color: black;">{{ order.tableService }} <br> 
                                  <span style="text-transform: uppercase;"> {{order._id.slice(-4)}} </span>                                  
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
                                            <ion-checkbox v-if="prod.State === 0" color="secondary" @click="changeProductState(order, index)"></ion-checkbox>
                                            <ion-checkbox v-if="prod.State ===1"  checked disabled color="secondary"></ion-checkbox>
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
                                  
                              <div style="display: flex;justify-content: space-between;align-items: center;"> 
                                <div v-tooltip="$t('frontend.order.notes')" @click="showOrderNote(order)" >
                                  <span  class="iconify" data-icon="bi:info-circle-fill" data-inline="false" style="width: 20px;height: 20px;"></span>
                                </div>
                                  <h3 style="text-align: center;">{{ getFormatPrice(order.Total) }}</h3>
                                  <div v-tooltip="$t('frontend.tooltips.editTicket')" @click="viewOrder(order)">
                                    <span   class="iconify" data-icon="el:file-edit-alt" data-inline="false" style="width: 20px;height: 20px;"></span>
                                  </div>
                              </div>                
                            </ion-card>
                        </div>

                      </div>
                    </div>
                  </v-breakpoint>


                
              </div>

          <div class="emptyResult" v-if="filterOrders.length === 0">
              {{$t('backoffice.titles.emptyResult')}}
          </div>
        </div>

    </div>
  </div>
</template>

<script>

import { Api } from '../api/api.js';
import { Utils } from '../utils/utils.js';
import { VBreakpoint } from 'vue-breakpoint-component'

export default {

  name: 'order',
  created: function(){
   this.screenWidth = screen.width;
   
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
              this.orders = this.orders.filter(order => order.OrderForCatering != true);
              this.orders = this.orders.filter(order => order.isTicket == true);
              this.orders.reverse();
              this.filterOrders = this.orders;
              this.changeFilterStatus('open');
              loading.dismiss();
            })
            .catch(e => {
              console.log(e)
              loading.dismiss()
              this.ifErrorOccured(this.initialize)
            });
        })
    })  
    this.fetchCustomers();
    this.getRestaurantConfig();

   this.update = setInterval(() => {
      this.initialize();
   }, 30000);
   this.getRestaurantCustomer();
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
      modelName: 'order',
      orders: [],
      customers: [],

      filterOrders: [],
      resConf: null,
      homeOrders: false,
      restaurantCustomer: null,

      update: null,
      loading: null,

      // workflowOrderStaus: ['Pending of pay', 'Started', 'In kitchen', 'Cooked', 'Delivering', 'Delivered', 'Canceled'],
      workflowOrderStaus: [this.$t('frontend.order.state0'), this.$t('frontend.order.state1'), this.$t('frontend.order.state2'), this.$t('frontend.order.state3'), this.$t('frontend.order.state4'), this.$t('frontend.order.state5'), this.$t('frontend.order.state6')],

      paginate: ['languages'],

      spinner: false,
      screenWidth: 0,

      //colors
      primaryColor: "",
      secondaryColor: "",
      tertiaryColor: "",

      filterStatus: "open",
      menuactive: 'list',
      cartKey: 0,
    }
  }, 
  methods: {
    initialize(){
        this.fetchOrders();
        this.fetchCustomers();
        //console.log("Update ticket");
    },
    changeFilterStatus(value){

        //console.log(value)
        this.filterStatus = value
        let status = -1
        this.allReservations = this.reservations
        if (value == 'home')
        {
            this.filterHomeOreders()
            return
        }
        if (value == 'all')
        {
            this.filterOrders = this.orders
            return
        }
        if (value == 'open')
        {
            status = 0
        }
        if (value == 'close')
        {
            status = 5
        }
        requestAnimationFrame(() => {
          let cat2 = this.orders.filter(item => item.State == status)
          this.filterOrders = cat2
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
        let cat2 = this.getOrdersByCustomerName(query);
        if(cat2.length> 0)
          this.filterOrders = cat2
        else
          this.filterOrders = this.orders
      });
    },
    getOrdersByCustomerName(name){
        let ordersList = [];               
        this.orders.forEach(order => {
            if (order.ClientId){
              if ((this.getCustomerById(order.ClientId).Name).toLowerCase() == name)
                  ordersList.push(order);
            }
            else{
                if(order.CustomerName){
                  if (order.CustomerName.toLowerCase() == name)
                  ordersList.push(order);
                }
            }
        })
        return ordersList
    },
    filterHomeOreders(){

        if (this.homeOrders == false)
        {
            // if(this.restaurantCustomer)
            // {
                //console.log("Restaurant Customer")
                //console.log(this.restaurantCustomer._id)
                //console.log(this.orders)
                // let cat2 = this.orders.filter(item => 
                //                               item.ClientId.indexOf(this.restaurantCustomer._id) > -1)
                let cat2 = this.orders.filter(item => item.StaffName &&
                                                    item.StaffName != '')
                //console.log(cat2)
                if(cat2.length > 0)
                {
                    this.filterOrders = cat2
                    this.homeOrders = true
                }
                else{
                    this.showToastMessage('There are not home orders.', 'warning')
                }    
            // }
               
        }
        else{
            this.filterOrders = this.orders
            this.homeOrders = false
        }

    },
    viewOrder: function(order){

        if (order.State === 5)
        {
            this.$router.push({
              name: 'OrderDetails', 
              params: { 
                orderId: order._id,
                type: 'ticket'
              }
            });
        }
        else
        {
          this.$router.push({
            name: 'TicketForm', 
            params: { orderId: order._id }
          });
        }
    },
    getOrderState(state){
        return this.workflowOrderStaus[state];
    },
    getFormatedDate: function(date){
        return Utils.getFormatedDate(date);         
    },
    /****** CRUD category methods ******/
    fetchOrders: function(){
        Api.fetchAll(this.modelName).then(response => {
          this.orders = response.data.filter(order => !order.Deleted);
          this.orders = this.orders.filter(order => order.OrderForCatering != true);
          this.orders = this.orders.filter(order => order.isTicket == true);
          this.orders.reverse();
          this.filterOrders = this.orders;
          this.changeFilterStatus('open');
        })
        .catch(e => {
          console.log(e)
          this.ifErrorOccured(this.initialize)
        });
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
        if (this.resConf != null)
        {
            Api.findCustomerByEmail(this.resConf.Email)
            .then(response => { 
                this.restaurantCustomer = response.data
                //console.log("RESTAURANT CUSTOMER")
                //console.log(this.restaurantCustomer)
            })
        }
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
      } 

    //    if (this.restaurantCustomer == null)
    //    {
    //       console.log("Cliente no existe")
    //       let client = {
    //           'Name': this.resConf.Name,
    //           'EmailAddress': this.resConf.Email,
    //           'Phone':  this.resConf.Phone,
    //       }
    //       this.createCustomer(client);   
    //    }
    //    else
    //    {
        // EventBus.$emit('clientHasId', this.restaurantCustomer._id);
        // EventBus.$emit('clientHasName', this.restaurantCustomer.Name);
        // EventBus.$emit('clientHasPhone', this.restaurantCustomer.Phone);
        // EventBus.$emit('clientHasEmail', this.restaurantCustomer.EmailAddress);  
        // EventBus.$emit('updateRestaurantSelectedId', this.$store.state.user.RestaurantId);
        // EventBus.$emit('staffName', this.$store.state.user.FirstName + ' ' + this.$store.state.user.LastName);
        // // EventBus.$emit('staffId', '');
        //  if(this.$store.state.restaurantActive.restaurantUrl){
        //       return this.$router.push({ name: 'Home', params: {url: this.$store.state.restaurantActive.restaurantUrl}  })
        //     }         
    //    }
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
    // createCustomer(client){
    //   Api.postIn('Customer', client)
    //   .then(response => {
    //     // this.spinner = false
    //     console.log("Success creted with _id" + response.data._id);
    //     console.log(JSON.stringify(response.data));
    //     client['id'] = response.data._id;
    //     // this.CustomerName = response.data.Name;
    //       EventBus.$emit('clientHasId', client.id );
    //       EventBus.$emit('clientHasName', client.Name );
    //       EventBus.$emit('clientHasPhone', client.Phone );
    //       EventBus.$emit('clientHasEmail', client.EmailAddress ); 
    //       EventBus.$emit('updateRestaurantSelectedId', this.$store.state.user.RestaurantId); 
    //       EventBus.$emit('staffName', this.$store.state.user.FirstName + ' ' + this.$store.state.user.LastName);       
    //     // this.order.ClientId = this.clientId
    //     console.log('' + this.order);
    //     this.$router.push({
    //       path: '/home', 
    //     }); 
    //     return response;            
    //   })
    //   .catch(e => {
    //      console.log(e) 
    //   })
    // },
    getCustomerById: function(id){
        var custom = '';
        this.customers.forEach(customer => {
            if (customer._id == id) {
                custom = customer;                
            }
        });
        return custom;
    },
    // cancelOrder(order, customer){
    //   return this.$ionic.modalController
    //       .create({
    //       component: Modal,
    //       cssClass: 'my-custom-class',
    //       componentProps: {
    //           data: {
    //               content: order._id,
    //           },
    //           propsData: {
    //               title: this.$t('backoffice.form.titles.cancelOrder'),
    //               button: this.$t('backoffice.list.messages.buttons.close'),
    //               button2: this.$t('backoffice.form.buttons.cancelOrder'),
    //               order: order,
    //               customer: customer,
    //               parent: this,
    //           },
    //       },
    //       })
    //       .then(m => m.present())
    //   },
    //   showDeliveringLocation(orderP){
    //     this.$router.push({
    //         name: 'Localization',
    //         params: {
    //           order: orderP,
    //           fun: 'read'
    //         }
    //     });
    //   },
    //   showTravel(orderP){
    //     this.$router.push({
    //         name: 'Localization',
    //         params: {
    //           order: orderP,
    //           fun: 'travel'
    //         }
    //     });
    //   },


     reverseOrders(){
      this.filterOrders.reverse();
    },

     getFormatPrice: function(price){
        return Utils.getFormatPrice(price);         
    },

    getFormateHour: function(date){
        return Utils.getFormatHour(date);         
    },

     scrollToTop() {
      document.querySelector('ion-card-content').scrollToTop(500);
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