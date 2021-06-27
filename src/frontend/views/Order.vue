<template>
    <div id="product" class="product">
        
        <ion-loading
          v-if="spinner"
          showBackdrop="false"
          cssClass="my-custom-class"
          :message="$t('frontend.tooltips.loadRestaurant')"
        ></ion-loading>

        

        <modal name="my-first-modal" width="80%" height="80%">
            <ion-header>
            <ion-toolbar>
                <ion-title>{{ $t('frontend.home.tableQr') }}</ion-title>
            </ion-toolbar>
            </ion-header>

            <div class="ion-padding" style="height: 90%">            
            <qrcode-stream @decode="onDecode" @init="onInit" />
            </div>    
        </modal>

        <modal name="delivery-modal"  width="80%" height="auto" style="left: 0px;width: auto;height: auto; max-width: 500px !important;">
            <ion-buttons slot="start" @click="hideDeliver()">
                <ion-back-button default-href="home"></ion-back-button>
            </ion-buttons>

            <ion-header>
                <ion-toolbar>
                    <ion-title>{{ $t('frontend.home.deliverDetail') }}</ion-title>
                </ion-toolbar>
            </ion-header>

            <ion-card>
            <ion-item>
                <ion-label position="floating">{{$t('frontend.home.address')}} <strong style="color: red">*</strong></ion-label>
                <ion-input type="text" :value="addres1" @input="addres1= $event.target.value"></ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="floating">{{$t('frontend.home.address')}} 2</ion-label>
                <ion-input type="text"  :value="addres2" @input="addres2= $event.target.value"></ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="floating">{{$t('frontend.orderType.code')}} <strong style="color: red">*</strong></ion-label>
                <ion-input type="tel" :value="zipCodeFlag" @input="zipCodeFlag= $event.target.value" @change="zipCodeFlag=ValidateCodeInModal($event.target.value)">             
                </ion-input>
            </ion-item>
            <ion-item  v-if="city !==''">
            <ion-label position="floating">{{this.$t('frontend.home.city')}} <strong style="color: red">*</strong></ion-label>
            <ion-input type="tel" readonly="true" :value="city" >             
            </ion-input>
          </ion-item>
          <ion-item  v-if="state !==''">
            <ion-label position="floating">{{this.$t('frontend.home.state')}} <strong style="color: red">*</strong></ion-label>
            <ion-input type="tel" readonly="true" :value="state" >             
            </ion-input>
          </ion-item>
            <ion-button  @click="hideDeliver()">{{ this.$t('frontend.home.cancel') }}</ion-button>
            <ion-button  @click="saveDeliver()">{{ this.$t('frontend.home.acept') }}</ion-button>
            
            </ion-card>          
        </modal>

        <modal name="pickup-modal"  width="80%" height="auto"  style="left: 0px;width: auto;height: auto; max-width: 500px; ">
            <ion-buttons slot="start" @click="hidePickUp()">
                <ion-back-button default-href="home"></ion-back-button>
            </ion-buttons>

            <ion-header>
                <ion-toolbar>
                    <ion-title>{{ $t('frontend.home.pickupDetail') }}</ion-title>
                    <ion-label color="success"><p><strong>{{ this.$t('frontend.order.readyForPick') }}</strong></p></ion-label>
                </ion-toolbar>
                <ion-label >{{ this.$t('frontend.home.notTimeToPick') + this.configuration.minHour +' - '+ this.configuration.maxHour  +
                this.$t('frontend.home.cookTime') + this.configuration.minTimeToCook + this.$t('frontend.home.minuts') }}</ion-label> 
            </ion-header>

            <ion-card>
                 <ion-item>
                    <ion-label position="floating">{{$t('frontend.order.dateToPickEstimated')}} <strong style="color: red">*</strong></ion-label>
                    <ion-datetime :value="dateToDay" max="2030"  @ionChange="dateToDay=$event.target.value" :min="minDay"  display-format="MM-DD-YYYY"   
                    ></ion-datetime>
                </ion-item>
                <ion-item>
                    <ion-label position="floating">{{this.$t('frontend.orderType.pickOut') }}<strong style="color: red">*</strong></ion-label>
                    <ion-datetime display-format="h:mm A" picker-format="h:mm A" :key="key"
                    :value="thisMinHour" @ionChange="thisMinHour=ValidateHour($event.target.value)" ></ion-datetime>
                </ion-item>
            
                <ion-button  @click="hidePickUp()">{{ this.$t('frontend.home.cancel') }}</ion-button>
                <ion-button  @click="savePickUp()">{{ this.$t('frontend.home.acept') }}</ion-button>            
            </ion-card>          
        </modal>

        <modal name="curbside-modal"  width="80%" height="auto"  style="left: 0px;width: auto;height: auto; max-width: 500px; ">
          <ion-buttons slot="start" @click="hideCurbside()">
                <ion-back-button default-href="home"></ion-back-button>
          </ion-buttons>
          <ion-header>
            <ion-toolbar> 
              <ion-title>{{ $t('frontend.home.curbsideDetail') }}</ion-title>
            </ion-toolbar>
            <ion-label color="success"><p><strong>{{ this.$t('frontend.order.readyForPick') }}</strong></p></ion-label>
            <ion-label >{{ this.$t('frontend.home.notTimeToPick') + this.configuration.minHour +' - '+ this.configuration.maxHour  +
            this.$t('frontend.home.cookTime') + this.configuration.minTimeToCook + this.$t('frontend.home.minuts') }}</ion-label>          

          </ion-header>

        <ion-card>
           <ion-item>
            <ion-label position="floating">{{$t('frontend.order.dateToPickEstimated')}} <strong style="color: red">*</strong></ion-label>
            <ion-datetime :value="dateToDay" max="2030"  @ionChange="dateToDay=$event.target.value" :min="dateToDay"     
            ></ion-datetime>
          </ion-item>
          <ion-item>
            <ion-label position="floating">{{this.$t('frontend.orderType.pickOut') }}<strong style="color: red">*</strong></ion-label>
            <ion-datetime  display-format="h:mm A" picker-format="h:mm A" :key="key"
            :value="thisMinHour" @ionChange="thisMinHour=ValidateHour($event.target.value)" ></ion-datetime>
          </ion-item>
          <ion-item>
            <ion-label position="floating">{{this.$t('frontend.orderType.licencePlate') }}<strong style="color: red">*</strong></ion-label>
            <ion-input :value="licencePlate" @input="licencePlate = $event.target.value"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">{{this.$t('frontend.orderType.vehicleModel') }}<strong style="color: red">*</strong></ion-label>
            <ion-input :value="vehicleModel" @input="vehicleModel = $event.target.value"></ion-input>
          </ion-item>
           <ion-item>
            <ion-label position="floating">{{this.$t('frontend.orderType.vehicleColor') }}<strong style="color: red">*</strong></ion-label>
            <ion-input :value="vehicleColor" @input="vehicleColor = $event.target.value"></ion-input>
          </ion-item>

         
          <ion-button  @click="hideCurbside()">{{ this.$t('frontend.home.cancel') }}</ion-button>
          <ion-button  @click="saveCurbside()">{{ this.$t('frontend.home.acept') }}</ion-button>
          
        </ion-card>          
        </modal>

        <v-breakpoint >
            <div slot-scope="scope">

                <span > 
                    <ion-toolbar>
                        <ion-buttons slot="start" @click="backToCall()">
                            <ion-back-button default-href="home"></ion-back-button>
                        </ion-buttons>    
                                            
                        <ion-card-title                          
                            style="padding: 10px;text-align: center;text-transform: uppercase;font-weight: bolder;">
                            {{$t('frontend.order.orderDetail')}} 
                        </ion-card-title>
                    </ion-toolbar>                  

                    <div :style="scope.isSmall || scope.isMedium || scope.noMatch? '': 'width: 80%; margin: 0 auto;'">
                        
                        <guess/>
                             
                        <ion-card :key="keyOrderType">     

                            <ion-label class="ion-text-wrap menu-col-12" style="display: inline-block;">
                                <h2 class="titles-order" style="float: left;">{{$t('frontend.order.orderType')}}: <span v-if="!order.OrderType" style="color: red;"> * </span></h2>                            
                                   
                                <ion-select interface="popover" icon="add" style="text-align: left; float: left; display: inline-flex;"                                  
                                  :key="keyCurbside"
                                  :ok-text="$t('backoffice.form.messages.buttons.ok')"
                                  :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
                                  :value="allTypeOrder[order.OrderType]"   
                                  :placeholder=" $t('frontend.app.selectOrder')"                            
                                  @ionChange="allTypeOrder[$event.target.value], changeOrderType($event.target.value)" >
                                      <ion-select-option  v-if="configuration.viewDelivery && restaurantActive.hasPaymentCardConfig" :value="allTypeOrder['Delivery']"> {{allTypeOrder['Delivery']}} </ion-select-option>
                                      <ion-select-option v-if="restaurantActive.hasPaymentCardConfig" :value="allTypeOrder['PickUp']"> {{allTypeOrder['PickUp']}} </ion-select-option>
                                      <ion-select-option v-if="configuration.viewOnTable" :value="allTypeOrder['On Table']"> {{allTypeOrder['On Table']}} </ion-select-option>                                
                                      <ion-select-option v-if="configuration.viewCurbside" :value="allTypeOrder['Curbside']"> {{allTypeOrder['Curbside']}} </ion-select-option>                                
                              </ion-select> 
                            </ion-label>

                           <div :key="keyCurbside+1">
                             
                             <div v-if="order.OrderType==='PickUp' || isPick" @click="showPickUp()">
                              <ion-item   >
                               <ion-label position="floating">{{$t('frontend.order.dateToPickEstimated') }}<strong style="color: red">*</strong> </ion-label> 
                               <ion-datetime :key="key1" style="text-align: left;" :min="minDay"
                                 :value="dateToDay" @ionChange="dateToDay=$event.target.value" ></ion-datetime>                                
                              </ion-item>
                              <ion-item  >
                                <ion-label position="floating">{{$t('frontend.orderType.pickOut') }}<strong style="color: red">*</strong> </ion-label> 
                                <ion-datetime display-format="h:mm A" picker-format="h:mm A" :key="key1" style="text-align: left;"
                                  :value="thisMinHour" @ionChange="thisMinHour=ValidateHour($event.target.value), thisMinHour !==''? savePickUp() : ''" ></ion-datetime>                                
                              </ion-item>
                             </div>
                            

                            <div v-if="order.OrderType ==='Delivery' || isDelivery" @click="showDeliver()">
                                <ion-item >
                                  <ion-label position="floating">{{$t('frontend.home.address')}} <strong style="color: red">*</strong></ion-label>
                                  <ion-input :value="addres1" readonly></ion-input>
                                </ion-item> 
                                <ion-item v-if="addres2">                                     
                                  <ion-label position="floating">{{$t('frontend.home.address')}} 2</ion-label>
                                  <ion-input :value="addres2" readonly></ion-input>                     
                                </ion-item> 
                                <ion-item >
                                  <ion-label position="floating">{{$t('frontend.orderType.code')}} <strong style="color: red">*</strong></ion-label>
                                  <ion-input :value="zipCodeFlag" readonly></ion-input>
                                </ion-item>
                            </div>

                            <ion-item  v-if="order.OrderType=='On Table' || isTable" @click="show()">
                               <ion-label position="floating">{{$t('frontend.order.location')}} <strong style="color: red">*</strong></ion-label>
                                <ion-input :value="order.tableService" readonly></ion-input>
                            </ion-item> 

                            <div v-if="order.OrderType==='Curbside' || isCurbside" @click="showCurbside()">
                              <ion-item   >
                               <ion-label position="floating">{{$t('frontend.order.dateToPickEstimated') }}<strong style="color: red">*</strong> </ion-label> 
                               <ion-datetime style="text-align: left;" 
                                 :value="dateToDay" ></ion-datetime>                                
                              </ion-item>

                              <ion-item   >
                                <ion-label position="floating">{{$t('frontend.orderType.pickOut') }}<strong style="color: red">*</strong> </ion-label> 
                                <ion-datetime display-format="h:mm A" picker-format="h:mm A" style="text-align: left;"
                                  :value="thisMinHour" ></ion-datetime>                                
                              </ion-item>

                              <ion-item   >
                                <ion-label position="floating">{{$t('frontend.orderType.licencePlate') }}<strong style="color: red">*</strong> </ion-label> 
                                <ion-input :value="order.LicencePlate" ></ion-input>                                
                              </ion-item>

                              <ion-item   >
                                <ion-label position="floating">{{$t('frontend.orderType.vehicleModel') }}<strong style="color: red">*</strong> </ion-label> 
                                <ion-input :value="order.VehicleModel" ></ion-input>                                
                              </ion-item>

                               <ion-item   >
                                <ion-label position="floating">{{$t('frontend.orderType.vehicleColor') }}<strong style="color: red">*</strong> </ion-label> 
                                <ion-input :value="order.VehicleColor" ></ion-input>                                
                              </ion-item>
                            </div>
                           </div>
                        </ion-card>

                        <cart
                          :showButtons ="false" 
                          :showAdd ="true">
                        </cart>
                        

                  <ion-footer class="ion-no-border">
                    
                    <ion-toolbar v-if="$store.state.cart.length > 0 " >
                     

                      <div style="padding: 20px 0; text-align: center" v-if="$store.state.allTickets.length === 0 && !isCatering">
                         <ion-item v-if="( restaurantActive.payMethod==='SHIFT4' && order.OrderType === 'On Table' && (clientId !='' || staffName != '') ) ||
                          (restaurantActive.payMethod==='TSYS' && order.OrderType === 'On Table'  && staffName != '')">
                            <p style=" float: left;text-align: left;padding: 0" class="subtitles-order menu-col-4">{{$t('frontend.order.isTicket')}} </p>                               
                            <ion-toggle color="primary" :value="isTicket" @ionChange="isTicket = !isTicket"></ion-toggle>
                        </ion-item> 

                        <ion-button                             
                          @click="goHome()">{{$t('frontend.home.cancel')}}
                        </ion-button>  

                        <ion-button 
                          v-if="!isTicket " 
                          @click="segmentValue = 'order', openCardPayment()">{{$t('frontend.order.pay')}}
                        </ion-button>

                        <ion-button  
                          v-if="isTicket " 
                          @click="segmentValue = 'order', openCardPayment()">{{$t('frontend.order.payAsTicket')}}
                        </ion-button>  

                        <ion-button
                          v-if="isTicket && staffName != ''" 
                          @click="saveAsTicket()">{{$t('frontend.order.saveAsTicket')}}
                        </ion-button>                          
                      </div>
                      <div v-if="$store.state.allTickets.length > 0 && !isCatering" style="padding: 20px 0; text-align: center"> 
                                           
                        <ion-button  v-if="order.isTicket && $store.state.allTickets.length > 0" 
                            @click="closeTicket()">
                            {{$t('frontend.order.closeTicket')}}
                         </ion-button> 
                         <ion-button  
                            @click="updateAuthorization()">
                            {{$t('frontend.order.updateTicket')}}
                          </ion-button>
                      </div>
                      <div v-if="isCatering" style="padding: 20px 0; text-align: center">

                       <div>
                          <ion-label v-if="order.OrderType=='Delivery' && configuration.minAmountCateringDelivery > 0 && configuration.minAmountCateringDelivery > order.Total" class="menu-col-12 catering-amount" >{{$t('frontend.orderType.minAmountDelivery') +' '+  getFormatPrice(configuration.minAmountCateringDelivery)}}</ion-label>
                        <ion-label v-if="order.OrderType=='PickUp' && configuration.minAmoutCatering > 0 && configuration.minAmoutCatering > order.Total" class="menu-col-12 catering-amount">{{ $t('frontend.orderType.minAmountPickUp') + ' ' + getFormatPrice(configuration.minAmoutCatering)  }}</ion-label>                        
                       </div>
                        <ion-button                             
                          @click="goHome()">{{$t('frontend.home.cancel')}}
                        </ion-button> 
                         <ion-button 
                         :disabled="clientId ==='' || !order.OrderType ||
                         (order.OrderType=='Delivery' && configuration.minAmountCateringDelivery > 0 && configuration.minAmountCateringDelivery > order.Total) ||
                         (order.OrderType=='PickUp' && configuration.minAmoutCatering > 0 && configuration.minAmoutCatering > order.Total)"
                            @click="sendOrderCatering()">{{$t('frontend.order.sendRequest')}}
                         </ion-button> 
                      </div>
                     
                    </ion-toolbar>
                  </ion-footer>
                    
                        

                    </div>
                </span>


               
            </div>
        </v-breakpoint>

       

    </div>
