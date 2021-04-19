<template>
  <div id="order" class="screen">

    
    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'ControlPanel'})"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>{{$t('backoffice.options.managePyments')}}</h1>        
            </ion-label>

            <ion-item> 
                <ion-datetime 
                    class="menu-col-5 elipsis-menu" 
                    placeholder="Desde"
                    :value="dateFrom"
                    @ionChange="dateFrom = $event.target.value"
                ></ion-datetime>
                <ion-datetime 
                    class="menu-col-5 elipsis-menu" 
                    placeholder="Hasta"
                    :value="dateTo"
                    @ionChange="dateTo =  $event.target.value"
                    pick-format="YYYY-MM-DD"
                ></ion-datetime> 
                 <div style="position: absolute;right: 0;top: 30%;" @click="filterDate()">
                     <span class="iconify" data-icon="fa-solid:search-dollar" data-inline="false" style="color: grey;margin:0;border: outset;padding: 1px !important;" ></span>
                    </div>                 
            </ion-item>

           

           
          </ion-toolbar>

          <ion-searchbar  
              @input="handleInput($event.target.value)" @ionClear="filterOrders = orders"
                :placeholder="$t('frontend.home.search')">           
          </ion-searchbar>
          
    </ion-header>

      <ion-refresher 
        style="position: relative"
        slot="fixed"
        @ionRefresh="doRefresh($event)">
          <ion-refresher-content 
            refreshing-spinner="crescent"
          ></ion-refresher-content>
      </ion-refresher>

    <div v-if="spinner">
        <ion-spinner name="lines" class="spinner"></ion-spinner>
    </div>
    
    <div v-else >    

        <div  >
          <paginate
            :key="key"  
            name="languages"
            :list="filterOrders"
            :per="8"                     
          >
            <ion-item-sliding  v-for="order in paginated('languages')" v-bind:key="order._id">
              <ion-item @click="viewOrder(order)">
                <ion-label class="menu-col-3 ">                   
                    {{ order.ModelFrom }} <br>  {{ getFormatedDate(order.Date) }}
                                
                </ion-label>
                <ion-label class="menu-col-3 elipsis-menu"> 
                  {{ order.InvoiceNumber}}
                </ion-label>
                <ion-label class="menu-col-3 elipsis-menu">                   
                    <h6>{{ order.Method }}</h6>                   
                </ion-label>  
                <ion-label class="menu-col-3 elipsis-menu">                   
                    <h6>{{ getFormatPrice( parseFloat(order.Payment) - order.Refund - order.Void ) }}</h6>   
                    <div style="position: absolute;right: 0;top: 30%;">
                        <span class="iconify" data-icon="mdi:backburger" style="color: grey;margin:0;width: 20px; height: 20px;" data-inline="false"></span>
                    </div>                 
                </ion-label>              
              </ion-item>
              <ion-item-options side="end">                   
                  <ion-item-option color="primary" @click="viewOrder(order)">
                    <ion-icon slot="icon-only" name="list"></ion-icon>
                  </ion-item-option>                  
                </ion-item-options >
          </ion-item-sliding>
         
               <ion-item style="font-size: 20px;color: red;font-weight: 900;">
                   <ion-lable class="menu-col-6 elipsis-menu"></ion-lable>
                   <ion-lable class="menu-col-3 elipsis-menu" style="text-align: right;" >TOTAL</ion-lable>
                   <ion-lable class="menu-col-3 elipsis-menu" style="text-align: right;">{{getSumatory()}}</ion-lable>
               </ion-item>

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
import moment from 'moment-timezone';
// import { payAuthorizeNet } from '../api/payments.js';
// import { EventBus } from '../../frontend/event-bus';
// import { parsePhoneNumber  } from 'libphonenumber-js'
// import { Twilio } from '../api/twilio.js';

