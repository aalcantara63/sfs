<template>
    <div>
        <div class="ion-padding">  

                 <div v-if="spinner" style="margin: 10px">
                    <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
                </div>

            <ion-segment id="reservationSegment" @ionChange="segmentChanged($event.target.value)" :value="segmentValue" @input="value=segmentValue">
                <ion-segment-button value="manual">
                     MANUAL
                </ion-segment-button>
                <ion-segment-button value="swipe">
                    SWIPE
                </ion-segment-button>
                <ion-segment-button value="test">
                    TEST
                </ion-segment-button>
            </ion-segment>


            <div  v-if="manual" class="scroll" style="height: auto" >  

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
                  display-format="YY/MM" :max="dateTodaymax + 6 "  picker-format="YY/MM"
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
                

                <ion-button :disabled="spinner? true: false"  color="light" @click="cancel()">{{Cancel}}</ion-button>
                <ion-button :disabled="spinner? true: false"  color="light"  @click="makeManual()">Ok</ion-button>

              </ion-toolbar>
  
            </div>   

            <div v-if="swipe">             
                 <ion-toolbar style="display: flow-root;padding: 5px;" color="primary" >  
                    <ion-button :disabled="spinner? true: false"  color="light" @click="cancel()">{{Cancel}}</ion-button>
                    <ion-button :disabled="spinner? true: false"  color="light"  @click="makeSwipe()">Send</ion-button>
                    <ion-button :disabled="spinner? true: false"  color="light"  @click="verifySwipe()">{{verifyText}}</ion-button>
              </ion-toolbar>
            </div>  

            <div v-if="test">

                <div style="padding: 5px 15px; text-align: center">               

                        <ion-button  
                            :disabled="spinner? true: false" fill="outline" 
                            @click="searchDevice">Search Device</ion-button>
                    
                        <ion-button fill="outline"
                            :disabled="spinner? true: false"
                            @click="senPaymentSwipe">SWIPE SALE</ion-button>
                        <ion-button fill="outline"
                            :disabled="spinner? true: false"
                            @click="senPaymentManual">Manual SALE</ion-button>   
                        <ion-button fill="outline"
                            :disabled="spinner? true: false"
                            @click="senAuthoSwipe">SWIPE AUTHO</ion-button>
                        <ion-button fill="outline"
                            :disabled="spinner? true: false"
                            @click="senAuthoManual">Manual AUTHO</ion-button>                  

                    <ion-item>
                    <ion-input @input="ref=$event.target.value" :value="ref"></ion-input>
                    <ion-button  
                            :disabled="spinner? true: false" fill="outline" 
                            @click="getStatus">STATUS
                            </ion-button> 
                    </ion-item>

                    <ion-item>
                    <ion-input @input="transactionID=$event.target.value" :value="transactionID"></ion-input>
                        <ion-button  
                            :disabled="spinner? true: false" fill="outline" 
                            @click="capture">CAPTURE
                            </ion-button>
                            <ion-button  
                            :disabled="spinner? true: false" fill="outline" 
                            @click="getSearch">Search
                            </ion-button>
                    </ion-item>   

                    <ion-item>
                        <ion-input @input="transactionIDReturn=$event.target.value" :value="transactionIDReturn"></ion-input>
                            <ion-button  
                            :disabled="spinner? true: false" fill="outline" 
                            @click="goReturn">RETURN                    
                            </ion-button>
                    </ion-item>

                    <ion-item>
                        <ion-input @input="transactionIDVoid=$event.target.value" :value="transactionIDVoid"></ion-input>
                        <ion-button  
                        :disabled="spinner? true: false" fill="outline" 
                        @click="goVoid">VOID                
                        </ion-button>
                    </ion-item>
                    

                    <ion-button  
                            :disabled="spinner? true: false" fill="outline" 
                            @click="cancel">{{Cancel}}</ion-button>
                

                </div>

            </div>       


            
              

         
       
    </div>
        
      

    </div>
</template>

<script>

