<template>
  <div>  
    
    <div class="ion-padding">  

       <qrcode-vue v-if="hasQrPayment !=='' && staffName!== ''"
        :value="hasQrPayment" 
        :size=200 level="H" 
        style="text-align: center;padding: 5px 20px;" >
      </qrcode-vue>

     

        

        <div style="padding: 20px 15px; text-align: center">

          <ion-button :disabled="spinner1? true: false"  fill="outline" @click="cancelQrPayment">{{Cancel}}</ion-button>
          <ion-button :disabled="spinner1? true: false" fill="outline"  @click="validateQrPayment">{{verifyText}}</ion-button>

          <div v-if="spinner1" style="margin: 10px">
              <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
          </div>

        </div>

       
    </div>
  </div>
</template>

<script>

import { eye } from "ionicons/icons";
import { addIcons } from "ionicons";
// import { EventBus } from '../event-bus';
import { Plugins } from '@capacitor/core';
 const { Share } = Plugins;




addIcons({
  "ios-eye": eye.ios,
  "md-eye": eye.md,
});

import { payAuthorizeNet } from '../../backoffice/api/payments.js';
import Moment from 'moment';
import QrcodeVue from 'qrcode.vue';

export default {
   name: 'PaymentModal',
   created: function(){
      this.getQrPayment();

    
   },
   props: { 
    splitOrder: {type: Boolean, default: false},    
    staffName:   {type: String, default:"" } ,
    RestaurantName:   {type: String, default:"" } ,
    parent: {type: Object, default:() => {} },       
    order: {type: Object, default:() => {} },       
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
    ccard: {type: String, default:"" } ,
    expcard: {type: String, default:"" } , 
    ccode:   {type: String, default:"" } , 
    cityText: {type: String, default:"" } ,
    stateText: {type: String, default:"" } ,
    firstNameText: {type: String, default:"" } ,
    lastNameText: {type: String, default:"" } ,
    postalCode: {type: String, default:"" } ,
    addressLine1: {type: String, default:"" } ,
    verifyText: {type: String, default:"" } ,
    returnTo:  {type: String, default:"" } ,
    isTicket: {type: Boolean, default: false } ,
  },
  components:{
    QrcodeVue
  },
   data () {
    return {                       
        spinner: false ,
        spinner1: false,           
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
        hasQrPayment: '',   
        CustomerName: '',
    }
  }, 
  
   methods: {


    async goodPaymentToast() {
      return this.$ionic.toastController      
        .create({
            header: this.gooPaymentHeader,
            message:  this.gooPaymentMss,
            duration: 2000,
            position: 'middle',
            color:'success'
            })
      .then(a => a.present())
    },

    async errorPaymentToast() {
      return this.$ionic.toastController      
        .create({
            header: this.errorPaymentHeader,
            message:  this.errorPaymentMss,
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

    getFormatPrice(price){
      let result = price
      if(this.currency !== '')
       result = new Intl.NumberFormat('en', {style: "currency", currency: this.currency} ).format(price);
      return result;
    },

    dismissModal(){
         return this.$ionic.modalController.dismiss()
    },

    getQrPayment: async function(){

      this.spinner1 = true;

      const data = {
          total: this.Total,
          tax: (parseFloat(this.order.Taxe) * parseFloat(this.order.SubTotal) )/ 100,
          tip: (parseFloat(this.order.Tip) * parseFloat(this.order.SubTotal) )/ 100,
          payMethod: this.payMethod,
          restaurantId: this.restaurantId,
      }

      data.saleFlag = 'S'
      if(this.isTicket) data.saleFlag = 'A'
     
     
     try {
       
        var response = await payAuthorizeNet.payQrOrder(data); 
        if(response)  {
          this.hasQrPayment = response;
          this.spinner1 = false;  
        } 
        else{
           this.spinner1 = false;
           this.paymentError('Try another payment method.')
        }   
          
       
     } catch (error) {
      this.spinner1 = false;
       console.log(error)
       
     }
  },

  validateQrPayment: async function(){

    this.spinner1 = true;

    const data = {
        qrCode: this.hasQrPayment,
        payMethod: this.payMethod,
        restaurantId: this.restaurantId,
    }  
     try {  

      var response = await payAuthorizeNet.validateStatusQrOrder(data);
       let mss = 'Paid: '+ this.getFormatPrice(response.total);
       mss += ' TransId: ' + response.transId;        
      this.paymentSuccessfull(mss)     
      this.spinner1 = false; 
      response.returnTo = this.returnTo;
      if(!this.splitOrder) this.parent.recivePayment(response);
      else this.parent.makeSplitPayment(response)
      return this.dismissModal();

    } catch (error) {
      this.spinner1 = false;
      this.paymentError(error);
    }
  },

  cancelQrPayment: async function(){

    this.spinner1 = true;

    const data = {
        qrCode: this.hasQrPayment,
        payMethod: this.payMethod,
        restaurantId: this.restaurantId,
    }  
     try {  

      await payAuthorizeNet.cancelStatusQrOrder(data);   
      this.paymentSuccessfull('cancelado correctamente')     
      this.spinner1 = false;      
      return this.dismissModal();

    } catch (error) {
      this.spinner1 = false;
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
                console.log('Cancel clicked');
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
        duration: 2000,
        position: 'top',
        color:'danger'
      })
    .then(a => a.present())
  },

 async sharePayment(){ 
    try {
        await Share.share({
        title: `Sharing ${this.order.CustomerName}'s payment at the ${this.RestaurantName} restaurant`,
        url: this.hasQrPayment,
        dialogTitle: 'Test'
      });
    } catch (error) {
       this.paymentError(error);   
    }
     
    }
      
}, 
  

}
</script>