<template>
    <div>
        <ion-loading
          v-if="spinner"
          cssClass="my-custom-class"
          :message="$t('frontend.createNew.saving')"
        ></ion-loading>

         <modal v-if="restaurantType.length > 0 && restaurantTypeSelected !==-1" name="restaurant-type-modal"  width="80%" height="auto" style="left: 0px;width: auto;height: auto; max-width: 500px !important;">
               
                <ion-header>
                <ion-toolbar>
                     <ion-buttons slot="start" @click="hideRestaurantType()">
                        <ion-back-button default-href="home"></ion-back-button>
                    </ion-buttons>
                    <ion-title>{{$t('frontend.createNew.restaurantType')}}: {{restaurantType[restaurantTypeSelected].Type}}</ion-title>
                </ion-toolbar>
                </ion-header>

               <restaurant-type-show  :restaurantType="restaurantType[restaurantTypeSelected]"></restaurant-type-show>
        </modal>

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
                    <div slot-scope="scope" :key="key">

                        <ion-card >
                             <ion-card-title style="text-align: left;padding: 15px;">
                               {{$t('frontend.createNew.dataRestaurant')}}
                            </ion-card-title>
                            <ion-card-content>
                                <div  style="display: flex;justify-content: flex-start;align-items: center;">  
                                    
                                    <h2>{{$t('frontend.createNew.restaurantType')}}</h2>
                                    <ion-select interface="popover" icon="add" v-if="restaurantType.length > 0"
                                    style=""
                                    :ok-text="$t('backoffice.form.messages.buttons.ok')"
                                    :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
                                    :value="restaurantType[0].Type"
                                    :placeholder="$t('frontend.createNew.select')"
                                    @ionChange="restaurantTypeSelected=$event.target.value,defaultData=false"                          
                                >
                                        <ion-select-option v-for="(res, index) in restaurantType"                    
                                        :key="index" 
                                        :value="index" >{{res.Type}}
                                        </ion-select-option>                                
                                    </ion-select>
                                    <div v-if="restaurantTypeSelected !==-1" style="display: flex;">
                                        <div  v-if="restaurantType[restaurantTypeSelected].Datas.length > 0" @click="showRestaurantType()">
                                            <span  class="iconify" data-icon="ic:baseline-remove-red-eye" data-inline="false"></span>
                                        </div>
                                    </div>
                                            
                                </div>
                                <div v-if="restaurantTypeSelected !==-1">
                                    <div style="display: flex;justify-content: flex-start;align-items: center;"
                                    v-if="restaurantType[restaurantTypeSelected].Datas.length > 0" >
                                        <ion-label style="display: contents;">Cargar datos de prueba</ion-label>                                          
                                        <ion-toggle @ionChange="defaultData=$event.target.checked" :checked="defaultData"></ion-toggle>
                                    </div>
                                </div>
                                <ion-item    :class="scope.isSmall || scope.noMatch ?'menu-col-12 card-categories' : scope.isMedium? 'menu-col-6 card-categories': 'menu-col-4 card-categories'"  >
                                    <ion-label position="floating">{{$t('frontend.createNew.restaurantName')}}<strong style="color: red">*</strong></ion-label>                                          
                                    <ion-input type="text" required=true  
                                        :value="restaurantName" @input="restaurantName = $event.target.value"
                                    ></ion-input>
                                </ion-item>
                                <ion-item    :class="scope.isSmall || scope.noMatch ?'menu-col-12 card-categories' : scope.isMedium? 'menu-col-6 card-categories': 'menu-col-4 card-categories'" >
                                    <ion-label position="floating">{{$t('frontend.createNew.restaurantAddres')}}<strong style="color: red">*</strong></ion-label>                                          
                                    <ion-input type="text" required=true
                                        :value="restaurantAddres" @input="restaurantAddres = $event.target.value"
                                    ></ion-input>
                                </ion-item>
                                <ion-item    :class="scope.isSmall || scope.noMatch ?'menu-col-12 card-categories' : scope.isMedium? 'menu-col-6 card-categories': 'menu-col-4 card-categories'" >
                                    <ion-label position="floating">{{$t('frontend.createNew.restaurantZipcode')}}<strong style="color: red">*</strong></ion-label>                                          
                                    <ion-input type="text" required=true
                                        :value="restaurantZipcode" @change="restaurantZipcode=ValidateZipcode($event.target.value)"
                                    ></ion-input>
                                </ion-item>
                                <ion-item    :class="scope.isSmall || scope.noMatch ?'menu-col-12 card-categories' : scope.isMedium? 'menu-col-6 card-categories': 'menu-col-4 card-categories'" >
                                    <ion-label position="floating">{{$t('frontend.createNew.restaurantPhone')}}<strong style="color: red">*</strong></ion-label>                                          
                                    <ion-input type="text" required=true                                 
                                        :value="restaurantPhone" @input="restaurantPhone = $event.target.value"
                                        @change=" validatePhone($event.target.value, 'rest')"
                                    ></ion-input>
                                </ion-item>
                                <ion-item    :class="scope.isSmall || scope.noMatch ?'menu-col-12 card-categories' : scope.isMedium? 'menu-col-6 card-categories': 'menu-col-4 card-categories'"  >
                                    <ion-label position="floating">{{$t('frontend.createNew.restaurantEmail')}}<strong style="color: red">*</strong></ion-label>                                          
                                    <ion-input type="text" required=true                                 
                                        :value="restaurantEmail" @input="restaurantEmail = $event.target.value"  @change="validateEmail($event.target.value, 'rest')"
                                    ></ion-input>
                                </ion-item>
                                <ion-item    :class="scope.isSmall || scope.noMatch ?'menu-col-12 card-categories' : scope.isMedium? 'menu-col-6 card-categories': 'menu-col-4 card-categories'" >
                                    <ion-label position="floating">{{$t('frontend.createNew.restaurantWeb')}}</ion-label>                                          
                                    <ion-input type="text" required=true                                 
                                        :value="restaurantWeb" @input="restaurantWeb = $event.target.value"
                                    ></ion-input>
                                </ion-item>
                                <ion-item    :class="scope.isSmall || scope.noMatch ?'menu-col-12 card-categories' : scope.isMedium? 'menu-col-6 card-categories': 'menu-col-4 card-categories'" >
                                    <ion-label position="floating">{{$t('frontend.createNew.restaurantFax')}}</ion-label>                                          
                                    <ion-input type="text" required=true                                 
                                        :value="restaurantFax" @input="restaurantFax = $event.target.value"
                                    ></ion-input>
                                </ion-item>

                            </ion-card-content>
                        </ion-card>    

                         <ion-card >
                              <ion-card-title style="text-align: left;padding: 15px;">
                               {{$t('frontend.createNew.dataMercahnt')}}
                            </ion-card-title>                            
                            
                            <ion-card-content>
                            <ion-item    :class="scope.isSmall || scope.noMatch ?'menu-col-12 card-categories' : scope.isMedium? 'menu-col-6 card-categories': 'menu-col-4 card-categories'" >
                            <ion-label position="floating">{{$t('frontend.createNew.merchantName')}}<strong style="color: red">*</strong></ion-label>                                          
                            <ion-input type="text" required=true                                 
                                :value="merchantName" @input="merchantName = $event.target.value"
                            ></ion-input>
                            </ion-item>
                            <ion-item    :class="scope.isSmall || scope.noMatch ?'menu-col-12 card-categories' : scope.isMedium? 'menu-col-6 card-categories': 'menu-col-4 card-categories'" >
                                <ion-label position="floating">{{$t('frontend.createNew.merchantLastName')}}<strong style="color: red">*</strong></ion-label>                                          
                                <ion-input type="text" required=true                                 
                                    :value="merchantLastName" @input="merchantLastName = $event.target.value"
                                ></ion-input>
                            </ion-item>
                            <ion-item    :class="scope.isSmall || scope.noMatch ?'menu-col-12 card-categories' : scope.isMedium? 'menu-col-6 card-categories': 'menu-col-4 card-categories'" >
                                <ion-label position="floating">{{$t('frontend.createNew.merchantAddres')}}<strong style="color: red">*</strong></ion-label>                                          
                                <ion-input type="text" required=true
                                    :value="merchantAddres" @input="merchantAddres = $event.target.value"
                                ></ion-input>
                            </ion-item>
                            <ion-item    :class="scope.isSmall || scope.noMatch ?'menu-col-12 card-categories' : scope.isMedium? 'menu-col-6 card-categories': 'menu-col-4 card-categories'">
                                    <ion-label position="floating">{{$t('frontend.createNew.merchantZipcode')}}<strong style="color: red">*</strong></ion-label>                                          
                                    <ion-input type="text" required=true
                                        :value="merchantZipcode" @change="merchantZipcode=ValidateZipcode($event.target.value)"
                                    ></ion-input>
                            </ion-item>
                            <ion-item    :class="scope.isSmall || scope.noMatch ?'menu-col-12 card-categories' : scope.isMedium? 'menu-col-6 card-categories': 'menu-col-4 card-categories'" >
                                <ion-label position="floating">{{$t('frontend.createNew.merchantPhone')}}<strong style="color: red">*</strong></ion-label>                                          
                                <ion-input type="text" required=true                                 
                                    :value="merchantPhone" @input="merchantPhone = $event.target.value"
                                    @change=" validatePhone($event.target.value, 'merchant')"
                                ></ion-input>
                            </ion-item>
                            <ion-item    :class="scope.isSmall || scope.noMatch ?'menu-col-12 card-categories' : scope.isMedium? 'menu-col-6 card-categories': 'menu-col-4 card-categories'" >
                                <ion-label position="floating">{{$t('frontend.createNew.merchantEmail')}}<strong style="color: red">*</strong></ion-label>                                          
                                <ion-input type="text" required=true                                 
                                    :value="merchantEmail" @input="merchantEmail = $event.target.value"  @change="validateEmail($event.target.value, 'merchant')"
                                ></ion-input>
                            </ion-item>
                            <ion-item    :class="scope.isSmall || scope.noMatch ?'menu-col-12 card-categories' : scope.isMedium? 'menu-col-6 card-categories': 'menu-col-4 card-categories'" >
                                <ion-label position="floating">{{$t('frontend.createNew.merchantClerk')}}<strong style="color: red">*</strong></ion-label>                                          
                                <ion-input type="number" required=true                                 
                                    :value="merchantClerk" @input="merchantClerk = $event.target.value"  @change="validateClerk($event.target.value)"
                                ></ion-input>
                            </ion-item>

                            </ion-card-content>
                        </ion-card> 

                    </div> 
                </v-breakpoint>
        </div>
        <ion-input @ionChange="paymentRes=$event.target.value" id="newRestaurantPayment" ref="abc" style="display:none"></ion-input>

            <ion-button 
                :disabled="spinner? true: false" 
                @click="goInit()">
                {{$t('frontend.home.cancel')}}
            </ion-button>
           <ion-button 
                :disabled="spinner || !isValidForm()? true: false"                
                @click="paySpinner = true"
                :api_access_id="api_access_id"
                :location_id="location_id"
                version_number= "2.0"                        
                save_token= "true"
                method="schedule"
                :total_amount="amount.toString()"
                schedule_frequency="monthly"              
                schedule_continuous="true"
                :utc_time="utc"                      
                :signature="getSingleHash()" 
                order_number= "A030"
                callback="oncallback" 
                collect_shipping_address="false"
                :billing_company_name="restaurantName"
                :billing_name="merchantName +' ' +merchantLastName"
                :name_last="merchantLastName"  
            >
           {{$t('frontend.payment.splitToPay')}}
            <ion-spinner name="crescent" v-if="paySpinner"> </ion-spinner>
        </ion-button>
           

    </div>

    
