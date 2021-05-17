<template>

    <div padding >  
      <div v-if="spinner">
        <ion-spinner  name="lines" class="spinner"></ion-spinner>
      </div>

     

     

      <div v-if="!spinner && restaurantSelected"> 
        <!-- <ion-label>{{$t('frontend.home.selectOrderType')}}</ion-label>   <br>     -->
          <ion-button v-if="configuration.viewDelivery && restaurantActive.hasPaymentCardConfig && $store.state.allTickets.length === 0" style="width: 23%;" color="primary" @click="showDeliver" :class="isDelivery? 'ion-color ion-color-primary md button button-solid ion-activatable ion-focusable hydrated button-disabled-menu ':'ion-color ion-color-primary md button button-solid ion-activatable ion-focusable hydrated disable-hover'" >{{$t('frontend.app.deliver')}}</ion-button>
          <ion-button style="width: 23%;" color="secondary" v-if="configuration.selectPickHour && restaurantActive.hasPaymentCardConfig && $store.state.allTickets.length === 0" @click="showPickUp " :class="isPick? 'ion-color ion-color-secondary md button button-solid ion-activatable ion-focusable hydrated button-disabled-menu ':'ion-color ion-color-secondary md button button-solid ion-activatable ion-focusable hydrated'" >{{$t('frontend.app.pickup')}}</ion-button>
          <ion-button style="width: 23%;" color="secondary" v-if="!configuration.selectPickHour && restaurantActive.hasPaymentCardConfig && $store.state.allTickets.length === 0" @click="sinPickAction" :class="isPick? 'ion-color ion-color-secondary md button button-solid ion-activatable ion-focusable hydrated button-disabled-menu ':'ion-color ion-color-secondary md button button-solid ion-activatable ion-focusable hydrated'">{{$t('frontend.app.pickup')}}</ion-button>
          <ion-button  v-if="configuration.viewOnTable" style="width: 23%;" color="tertiary" @click="show"  :class="isTable? 'ion-color ion-color-tertiary md button button-solid ion-activatable ion-focusable hydrated button-disabled-menu ':'ion-color ion-color-tertiary md button button-solid ion-activatable ion-focusable hydrated'" >{{$t('frontend.app.table')}}</ion-button> 
          <ion-button v-if="configuration.viewCurbside && restaurantActive.hasPaymentCardConfig && $store.state.allTickets.length === 0" style="width: 23%;" color="secondary" @click="showCurbside" :class="isCurbside? 'ion-color ion-color-primary md button button-solid ion-activatable ion-focusable hydrated button-disabled-menu ':'ion-color ion-color-primary md button button-solid ion-activatable ion-focusable hydrated disable-hover'" >{{$t('frontend.app.curbside')}}</ion-button>

        <br>
          <div style="display: inline-block;">
            <ion-chip outline  @click="productDetails()"
              style="margin: 7px 0 0 5px;padding: 0 10px; float: left;">            
              <ion-icon name="cart" v-if="!spinnerTicket" size="large" style="margin-right:0"></ion-icon>
              <ion-spinner style="padding-top:10px" v-if="spinnerTicket" name="crescent"  color="primary"></ion-spinner>
              <ion-badge>{{cart.length}}</ion-badge>
            </ion-chip>
            <div v-if="cart.length > 0" style="float: left;margin: 15px;">
              <a @click="showOrder()">{{$t('frontend.home.checkout')}}</a>
            </div> 
          </div>

        
           
      </div>
     

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
           <ion-label v-if="city !=='' && state !== ''" style="color: green;">{{ this.$t('frontend.home.city') }}: {{city}}  |  {{ this.$t('frontend.home.state') }}: {{state}}</ion-label>          

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
       
      <div  v-if="!showProduct && !spinner && restaurantSelected">
       
          <ion-toolbar>
            <!-- <h1 >{{$t('frontend.menu.menu')}}</h1> -->
            <br>
             <div v-if="menuListSinCatering.length > 0">
                <ion-select interface="popover" icon="add"
                style="padding: 10px 50px;"
                 :ok-text="$t('backoffice.form.messages.buttons.ok')"
                 :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
                 :value="menuListSinCatering[0]._id"
                 :placeholder="$t('frontend.menu.menu')"
                  @ionChange="changeMenu($event.target.value)" >
                    <ion-select-option v-for="res in menuListSinCatering"                    
                      :key="res._id" 
                      :value="res._id" > {{res.Name}}
                    </ion-select-option>
                   
                </ion-select>
            </div>


            <ion-searchbar  
              style="padding: 3px 1px;"
              @ionClear="handleInput('')"
              @input="$event.target.value?handleInput($event.target.value):handleInput('')"
              :placeholder="$t('frontend.home.search')"> 
              
            </ion-searchbar>
        </ion-toolbar>

      <v-breakpoint>
         <div slot-scope="scope">

           <div v-if="dots" style="margin: 10px">              
               <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
            </div>

            <div v-if="!dots"> 
              <div  v-for="category in filterCategories"
               :key="category.Id" v-show="!category.ParentId"
               
               :class="scope.isSmall || scope.noMatch ?'menu-col-12 card-categories' : scope.isMedium? 'menu-col-6 card-categories': 'menu-col-3 card-categories'">
                <ion-card  >

                  <ion-item @click="productsByCategory(category._id, category.Name, category.Description)">
                      
                    <div class="menu-col-6" style="height: 120px; width: 140px;background: #80808021;" >
                        <img v-if="category.ImageUrl" :src="category.ImageUrl" style="height: auto;width: 100%;">
                    </div>
                    <ion-label class="ion-text-wrap menu-col-6" >
                        <h1 style="text-overflow: ellipsis; overflow: hidden;display: -webkit-box; -webkit-line-clamp: 2;-webkit-box-orient: vertical;">{{category.Name}}</h1>
                        <!-- <p style=" white-space: nowrap; text-overflow: ellipsis; overflow: hidden;"> {{category.Description}}</p> -->
                    </ion-label>  
                  </ion-item>
              
                  
                                  
                </ion-card>
              </div>
            
            </div>
         
        </div>
      </v-breakpoint>

        
        
      </div>


      <vue-product  v-if="showProduct && !spinner"      
        :restaurantSelectedId="this.restaurantSelectedId"
        :restaurantName="this.restaurantActive.restaurantName"
        :currency="this.restaurantActive.currency"
        :cart="this.cart" 
        :prod="this.prod"
        :products="this.products" 
        :categories="this.categories"
        :variants="this.variants"
        :category="this.categoryName" 
        :categoryDescription="this.categoryDescription"
        :orderType="this.orderType">
       </vue-product>

    

    </div>
