<template>
    <div>
         <div v-if="spinner">
            <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
        </div>

        <div >

            <ion-header>
                <ion-toolbar>
                    <ion-buttons slot="start" @click="goInit()" >
                        <ion-back-button default-href="/"></ion-back-button>
                    </ion-buttons>
                    <div style="margin: 0 auto; ">
                      <h3 >{{$t('frontend.createNew.createTitle')}}</h3>                     
                    </div>                   
                </ion-toolbar>
            </ion-header> 
            
         <v-breakpoint> 

             <div slot-scope="scope">

                 <ion-card  :class="scope.isSmall || scope.noMatch ? 'menu-col-12' : 'menu-col-8'" style="margin: 0 auto;">

                     <ion-card-header>
                        <strong style="font-size: 18px;">{{$t('frontend.createNew.dataRestaurant')}}</strong>
                     </ion-card-header>

                     <ion-card-content :key="key">
                        <ion-item :disabled="spinner? true: false"  >
                            <ion-label position="floating">{{$t('frontend.createNew.restaurantName')}}<strong style="color: red">*</strong></ion-label>                                          
                            <ion-input type="text" required=true  
                                :value="restaurantName" @input="restaurantName = $event.target.value"
                            ></ion-input>
                        </ion-item>
                        <ion-item :disabled="spinner? true: false" >
                            <ion-label position="floating">{{$t('frontend.createNew.restaurantAddres')}}<strong style="color: red">*</strong></ion-label>                                          
                            <ion-input type="text" required=true
                                :value="restaurantAddres" @input="restaurantAddres = $event.target.value"
                            ></ion-input>
                        </ion-item><ion-item :disabled="spinner? true: false" >
                            <ion-label position="floating">{{$t('frontend.createNew.restaurantZipcode')}}<strong style="color: red">*</strong></ion-label>                                          
                            <ion-input type="text" required=true
                                :value="restaurantZipcode" @change="restaurantZipcode=ValidateZipcode($event.target.value)"
                            ></ion-input>
                        </ion-item>
                        <ion-item :disabled="spinner? true: false"  >
                            <ion-label position="floating">{{$t('frontend.createNew.restaurantPhone')}}<strong style="color: red">*</strong></ion-label>                                          
                            <ion-input type="text" required=true                                 
                                :value="restaurantPhone" @input="restaurantPhone = $event.target.value"
                                @change=" validatePhone($event.target.value, 'rest')"
                            ></ion-input>
                        </ion-item>
                         <ion-item :disabled="spinner? true: false"  >
                            <ion-label position="floating">{{$t('frontend.createNew.restaurantEmail')}}<strong style="color: red">*</strong></ion-label>                                          
                            <ion-input type="text" required=true                                 
                                :value="restaurantEmail" @input="restaurantEmail = $event.target.value"  @change="validateEmail($event.target.value, 'rest')"
                            ></ion-input>
                        </ion-item>
                        <ion-item :disabled="spinner? true: false"  >
                            <ion-label position="floating">{{$t('frontend.createNew.restaurantWeb')}}</ion-label>                                          
                            <ion-input type="text" required=true                                 
                                :value="restaurantWeb" @input="restaurantWeb = $event.target.value"
                            ></ion-input>
                        </ion-item>
                         <ion-item :disabled="spinner? true: false"  >
                            <ion-label position="floating">{{$t('frontend.createNew.restaurantFax')}}</ion-label>                                          
                            <ion-input type="text" required=true                                 
                                :value="restaurantFax" @input="restaurantFax = $event.target.value"
                            ></ion-input>
                        </ion-item>

                        <ion-separator></ion-separator>

                     <ion-card-header>
                         <strong style="font-size: 18px;">{{$t('frontend.createNew.dataMercahnt')}}</strong>
                         
                     </ion-card-header>

                     <ion-item :disabled="spinner? true: false"  >
                        <ion-label position="floating">{{$t('frontend.createNew.merchantName')}}<strong style="color: red">*</strong></ion-label>                                          
                        <ion-input type="text" required=true                                 
                            :value="merchantName" @input="merchantName = $event.target.value"
                        ></ion-input>
                    </ion-item>

                    <ion-item :disabled="spinner? true: false"  >
                        <ion-label position="floating">{{$t('frontend.createNew.merchantLastName')}}<strong style="color: red">*</strong></ion-label>                                          
                        <ion-input type="text" required=true                                 
                            :value="merchantLastName" @input="merchantLastName = $event.target.value"
                        ></ion-input>
                    </ion-item>
                    <ion-item :disabled="spinner? true: false"  >
                        <ion-label position="floating">{{$t('frontend.createNew.merchantAddres')}}<strong style="color: red">*</strong></ion-label>                                          
                        <ion-input type="text" required=true
                            :value="merchantAddres" @input="merchantAddres = $event.target.value"
                        ></ion-input>
                    </ion-item>
                        <ion-item :disabled="spinner? true: false"  >
                            <ion-label position="floating">{{$t('frontend.createNew.merchantPhone')}}<strong style="color: red">*</strong></ion-label>                                          
                            <ion-input type="text" required=true                                 
                                :value="merchantPhone" @input="merchantPhone = $event.target.value"
                                 @change=" validatePhone($event.target.value, 'merchant')"
                            ></ion-input>
                        </ion-item>
                         <ion-item :disabled="spinner? true: false" >
                            <ion-label position="floating">{{$t('frontend.createNew.merchantEmail')}}<strong style="color: red">*</strong></ion-label>                                          
                            <ion-input type="text" required=true                                 
                                :value="merchantEmail" @input="merchantEmail = $event.target.value"  @change="validateEmail($event.target.value, 'merchant')"
                            ></ion-input>
                        </ion-item>
                        <ion-item :disabled="spinner? true: false" >
                            <ion-label position="floating">{{$t('frontend.createNew.merchantClerk')}}<strong style="color: red">*</strong></ion-label>                                          
                            <ion-input type="number" required=true                                 
                                :value="merchantClerk" @input="merchantClerk = $event.target.value"  @change="validateClerk($event.target.value)"
                            ></ion-input>
                        </ion-item>


                     </ion-card-content>

                     


                     <ion-button :disabled="spinner? true: false" @click="goInit()">{{$t('frontend.home.cancel')}}</ion-button>
                     <ion-button :disabled="spinner? true: false" @click="makePayment()">{{$t('frontend.payment.splitToPay')}}</ion-button>
                     <!-- <button api_login_id="9zqzgNyTHX"
                        method="sale"
                        version_number="1.0"
                        utc_time="635297928450733746"
                        hash_method="md5"
                        signature="ca04b269a6b475b070052dee3d4d108a"
                        callback="oncallback"
                        total_amount="{20,40,60,80,100,0};20">
                    Select Amount</button> -->

                 </ion-card>

             </div> 

         </v-breakpoint>

        </div>
    </div>

    
