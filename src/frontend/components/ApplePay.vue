<template>
  <div class="examples"  v-if="isReadyToPay">
      <!-- <ion-button >
        <span class="iconify" data-icon="cib:apple-pay" data-inline="false"></span>
      </ion-button>    -->

      <ion-button 
         
          @click="onClick()"          
          style="float: left;"          
          class="button-menu button button-solid ion-activatable ion-focusable hydrated">
          <span class="iconify"  data-icon="cib:apple-pay" data-inline="false" style="width: 40px;height: 40px;"></span>
      </ion-button>

      <div>CONSOLE:
        <div >{{consoleMsj}}</div>    
      </div>
  </div>

  

</template>



<script>


// import { ApplePay } from 'capacitor-apple-pay'
// import { Plugins } from '@capacitor/core'
// // const ApplePay = Plugins.ApplePay as ApplePayPlugin;
// const ApplePay =  Plugins.ApplePay ;
// const ApplePay =   ApplePayPlugin;


 import { Api } from '../../backoffice/api/api'

export default {
    name: 'ApplePay',  
    props: { 
        Total:  {type: String, default:"" } ,
        parent: {type: Object, default: ()=> {}} ,
        restaurantId:  {type: String, default:"" } ,
    },
    mounted: async function () {   

        console.log('window.ApplePaySession: '+ window.ApplePaySession)
        // this.parent.mssApplePay = ('window.ApplePaySession: '+ window.ApplePaySession);
        if (window.ApplePaySession) {
            await this.getWalletInformation();
            this.isReadyToPay = true // solo temporalmente.
            this.setupButton()      
            await this.applePayInit()
        }
    },
    data() {
        return {   
          consoleMsj: '',
          isReadyToPay: false,  
          currencyCode: '',
          countryCode: '', 
          supportedNetworks: [],
          merchantCapabilities:  [ 'capability3DS', 'capabilityCredit', 'capabilityDebit', 'capabilityEMV' ],                      
        }
    },   
  
  methods:{
     
    async getWalletInformation(){
        const  newT =  parseInt( this.Total.toString().replace('.', ''));
        const basket = {"invoice": 666, "total": newT };    
        try {
          const ipClient = await Api.getClientIp();
          const res = await Api.walletInformation(basket, this.restaurantId, ipClient.data.ip); 
          if(res.status === 200 && res.statusText === "OK"){       
            this.paymentRequest.merchantInfo.merchantId = res.data.walletConfig.merchantID.toString();  
            this.paymentRequest.allowedPaymentMethods[0].tokenizationSpecification.parameters.gateway = res.data.walletConfig.googlePay.gateway;           
            this.paymentRequest.allowedPaymentMethods[0].parameters.allowedAuthMethods = res.data.walletConfig.googlePay.allowedAuthMethods;  
            
            this.paymentRequest.allowedPaymentMethods[0].parameters.allowedCardNetworks =res.data.walletConfig.googlePay.allowedCardNetworks;  
            this.currencyCode =res.data.walletConfig.currencyCode;  
            this.countryCode =res.data.walletConfig.countryCode; 
            return true;
        }

        return false;
          
        } catch (error) {
          console.log(error);
          return false;
        }
      
        },

    setupButton () {
      let merchantIdentifier = "merchant.com.i4go.i4m"
      window.ApplePaySession.canMakePaymentsWithActiveCard(merchantIdentifier)
        .then(canMakePayments => {
          if (canMakePayments) {         
            this.isReadyToPay = true
          } else {
            // Check for the existence of the openPaymentSetup method.
            if (window.ApplePaySession.openPaymentSetup) {
              // Display the Set up Apple Pay Button here…
              window.ApplePaySession.openPaymentSetup(merchantIdentifier)
                .then(success => {
                  if (success) {
                    // Open payment setup successful
                    console.log('Open payment setup successful')
                    this.consoleMsj += ' '+ 'Open payment setup successful' + ' ';
                  } else {
                    // Open payment setup failed
                    console.error('Open payment setup failed')
                    this.consoleMsj += ' '+ 'Open payment setup failed' + ' ';
                  }
                })
                .catch(error => {
                  // Open payment setup error handling
                  console.error(error)
                   this.consoleMsj += ' '+ 'Error' + error+ ' ';
                })
            }
          }
        })
    },
    onClick () {
      console.log('ApplePayButton.onClick')   
      this.consoleMsj += ' '+ 'ApplePayButton.onClick' + ' ';  
        if (parseFloat(this.Total) > 0) {
          let request = {
            countryCode: this.countryCode,
            currencyCode: this.currencyCode,
            supportedNetworks: this.supportedNetworks,
            merchantCapabilities: this.merchantCapabilities,
            total: {
              label: 'Oder #1 ApplePay',
              amount: this.Total
            },
            // lineItems: this.getLineItems(),
            // shippingMethods: this.getShippingMethods()
          }
          this.consoleMsj += ' '+ 'Aqui debe abrir el session de apple Pay' + ' ';  
          this.session = new window.ApplePaySession(3, request)
          this.session.onvalidatemerchant = this.onValidateMerchant
          this.session.onpaymentauthorized = this.onPaymentAuthorized
          this.session.oncancel = this.onCancel
          // this.session.onshippingmethodselected = this.onShippingMethodSelected
          // this.session.onshippingcontactselected = this.onShippingContactSelected
          // this.session.onpaymentmethodselected = this.onPaymentMethodSelected
          this.session.begin()
          console.log('ApplePaySession.begin() called')
        }
      
    },
    onValidateMerchant (event) {
      console.log('ApplePayButton.onValidateMerchant', event)
      this.consoleMsj += ' '+ ' function onValidateMerchant ' + event+ ' '; 
      // 1. You call your server, passing it the URL from the event’s validationURL property.
      // 2. Your server uses the validation URL to request a session from the Apple Pay server,
      //    as described in Requesting an Apple Pay Payment Session.
      //    Never send the request for a merchant session from the client.
      // 3. In response, your server receives an opaque merchant session object.
      // 4. You pass the merchant session object to your Apple Pay session’s
      //    completeMerchantValidation method. You can use the merchant session object a single time.
      //    It expires five minutes after it is created.     
    },
    onPaymentAuthorized (event) {
        console.log('ApplePayButton.onPaymentAuthorized', event)
        this.consoleMsj += ' '+ ' function onPaymentAuthorized ' + event+ ' '; 
        // The onpaymentauthorized function must complete the payment
        // and respond by calling completePayment before the 30 second timeout,
        // after which a message appears stating that the payment could not be completed.
        const paymentData = event.payment
        const paymentToken = paymentData.token
     
        console.log(' paymentData.token', paymentToken)    
         this.consoleMsj += ' '+ ' paymentData.token ' + paymentToken+ ' '; 

        const response = JSON.parse(JSON.stringify(paymentToken))  
        if(response)   
          this.parent.responseApplePay(response);  
    },
    onCancel (event) {
      console.log('ApplePayButton.onCancel', event)
      this.consoleMsj += ' '+ ' onCancel ' + ' '; 
      this.session.abort()
    },

    // getRequestApplePay: async function(){
    
    // const paymentRequest = {
    //   // Requiered
    //   merchantIdentifier: "merchant.com.i4go.i4m",
    //   paymentSummaryItems: [
    //   {
    //       label: 'order #1001',
    //       amount: this.Total,
    //       // type: 'pending' // or default: final
    //   },
    //   // ...
    //   ],
    //   // Outher
    //   countryCode: 'US',
    //   currencyCode: 'USD',

    //   supportedNetworks: [
    //           "amex",
    //           "discover",
    //           "jcb",
    //           "masterCard",
    //           "visa"
    //   ],
    //   merchantCapabilities: [
    //   'capability3DS', 'capabilityCredit',
    //   'capabilityDebit', 'capabilityEMV'
    //   ],
    // };

    //   try {
    //   // See: https://developer.apple.com/documentation/passkit/pkpaymenttoken
    //   // const { token } = await ApplePay.makePaymentRequest(paymentRequest);    
        
    //   // console.log('token de APPLE PAY')
    //    console.log('paymentRequest');
    //    console.log(paymentRequest);
      

    //   } catch (e) {
    //       console.log(e)
    //     //  this.parent.mssApplePay = 'Error Apple Payment '+ e + ' ';
    //   if (e.message === 'canceled') {
    //       console.log('Payment widget was closed by user');
    //   }
    //   }
    // },

     async getWalletConfig(){
        const  newT =  parseInt( this.Total.toString().replace('.', ''));
        const basket = {"invoice": 666, "total": newT };    
        try {
          const ipClient = await Api.getClientIp();
          const res = await Api.walletInformation(basket, this.restaurantId, ipClient.data.ip); 
          if(res.status === 200 && res.statusText === "OK"){          
            return res.data;
          }
        return false;
          
        } catch (error) {
          console.log(error);  
          return false;        
        }
      
        },

    async applePayInit() {

      try{
        const config = await this.getWalletConfig();
        if(config){
          // _wallets_i4goTrueTokenObj.settings.debug && remoteLog("Checking for Apple Pay...");
          if((typeof config === "object")  && (typeof config.applePay === "object")
          && (typeof config.applePay.merchantIdentifier === "string") && config.applePay.merchantIdentifier.length){
            if (window.ApplePaySession && window.ApplePaySession.supportsVersion(3) && window.ApplePaySession.canMakePayments()) {
              var promise = window.ApplePaySession.canMakePaymentsWithActiveCard(config.applePay.merchantIdentifier);
              promise.then(function (canMakePayments) {
                if(canMakePayments){
                    this.isReadyToPay = true
                  // $(".apple-pay-button").on("click",onApplePayClick);
                  // $(".apple-pay-button").show().removeClass("hidden").removeClass("pay-hidden");
                  } 
                }, function(error) {
              console.log("applePayInit Error: " + error.message);
              });
            } else {
            console.log("Apple Pay not found");
            } 
          }else{
            console.log("Apple Pay not configured");
          } 
        }  
      }catch(e){
        console.log("applePayInit Error: " + e.message);
      } 
      }


     
    }

    
        
}
   
</script>



<style scope="scoped" >
.gpay-button.short, .gpay-button.plain {   
    width: 60px;
}


</style>