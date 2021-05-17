<template>
  <div id="menu" class="menu">

    <ion-card>
    
      <!-- <ion-back-button default-href="" @click="$router.go(-1)"></ion-back-button> -->
           
      <ion-card-title>
      {{$t('frontend.order.yourOrders')}}
        <ion-label class="ion-text-wrap">           
            <ion-button fill="outline" v-if="!spinner" style="float: right; margin-right: 10px;" @click="addOrder" v-tooltip="$t('frontend.tooltips.addOrder')"> +  </ion-button>
        </ion-label>
         <ion-searchbar 
                @ionClear="handleInput('')"
                @input="$event.target.value?handleInput($event.target.value):handleInput('')"
                :placeholder="$t('frontend.home.search')">           
            </ion-searchbar>
      </ion-card-title>
    </ion-card>

     <ion-refresher 
        style="position: relative"
        slot="fixed"
        @ionRefresh="doRefresh($event)">
          <ion-refresher-content 
            refreshing-spinner="crescent"
          ></ion-refresher-content>
      </ion-refresher>
      
<!--     
     <ion-item-divider/> -->

     <div v-if="spinner">
        <ion-spinner  name="lines" class="spinner"></ion-spinner>
      </div>

      <modal name="my-third-modal" width="80%" height="80%">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ $t('frontend.home.tableQr') }}</ion-title>
          </ion-toolbar>
        </ion-header>

        <div class="ion-padding" style="height: 90%">            
          <qrcode-stream @decode="onDecode" @init="onInit" />
        </div>    
      </modal>

      <ion-item-sliding>
        <v-breakpoint >
            <div  slot-scope="scope">


              <ion-item    v-if="!scope.isSmall && !scope.noMatch">
                  <ion-label class="ion-text-wrap menu-col-3"><h2 style="font-size: 16px;font-weight: bold;">{{$t('frontend.order.type')}}</h2> </ion-label>
                  <ion-label class="ion-text-wrap menu-col-3"> <h3  style="font-size: 16px;font-weight: bold;">{{$t('frontend.order.state')}}</h3></ion-label>
                  <ion-label class="ion-text-wrap menu-col-3"><h3  style="font-size: 16px;font-weight: bold;">{{$t('frontend.order.total')}}</h3></ion-label>
                  <ion-label class="ion-text-wrap menu-col-3"><h3  style="font-size: 16px;font-weight: bold;">{{$t('frontend.order.date')}}</h3></ion-label>            
              </ion-item>
              <ion-item    v-if="scope.isSmall || scope.noMatch">
                  <ion-label class="ion-text-wrap menu-col-4"><h2 style="font-size: 16px;font-weight: bold;">{{$t('frontend.order.type')}}</h2> </ion-label>
                  <ion-label class="ion-text-wrap menu-col-4"><h3  style="font-size: 16px;font-weight: bold;">{{$t('frontend.order.total')}}</h3></ion-label>
                  <ion-label class="ion-text-wrap menu-col-4"><h3  style="font-size: 16px;font-weight: bold;">{{$t('frontend.order.date')}}</h3></ion-label>            
              </ion-item>

            </div>
        </v-breakpoint>

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

             <v-breakpoint >
               <div  slot-scope="scope" :key="refreshKey">

                  <ion-item
                    v-if="!scope.isSmall && !scope.noMatch"
                  
                   style="width: 100%;"
                   @click="seeDetail(order)"
                   :style="order.State===6 ? '--background:#ff00001f' : order.State===5 ? '--background: #71676738': order.State===7 ? '--background: #edeb3038' : order.State===8 ? '--background: #ef914938' :'--background: #14eb1412'">

                    
                    <ion-label v-if="order.OrderForCatering" 
                      class="ion-text-wrap menu-col-3 elipsis-menu"> 
                        <h2>{{ allTypeOrder[order.OrderType] }}(Catering)</h2>               
                    </ion-label>
                    <ion-label v-else 
                     class="ion-text-wrap menu-col-3 elipsis-menu"> 
                        <h2>{{ allTypeOrder[order.OrderType] }}</h2>               
                    </ion-label>
                    <ion-label 
                    class="ion-text-wrap menu-col-3 elipsis-menu">        
                        <h2>{{allStates[ order.State] }}</h2>               
                    </ion-label >
                    <ion-label 
                     class="ion-text-wrap menu-col-3 elipsis-menu"> 
                        <h2>{{ getFormatPrice(order.Total) }}</h2>               
                    </ion-label>
                   <ion-label 
                      class="ion-text-wrap menu-col-3 elipsis-menu"> 
                        <h2 style="display: contents"> {{getDate(order.Date)}}</h2>     
                        <div style="position: absolute; right: 0px; top: 30%;">
                           <span class="iconify" data-icon="mdi:backburger" style="color: grey;margin:0;width: 20px; height: 20px;" data-inline="false"></span>
                        </div>          
                    </ion-label>
                    
                  </ion-item>

                   <ion-item
                    v-if="scope.isSmall || scope.noMatch"
                  
                   style="width: 100%;"
                   @click="seeDetail(order)"
                   :style="order.State===6 ? '--background:#ff00001f' : order.State===5 ? '--background: #71676738': order.State===7 ? '--background: #edeb3038' : order.State===8 ? '--background: #ef914938' :'--background: #14eb1412'">

                    
                    <ion-label v-if="order.OrderForCatering" 
                      class="ion-text-wrap menu-col-4 elipsis-menu"> 
                        <h2>{{ allTypeOrder[order.OrderType] }}(Catering)</h2>               
                    </ion-label>
                    <ion-label v-else 
                     class="ion-text-wrap menu-col-4 elipsis-menu"> 
                        <h2>{{ allTypeOrder[order.OrderType] }}</h2>               
                    </ion-label>                    
                    <ion-label 
                     class="ion-text-wrap menu-col-4 elipsis-menu"> 
                        <h2>{{ getFormatPrice(order.Total) }}</h2>               
                    </ion-label>
                   <ion-label 
                      class="ion-text-wrap menu-col-4 elipsis-menu"> 
                        <h2 style="display: contents"> {{getDate(order.Date)}}</h2>     
                        <div style="position: absolute; right: 0px; top: 30%;">
                           <span class="iconify" data-icon="mdi:backburger" style="color: grey;margin:0;width: 20px; height: 20px;" data-inline="false"></span>
                        </div>        
                    </ion-label>
                    
                  </ion-item>

                     <ion-item-options side="end">

                     <ion-item-option color="primary"  @click.stop="reOrder(order)" v-tooltip="$t('frontend.tooltips.reOrder')">                        
                        <span class="iconify" data-icon="mi:shopping-cart-add" data-inline="false"></span>   
                      </ion-item-option>

                       <ion-item-option                      
                      color="primary"  @click="sendEmail(order)" v-tooltip="$t('frontend.tooltips.forward')" >
                          <span  class="iconify" data-icon="carbon:mail-all" data-inline="false"></span>
                          <ion-spinner v-if="spinnerEmail"></ion-spinner>
                      </ion-item-option>                          

                       <ion-item-option 
                      color="primary" @click="printOrder(order)"  v-tooltip="$t('frontend.tooltips.printOrder')" >
                          <span class="iconify" data-icon="ic:round-local-printshop" data-inline="false"></span>
                      </ion-item-option> 

                  </ion-item-options>

               </div>
                 
                  


                 

             </v-breakpoint>

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

