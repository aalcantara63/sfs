<template>
    <div>
         <ion-card  style="padding: 0 10px 10px 0;" :key="key"> 

            <div  v-if="staffName !=''" style="display: flex">                                                 
                <ion-label > <h2 class="titles-order" style="float: left;">  {{i18n.t('frontend.orderType.worker')}}: {{staffName}} </h2>
                </ion-label>  
            </div>
                             
            <div>

                <ion-label class="ion-text-wrap menu-col-12" style="display: flex;justify-content: space-between;align-items: center">
                    <h2 class="titles-order" style="color: black; font-weight: 500; font-size: 20px;">{{i18n.t('frontend.order.clientInfo')}}</h2>
                    <ion-button  v-if="clientId ==='' && staffName ===''" 
                        v-tooltip="i18n.t('frontend.menu.log')"
                        @click="logIng('')" 
                        fill="outline"  
                        style="float: left; margin-right: 10px;" >
                         <span class="iconify" data-icon="ei:user" data-inline="false" style="margin: 0 -13px;"></span> 
                    </ion-button>  
                </ion-label>
                           
                <p   v-if="clientId ==='' && staffName ==='' && !isCatering"
                    style="display: inline-block; float: left; font-style: italic; 
                     font-weight: 500;width: 100%; text-align: left;font-size: 16px; margin: 5px;">
                    <span class="iconify" data-icon="twemoji:warning" data-inline="false" style="margin: 5px 0 0 15px; width: 18px;height: 18px;"></span>
                    {{i18n.t('frontend.order.messageToast')}} <br>
                    {{i18n.t('frontend.order.messgForContact')}}
                </p>   
               

                <p v-if="clientId ==='' && staffName ==='' && isCatering"
                    style="display: inline-block; float: left; font-style: italic;
                   font-weight: 500;width: 100%; text-align: left;color: red;
                    font-size: 16px; margin: 5px;">
                    <span class="iconify" data-icon="el:error-alt" data-inline="false" style="color: red; margin: 5px 0 0 15px; width: 18px;height: 18px;"></span>
                                    {{$t('frontend.home.clientRequired')}}
                </p>
            
            </div>      

            <div v-if="( isCatering && (clientId !=='' || staffName !=='')) || !isCatering ">
                <ion-item :style="clientId ===''? 'border: 1px solid #262626;width: 100%' : 'width: 100%'">                    
                    <ion-label position="floating">{{i18n.t('frontend.orderType.name')}} 
                        <strong v-if="order.OrderType !=='On Table'" style="color: red">*</strong></ion-label>                                                                                                                                
                    <ion-input :value="CustomerName" :readonly="clientId !='' || isCatering" 
                    @input="CustomerName = $event.target.value" 
                    ></ion-input>
                </ion-item>

                <ion-item :style="clientId ===''? 'border: 1px solid #262626;width: 100%' : 'width: 100%'">                    
                    <ion-label position="floating">{{i18n.t('frontend.orderType.email')}} 
                        <strong v-if="order.OrderType !=='On Table' || staffName ===''" style="color: red">*</strong>
                    </ion-label>                                                                                                                                
                    <ion-input :value="email" :readonly="clientId !='' || isCatering" 
                        @input="email = $event.target.value" 
                        @change="validateEmail()"
                    ></ion-input>
                </ion-item>

                <ion-item :style="clientId ===''? 'border: 1px solid #262626;width: 100%' : 'width: 100%'">                    
                    <ion-label position="floating">{{i18n.t('frontend.orderType.phone')}} 
                        <strong v-if="order.OrderType !=='On Table' || staffName ===''" style="color: red">*</strong>
                    </ion-label>                                                                                                                                
                    <ion-input :value="phone" :readonly="clientId !='' || isCatering" 
                        @input="phone = $event.target.value" 
                        @change="validatePhone($event.target.value)" 
                    ></ion-input>
                </ion-item>
            </div>

             <div v-if="isCatering"> 

                <ion-label>
                    <h2 class="titles-order" style="float: left;">Datos del evento: </h2>
                </ion-label>  

                <ion-item style="width: 100%;">
                    <ion-label position="floating"> {{$t('frontend.order.eventName')}}</ion-label> 
                        <ion-input type="text" :value="eventName" @input="order.EventName = $event.target.value"  style=" float: left;text-align: left;"></ion-input>   
                </ion-item>                             

                <ion-item style="width: 100%;">
                    <ion-label position="floating"> {{$t('frontend.home.eventType')}}</ion-label> 
                    <ion-select interface="popover" icon="add" style="text-align: left; float: none;    max-width: 100%;"
                        class="subtitles-order"
                        v-if="configuration.cateringEvents.length > 0"
                        :ok-text="$t('backoffice.form.messages.buttons.ok')"
                        :cancel-text="$t('backoffice.form.messages.buttons.dismiss')" 
                        :placeholder="$t('frontend.home.eventType')" 
                        :value="event"                           
                        @ionChange="event = $event.target.value" >
                            <ion-select-option v-for="eve in configuration.cateringEvents"                    
                                    :key="eve" 
                                    :value="eve" > {{eve}}
                            </ion-select-option>
                            <!-- <ion-select-option value="other" >
                                    <ion-label >{{$t('frontend.order.other')}}</ion-label>                                           
                            </ion-select-option> -->
                    </ion-select>                                    
                    <ion-input  type="text" 
                        v-if="event !=='' && (configuration.cateringEvents.findIndex(t => (t) === (event)) === -1)"
                        style="text-align:center; border: 1px solid grey;"                                             
                        @change="event = $event.target.value " 
                        :value="event"                          
                    ></ion-input> 
                </ion-item> 

                <ion-item style="width: 100%;">
                    <ion-label position="floating"> {{$t('frontend.order.guessNumber')}}</ion-label> 
                    <ion-input type="number" :value="numberOfGuess" @input="numberOfGuess = $event.target.value"  style=" float: left;text-align: left;"></ion-input>                               
                </ion-item> 
                
                    <ion-item style="width: 100%;">
                    <ion-label position="floating">  {{$t('frontend.order.eventDate')}} </ion-label> 
                     <ion-datetime :value="eventDate"   @ionChange="eventDate=$event.target.value" ></ion-datetime>
                </ion-item> 

                <ion-item style="width: 100%;">
                    <ion-label position="floating">{{$t('frontend.order.eventStartHour')}} </ion-label> 
                    <ion-datetime :value="eventTimeStart" @ionChange="eventTimeStart = $event.target.value"   display-format="h:mm A"  style=" float: left;text-align: left;"></ion-datetime>                               
                </ion-item>

                <ion-item style="width: 100%;">
                    <ion-label position="floating"> {{$t('frontend.order.eventEndHour')}} </ion-label> 
                    <ion-datetime :value="eventTimeEnd" @ionChange="eventTimeEnd = $event.target.value" display-format="h:mm A"   style=" float: left;text-align: left;"></ion-datetime>                               
                </ion-item> 

                <div style="    text-align: center;">
                <ion-button fill="outline" @click="saveEventDetail()" >{{i18n.t('frontend.home.acept')}}</ion-button>
            </div>                       
                
            </div>

            <div style="    text-align: center;">
                <ion-button fill="outline" @click="saveGuess()" v-if="clientId ==='' && !isCatering">{{i18n.t('frontend.home.acept')}}</ion-button>
            </div>
         
        </ion-card>
        
    </div>
