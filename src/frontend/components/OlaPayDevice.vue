<template>
    <div>
        <div class="ion-padding">  

                 <div v-if="spinner" style="margin: 10px">
                    <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
                </div>

            
              

            <div style="padding: 5px 15px; text-align: center">
                

                <div>
                     <ion-item :disabled="spinner? true: false">                  
                    <ion-label position="floating">IP <strong style="color: red">*</strong></ion-label>                               
                    <ion-input type="text" required=true  
                    class="menu-col-8" 
                    :value="ip" @input="ip = $event.target.value"
                        ></ion-input>
                </ion-item>
                <ion-item :disabled="spinner? true: false">                  
                    <ion-label position="floating">PORT <strong style="color: red">*</strong></ion-label>                               
                    <ion-input type="text" required=true  
                    class="menu-col-8" 
                    :value="port" @input="port = $event.target.value"
                        ></ion-input>
                </ion-item>
                <ion-item :disabled="spinner? true: false">
                    <ion-label >SSL <strong style="color: red">*</strong></ion-label>                               
                    <ion-toggle  color="secondary" @ionChange="ssl= !ssl"  :checked ="ssl"></ion-toggle>    
                </ion-item>

                

                </div>

                <ion-button  
                    :disabled="spinner? true: false" fill="outline" 
                    @click="searchDevice">Search Device</ion-button>
              

              
                <ion-button fill="outline"
                    :disabled="spinner? true: false"
                    @click="senPayment">SWIPE SALE</ion-button>
                <ion-button fill="outline"
                    :disabled="spinner? true: false"
                    @click="senPaymentManual">Manual SALE</ion-button>   
                <ion-button fill="outline"
                    :disabled="spinner? true: false"
                    @click="senAutho">SWIPE AUTHO</ion-button>
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
</template>

<script>

import { OlaPay } from '../../backoffice/api/olapay';

export default {
    name: 'OlaPayDevice',
    created: async function(){        
       
    },  
    data() {
        return {     
            spinner: false,
            spinner1: false,
            ssl: false,
            ip: '',
            port: '',
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
        datas: {type: Object, default: ()=> {}} ,      
    },   
    
    methods:{

        cancel(){
             return this.$ionic.modalController.dismiss();
        },

        async senAutho(){

            console.log('DATA for OLAPAY AUTHO')
            console.log(JSON.parse(JSON.stringify(this.datas)));
             
            if(this.ip !=='' && this.port !==''){
               try {
                    this.spinner = true;
                    const resp = await OlaPay.authorizeEmv(this.ip, this.port, this.ssl, this.datas);
                   if(resp)  {
                        console.log('RESPONSE AUTHORIZE SWIPE')
                        console.log(resp.data);
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

         async senAuthoManual(){       
            
            console.log('DATA for OLAPAY SALE')
            console.log(JSON.parse(JSON.stringify(this.datas)));
             
            if(this.ip !=='' && this.port !==''){
               try {                                      
                    const item = { 
                        'Authorize': {
                            Tip : this.datas.tip,
                            AddressLine1 : "1980 Festival Drive",
                            Amount : this.datas.total,
                            CardDataSource : "MANUAL",
                            City  : "Las Vegas",
                            CardNumber : "4111111111111111",
                            CVV2 : "999",
                            CardHolderName : "John Doe",
                            ExpirationDate : "21/06",
                            KSN  : "ABC1234566699",
                            TokenRequired  :  "N",
                            OrderID  : "",
                            State  : "NV",
                            Zip : "89135",
                            currencyCode : "USD"
                          }
                    }
                    this.spinner = true;
                    const resp = await OlaPay.authorizeManual(this.ip, this.port, this.ssl, item);
                    if(resp){
                            console.log('RESPONSE SALE MANUAL')
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

        async senPayment(){       
            
            console.log('DATA for OLAPAY SALE')
            console.log(JSON.parse(JSON.stringify(this.datas)));
             
            if(this.ip !=='' && this.port !==''){
               try {
                    this.spinner = true;
                    const resp = await OlaPay.saleEmv(this.ip, this.port, this.ssl, this.datas);
                   if(resp){
                        console.log('RESPONSE SALE SWIPE')
                        console.log(resp.data);
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

        async senPaymentManual(){       
            
            console.log('DATA for OLAPAY SALE')
            console.log(JSON.parse(JSON.stringify(this.datas)));
             
            if(this.ip !=='' && this.port !==''){
               try {
                                      
                    const item = { 
                        'Sale': {
                            Tip : this.datas.tip,
                            AddressLine1 : "1980 Festival Drive",
                            Amount : this.datas.total,
                            CardDataSource : "MANUAL",
                            City  : "Las Vegas",
                            CardNumber : "4111111111111111",
                            CVV2 : "999",
                            CardHolderName : "John Doe",
                            ExpirationDate : "21/06",
                            KSN  : "ABC1234566699",
                            TokenRequired  :  "N",
                            OrderID  : "",
                            State  : "NV",
                            Zip : "89135",
                            currencyCode : "USD"
                        }                       
                    }

                     this.spinner = true;
                    const resp = await OlaPay.saleManual(this.ip, this.port, this.ssl, item);
                    if(resp){
                        console.log('RESPONSE SALE MANUAL')
                        console.log(resp);
                        this.spinner = false                       
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

         async getStatus(){   
                         
            if(this.ip !=='' && this.port !=='' && this.ref !==''){
               try {
                                      
                    const item = { 
                        'Request': {
                             "Ref":this.ref
                        }                       
                    }
                     this.spinner = true;
                    const resp = await OlaPay.status(this.ip, this.port, this.ssl, item);
                    if(resp){
                        console.log('RESPONSE STATUS')
                        console.log(resp.data);
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