</template>
<script type="text/javascript" src="https://sandbox.forte.net/checkout/v1/js"></script>
	
<script>

import { VBreakpoint } from 'vue-breakpoint-component'
import { EventBus } from '../event-bus';
import LibCodes from 'zipcodes'
import { parsePhoneNumber } from 'libphonenumber-js'
import { Api } from '../../backoffice/api/api.js';

export default {
    name: 'NewRestaurant',
    created: async function(){

    }, 
    props: {  
        parent: {type: Object, default: ()=> {}} ,
     },
    data() {
        return {  
           spinner: false,
           restaurantName: '',
           restaurantAddres: '',
           restaurantPhone: '',
           restaurantZipcode: '',
           restaurantEmail: '',
           restaurantWeb: '',
           restaurantFax: '',
           merchantName: '',
           merchantLastName: '',
           merchantAddres: '',
           merchantPhone: '',
           merchantEmail: '',
           merchantClerk: '',
           key: 0,
        }
    },  
    components:{
        VBreakpoint,
    },
    methods:{
        goInit(){
            this.parent.newRestaurant = false;  
            this.$router.push({name: 'AppVue' });
        },
        isValidForm(){
            if(this.restaurantName === '' || this.restaurantAddres ==='' || this.restaurantPhone === '' ||
                this.restaurantZipcode === '' || this.restaurantEmail === '' || this.merchantName === '' ||
                this.merchantLastName === '' || this.merchantAddres === '' || this.merchantPhone === '' || 
                this.merchantEmail === '' || this.merchantClerk === '')
                return false;
            return true;
        },

        async makePayment(){

            if(!this.isValidForm())
              return this.openMs(this.$t('frontend.home.errorRequired'), 'danger');

            const res = {
                "Name": this.restaurantName,
                "Address": this.restaurantAddres,
                "Phone": this.restaurantPhone,
                "Email": this.restaurantEmail,               
                "ZipCode": this. restaurantZipcode,                
                "UserSettings": {
                    "FirstName": this.merchantName,
                    "LastName": this.merchantLastName,
                    "Address": this.merchantAddres,
                    "Phone": this.merchantPhone,
                    "Email": this.merchantEmail,
                    "ServerId": this.merchantClerk
                    }
                }
            if(this.restaurantFax !== '') res.Fax = this.restaurantFax
            if(this.restaurantWeb !== '') res.Web = this.restaurantWeb
            
            this.spinner = true;

            // AQUI ENLAZAR EL PAGO CON FORTE Y AL OBTENER LA RESPUESTA QUE SE GUARDE EL RESTAURANTE.

            await Api.newRestaurant(res);
            this.spinner = false;
             this.openMs(this.$t('frontend.createNew.createdMessage'), 'success'); 
            this.parent.newRestaurant = false; 
            this.parent.createdRestaurantEmail = this.merchantEmail;
            this.parent.newRestaurantKey ++;
            this.parent.openEnd();
            return this.$router.push({name: 'AppVue' });
        },

        validateEmail(value, model){
         let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
            if (emailRegex.test(value) == false){
                if(model === 'merchant') this.merchantEmail = ''
                else this.restaurantEmail = '';
                this.key ++;
                return this.openMs(this.$t('frontend.home.notValidEmail'), 'danger');
            }               
        },
     

        ValidateZipcode(event){
        this.key ++;
        
        var hills = LibCodes.lookup(event);   
        if(!hills){        
            this.restaurantZipcode = '';      
            this.openMs(this.$t('frontend.home.zipCodeNotValid'), 'danger') ;
            return '';     
        }     
        else{
            this.restaurantZipcode = event;        
            return event;
        }      
        },  

        validatePhone(value, model){     
            if (!value) return true;        
            try {
                const number = parsePhoneNumber(`+1${value}`);
        
                if (!number.isValid())  return false;         
                    
                if(model === 'merchant')   this.merchantPhone = parsePhoneNumber(`+1${value}`).formatNational();
                else   this.restaurantPhone = parsePhoneNumber(`+1${value}`).formatNational();
                return true;
            } 
            catch (err) {     
                return false;
            } 
        },    

        validateClerk(value){ 
            if(value <= 0) {
                this.merchantClerk = '';
                this.key ++;
                return this.openMs(this.$t('frontend.createNew.clerkNotValid'), 'danger');
            }
            if(value.toString().length > 5){
                this.merchantClerk = '';
                this.key ++;
                return this.openMs(this.$t('frontend.createNew.clerkToLong'), 'danger');
            }
        },

        async openMs(mss, color) {
            return this.$ionic.toastController      
            .create({
                header: '',
                message: mss,           
                position: 'middle',
                color: color,
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
    





    },

    
        
}   
</script>



<style scope="scoped" >



</style>