</template>



<script>

import { eye } from "ionicons/icons";
import { addIcons } from "ionicons";
import PaymentModal from '../components/PaymentModal'


addIcons({
  "ios-eye": eye.ios,
  "md-eye": eye.md,
});

import { Api } from '../../backoffice/api/api.js';
import { EventBus } from '../event-bus';
import { VBreakpoint } from 'vue-breakpoint-component'
import LibCodes from 'zipcodes'
import { parsePhoneNumber } from 'libphonenumber-js'
import moment from 'moment-timezone';
import Moment from 'moment';
 import { QrcodeStream } from 'vue-qrcode-reader'
 import orderType from '../components/selectOrderType'
 import { payAuthorizeNet } from '../../backoffice/api/payments.js';
  import { Commons } from '../commons'
   import Guess from '../components/Guess'
    import Cart from '../components/Cart'


export default {
   name: 'Order',
   created: function(){
      if(this.$route.params.isCatering)
        this.isCatering = true;

    this.staffName = this.$store.state.staffName || '';
    this.staffId = this.$store.state.staffId || '';
    this.taxesName = this.$store.state.tax.taxesName || ''; 
    this.taxes = this.$store.state.tax.taxesName || 0;
    this.shippingName = this.$store.state.shipping.shippingName || '';
    this.shipping = this.$store.state.shipping.shipping || 0; 
    this.restaurantSelectedId = this.$store.state.restaurantActive.restaurantId || ''; 

      if(this.$store.state.customer._id){
         this.clientId= this.$store.state.customer._id;
        this.CustomerName= this.$store.state.customer.Name;
        this.email= this.$store.state.customer.EmailAddress;
        this.phone=this.$store.state.customer.Phone;
       }

       this.order = this.$store.state.order;
       this.cart = this.$store.state.cart;
       this.configuration = this.$store.state.configuration;
       this.restaurantActive = this.$store.state.restaurantActive
       if(this.configuration.tips.length > 0)
        this.tip = this.configuration.tips[0] 

       EventBus.$on('updateCustomer', (value) => {if(value) this.customerUpdated(); });
       EventBus.$on('updateCart', (value) => { if(value) this.cart = this.$store.state.cart; });
       EventBus.$on('chargeOrder', (value) => { 
         this.$store.commit('setOrder', value);
         if(value) this.order = value; 
         this.getSplitPaymentDo(); });
       
       if(this.order.HourToPick)
          this.thisMinHour = this.order.HourToPick

        if(this.order.DateToPick)
          this.dateToDay = this.order.DateToPick 

       if(this.$route.params.backButton === true)
        this.buttonBack = this.$route.params.backButton; 
       else
        this.buttonBack = false;
        
        if(this.order.Note)
          this.note = this.order.Note

        this.spinner = true;


                
        this.getOrderInfo();
        this.getOtherCharges();        
    
        if(this.order.addres1)
            this.addres1 = this.order.addres1;
        if(this.order.addres2)
            this.addres2 = this.order.addres2;
        if(this.order.zipCode)
            this.zipCodeFlag = this.order.zipCode;
        if(this.order.LicencePlate)
          this.licencePlate = this.order.LicencePlate;
        if(this.order.VehicleModel)
          this.vehicleModel = this.order.VehicleModel;
        if(this.order.VehicleColor)
          this.vehicleColor = this.order.VehicleColor;
         
        
        this.spinner = false;
   },
   props: { 
   
  },
   data () {
    return {
        staffName: '',
        staffId: '',
        taxesName: '', 
        taxes: 0,
        shippingName: '',
        shipping: 0, 
        restaurantSelectedId: '', 
        barcode:'',        
        modelName: 'Order',
        order: {},
        cart: [] ,       
        tip:  0,
        products: [],
        note:'',
        orderInfo:"",
        otherCharges:[],
        spinner: false ,  
        spinnerCharge: false,    
        dateTodaymin: new Date().toISOString().substr(0, 7),
        dateTodaymax:  new Date().getFullYear(),
        date: Moment().toISOString(),     
        // date: moment.tz(moment.tz.guess()).format('MM/DD/YYYY HH:mm:ss'),
        cardNumber:'',
        cardCode: '',
        expirationCard:'',
        zipCode: '',
        address:'',
        allTypeOrder:{'Delivery':this.$t('frontend.app.deliver'), 'PickUp':this.$t('frontend.app.pickup'), 'On Table':this.$t('frontend.app.table'), 'Curbside':this.$t('frontend.app.curbside'), },
        key: 0,
        buttonBack: false,
        isTicket: false,
        key1:1,
        keyOrderType:2,
        keyCurbside: 3,
        state: '',
        city:'',
        zipCodeFlag: '',
        addres1: '',
        addres2: '',
        thisMinHour:  '',
        dateToDay: moment.tz(moment.tz.guess()).format('YYYY-MM-DD'),
        minDay: moment.tz(moment.tz.guess()).format('YYYY-MM-DD'),
        timeToPick: true,
        isDelivery: false,
        isPick: false,
        isTable: false,
        isCurbside: false,
        showDiscount: false,
        discount: 0,
        theCodeToDiscount: '',
        key2: 4,
        spinnerDiscount: false,
         clientId: '',
        CustomerName: '', 
        email: '', 
        phone: '',  
        marketingEmail: false,
        marketingPhone: false ,
        configuration: {},
        restaurantActive: {},
        licencePlate: '' ,
        vehicleModel: '',
        vehicleColor: '',
        isCatering: false,
      
    }
  }, 
  computed: {
   
    subTotal(){
          let total = 0;
          this.cart.forEach(car => total += parseFloat( this.getSemiTotal(parseInt(car.AggregatesCant),  parseInt(car.Cant), parseFloat(car.Price), car.Aggregates) ))
           for (const obj of this.otherCharges){
              total += obj.Price ;
          }
          return total.toFixed(2);
      },
   
   total(){
    
         let percent = ( (this.finalSubTotal() * this.taxes) / 100) ;  
         let tipPercent = ( (this.finalSubTotal() * this.tip) / 100) ;
         var t = 1    
        if(this.order.OrderType=='Delivery')  
          t  = parseFloat(this.finalSubTotal()) + parseFloat(percent) + parseFloat(this.shipping) + parseFloat(tipPercent); 
        else
          t  = parseFloat(this.finalSubTotal()) + parseFloat(percent)  +  parseFloat(tipPercent);
        return t.toFixed(2);
      }
  },
   components:{
    VBreakpoint: VBreakpoint,
    QrcodeStream: QrcodeStream,
    Guess: Guess,
    Cart: Cart,
    
  }, 
   methods: {

    finalTotal(){
         let percent = ( (this.finalSubTotal() * this.taxes) / 100) ;
         let tipPercent = ( (this.finalSubTotal() * this.tip) / 100) ; 
         var t = 1    
        if(this.order.OrderType=='Delivery')  
          t  = parseFloat(this.finalSubTotal()) + parseFloat(percent) + parseFloat(this.shipping) + parseFloat(tipPercent); 
        else
          t  = parseFloat(this.finalSubTotal()) + parseFloat(percent)  +  parseFloat(tipPercent);
          t = t - this.discount;
        return t.toFixed(2);
      } ,  

    finalSubTotal(){
        let total = 0;
        this.cart.forEach(car => total += parseFloat( this.getSemiTotal(parseInt(car.AggregatesCant),  parseInt(car.Cant), parseFloat(car.Price), car.Aggregates) ))
        for (const obj of this.otherCharges){
            total += obj.Price ;
        }
        // total = total - this.discount;
        return total.toFixed(2);
      },

    getSemiTotal( aggregateCant, thisCant, thisPrice, thisAggregates) {
     
      let cant = aggregateCant * thisCant;
      let semiTotal = 0; 
      let t = 0;    
      for(var i=0 ; i < thisAggregates.length; i++){  
       
        if(cant - thisAggregates[i].Cant >= 0){
          cant -= thisAggregates[i].Cant;   
          thisAggregates[i].AllTotal = 0         
          continue;
        }
        else{
            thisAggregates[i].AllTotal =  ((thisAggregates[i].Cant -cant) * thisAggregates[i].SalePrice)
            semiTotal+= ((thisAggregates[i].Cant -cant) * thisAggregates[i].SalePrice); 
            cant = 0;       
        }
      } 

      t= (thisCant * thisPrice + semiTotal).toFixed(2) ;
      
      return t;
    },
   
    totalByProduct(cant, price){
        return cant * price;
    } ,
    
    addAgregate(index, index1, cant){
        if(cant < 1)
          return this.deleteToAgg(index, index1)
        else{        
          this.cart[index].Aggregates[index1].Cant = parseInt(cant);             
          this.$store.commit('setCart', this.cart);
          this.openToastProd();            
        } 
        this.key++;
        return cant;
    },

    deleteToAgg(index, index1){
        let obj = this.cart[index];
        obj.Aggregates.splice(index1, 1);
        this.openToastProd(); 
       this.$store.commit('setCart', this.cart);
    },

    async changeOrderType(value){ 
       
        if(value === 'Pick Up' || value === 'Recogida'){
            this.keyOrderType ++;
            if(!this.configuration.selectPickHour)
              return this.sinPickAction();
            return  this.showPickUp();
        }
            
        if(value === 'Delivery' || value === 'Entrega'){
            this.keyOrderType ++;
           return this.showDeliver()
        }

        if(value === 'Table' || value === 'Mesa'){
            this.keyOrderType ++;
            return this.show();            
        }

         if(value === 'Curbside' || value === 'En Auto'){
            this.keyOrderType ++;
            return this.showCurbside();            
        }

        
    },

    validateBeforePay(){

      let mss = '';
      let flag = 1;

      if(this.isCatering && !this.$store.state.guess._id){
         mss += this.$t('frontend.order.requiredCustomer') +'. ';
          flag = 0;
      }
      else if(this.order.OrderType !== 'On Table'){ 
         this.clientId= this.$store.state.guess._id || '';
         this.CustomerName= this.$store.state.guess.Name || '';
         this.email= this.$store.state.guess.EmailAddress || '';
         this.phone= this.$store.state.guess.Phone || '';   

        if(this.CustomerName ==='' || this.email === '' || this.phone === ''){
              mss += this.$t('frontend.order.requiredCustomer') +'. ';
              flag = 0;
        }               
      } 
      if(!this.order.OrderType){       
        mss += this.$t('frontend.order.requiredOrderType') +'. ';
        flag = 0;
      }
      if(flag === 0) return mss;
      return flag;
    },
  
    buildOrder(){ 
       this.order = this.$store.state.order;
       this.order.Products = this.$store.state.cart;
        if(this.staffName !='')
            this.order.StaffName = this.staffName;
        if(this.staffId !='')
            this.order.staffId = this.staffId        

        if(this.$store.state.guess._id)
          this.order.ClientId = this.$store.state.guess._id;
        if(this.$store.state.guess.Name)
          this.order.CustomerName = this.$store.state.guess.Name ;
        if(this.$store.state.guess.EmailAddress)
          this.order.CustomerEmail = this.$store.state.guess.EmailAddress;
        if(this.$store.state.guess.Phone)
          this.order.CustomerPhone = this.$store.state.guess.Phone;
        
        this.order.OrderForCatering = false; 
        this.order.Date = this.date;  
        if(this.isCatering){
            this.order.State = 7;  
            this.order.OrderForCatering = true; 
        }
        
        this.$store.commit("setOrder", this.order);
           
    },

     quotation(){
        let quo = 0;
        if(this.configuration.percentPayForQuotation > 0 && this.configuration.payForQuotation ){
          quo = this.configuration.percentPayForQuotation;
        }
        return quo.toFixed(2);

    },

     openCardPayment: async function(){
       
        this.order = this.$store.state.order;
        if(!this.order.Total) return 
            
        const flag = this.validateBeforePay();
        console.l
        if(flag !== 1 )
            return this.alertRequiredDatas(flag);
        this.buildOrder()
        let tt = parseFloat(this.order.Total).toFixed(2);
        let returnTo1 = 'OrderView'
        if(this.isCatering){
          tt = this.quotation();
          returnTo1 = 'OrderCatering';
        } 

        return this.$ionic.modalController
          .create({
            component: PaymentModal,
            backdropDismiss: false,
            keyboardClose: false,
            cssClass: 'my-custom-class',
            componentProps: {
              data: {
                content: 'New Content',
              },
              propsData: { 
                parent: this, 
                order: this.order,   
                canSplitPayment: !this.isTicket,                        
                Total: tt,
                Tax:  this.taxes.toString(),
                TaxName: this.taxesName,     
                restaurantId: this.restaurantSelectedId,
                payMethod: this.restaurantActive.payMethod  ,  
                RestaurantName: this.restaurantActive.restaurantName, 
                currency: this.restaurantActive.currency,               
                returnTo: returnTo1,
                isTicket: this.isTicket,               
              },
            },
          })
          .then(m => m.present())  

    },

     closeTicket: async function(){ 
      try {
        this.spinner = true;
        let autho = true;
        if(this.restaurantActive.payMethod !== 'TSYS')
          autho =  await this.generalAuthorization();
        if(autho){
          const invoiceNumber = this.order.AuthorizationPayment[0].paymentInfo.transId;
          const moto = this.order.AuthorizationPayment[0].paymentInfo.moto;

          const response = await payAuthorizeNet.captureOrder(invoiceNumber, moto, this.restaurantSelectedId, this.restaurantActive.payMethod,);      
          delete this.order.AuthorizationPayment;
          this.spinner = false;
          return this.recivePaymentInCloseTicket(response);
        }
        else
          this.noAuthorizedPayment()
        
      } catch (error) {
        this.spinner = false;
        console.log(error);
        
      }

    
    },

    updateAuthorization: async function(){
     const autho =  await this.generalAuthorization();
     if(!autho)        
      return this.noAuthorizedPayment()
    },

     generalAuthorization: async function(){
       this.order = this.$store.state.order;
      
      const data =  {         
        restaurantId: this.restaurantSelectedId,
        payMethod: this.restaurantActive.payMethod,
        total: this.order.Total,
        tax: ((parseFloat(this.order.Taxe) * parseFloat(this.order.SubTotal) )/ 100).toFixed(2),
        tip: ((parseFloat(this.order.Tip) * parseFloat(this.order.SubTotal) )/ 100).toFixed(2),
        taxName: this.taxesName,         
        products: this.$store.state.cart,  
        firstName : this.order.CustomerName        
      }
      if(this.order.AuthorizationPayment){
       
        if(this.order.AuthorizationPayment[0].paymentInfo.transId){

          try {

            this.spinner = true;            
            data.invoiceNumber = this.order.AuthorizationPayment[0].paymentInfo.transId;
            const moto = this.order.AuthorizationPayment[0].paymentInfo.moto;
            if(this.order.AuthorizationPayment[0].paymentInfo.accountNumber)
              data.cardNumber = this.order.AuthorizationPayment[0].paymentInfo.accountNumber;

            const response = await payAuthorizeNet.firstAuthorizeOrder(data, moto);
            if(response){
               this.order.AuthorizationPayment = [{
                state: 1,
                total: response.total,
                paymentInfo: response, 
                PaymentMethod:response.method + ' '+ response.accountType+ ' '+ response.accountNumber
              }];
              this.buildOrder();
                
              const responseOrd = await Api.putIn('Order', this.order)
              await this.$store.commit('setOrder', responseOrd.data);
              this.spinner = false;
              return true;
            } 
            return false;          
              
          } catch (error) {
            this.spinner = false;
            console.log(error);            
          }

        }
        else{
          return false;
        }
      }
      else{
        return false;
      }
    },

 
    async getOrders(){
      if(this.clientId =='')
        return false;
      this.spinner = true
       try {
         const response = await Api.getCustomerOrders(this.clientId)
        if(response.status === 200){
          this.$store.commit('setAllOrder', response.data)
            this.allOrders = response.data; 
              this.spinner = false   
        }
        else
          this.spinner = false  
       } catch (error) {
         this.spinner = false 
            console.log(error);
       }       
    },

    async getTickets(){
      if(this.clientId =='')
        return false;
      this.spinner = true
       try {
         const response = await Api.getCustomerTickets(this.clientId)
        if(response.status === 200){
          this.$store.commit('setAllTickets', response.data)  
          this.cart = JSON.parse(JSON.stringify(response.data[0].Products)) ;         
          this.$store.commit('setCart', this.cart);
          this.order =JSON.parse(JSON.stringify(response.data[0])) ;
          this.$store.commit('setOrder', this.order);       
            this.spinner = false   
        }
        else
          this.spinner = false  
       } catch (error) {
         this.spinner = false 
            console.log(error);
       }       
    },

    async saveAsTicket(){      
        try {           
          this.order = this.$store.state.order; 
          if(this.isTicket){  
             
              const flag = this.validateBeforePay();
              if(!flag )
                  return this.alertRequiredDatas();
              this.buildOrder()
            this.order.State = 0;
            this.order.isTicket = true;           
           }           
           const response = await Api.postIn('Order', this.order)
           if(response.status === 200 && response.statusText === "OK"){
             this.finishPayment(response.data, false);
           }
            
        } catch (error) {            
            console.log(error)
            this.spinner = false;
        }

    },

     async sendOrderCatering(){
     
        const flag = this.validateBeforePay();
        console.l
        if(flag !== 1 )
            return this.alertRequiredDatas(flag);
        this.buildOrder()
       
        if(this.configuration.payForQuotation && this.configuration.percentPayForQuotation > 0){
          return this.openCardPayment();
        }
        else{
              try{
                this.spinner = true
                const response1 = await Api.postIn('Order', this.order);       
                if(response1.status === 200 && response1.statusText === "OK"){   
                    this.cart = [];
                    this.order = {}                 
                    this.$store.commit('setCart', [] );
                    this.$store.commit('setOrder', {}); 
                    await this.getOrders();
                    this.goodPaymentToast();  
                    this.spinner = false;                                          
                    return this.$router.push({ name: 'ListOrder'})                                                                             
                }            
            } 
            catch (err) { 
                this.spinner = false;    
                return this.errorPaymentDetail(err);
            } 
        }          
    },
    
    recivePaymentInCloseTicket: async function(res){  
        this.spinner = true;
        try {

            this.order.Payment = [{
            state: 1,
            total: res.total,
            paymentInfo: res, 
            PaymentMethod:res.method + ' '+ res.accountType+ ' '+ res.accountNumber
            }]   ;        
            this.order.State = 5;  
                  
            const response = await Api.putIn('Order', this.order)
            if(response.status === 200 && response.statusText === "OK"){
                  
                  const paymentEntry = {                       
                            "Method": res.method,
                            "Payment": res.total,
                            "InvoiceNumber": res.transId,
                            "ModelId": response.data._id,
                            "ModelFrom": "Order",
                             "StaffName": this.order.StaffName,                    
                    }
                    await Api.postIn('allpayments', paymentEntry);
                  if(this.clientId !=='' ) await Commons.getTickets();  
                  this.spinner = false;
                  return this.finishPayment(this.order, true);  
            }
            
        } catch (error) {            
            console.log(error)
            this.spinner = false; 
        }
      
    },

    recivePaymentCatering: async function(res){ 
        this.spinner = true;
            try {
               
                this.order.QuotationPayment = this.quotation(); 
                this.order.QuotationPaymentDetail = res; 
                
                const response = await Api.postIn('Order', this.order);
                if(response.status === 200 && response.statusText === "OK"){                     
                     
                    this.cart = [];
                    this.order = {}                     ;
                    this.$store.commit('setCart', [] );                        
                    this.$store.commit('setOrder', {});  
                    await this.getOrders();
                    this.goodPaymentToast();  
                    
                     const paymentEntry = {                       
                        "Method": res.method,
                        "Payment": res.total,
                        "InvoiceNumber": res.transId,
                        "ModelId": response.data._id,
                        "ModelFrom": "Catering",
                        "StaffName": this.order.StaffName                    
                   }
                   await Api.postIn('allpayments', paymentEntry);  
                   this.spinner = false;
                   if (this.staffName !== '') return this.$router.push({ name: ' Order' })  
                    return this.$router.push({ name: 'ListOrder' })  
                }
                
            } catch (error) {            
                console.log(error)
                this.spinner = false;
            }        
        },

   
    recivePayment: async function(res){  

      if(this.isCatering) return this.recivePaymentCatering(res);
      this.spinner = true;

        try {           
            
           if(this.isTicket){
            this.order.AuthorizationPayment = [{
            state: 1,
            total: res.total,
            paymentInfo: res, 
            PaymentMethod:res.method + ' '+ res.accountType+ ' '+ res.accountNumber
            }]   ;        
            this.order.State = 0;
            this.order.isTicket = true;           
           } 
           else{
            this.order.Payment = [{
            state: 1,
            total: res.total,
            paymentInfo: res, 
            PaymentMethod:res.method + ' '+ res.accountType+ ' '+ res.accountNumber
            }]   ;        
            this.order.State = 1;
           
           }
           const response = await Api.postIn('Order', this.order)
           if(response.status === 200 && response.statusText === "OK"){

             if(!this.order.isTicket){
               const paymentEntry = {                       
                        "Method": res.method,
                        "Payment": res.total,
                        "InvoiceNumber": res.transId,
                        "ModelId": response.data._id,
                        "ModelFrom": "Order",
                        "StaffName": this.order.StaffName,               
                   }
                
                   await Api.postIn('allpayments', paymentEntry);                
             }                 
                this.spinner = false;
                if(this.order.Payment)
                  return  this.finishPayment(response.data, true);
                else{
                  if(this.order.isTicket && this.order.StaffName){
                    this.$store.commit('setAllTickets',[])                
                    this.$store.commit('setCart', []);        
                    this.$store.commit('setOrder', {});    
                    return this.$router.replace({ name: 'Ticket' }) 
                  }
                  else{
                    await this.$store.commit('setOrder', response.data);
                    await this.getTickets();
                    return this.$router.replace({ name: 'HomeGrid' }) 
                  }
                 
                }
                 
           }
            
        } catch (error) {            
            console.log(error)
            this.spinner = false;
        }
      
    },

    async finishPayment(value, flag){
      this.spinner = true;
      if(this.clientId != '')  await this.getOrders();  
      if(flag){
        Commons.sendOrderEmail(value);
        this.goodPaymentToast();                  
        if(this.discount > 0 && this.theCodeToDiscount != '');{
              this.closeReservation(); 
        }  
      }
        
        this.order = {};
        this.cart = [];   
        this.$store.commit('setCart', [] );
        this.$store.commit('setOrder', {}); 

        this.spinner = false;
                                             
        if(this.clientId !='')                                    
            return this.$router.push({ name: 'ListOrder', params: {customerId: this.clientId, CustomerName: this.CustomerName} })                                                                  
        else if(this.staffName !=='' && this.isTicket)
          return this.$router.push({ name: 'Ticket' });
        else if(this.staffName !== '' && !this.isTicket)
          return this.$router.push({ name: 'Order' });            
        else                   
            return this.$router.replace({ name: 'Home' })  
         
    },

 
    getOrderInfo: function(){
        if(this.order.OrderType == 'Delivery'){
            this.orderInfo = this.order.AddressToDeliver ;
            const deliveryAdress = this.orderInfo.split(' ZipCode: ');
            this.zipCode = deliveryAdress[1];        
            this.address = deliveryAdress[0];  
        }
        if(this.order.OrderType == 'PickUp'){           
          this.orderInfo = this.order.HourToPick;
        // this.orderInfo = moment.tz(this.order.Date, moment.tz.guess()).format('hh:mm A')
        }
        if(this.order.OrderType == 'On Table')
            this.orderInfo = this.order.tableService;
    },

    getOtherCharges: function(){        
        this.spinnerCharge = true;
        this.otherCharges = []
        for (const obj of this.cart){
            Api.findProductCharges(obj.ProductId, obj.Cant).then(response => {
                this.otherCharges = this.otherCharges.concat( response.data)               
                this.spinnerCharge = false;
                })
                .catch(e => {
                    console.log(e)
                     this.spinnerCharge = false;
                });  
         }
    },
   
    goHome: function(){       
        this.$store.commit('setCart', []);
        this.$store.commit('setOrder', {});      
        return this.$router.push({ name: 'Home', params: {cart:this.cart, order:this.order } })
    },

    removeProductFromCart: function(id){
        const element = (elem) => elem.ProductId == id;
        var index =this.cart.findIndex(element)
        this.cart.splice(index, 1)
        this.$store.commit('setCart', [] );
        this.getOtherCharges();
        if(this.cart.length == 0){
            return this.$router.push({ name: 'Home', params: {cart:this.cart } })
        }
    },
    
    addProductsToCart: function(){   
        return this.$router.push({ name: 'Home', params: {cart: this.cart, order: this.order } })
    },

    changeOrderInfo: function(event){

        if(!event)
            return this.alertRequiredDatas();
           
        if(this.order.OrderType == 'Delivery'){
            var hills = LibCodes.lookup(this.zipCode);  
            if(hills){
                const onlyAdress = event.split(' State: ');        
                if(onlyAdress.length > 0)
                    this.order.AddressToDeliver = onlyAdress[0] +' State: '+ hills.state +' City: '+ hills.city + ' ZipCode: '+ this.zipCode
                else   
                    this.order.AddressToDeliver = event +' State: '+ hills.state +' City: '+ hills.city + ' ZipCode: '+ this.zipCode 
                
                this.address = this.order.AddressToDeliver.split(' ZipCode: ')[0];
                event = this.order.AddressToDeliver;
            } 
            else{
                this.order.AddressToDeliver = event +' ZipCode: '+ ' '  
            }               
                    
           

            this.address = this.order.AddressToDeliver.split(' ZipCode: ')[0];
            event = this.order.AddressToDeliver;            
        }
        
        if(this.order.OrderType == 'PickUp'){
             this.order.HourToPick = moment.tz(event, moment.tz.guess()).format('hh:mm A');
        }
         
        if(this.order.OrderType == 'On Table')
          this.order.tableService = event;
         
         this.orderInfo = event;            
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

    validateCard(event){
        var valid = require("card-validator");
 
        var numberValidation = valid.number(event);
 
        if (!numberValidation.isValid) {
            this.cardNumber = ""
            return  this.$ionic.alertController
                .create({
                    cssClass: 'my-custom-class',
                    header: 'Error',
                    message: this.$t('frontend.order.notValidCC'),
                    buttons: [                   
                    {
                        text: this.$t('frontend.home.acept'),
                        handler: () => {                                 
                                        
                        },
                    },
                    ],
                })
                .then(a => a.present())
                    }
 
        else {
         this.cardNumber = event;
        }   
        
    },
    
    getDeliveryInfo(value){

        const deliveryAdress = this.orderInfo.split(' ZipCode: ');
        if(value =='code'){
            return deliveryAdress[1]
        }
        if(value =='address'){
            return deliveryAdress[0]
        }
    
    },
    
    changeZipCode(value){
        var hills = LibCodes.lookup(value);   
        if(!hills){
        this.state = "";
        this.city = "";
        this.zipCode ='';
        return this.alertCodeNotValid();
        }  

        if(this.configuration.zipCodes.length > 0){
            const zip = this.configuration.zipCodes.filter(zc => zc.ZipCode === value);
            if(!zip.length >0){
                this.zipCode ='';
                return this.alertNotZoneDelever();  
            }              
        }

        const deliveryAdress = this.orderInfo.split(' ZipCode: ');
        const onlyAdress = deliveryAdress[0].split(' State: ');
        
        if(onlyAdress.length > 0)
            this.orderInfo = onlyAdress[0] +' State: '+ hills.state +' City:'+ hills.city + ' ZipCode: '+ value
        else   
           this.orderInfo = deliveryAdress[0] +' State: '+ hills.state +' City:'+ hills.city + ' ZipCode: '+ value 
        this.order.AddressToDeliver = this.orderInfo;

        this.address = this.orderInfo.split(' ZipCode: ')[0];

        this.zipCode = value;

    },

    alertCodeNotValid(){
    return  this.$ionic.alertController
    .create({
        cssClass: 'my-custom-class',
        header: 'Error',
        message: this.$t('frontend.home.zipCodeNotValid') ,
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

    validateCant(event ){
        if(event>0)
            return event;
        else
            return '1';
        
        },
  
    alertEmailNotValid(){
    this.email =''
    return  this.$ionic.alertController
    .create({
        cssClass: 'my-custom-class',
        header: 'Error',
        message: this.$t('frontend.home.notValidEmail') , 
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
  
    validatePhone(phone){     
    if (!phone) {
      return true;
    }
    try {
       const number = parsePhoneNumber(`+1${phone}`);
      //const number = parsePhoneNumberFromString(`+1${phone}`);
     
      if (!number.isValid()) {       
        return false;         
      }         
      this.phone = parsePhoneNumber(`+1${phone}`).formatNational();
      return true;
    } 
    catch (err) {     
      return false;
    } 
  },

    async openToastProd() {
      return this.$ionic.toastController
      
        .create({
          message: this.$t('frontend.product.massageToast'),
          duration: 2000,
          position: 'top',
          color:'success'
        })
      .then(a => a.present())
    },

    async openToast(mss) {
      return this.$ionic.toastController
      
        .create({
          message: mss,
          duration: 1000,
          position: 'top',
          color:'success'
        })
      .then(a => a.present())
    },

    async goodPaymentToast() {
      return this.$ionic.toastController      
        .create({
            header:this.$t('frontend.order.transictionTitle'),
            message:  this.$t('frontend.order.transictionOk'),
            duration: 2000,
            position: 'middle',
            color:'success'
            })
      .then(a => a.present())
    },

    async errorPaymentToast() {
      return this.$ionic.toastController      
        .create({
            header:this.$t('frontend.order.transictionTitle'),
            message:  this.$t('frontend.order.transictionError'),
            duration: 2000,
            position: 'middle',
            color:'danger'
            })
      .then(a => a.present())
    },

    async errorPaymentDetail(msg) {
      return this.$ionic.toastController      
        .create({
            header:'Error',
            message:  msg,
            duration: 5000,
            position: 'middle',
            color:'danger'
            })
      .then(a => a.present())
    },

     backToCall: function(){
      
        if(this.buttonBack)
         return this.allOrder();
        else
         return this.addProductsToCart() ;
    },

    allOrder: function(){
        return this.$router.push({ name: 'ListOrder', params: {customerId: this.order.ClientId, CustomerName: this.CustomerName} })    
    },

    checkPickTime(){
      let now = Moment().add(this.configuration.minTimeToCook, 'minutes'); 

      let min = Moment(this.configuration.minHour ,'HH:mm')                  
      let max = Moment(this.configuration.maxHour ,'HH:mm')    
       
      if(now > max)
        this.timeToPick = false;
      if(now > min && now < max){  
        this.timeToPick = true;                
         EventBus.$emit('updateMinHour', now.format('HH:mm'));
         return now.format('HH:mm');
      }
      return false;      
    },


ValidateHour(value){

    let now = value

    if(Moment(value).isValid())
      now = Moment(value).format('HH:mm')

     
    this.key ++;  

    let min = Moment(this.thisMinHour).toISOString();
    min = moment.tz(min,  moment.tz.guess()).format('HH:mm') ;

    let max = this.configuration.maxHour  

    let response = this.checkPickTime();
    if(response){
           
      min = response;
    }     
        
   
    if(now < min || now > max){      
      this.alertNoTimeToPick(min)
      this.thisMinHour = '';
      return this.thisMinHour;     
    }
    return value; 
  },

  alertNoTimeToPick(min){
    this.thisMinHour = Moment(this.thisMinHour, 'HH:mm').toISOString();
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: 'Info',
          message: this.$t('frontend.home.pickTime') + '<br>' +  this.$t('frontend.home.notTimeToPick') +
           Moment( min,'kk:mm').format('h:mm A')
           +' - '+ Moment(this.configuration.maxHour,'kk:mm').format('h:mm A')  + '<br>' +
           this.$t('frontend.home.cookTime') + this.configuration.minTimeToCook + this.$t('frontend.home.minuts'),
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

     show () {
      this.$modal.show('my-first-modal');
        },
    
    hide () {
      this.$modal.hide('my-first-modal');
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
              this.isCurbside = false;          
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

    
    showDeliver () {
      this.$modal.show('delivery-modal');
        },
    
    hideDeliver () {
      this.$modal.hide('delivery-modal');
        },

    saveDeliver(){
      if(this.addres1 ===''  ||this.zipCodeFlag == '')
        return this.alertRequiredDatas();

        this.ValidateCodeInModal(this.zipCodeFlag)

      this.orderType = "Delivery"
      EventBus.$emit('updateOrderType', this.orderType);
      this.address = this.addres1 +' '+ this.addres2 +' State: '+ this.state +' City:'+ this.city + ' ZipCode: '+ this.zipCodeFlag;
      this.clientHasOrderSelected = true;
      this.order.OrderType = "Delivery";      
      this.changeOrderButton();
      this.order.AddressToDeliver = this.address; 
      this.order.addres1 = this.addres1; 
      this.order.addres2 = this.addres2; 
      this.order.zipCode = this.zipCodeFlag; 
      this.order.ClientId = this.clientId,  
    
      this.$store.commit('setOrder', this.order);
            
      this.openToast(this.allTypeOrder[this.orderType] + ': ' + this.address);     
      this.hideDeliver();
    },

   showPickUp(){
    
      let min1 = this.configuration.minHour;
      let response = this.checkPickTime();
      if(!this.timeToPick )return this.alertNoTimeToPick(min1);
      if(response)  min1 = response;   
     

      if(this.order.HourToPick){      
        const userHour = Moment(this.order.HourToPick ,'HH:mm');
        const rHour = Moment(response ,'HH:mm');        
        if(userHour > rHour && userHour < this.configuration.maxHour) 
          this.thisMinHour = this.order.HourToPick;
        else
        this.thisMinHour = min1;  
      }  
      else
        this.thisMinHour = min1;         

      this.$modal.show('pickup-modal');

   },
 
  hidePickUp () {
  this.$modal.hide('pickup-modal');
    },

  savePickUp () {

    if(!Moment(this.thisMinHour).isValid())
      this.thisMinHour = Moment(this.thisMinHour, 'HH:mm').toISOString();
    
    if(this.thisMinHour === '')
        return this.alertRequiredDatas();

    this.orderType = "PickUp"
    EventBus.$emit('updateOrderType', this.orderType);
    this.hourToPick = Moment( Moment(this.thisMinHour)).toISOString();
    this.clientHasOrderSelected = true; 
    this.order.OrderType = "PickUp";
    this.order.HourToPick = this.hourToPick; 
    this.order.DateToPick =   Moment(this.dateToDay).toISOString();
    this.order.ClientId = this.clientId,  
    this.changeOrderButton();
    this.$store.commit('setOrder', this.order);
    this.openToast(this.allTypeOrder[this.orderType] + ': ' + moment.tz(this.hourToPick, moment.tz.guess()).format('hh:mm A'))

    this.hidePickUp();
    },

  sinPickAction() {
    this.orderType = "PickUp"
    EventBus.$emit('updateOrderType', this.orderType);
    this.hourToPick = ''
        this.clientHasOrderSelected = true; 
    this.order.OrderType = "PickUp";
    this.changeOrderButton(); 
    this.order.HourToPick = this.hourToPick; 
    this.order.DateToPick =   Moment(this.dateToDay).toISOString();
    this.order.ClientId = this.clientId,    
    this.$store.commit('setOrder', this.order);
    this.showProduct = false;
    }, 

   showCurbside(){

     let min1 = this.configuration.minHour;

      let response = this.checkPickTime();
      if(!this.timeToPick )return this.alertNoTimeToPick(min1);
      if(response)  min1 = response;
      

      if(this.order.HourToPick){
      const userHour = Moment(this.order.HourToPick ,'HH:mm');
      const rHour = Moment(response ,'HH:mm');
      if(userHour > rHour && userHour < this.configuration.maxHour) 
        this.thisMinHour = this.order.HourToPick;
      else
      this.thisMinHour = min1;  
      }  
      else
        this.thisMinHour = min1;         

      this.$modal.show('curbside-modal');

   },
  
  hideCurbside () {
    this.$modal.hide('curbside-modal');
    },

  saveCurbside () {

    if(this.thisMinHour === '' || this.dateToDay === '' ||
     this.licencePlate=== '' || this.vehicleModel=== ''|| this.vehicleColor=== '')
        return this.alertRequiredDatas();

    this.orderType = "Curbside"
    this.order.OrderType = "Curbside";
    this.keyCurbside ++;
    EventBus.$emit('updateOrderType', this.orderType);
    this.hourToPick = Moment(this.thisMinHour, 'HH:mm').toISOString();
    // this.hourToPick = this.thisMinHour;
   
    
    this.changeOrderButton();
    this.order.HourToPick =  this.hourToPick;
    this.order.DateToPick =   Moment(this.dateToDay).toISOString();
    this.order.ClientId = this.clientId,  
    this.order.LicencePlate = this.licencePlate;
    this.order.VehicleModel = this.vehicleModel;
    this.order.VehicleColor = this.vehicleColor;

    this.$store.commit('setOrder', this.order);        
   
    this.openToast(this.allTypeOrder[this.orderType] + ': ' + moment.tz(this.hourToPick, moment.tz.guess()).format('hh:mm A')  )

    this.hideCurbside();
    },

    ValidateCodeInModal(event){
    
     var hills = LibCodes.lookup(event);   
    if(!hills){
      this.state = "";
      this.city = "";
      this.zipCodeFlag = '';
      this.alertCodeNotValid(); 
      return '';
    }  
    if(this.configuration.zipCodes.length > 0){
      const zip = this.configuration.zipCodes.filter(zc => zc.ZipCode === event);
      if(!zip.length >0 ){
        this.state = "";
        this.city = "";
        this.zipCodeFlag = '';
         this.alertNotZoneDelever();   
         return '';     
      }
      else{
        this.state = hills.state;
        this.city = hills.city;
        this.zipCodeFlag = event;
      //  this.openShowCodeDetail(this.state, this.city)
        return event;
      }      
    }
    
    
    },

    changeOrderButton: function(){     
       if(this.order.OrderType === 'Delivery' && this.clientHasOrderSelected){         
        this.isDelivery = true;
        this.isPick = false;
        this.isTable = false;  
        this.isCurbside = false;
        
       }
      if(this.order.OrderType === 'PickUp' && this.clientHasOrderSelected){
        this.isDelivery = false;
        this.isPick = true;
        this.isTable = false;   
        this.isCurbside = false;
        
       }
       if(this.order.OrderType === 'On Table' && this.clientHasOrderSelected){
        this.isDelivery = false;
        this.isPick = false;
        this.isTable = true; 
        this.isCurbside = false;
                
       }
        if(this.order.OrderType === 'Curbside' && this.clientHasOrderSelected){
        this.isDelivery = false;
        this.isPick = false;
        this.isTable = false;   
        this.isCurbside = true;
        
       }
     
    },

      notValidQr(){
      this.changeOrderButton(); 
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
      this.changeOrderButton(); 
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

    quotationBiggerThanSubtotal(){
         this.changeOrderButton(); 
            return  this.$ionic.alertController
            .create({
                cssClass: 'my-custom-class',
                header: 'Error',
                message: this.$t('frontend.reservation.subtotalNotForDiscount'),
                buttons: [                   
                    {
                    text: this.$t('frontend.home.acept'),
                    handler: () => {},
                    },
                ],
            })
            .then(a => a.present())
    },

    notDiscountToApply(){
         this.changeOrderButton(); 
            return  this.$ionic.alertController
            .create({
                cssClass: 'my-custom-class',
                header: 'Error',
                message: this.$t('frontend.reservation.notDiscountToApply'),
                buttons: [                   
                    {
                    text: this.$t('frontend.home.acept'),
                    handler: () => {},
                    },
                ],
            })
            .then(a => a.present())
    },

    orderCloseToDiscount(){
      this.changeOrderButton(); 
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: 'Error',
          message: this.$t('frontend.reservation.orderCloseToDiscount'),
          buttons: [                   
            {
              text: this.$t('frontend.home.acept'),
              handler: () => {},
            },
          ],
      })
      .then(a => a.present())
    },

    logIng: function(update) {
      
       return this.$ionic.modalController
        .create({
          component: orderType,
          cssClass: 'my-custom-class',
          componentProps: {
            data: {
              content: 'New Content',              
            },
          propsData: {           
            restaurantEmail: this.restaurantActive.restaurantEmail,
            update: update, 
          },
          },
        })
        .then(
          m => m.present(),
          )
    },

    closeReservation(){
        if(this.theCodeToDiscount !== ''){
             Api.getReservationByCode(this.theCodeToDiscount)
            .then(response => {                 
                response.data.State = 6;
                Api.putIn('Reservation',response.data);
            })
            .catch(e => {              
              console.log(e); 
            }) 
        }
    },

    findByCode(){
        this.key2++;
        if(this.theCodeToDiscount === '')
            return this.alertRequiredDatas();
        this.spinnerDiscount = true;
        Api.getReservationByCode(this.theCodeToDiscount)
            .then(response => {
                 this.spinnerDiscount = false;
                if(response.data.State === 6){
                    this.discount = 0;
                    return this.orderCloseToDiscount();
                }                    
                if(response.data.QuotationPayment > this.subTotal ){
                     this.discount = 0;
                     return this.quotationBiggerThanSubtotal();
                }                                    
                if(response.data.QuotationPayment && response.data.State === 4)
                    this.discount = response.data.QuotationPayment;  
                else{
                    this.theCodeToDiscount = '';
                    this.showDiscount = false;                    
                     return this.notDiscountToApply();
                }
                   

            })
            .catch(e => {
              this.spinnerDiscount = false;
              this.theCodeToDiscount = '';
              console.log(e);    
              return this.notDiscountToApply();
                        
            }) 
      },

    validateEmail(){
         let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
            if (emailRegex.test(this.email) == false){
                this.email = '';
                return this.alertEmailNotValid();
            }
               
    },
    
    getFormatPrice(price){
      const result = new Intl.NumberFormat('en', {style: "currency", currency: this.restaurantActive.currency} ).format(price)
      return result;
    },

    customerUpdated(){       
      this.clientId= this.$store.state.customer._id;
      this.CustomerName= this.$store.state.customer.Name;
      this.email= this.$store.state.customer.EmailAddress;
      this.phone=this.$store.state.customer.Phone;
      this.marketingEmail=this.$store.state.customer.MarketingConsent.Email;
      this.marketingPhone=this.$store.state.customer.MarketingConsent.Phone;
    },

    getSplitPaymentDo(){
      let count = 0;
      if(this.order.Payment)
        for(var i =0 ; i<this.order.Payment.length; i++ ){
          if(this.order.Payment[i].state===1)
              count += this.order.Payment[i].total
        }
        if(count > 0)
          return this.getFormatPrice(count);
        return count
    },

    getPendingSplitPayment(){
      let count = 0;
      if(this.order.Payment)
        for(var i =0 ; i<this.order.Payment.length; i++ ){
          if(this.order.Payment[i].state===1)
              count += this.order.Payment[i].total
        }
        if(count > 0)
          return this.getFormatPrice(this.order.Total - count);
        return count
    },


 
   
      
},
   
    
  

}
</script>

<style>
.searchbar-input{
    padding: 6px !important;
    text-align: center !important;
}
    .menu-bold-title{
        font-size: 16px;font-weight: bold;text-align: left;
    }
    .titles-order{
    font-size: 20px !important;
    font-weight: bold !important;
    text-align: left;
    padding: 10px;
    position: inherit;
    color: black;    
    }
    .subtitles-order{
    font-size: 16px !important;
    font-weight: bold !important;
    text-align: left;
    padding: 10px;
    position: inherit;
    color: black;    
    }
    .menu-textarea {
        border: 1px solid #80808073;
        margin-bottom: 20px;
    }
    .menu-col-3{
        flex: 0 0 calc(calc(3 / var(--ion-grid-columns, 12)) * 100%);
        width: calc(calc(3 / var(--ion-grid-columns, 12)) * 100%);
        max-width: calc(calc(3 / var(--ion-grid-columns, 12)) * 100%);
        text-align: left;
    }
    .menu-col-8{
        flex: 0 0 calc(calc(8 / var(--ion-grid-columns, 12)) * 100%);
        width: calc(calc(8 / var(--ion-grid-columns, 12)) * 100%);
        max-width: calc(calc(8 / var(--ion-grid-columns, 12)) * 100%);
        text-align: left;
    }
    .menu-col-4{
        flex: 0 0 calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
        width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
        max-width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
        text-align: left;
    }
    .menu-col-6{
        flex: 0 0 calc(calc(6 / var(--ion-grid-columns, 12)) * 100%) !important;
        width: calc(calc(6 / var(--ion-grid-columns, 12)) * 100%) !important;
        max-width: calc(calc(6 / var(--ion-grid-columns, 12)) * 100%) !important;
        text-align: left;
    }
    .menu-col-2{
        flex: 0 0 calc(calc(2 / var(--ion-grid-columns, 12)) * 100%) !important;
        width: calc(calc(2 / var(--ion-grid-columns, 12)) * 100%) !important;
        max-width: calc(calc(2 / var(--ion-grid-columns, 12)) * 100%) !important;
        text-align: left;
    }
    .menu-bold-title{
        padding-right: 15px;
    }

    .modalH {
        height: 40%;
        width: 70%;
        border-radius:10px;
        border: 1px solid  grey;
        top: 20%;
        margin: 0 auto;
    } 
    .select-text {
    font-size: 16px;
} 
</style>