</template>

<script>

  

import { add } from "ionicons/icons";
import { addIcons } from "ionicons";

addIcons({
  "ios-add": add.ios,
  "md-add": add.md,
  
});
 import Cart from '../components/Cart'
import { Api } from '../../backoffice/api/api.js';
import { EventBus } from '../event-bus';
 import Products from './Products'
 import { QrcodeStream } from 'vue-qrcode-reader'
 import { VBreakpoint } from 'vue-breakpoint-component'
 import Moment from 'moment'
 import moment from 'moment-timezone';
 import LibCodes from 'zipcodes'


export default {
  name: "Home",
  props: {
    msg: String,
    menuListSinCatering: {type: Array, default:() => [] },
    restaurantSelected: {type: Boolean, default:false } ,
    restaurantSelectedId:  {type: String, default: "" }, 
    products: {type: Array, default:() => [] }, 
    variants: {type: Array, default: () => [] },  
  }, 
  created: async function(){ 

    if(this.$store.state.customer._id){
      this.clientId= this.$store.state.customer._id;            
    }

    this.order = this.$store.state.order;
    this.configuration = this.$store.state.configuration;
    this.restaurantActive = this.$store.state.restaurantActive

    
    this.cart = this.$store.state.cart;


    this.thisMinHour = this.configuration.minHour;

     try {
      if(this.menuListSinCatering.length > 0){ 
        this.dots= true; 
        const id = this.menuListSinCatering[0]._id;                 
        const response = await Api.categoryByMenuId(id);        
        if(response.status === 200){ 
          this.categories = response.data;          
          this.filterCategories = response.data;
          this.dots= false;
          }  
        }
      } catch (error) {
        console.log(error)
         this.dots= false;
    }
    
        
   
    EventBus.$on('openDeliveryModal1', () => {         
      this.showDeliver();
      EventBus.$off('openDeliveryModal1');
    });

    
    EventBus.$on('openPickUpModal1', () => {     
      if(this.configuration.selectPickHour){
        this.showPickUp();  
        EventBus.$off('openPickUpModal1');      
      }        
      else
        this.sinPickAction(); 
      });

    EventBus.$on('openTableModal1', () => { 
         this.show(); 
         EventBus.$off('openTableModal1');                 
      });
      
    this.filterCategories = JSON.parse(JSON.stringify(this.categories))

    EventBus.$on('showProduct', (value) => {
      if(!value)
        this.filterCategories = JSON.parse(JSON.stringify(this.categories))
      this.showProduct = value;  
      EventBus.$off('showProduct');          
    });
    
    EventBus.$on('showOrder', (value) => {
      if(value){
        this.showOrder();
      }  
      EventBus.$off('showOrder');              
    });
       
    if(this.order.OrderType){
      this.orderType = this.order.OrderType;
      this.changeOrderButton()
    }

   this.checkPickTime();

   if(this.order.addres1)
      this.addres1 = this.order.addres1;
    if(this.order.addres2)
      this.addres2 = this.order.addres2;
    if(this.order.zipCode)
      this.zipCodeFlag = this.order.zipCode;

  },  
  data () {
    return {
      modelName: 'Customer',
      isDelivery: false,
      isPick: false,
      isTable: false,
      isCurbside: false,
      addressToDeliver:'',      
      hourToPick: '',
      tabeService:'',
      prod: [],
      cart: [],
      filterCategories: [],
      categories: [],
      spinner: false,
      dots: false,
      timeToPick: true,
      rangeToPick: '',     
      orderType:'',     
      clientId :'',     
      tableService:'',
      order:{},
      showProduct: false,
      categoryName: '',   
      categoryDescription: '',         
      state: '',
      city:'',
      allTypeOrder:{'Delivery':this.$t('frontend.app.deliver'), 'PickUp':this.$t('frontend.app.pickup'), 'On Table':this.$t('frontend.app.table'),'Curbside':this.$t('frontend.app.curbside'), },
      zipCodeFlag: '',
      addres1: '',
      addres2: '',
      thisMinHour: '',
      licencePlate: '',
      vehicleModel: '',
      vehicleColor: '',
      key: 0,
      dateToDay: moment.tz(moment.tz.guess()).format('YYYY-MM-DD'),
      configuration: {},
      restaurantActive: {},
      spinnerTicket: false,
      
      




    }
  }, 
  components:{
    vueProduct: Products,
    VBreakpoint: VBreakpoint,
    QrcodeStream: QrcodeStream
  },  
  methods: {

    handleInput(value){
      const query = value.toLowerCase();
      requestAnimationFrame(() => {       
        let cat2 = this.categories.filter(p => p.Name.toLowerCase().indexOf(query) > -1
                                    ||  p.Description.toLowerCase().indexOf(query) > -1)
        if(cat2.length> 0)
          this.filterCategories = cat2
        else
          this.filterCategories = this.categories  
      });
    },

    async changeMenu(id){
      this.dots = true;   
     // this.spinner = true;
      await Api.categoryByMenuId(id).then(response => {        
         if(response.status === 200){
         this.categories = response.data; 
         this.filterCategories = response.data;     
          this.dots=false     
         }        
      })
      .catch(e => {
        this.dots = false
        console.log(e)
      });
     //   

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
     
    productsByCategory(categoryId, categoryName, categoryDescription){ 
      this.categoryDescription = categoryDescription;
      this.categoryName = categoryName;
      this.prod = this.products.filter(p => p.CategoryId === categoryId && p.Available === true);

      let c1 = this.categories.filter(c => c.ParentId === categoryId);

      for(var i=0; i< c1.length; i++){
        let p =this.products.filter(p => p.CategoryId === c1[i]._id)
        p.forEach( p => this.prod.push(p));
      }

      this.showProduct = true;
          },
 
    productDetails: async function(){

      
      if(this.order._id && this.order.State=== 0 && this.order.isTicket=== true){
         this.spinnerTicket = true;
          const response = await Api.fetchById("Order", this.order._id)  
          if(response.status === 200){           
            this.$store.commit('setOrder', response.data);
            const cartTicket = this.cart;
            const cartOrder = response.data.Products
            for (const cart1 of cartTicket) {
              for (const order1 of cartOrder) {
                if(cart1.ProductId === order1.ProductId )
                  cart1.State = order1.State;                
              }              
            }
            this.$store.commit('setCart', cartTicket );
            this.order = response.data;
            this.cart = cartTicket;

            this.spinnerTicket = false;
          }
      }

      return this.$ionic.modalController
        .create({
          component: Cart,
          cssClass: 'my-custom-class',
          componentProps: {
            data: {
              content: 'New Content',
            },
            propsData: { 
              key:0,
              parent: this,
              title: this.$t('frontend.home.cardTitle'), 
              message:  this.$t('frontend.product.massageToast'),
              buttonAcept:this.$t('frontend.home.checkout'),
              buttonCancel:this.$t('frontend.home.cancel'),
              aggregateFree: this.$t('frontend.home.aggregateFree'),
              refresh: this.$t('frontend.menu.refresh'),
              currency: this.restaurantActive.currency,
              
            },
          },
        })
        .then(m => m.present())  
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

      this.orderType = "Delivery"
      EventBus.$emit('updateOrderType', this.orderType);
      this.address = this.addres1 +' '+ this.addres2 +' State: '+ this.state +' City:'+ this.city + ' ZipCode: '+ this.zipCodeFlag;
          
      this.order.OrderType = "Delivery";
      this.changeOrderButton(); 
      this.order.AddressToDeliver = this.address; 
      this.order.addres1 = this.addres1; 
      this.order.addres2 = this.addres2; 
      this.order.zipCode = this.zipCodeFlag; 
      this.order.ClientId = this.clientId,  

      this.$store.commit('setOrder', this.order);         
      
      this.openToast(this.allTypeOrder[this.orderType] + ': ' + this.address)  
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
    EventBus.$emit('updateOrderType', this.orderType);
    this.hourToPick = Moment(this.thisMinHour, 'HH:mm').toISOString();
    // this.hourToPick = this.thisMinHour;
   
    this.order.OrderType = "Curbside";
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

  ValidateHour(value){

    let now = value

    if(Moment(value).isValid())
      now = Moment(value).format('HH:mm')
    this.key ++;     
   

    let min = Moment(this.thisMinHour).toISOString();
    min = moment.tz(min).format('HH:mm') ;

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

  savePickUp () {

    if(this.thisMinHour === '' || this.dateToDay === '')
        return this.alertRequiredDatas();

    this.orderType = "PickUp"
    EventBus.$emit('updateOrderType', this.orderType);
    this.hourToPick = Moment(this.thisMinHour, 'HH:mm').toISOString();
    // this.hourToPick = this.thisMinHour;
   
    this.order.OrderType = "PickUp";
    this.changeOrderButton();
    this.order.HourToPick =  this.hourToPick;
    this.order.DateToPick =   Moment(this.dateToDay).toISOString();
    this.order.ClientId = this.clientId,  

    this.$store.commit('setOrder', this.order);        
   
    this.openToast(this.allTypeOrder[this.orderType] + ': ' + moment.tz(this.hourToPick, moment.tz.guess()).format('hh:mm A')  )

    this.hidePickUp();
    },

      getReservationHour(thisHour){
      return  moment.tz(thisHour, moment.tz.guess()).format('hh:mm A') 
    },



    async deliveryAction() { 
      
       let zipZCode = '';
       let aadress= '';
       if(this.order.AddressToDeliver){
         const zz = this.order.AddressToDeliver.split('ZipCode: ');
         const aa = this.order.AddressToDeliver.split('State:'); 
         if(zz.length>1)
          zipZCode = parseInt(zz[1])
         if(aa.length > 1) 
         aadress = aa[0]
       }
       const alert = await this.$ionic.alertController
      .create({
        cssClass: 'my-custom-class',
        header: this.$t('frontend.home.deliverDetail') ,
        inputs: [  
          { type:'text', name: 'address',id:'address-id', value: aadress, placeholder: this.$t('frontend.home.address') }, 
          { type:'text', name: 'address2',id:'address2-id', placeholder: this.$t('frontend.home.address')+2 }, 
          { type:'number', name: 'zipCode',id:'code-id', value: zipZCode, placeholder: this.$t('frontend.orderType.code'),
      
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
                
                this.orderType = "Delivery"
                EventBus.$emit('updateOrderType', this.orderType);
                this.address = data.address +' '+ data.address2 +' State: '+ this.state +' City:'+ this.city + ' ZipCode: '+ data.zipCode;
                                 
                this.order.OrderType = "Delivery";
                this.changeOrderButton();
                this.order.AddressToDeliver = this.address; 
                this.order.ClientId = this.clientId,  

                this.$store.commit('setOrder', this.order);              
                
                
                this.openToast(this.allTypeOrder[this.orderType] + ': ' + this.address)
              }     
              
            },
          },
        ],
      })
      // .then(a => a.present())
      return alert.present();
     
    },

    

    sinPickAction() {
        this.orderType = "PickUp"
        EventBus.$emit('updateOrderType', this.orderType);
        this.hourToPick = ''
              
        this.order.OrderType = "PickUp";
        this.changeOrderButton(); 
        this.order.HourToPick = moment.tz(this.hourToPick, moment.tz.guess()).format('hh:mm A');
        this.order.DateToPick =   Moment(this.dateToDay).toISOString();
        this.order.ClientId = this.clientId,
        this.$store.commit('setOrder', this.order);    
        
        this.showProduct = false;
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
              this.isCurbside = false;
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

    alertNoTimeToPick(min){
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

    changeOrderButton: function(){     
       if(this.orderType === 'Delivery' ){         
        this.isDelivery = true;
        this.isPick = false;
        this.isTable = false;  
        this.isCurbside = false;
        
       }
      if(this.orderType === 'PickUp' ){
        this.isDelivery = false;
        this.isPick = true;
        this.isTable = false;   
        this.isCurbside = false;
        
       }
       if(this.orderType === 'On Table' ){
        this.isDelivery = false;
        this.isPick = false;
        this.isTable = true;
        this.isCurbside = false; 
                
       }
        if(this.orderType === 'Curbside' ){
          this.isDelivery = false;
          this.isPick = false;
          this.isTable = false;
          this.isCurbside = true;                 
       }
     
    },

    alertCodeNotValid(){
    return  this.$ionic.alertController
    .create({
        cssClass: 'my-custom-class',
        header: 'Error',
        message: this.$t('frontend.home.zipCodeNotValid'),
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
      this.state = "";
      this.city = "";
      return this.alertCodeNotValid(), false;
    }  
    if(this.configuration.zipCodes.length > 0){
      const zip = this.configuration.zipCodes.filter(zc => zc.ZipCode === event);
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

  showOrder(){
   
    if(this.cart.length > 0)
      if(this.cart[0].fromCatering === true)
        return this.$router.push({ name: 'OrderCatering' }) 
    if(this.$store.state.allTickets.length)
      return this.$router.push({ name: 'OrderTicket' }) 
    else
      this.$router.push({ name: 'OrderFront' }) 
  }

  },
};

</script>


<style scoped>

.disable-hover:hover{
    --background-hover: red;
    --background-hover-opacity: 1;
    --color-hover: grey;
}

.button-disabled-menu{
    --opacity: 0.6;
    /* pointer-events: none; */
    --ion-color-base: grey !important;
    --box-shadow: -2px -3px -1px 2px rgba(0,0,0,0.2),0 -2px -2px 0 rgba(0,0,0,0.14),0 -1px -5px 0 rgba(0,0,0,0.12) !important;
}

  .menu-col-2{
        flex: 0 0 calc(calc(2 / var(--ion-grid-columns, 12)) * 100%);
        width: calc(calc(2 / var(--ion-grid-columns, 12)) * 100%);
        max-width: calc(calc(2 / var(--ion-grid-columns, 12)) * 100%);
    }
      .menu-col-5{
        flex: 0 0 calc(calc(5 / var(--ion-grid-columns, 12)) * 100%);
        width: calc(calc(5 / var(--ion-grid-columns, 12)) * 100%);
        max-width: calc(calc(5 / var(--ion-grid-columns, 12)) * 100%);
        padding: 0 5px;
    }
    .menu-col-6{
        flex: 0 0 calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
        width: calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
        max-width: calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
        padding: 0 5px;
    }
    .menu-col-4{
    flex: 0 0 calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    padding: 0 5px;
    }
    .menu-col-12{
        flex: 0 0 calc(calc(12 / var(--ion-grid-columns, 12)) * 100%);
        width: calc(calc(12 / var(--ion-grid-columns, 12)) * 100%);
        max-width: calc(calc(12 / var(--ion-grid-columns, 12)) * 100%);
        padding: 0 5px;
    }
    .card-categories{
      float: left;
      margin: 0;
      height: 150px;
      padding: 10px 2px;
    }
    .card-categories .sc-ion-card-md-s img {
    height: 120px;
    width: 140px;
    }
    .card-categories ion-card{
    max-width: 420px !important;
    margin: 0 auto !important;
  }
    .card-categories .sc-ion-card-md-h:hover{
      box-shadow: 0 4px 1px 6px rgba(0,0,0,.2), 0 2px 2px 0 rgb(61 58 55 / 14%), 0 1px 5px 0 rgba(0,0,0,.12);
    }
    .card-categories .item-native{
          padding-inline-start: 0 !important;
    }
</style>