import { EventBus } from '../event-bus';
import moment from 'moment-timezone';
import { Api } from '../../backoffice/api/api.js';
import { QrcodeStream } from 'vue-qrcode-reader';
 import Moment from 'moment';
  import LibCodes from 'zipcodes'
   import { VBreakpoint } from 'vue-breakpoint-component'



export default {

  name: 'ListOrder',

  created: async function(){  

     if(this.$store.state.customer._id){
         this.clientId= this.$store.state.customer._id;   
         this.name = this.$store.state.customer.Name;     
       }
   
   if(this.$store.state.restaurantActive)
    if(this.$store.state.restaurantActive.configuration)
      this.showCooker = this.$store.state.restaurantActive.configuration.showCooker;

    this.allOrders = this.$store.state.allOrders;
    this.configuration = this.$store.state.configuration;
    this.restaurantActive = this.$store.state.restaurantActive

     
    for(var i=0; i< this.allOrders.length; i++){
       this.allOrders[i].iState = this.allStates[this.allOrders[i].State];
    }

    this.orders = JSON.parse(JSON.stringify(this.allOrders));
    this.homeOrder = this.$store.state.order,

     EventBus.$on('sendReorder', (value) => {           
      this.reOrder(value);
       EventBus.$off('sendReorder');
    });
     EventBus.$on('sendPrint', (value) => {           
      this.printOrder(value);
      EventBus.$off('sendPrint');
    });

  },
    mounted: function(){
        if(this.$route.params.currentPageOrder > 1){
          this.currentPageOrder = this.$route.params.currentPageOrder; 
           this.$refs.paginator.goToPage(this.currentPageOrder);
       }
      },
   components:{
     QrcodeStream: QrcodeStream,
      VBreakpoint: VBreakpoint,
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
      allStates: [this.$t('frontend.order.state0'),this.$t('frontend.order.state1'), this.$t('frontend.order.state2'),
      this.$t('frontend.order.state3'), this.$t('frontend.order.state4'), this.$t('frontend.order.state5'), this.$t('frontend.order.state6'), this.$t('frontend.order.state7'), this.$t('frontend.order.state8')],
      allTypeOrder:{'Delivery':this.$t('frontend.app.deliver'), 'PickUp':this.$t('frontend.app.pickup'), 'On Table':this.$t('frontend.app.table'), 'Curbside':this.$t('frontend.app.curbside'), },
      langs: ['JavaScript', 'PHP', 'HTML', 'CSS', 'Ruby', 'Python', 'Erlang'],
      paginate: ['languages'],
      dots: false,   
      homeOrder: {},  
      productsForReorder: [], 
      producstNotAvailables: '',
      currentPageOrder: 1,
      showCooker:  false,
      allOrders: [],
      configuration: {},
      restaurantActive: {},
      refreshKey: 1,
      spinnerEmail: false,
      
    }
  }, 
 

  methods: {

     async doRefresh(event) {
    
      await this.getOrders();      
      event.target.complete();
    },

    handleInput(value){

       this.orders = this.allOrders
      const query = value.toLowerCase();
      requestAnimationFrame(() => {   
        let cat2 = this.allOrders.filter(item => item.OrderType.toLowerCase().indexOf(query) > -1 ||
                                          item.iState.toLowerCase().indexOf(query) > -1 )
        if(cat2.length> 0)
          this.orders = cat2
        else
          this.orders = this.allOrders 
      });
    },

    seeDetail: function(order){
      let orderInfo = '';
      if(order.OrderType == 'Delivery')
          orderInfo = order.AddressToDeliver
      if(order.OrderType == 'PickUp')
          orderInfo = order.HourToPick
      if(order.OrderType == 'On Table')
          orderInfo = order.tableService
      
      return this.$router.push({ name: 'OrderState', params: {order: order, CustomerName: this.name, orderInfo: orderInfo, fromMyAccount: this.fromMyAccount, currentPageOrder: this.currentPageOrder } })
    },

    addOrder: function(){
      EventBus.$emit('openHome', true );    
    },

    onLangsPageChange () { 
        this.currentPageOrder = this.$refs.paginator.currentPage + 1;        
    },

    getDate(date){
      var formatDate = moment.tz(date, moment.tz.guess()).format('MM/DD/YY');
      return formatDate;

    },

    async htmlToUse(order, showLogo){

      let totalWithoutQuotation = 0;
      if(order.QuotationPayment)        
            totalWithoutQuotation = order.Total - order.QuotationPayment;
        else
            totalWithoutQuotation = order.Total;

       var date = moment.tz(order.Date, moment.tz.guess()).format('MM-DD-YYYY hh:mm A');
        if(order.OrderForCatering === true)
          date = moment.tz(order.DateToPick, moment.tz.guess()).format('MM-DD-YYYY') + ' ' +  moment.tz(order.HourToPick, moment.tz.guess()).format('hh:mm A') ;

        const  allStates = [this.$t('frontend.order.state0'),this.$t('frontend.order.state1'), this.$t('frontend.order.state2'),
        this.$t('frontend.order.state3'), this.$t('frontend.order.state4'), this.$t('frontend.order.state5'), this.$t('frontend.order.state6'), this.$t('frontend.order.state7'), this.$t('frontend.order.state8')];

        let orderInfo = '';
        if(order.OrderType == 'Delivery')
            orderInfo = order.AddressToDeliver
        if(order.OrderType == 'PickUp')
            orderInfo = order.HourToPick
        if(order.OrderType == 'On Table')
            orderInfo = order.tableService


        let Cookername = '';

        try {
          if(this.showCooker && order.Cooker){          
          const response = await Api.fetchById('Staff', order.Cooker);
          
          if(response.status === 200){           
            Cookername = response.data.FirstName + ' '+ response.data.LastName;            
            }  
          }
        } catch (error) {
          console.log(error)
        }

      

        var html =' <html><head>';    
        html +='<style> .progressBar { width: 100%;  border-bottom: 1px solid black;display: list-item;list-style: unset; padding: 0}';
        html += '.progressBar li {list-style-type: none; float: left; position: relative; text-align: center; margin:0}';
        html += '.progressBar li .before {content: " "; line-height: 30px; border-radius: 50%; width: 30px; height: 30px; border: 1px solid #ddd;';
        html += 'display: block;text-align: center;margin: 0 auto 10px;background-color: white}';
        html += '.progressBar li .after { content: "";position: absolute;width: 100%;height: 4px;background-color: #ddd;top: 15px;left: -50%;z-index: -1;}';
        html += '.progressBar li .one .after {content: none;}.progressBar li.active {color: black;}';
        html += '.progressBar li.active .before { border-color: #63ee68; background-color: #63ee68}.progressBar .active:after {background-color: #4ca44f;} </style>';
        
        html += '</head><body><div >';
        html += '<table  align=center style="width: 90%;">';
        html += '<tr><td colspan=6 style="text-align: center;">';
        html += `<h2>${this.restaurantActive.restaurantName}</h2>  `;
        if(showLogo)
          html += `<img src="${this.restaurantActive.restaurantLogo}" style="max-width: 100px;"></img> `;     
        html +=`</td>`;     
        html += `</tr>`;          
        html += '<tr><td colspan=6 >'
         if(order.Payment){
           html += `<h4> ${this.$t('frontend.order.payment')}:</h4>`;
           for (const payment of order.Payment) {
            if(payment.paymentInfo)
              html += `<p> 
                ${this.$t('frontend.order.total')}: <strong>  ${ payment.total} </strong>  |
                ${this.$t('frontend.order.transId')}: <strong>  ${ payment.paymentInfo.transId} </strong>  |
                ${this.$t('frontend.order.paymentMethod')}: <strong>  ${ payment.PaymentMethod} </strong> 
              </p>`;
          }
        }
        html += `<h4>${this.$t('frontend.order.date')}: ${date} </h4><hr>`;
        html += `<h4>${this.$t('frontend.order.client')}: ${order.CustomerName} </h4>`;
        html += `<h4>${this.$t('frontend.orderType.phone')}: ${order.CustomerPhone} </h4>`;      
        html += `<h4>${this.$t('frontend.order.orderFor')} ${this.allTypeOrder[order.OrderType]}: ${orderInfo} </h4>`;
        if(Cookername !== '')
        html += `<h4>${this.$t('frontend.order.cooker')}: ${Cookername} </h4>`;
        html += `<h4>${this.$t('frontend.order.orderState')}: ${allStates[order.State]} </h4>`;
        if(order.State == 6)
            html += `<h4>${this.$t('frontend.order.cancelReason')}: ${order.CancelNote}</h4>`;

        html += '<hr>';
        html += '<tr><td colspan=6 >'
         if(order.EventName)
            html += `<h4> ${this.$t('frontend.order.eventName')}: ${order.EventName} </h4>`;
         if(order.CateringEvent)
            html += `<h4> ${this.$t('frontend.home.eventType')}: ${order.CateringEvent} </h4>`;
        if(order.NumberOfGuess)
            html += `<h4> ${this.$t('frontend.order.guessNumber')}: ${order.NumberOfGuess} </h4>`;
        if(order.EventDate)
            html += `<h4> ${this.$t('frontend.order.eventDate')}: ${ moment.tz(order.EventDate, moment.tz.guess()).format('MM-DD-YYYY')} </h4>`;
        if(order.EventTimeStart)
            html += `<h4> ${this.$t('frontend.order.eventStartHour')}: ${ moment.tz(order.EventTimeStart, moment.tz.guess()).format('hh:mm A')}</h4>`;
        if(order.EventTimeEnd)
            html += `<h4> ${this.$t('frontend.order.eventEndHour')}: ${ moment.tz(order.EventTimeEnd, moment.tz.guess()).format('hh:mm A')}</h4>`;
        html += `</td></tr>`; 
              
        // html += `</td></tr>`;
        html += '<br>'; 
        html += `<tr><br><td colspan=6 style="border-top: 1px solid black;"><h4 ><strong>${this.$t('frontend.order.products')}</strong></h4></td></tr> <tr></tr>`;
        for(var i = 0; i<order.Products.length ; i++){
            html += `<tr ><td  colspan=4 style="width: 50%;border-bottom: 1px solid #dbd1d1;" ><strong >${order.Products[i].Name}</strong>` ;
            if(order.Products[i].Note !='')
                html +=`<p style="background: #f1f1004d;">${order.Products[i].Note}</p> `;
            html +=`</td><td style="width: 25%;border-bottom: 1px solid #dbd1d1;" > <p >( ${order.Products[i].Cant} X ${this.getFormatPrice(order.Products[i].Price)})</p> </td>`;
            html += `<td style="width: 25%;border-bottom: 1px solid #dbd1d1;"> <p >${ this.getFormatPrice( order.Products[i].Price * order.Products[i].Cant )}</p> </td>`;
            html += `</tr>`;
           if(order.Products[i].Aggregates.length > 0){
                html +=`<tr style="padding: 20px 35px;"> ${this.$t('frontend.home.aggregateFree')}: ${order.Products[i].CantAggr=order.Products[i].AggregatesCant * order.Products[i].Cant} </tr>`;

                 for(var a=0; a<order.Products[i].Aggregates.length; a++){
                    let agg = order.Products[i].Aggregates[a]
                    html += `<tr ><td  colspan=4 style="width: 50%;border-bottom: 1px solid #dbd1d1;" ><p style="padding-left: 20px;">${agg.Name} <br>${this.getFormatPrice(agg.SalePrice)}</p>` ;
                    html +=`</td><td style="width: 25%;border-bottom: 1px solid #dbd1d1;" > <p > ${agg.Cant}</p> </td>`;
                    html += `<td style="width: 25%;border-bottom: 1px solid #dbd1d1;"> <p > ${ this.getFormatPrice( agg.AllTotal ) }</p> </td></tr >`;            
                 }
            }
            
        }
       
        if(order.OtherCharges.length >0){
            html += `<tr ><td colspan=6 ><h4 ><strong>${this.$t('frontend.order.otherCharges')}</strong></h4></td></tr>`;
            for(var e = 0; e< order.OtherCharges.length ; e++){
                html += ` <tr ><td colspan=5 style="width: 75%;border-bottom: 1px solid #dbd1d1;"><p >${order.OtherCharges[e].Name}</p></td> <td style="border-bottom: 1px solid #dbd1d1;"> <p>${this.getFormatPrice(order.OtherCharges[e].Price)}</p></td></tr>`;
            }
        }
       
        
        html += `<tr ><td colspan=5 ><br><p ><strong>${this.$t('frontend.order.subtotal')}</strong></p></td> <td ><br> <p >${this.getFormatPrice(order.SubTotal)}</p></td></tr>`;      
       html += `<tr><td  colspan=5 ><p  ><strong>${this.$t('frontend.order.taxe')} ${order.Taxe}%</strong></p></td> <td > <p >${ this.getFormatPrice(order.Taxe * order.SubTotal / 100) } </p> </td></tr>`;      
        if(order.OrderType == 'Delivery' && order.Shipping)
            html +=  `<tr ><td colspan=5  ><p  ><strong>${this.$t('frontend.order.deliver')}</strong></p></td><td  ><p >${this.getFormatPrice(order.Shipping)}</p></td></tr>`;
        if(order.Tip)
            html += `<tr ><td  colspan=5 ><p ><strong>${this.$t('frontend.order.tip')} ${order.Tip}%</strong></p></td><td ><p>${ this.getFormatPrice(order.Tip * order.SubTotal / 100) } </p> </td></tr>`;
        html += `<tr><td colspan=5 style="border-bottom: 1px solid #dbd1d1;"><p  ><strong>${this.$t('frontend.order.total')}</strong></p></td> <td style="border-bottom: 1px solid #dbd1d1;"> <strong > ${this.getFormatPrice(order.Total)}</strong> </td></tr>`;
        
        if(order.QuotationPayment)
          html += `<tr style="border-bottom: 1px solid #399922;"><td colspan=5 ><p  ><strong>${this.$t('frontend.order.quotationPayment')}</strong></p></td> <td > <strong >${this.getFormatPrice(order.QuotationPayment)}</strong> </td></tr>`;
        if(order.PendingPayment)
          html += `<tr style="border-bottom: 1px solid #ff5500;"><td colspan=5 style="border-bottom: 1px solid #ff5500;"><p  ><strong>${this.$t('frontend.order.pendingPayment')}</strong></p></td> <td  style="border-bottom: 1px solid #ff5500;"> <strong >${this.getFormatPrice(order.PendingPayment)}</strong> </td></tr>`;
        if(order.PendingPayment > 0 && order.Deadline){
            html += `<tr ><td colspan=6 ><h4 ><strong>${this.$t('frontend.order.parcialPayment')}</strong></h4></td></tr>`;
            for(var dead = 0; dead < order.Deadline.length ; dead ++){
                html += ` <tr ><td colspan=3 style="border-bottom: 1px solid #dbd1d1;"><p >${order.Deadline[dead].Date}  </p></td> `
                html += ` <td colspan=3 style="border-bottom: 1px solid #dbd1d1;"><strong >  ${order.Deadline[dead].Percent}%  =  ${ this.getFormatPrice((totalWithoutQuotation * order.Deadline[dead].Percent) / 100)}</strong></td> `
                if(order.Deadline[dead].State === 1)
                html += ` <td style="border-bottom: 1px solid #dbd1d1;"> <strong  style= "color: #399922;  ">${this.$t('frontend.order.payed')}</strong></td>`;
                else html += ` <td style="border-bottom: 1px solid #dbd1d1;"><strong  style= "color: #ff5500; ">${this.$t('frontend.order.toPay')}</strong> </td>`;
                html += ` </tr>`;
            }
          }
        
        if(order.Note)
            html += `<tr ><td style="width: 20%;border-bottom: 1px solid grey;"><h4 >${this.$t('frontend.order.notes')}</h4></td><td colspan=5 style="width: 80%;border-bottom: 1px solid grey;" ><p >${order.Note}</p></td></tr>`;
        html += '<tr><td colspan=6 style=" text-align: center;">';
        html += `<h2>${this.restaurantActive.restaurantName}</h2>  `;
        html += `<h4>${this.restaurantActive.restaurantPhone} </h4> `;
        html += `<h4>${this.restaurantActive.restaurantAddress}  </h4>`; 
        if(this.restaurantWeb)  
            html += `<h4>${this.restaurantWeb}  </h4>`;   
        html +=`</td>`;     
        html += `</tr>`;       
        html += `</table></div></body></html>`;

        return html;



    },

    async printOrder(order){
        
        var html = await this.htmlToUse(order, true)
        
          var winimp = window.open('/print', 'popimpr');
          winimp.document.open();
          winimp.document.write( html );
          winimp.document.close();
          winimp.focus();
          winimp.print();
          winimp.close();

   },

       async sendEmail(order){

         this.spinnerEmail = true;
        
        var html = await this.htmlToUse(order, true)
        
          var items = {
            "email": order.CustomerEmail,
            "mess": html,
            "subject": this.$t('frontend.order.invoice') + '-'+ order.Payment[0].paymentInfo.transId +' ' + this.restaurantActive.restaurantName
          }
         await Api.sendEmail(items);   
         this.spinnerEmail = false;

         return true;

   },

    alertSelectOrderType(order){
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: '',
          message: this.$t('frontend.home.pickTime') + this.$t('frontend.home.selectOrderType'),
          inputs:[
            {type: 'radio', label: this.$t('frontend.app.deliver'), value: 'delivery', },          
            {type: 'radio', label: this.$t('frontend.app.table'), value: 'table', },        
          ],
          buttons: [                   
          {
            text: this.$t('frontend.home.cancel'),
            handler: () => { 
            },
          },
            {
            text: this.$t('frontend.home.acept'),
            handler: async(value) =>  {  
              await this.chooseOrderType(value, order);                          
              }
            },       
          ],
      })
      .then(a => a.present())
                  
    },

    async chooseOrderType(value, order) {
      if(value ==='delivery'){       
         this.$store.commit('setCart', order.Products ); 
        return this.deliveryAction()       
      } 
      if(value ==='table'){
        this.productsForReorder = order.Products;
        return this.show();   
      }  
      
      return this.reOrder(order)
    },

  async reOrder(order){
    
    for(var i=0; i< order.Products.length; i++){
      const inx = this.products.findIndex(pr => pr._id === order.Products[i].ProductId);      
      if(inx !== -1){
        if(this.products[inx].Available === false){         
           order.Products.splice(i, 1);
           this.producstNotAvailables +=', ' + this.products[inx].Name;
        }  
      }               
    }  
    if(order.Products.length === 0)
    {
       return this.alertNotProductForReoder();
    }
    else{

      let thisOrder = {           
            'ClientId' : order.ClientId
            }

      if(order.OrderForCatering) {
        if(order.CateringEvent)
            thisOrder.CateringEvent = order.CateringEvent;
        if(order.NumberOfGuess)
            thisOrder.NumberOfGuess = order.NumberOfGuess;
        if(order.EventName)
          thisOrder.EventName = order.EventName;
      }

      if(!this.homeOrder.OrderType){
        if(order.OrderType === 'Delivery' ){
            thisOrder.OrderType = order.OrderType;
            thisOrder.AddressToDeliver = order.AddressToDeliver || ''; 
            thisOrder.addres1 = order.addres1 || '';
            thisOrder.addres2 = order.addres2 || '';
            thisOrder.zipCode = order.zipCode || '';   
        
           this.$store.commit('setOrder', thisOrder);
        }

        if(order.OrderType === 'PickUp'){  
            this.$store.commit('setOrder', thisOrder);
        }

        if(order.OrderType === 'On Table') { 
            this.$store.commit('setOrder', thisOrder);
        }
      }

        
        this.$store.commit('setCart', order.Products );

        if(this.producstNotAvailables != '')
          this.openToastProducstNotAvailable(this.producstNotAvailables)
        this.producstNotAvailables = '';

        
        if(order.OrderForCatering)
           this.$router.push({ name: 'OrderCatering', params: {backButton: true, url: this.restaurantActive.restaurantUrl} }) ;
        else  
           this.$router.push({ name: 'OrderFront', params: {backButton: true, url: this.restaurantActive.restaurantUrl} }) ;

      }
   },

  async openToast(message) {
    return this.$ionic.toastController
    
      .create({
        message: message,
        duration: 2000,
        position: 'top',
        color:'success'
      })
    .then(a => a.present())
  },

  async openToastProducstNotAvailable(message) {
    return this.$ionic.toastController
    
      .create({
        header: this.$t('frontend.home.noProductAvailable'),
        message: message,
        duration: 2000,
        position: 'middle',
        color:'warning'
      })
    .then(a => a.present())
  },

    show () {
      this.$modal.show('my-third-modal');
      },

    hide () {
      this.$modal.hide('my-third-modal');
        },

    onDecode (result) {
        this.result = result      
        this.tableAction(result)
        this.hide();
      },

    onInit (promise) {
      promise.then(() => {
        console.log('Successfully initilized! Ready for scanning now!')
      })
       .catch (error => {
        if (error.name === 'NotAllowedError') {
          this.error = "ERROR: you need to grant camera access permisson"
        } else if (error.name === 'NotFoundError') {
          this.error = "ERROR: no camera on this device"
        } else if (error.name === 'NotSupportedError') {
          this.error = "ERROR: secure context required (HTTPS, localhost)"
        } else if (error.name === 'NotReadableError') {
          this.error = "ERROR: is the camera already in use?"
        } else if (error.name === 'OverconstrainedError') {
          this.error = "ERROR: installed cameras are not suitable"
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.error = "ERROR: Stream API is not supported in this browser"
        }
      })
    },

    async deliveryAction() {   
        
       const alert = await this.$ionic.alertController
      .create({
        cssClass: 'my-custom-class',
        header: this.$t('frontend.home.deliverDetail') ,
        message: 'Aqui especificar el zipcode'+ this.city + this.state,
        inputs: [  
          { type:'text', name: 'address',id:'address-id',  placeholder: this.$t('frontend.home.address') }, 
         
          { type:'number', name: 'zipCode',id:'code-id',  placeholder: this.$t('frontend.orderType.code'),
         
        },        
        ],  
        buttons: [
          {text: this.$t('frontend.home.cancel'),role: 'cancel', cssClass: 'secondary',
            handler: () => {                
            },
          },
          {
            text: this.$t('frontend.home.acept'),
            handler: async (data) => {
            if(data.address==='' || data.zipCode ==='')
              return this.alertRequiredDatas(); 
              
            let code = await this.ValidateCode(data.zipCode);              

            if(code){
              const thisOrder = {
                'OrderType' : "Delivery" ,
                'AddressToDeliver': data.address +' State: '+ this.state +' City:'+ this.city + ' ZipCode: '+ data.zipCode,
                'ClientId' :  this.clientId
              }               
              this.$store.commit('setOrder', thisOrder);              
              this.openToast(this.allTypeOrder[thisOrder.orderType] + ': ' + thisOrder.AddressToDeliver);
              this.$router.push({ name: 'OrderFront', params: {backButton: true,  url: this.restaurantActive.restaurantUrl} }) ;
            }    
              
            },
          },
        ],
      })
      // .then(a => a.present())
      return alert.present();
     
    },

    tableAction: async function(value) {

      var codeFromQr = value.split('-');
      var tableId = '';
      var sitName = '';
      if(codeFromQr.length === 2){
        tableId = codeFromQr[0];
        sitName = codeFromQr[1];
      }
      else
       return this.notValidQr();

      this.spinner = true

      Api.fetchById("Table", tableId).then(response => {        
      this.spinner = false  
 
        if(response.status === 200 && response.data.Available){

          const seat = response.data.Seats.findIndex(t => t.name === value)
          if(seat !== -1){
             if(response.data.Seats[seat].available !== true){
               this.spinner = false ;
                return this.notSeatAvailable();
             }             
            else{
               
              this.tableService = sitName;
              this.orderType = "On Table" 
              EventBus.$emit('updateOrderType', this.orderType);
              this.showProduct = false;
              this.isDelivery = false;
              this.isPick = false;
              this.isTable = true;             
              this.order.OrderType = "On Table";
              this.order.tableService = this.tableService; 
              this.order.ClientId = this.clientId,    

              this.$store.commit('setOrder', this.order);
              
            
              this.changeOrderButton();                  
            
              response.data.State = 'Busy';
              response.data.Seats[seat].available = false;
              var tableBusy = response.data;
              Api.putIn("Table", tableBusy);

              this.openToast(this.$t('frontend.order.location') + ': ' + this.order.tableService)

              this.spinner = false  

            }

          }
          else
           return this.notSeatAvailable();
           

                    
        }
        else{
           return this.notValidQr();
        }
      })
      .catch(e => {
        this.spinner = false
        console.log(e)
        return this.notValidQr();
      });
    },

    alertRequiredDatas(){
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: 'Error',
          message: this.$t('frontend.home.errorRequired'),
          buttons: [                   
          {
              text: this.$t('frontend.home.acept'),
              handler: () => {                                 
                            
              },
          },
          ],
      })
      .then(a => a.present())
                  
    },

   alertNotProductForReoder(){
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: 'Error',
          message: this.$t('frontend.home.noProductForReorder'),
          buttons: [                   
          {
              text: this.$t('frontend.home.acept'),
              handler: () => { 
              },
          },
          ],
      })
      .then(a => a.present())
    },


    ValidateCode(event){
    
      var hills = LibCodes.lookup(event);   
      if(!hills){      
        return this.alertCodeNotValid(), false;
      }  
      if(this.configuration.zipCodes.length > 0){
        const zip = this.configuration.zipCodes.filter(zc => zc === event);
        if(! zip.length >0 ){
          this.state = "";
          this.city = "";
          return this.alertNotZoneDelever(), false;        
        }
        else{
          this.state = hills.state;
          this.city = hills.city;
          this.openShowCodeDetail(this.state, this.city)
          return true;
        }      
      }
    },

  alertCodeNotValid(){
    return  this.$ionic.alertController
    .create({
        cssClass: 'my-custom-class',
        header: 'Error',
        message: this.$t('frontend.home.zipCodeNotValid') + ' << ' + this.deliveryZone + ' >>',
        buttons: [                   
        {
          text: this.$t('frontend.home.acept'),
          handler: () => {                                 
                        
          },
        },
        ],
    })
    .then(a => a.present())
                
    },

  alertNotZoneDelever(){
    return  this.$ionic.alertController
    .create({
        cssClass: 'my-custom-class',
        header: 'Error',
        message: this.$t('frontend.home.notZoneToDeliver') , 
        buttons: [                   
        {
          text: this.buttonAcept,
          handler: () => {                                 
                        
          },
        },
        ],
    })
    .then(a => a.present())
                
    },

  async openShowCodeDetail(city, state) {
    return this.$ionic.toastController
    
      .create({
        message: city +' '+ state,
        duration: 2000,
        position: 'top',
        color:'success'
      })
    .then(a => a.present())
  },

     notValidQr(){
      // this.changeOrderButton(); 
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: 'Error',
          message: this.$t('frontend.home.notValidQr'),
          buttons: [                   
            {
              text: this.$t('frontend.home.acept'),
              handler: () => {},
            },
          ],
      })
      .then(a => a.present())
    },

    notSeatAvailable(){
      // this.changeOrderButton(); 
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: 'Error',
          message: this.$t('frontend.home.notSeatAvailable'),
          buttons: [                   
            {
              text: this.$t('frontend.home.acept'),
              handler: () => {},
            },
          ],
      })
      .then(a => a.present())
    },

    checkPickTime(){
      let now = Moment().add(this.configuration.minTimeToCook, 'minutes'); 

      let min = Moment(this.configuration.minHour ,'kk:mm')                  
      let max = Moment(this.configuration.maxHour ,'kk:mm')
      if(now > max)
        this.timeToPick = false;
      if(now > min && now < max){  
        this.timeToPick = true;            
         EventBus.$emit('updateMinHour', now.format('kk:mm'));
         return now.format('kk:mm');
      }
      return false;
       
    },

    async productNotAwailable(msg) {
      return this.$ionic.toastController
      
        .create({
          message: this.$t('frontend.home.pickTime')+ ': '+ msg ,
          duration: 7000,
          position: 'center',
          color:'warning'
        })
      .then(a => a.present())
    },

     getFormatPrice(price){
       let result = price
       if (this.restaurantActive.currency)
          result = new Intl.NumberFormat('en', {style: "currency", currency: this.restaurantActive.currency} ).format(price)
      return result;
    },

     async getOrders(){
      if(this.clientId =='')
        return false;     
       await Api.getCustomerOrders(this.clientId)
        .then(response => {
            this.refreshKey ++;
            this.$store.commit('setAllOrder', response.data);
            this.allOrders = response.data  ;
             
            for(var i=0; i< this.allOrders.length; i++){
              this.allOrders[i].iState = this.allStates[this.allOrders[i].State];
            }

            this.orders = JSON.parse(JSON.stringify(this.allOrders));
                               
        })
        .catch(e => {        
            console.log(e);            
        })   
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
        visibility: visible;
    }

  .menu-col-4{
    flex: 0 0 calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
    visibility: visible;
    }

    .menu-col-4 h2,  .menu-col-3 h2{
          margin-left: 0;
    margin-right: 0;
    margin-top: 2px;
    margin-bottom: 2px;
    font-size: 16px;
    font-weight: 400;
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

  .not-display{
    display: none;
  }


</style>