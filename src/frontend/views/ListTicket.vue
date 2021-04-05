<template>
  <div id="menu" class="menu">

    <ion-card>
      <ion-card-title>
      {{$t('frontend.order.yourTicket')}} 
      </ion-card-title>
    </ion-card>
      
<!--     
     <ion-item-divider/> -->

     <div v-if="spinner">
        <ion-spinner  name="lines" class="spinner"></ion-spinner>
      </div>

   

      <ion-item-sliding>

        <ion-item >
            <ion-label class="ion-text-wrap menu-col-4"><h2 style="font-size: 16px;font-weight: bold;">{{$t('frontend.order.type')}}</h2> </ion-label>
            <ion-label class="ion-text-wrap menu-col-4"><h3  style="font-size: 16px;font-weight: bold;">{{$t('frontend.order.total')}}</h3></ion-label>
            <ion-label class="ion-text-wrap menu-col-4"><h3  style="font-size: 16px;font-weight: bold;">{{$t('frontend.order.date')}}</h3></ion-label>            
        </ion-item>

        <ion-item-options side="end">
          <ion-item-option color="primary" >
            <span class="iconify" data-icon="teenyicons:pdf-outline" data-inline="false"></span>
          </ion-item-option>     
        </ion-item-options>

      </ion-item-sliding>

      <ion-label class="ion-text-wrap menu-col-12" v-if="clientId ===''">
            <p style="display: inline-block; text-align: center; font-style: italic;color: red;font-weight: 500;" color="danger" v-if="clientId ===''" class="ion-text-wrap menu-col-12">
                <span class="iconify" data-icon="el:error-alt" data-inline="false" style="color: red; margin: 5px 0 0 15px; width: 18px;height: 18px;"></span>
                {{$t('frontend.home.clientRequired')}}</p>
            </ion-label>

       <paginate name="languages"
          v-if="!spinner && clientId !==''"
          ref="paginator"         
          :list="orders"
          :per="8"
        >
          <ion-item-sliding v-for="order in paginated('languages')" :key="order._id">
                 
                  <ion-item style="width: 100%;"
                   @click="seeDetail(order)"
                   :style="order.State===6 ? '--background:#ff00001f' : order.State===5 ? '--background: #71676738': order.State===7 ? '--background: #edeb3038' : order.State===8 ? '--background: #ef914938' :'--background: #14eb1412'">

                    
                   
                    <ion-label  class="ion-text-wrap menu-col-4 elipsis-menu">
                        <h2>{{ order.tableService }}</h2>               
                    </ion-label>                    
                    <ion-label class="ion-text-wrap menu-col-4 elipsis-menu">
                        <h2>{{ getFormatPrice(order.Total) }}</h2>               
                    </ion-label>
                   <ion-label class="ion-text-wrap menu-col-4 elipsis-menu">
                        <h2> {{getDate(order.Date)}}</h2>     
                          <span class="iconify" data-icon="mdi:backburger" style="color: grey;margin:0;width: 20px; height: 20px;" data-inline="false"></span>
                    </ion-label>
                    
                    
                    
                  </ion-item>

                   <ion-item-options side="end">

                      <ion-item-option  @click="seeDetail(order)" v-tooltip="$t('frontend.tooltips.editTicket')" >
                        <span class="iconify" data-icon="fa-solid:edit" data-inline="false"></span>
                      </ion-item-option> 

                       <ion-item-option  v-tooltip="$t('frontend.tooltips.closeTicket')">                        
                        <span class="iconify" data-icon="eva:close-circle-fill" data-inline="false" style="color: red;"></span>  
                      </ion-item-option>                     

                  </ion-item-options>
          </ion-item-sliding>
        </paginate>

        <paginate-links for="languages" color="primary" 
        @change="onLangsPageChange()"
        :async="true"
         v-if="clientId !==''"
          :simple="{
            next:'»' ,
            prev: '« ' }"
        ></paginate-links>
  

  </div>
</template>

<script>

import moment from 'moment-timezone';




export default {

  name: 'ListTicket',

  created: async function(){  

     if(this.$store.state.customer._id){
         this.clientId= this.$store.state.customer._id;   
         this.name = this.$store.state.customer.Name;     
       }
   
   if(this.$store.state.restaurantActive)
    if(this.$store.state.restaurantActive.configuration)
      this.showCooker = this.$store.state.restaurantActive.configuration.showCooker;

    this.allOrders = this.$store.state.allTickets;
    this.configuration = this.$store.state.configuration;
    this.restaurantActive = this.$store.state.restaurantActive

  

    this.orders = JSON.parse(JSON.stringify(this.allOrders));
   

  },
    mounted: function(){
        if(this.$route.params.currentPageOrder > 1){
          this.currentPageOrder = this.$route.params.currentPageOrder; 
           this.$refs.paginator.goToPage(this.currentPageOrder);
       }
      },
   components:{
    
  },
   props:{  
    products: {type: Array, default:() => [] }, 
    fromMyAccount:  {type: String, default:"" },
  },
  data () {
    return { 
      orders: [],
      name: '',
      spinner: false,
      allTypeOrder:{'Delivery':this.$t('frontend.app.deliver'), 'PickUp':this.$t('frontend.app.pickup'), 'On Table':this.$t('frontend.app.table') },
      paginate: ['languages'],
      dots: false,  
      productsForReorder: [], 
      producstNotAvailables: '',
      currentPageOrder: 1,
      showCooker:  false,
      allOrders: [],
      configuration: {},
      restaurantActive: {},
      
    }
  }, 
 

  methods: {

    

    seeDetail: function(order){
      let orderInfo = '';
      if(order.OrderType == 'Delivery')
          orderInfo = order.AddressToDeliver
      if(order.OrderType == 'PickUp')
          orderInfo = order.HourToPick
      if(order.OrderType == 'On Table')
          orderInfo = order.tableService
      
      return this.$router.push({ name: 'OrderTicket', params: {order: order, CustomerName: this.name, orderInfo: orderInfo, fromMyAccount: this.fromMyAccount, currentPageOrder: this.currentPageOrder, backButton: true } })
    },

    

    onLangsPageChange () { 
        this.currentPageOrder = this.$refs.paginator.currentPage + 1;        
    },

    getDate(date){
      var formatDate = moment.tz(date, moment.tz.guess()).format('MM/DD/YY');
      return formatDate;

    },

     getFormatPrice(price){
       let result = price
       if (this.restaurantActive.currency)
          result = new Intl.NumberFormat('en', {style: "currency", currency: this.restaurantActive.currency} ).format(price)
      return result;
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
  .elipsis-menu{
        text-overflow: ellipsis !important;
    overflow: hidden !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }


</style>