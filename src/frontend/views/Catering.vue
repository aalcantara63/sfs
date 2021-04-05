<template>

    <div padding >  
      <div v-if="spinner">
        <ion-spinner  name="lines" class="spinner"></ion-spinner>
      </div>


      <modal name="catering-modal"  width="80%" height="auto" style="left: 0px;width: auto;height: auto; max-width: 500px !important;">
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
            <ion-label position="floating">{{$t('frontend.order.dateToPickEstimated')}} <strong style="color: red">*</strong></ion-label>
            <ion-datetime :value="dateToDay" max="2030"  @ionChange="dateEstimateToPick=$event.target.value, validateHour()" :min="dateToDay.format('YYYY-MM-DD')"     
            ></ion-datetime>
          </ion-item>
          <ion-item>
            <ion-label position="floating">{{$t('frontend.order.hourToPickEstimated')}} <strong style="color: red">*</strong></ion-label>
            <ion-datetime display-format="h:mm A" picker-format="h:mm A" :value="hourEstimateToPick"  @ionChange="hourEstimateToPick = $event.target.value, validateHour()"  :key="key2"      
            ></ion-datetime>
          </ion-item>
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
            <ion-input type="text" :value="zipCodeFlag" @input="zipCodeFlag= $event.target.value" @change="zipCodeFlag=ValidateState($event.target.value)">             
            </ion-input>
          </ion-item>
          <ion-button  @click="hideDeliver()">{{ this.$t('frontend.home.cancel') }}</ion-button>
          <ion-button  @click="saveDeliver()">{{ this.$t('frontend.home.acept') }}</ion-button>
          
        </ion-card>          
      </modal>

      <modal name="pickup-modal" width="80%" height="auto" style="left: 0px;width: auto;height: auto; max-width: 500px !important;">
        <ion-buttons slot="start" @click="hidePickUp()">
              <ion-back-button default-href="home"></ion-back-button>
        </ion-buttons>
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ $t('frontend.home.pickupDetail') }}</ion-title>
          </ion-toolbar>
          <ion-label color="success"><p><strong>{{ this.$t('frontend.order.readyForPick') }}</strong></p></ion-label>

        </ion-header>

        <ion-card>
            <ion-item>
            <ion-label position="floating">{{$t('frontend.order.dateToPickEstimated')}} <strong style="color: red">*</strong></ion-label>
            <ion-datetime :value="dateEstimateToPick" max="2030"  @ionChange="dateEstimateToPick=$event.target.value, validateHour()" :min="dateToDay.format('YYYY-MM-DD')"     
            ></ion-datetime>
          </ion-item>
          <ion-item>
            <ion-label position="floating">{{$t('frontend.order.hourToPickEstimated')}} <strong style="color: red">*</strong></ion-label>
            <ion-datetime display-format="h:mm A" picker-format="h:mm A" :value="hourEstimateToPick"
              @ionChange="hourEstimateToPick=$event.target.value, validateHour()" :key="key"        
            ></ion-datetime>
          </ion-item>  
                  
          <ion-button  @click="hidePickUp()">{{ this.$t('frontend.home.cancel') }}</ion-button>
          <ion-button  @click="savePickUp()">{{ this.$t('frontend.home.acept') }}</ion-button>
          
        </ion-card>          
      </modal>

     

      <div v-if="!spinner && restaurantSelected"> 
        <!-- <ion-label>{{$t('frontend.home.selectOrderType')}}</ion-label>   <br>     -->
          <ion-button style="width: 25%;" color="primary" @click="showDeliver" :class="isDelivery? 'ion-color ion-color-primary md button button-solid ion-activatable ion-focusable hydrated button-disabled-menu ':'ion-color ion-color-primary md button button-solid ion-activatable ion-focusable hydrated disable-hover'" >Catering</ion-button>
          <ion-button style="width: 25%;" color="secondary" v-if="configuration.selectPickHour" @click="showPickUp" :class="isPick? 'ion-color ion-color-secondary md button button-solid ion-activatable ion-focusable hydrated button-disabled-menu ':'ion-color ion-color-secondary md button button-solid ion-activatable ion-focusable hydrated'" >{{$t('frontend.app.pickup')}}</ion-button>
          <ion-button style="width: 25%;" color="secondary" v-if="!configuration.selectPickHour" @click="sinPickAction" :class="isPick? 'ion-color ion-color-secondary md button button-solid ion-activatable ion-focusable hydrated button-disabled-menu ':'ion-color ion-color-secondary md button button-solid ion-activatable ion-focusable hydrated'">{{$t('frontend.app.pickup')}}</ion-button>
        
        <br>
           <div style="display: inline-block;">
              <ion-chip outline  @click="productDetails"
              style="margin: 7px 0 0 5px;padding: 0 10px; float: left;">            
              <ion-icon name="cart" size="large" style="margin-right:0"></ion-icon>
              <ion-badge>{{cart.length}}</ion-badge>
            </ion-chip>
            <div v-if="cart.length > 0" style="float: left;margin: 15px;">
              <a @click="showOrder()">{{$t('frontend.home.checkout')}}</a>
            </div>
          </div>

           
      </div>

      
     

         
      <div  v-if="!showProduct && !spinner && restaurantSelected">
       
          <ion-toolbar>
            <h1 >{{$t('frontend.menu.catering')}} </h1>
            <br>
             <div v-if="menuListConCatering.length > 0">
                <ion-select interface="popover" icon="add"
                style="padding: 10px 50px;"
                 :ok-text="$t('backoffice.form.messages.buttons.ok')"
                 :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
                 :value="menuListConCatering[0]._id"
                 :placeholder="$t('frontend.menu.menu')"
                  @ionChange="changeMenu($event.target.value)" >
                    <ion-select-option v-for="res in menuListConCatering"                    
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
            <span v-else> 
              <div  v-for="category in filterCategories" :key="category.Id" v-show="!category.ParentId"
              :class="scope.isSmall || scope.noMatch ?'menu-col-12 card-categories' : scope.isMedium? 'menu-col-6 card-categories': 'menu-col-4 card-categories'">
                <ion-card  >

                  <ion-item @click="productsByCategory(category._id, category.Name, category.Service || false, category.Description)">
                      
                    <div class="menu-col-6" style="height: 120px; width: 140px;background: #80808021;">
                        <img v-if="category.ImageUrl" :src="category.ImageUrl">
                    </div>
                    <ion-label class="ion-text-wrap menu-col-6" >
                       <h1 style="text-overflow: ellipsis; overflow: hidden;display: -webkit-box; -webkit-line-clamp: 2;-webkit-box-orient: vertical;">{{category.Name}}</h1>
                        <!-- <p> {{category.Description}}</p> -->
                    </ion-label>  
                  </ion-item>
              
                  
                                  
                </ion-card>
              </div>
            
            </span>
         
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
        :isService="this.isService"
        :orderType="this.orderType"
        :categoryDescription="this.categoryDescription"
        :orderFromCatering="true">
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
 import { VBreakpoint } from 'vue-breakpoint-component'
 import Moment from 'moment'
 import moment from 'moment-timezone';
 import LibCodes from 'zipcodes'


