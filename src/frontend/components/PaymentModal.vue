<template>
  <keep-alive>
     <div style="overflow: overlay;padding: 0 25px 0 0; display: inherit;">
        <ion-header >
          
         
      
          <ion-toolbar color="primary" >
             <ion-button expand="full" style="float: right;" @click="dismissModal()">
            <span class="iconify" data-icon="ion:close"  ></span></ion-button>
            <ion-button expand="full" style="float: right;" @click="printOrder(order)"  v-if="staffName !==''">
              <span class="iconify" data-icon="ic:round-local-printshop" data-inline="false"></span></ion-button> 
            <p 
              style="text-align: center;padding: 10px;color: white;font-size: 32px; margin:0">
              {{ totalForPay }}: {{getFormatPrice(Total)}} 
            </p>
            <ion-item color="primary" v-if="canSplitPayment"  style="display: inline-block;">
              <strong v-if="!spinner" style="color: white;">{{parent.$t('frontend.payment.splitPayment')}}</strong>                              
              <ion-toggle  v-if="!spinner" color="secondary" @ionChange="split= !split"  :checked ="split"></ion-toggle>    
            </ion-item>
            
          </ion-toolbar>          
        </ion-header>
         
        <div v-if="split && canSplitPayment">
          
          <ion-card>           
            <ion-item>           
                                    
                <div class="ion-text-wrap menu-col-4" style="text-align: center;">
                    <ion-label>{{parent.$t('frontend.payment.splitIn')}}</ion-label>
                </div>
                <div class="ion-text-wrap menu-col-4" >
                    <ion-input type="number" style="text-align: center;width: 60%;float: left;" min="2" max="4" 
                    :key="keySplit"                     
                    :disabled="readyButton? true : false || readyPayment? true : false" 
                    @input="$event.target.value > 0 ? defaultSlplit = $event.target.value : defaultSlplit = 2" 
                    :value="defaultSlplit"                      
                     @change="validateSplitCant($event.target.value)"                                        
                    ></ion-input>
                </div> 

                <div class="ion-text-wrap menu-col-4" style="text-align: center;" v-if="!readyPayment">
                   <ion-spinner v-if="readyButton"></ion-spinner>
                    <ion-button color="success" @click="readySplitButton()" v-if="!readyButton" :disabled="!readySplit" :key="keyValidateCount + 1">
                      <span class="iconify" data-icon="ion:checkmark-done-sharp" data-inline="false" style="margin:0;width: 20px;height: 20px;"></span>
                      {{Acept}}</ion-button>
                </div>          

            </ion-item>
          </ion-card>

          <ion-label v-if="!readySplit" :key="keyValidateCount" color="danger" style="font-weight: 600">
            <span class="iconify" data-icon="el:error-alt" data-inline="false" style="color: red; margin: 5px 0 0 15px; width: 18px;height: 18px;"></span>
             {{parent.$t('frontend.payment.splitMss')}}</ion-label>

          <ion-card :key="keySplit+'D'">         
            <ion-item v-for="(splitIndex, Index) of arraySplit" v-bind:key="Index" >           
                                    
                <div class="ion-text-wrap menu-col-4" style="text-align: center;">
                    <ion-label>{{parent.$t('frontend.payment.splitPay')}} {{Index + 1}}</ion-label>
                </div>             
                <div class="ion-text-wrap menu-col-4" >
                    <ion-input type="number" style="text-align: center;width: 60%;float: left;" min="2" 
                    :key="Index"                                                          
                    :readonly="readyPayment ? true: false"
                    @change="updateArraySplit(Index , $event.target.value )"   
                    :value="splitIndex.total"   
                                                                           
                    ></ion-input>
                </div>
                
                 <div class="ion-text-wrap menu-col-4" style="text-align: center;" v-if="order.Payment[Index].state === 0 && readyPayment">
                    <ion-button color="primary" @click="paySplit(Index, splitIndex.total)">
                      <span class="iconify" data-icon="ion:logo-usd" data-inline="false" style="margin:0;width: 20px;height: 20px;"></span>
                      {{parent.$t('frontend.payment.splitToPay')}}</ion-button>
                </div>
               
                <div class="ion-text-wrap menu-col-4" style="text-align: center;" v-if="order.Payment[Index].state===1 && readyPayment">
                    <ion-button color="success" :key="order.Payment[Index].state">
                      <span class="iconify" data-icon="ion:checkmark-done-sharp" data-inline="false" style="margin:0;width: 20px;height: 20px;"></span>
                      {{parent.$t('frontend.payment.splitPayed')}}</ion-button>
                </div>  

                      

            </ion-item>
          </ion-card>
        </div>

        <div v-if="!split" >

         <ion-toolbar style="display: flow-root;padding: 5px;" color="primary" v-if="!spinner">
            <ion-button @click="changePayment(), cardPay = true" :style="cardPay? 'float: left;border: solid' : 'float: left'" 
              :disabled="spinner"
              v-tooltip="parent.$t('frontend.payment.tjtPayment')"
              :class="cardPay? 'button-menu-hover button button-solid ion-activatable ion-focusable hydrated': 'button-menu button button-solid ion-activatable ion-focusable hydrated'" :key="keyShare">
              <span class="iconify" data-icon="ion:card-outline" data-inline="false"></span>            
            </ion-button> 

           
            <ion-button @click="changePayment(), devicePay = true" :style="devicePay? 'float: left;border: solid' : 'float: left'" 
              :disabled="spinner"
               v-tooltip="parent.$t('frontend.payment.devicePayment')"
               v-if="(payMethod==='SHIFT4' || payMethod==='TSYS' ) && staffName !==''"
              :class="devicePay? 'button-menu-hover button button-solid ion-activatable ion-focusable hydrated': 'button-menu button button-solid ion-activatable ion-focusable hydrated'" :key="keyShare+1">
             <span class="iconify" data-icon="emojione-monotone:mobile-phone" data-inline="false"></span>            
            </ion-button> 

              <!-- -->
            <ion-button @click="changePayment(), idtechPay = true" :style="idtechPay? 'float: left;border: solid' : 'float: left'"  
              :disabled="spinner"
               v-tooltip="parent.$t('frontend.payment.idtechPayment')"
               v-if="payMethod==='SHIFT4' && staffName !==''"
              :class="idtechPay? 'button-menu-hover button button-solid ion-activatable ion-focusable hydrated': 'button-menu button button-solid ion-activatable ion-focusable hydrated'" :key="keyShare+3">
            <span class="iconify" data-icon="gg:usb" data-inline="false"></span>        
            </ion-button> 

            
         

             <ion-button @click="changePayment(), cashPay = true, printOrder(order)" :style="cashPay? 'float: left;border: solid' : 'float: left'"
              :disabled="spinner"
               v-tooltip="parent.$t('frontend.payment.cashPayment')"
               v-if="staffName !==''"
              :class="cashPay? 'button-menu-hover button button-solid ion-activatable ion-focusable hydrated': 'button-menu button button-solid ion-activatable ion-focusable hydrated'" :key="keyShare+3">
            <span class="iconify" data-icon="ic:baseline-attach-money" data-inline="false"></span>          
            </ion-button> 

             <ion-button @click="changePayment(), swipePay = true" :style="cashPay? 'float: left;border: solid' : 'float: left'"
              :disabled="spinner"
               v-tooltip="parent.$t('frontend.payment.swipePayment')"
               v-if="payMethod==='TSYS' && staffName !==''"
              :class="swipePay? 'button-menu-hover button button-solid ion-activatable ion-focusable hydrated': 'button-menu button button-solid ion-activatable ion-focusable hydrated'" :key="keyShare+3">
              <span class="iconify" data-icon="wpf:bank-cards" data-inline="false"></span>
            </ion-button> 

            
              <ion-button  @click="changePayment(), qrPay = true"  
              :disabled="spinner"
               v-if="payMethod==='SHIFT4' && staffName!== ''"
               v-tooltip="parent.$t('frontend.payment.qrPayment')"
              :style="qrPay? 'float: left;border: solid' : 'float: left'"
              :class="qrPay? 'button-menu-hover button button-solid ion-activatable ion-focusable hydrated': 'button-menu button button-solid ion-activatable ion-focusable hydrated'" :key="keyShare+3">
                <span class="iconify" data-icon="ion:qr-code-sharp" data-inline="false"></span>              
              </ion-button>

            
              <ion-button  @click="shareQrPayment()"  
                v-if="payMethod==='SHIFT4' && staffName==='' && !isCatering"
                :key="keyShare+4"
                :disabled="spinner"
                v-tooltip="parent.$t('frontend.payment.sharePayment')"
               :style="sharePay? 'float: left;border: solid' : 'float: left'"
                :class="sharePay? 'button-menu-hover button button-solid ion-activatable ion-focusable hydrated': 'button-menu button button-solid ion-activatable ion-focusable hydrated'" >
                <ion-spinner v-if="spinnerShare" name="lines"></ion-spinner>
                <span v-if="!spinnerShare" class="iconify" data-icon="fe:share" data-inline="false" ></span> 
              </ion-button>

            
              <ion-button   @click="changePayment(), checkPay = true" 
                v-if="isCatering"
                :disabled="spinner"
                v-tooltip="parent.$t('frontend.payment.checkPayment')"
                style="float: left;" 
                :style="checkPay? 'float: left;border: solid' : 'float: left'"
                :class="checkPay? 'button-menu-hover button button-solid ion-activatable ion-focusable hydrated': 'button-menu button button-solid ion-activatable ion-focusable hydrated'" :key="keyShare+5">
                <span class="iconify" data-icon="la:money-check-alt" data-inline="false" style="width: 40px;height: 40px;"></span>
              </ion-button>
          
          
             <google-pay   v-if="payMethod==='SHIFT4' && staffName==='' && googleData.merchantId"
             @click="changePayment()"
             :keyGoogle="this.keyGoogle"
              v-tooltip="'Google Pay'"
             :disabled="spinner"   
              style="float: left; margin: 2px" 
              :Total="this.Total"
              :parent="this"
              :googleData="this.googleData"
              :restaurantId="this.restaurantId"
            ></google-pay>
       

             <apple-pay   
              @click="changePayment()"
              :disabled="spinner"  
              v-tooltip="'Apple Pay'"            
              v-if="(payMethod==='SHIFT4') && staffName==='' && googleData.merchantId"
              style="float: left; margin: 2px 5px" 
              :Total="this.Total"
              :parent="this"
              :googleData="this.googleData"
              :restaurantId="this.restaurantId"
            ></apple-pay>
       
         </ion-toolbar>


         <div v-if="spinner" style="margin: 10px; padding: 30px 0;">
            <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
          </div>
        
        
          <ion-card  v-if="cardPay && !spinner" class="scroll" style="height: auto" >  

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

            <ion-card  v-if="devicePay"  class="scroll" style="height: auto">                 
                <device-payment
                v-if="payMethod==='SHIFT4'"
                  :datas="this.deviceData"
                  :grandfather="this.parent"
                  :parent="this"
                  :deviceTransactionType="this.deviceTransactionType"
                >
                </device-payment>    
                  
                <olapay-device
                 v-if="payMethod==='TSYS'"
                  :datas="this.olapayData"
                  :grandfather="this.parent"
                  :parent="this"
                  :Acept="this.Acept"
                  :Cancel="this.Cancel"                   
                >
                </olapay-device>  
                
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

            
            
             <ion-card  v-if="swipePay"  class="scroll" style="height: auto">                 
               <UsbCardSwipe
               :parent="this"
               :Acept="this.Acept"
               :Cancel="this.Cancel"             
               ></UsbCardSwipe> 
            </ion-card>

              
         
            

             <ion-card  v-if="cashPay"  class="scroll" style="height: auto">                 
               <UsbCashDoor
               :parent="this"
               :Acept="this.Acept"
               :Cancel="this.Cancel"             
               ></UsbCashDoor> 
            </ion-card>

          
            <ion-card  v-if="qrPay " class="scroll" style="height: auto" >
              <qr-modal
                :parent="this.parent"
                :splitOrder="false" 
                :staffName="this.staffName"                  
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
                :RestaurantName="this.RestaurantName"
                :order="this.order"
                :isTicket="this.isTicket"
              ></qr-modal>
            </ion-card>

            <ion-card v-if="sharePay">

               <div>   
                <h5>{{parent.$t('frontend.payment.verifyMss')}}</h5>
              </div>

              <ion-toolbar ion-toolbar style="display: flow-root;padding: 5px;" color="primary" >
     
                <ion-button :disabled="spinner? true: false"   color="light" @click="cancelSharePayment">{{Cancel}}</ion-button>
                <ion-button :disabled="spinner? true: false"  color="light"  @click="validateSharePayment">{{verifyText}}</ion-button>
              </ion-toolbar>
          </ion-card>
                     

          <ion-card v-if="checkPay && !spinner">

            <ion-item >
                <ion-label position="floating">{{parent.$t('frontend.order.routingNumber')}} <strong style="color: red">*</strong></ion-label>                                          
                <ion-input type="text" required=true  
                class="menu-col-8"
                  :value="routingNumber"
                   @input="routingNumber = $event.target.value" 
                   @change="routingNumber=parent.ValidateRoutingNumber($event.target.value)"
                    >
                </ion-input>
            </ion-item>  

            <ion-item >
                <ion-label position="floating">{{parent.$t('frontend.order.accountNumber')}} <strong style="color: red">*</strong></ion-label>                                          
                <ion-input type="text" required=true  
                class="menu-col-8"
                   :value="accountCheckNumber" 
                   @input="accountCheckNumber = $event.target.value"
                    >
                </ion-input>
            </ion-item>  

            <ion-item >
                <ion-label position="floating">{{parent.$t('frontend.order.bankName')}}<strong style="color: red">*</strong></ion-label>                                          
                <ion-input type="text" required=true  
                class="menu-col-8"
                    :value="bankName" 
                    @input="bankName = $event.target.value"
                    >
                </ion-input>
            </ion-item>  

            <ion-toolbar style="display: flow-root;padding: 5px;" color="primary" >
                
                <ion-button :disabled="spinner? true: false"   color="light" @click="dismissModal()">{{Cancel}}</ion-button>
                <ion-button :disabled="spinner? true: false"  color="light"  @click="payByCheck">{{payText}}</ion-button>
              
            </ion-toolbar>

          </ion-card>

               


               

              

        </div>
  </div>
  
  </keep-alive>
