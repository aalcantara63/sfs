<template>
  <div id="order" >

    
    <ion-header>
          <ion-toolbar>
           
            

              <div style="display: flex;justify-content: center;align-items: center"> 
                  <ion-button @click="menuactive='list'" :style="menuactive==='list'? 'opacity: 1;;border: outset;' : 'opacity: 0.65;border: none;' ">
                    <span class="iconify" data-icon="foundation:list-bullet" data-inline="false" style="width: 20px;height: 20px;margin: 5px;"></span>
                  </ion-button>  
                  <ion-button    @click="menuactive='grid'" :style="menuactive==='grid'? 'opacity: 1;border: outset;' : 'opacity: 0.65;border: none;' ">
                    <span class="iconify" data-icon="clarity:grid-chart-solid" data-inline="false" style="width: 20px;height: 20px;margin: 5px;"></span>
                  </ion-button> 
                  <div v-tooltip="$t('frontend.createNew.active')" :style="showActive? 'opacity: 1;border: outset;display: flex' : 'opacity: 0.65;border: outset;display: flex' "
                    @click="showActive = !showActive , getActives()">
                    <span class="iconify" data-icon="flat-color-icons:ok" data-inline="false"></span>
                  </div> 
                  <div style="border: outset; display: flex" @click="reverseOrders()">
                    <span class="iconify" data-icon="fluent:chevron-up-down-20-filled" data-inline="false" style="width: 20px;height: 20px;margin: 5px;"></span>
                  </div>                    
              </div> 

                      
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

  
      <ion-loading
        v-if="spinner"
        cssClass="my-custom-class"
        :message="$t('frontend.tooltips.loadRestaurant')"
      ></ion-loading>
  
    <div>  
            <div>
              <ion-chip style="font-size: 30px; float: right" outline color="primary" @click="viewOrder()" >
                <ion-label><ion-icon name="add"></ion-icon></ion-label>
            </ion-chip>
            </div>

        <div  v-if="menuactive==='list'">
          <paginate
            :key="key"  
            name="languages"
            :list="filterOrders"
            :per="8"                     
          >
            <ion-item-sliding  v-for="order in paginated('languages')" v-bind:key="order._id">
              <ion-item 
              :color="order.State === true ? 'success' : 'warning'"
              @click="viewOrder(order)">
               <ion-label class="menu-col-5 elipsis-menu">                   
                    <h6>{{ order.Type }}</h6>                   
                </ion-label> 
                <ion-label class="menu-col-5 ">                   
                   {{ getFormatedDate(order.Date) }}                                
                </ion-label>
                <ion-label class="menu-col-2 elipsis-menu"> 
                  <span v-if="order.State === true">{{$t('frontend.createNew.active')}}</span>                  
                  <span v-if="order.State === false">{{$t('frontend.createNew.inactive')}}</span>                  
                </ion-label>
                            
              </ion-item>
              <ion-item-options side="end">                   
                  <ion-item-option color="primary" @click="viewOrder(order)">
                    <ion-icon slot="icon-only" name="list"></ion-icon>
                  </ion-item-option> 
                   <ion-item-option color="primary" @click="deleteOrder(order._id)">
                    <span class="iconify" data-icon="fluent:delete-48-regular" data-inline="false"></span>
                  </ion-item-option>                  
                </ion-item-options >
            </ion-item-sliding>
         
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
                                
                            <ion-card style="text-align: left;"   
                            :color="order.State === true ? 'success' : 'warning'">
                                <ion-card-header style="margin: 10px 5px 2px; padding: 10px;background:white;color: black;">
                                  <ion-card-title  style="color: black;"> 
                                          {{ order.Type }}                  
                                  </ion-card-title>
                                  
                              
                                
                                    
                                  </ion-card-header>                                  
                                
                              <div style="display: flex;justify-content:center;align-items: center;"> 
                                 <span v-if="order.State === true">{{$t('frontend.createNew.active')}}</span>                  
                                    <span v-if="order.State === false">{{$t('frontend.createNew.inactive')}}</span>
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

    </div>
  </div>
</template>

<script>

import { Api } from '../api/api.js';
import { Utils } from '../utils/utils.js';
import { VBreakpoint } from 'vue-breakpoint-component'

export default {

  name: 'restaurantType',
  created: function(){  
    this.fetchOrders();
  
  },
  components:{   
    VBreakpoint: VBreakpoint,  
  },
  data () {
    return {
      modelName: 'restauranttype',
      orders: [],

      filterOrders: [],
      resConf: null,

      update: null,
      loading: null,
      paginate: ['languages'],

      spinner: false,
      dateFrom: '',
      dateTo: '',
      key: 0,

      currency: 'USD',
      menuactive:'list',
      showActive: false,
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
        const orderFiltered = this.orders.filter(p =>
                                        p.Date && p.Type);
        let cat2 = orderFiltered.filter(p => p.Type.toLowerCase().indexOf(query) > -1 )
        if(cat2.length> 0)
          this.filterOrders = cat2
        else
          this.filterOrders = this.orders  
      });
    },

    viewOrder: function(restaurantType){
        console.log('Open Restaurant type con ID '+ restaurantType);
        return this.$router.push({ name: 'RestaurantType', params: {restaurantType: restaurantType, parent: this} })
    },

    
    async deleteOrder(id){

      console.log('delete restaurantype: ' + id)
      try {
        this.spinner = true;
        const response = await Api.deleteById('restauranttype', id);
        if(response.status === 200)
           await this.fetchOrders(); 
         this.spinner = false;
        
      } catch (error) {
        error
         this.spinner = false;
      }
    },
   
    getFormatedDate: function(date){
        return Utils.getFormatedDate(date);         
    },

    /****** CRUD category methods ******/
    fetchOrders: async function(){
      this.spinner = true;
      try {
        const response = await Api.fetchAll('restauranttype')
        this.orders = response.data;
        this.filterOrders = this.orders; 
         this.spinner = false;
      } catch (error) {
        error;
         this.spinner = false;
      }   
    },
  
   getFormatPrice(price){
       let result = price           
          if (this.currency)
            result = new Intl.NumberFormat('en', {style: "currency", currency: this.currency} ).format(price)      
      
         return result;
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

    reverseOrders(){
      this.filterOrders.reverse();
    },

    scrollToTop() {
      document.querySelector('ion-card-content').scrollToTop(500);
    },
 
   getActives(){
     if(this.showActive)
      this.filterOrders = this.filterOrders.filter(p => p.State === true);
      else
       this.filterOrders = this.orders 
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
        /* padding-left: 10%;
        padding-right: 10%;
        border: #edf1ee solid 1px; */
        margin-right: 10%;
        margin-left: 10%;
        /* border-radius: 25px; */
    }

}

</style>