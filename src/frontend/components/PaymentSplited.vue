<template>
  <div style="overflow: overlay;padding: 0 25px 0 0;">
    <ion-header color="primary">
      <ion-toolbar  color="primary" >
         <ion-button expand="full" style="float: right;" @click="dismissModal()">
            <span class="iconify" data-icon="ion:close"  ></span></ion-button>
          <ion-button expand="full" style="float: right;" @click="printOrder(order)"  v-if="staffName !==''">
            <span class="iconify" data-icon="ic:round-local-printshop" data-inline="false"></span></ion-button> 
        <p 
          style="text-align: center;padding: 10px;color: white;font-size: 32px; margin:0">
          {{ totalForPay }}: {{getFormatPrice(Total)}}
        </p>      
      </ion-toolbar>
      <ion-toolbar style="display: flow-root;padding: 5px;" color="primary" v-if="!spinner">
            <ion-button @click="changePayment(), cardPay = true" :style="cardPay? 'float: left;border: solid' : 'float: left'"
             v-tooltip="cardPayment"
            :class="cardPay? 'button-menu-hover button button-solid ion-activatable ion-focusable hydrated': 'button-menu button button-solid ion-activatable ion-focusable hydrated'" >
            <span class="iconify" data-icon="ion:card-outline" data-inline="false"></span>
            </ion-button> 

            <ion-button @click="changePayment(), devicePay = true" :style="devicePay? 'float: left;border: solid' : 'float: left'"
              :disabled="spinner"
              v-if="payMethod==='SHIFT4' && staffName !==''"
              v-tooltip="'Device'"             
              :class="devicePay? 'button-menu-hover button button-solid ion-activatable ion-focusable hydrated': 'button-menu button button-solid ion-activatable ion-focusable hydrated'" >
             <span class="iconify" data-icon="emojione-monotone:mobile-phone" data-inline="false"></span>
            
            </ion-button>

             
            <ion-button @click="changePayment(), idtechPay = true" :style="idtechPay? 'float: left;border: solid' : 'float: left'"
              :disabled="spinner"
              v-tooltip="'IDTech'"
              v-if="payMethod==='SHIFT4' && staffName !==''"
              :class="idtechPay? 'button-menu-hover button button-solid ion-activatable ion-focusable hydrated': 'button-menu button button-solid ion-activatable ion-focusable hydrated'" :key="keyShare+3">
            <span class="iconify" data-icon="gg:usb" data-inline="false"></span>           
            </ion-button> 

             <ion-button @click="changePayment(), cashPay = true, printOrder(order)" :style="cashPay? 'float: left;border: solid' : 'float: left'"
              :disabled="spinner"
               v-tooltip="cashPayment"
               v-if="payMethod==='SHIFT4' && staffName !==''"
              :class="cashPay? 'button-menu-hover button button-solid ion-activatable ion-focusable hydrated': 'button-menu button button-solid ion-activatable ion-focusable hydrated'" :key="keyShare+3">
            <span class="iconify" data-icon="ic:baseline-attach-money" data-inline="false"></span>          
            </ion-button> 

          <ion-button  
           @click="changePayment(), qrPay = true"
           v-if="payMethod==='SHIFT4' && staffName!== ''"
            :style="qrPay? 'float: left;border: solid' : 'float: left'"
             v-tooltip="qrPayment"
            :class="qrPay? 'button-menu-hover button button-solid ion-activatable ion-focusable hydrated': 'button-menu button button-solid ion-activatable ion-focusable hydrated'" >
            <span class="iconify" data-icon="ion:qr-code-sharp" data-inline="false"></span>
          </ion-button>

           <ion-button  @click="shareQrPayment()" 
              v-if="payMethod==='SHIFT4' && staffName==='' && returnTo==='ReservationState'"
              :key="keyShare+3"
              :disabled="spinner"
              v-tooltip="'Share Payment'"
               :style="sharePay? 'float: left;border: solid' : 'float: left'"
              :class="sharePay? 'button-menu-hover button button-solid ion-activatable ion-focusable hydrated': 'button-menu button button-solid ion-activatable ion-focusable hydrated'" >
              <ion-spinner v-if="spinnerShare" name="lines"></ion-spinner>
              <span v-if="!spinnerShare" class="iconify" data-icon="fe:share" data-inline="false" ></span> 
            </ion-button>

          <google-pay-split  style="float: left; margin: 2px" 
          v-if="payMethod==='SHIFT4' && staffName==='' && googleData.merchantId"
           v-tooltip="'Google Pay'"
          :Total="parseFloat(this.Total).toFixed(2)"
          :parent="this"
          :googleData="this.googleData"
          :restaurantId="this.restaurantId"
          ></google-pay-split>

      </ion-toolbar>
    </ion-header>

      

      <div v-if="spinner" style="margin: 10px">
          <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
      </div>
    
        <ion-card  v-if="cardPay" class="scroll" style="height: auto" >  

          <ion-item :disabled="spinner? true: false">                  
              <ion-label position="floating">{{firstNameText}} <strong style="color: red">*</strong></ion-label>                               
              <ion-input type="text" required=true  
              class="menu-col-8" 
              :value="firstName" @input="firstName = $event.target.value"
                  ></ion-input>
          </ion-item>    

          <ion-item :disabled="spinner? true: false">
              <ion-label position="floating">{{lastNameText}} <strong style="color: red">*</strong></ion-label>                                          
              <ion-input type="text" required=true  
              class="menu-col-8"
              :value="lastName" @input="lastName = $event.target.value"
                  ></ion-input>
          </ion-item>  

          <ion-item :disabled="spinner? true: false">                     
              <ion-label position="floating">{{addressLine1}} <strong style="color: red">*</strong></ion-label>                                                                      
              <ion-input type="text" required=true  
              class="menu-col-8" 
              :value="address" @input="address = $event.target.value"
                  ></ion-input>
          </ion-item>   

            <ion-item :disabled="spinner? true: false">                  
                <ion-label position="floating">{{postalCode}} <strong style="color: red">*</strong></ion-label>                                                                                                    
                <ion-input type="tel" required=true  :key="key"
                class="menu-col-8" 
                :value="zipCode" @change="zipCode=ValidateCodeInModal( $event.target.value)"
                    ></ion-input> 
            </ion-item>         
              
            <ion-item :disabled="spinner? true: false">                  
                <ion-label position="floating">{{ccard}} <strong style="color: red">*</strong></ion-label>                                                                                                                                
                <ion-input type="tel" required=true autocomplete="cc-number"
                    class="menu-col-8" 
                :value="cardNumber" @input="cardNumber = $event.target.value"
                @change="validateCard($event.target.value)" ></ion-input>
            </ion-item>

            <ion-item :disabled="spinner? true: false">                    
                <ion-label position="floating">{{expcard}} <strong style="color: red">*</strong></ion-label>                                                                                                                                
                <ion-datetime class="menu-col-8"
                display-format="MM-YYYY" :max="dateTodaymax + 6 "  picker-format="MM-YYYY"
                :min="dateTodaymin" required=true @ionChange="expirationCard = $event.target.value"> </ion-datetime>
            </ion-item>

            <ion-item :disabled="spinner? true: false">                 
                <ion-label position="floating">{{ccode}} <strong style="color: red">*</strong></ion-label>                               
                <ion-input type="tel" required=true  
                class="menu-col-8"
                :value="cardCode" @input="cardCode = $event.target.value"
                    ></ion-input>
            </ion-item>

            <ion-toolbar style="display: flow-root;padding: 5px;" color="primary" >
              

              <ion-button :disabled="spinner? true: false"  color="light" @click="dismissModal()">{{Cancel}}</ion-button>
              <ion-button :disabled="spinner? true: false"  color="light"  @click="sendPayment('')">{{payText}}</ion-button>

            </ion-toolbar>

        </ion-card>  

         <ion-card v-if="sharePay"  class="scroll" style="height: auto">
            <div>   
              <h5>{{parent.$t('frontend.payment.verifyMss')}}</h5>
            </div>
          <ion-toolbar  style="display: flow-root;padding: 5px;" color="primary" >  
            <ion-button :disabled="spinner? true: false"   color="light" @click="cancelSharePayment">{{Cancel}}</ion-button>
            <ion-button :disabled="spinner? true: false"  color="light"  @click="validateSharePayment">{{verifyText}}</ion-button>
          </ion-toolbar>
        </ion-card>          

        <div  v-if="qrPay && payMethod==='SHIFT4'"
        name="QR Payment" subtext='<span class="iconify" data-icon="ion:qr-code-sharp" data-inline="false"></span>' >           
            <div  class="scroll" style="height: auto" >
              <qr-modal
              :parent="this.parent"
              :splitOrder="true"
              :order="this.order"      
              :Acept="this.Acept"
              :Cancel="this.Cancel"
              :Total="this.Total"
              :Tax="this.Tax"
              :TaxName="this.TaxName"
              :restaurantId="this.restaurantId"
              :payMethod="this.payMethod"   
              :errorPaymentHeader="this.errorPaymentHeader"
              :errorPaymentMss="this.errorPaymentMss"
              :gooPaymentHeader="this.gooPaymentHeader"
              :gooPaymentMss="this.gooPaymentMss"
              :notValidEmail="this.notValidEmail"
              :codeNotValid="this.codeNotValid"
              :notValidCC="this.notValidCC"
              :dataRequired="this.dataRequired" 
              :paymentByCard="this.paymentByCard"  
              :currency="this.currency"   
              :totalForPay="this.totalForPay" 
              :ccard="this.ccard"
              :expcard="this.expcard" 
              :ccode="this.ccode"  
              :cityText="this.cityText"  
              :stateText="this.stateText"
              :firstNameText="this.firstNameText"
              :lastNameText="this.lastNameText"
              :postalCode="this.postalCode"
              :addressLine1="this.addressLine1"
              :verifyText="this.verifyText"
              :returnTo="this.returnTo"
              :staffName="this.staffName"
              ></qr-modal>
            </div>
        </div>

        <ion-card  v-if="devicePay"  class="scroll" style="height: auto">                 
            <device-payment
              :datas="this.deviceData"
              :grandfather="this.parent.parent"
              :parent="this"
              :deviceTransactionType="this.deviceTransactionType"
            >
            </device-payment> 
        </ion-card>

        <ion-card  v-if="idtechPay"  class="scroll" style="height: auto">                 
            <UsbCardReader
            :parent="this"
            :Acept="this.Acept"
            :Cancel="this.Cancel"
            :ccode="this.ccode" 
            :cityText="this.cityText"  
            :stateText="this.stateText"
            :postalCode="this.postalCode"
            :addressLine1="this.addressLine1"
            :codeNotValid="this.codeNotValid"
            :dataRequired="this.dataRequired"
            ></UsbCardReader>              
            
        </ion-card>

         <ion-card  v-if="cashPay"  class="scroll" style="height: auto">                 
               <UsbCashDoor
               :parent="this"
               :Acept="this.Acept"
               :Cancel="this.Cancel"
               :ccode="this.ccode" 
                :cityText="this.cityText"  
                :stateText="this.stateText"
                :postalCode="this.postalCode"
                :addressLine1="this.addressLine1"
                :codeNotValid="this.codeNotValid"
                :dataRequired="this.dataRequired"
               ></UsbCashDoor> 
         </ion-card>
  </div>