export default {
  name: "Catering",
  props: {
    msg: String,
    menuListConCatering: {type: Array, default:() => [] },
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
    EventBus.$on('updateCart', (value) => { if(value) this.cart = this.$store.state.cart; });

   
    this.dateToDay = moment.tz(moment.tz.guess()).format('MM-DD-YYYY'),
    
    this.dateToDay = moment(this.dateToDay, "MM-DD-YYYY").add('days', this.configuration.cateringMarginDays);

   try {
      if(this.menuListConCatering.length > 0){ 
        this.dots= true; 
        const id = this.menuListConCatering[0]._id;               
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
        this.pickAction();        
      }        
      else
        this.sinPickAction(); 
      EventBus.$off('openPickUpModal1');
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
        if(this.cart[0].fromCatering === true)
          return this.$router.push({ name: 'OrderCatering', params: {shippingName: this.shippingName, shipping: this.shipping} }) 
        else
          this.$router.push({ name: 'Order' }) 
      EventBus.$off('showOrder');
      }                
    });
    
   
   
    if (this.$route.params.order) {
      this.order = this.$route.params.order;
      this.orderType = this.order.OrderType;
      this.changeOrderButton()
      }

   this.checkPickTime();

  },  
  data () {
    return {
      modelName: 'Customer',
      isDelivery: false,
      isPick: false,
      isTable: false,
      addressToDeliver:'',      
      hourToPick: '',
      tabeService:'',
      prod: [],
      cart: [],
      order: {},
      filterCategories: [],
      categories: [],
      spinner: false,
      dots: false,
      timeToPick: true,
      rangeToPick: '',     
      orderType:'',     
      CustomerName :'',     
      tableService:'',      
      showProduct: false,
      categoryName: '',
      categoryDescription: '',        
      isService: false,     
      state: '',
      city:'',
      allTypeOrder:{'Delivery':this.$t('frontend.app.deliver'), 'PickUp':this.$t('frontend.app.pickup'), 'On Table':this.$t('frontend.app.table') },
      dateToDay: moment.tz(moment.tz.guess()).format('YYYY-MM-DD'),
      zipCodeFlag: '',
      addres1: '',
      addres2: '',
      hourEstimateToPick:'',
      dateEstimateToPick:this.dateToDay,
      key: 0,
      key2: 0,
      configuration:{},
       restaurantActive: {},


    }
  }, 
  components:{
    vueProduct: Products,
    VBreakpoint: VBreakpoint,    
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
      await Api.categoryByMenuId(id).then(response => {       
         if(response.status === 200){
         this.categories = response.data; 
         this.filterCategories = response.data;          
         }
         this.dots=false
      })
       .catch(e => {
        this.dots = false
        console.log(e)
      });

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

 
     
    productsByCategory(categoryId, categoryName, Service, categoryDescription){ 
      this.categoryDescription = categoryDescription;
      this.categoryName = categoryName;
      this.isService = Service;
      this.prod = this.products.filter(p => p.CategoryId === categoryId && p.Available === true);

      let c1 = this.categories.filter(c => c.ParentId === categoryId);

      for(var i=0; i< c1.length; i++){
        let p =this.products.filter(p => p.CategoryId === c1[i]._id)
        p.forEach( p => this.prod.push(p));
      }

      this.showProduct = true;
      },
 
    productDetails: function(){
      return this.$ionic.modalController
        .create({
          component: Cart,
          cssClass: 'my-custom-class',
          componentProps: {
            data: {
              content: 'New Content',
            },
            propsData: { 
              parent: this,
              key:0,
              title: this.$t('frontend.home.cardTitle'),            
              cart: this.cart,
              message:  this.$t('frontend.product.massageToast'),
              buttonAcept:this.$t('frontend.home.checkout'),
              buttonCancel:this.$t('frontend.home.cancel'),
              aggregateFree: this.$t('frontend.home.aggregateFree'),
              refresh: this.$t('frontend.menu.refresh'),
              currency: this.restaurantActive.currency
            },
          },
        })
        .then(m => m.present())  
    },


    saveDeliver(){
      if(this.addres1 ===''  ||this.zipCodeFlag == '' 
      || this.dateEstimateToPick ==='' || this.hourEstimateToPick === '' 
      || this.dateEstimateToPick ==='' || this.hourEstimateToPick === '')
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
      this.order.HourToPick =this.hourEstimateToPick;  
      this.order.DateToPick =this.dateEstimateToPick; 
      this.order.ClientId = this.clientId,  
    
      this.$store.commit('setOrder', this.order);
      
      this.openToast(this.allTypeOrder[this.orderType] + ': ' + this.address)  
      this.hideDeliver();
    },
   


    async deliveryAction() {    
       let minDelivery = ''
       if(this.configuration.minAmountCateringDelivery > 0) 
          minDelivery = this.$t('frontend.orderType.minAmountDelivery') +' '+  this.configuration.minAmountCateringDelivery.toFixed(2) + ' $';
        else if(this.configuration.minAmoutCatering > 0)    
          minDelivery = this.$t('frontend.orderType.minAmountDelivery') + ' ' + this.configuration.minAmoutCatering.toFixed(2) + ' $';  

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
        message: minDelivery,             
        inputs: [ 
         
          {name: 'datePick',  type: 'date', value: this.dateToDay },
          {name: 'hourPick',  type: 'time'},
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
                if(data.address==='' || data.zipCode ==='' ||
                 data.datePick === '' || data.hourPick === '')
                  return this.alertRequiredDatas(); 

                if(data.datePick < this.dateToDay)  
                  return this.alertWrongDate();
                  
              let code = await this.ValidateCode(data.zipCode); 
             

              if(code){
                
                this.orderType = "Delivery"
                EventBus.$emit('updateOrderType', this.orderType);
                this.address = data.address +' '+ data.address2 +' State: '+ this.state +' City:'+ this.city + ' ZipCode: '+ data.zipCode;               
                this.changeOrderButton();  
                this.order.OrderType = "Delivery";
                this.order.AddressToDeliver = this.address; 
                this.order.HourToPick = data.hourPick;  
                this.order.DateToPick = data.datePick; 
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

    pickAction() {

      let minDelivery = ''
      if(this.configuration.minAmoutCatering > 0)    
        minDelivery = this.$t('frontend.orderType.minAmountPickUp') + ' ' + this.configuration.minAmoutCatering.toFixed(2) + ' $';  

      return this.$ionic.alertController
      .create({
        cssClass: 'my-custom-class',
        header: this.$t('frontend.home.pickupDetail'),    
        message: minDelivery,   
        inputs: [         
          {name: 'datePick',  type: 'date', value: this.dateToDay },
          {name: 'hourPick',  type: 'time',  pickerFormat: 'h:mm A', displayFormat: 'h:mm A'},
        ],
        buttons: [
          {
            text: this.$t('frontend.home.cancel'),  role: 'cancel', cssClass: 'secondary',
            handler: () => {                
            },
          },
          {
            text: this.$t('frontend.home.acept'),
            handler: (data) => {
               if(data.hourPick==='' || data.datePick === '')
                  return this.alertRequiredDatas();

                if(data.datePick < this.dateToDay)  
                  return this.alertWrongDate();

              this.orderType = "PickUp"
              EventBus.$emit('updateOrderType', this.orderType);
              this.hourToPick = data.hourPick              
              this.changeOrderButton(); 
              this.order.OrderType = "PickUp";
              this.order.HourToPick = data.hourPick;  
              this.order.DateToPick = data.datePick;  
              this.order.ClientId = this.clientId,  
                 
              this.$store.commit('setOrder', this.order);
              
              this.openToast(this.allTypeOrder[this.orderType] + ': ' + this.order.DateToPick + ' : ' + this.order.HourToPick)
          
            },
          },
        ],
      })
      .then(a => a.present())
    },

    sinPickAction() {
        this.orderType = "PickUp"
        EventBus.$emit('updateOrderType', this.orderType);
        this.hourToPick = ''
        this.changeOrderButton(); 
        this.order.OrderType = "PickUp";
        this.order.HourToPick = this.hourToPick; 
        this.order.ClientId = this.clientId,    
        this.$store.commit('setOrder', this.order);
        this.showProduct = false;
    },


  alertWrongDate(){
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: 'Error',
          message: this.$t('frontend.home.errorDateNotValid'),
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

    alertNoTimeToPick(){
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: 'Info',
          message: this.$t('frontend.home.notTimeToPick') + 
          this.configuration.minHour +' - '+ this.configuration.maxHour +
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
       if(this.orderType === 'Delivery'){         
        this.isDelivery = true;
        this.isPick = false;
        this.isTable = false;  
        
       }
      if(this.orderType === 'PickUp' ){
        this.isDelivery = false;
        this.isPick = true;
        this.isTable = false;   
        
       }
       if(this.orderType === 'On Table' ){
        this.isDelivery = false;
        this.isPick = false;
        this.isTable = true; 
                
       }
     
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

    ValidateCode(event){
    
     var hills = LibCodes.lookup(event);   
    if(!hills){
      this.state = "";
      this.city = "";
      return this.alertCodeNotValid(), false;
    }  
    if(this.configuration.zipCodes.length > 0){
      const zip = this.configuration.zipCodes.filter(zc => zc.ZipCode === event && zc.IsCatering === true);
      if(! zip.length >0 ){
        this.state = "";
        this.city = "";
        return this.alertNotZoneDelever(), false;        
      }
      else{
        this.shippingName =  "Catering Delivering" +' State: '+ hills.state +' City:'+ hills.city ;
        this.shipping = zip[0].CateringPrice;  
        this.state = hills.state;
        this.city = hills.city;
        this.openShowCodeDetail(this.state, this.city)
        return true;
      }      
    }
    
    
    },

    ValidateState(event){
      this.state = "";
      this.city = "";
      this.zipCodeFlag = '';
    
      var hills = LibCodes.lookup(event);   

      if(!hills){
        this.alertCodeNotValid(); 
        return '';
      }  
       if(this.configuration.zipCodesExcludes.length > 0){
        const zip = this.configuration.zipCodesExcludes.findIndex(zp => zp === event);
        if(zip !== -1 ){
          this.alertNotZoneDelever();   
          return '';     
        }
       }
      if(this.configuration.cateringStates.length > 0){
        const state = this.configuration.cateringStates.findIndex(st => st === hills.state);
        if(state === -1 ){
          this.alertNotZoneDelever();   
          return '';     
        }     
      }
        this.state = hills.state;
        this.city = hills.city;
        this.zipCodeFlag = event;      
        return event;
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

  showDeliver () {    
      this.$modal.show('catering-modal');
        },
    
  hideDeliver () {
      this.$modal.hide('catering-modal');
        },

  showPickUp(){
      this.$modal.show('pickup-modal');
   },
 
  hidePickUp () {
  this.$modal.hide('pickup-modal');
    },

  savePickUp () {
   
    if(this.hourEstimateToPick === '' || this.dateEstimateToPick === '')
        return this.alertRequiredDatas();

    this.orderType = "PickUp"
    EventBus.$emit('updateOrderType', this.orderType);
    this.hourToPick = this.hourEstimateToPick;   
    this.order.OrderType = "PickUp";
    this.changeOrderButton();
    this.order.HourToPick =this.hourEstimateToPick;  
    this.order.DateToPick =this.dateEstimateToPick;  
    this.order.ClientId = this.clientId,  
        
    this.$store.commit('setOrder', this.order);
    this.openToast(this.allTypeOrder[this.orderType] + ': ' + this.getReservationDate(this.dateEstimateToPick) + ' : ' + this.getReservationHour(this.hourEstimateToPick) )

    this.hidePickUp();
    },

  showOrder(){
     if(this.cart[0].fromCatering === true)
          return this.$router.push({ name: 'OrderCatering', params: {shippingName: this.shippingName, shipping: this.shipping} }) 
        else
          this.$router.push({ name: 'Order' }) 
  },

  getReservationDate(thisDate){
    return  moment.tz(thisDate, moment.tz.guess()).format('MM-DD-YYYY') 
  },

  getReservationHour(thisHour){
      return  moment.tz(thisHour, moment.tz.guess()).format('hh:mm A') 
    },

  alertNotGoodHour(message){
    return  this.$ionic.alertController
    .create({
        cssClass: 'my-custom-class',
        header: 'Error',
        message: message,
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

  validateHour(){
        this.key ++;
        this.key2 ++;       

        if(this.hourEstimateToPick === '')
          return ''
        
        var hour = Moment(this.hourEstimateToPick).toISOString();
        var day =  Moment(this.dateEstimateToPick).toISOString();
        hour = moment.tz(hour,  moment.tz.guess()).format('HH:mm') ;
        day =  moment.tz(day,  moment.tz.guess()).format('dddd') ;

        const index = this.restaurantActive.restaurantDaysAndTime.findIndex(re=> re.Day === day);

        if(index !== -1){
          const openHour =  moment.tz(this.restaurantActive.restaurantDaysAndTime[index].OpenHour,  moment.tz.guess()).format('HH:mm') ; 
          const closeHour =  moment.tz(this.restaurantActive.restaurantDaysAndTime[index].CloseHour,  moment.tz.guess()).format('HH:mm') ; 
         
          if( hour < openHour || hour > closeHour){
            this.hourEstimateToPick = '';
                       
            const mess = this.$t('frontend.reservation.errorHourCaterin')+ day + 
            this.$t('frontend.reservation.errorHour2') +
            this.getReservationHour(this.restaurantActive.restaurantDaysAndTime[index].OpenHour) + ' - '+ this.getReservationHour(this.restaurantActive.restaurantDaysAndTime[index].CloseHour);

            this.alertNotGoodHour(mess);
           
          }  
          
        }


      },

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
    width: auto;
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