export default {

  name: 'order',
  created: function(){  
    this.fetchOrders();
    this.fetchCustomers();
    this.getRestaurantConfig(); 
  
  },
  destroyed: function(){
      if (this.update != null){
          clearInterval(this.update);
      }
  },
  data () {
    return {
      modelName: 'Allpayment',
      orders: [],
      customers: [],

      filterOrders: [],
      resConf: null,
      restaurantCustomer: null,

      update: null,
      loading: null,
      paginate: ['languages'],

      spinner: false,
      dateFrom: '',
      dateTo: '',
      key: 0,
      currency: 'USD',
    }
  }, 
  methods: {

      async doRefresh(event) {
    
      await this.fetchOrders();      
      event.target.complete();
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
    
    handleInput(value){
      const query = value.toLowerCase();
      requestAnimationFrame(() => {       
        let cat2 = this.orders.filter(p => p.Method.toLowerCase().indexOf(query) > -1
                                    ||  p.ModelFrom.toLowerCase().indexOf(query) > -1
                                    ||  p.InvoiceNumber.toLowerCase().indexOf(query) > -1                                 
                                    ||  p.Date.toLowerCase().indexOf(query) > -1)
        if(cat2.length> 0)
          this.filterOrders = cat2
        else
          this.filterOrders = this.orders  
      });
    },

    viewOrder: function(paymentD){
        console.log('Open Payment con ID '+ paymentD);
        this.$router.push({
        name: 'PaymentDetail', 
        params: { payment: paymentD ,
         currency: this.currency }
      });
    },
   
    getFormatedDate: function(date){
        return Utils.getFormatedDate(date);         
    },
    /****** CRUD category methods ******/
    fetchOrders: async function(){
      this.$ionic.loadingController
      .create({
        cssClass: 'my-custom-class',
        message: this.$t('backoffice.titles.loading'),
        // duration: 1000,  
        backdropDismiss: true
      })
      .then(loading => {
          loading.present()
          setTimeout(async () => {  // Some AJAX call occurs
             await Api.fetchAll('Allpayments').then(response => {
                this.orders = response.data.reverse();
                this.filterOrders = this.orders; 
                loading.dismiss();
              })
              .catch(e => {
                console.log(e)
                loading.dismiss()
               
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
            this.restaurantCustomer = response.data
            console.log("RESTAURANT CUSTOMER")
            console.log(this.restaurantCustomer)
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
   
    getCustomerById: function(id){
        var custom = '';
        this.customers.forEach(customer => {
            if (customer._id == id) {
                custom = customer;                
            }
        });
        return custom;
    },

     getFormatPrice(price){
       let result = price
       console.log('this.resConf')
       console.log(this.resConf);      
          if (this.currency)
            result = new Intl.NumberFormat('en', {style: "currency", currency: this.currency} ).format(price)      
      
         return result;
    },

    getSumatory(){
        let count = 0;
        for (const pay of this.filterOrders) {
            count += parseFloat(pay.Payment) - pay.Refund - pay.Void;            
        }
        return this.getFormatPrice(count);
    },

    async filterDate(){
        if(this.dateTo  !=='' && this.dateTo < this.dateFrom){
            this.dateFrom = '';
            this.dateTo = '';
            return this.toastError('Error in Fechas');
        } 
        
        
        if( this.dateFrom !== '' &&  this.dateTo !== ''){

            this.dateFrom = moment(this.dateFrom).format('YYYY-MM-DD');
            this.dateTo = moment(this.dateTo).format('YYYY-MM-DD');
          
            this.$ionic.loadingController
            .create({
                cssClass: 'my-custom-class',
                message: this.$t('backoffice.titles.loading'),
                backdropDismiss: true
            })
            .then(loading => {
                loading.present()
                setTimeout(async () => {  // Some AJAX call occurs
                       await Api.getPaymentByDateToFrom(this.dateFrom, this.dateTo, this.$store.state.user.RestaurantId).then(response => {
                        this.orders = response.data;
                        this.filterOrders = this.orders; 
                        loading.dismiss();
                        this.key ++;
                        return true;
                    })
                    .catch(e => {
                        console.log(e)
                        loading.dismiss()  
                        return true;                     
                    });
                })
            })    
        }
        else if(this.dateFrom !== ''){
            
            this.dateFrom = moment(this.dateFrom).format('YYYY-MM-DD');
            console.log('date from ' + this.dateFrom)   ;  
              this.$ionic.loadingController
            .create({
                cssClass: 'my-custom-class',
                message: this.$t('backoffice.titles.loading'),
                backdropDismiss: true
            })
            .then(loading => {
                loading.present()
                setTimeout(async ()  => {  // Some AJAX call occurs
                        await Api.getPaymentByDateTo(this.dateFrom, this.$store.state.user.RestaurantId).then(response => {
                        this.orders = response.data;
                        this.filterOrders = this.orders; 
                        loading.dismiss();
                        this.key ++;
                        return true;
                    })
                    .catch(e => {
                        console.log(e)
                        loading.dismiss()                        
                    });
                })
            })              
        }
        
       
              
    },

     async toastError(message) {
      return this.$ionic.toastController      
        .create({
          message: message,         
          position: 'middle',
          color:'danger',
           buttons: [
            {
              text: 'Done',
              role: 'cancel',
              handler: () => {}
            }
          ]
        })
      .then(a => a.present())
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

  .menu-col-4{
    flex: 0 0 calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
    visibility: visible;
    }

    .menu-col-6{
    flex: 0 0 calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
    visibility: visible;
    }
    
    .menu-col-5{
    flex: 0 0 calc(calc(5 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(5 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(5 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
    visibility: visible;
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

  h6 {
    font-size: 16px;
    margin: 5px;
    font-weight: 200;
}

 .elipsis-menu{
        text-overflow: ellipsis !important;
    overflow: hidden !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
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