</template>

<script>

import { eye } from "ionicons/icons";
import { addIcons } from "ionicons";
import { Api } from '../../backoffice/api/api'

addIcons({
  "ios-eye": eye.ios,
  "md-eye": eye.md,
});

import { payAuthorizeNet } from '../../backoffice/api/payments.js';
import DevicePayment from '../../backoffice/views/DevicePayment'
import LibCodes from 'zipcodes'
import { parsePhoneNumber } from 'libphonenumber-js'
import moment from 'moment-timezone';
import Moment from 'moment';
import GooglePaySplit from './GooglePay'
import QrModal from './QrPaymentModal'
import { Plugins } from '@capacitor/core';
 const { Share } = Plugins;
 import UsbCardReader from './UsbCardReader'
 import UsbCashDoor from './UsbCashDoor'

export default {
   name: 'PaymentSplitedModal',
   created: function(){
    
   },
   props: {  
    googleData: {type: Object, default: ()=> {}} ,
    order: {type: Object, default:() => {} },      
    parent: {type: Object, default:() => {} },      
    Acept:  {type: String, default:"" } ,
    Cancel:  {type: String, default:"" } ,
    Total:  {type: String, default:"" } ,
    Tax:  {type: String, default:"" } ,
    TaxName:  {type: String, default:"" } ,
    restaurantId:  {type: String, default:"" } ,
    payMethod:  {type: String, default:"" } ,    
    errorPaymentHeader:  {type: String, default:"" } ,
    errorPaymentMss:  {type: String, default:"" } ,
    gooPaymentHeader:  {type: String, default:"" } ,
    gooPaymentMss:  {type: String, default:"" } ,
    notValidEmail:  {type: String, default:"" } ,
    codeNotValid:  {type: String, default:"" } ,
    notValidCC:  {type: String, default:"" } ,
    dataRequired:  {type: String, default:"" } ,   
    paymentByCard:   {type: String, default:"" } ,  
    currency:   {type: String, default:"" } ,  
    totalForPay:   {type: String, default:"" } , 
    ccard: {type: String, default:"" } ,
    expcard: {type: String, default:"" } , 
    ccode:   {type: String, default:"" } , 
    cityText: {type: String, default:"" } ,
    stateText: {type: String, default:"" } ,
    firstNameText: {type: String, default:"" } ,
    lastNameText: {type: String, default:"" } ,
    postalCode: {type: String, default:"" } ,
    addressLine1: {type: String, default:"" } ,
    payText: {type: String, default:"" } ,
    verifyText: {type: String, default:"" } ,
    returnTo:  {type: String, default:"" } ,
    staffName: {type: String, default:"" } ,
    qrPayment: {type: String, default:"" } ,
    cardPayment: {type: String, default:"" } ,
    cashPayment: {type: String, default:"" } ,
    doingPayment: {type: String, default:"" } ,
    deviceTransactionType: {type: String, default:"02" } ,
    deviceData: {type: Object, default: ()=> {}} ,
    shareText1: {type: String, default:"" },
    shareText2: {type: String, default:"" },
    restaurantName: {type: String, default:"" },
    customerName: {type: String, default:"" },
    
  },
  components:{
   QrModal,
   GooglePaySplit,
   DevicePayment,
   UsbCardReader,
   UsbCashDoor
  },
   data () {
    return {                       
        spinner: false ,
        dateTodaymin: new Date().toISOString().substr(0, 7),
        dateTodaymax:  new Date().getFullYear(),
        date: Moment().toISOString(),     
        cardNumber:'',
        cardCode: '',
        expirationCard:'',
        firstName: '',      
        lastName: '',
        zipCode: '',
        address:'',       
        state: '',
        city:'',   
        key: 0, 
        domain: window.location.protocol + '//' + window.location.host,  
         cardPay: true,
        qrPay: false,
        sharePay: false,   
        devicePay: false, 
        idtechPay: false,
        cashPay: false,
        spinnerShare: false, 
        hasQrPayment: '',
        googleKey: 0,
        keyShare: 0,
    }
  }, 
  
   methods: {

    alertRequiredDatas(){
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: 'Error',
          message: this.dataRequired,
          buttons: [                   
          {
              text: this.Acept,
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
                    message: this.notValidCC,
                    buttons: [                   
                    {
                        text: this.Acept,
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

    ValidateCodeInModal(event){
      this.key ++;
    
      var hills = LibCodes.lookup(event);   
      if(!hills){
        this.state = "";
        this.city = "";
        this.zipCode = '';      
        this.alertCodeNotValid();  
        return '';     
      }     
      else{
        this.state = hills.state;
        this.city = hills.city;
        this.zipCode = event;
        
         this.toastCityState();
         return event;
      }      
    },  
   
    alertCodeNotValid(){
    return  this.$ionic.alertController
    .create({
        cssClass: 'my-custom-class',
        header: 'Error',
        message: this.codeNotValid ,
        buttons: [                   
        {
          text: this.Acept,
          handler: () => {                                 
                        
          },
        },
        ],
    })
    .then(a => a.present())
                
  },

    async toastCityState() {
      return this.$ionic.toastController
      
        .create({
          message: `${this.cityText}: ${this.city} | ${this.stateText}: ${this.state}`,
          duration: 2000,
          position: 'top',
          color:'success'
        })
      .then(a => a.present())
    },
    
    alertEmailNotValid(){
    this.email =''
    return  this.$ionic.alertController
    .create({
        cssClass: 'my-custom-class',
        header: 'Error',
        message: this.notValidEmail , 
        buttons: [                   
        {
          text: this.Acept,
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

    async goodPaymentToast() {
      return this.$ionic.toastController      
        .create({
            header: this.gooPaymentHeader,
            message:  this.gooPaymentMss,            
            position: 'middle',
            color:'success',
             buttons: [
            {
              text: 'Done',
              role: 'cancel',
              handler: () => {
              }
            }
          ]
            })
      .then(a => a.present())
    },

    async errorPaymentToast() {
      return this.$ionic.toastController      
        .create({
            header: this.errorPaymentHeader,
            message:  this.errorPaymentMss,            
            position: 'middle',
            color:'danger',
             buttons: [
            {
              text: 'Done',
              role: 'cancel',
              handler: () => {
              }
            }
          ]
            })
      .then(a => a.present())
    },

    async errorPaymentDetail(msg) {
      return this.$ionic.toastController      
        .create({
            header:'Error',
            message:  msg,
            position: 'middle',
            color:'danger',
             buttons: [
            {
              text: 'Done',
              role: 'cancel',
              handler: () => {
              }
            }
          ]
            })
      .then(a => a.present())
    },

    validateEmail(){
         let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
            if (emailRegex.test(this.email) == false){
                this.email = '';
                return this.alertEmailNotValid();
            }               
    },
    
    getFormatPrice(price){
     
      let result = price
      if(this.currency !== '')
       result = new Intl.NumberFormat('en', {style: "currency", currency: this.currency} ).format(price);
      
      
      return result;
    },

    dismissModal(){
         return this.$ionic.modalController.dismiss();
    }, 

    responseIDTEch(response){
      if(response){
          const partOfTotal = this.order.Total / this.Total
          const taxGeneral = (parseFloat(this.order.Taxe) * parseFloat(this.order.SubTotal) )/ 100;
          const tipGeneral =  (parseFloat(this.order.Tip) * parseFloat(this.order.SubTotal) )/ 100;
          const partialTip =  tipGeneral /  partOfTotal;
          const partialTax =  taxGeneral /  partOfTotal;

          const  data =  {         
            restaurantId: this.restaurantId,
            payMethod: this.payMethod,
            total: parseFloat(this.Total).toFixed(2),
            tax:   partialTax,
            tip: partialTip,
            taxName: this.TaxName,         
            products: this.order.Products,
            address: response.address,
            zip: response.zip,
            cardSecurityCode: response.cardSecurityCode,
            p2pe: response.hex
        }
        return this.sendPayment(data);
      }
       
    },
    
    responseGooglePay(response){
      if(response){
          const partOfTotal = this.order.Total / this.Total
          const taxGeneral = (parseFloat(this.order.Taxe) * parseFloat(this.order.SubTotal) )/ 100;
          const tipGeneral =  (parseFloat(this.order.Tip) * parseFloat(this.order.SubTotal) )/ 100;
          const partialTip =  tipGeneral /  partOfTotal;
          const partialTax =  taxGeneral /  partOfTotal;

          const  data =  {         
          restaurantId: this.restaurantId,
          payMethod: this.payMethod,
          total: parseFloat(this.Total).toFixed(2),
          tax:   partialTax,
          tip: partialTip,
          taxName: this.TaxName,         
          products: this.order.Products,
          googlePayToken: response
        }
        return this.sendPayment(data);
      }
       
    },

    async responseDevicePay(response){

       this.$ionic.loadingController
        .create({
          cssClass: 'my-custom-class',
          message:  this.doingPayment,
          backdropDismiss: false
        })
        .then ( loading =>{
                loading.present()
                setTimeout( async() => {
                    try {                                  
                        response.returnTo = this.returnTo;
                        this.parent.makeSplitPayment(response)
                        this.dismissModal();						
                        loading.dismiss();                      
                    } catch (error) {
                       loading.dismiss();
                       return this.errorPaymentDetail(error);   
                    }                   
                })
            })
    },

     async responseCashPayment(response){
      if(response){
         
        this.$ionic.loadingController
        .create({
          cssClass: 'my-custom-class',
          message:  this.doingPayment,
          backdropDismiss: false
        })
        .then ( loading =>{
            loading.present()
            setTimeout( async() => {
                try {
                   const invoiceSequence = await Api.getInvoiceSequence(this.restaurantId)
                  const response1 = {
                          "total": this.Total,
                          "transId": invoiceSequence.data,
                          "accountNumber": '',
                          "expirationCard": '',
                          "accountType": '',
                          "method": 'Cash',
                          "moto": false,
                      }                
                  response1.returnTo = this.returnTo;
                  this.parent.makeSplitPayment(response1)
                  this.dismissModal();						
                  loading.dismiss();
                  
                } catch (error) {
                  loading.dismiss();
                  return this.errorPaymentDetail(error); 
                  
                }
            })
          })
        }

    },

    sendPayment: async function(googleToken){  
      const partOfTotal = this.order.Total / this.Total
      const taxGeneral = (parseFloat(this.order.Taxe) * parseFloat(this.order.SubTotal) )/ 100;
      const tipGeneral =  (parseFloat(this.order.Tip) * parseFloat(this.order.SubTotal) )/ 100;
      const partialTip =  tipGeneral /  partOfTotal;
      const partialTax =  taxGeneral /  partOfTotal;
      
       var data =  {}    
      
      if(googleToken !== ''){
         data = googleToken;
      }
      else{
        if(this.cardNumber ==='' || this.expirationCard === '' || this.cardCode=== ''||
        this.firstName ==='' || this.lastName === '' || this.zipCode=== '' || this.address === '')
            return this.alertRequiredDatas();
        data =  {
          firstName: this.firstName,
          lastName: this.lastName,
          address: this.address,
          zip: this.zipCode,
          restaurantId: this.restaurantId,
          payMethod: this.payMethod,
          total: parseFloat(this.Total).toFixed(2),          
          tax: partialTax,
          tip: partialTip,
          taxName: this.TaxName,
          cardNumber: this.cardNumber,
          cardSecurityCode: this.cardCode,
          cardExpirationDateF1: moment(this.expirationCard).format('MMYY'),
          cardExpirationDateF2: moment(this.expirationCard).format('YYYY-MM'),
          products: this.order.Products,
        }
      } 
      
      data.tax = data.tax.toFixed(2);
      data.tip = data.tip.toFixed(2)
        
      this.$ionic.loadingController
        .create({
          cssClass: 'my-custom-class',
          message:  this.doingPayment,
          backdropDismiss: false
        })
        .then ( loading =>{
                loading.present()
                setTimeout( async() => {
                    try {
                       var response = await payAuthorizeNet.payOrder(data);                
                        response.returnTo = this.returnTo;
                        this.parent.makeSplitPayment(response)
                        this.dismissModal();						
                        loading.dismiss();
                      
                    } catch (error) {
                       loading.dismiss();
                       return this.errorPaymentDetail(error);   
                    }
                   
                })
            })

    },



     changePayment(){
      this.cardPay = false;
      this.qrPay = false;
      this.sharePay= false;
      this.checkPay = false;
      this.devicePay = false;
      this.idtechPay= false;
      this.cashPay = false;
    },

    shareQrPayment: async function(){

      this.keyShare ++;
      this.changePayment();
      this.sharePay = true;
      this.spinnerShare = true; 
          

      const data = {
          total: this.Total,
          tax: 1,
          tip: 0,
          payMethod: this.payMethod,
          restaurantId: this.restaurantId,
          saleFlag: 'S'
      }
      if(this.order.Taxe){
         data.tax = (parseFloat(this.order.Taxe) * parseFloat(this.order.SubTotal) )/ 100;
          data.tip =  (parseFloat(this.order.Tip) * parseFloat(this.order.SubTotal) )/ 100;
      }
      data.tax = data.tax.toFixed(2);
      data.tip = data.tip.toFixed(2);
     
     try {       
        var response = await payAuthorizeNet.payQrOrder(data); 
        if(response !=='Error'){
           this.hasQrPayment = response; 
          await Share.share({
            title: `${this.customerName}${this.shareText1}${this.restaurantName} (${this.getFormatPrice(this.Total)})${this.shareText2}`,
            url: this.hasQrPayment,
            dialogTitle: `${this.customerName}${this.shareText1}${this.restaurantName}  (${this.getFormatPrice(this.Total)})${this.shareText2}`,
          });   
          this.spinnerShare = false;
        } 
         else {
          this.spinnerShare = false;
          this.paymentError('Try another payment method.'); 
        }      
              
       
     } catch (error) {
      this.spinnerShare = false;
       console.log(error)
       this.paymentError(error);       
     }
  
    },

    validateSharePayment: async function(){
      this.spinner = true;
      const data = {
          qrCode: this.hasQrPayment,
          payMethod: this.payMethod,
          restaurantId: this.restaurantId,
      }  
     try {  

      var response = await payAuthorizeNet.validateStatusQrOrder(data);  
      let mss = this.parent.$t('frontend.payment.goodPayment') +': '+ this.getFormatPrice(response.total);
      mss += ' TransId: ' + response.transId; 
      this.paymentSuccessfull(mss)    
      this.spinner = false; 
      response.returnTo = this.returnTo;      
      this.parent.makeSplitPayment(response);
      return this.dismissModal();

    } catch (error) {
      this.spinner = false;
      this.paymentError(error);
    }
  },

    cancelSharePayment: async function(){
      this.spinner = true;
      const data = {
          qrCode: this.hasQrPayment,
          payMethod: this.payMethod,
          restaurantId: this.restaurantId,
      }  
      try {  
        await payAuthorizeNet.cancelStatusQrOrder(data);       
        this.paymentSuccessfull('cancelado correctamente')     
        this.spinner = false;      
        return this.dismissModal();

      } catch (error) {
        this.spinner = false;
        this.paymentError(error);
      }
    },

    async paymentSuccessfull(message) {
      return this.$ionic.toastController
      
        .create({
          message: message,
          // duration: 2000,
          position: 'top',
          color:'success',
           buttons: [
            {
              text: 'Done',
              role: 'cancel',
              handler: () => {
              }
            }
          ]
        })
      .then(a => a.present())
    },

    async paymentError(message) {
      return this.$ionic.toastController
    
      .create({
        message: message,
        position: 'top',
        color:'danger',
         buttons: [
            {
              text: 'Done',
              role: 'cancel',
              handler: () => {
              }
            }
          ]
      })
    .then(a => a.present())
  },

     async htmlToUse(order){

        const partOfTotal = order.Total / this.Total
        const taxGeneral = (parseFloat(order.Taxe) * parseFloat(order.SubTotal) )/ 100;
        const tipGeneral =  (parseFloat(order.Tip) * parseFloat(order.SubTotal) )/ 100;
        const partialTip =  tipGeneral /  partOfTotal;
        const partialTax =  taxGeneral /  partOfTotal;

      let totalWithoutQuotation = 0;
      if(order.QuotationPayment)        
            totalWithoutQuotation = this.Total - order.QuotationPayment;
        else
            totalWithoutQuotation = this.Total;

       var date = moment.tz(order.Date, moment.tz.guess()).format('MM-DD-YYYY hh:mm A');
        if(order.OrderForCatering === true)
          date = moment.tz(order.DateToPick, moment.tz.guess()).format('MM-DD-YYYY') + ' ' +  moment.tz(order.HourToPick, moment.tz.guess()).format('hh:mm A') ;
       
    


        

    

      

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
        html += `<h2>${this.restaurantName}</h2>  `;          
        html +=`</td>`;     
        html += `</tr>`;          
        html += '<tr><td colspan=6 >'       
        html += `<h4>Date: ${date} </h4><hr>`;
        html += `<h4>Customer: ${order.CustomerName} </h4>`;
        html += `<h4>Phone: ${order.CustomerPhone} </h4>`;   
       
        html += '<hr>';  
        html += '<br>'; 
        html += `<tr><br><td colspan=6 style="border-top: 1px solid black;"><h4 ><strong>Items</strong></h4></td></tr> <tr></tr>`;
        for(var i = 0; i<order.Products.length ; i++){
            html += `<tr ><td  colspan=4 style="width: 50%;border-bottom: 1px solid #dbd1d1;" ><strong >${order.Products[i].Name}</strong>` ;
            if(order.Products[i].Note !='')
                html +=`<p style="background: #f1f1004d;">${order.Products[i].Note}</p> `;
            html +=`</td><td style="width: 25%;border-bottom: 1px solid #dbd1d1;" > <p >( ${order.Products[i].Cant} X ${this.getFormatPrice(order.Products[i].Price)})</p> </td>`;
            html += `<td style="width: 25%;border-bottom: 1px solid #dbd1d1;"> <p >${ this.getFormatPrice( order.Products[i].Price * order.Products[i].Cant )}</p> </td>`;
            html += `</tr>`;
           if(order.Products[i].Aggregates.length > 0){
                html +=`<tr style="padding: 20px 35px;"> Free Sides: ${order.Products[i].CantAggr=order.Products[i].AggregatesCant * order.Products[i].Cant} </tr>`;

                 for(var a=0; a<order.Products[i].Aggregates.length; a++){
                    let agg = order.Products[i].Aggregates[a]
                    html += `<tr ><td  colspan=4 style="width: 50%;border-bottom: 1px solid #dbd1d1;" ><p style="padding-left: 20px;">${agg.Name} <br>${this.getFormatPrice(agg.SalePrice)}</p>` ;
                    html +=`</td><td style="width: 25%;border-bottom: 1px solid #dbd1d1;" > <p > ${agg.Cant}</p> </td>`;
                    html += `<td style="width: 25%;border-bottom: 1px solid #dbd1d1;"> <p > ${ this.getFormatPrice( agg.AllTotal ) }</p> </td></tr >`;            
                 }
            }
            
        }
       
        if(order.OtherCharges.length >0){
            html += `<tr ><td colspan=6 ><h4 ><strong>Other Charges</strong></h4></td></tr>`;
            for(var e = 0; e< order.OtherCharges.length ; e++){
                html += ` <tr ><td colspan=5 style="width: 75%;border-bottom: 1px solid #dbd1d1;"><p >${order.OtherCharges[e].Name}</p></td> <td style="border-bottom: 1px solid #dbd1d1;"> <p>${this.getFormatPrice(order.OtherCharges[e].Price)}</p></td></tr>`;
            }
        }
       
        
        html += `<tr ><td colspan=5 ><br><p ><strong>Subtotal</strong></p></td> <td ><br> <p >${this.getFormatPrice(order.SubTotal)}</p></td></tr>`;      
       html += `<tr><td  colspan=5 ><p  ><strong>Taxes ${order.Taxe}%</strong></p></td> <td > <p >${ this.getFormatPrice(partialTax) } </p> </td></tr>`;      
        if(order.OrderType == 'Delivery' && order.Shipping)
            html +=  `<tr ><td colspan=5  ><p  ><strong>Deliver</strong></p></td><td  ><p >${this.getFormatPrice(order.Shipping)}</p></td></tr>`;
        if(order.Tip)
            html += `<tr ><td  colspan=5 ><p ><strong>Tip ${order.Tip}%</strong></p></td><td ><p>${ this.getFormatPrice(partialTip) } </p> </td></tr>`;
        html += `<tr><td colspan=5 style="border-bottom: 1px solid #dbd1d1;"><p  ><strong>Total </strong></p></td> <td style="border-bottom: 1px solid #dbd1d1;"> <strong > ${this.getFormatPrice(this.Total)}</strong> </td></tr>`;
        
        if(order.QuotationPayment)
          html += `<tr style="border-bottom: 1px solid #399922;"><td colspan=5 ><p  ><strong>Quotation</strong></p></td> <td > <strong >${this.getFormatPrice(order.QuotationPayment)}</strong> </td></tr>`;
        if(order.PendingPayment)
          html += `<tr style="border-bottom: 1px solid #ff5500;"><td colspan=5 style="border-bottom: 1px solid #ff5500;"><p  ><strong>Pending</strong></p></td> <td  style="border-bottom: 1px solid #ff5500;"> <strong >${this.getFormatPrice(order.PendingPayment)}</strong> </td></tr>`;
        if(order.PendingPayment > 0 && order.Deadline){
            html += `<tr ><td colspan=6 ><h4 ><strong>Parcial Payment</strong></h4></td></tr>`;
            for(var dead = 0; dead < order.Deadline.length ; dead ++){
                html += ` <tr ><td colspan=3 style="border-bottom: 1px solid #dbd1d1;"><p >${order.Deadline[dead].Date}  </p></td> `
                html += ` <td colspan=3 style="border-bottom: 1px solid #dbd1d1;"><strong >  ${order.Deadline[dead].Percent}%  =  ${ this.getFormatPrice((totalWithoutQuotation * order.Deadline[dead].Percent) / 100)}</strong></td> `
                if(order.Deadline[dead].State === 1)
                html += ` <td style="border-bottom: 1px solid #dbd1d1;"> <strong  style= "color: #399922;  ">Payed</strong></td>`;
                else html += ` <td style="border-bottom: 1px solid #dbd1d1;"><strong  style= "color: #ff5500; ">Pending</strong> </td>`;
                html += ` </tr>`;
            }
          }        
        if(order.Note)
            html += `<tr ><td style="width: 20%;border-bottom: 1px solid grey;"><h4 >Notes</h4></td><td colspan=5 style="width: 80%;border-bottom: 1px solid grey;" ><p >${order.Note}</p></td></tr>`;
        html += '<tr><td colspan=6 style=" text-align: center;">';
        html += `<h2>${this.restaurantName}</h2>  `;      
        if(this.restaurantWeb)  
            html += `<h4>${this.restaurantWeb}  </h4>`;   
        html +=`</td>`;     
        html += `</tr>`;       
        html += `</table></div></body></html>`;
        return html;
    },

   async printOrder(order){
        
        var html = await this.htmlToUse(order)
        
          var winimp = window.open('/print', 'popimpr');
          winimp.document.open();
          winimp.document.write( html );
          winimp.document.close();
          winimp.focus();
          winimp.print();
          winimp.close();

   },

   

  
}, 
  

}
</script>

<style>

.shapla-toggle-panel--boxed-mode {
    border-style: solid;
    margin-bottom: 0em;
    margin-top: 0em;
    cursor: pointer;
}
  .shapla-toggle-panel__title{
    display: flex;
  }

  .scroll {
      overflow-y: scroll;
    }

     .button-menu {  
       float: left;
    border: 0px;
    border-radius: 4px;
    box-shadow: rgb(60 64 67 / 30%) 0px 1px 1px 0px, rgb(60 64 67 / 15%) 0px 1px 3px 1px;
    cursor: pointer;
    height: 40px;
    min-height: 40px;
    padding: 11px 5px;   
    --background: white;
    --background-hover:  white;
    background: white;
    --box-shadow: 0;
    margin: 2px;
    --color: black
}

.button-menu-hover{    
  --background: #f8f8f8;
  background: #f8f8f8;
  --background-hover:  #f8f8f8;
  --box-shadow: 0;
        float: left;
    border: 0px;
    border-radius: 4px;
    box-shadow: rgb(60 64 67 / 30%) 0px 1px 1px 0px, rgb(60 64 67 / 15%) 0px 1px 3px 1px;
    cursor: pointer;
    height: 40px;
    min-height: 40px;
    padding: 11px 5px;
    margin: 2px;
     --color: black
} 

.gpay-button.short, .gpay-button.plain {
    min-width: 90px;
    width: 135px;
}
</style>