import { OlaPay } from '../../backoffice/api/olapay';
import LibCodes from 'zipcodes'
import moment from 'moment-timezone';


export default {
    name: 'OlaPayDevice',
    created: async function(){  
        console.log('Datas')      
        console.log(JSON.parse(JSON.stringify(this.datas)))

        this.ip = this.datas.device.ip
        this.port = this.datas.device.port
       
    },  
    data() {
        return {     
            spinner: false,
            spinner1: false,
            ssl: true,
            ip: '',
            port: '',
            referToFind: '',

            manual: true,
            swipe: false,
            test: false,
            segmentValue: 'manual',

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
            dateTodaymax:  new Date().getFullYear(),
            dateTodaymin: new Date().toISOString().substr(0, 7),



            ref: '',


            transactionID: '',
            transactionIDReturn: '',
            transactionIDVoid: ''
        }
    }, 
    props:{
        parent: {type: Object, default: ()=> {}} ,
        Acept:  {type: String, default:"" } ,
        Cancel:  {type: String, default:"" } ,           
        isTicket:  {type: Boolean, default:false } ,           
        datas: {type: Object, default: ()=> {}} ,        
         codeNotValid:  {type: String, default:"" } ,
        notValidCC:  {type: String, default:"" } ,
        dataRequired:  {type: String, default:"" } ,   
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
    },   
    
    methods:{

 

        cancel(){
             return this.$ionic.modalController.dismiss();
        },

        async makeManual(){
             if(this.cardNumber ==='' || this.expirationCard === '' || this.cardCode=== ''||
                this.firstName ==='' || this.lastName === '' || this.zipCode=== '' || this.address === '')
                return this.alertRequiredDatas();

            let response;
            if(this.isTicket) response = await this.senAuthoManual();
            else response = await this.senPaymentManual(); 
            if(response){
                console.log('RESPONSE MANUAL')
                console.log(response);
                return this.parent.responseDevicePay(response);
            }
            else this.paymentError('Try another payment method.'); 
        },

         async senAuthoManual(){       
            
            console.log('DATA for OLAPAY SALE')
            console.log(JSON.parse(JSON.stringify(this.datas)));
             
            if(this.ip !=='' && this.port !==''){
               try {                                      
                    const item = { 
                        'Authorize': {
                            Tip : this.datas.tip,
                            Tax: this.datas.tax,
                            SubTotal: this.datas.subTotal,
                            AddressLine1 : this.address,
                            Amount : this.datas.total,
                            CardDataSource : "MANUAL",
                            City  : this.city,
                            CardNumber : this.cardNumber,
                            CVV2 : this.cardCode,
                            CardHolderName : this.firstName + ' ' + this.lastName,
                            ExpirationDate : moment(this.expirationCard).format('YY/MM'),
                            KSN  : "ABC1234566699",
                            TokenRequired  :  "N",
                            OrderID  : "",
                            State  : this.state,
                            Zip : this.zipCode,
                            currencyCode : "USD"
                          }
                    }
                    this.spinner = true;
                    const resp = await OlaPay.authorizeManual(this.ip, this.port, this.ssl, item);
                    if(resp){                          
                        this.spinner = false;
                        return resp;
                    }
                    this.spinner = false;
                    return false;
               } catch (error) {
                   console.log(error);
                    this.spinner = false;
                    return false;
               }        
            }
            else
              this.showMss('ip or port, ARE EMPTY');             
        },

        async senPaymentManual(){       
            
            console.log('DATA for OLAPAY SALE')
            console.log(JSON.parse(JSON.stringify(this.datas)));
             
            if(this.ip !=='' && this.port !==''){
               try {
                                      
                    const item = { 
                        'Sale': {
                            Tip : this.datas.tip,                            
                            Tax: this.datas.tax,
                            SubTotal: this.datas.subTotal,
                            AddressLine1 : this.address,
                            Amount : this.datas.total,
                            CardDataSource : "MANUAL",
                            City  : this.city,
                            CardNumber : this.cardNumber,
                            CVV2 : this.cardCode,
                            CardHolderName : this.firstName + ' ' + this.lastName,
                            ExpirationDate : moment(this.expirationCard).format('YY/MM'),
                            KSN  : "ABC1234566699",
                            TokenRequired  :  "N",
                            OrderID  : "",
                            State  : this.state,
                            Zip : this.zipCode,
                            currencyCode : "USD"
                        }                       
                    }

                     this.spinner = true;
                    const resp = await OlaPay.saleManual(this.ip, this.port, this.ssl, item);
                    if(resp){                      
                        this.spinner = false   
                        return resp;                    
                    }
                    this.spinner = false;
                    return false;
                   
               } catch (error) {
                   console.log(error);
                  this.spinner = false;
                 return false;
               }        
            }
            else
              this.showMss('ip or port, ARE EMPTY');             
        },

        async makeSwipe(){
            let response;
            if(this.isTicket) response = await this.senAuthoSwipe();
            else response = await this.senPaymentSwipe(); 
            if(response){
                console.log('RESPONSE SWIPE')
                console.log(response);
            }
            else this.paymentError('Try another payment method.');
        },

        async senAuthoSwipe(){            
             
            if(this.ip !=='' && this.port !==''){
               try {
                    this.spinner = true;
                    const resp = await OlaPay.authorizeEmv(this.ip, this.port, this.ssl, this.datas);
                   if(resp)  {
                        console.log('RESPONSE AUTHORIZE SWIPE')
                        console.log(resp);
                        this.referToFind = resp.ref;
                        this.spinner = false;
                        return resp;
                   }                                        
                    this.spinner = false;
                    return false;
                   
               } catch (error) {
                    console.log(error);
                    this.spinner = false;
                    return false;
               }        
            }
            else
              this.showMss('ip or port, ARE EMPTY');

        },

        async senPaymentSwipe(){       
            
            console.log('DATA for OLAPAY SALE')
            console.log(JSON.parse(JSON.stringify(this.datas)));
             
            if(this.ip !=='' && this.port !==''){
               try {
                    this.spinner = true;
                    const resp = await OlaPay.saleEmv(this.ip, this.port, this.ssl, this.datas);
                   if(resp){
                        console.log('RESPONSE SALE SWIPE')
                        console.log(resp);
                        this.referToFind = resp.ref;
                        this.spinner = false;                    
                        return resp
                   }
                  this.spinner = false;
                   return false; 
                   
               } catch (error) {
                   console.log(error);
                   this.spinner = false;
                    return false;
               }        
            }
            else
              this.showMss('ip or port, ARE EMPTY');             
        },

        async verifySwipe(){
            const response = await this.getStatus();          
            if(response){
                console.log('RESPONSE PARA MANDAR A AL PARENT');
                console.log(response);
                return this.parent.responseDevicePay(response);
            }
            else this.paymentError('Try another payment method.');
        },

        async getStatus(){   
                         
            if(this.referToFind !==''){
               try {
                                      
                    const item = { 
                        'Request': {
                             "Ref": this.referToFind
                        }                       
                    }
                     this.spinner = true;
                    const resp = await OlaPay.status(this.ip, this.port, this.ssl, item);
                    if(resp){
                        console.log('RESPONSE STATUS')
                        console.log(resp);
                        this.spinner = false;
                        
                        // const itemPrint = { 'Print': {"Ref": this.referToFind}  }
                        // OlaPay.print(this.ip, this.port, this.ssl, itemPrint);

                        return resp
                    }
                  this.spinner = false;
                    return false;
                   
               } catch (error) {
                   console.log(error);
                  this.spinner = false;
                    return false;
               }        
            }
            else
              this.showMss('referToFind, ARE EMPTY');             
        },

        segmentChanged(value){            
             if(value === 'manual'){
                 this.manual = true;
                 this.swipe = false;
                 this.test = false;
             }
             if(value === 'swipe'){
                 this.manual = false;
                 this.swipe = true;
                 this.test = false;
             }  
              if(value === 'test'){
                 this.manual = false;
                 this.swipe = false;
                 this.test = true;                
             }
             this.segmentValue = value;

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




        /** METODOS DE PRUEBA */

        async getSearch(){   
                         
            if(this.ip !=='' && this.port !=='' && this.transactionID !==''){
               try {                                      
                    const item = { 
                        'Search': {
                             "trans_id":this.transactionID,
                        }                       
                    }
                     this.spinner = true;
                    const resp = await OlaPay.search(this.ip, this.port, this.ssl, item);
                    if(resp){
                        console.log('RESPONSE STATUS')
                        console.log(resp);
                        this.spinner = false;
                        return resp;                        
                    }
                  this.spinner = false;
                    return false;
                   
               } catch (error) {
                   console.log(error);
                   this.spinner = false;
                    return false;
               }        
            }
            else
              this.showMss('ip or port, ARE EMPTY');             
        },

        async capture(){   
                         
            if(this.ip !=='' && this.port !=='' && this.transactionID !==''){
               try {
                                      
                    const item = { 
                        'Capture':{
                            "Amount": this.datas.total,     
                            "TransactionID": this.transactionID
                        }                      
                    }
                     this.spinner = true;
                    const resp = await OlaPay.capture(this.ip, this.port, this.ssl, item);
                    this.spinner = false;
                    if(resp){
                            console.log('RESPONSE CAPTURE')
                            console.log(resp);                           
                            return resp
                    }
                   this.spinner = false;
                    return false;
               } catch (error) {
                   console.log(error);  
                   this.spinner = false;
                    return false;                 
               }        
            }
            else
              this.showMss('ip or port, ARE EMPTY');             
        },

        async goReturn(){

            if(this.ip !=='' && this.port !=='' && this.transactionIDReturn !==''){
            try {
                               
                const item = { 
                    'Return':{
                        "Amount": this.datas.total,     
                        "TransactionID": this.transactionIDReturn
                    }                    
                }
                 this.spinner = true;
                const resp = await OlaPay.goReturn(this.ip, this.port, this.ssl, item);
                 this.spinner = false;
                if(resp){
                     console.log('RESPONSE RETURN')
                    console.log(resp);                   
                    return resp
                } 
                this.spinner = false;
                    return false;            
                
            } catch (error) {
                console.log(error);
                 this.spinner = false;
                    return false;
            }        
            }
            else
                this.showMss('ip or port, ARE EMPTY');  

        },

        async goVoid(){

            if(this.ip !=='' && this.port !=='' && this.transactionIDVoid !==''){
            try {
                               
                const item = { 
                    'Void':{
                        "Amount": this.datas.total,     
                        "TransactionID": this.transactionIDVoid
                    }
                    
                }
                this.spinner = true;
                const resp = await OlaPay.goVoid(this.ip, this.port, this.ssl, item);
                this.spinner = false;
                if(resp){
                    console.log('RESPONSE VOID')
                    console.log(resp);                
                    return resp
                }
                this.spinner = false;
                    return false;
                
            } catch (error) {
                console.log(error);
                this.spinner = false;
                    return false;
                }        
            }
            else
                this.showMss('ip or port, ARE EMPTY');  

        },
        
        async searchDevice(){
            console.log(this.ip)
            if(this.ip !=='' && this.port !==''){
              try {
                   this.spinner = true;        
                   const resp = await OlaPay.getDevice(this.ip, this.port, this.ssl);
                    this.spinner = false;
                   if(resp){
                        console.log('RESPONSE GET DEVICE')
                        console.log(resp.data);
                        return resp
                   }
                   this.spinner = false;
                    return false;
                   
               } catch (error) {
                   console.log(error)   
                   this.spinner = false;
                    return false;                
               }                
            }
            else{
             this.showMss('ip or port, ARE EMPTY');
            }
                      
        },

        showMss(mss){
           return  this.$ionic.alertController
            .create({
                cssClass: 'my-custom-class',
                header: 'RESPONSE',
                message: mss,
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

     
    },

}
</script>