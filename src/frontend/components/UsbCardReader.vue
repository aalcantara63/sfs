<template>
    <div>
        <div class="ion-padding">  

              <ion-item v-if="!moto"> 
                <h2 class="titles-order" >SWIPE</h2>                              
            </ion-item>

            <ion-item>
                <h4 class="titles-order">MOTO</h4>
                <ion-toggle color="primary" 
                @ionChange="moto = !moto" 
                :checked="moto"></ion-toggle> 
            </ion-item>

            <ion-item style="padding: 10px 0;">
                <textarea id="target" style=" width: 100%;height: 80px;"  @change="noData()"></textarea> 
            </ion-item>

            <div v-if="moto">

                <ion-item >                     
                  <ion-label position="floating">{{i18n.t('frontend.order.addressLine1')}} <strong style="color: red">*</strong></ion-label>                                                                      
                  <ion-input type="text" required=true  
                  class="menu-col-8" 
                  :value="address" @input="address = $event.target.value"
                      ></ion-input>
                 </ion-item>   

              <ion-item >                  
                  <ion-label position="floating">{{i18n.t('frontend.order.postalCode')}} <strong style="color: red">*</strong></ion-label>                                                                                                    
                  <ion-input type="tel" required=true  :key="key"
                  class="menu-col-8" 
                  :value="zipCode" @change="zipCode=ValidateCodeInModal( $event.target.value)"
                      ></ion-input> 
              </ion-item>  

               <ion-item >                 
                  <ion-label position="floating">{{i18n.t('frontend.order.ccode')}} <strong style="color: red">*</strong></ion-label>                               
                  <ion-input type="tel" required=true  
                  class="menu-col-8"
                  :value="cardCode" @input="cardCode = $event.target.value"
                      ></ion-input>
              </ion-item>   

            </div>

    

            <div style="padding: 20px 15px; text-align: center">

                <ion-button :disabled="spinner1? true: false"  fill="outline" @click="cancel">{{i18n.t('frontend.home.cancel')}}</ion-button>
                <ion-button :disabled="spinner1 || !canPay? true: false"
                fill="outline" 
                 @click="senPayment">{{i18n.t('frontend.home.acept')}}</ion-button>

                <div v-if="spinner1" style="margin: 10px">
                    <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
                </div>

            </div>

       
    </div>
        
      

    </div>
</template>

<script>
import LibCodes from 'zipcodes'
import {i18n} from '@/plugins/i18n'

export default {
    name: 'UsbCardReader',

    created: async function(){ 
        this.i18n = i18n;  
        this.callFunction()
        
    },  
    data() {
        return {  
            i18n: {},    
            interval: 2000,  
            spinner1: false,
            canPay: false, 
            cardCode: '', 
            moto: false,
            key: 0,
            zipCode: '',
            state:'',
            city: '',
            address: '',
        }
    }, 
    props:{
        parent: {type: Object, default: ()=> {}} ,        
    },   
    
    methods:{

       

         async callFunction() {   
            if (navigator.usb) { 
                 try {                     
                    let device = await navigator.usb.requestDevice({ filters: [{ vendorId: 0xACD }]});
                    if(device){
                        document.getElementById('target').focus();
                    }
                    else
                        return this.error('Not USB device connected.');
                   
                } catch (error) {                      
                    console.log(error);
                    return this.error('Not USB device connected.');
                }                 
            } else {               
                return this.error('WebUSB not supported. Try another payment method.')
            }
        },

        noData(){

            if(document.getElementById('target')){
                 const val = document.getElementById('target').value;
                if(val !== '')
                      this.canPay = true;
            }
        },

        cancel(){
             return this.$ionic.modalController.dismiss();
        },

        senPayment(){

             const val = document.getElementById('target').value;

            if(this.moto)
                if(this.cardCode=== ''|| this.zipCode=== '' || this.address === '')
                    return this.alertRequiredDatas();

           
            if(val){
                var hex = val.toString('hex'); 
                const data = {
                    hex : hex,
                    address: this.address,
                    zip: this.zipCode,
                    cardSecurityCode: this.cardCode,
                }
                return this.parent.responseIDTEch(data);
            }
            else
                return this.error('Enter manualy Card number and wait the info was write in te textarea.')
            
        },

        async error(message) {
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
                message: this.i18n.t('frontend.home.zipCodeNotValid') ,
                buttons: [                   
                {
                    text: this.i18n.t('frontend.home.acept'),
                    handler: () => {  },
                },
                ],
            })
            .then(a => a.present())
                        
        },

    async toastCityState() {
      return this.$ionic.toastController
      
        .create({
          message: `${this.i18n.t('frontend.home.city')}: ${this.city} | ${this.i18n.t('frontend.home.state')}: ${this.state}`,
          duration: 2000,
          position: 'top',
          color:'success'
        })
      .then(a => a.present())
    },
   
      alertRequiredDatas(){
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: 'Error',
          message: this.i18n.t('frontend.home.errorRequired'),
          buttons: [                   
          {
              text: this.i18n.t('frontend.home.acept'),
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