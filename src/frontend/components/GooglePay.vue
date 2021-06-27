<template>
  <div class="examples"   >
    
  
    <google-pay-button        
        v-show="isReadyToPay"
       :key="keyGoogle"      
        environment="TEST"
        v-bind:button-type="buttonType"
        v-bind:button-color="buttonColor"
        v-bind:existing-payment-method-required="existingPaymentMethodRequired"
        v-bind:paymentRequest.prop="{
          apiVersion: paymentRequest.apiVersion,
          apiVersionMinor: paymentRequest.apiVersionMinor,
          allowedPaymentMethods: paymentRequest.allowedPaymentMethods,
          merchantInfo: paymentRequest.merchantInfo,
          transactionInfo: {
            totalPriceStatus: 'FINAL',
            totalPriceLabel: 'Total',
            totalPrice: Total,
            currencyCode: currencyCode,
            countryCode: countryCode,
          },
      
        }"
        v-on:loadpaymentdata="onLoadPaymentData"
        v-on:error="onError"
        v-on:readytopaychange="onReadyToPayChange"    
         
       

                
   
    ></google-pay-button>
  </div>

</template>



<script>

import { GooglePayButton } from '@google-pay/button-element'
 import { Api } from '../../backoffice/api/api'

export default {
    name: 'GooglePay',  
     props: { 
        Total:  {type: String, default:"" } ,
        parent: {type: Object, default: ()=> {}} ,
        googleData: {type: Object, default: ()=> {}} ,
        restaurantId:  {type: String, default:"" } ,
        keyGoogle:  {type: Number, default: 0 } ,
    },   
    created: async function() {   
    },
    data() {
        return {           
        isReadyToPay: false,  
        currencyCode: 'USD',
        countryCode: 'US',      
        amount: this.Total,
        existingPaymentMethodRequired: true,
        buttonColor: 'white',
        buttonType: 'short',
        paymentRequest: {
        apiVersion: 2,
        apiVersionMinor: 0,
        default_applications: [
          "https://pay.google.com/gp/p/web_manifest.json"
          ],
        supported_origins: [
            "https://pay.google.com"
        ],
        allowedPaymentMethods: [
        {
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks:  ['MASTERCARD', 'VISA'],
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
              gateway: '', //'shift4'
              gatewayMerchantId: '',
            },
          },
        },
      ],
        merchantInfo: {
          merchantId: '', //'7721772'
          merchantName: '',
        },
    }  
        }
    },
    
  components:{
   GooglePayButton,
  },
  methods:{
    onLoadPaymentData: function (event)  {
      
      const response = JSON.parse(JSON.stringify(event.detail))  
      if(response)   
        this.parent.responseGooglePay(response);        
    },

    onError: event => {
      console.error('error', event.error);
    },

    onReadyToPayChange: async function (event) {  
      
      if(event.detail.isButtonVisible && event.detail.isReadyToPay  && event.detail.paymentMethodPresent && this.googleData.merchantId){
          this.isReadyToPay = event.detail.isReadyToPay;

          if(this.googleData.merchantId){
            this.paymentRequest.merchantInfo.merchantId = this.googleData.merchantId;  
            this.paymentRequest.allowedPaymentMethods[0].tokenizationSpecification.parameters.gateway = this.googleData.gateway;           
            this.paymentRequest.allowedPaymentMethods[0].parameters.allowedAuthMethods = this.googleData.allowedAuthMethods;          
            this.paymentRequest.allowedPaymentMethods[0].parameters.allowedCardNetworks =this.googleData.allowedCardNetworks;  
            this.currencyCode =this.googleData.currencyCode;  
            this.countryCode =this.googleData.countryCode;  
            this.paymentRequest.transactionInfo = {
            totalPriceStatus: 'FINAL',
            totalPriceLabel: 'Total',
            totalPrice: this.Total,
            currencyCode: this.googleData.currencyCode,
            countryCode: this.googleData.countryCode,
            }
          }
      }
      
    },

    onPaymentDataAuthorized: async function (paymentData) {
        console.log('payment authorized', paymentData);
        return {
          transactionState: 'SUCCESS',
        };
      },     
    },
      async getWalletInformation(){
      const  newT =  parseInt( this.Total.toString().replace('.', ''));
      const basket = {"invoice": 666, "total": newT };       
      
     
      const ipClient = await Api.getClientIp();
      
      const res = await Api.walletInformation(basket, this.restaurantId, ipClient.data.ip); 
      if(res.status === 200 && res.statusText === "OK"){
        
        this.googleData.merchantId = res.data.walletConfig.merchantID.toString();  
        this.googleData.gateway = res.data.walletConfig.googlePay.gateway;           
        this.googleData.allowedAuthMethods= res.data.walletConfig.googlePay.allowedAuthMethods;         
        this.googleData.allowedCardNetworks= res.data.walletConfig.googlePay.allowedCardNetworks;  
        this.googleData.currencyCode =res.data.walletConfig.currencyCode; 
        this.googleData.countryCode =res.data.walletConfig.countryCode;      
        
      }      
      
    
    },

    
        
}
   
</script>



<style>

.gpay-button.short, .gpay-button.plain {
    min-width: 90px;
    width: auto !important;
}


</style>