</template>

<script>

import { eye } from "ionicons/icons";
import { addIcons } from "ionicons";
 import { Api } from '../../backoffice/api/api'
import UsbCardReader from './UsbCardReader'


import UsbCashDoor from './UsbCashDoor'
import UsbCardSwipe from './UsbCardSwipe'

addIcons({
  "ios-eye": eye.ios,
  "md-eye": eye.md,
});

import { payAuthorizeNet } from '../../backoffice/api/payments.js';
import { EventBus } from '../event-bus';
import LibCodes from 'zipcodes'
import { parsePhoneNumber } from 'libphonenumber-js'
import moment from 'moment-timezone';
import Moment from 'moment';
// import Cripto from 'crypto-js'

import DevicePayment from '../../backoffice/views/DevicePayment'
import OlapayDevice from './OlaPayDevice'
import QrModal from './QrPaymentModal'
import PaymentSplited from './PaymentSplited'
import GooglePay from './GooglePay'
import ApplePay from './ApplePay'
import {Utils} from '../../backoffice/utils/utils'
import { Plugins } from '@capacitor/core';
 const { Share } = Plugins;
//  const { Network } = Plugins;
 import  RoutingValidator from 'bank-routing-number-validator';
 
export default {
   name: 'PaymentModal',  
   created: async function(){   
     
    if(this.order.StaffName)
      if(this.order.StaffName !=='')
        this.staffName = this.order.StaffName
    
     if(this.staffName ==='' && this.payMethod==='SHIFT4'){
        await this.getWalletInformation();       
        this.keyGoogle ++;
     }       
    
   
      if(this.canSplitPayment){
        if(this.order.Payment && this.order._id){
          if(this.order.Payment.length >0){
            this.split = true;
            this.readyPayment = true;
              for (const iterator of this.order.Payment) {
                this.arraySplit.push({'total': iterator.total, 'state': iterator.state})         
              }
            }
        }
        else{
        const t =  Utils.decimalAdjust('ceil',this.Total / this.defaultSlplit, -2);   
        this.arraySplit = [{'total':  t, 'state': 0},{'total': t, 'state': 0}];
        this.order.Payment = this.arraySplit; 
        }
      }



     EventBus.$on('resposeSplitPayment', (value) => { this.makeSplitPayment(value)});

     if(this.isTicket)
      this.deviceTransactionType = '03';

      this.shareText1 = this.parent.$t('frontend.payment.shareText1');
      this.shareText2 = this.parent.$t('frontend.payment.shareText2');
     
   },
   props: {  
    parent: {type: Object, default: ()=> {}} ,
    order: {type: Object, default: ()=> {}} ,
    canSplitPayment: {type: Boolean, default: false } ,
    isCatering: {type: Boolean, default: false } ,
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
    RestaurantName:   {type: String, default:"" } ,
    isTicket: {type: Boolean, default: false } ,
     
  },
  components:{
    // toggles,toggle,
     QrModal,
     GooglePay,
     ApplePay,
     DevicePayment,
     OlapayDevice,
     UsbCardReader,
     UsbCashDoor,
     UsbCardSwipe
  },
   data () {
    return {      
      keyGoogle: 0,                 
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
        key: 1, 
        domain: window.location.protocol + '//' + window.location.host,
        split: false, 
        defaultSlplit: 2,
        keySplit: 2,
        keyValidateCount: 3 ,
        // order: {},
        readyPayment: false,
        readySplit: true,
        arraySplit: [],
        secondArraySplit: [],
        indexForPay: 0,
        cardPay: true,
        qrPay: false,
        sharePay: false,
        checkPay: false,
        devicePay: false,
        idtechPay: false,
        cashPay: false,
        swipePay: false,
        staffName: '',
        hasQrPayment: '',
        spinnerShare: false,
        keyShare: 0,
         routingNumber: '',
        accountCheckNumber: '',
        bankName: '',
        readyButton: false,
        googleData: {},
        
        deviceData: {
             'amountInformation': {
                    'TransactionAmount': parseFloat(this.Total).toFixed(2),
                    'TipAmount': 0,
                    'TaxAmount': ((parseFloat(this.order.Taxe) * parseFloat(this.order.SubTotal) )/ 100).toFixed(2),
                },
                'accountInformation':{
                    'FirstName': this.order.CustomerName
                },
                'traceInformation':{
                    'TransactionNumber': ''
                }
        },
          olapayData: {
            'tip': this.order.Tip,
            'total': this.order.Total,
            'subtotal': this.order.SubTotal,
            'tax': this.order.Taxe.toFixed(2),   
        },
        deviceTransactionType: '01',
        shareText1: ' ',
        shareText2: '',
        allTypeOrder:{'Delivery':this.parent.$t('frontend.app.deliver'), 'PickUp':this.parent.$t('frontend.app.pickup'), 'On Table':this.parent.$t('frontend.app.table'), 'Curbside':this.parent.$t('frontend.app.curbside'), },
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
         return this.$ionic.modalController.dismiss()
    }, 
    
    responseApplePay(response){   
      if(response){
         const data =  {         
          restaurantId: this.restaurantId,
          payMethod: this.payMethod,
          total: parseFloat(this.Total).toFixed(2),
          tax: (parseFloat(this.order.Taxe) * parseFloat(this.order.SubTotal) )/ 100,
          tip:  (parseFloat(this.order.Tip) * parseFloat(this.order.SubTotal) )/ 100,
          taxName: this.TaxName,         
          products: this.order.Products,
          applePayToken: response
        }
        return this.sendPayment(data);
      }
      
    },

    responseIDTEch(response){    
      if(response){
         const data =  {         
          restaurantId: this.restaurantId,
          payMethod: this.payMethod,
          total: parseFloat(this.Total).toFixed(2),
          tax: (parseFloat(this.order.Taxe) * parseFloat(this.order.SubTotal) )/ 100,
          tip:  (parseFloat(this.order.Tip) * parseFloat(this.order.SubTotal) )/ 100,
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

     responseSwipeCard(response){
    
      if(response){
         const data =  {         
          restaurantId: this.restaurantId,
          payMethod: this.payMethod,
          total: parseFloat(this.Total).toFixed(2),
          tax: (parseFloat(this.order.Taxe) * parseFloat(this.order.SubTotal) )/ 100,
          tip:  (parseFloat(this.order.Tip) * parseFloat(this.order.SubTotal) )/ 100,
          taxName: this.TaxName,         
          products: this.order.Products,         
          trackData: response.hex
        }
        return this.sendPayment(data);
      }
      
    },
    
    responseGooglePay(response){
     
      if(response){
         const data =  {         
          restaurantId: this.restaurantId,
          payMethod: this.payMethod,
          total: parseFloat(this.Total).toFixed(2),
          tax: (parseFloat(this.order.Taxe) * parseFloat(this.order.SubTotal) )/ 100,
          tip:  (parseFloat(this.order.Tip) * parseFloat(this.order.SubTotal) )/ 100,
          taxName: this.TaxName,         
          products: this.order.Products,
          googlePayToken: response
        }
        return this.sendPayment(data);
      }
      
    },

    async responseDevicePay(response){
     
        let mss = this.parent.$t('frontend.payment.doingPayment');
        if(this.isTicket)
          mss = this.parent.$t('frontend.payment.authorizingPayment');

      this.$ionic.loadingController
      .create({
        cssClass: 'my-custom-class',
        message: mss,
        backdropDismiss: false
      })
      .then ( loading =>{
          loading.present()
          setTimeout( async() => {
              try {                
                // response.returnTo = this.returnTo;
                await this.parent.recivePayment(response);
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
          message: this.parent.$t('frontend.payment.doingPayment'),
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
                  await this.parent.recivePayment(response1);
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

    sendPayment: async function(dataToken){ 
      var data =  {}    
      
      if(dataToken !== ''){
         data =  dataToken
      }
      else{
         if(this.cardNumber ==='' || this.expirationCard === '' || this.cardCode=== ''||
        this.firstName ==='' || this.lastName === '' || this.zipCode=== '' || this.address === '')
            return this.alertRequiredDatas();
        // moment.tz(order.Date, moment.tz.guess()).format('MM/DD/YYYY HH:mm:ss');
        data =  {
          firstName: this.firstName,
          lastName: this.lastName,
          address: this.address,
          zip: this.zipCode,
          restaurantId: this.restaurantId,
          payMethod: this.payMethod,
          total: parseFloat(this.Total).toFixed(2),
          tax: (parseFloat(this.order.Taxe) * parseFloat(this.order.SubTotal) )/ 100,
          tip:  (parseFloat(this.order.Tip) * parseFloat(this.order.SubTotal) )/ 100,
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
      let mss = this.parent.$t('frontend.payment.doingPayment');
      if(this.isTicket)
         mss = this.parent.$t('frontend.payment.authorizingPayment');

        if(this.returnTo === 'OrderCatering'){
          data.tax = 1;
          data.tip = 0;
        }

      this.$ionic.loadingController
      .create({
        cssClass: 'my-custom-class',
        message: mss,
        backdropDismiss: false
      })
      .then ( loading =>{
          loading.present()
          setTimeout( async() => {
              try {
                var response = {}
                if(this.isTicket){
                  let moto = false;
                  if(data.p2pe && data.zip && data.cardSecurityCode && data.address ) moto = 'moto';
                  if(data.p2pe && !data.zip && !data.cardSecurityCode && !data.address ) moto = 'fb';
                   response = await payAuthorizeNet.firstAuthorizeOrder(data, moto);                   
                   if(!response) {
                     this.dismissModal();
                     loading.dismiss();
                    return this.errorPaymentDetail(this.parent.$t('frontend.payment.insuficientFunds')); 
                   }                   
                }                 
                else
                 response = await payAuthorizeNet.payOrder(data);                
                response.returnTo = this.returnTo;
                await this.parent.recivePayment(response);
                this.dismissModal();						
                loading.dismiss();
                
              } catch (error) {
                loading.dismiss();
                  return this.errorPaymentDetail(error); 
                
              }
          })
      })
    
       
       
    },
  

    validateSplitCant(value){
      
      if(value < 2)
        this.defaultSlplit = 2;
      if(value > 4)
        this.defaultSlplit = 4;
      else{
        this.defaultSlplit = value; 
        const t =   Utils.decimalAdjust('ceil',this.Total / this.defaultSlplit, -2);   
        const objInArray = {'total': t, 'state': 0}
        
        const newArray = []
        for(var i=0; i< this.defaultSlplit; i++)
          newArray.push(objInArray );

        this.arraySplit = newArray;
        this.order.Payment = this.arraySplit;

        this.readySplit = true; 
      }
        
      this.keySplit ++;
    },

    paySplit(Index, total){
      this.indexForPay = Index;

      const splitDeviceData = this.deviceData;
      splitDeviceData.amountInformation.TransactionAmount = total.toFixed(2);

       return this.$ionic.modalController
          .create({
            component: PaymentSplited,
            backdropDismiss: false,
            keyboardClose: false,
            cssClass: 'my-custom-class',
            componentProps: {
              data: {
                content: 'New Content',
              },
              propsData: { 
                parent:this,
                order: this.order,             
                Acept: this.Acept,
                Cancel: this.Cancel, 
                Total: total.toString(),
                Tax:  this.Tax,
                TaxName: this.TaxName,     
                restaurantId: this.restaurantId,
                payMethod: this.payMethod  ,                
                errorPaymentHeader: this.errorPaymentHeader,
                errorPaymentMss: this.errorPaymentMss,
                gooPaymentHeader: this.gooPaymentHeader,
                gooPaymentMss: this.gooPaymentMss,
                notValidEmail: this.notValidEmail,
                codeNotValid: this.codeNotValid,
                notValidCC: this.notValidCC,
                dataRequired: this.dataRequired,
                paymentByCard: this.paymentByCard,
                totalForPay: this.totalForPay,
                currency: this.currency,
                ccard: this.ccard,
                expcard: this.expcard,
                ccode: this.ccode,
                cityText: this.cityText,
                stateText: this.stateText,
                firstNameText: this.firstNameText,
                lastNameText: this.lastNameText,
                postalCode: this.postalCode,
                addressLine1: this.addressLine1,
                payText: this.payText,
                verifyText: this.verifyText,
                returnTo: 'OrderView',
                qrPayment: this.parent.$t('frontend.payment.qrPayment'),
                cardPayment: this.parent.$t('frontend.payment.tjtPayment'),
                cashPayment: this.parent.$t('frontend.payment.cashPayment'),
                googleData: this.googleData,
                doingPayment: this.parent.$t('frontend.payment.doingPayment'),
                staffName: this.staffName,
                deviceTransactionType: this.deviceTransactionType,
                deviceData: splitDeviceData,
                shareText1: this.shareText1,
                shareText2: this.shareText2,
                restaurantName: this.RestaurantName,
                customerName: this.order.CustomerName,

              },
            },
          })
          .then(m => m.present())  
    },

    isPaymentComplete(){
      let splitTotal = 0
      for (var i=0; i< this.order.Payment.length; i++) {
        if(this.order.Payment[i].paymentInfo)
          splitTotal += this.order.Payment[i].total;        
      }     
      if(parseFloat(this.order.Total) === parseFloat(splitTotal) || parseFloat(this.order.Total) < parseFloat(splitTotal))
        return true; 
      return false;

    },

    async makeSplitPayment(value){      
     
     this.order.Payment[this.indexForPay].state = 1;
     this.order.Payment[this.indexForPay].paymentInfo = value;
     this.order.Payment[this.indexForPay].PaymentMethod =value.method + ' '+value.accountType+ ' '+ value.accountNumber;


      if(this.isPaymentComplete()){        
        this.order.State = 1;
        const response = await Api.putIn('Order', this.order)      
      
        if(response.status === 200 && response.statusText === "OK"){ 
           this.parent.$store.commit('setOrder', response.data)  
            this.arraySplit[this.indexForPay].state = 1      
              const paymentEntry = {                       
                        "Method": value.method,
                        "Payment": value.total,
                        "InvoiceNumber": value.transId,
                        "ModelId": response.data._id,
                        "ModelFrom": "Order"  ,
                        "StaffName": this.order.StaffName,                  
                   }
              await Api.postIn('allpayments', paymentEntry);   
            this.dismissModal();
            return this.parent.finishPayment(response.data);
        }
        return this.dismissModal();
          
      }
      else{  
        try {
           const response1 = await Api.putIn('Order', this.order)
           if(response1.status === 200 && response1.statusText === "OK"){
            this.parent.$store.commit('setOrder', response1.data)             
            this.arraySplit[this.indexForPay].state = 1;
            const paymentEntry = {                       
                        "Method": value.method,
                        "Payment": value.total,
                        "InvoiceNumber": value.transId,
                        "ModelId": response1.data._id,
                        "ModelFrom": "Order",
                        "StaffName": this.order.StaffName                    
                   }
              await Api.postIn('allpayments', paymentEntry); 
              
            EventBus.$emit('chargeOrder', this.order);  
            return true;
           }
        } catch (error) { console.log(error)}
         
      }
      return true;
    },

    updateArraySplit(Index , value ){  
     
      if(this.order.Total-value > 0){
        this.secondArraySplit = JSON.parse(JSON.stringify(this.arraySplit))       
        this.secondArraySplit[Index].total = parseFloat(value);  
        if(this.defaultSlplit == 2){         
          const secondValue = (this.order.Total - value).toFixed(2);
          let secondIndex = 0;
          if(Index === 0) secondIndex = 1;         
          this.secondArraySplit[secondIndex].total = parseFloat(secondValue);
          }

        this.arraySplit = JSON.parse(JSON.stringify(this.secondArraySplit))
        this.order.Payment[Index].total = parseFloat(value);  
      
        if (!this.validateArraySplit()) return false;
        return true;

      }
      else{
       this.readySplit = false;      
      }
        
     
    },
    

    validateArraySplit(){
      this.keyValidateCount ++;
      let t = 0;
      for (const iterator of this.arraySplit) {
        t += iterator.total
      }

      
      const hayCeros = this.arraySplit.findIndex(re=> re.total === 0);
      if(hayCeros !== -1){
        this.readySplit = false;
        return this.readySplit
      }      
      if(parseFloat(t).toFixed(2) !== parseFloat(this.Total).toFixed(2))   this.readySplit = false;  
      else this.readySplit = true;

      return this.readySplit;
    },

    async readySplitButton(){
      this.readyButton = true;
      this.order.Payment = this.arraySplit;
      this.order.State = 0;
      try {
        const response = await Api.postIn('Order', this.order)
        if(response.status === 200 && response.statusText === "OK"){
          this.readyButton = false
          this.parent.$store.commit('setOrder', response.data)
          this.order = response.data;   
          this.readyPayment = true;            
        }     
         this.readyButton = false;
        
      } catch (error) {
        console.log(error);
         this.readyButton = false;
        
      }

    },

    changePayment(){
      this.cardPay = false;
      this.qrPay = false;
      this.sharePay= false;
      this.checkPay = false;
      this.devicePay = false;
      this.idtechPay = false;
      this.cashPay = false;
      this.swipePay = false;
    },

    shareQrPayment: async function(){

      this.keyShare ++;
      this.changePayment();
      this.sharePay = true;
      this.spinnerShare = true; 
          

      const data = {
          total: parseFloat(this.Total).toFixed(2),
          tax: (parseFloat(this.order.Taxe) * parseFloat(this.order.SubTotal) )/ 100,
          tip:  (parseFloat(this.order.Tip) * parseFloat(this.order.SubTotal) )/ 100,
          payMethod: this.payMethod,
          restaurantId: this.restaurantId,
      }
      data.tax = data.tax.toFixed(2);
      data.tip = data.tip.toFixed(2)

       if(this.returnTo === 'OrderCatering'){
          data.tax = 1;
          data.tip = 0;
        }

      data.saleFlag = 'S'
      if(this.isTicket) data.saleFlag = 'A'
     
     try {       
        var response = await payAuthorizeNet.payQrOrder(data);        
        if(response !=='Error'){
          this.hasQrPayment = response; 
          await Share.share({
            title: `${this.order.CustomerName}${this.shareText1}${this.RestaurantName} (${this.getFormatPrice(this.Total)})${this.shareText2}`,
            url: this.hasQrPayment,
            dialogTitle: `${this.order.CustomerName}${this.shareText1}${this.RestaurantName} (${this.getFormatPrice(this.Total)})${this.shareText2}`,
          });   
          this.spinnerShare = false;
        } 
        else {
          this.spinnerShare = false;
          this.paymentError('Try another payment method.'); 
        }   
                
       
     } catch (error) {
      this.spinnerShare = false;
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
      this.parent.recivePayment(response);
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

     ValidateRoutingNumber(event){
        const result = RoutingValidator.ABARoutingNumberIsValid(event)
        if(!result){
            this.alertWhronRoutingNumber();
            return '';
        }
        return event;
    },

    alertWhronRoutingNumber(){
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: 'Error',
          message: this.parent.$t('frontend.order.badroutingNumber'),
          buttons: [                   
          {
              text: this.parent.$t('frontend.home.acept'),
              handler: () => {                                 
                            
              },
          },
          ],
      })
      .then(a => a.present())
                  
    },

    async payByCheck(){
       if(this.routingNumber ==='' || this.accountCheckNumber === '' || this.bankName === '')
          return this.alertRequiredDatas(); 
      else{         
        this.$ionic.loadingController
        .create({
          cssClass: 'my-custom-class',
          message: this.parent.$t('frontend.payment.doingPayment'),
          backdropDismiss: false
        })
        .then ( loading =>{
            loading.present()
            setTimeout( async() => {
                try {
                    const invoiceSequence = await Api.getInvoiceSequence(this.restaurantId)
                    const res = {
                      routingNumber : this.routingNumber,        
                      accountCheckNumber : this.accountCheckNumber,        
                      bankName : this.bankName,
                      total : this.Total,
                      transId: invoiceSequence.data,                        
                      method: 'Check',
                                      
                    }
                    this.parent.saveCheckPayment(res)
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

    async getWalletInformation(){
      const  newT =  parseInt( this.Total.toString().replace('.', ''));
      const basket = {"invoice": 666, "total": newT };       
      try {
        
      this.spinner = true;
      const ipClient = await Api.getClientIp();
      const res = await Api.walletInformation(basket, this.restaurantId, ipClient.data.ip); 
      if(res.status === 200 && res.statusText === "OK"){
               
        this.googleData.merchantId = res.data.walletConfig.merchantID.toString();  
        this.googleData.gateway = res.data.walletConfig.googlePay.gateway;           
        this.googleData.allowedAuthMethods= res.data.walletConfig.googlePay.allowedAuthMethods;         
        this.googleData.allowedCardNetworks= res.data.walletConfig.googlePay.allowedCardNetworks;  
        this.googleData.currencyCode =res.data.walletConfig.currencyCode; 
        this.googleData.countryCode =res.data.walletConfig.countryCode;      
         this.spinner = false;
      } 
         this.spinner = false;
         return false;
      } catch (error) {
        console.log(error);
        this.spinner = false;        
      }     
      
    
    },

   async htmlToUse(order){

      let totalWithoutQuotation = 0;
      if(order.QuotationPayment)        
            totalWithoutQuotation = order.Total - order.QuotationPayment;
        else
            totalWithoutQuotation = order.Total;

       var date = moment.tz(order.Date, moment.tz.guess()).format('MM-DD-YYYY hh:mm A');
        if(order.OrderForCatering === true)
          date = moment.tz(order.DateToPick, moment.tz.guess()).format('MM-DD-YYYY') + ' ' +  moment.tz(order.HourToPick, moment.tz.guess()).format('hh:mm A') ;
       
        let orderInfo = '';
        if(order.OrderType == 'Delivery')
            orderInfo = order.AddressToDeliver
        if(order.OrderType == 'PickUp')
            orderInfo = moment.tz(order.HourToPick, moment.tz.guess()).format('MM-DD-YYYY') + ' ' +  moment.tz(order.HourToPick, moment.tz.guess()).format('hh:mm A') ;       
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
        html += `<h2>${this.RestaurantName}</h2>  `;          
        html +=`</td>`;     
        html += `</tr>`;          
        html += '<tr><td colspan=6 >'       
        html += `<h4>${this.parent.$t('frontend.order.date')}: ${date} </h4><hr>`;
        html += `<h4>${this.parent.$t('frontend.order.client')}: ${order.CustomerName} </h4>`;
        html += `<h4>${this.parent.$t('frontend.orderType.phone')}: ${order.CustomerPhone} </h4>`;      
        html += `<h4>${this.parent.$t('frontend.order.orderFor')} ${this.allTypeOrder[order.OrderType]}: ${orderInfo} </h4>`;
        if(Cookername !== '')
        html += `<h4>${this.parent.$t('frontend.order.cooker')}: ${Cookername} </h4>`;
        html += '<hr>';  
        html += '<br>'; 
        html += `<tr><br><td colspan=6 style="border-top: 1px solid black;"><h4 ><strong>${this.parent.$t('frontend.order.products')}</strong></h4></td></tr> <tr></tr>`;
        for(var i = 0; i<order.Products.length ; i++){
            html += `<tr ><td  colspan=4 style="width: 50%;border-bottom: 1px solid #dbd1d1;" ><strong >${order.Products[i].Name}</strong>` ;
            if(order.Products[i].Note !='')
                html +=`<p style="background: #f1f1004d;">${order.Products[i].Note}</p> `;
            html +=`</td><td style="width: 25%;border-bottom: 1px solid #dbd1d1;" > <p >( ${order.Products[i].Cant} X ${this.getFormatPrice(order.Products[i].Price)})</p> </td>`;
            html += `<td style="width: 25%;border-bottom: 1px solid #dbd1d1;"> <p >${ this.getFormatPrice( order.Products[i].Price * order.Products[i].Cant )}</p> </td>`;
            html += `</tr>`;
           if(order.Products[i].Aggregates.length > 0){
                html +=`<tr style="padding: 20px 35px;"> ${this.parent.$t('frontend.home.aggregateFree')}: ${order.Products[i].CantAggr=order.Products[i].AggregatesCant * order.Products[i].Cant} </tr>`;

                 for(var a=0; a<order.Products[i].Aggregates.length; a++){
                    let agg = order.Products[i].Aggregates[a]
                    html += `<tr ><td  colspan=4 style="width: 50%;border-bottom: 1px solid #dbd1d1;" ><p style="padding-left: 20px;">${agg.Name} <br>${this.getFormatPrice(agg.SalePrice)}</p>` ;
                    html +=`</td><td style="width: 25%;border-bottom: 1px solid #dbd1d1;" > <p > ${agg.Cant}</p> </td>`;
                    html += `<td style="width: 25%;border-bottom: 1px solid #dbd1d1;"> <p > ${ this.getFormatPrice( agg.AllTotal ) }</p> </td></tr >`;            
                 }
            }
            
        }
       
        if(order.OtherCharges.length >0){
            html += `<tr ><td colspan=6 ><h4 ><strong>${this.parent.$t('frontend.order.otherCharges')}</strong></h4></td></tr>`;
            for(var e = 0; e< order.OtherCharges.length ; e++){
                html += ` <tr ><td colspan=5 style="width: 75%;border-bottom: 1px solid #dbd1d1;"><p >${order.OtherCharges[e].Name}</p></td> <td style="border-bottom: 1px solid #dbd1d1;"> <p>${this.getFormatPrice(order.OtherCharges[e].Price)}</p></td></tr>`;
            }
        }
       
        
        html += `<tr ><td colspan=5 ><br><p ><strong>${this.parent.$t('frontend.order.subtotal')}</strong></p></td> <td ><br> <p >${this.getFormatPrice(order.SubTotal)}</p></td></tr>`;      
       html += `<tr><td  colspan=5 ><p  ><strong>${this.parent.$t('frontend.order.taxe')} ${order.Taxe}%</strong></p></td> <td > <p >${ this.getFormatPrice(order.Taxe * order.SubTotal / 100) } </p> </td></tr>`;      
        if(order.OrderType == 'Delivery' && order.Shipping)
            html +=  `<tr ><td colspan=5  ><p  ><strong>${this.parent.$t('frontend.order.deliver')}</strong></p></td><td  ><p >${this.getFormatPrice(order.Shipping)}</p></td></tr>`;
        if(order.Tip)
            html += `<tr ><td  colspan=5 ><p ><strong>${this.parent.$t('frontend.order.tip')} ${order.Tip}%</strong></p></td><td ><p>${ this.getFormatPrice(order.Tip * order.SubTotal / 100) } </p> </td></tr>`;
        html += `<tr><td colspan=5 style="border-bottom: 1px solid #dbd1d1;"><p  ><strong>${this.parent.$t('frontend.order.total')}</strong></p></td> <td style="border-bottom: 1px solid #dbd1d1;"> <strong > ${this.getFormatPrice(order.Total)}</strong> </td></tr>`;
        
        if(order.QuotationPayment)
          html += `<tr style="border-bottom: 1px solid #399922;"><td colspan=5 ><p  ><strong>${this.parent.$t('frontend.order.quotationPayment')}</strong></p></td> <td > <strong >${this.getFormatPrice(order.QuotationPayment)}</strong> </td></tr>`;
        if(order.PendingPayment)
          html += `<tr style="border-bottom: 1px solid #ff5500;"><td colspan=5 style="border-bottom: 1px solid #ff5500;"><p  ><strong>${this.parent.$t('frontend.order.pendingPayment')}</strong></p></td> <td  style="border-bottom: 1px solid #ff5500;"> <strong >${this.getFormatPrice(order.PendingPayment)}</strong> </td></tr>`;
        if(order.PendingPayment > 0 && order.Deadline){
            html += `<tr ><td colspan=6 ><h4 ><strong>${this.parent.$t('frontend.order.parcialPayment')}</strong></h4></td></tr>`;
            for(var dead = 0; dead < order.Deadline.length ; dead ++){
                html += ` <tr ><td colspan=3 style="border-bottom: 1px solid #dbd1d1;"><p >${order.Deadline[dead].Date}  </p></td> `
                html += ` <td colspan=3 style="border-bottom: 1px solid #dbd1d1;"><strong >  ${order.Deadline[dead].Percent}%  =  ${ this.getFormatPrice((totalWithoutQuotation * order.Deadline[dead].Percent) / 100)}</strong></td> `
                if(order.Deadline[dead].State === 1)
                html += ` <td style="border-bottom: 1px solid #dbd1d1;"> <strong  style= "color: #399922;  ">${this.parent.$t('frontend.order.payed')}</strong></td>`;
                else html += ` <td style="border-bottom: 1px solid #dbd1d1;"><strong  style= "color: #ff5500; ">${this.parent.$t('frontend.order.toPay')}</strong> </td>`;
                html += ` </tr>`;
            }
          }        
        if(order.Note)
            html += `<tr ><td style="width: 20%;border-bottom: 1px solid grey;"><h4 >${this.parent.$t('frontend.order.notes')}</h4></td><td colspan=5 style="width: 80%;border-bottom: 1px solid grey;" ><p >${order.Note}</p></td></tr>`;
        html += '<tr><td colspan=6 style=" text-align: center;">';
        html += `<h2>${this.RestaurantName}</h2>  `;      
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
      overflow-y: auto;
    }
.button-disabled-menu{
--opacity: 0.6;
--ion-color-base: #80808026 !important;
--box-shadow: -2px -3px -1px 2px rgba(0,0,0,0.2),0 -2px -2px 0 rgba(0,0,0,0.14),0 -1px -5px 0 rgba(0,0,0,0.12) !important;
}

 .button-menu {  
       float: left;
    border: 0px;
    border-radius: 4px;
    box-shadow: rgb(60 64 67 / 30%) 0px 1px 1px 0px, rgb(60 64 67 / 15%) 0px 1px 3px 1px;
    cursor: pointer;
    height: 40px;
    min-height: 40px;
    padding: 5px;   
    --background: white;
    --background-hover:  white;
    background: white;
    --box-shadow: 0;
    margin: 2px;
    --color: black;
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
    padding: 5px;
    margin: 2px;
     --color: black
} 
</style>