</template>


  
<script>




import LibCodes from 'zipcodes'
import { parsePhoneNumber } from 'libphonenumber-js'
import { Api } from '../../backoffice/api/api.js';
import md5 from "crypto-js/hmac-md5";
import RestaurantTypeShow from './RestaurantTypeShow.vue'
import { VBreakpoint } from 'vue-breakpoint-component'

export default {
    name: 'NewRestaurant',
    created: async function(){
        await this.getUTC(); 
        await this.fetchRestaurantType();     
    }, 
    components:{
        RestaurantTypeShow,
         VBreakpoint,
    },
    props: {  
       parent: {type: Object, default: () => {} },
     },
     watch:{
         paymentRes(value) {
            this.paySpinner = false;
            const response = JSON.parse(value);
            if(response.event === 'success'){
                console.log('Obtener el valor del response.trace_number y guardar restaurante');
                this.makePayment(response.trace_number);
            }
            if(response.event === 'failure'){
                console.log('Obtener el valor del response.response_description y guardar restaurante');
                this.openMs(response.response_description, 'danger');
            }


         }
     },
    data() {
        return {  
        //    parent: {} ,
           appLoginId: 'hfIU9scKMj',
           amount: 59.00,
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
           merchantZipcode: '',
           merchantPhone: '',
           merchantEmail: '',
           merchantClerk: '',
           key: 0,
           merchantCity: '',
           merchantState: '',
           utc: '',
           api_access_id: '442f701ee5d25cf1b4ab6592d0b670a5',
           api_secure_key: 'c477ce46b6fcbad91bb30ebd5f69488f',
           srcToForte: 'https://swp.paymentsgateway.net/co/default.aspx',
           location_id: "277674",
           paymentRes: '',
           paySpinner: false,
           restaurantType: [],
           restaurantTypeSelected: -1,
           defaultData: false,
        }
    },  
    methods:{
        goInit(){
            this.parent.newRestaurant = false; 
            this.parent.showNew = false; 
            this.parent.getAllRestaurant();  
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

        async makePayment(traceNumber){

            if(!this.isValidForm())
              return this.openMs(this.$t('frontend.home.errorRequired'), 'danger');

            this.spinner = true;

            const res = {
                "Name": this.restaurantName,
                "Address": this.restaurantAddres,
                "Phone": this.restaurantPhone,
                "Email": this.restaurantEmail,               
                "ZipCode": this.restaurantZipcode, 
                "TraceNumber" : traceNumber,              
                "UserSettings": {
                    "FirstName": this.merchantName,
                    "LastName": this.merchantLastName,
                    "Address": this.merchantAddres,
                    "Phone": this.merchantPhone,
                    "Email": this.merchantEmail,
                    "ServerId": this.merchantClerk
                    }
                }
            if(this.restaurantFax !== '') res.Fax = this.restaurantFax;
            if(this.restaurantWeb !== '') res.Web = this.restaurantWeb;
            if(this.defaultData && this.restaurantTypeSelected !==-1)
                res.defaultData = this.restaurantType[this.restaurantTypeSelected]._id;
            

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

      
          getSingleHash(){
            if(this.utc !== ''){
                let md5String = `${this.api_access_id}|schedule|2.0|${this.amount}|${this.utc}|A030||`
                const signature = md5(md5String, this.api_secure_key); 
                return signature
            }
            return ''
        },
       
        async getUTC(){
            try {
              
               const response = await Api.getUtc();
              
               let resp = response.data.replace('(', '');
                resp = resp.replace(')', '');
                resp = resp.replace(';', '');
                this.utc = resp
            } catch (error) {
              console.log(error)  ;
            }
        }, 

        fetchRestaurantType: async function(){
           
            try {
                const response = await Api.fetchAll('restauranttype')
                this.restaurantType = response.data;               
                
            } catch (error) {
                error;
                
            }   
        },

        showRestaurantType () {
            this.$modal.show('restaurant-type-modal');
        },
        
        hideRestaurantType () {
         this.$modal.hide('restaurant-type-modal');
        },


    },

    
        
}   
</script>



<style >

.fortebtn {
  background-color: transparent !important;
    border: none !important;
    padding: 0 !important;
}
  .card-categories{
      float: left;
      margin: 0;
      /* height: 150px; */
      padding: 10px 2px;
    }

</style>