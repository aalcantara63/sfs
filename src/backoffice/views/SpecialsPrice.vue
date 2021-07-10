<template>
  <div id="order" class="screen">

    
    <ion-header>
          <ion-toolbar>

             <ion-toolbar>
                <ion-buttons slot="start">
                  <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'ControlPanel'})"></ion-back-button>
                </ion-buttons>

                <ion-label style="padding: 20px 100px;">
                  <h1>{{$t('frontend.specialsPrice.titles')}}</h1>   
                           
                </ion-label>

                  <ion-label v-if="hasPermission('canCreateSpecialPrices')" slot="end">
                      <ion-chip style="font-size: 30px" @click="viewOrder()">
                          <ion-label><ion-icon name="add"></ion-icon></ion-label>
                      </ion-chip>
                  </ion-label>
          </ion-toolbar>
           
            
                      
          </ion-toolbar>

          <ion-searchbar  
              @ionClear="handleInput('')"
                @input="$event.target.value?handleInput($event.target.value):handleInput('')"
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
            

        <div  v-if="menuactive==='list'">
          <paginate
            :key="key"  
            name="languages"
            :list="filterOrders"
            :per="8"                     
          >
          <h3>{{$t('frontend.specialsPrice.activeRule')}}</h3>
            <ion-item-sliding  v-for="order in paginated('languages')" v-bind:key="order._id">
              <ion-item :color="order.Active? 'success' : 'warning'"
             
              @click="viewOrder(order)">
               <ion-label class="menu-col-4 elipsis-menu">                   
                    <h6>{{ order.Name }}</h6>                   
                </ion-label> 
                <ion-label class="menu-col-4 ">                   
                    <h6>{{ order.For }} {{order.Amount}} 
                      <span v-if="order.Type==='Percent'">%</span>
                      <span v-if="order.Type==='Amount'">$</span>
                      </h6>                              
                </ion-label>
                <ion-label class="menu-col-2 elipsis-menu">                               
                          {{order.Repeat}}                
                </ion-label>
                 <ion-label class="menu-col-2 elipsis-menu">    
                   <span v-if="order.Active">{{$t('frontend.createNew.active')}}</span>                           
                   <span v-else>{{$t('frontend.createNew.inactive')}}</span>                         
                </ion-label>

               
                            
              </ion-item>
              <ion-item-options side="end">                   
                  <ion-item-option v-if="hasPermission('canEditSpecialPrices')" color="primary" @click="viewOrder(order)">
                    <ion-icon slot="icon-only" name="list"></ion-icon>
                  </ion-item-option> 
                   <ion-item-option v-if="hasPermission('canDeleteSpecialPrices')" color="danger" @click="deleteOrder(order._id)">
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
// import { VBreakpoint } from 'vue-breakpoint-component'

export default {

  name: 'SpecialsPrice',
  created: function(){  
    this.fetchOrders();
  
  },
  components:{   
    // VBreakpoint: VBreakpoint,  
  },
  data () {
    return {
      modelName: 'SpecialsPrice',
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
        let cat2 = this.orders.filter(item => item.Name.toLowerCase().indexOf(query) > -1 ||
                                          item.Type.toLowerCase().indexOf(query) > -1 )
        if(cat2.length> 0)
          this.filterOrders = cat2
        else
          this.fil = this.orders 
      });
    },
       

    viewOrder: function(specialsPrice){
        console.log('Open specialsprice type con ID '+ specialsPrice);
        return this.$router.push({ name: 'SpecialsPriceDetail', params: {specialsPrice: specialsPrice} })
    },

    
    async deleteOrder(id){

      console.log('delete specialsprice: ' + id)
      try {
        this.spinner = true;
        const response = await Api.deleteById('specialsprice', id);
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
        const response = await Api.fetchAll('specialsprice')
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

   
    reverseOrders(){
      this.filterOrders.reverse();
    },

    scrollToTop() {
      document.querySelector('ion-card-content').scrollToTop(500);
    },
 
   getActives(){
     if(this.showActive)
      this.filterOrders = this.filterOrders.filter(p => p.Active === true);
      else
       this.filterOrders = this.orders 
   },

  hasPermission(permission){
            
            let res = false;
            if (this.$store.state.authenticated)
            {
                let roles = this.$store.state.roles;
                for (let index = 0; index < roles.length; index++) {
                    switch(permission){                        
                        case 'canViewSpecialPrices':
                            res = roles[index].canViewSpecialPrices;
                            break;
                        case 'canEditSpecialPrices':
                            res = roles[index].canEditSpecialPrices;
                            break;
                        case 'canCreateSpecialPrices':
                            res = roles[index].canCreateSpecialPrices;
                            break;
                        case 'canDeleteSpecialPrices':
                            res = roles[index].canDeleteSpecialPrices;
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