</template>

<script>

import { EventBus } from '../event-bus';
import store from '../../main'
import {i18n} from '@/plugins/i18n'
import { parsePhoneNumber } from 'libphonenumber-js'
 import orderType from '../components/selectOrderType'
 import Moment from 'moment'
 import moment from 'moment-timezone';
 import { Commons } from '../commons';

export default {
  name: 'Guess',
  props: { 
       isCatering: {type: Boolean, default: false } ,
   },
  created: async function(){ 
      this.staffName = this.$store.state.staffName || '';
    
    this.i18n = i18n; 
    this.order = store.state.order;
    this.configuration = this.$store.state.configuration;
    this.restaurantActive = store.state.restaurantActive;
    

    this.customerUpdated();

    EventBus.$on('updateCustomer', (value) => {value; this.customerUpdated(); });

    
     if(this.order.CateringEvent)
        this.event = this.order.CateringEvent;
    if(this.order.NumberOfGuess)
        this.numberOfGuess = this.order.NumberOfGuess;
    if(this.order.EventName)
       this.eventName = this.order.EventName;
   if(this.order.EventDate)  
        this.eventDate =  moment.tz(this.order.EventDate, moment.tz.guess()).format('MM-DD-YYYY')
    else{
        this.eventDate = moment.tz(moment.tz.guess()).format('MM-DD-YYYY');
        if(this.isCatering)    
            this.eventDate = moment(this.eventDate, "MM-DD-YYYY").add('days', this.configuration.cateringMarginDays);
    }
    if(this.order.EventTimeStart)
        this.eventTimeStart =  moment.tz(this.order.EventTimeStart, moment.tz.guess());
    if(this.order.EventTimeEnd)
        this.eventTimeEnd =  moment.tz(this.order.EventTimeEnd , moment.tz.guess());

  },
  data() {
    return { 
        staffName :'',
        order: {},     
        configuration: {},    
        i18n: {},
        restaurantActive: {},        
        clientId: '',
        CustomerName: '', 
        email: '', 
        phone: '',  
        key: 0,
        event:'',
        numberOfGuess: 0,
        eventName: '',
        eventDate: moment.tz(moment.tz.guess()).format('YYYY-MM-DD'),
        eventTimeStart: '',
        eventTimeEnd: '',
    }
  },
  methods: {
      customerUpdated(){       
        this.clientId= store.state.guess._id || '';
        this.CustomerName= store.state.guess.Name || '';
        this.email= store.state.guess.EmailAddress || '';
        this.phone= store.state.guess.Phone || '';        
        this.key ++;   
        
    },

     validateEmail(){
        let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
        if (emailRegex.test(this.email) == false){
            this.email = '';
            return this.alertEmailNotValid();
        }
               
    },

  

    alertEmailNotValid(){
        this.email =''
        return  this.$ionic.alertController
        .create({
            cssClass: 'my-custom-class',
            header: 'Error',
            message: this.i18n.t('frontend.home.notValidEmail') , 
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
        if (!phone) return true;        
        try {
            const number = parsePhoneNumber(`+1${phone}`);
       
            if (!number.isValid())  return false;         
                 
            this.phone = parsePhoneNumber(`+1${phone}`).formatNational();
            return true;
        } 
        catch (err) {     
            return false;
        } 
    },

    saveGuess(){
        if(this.order.OrderType){
            if(this.order.OrderType !== 'On Table')
                if(this.CustomerName ==='' || this.email==='' || this.phone ==='') 
                    return this.alertRequiredDatas();
        }
        else if(this.CustomerName ==='' || this.email==='' || this.phone==='') 
            return this.alertRequiredDatas();
        
          
            
        const guess = {
            _id: this.clientId,
            Name: this.CustomerName,
            EmailAddress: this.email,
            Phone: this.phone,
        }

        store.commit('setGuess', guess);
        Commons.alertSubscription(this.email,this.CustomerName, this.phone); 
        this.openToast();
        
    },

    async openToast() {      
      return this.$ionic.toastController      
        .create({
          message: this.i18n.t('frontend.product.massageToast'),
          duration: 2000,
          position: 'top',
          color:'success'
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

     alertRequiredDatas(){
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: 'Error',
          message: this.i18n.t('frontend.home.errorRequired'),
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

    saveEventDetail(){

        if(this.event !='')
            this.order.CateringEvent = this.event;  
        if(this.numberOfGuess > 0)
            this.order.NumberOfGuess = this.numberOfGuess;
        if(this.eventName !== '')
            this.order.EventName = this.eventName;
       if(this.eventDate !== '')
            this.order.EventDate =  Moment(this.eventDate).toISOString();
        if(this.eventTimeStart !== '')
            this.order.EventTimeStart = Moment(this.eventTimeStart).toISOString();
        if(this.eventTimeEnd !== '')
            this.order.EventTimeEnd =  Moment(this.eventTimeEnd).toISOString();    

         store.commit('setOrder', this.order);
        this.openToast();
    }
  },
  
  }

</script>