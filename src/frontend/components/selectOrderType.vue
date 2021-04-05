<template>
  <div>
    <ion-header>
      <ion-toolbar>
        <ion-title v-if="login">{{logIn}}</ion-title>
        <ion-title v-if="forgotPassword">{{restablacerPassword}}</ion-title>
        <ion-title v-if=" create"> {{createUser}}</ion-title>
        <ion-title v-if=" update !==''">{{updateData}}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">

      

    

      <div v-if="login">
            <ion-card-title>                
              <div style="text-align: right; margin: 2px 10px;"  >
                <ion-chip outline @click="create=true, login=false, forgotPassword = false" :disabled="spinner? true: false" >
                  <span class="iconify" data-icon="bx:bxs-user-plus" data-inline="false"></span>
                  <ion-label>{{register}}</ion-label>
                </ion-chip>             
              </div>
             
            </ion-card-title>
              <ion-card >                
                <ion-item> 
                  <ion-input type="email" name="email" :placeholder="placeholderEmail"
                  @input="email = $event.target.value" :value="email"
                  @change="validateEmail($event.target.value)">
                  </ion-input>
                </ion-item>
                <ion-item>
                  <ion-input type="password" name="password" :placeholder="placeholderPassword"
                  @input="password = $event.target.value"  :value="password">
                  </ion-input>
                </ion-item>
                <ion-item>
                  <ion-button :disabled="spinner? true: false" color="primary" class="menu-col-6" size="normal" @click="close">{{buttonCancel}}</ion-button>
                  <ion-button :disabled="spinner? true: false" color="primary" class="menu-col-6" size="normal" @click="customerLogIng">{{buttonAcept}}</ion-button>
                  
                </ion-item>
                <p style="font-size: 16px;text-align: right; padding: 0 20px;"><a :disabled="spinner? true: false"
                @click="create=false, login=false, forgotPassword = true">{{ forgotPasswordText }}</a></p>
                
            </ion-card>

             <div v-if="spinner" style="margin: 10px">
              <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
            </div>

      </div>

      <div v-if="forgotPassword">  
        <ion-card-title>                
              <div style="text-align: right; margin: 2px 10px;"  >
                <ion-chip outline @click="create=true, login=false, forgotPassword = false" :disabled="spinner? true: false">
                  <span class="iconify" data-icon="bx:bxs-user-plus" data-inline="false"></span>
                  <ion-label>{{register}}</ion-label>
                </ion-chip>             
              </div>
             
            </ion-card-title>         
        <ion-card >                
          <ion-item> 
            <ion-input type="email" name="email" :placeholder="placeholderEmail"
            @input="email=$event.target.value" :value="email"
            @change="validateEmail($event.target.value)">
            </ion-input>
          </ion-item>               
          <ion-item>
            <ion-button :disabled="spinner? true: false" color="primary" class="menu-col-6" size="normal" @click="close">{{buttonCancel}}</ion-button>
            <ion-button :disabled="spinner? true: false" color="primary" class="menu-col-6" size="normal" @click="restorePassword">{{buttonAcept}}</ion-button>                  
          </ion-item>               
        </ion-card>
       
        <div v-if="spinner" style="margin: 10px">
          <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
        </div>
        
      </div>

      <div v-if="create">       

        <ion-card  > 
          <ion-item> 
            <ion-input type="email" name="email" :placeholder="placeholderEmail"
            @input="email = $event.target.value" 
            v-bind:value="email" @change="duplicateEmail(email)">
            </ion-input>
          </ion-item>          
          <ion-item>
            <ion-input type="text" name="name" :placeholder="placeholderName"
            :disabled="clientId !='' && !update" @input="CustomerName = $event.target.value" 
            v-bind:value="CustomerName">
            </ion-input>
          </ion-item>

          <ion-item>
            <country-flag :country='country.country'/>
            <ion-select interface="popover" :disabled="clientId !='' && !update"
            @ionChange="country =JSON.parse($event.target.value), phone=''" 
            style="padding:0" 
            :selected-text="country.code">
                <ion-select-option v-for="con in countries"                    
                  :key="`${con.country}+${con.code}`"  
                  :text="con.name"             
                  :value="JSON.stringify(con)" >{{con.name}} ({{con.code}})          
                </ion-select-option>             
            </ion-select>
                      
            <ion-input type="text" name="phone" :placeholder="placeholderPhone" id="phone-validator"
            :disabled="clientId !='' && !update" @input="phone = $event.target.value"         
            v-bind:value="phone" @change="phone = validatePhone($event.target.value)">
            </ion-input>
          </ion-item>

          <ion-item>
            <ion-label>{{contactedBy}}</ion-label>
            <ion-select placeholder="Select One" interface="popover" :disabled="clientId !='' && !update" 
            :value="marketingEmail?'marketingEmail' : marketingPhone ? 'marketingPhone' :'' "
            @ionChange="changeMarketing($event.target.value)">
              <ion-select-option value="marketingEmail">{{placeholderEmail}}</ion-select-option>
              <ion-select-option value="marketingPhone">{{placeholderPhone}}</ion-select-option>
            </ion-select>
          </ion-item>

      

          <ion-item>
            <ion-button :disabled="spinner? true: false"  color="primary" class="menu-col-6" size="large" @click="close">{{buttonCancel}}</ion-button>
            <ion-button :disabled="spinner? true: false"  color="primary" class="menu-col-6" size="large" @click="saveCustomer">{{buttonAcept}}</ion-button>
          </ion-item>
       
        </ion-card> 

        <div v-if="spinner" style="margin: 10px">
          <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
        </div>
      </div>
      
      <div  v-if="update !==''">

        <ion-toolbar style=" margin: 0 0 30px 0;">
         
          
          <ion-segment @ionChange="$event.target.value === 'passw'? showPasswordTab = true : showPasswordTab = false" value="data">
            <ion-segment-button value="data">
              <span class="iconify" data-icon="bx:bxs-edit" data-inline="false" style="width: 15px;height: 15px;"></span> {{newData}}
              <!-- DATA -->
            </ion-segment-button>
            <ion-segment-button value="passw">
            <span class="iconify" data-icon="teenyicons:password-outline" data-inline="false"  style="width: 15px;height: 15px;"></span> {{newPassword}}
            <!-- PASSWORD -->
            </ion-segment-button>            
          </ion-segment>        
        </ion-toolbar>

        
         <ion-card  v-if="!showPasswordTab">             
            <ion-item> 
              <ion-input type="email" name="email" :placeholder="placeholderEmail"
              @input="email = $event.target.value" 
              v-bind:value="email" @change="validateEmail(email)">
              </ion-input>
            </ion-item>
            <ion-item>
              <ion-input type="text" name="name" :placeholder="placeholderName"
              :disabled="clientId !='' && !update" @input="CustomerName = $event.target.value" 
              v-bind:value="CustomerName">
              </ion-input>
            </ion-item>

            <ion-item>
              <country-flag :country='country.country'/>
              <ion-select interface="popover" :disabled="clientId !='' && !update"
              @ionChange="country =JSON.parse($event.target.value), phone=''" 
              style="padding:0" 
              :selected-text="country.code">
                  <ion-select-option v-for="con in countries"                    
                    :key="`${con.country}+${con.code}`"  
                    :text="con.name"             
                    :value="JSON.stringify(con)" >{{con.name}} ({{con.code}})          
                  </ion-select-option>             
              </ion-select>
                        
              <ion-input type="text" name="phone" :placeholder="placeholderPhone" id="phone-validator"
              :disabled="clientId !='' && !update" @input="phone = $event.target.value"         
              v-bind:value="phone" @change="phone = validatePhone($event.target.value)">
              </ion-input>
            </ion-item>

            <ion-item>
              <ion-label>{{contactedBy}}</ion-label>
              <ion-select placeholder="Select One" interface="popover" :disabled="clientId !='' && !update" 
              :value="marketingEmail?'marketingEmail' : marketingPhone ? 'marketingPhone' :'' "
              @ionChange="changeMarketing($event.target.value)">
                <ion-select-option value="marketingEmail">{{placeholderEmail}}</ion-select-option>
                <ion-select-option value="marketingPhone">{{placeholderPhone}}</ion-select-option>
              </ion-select>
            </ion-item>

        

            <ion-item>
              <ion-button :disabled="spinner? true: false"  color="primary" class="menu-col-6" size="large" @click="close">{{buttonCancel}}</ion-button>
              <ion-button :disabled="spinner? true: false"  color="primary" class="menu-col-6" size="large" @click="saveCustomer">{{buttonAcept}}</ion-button>
            </ion-item>
          
        </ion-card>  

        <ion-card  v-if="showPasswordTab">             
            
            <ion-item>
            <ion-input type="password" name="password" :placeholder="newPassword"
            @input="password = $event.target.value" >
            </ion-input>
          </ion-item>
          <ion-item>
            <ion-input type="password" name="password" :placeholder="confirmPassword"
            :key="key"
            :value="passwordConfirmed"
            @input="passwordConfirmed=$event.target.value"
            @change="validateConfirmPassWord()" :readonly="password===''? true: false" >
            </ion-input>
          </ion-item>

            <ion-item>
              <ion-button :disabled="spinner? true: false"  color="primary" class="menu-col-6" size="large" @click="close">{{buttonCancel}}</ion-button>
              <ion-button :disabled="spinner? true: false"  color="primary" class="menu-col-6" size="large" @click="resetPassword">{{buttonAcept}}</ion-button>
            </ion-item>
          
        </ion-card> 

         <div v-if="spinner" style="margin: 10px">
          <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
        </div>

      </div>   

       
    </ion-content>
  </div>
</template>

<script>
import { EventBus } from '../event-bus';
import { Api } from '../../backoffice/api/api'
import { findNumbers  } from 'libphonenumber-js'
import LibCodes from 'zipcodes'
import { countries } from '../../backoffice/utils/countries.js'
import CountryFlag from 'vue-country-flag'



export default {
  name: 'Modal',
  props: {
    parent: { type: Object, default:() => {} }, 
    title: { type: String, default: 'Super Modal' },   
    buttonAcept: { type: String },
    buttonCancel: { type: String },
    placeholderEmail: { type: String },
    placeholderName: { type: String },
    placeholderPhone: { type: String },  
    placeholderPassword: { type: String },
    requiredData: { type: String },   
    contactedBy: { type: String },
    restaurantEmail: { type: String },
    update: { type: String, default: '' },
    notValidEmail: { type:String },
    newRoute:  { type:String, default: '' },
    logIn: { type: String },
    register: { type: String },
    restablacerPassword: { type: String },
    updateData:  { type: String },
    forgotPasswordText: { type: String },
    createUser: { type: String },
    newPassword: { type: String },
    confirmPassword: { type: String },
    mssForgotPassword: { type: String },
    errorLogIn: { type: String },
    errEmailExist: { type: String },
    errPassNotCoinc:  { type: String },
    userNotFound: { type: String },
    newData: { type: String },
    mssUpdateData: { type: String },
    mssCreateUser: { type: String },
    mssPasswordChangedCorrectly: { type: String },
    
  },
  created: function(){
    
    if(this.update !=''){
      this.login = false;
      this.create = false;
      this.forgotPassword = false;
      this.getClient(this.update)
    }

  },
  
  data() {
    return {
      content: 'Content',

      CustomerName: '',
      email:'',
      password: '',
      passwordConfirmed:'',
      phone:'' ,
      marketingEmail: false,
      marketingPhone: true,
      Epos: [],
      clientId:'',
      spinner: false, 
      countries: countries,
      country: {
          country: 'US',
          code: '+1',
          name: 'United States',
        },
      countryCode: '+1',

      login: true,
      create: false,
      forgotPassword: false,
      showPasswordTab: false,
      key:0,
    }
  },
components:{  
  CountryFlag
  },
methods: {
  
  close() {
    if(this.update ==''){
      this.clientId = ''            
      this.CustomerName =''  
      this.phone = '' 
      this.email = '' 
      this.parent.$store.commit("setCustomer", {});
    }
 
    return this.$ionic.modalController.dismiss()
    },

  saveCustomer(){
    let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
      if (emailRegex.test(this.email) == false || this.email === this.restaurantEmail)
            return this.alertEmailNotValid();


    if(this.email ==='' || this.CustomerName ==='' || this.phone ==='')
      return this.alertRequiredDatas();
        
    var client = {'EmailAddress': this.email, "Password": this.password, 'Name':this.CustomerName,'Phone':this.phone, "Epos": this.Epos,
    'MarketingConsent' : {'Email': this.marketingEmail, "Phone" : this.marketingPhone },
    }

       
    if(this.clientId === ''){
      client.Phone = this.country.code + this.phone; 
      return this.createCustomer(client);
    }

     if(this.update !=''){
        client.Phone = this.country.code + this.phone;
       client._id = this.clientId
       Api.putIn('Customer', client)
      .then(response => {
        this.spinner = false; 
        
        this.parent.$store.commit("setCustomer", JSON.parse(JSON.stringify(response.data)));
        
        this.$ionic.alertController
          .create({
              cssClass: 'my-custom-class',
              header: '',
              message: this.mssUpdateData,
              buttons: [                   
              {
                  text: this.buttonAcept,
                  handler: () => {                               
                                
                  },
              },
              ],
          })
          .then(a => a.present())        
        return response;

      })
      .catch(e => {
         this.spinner = false;  
        return  this.$ionic.alertController
          .create({
              cssClass: 'my-custom-class',
              header: 'Error',
              message: e,
              buttons: [                   
              {
                  text: this.buttonAcept,
                  handler: () => {                                 
                                
                  },
              },
              ],
          })
          .then(a => a.present())       
      })
     }
     
  
    this.$ionic.modalController.dismiss()  
  },

  alertRequiredDatas(){
    return  this.$ionic.alertController
    .create({
        cssClass: 'my-custom-class',
        header: 'Error',
        message: this.requiredData,
        buttons: [                   
        {
          text: this.buttonAcept,
          handler: () => {                                 
                        
          },
        },
        ],
    })
    .then(a => a.present())
                
  },

  getClient(email){


    let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
      if (emailRegex.test(email) == false || email === this.restaurantEmail){
        this.email ="";
          return this.alertEmailNotValid();
      }           

    this.spinner = true;

   

    Api.findCustomerByEmail(email)
      .then(response => { 
        this.spinner = false; 
        if(response.data) { 
                    
          this.clientId = response.data._id            
          this.CustomerName = response.data.Name  
          this.phone = response.data.Phone 
          if(response.data.Epos)
            this.Epos = response.data.Epos  
          if(response.data.MarketingConsent){
            this.marketingEmail = response.data.MarketingConsent.Email
            this.marketingPhone = response.data.MarketingConsent.Phone
          }
          
          
          this.email = response.data.EmailAddress 
                     
         this.parent.$store.commit("setCustomer", JSON.parse(JSON.stringify(response.data)));
                    
          var nn = findNumbers(this.phone,{v2:true});
          if(nn.length > 0){
            var pais = this.countries.filter(p => p.country == nn[0].number.country)
            
            if(pais.length > 0){
              this.country = pais[0];
              this.phone = nn[0].number.nationalNumber;
            }
            
          }
               
        }                      
      })
      .catch(e => {
        this.spinner = false;
        return  this.$ionic.alertController
            .create({
                cssClass: 'my-custom-class',
                header: 'Error',
                message: e,
                buttons: [                   
                {
                    text: this.buttonAcept,
                    handler: () => {                                 
                                  
                    },
                },
                ],
            })
            .then(a => a.present())
      })

    },

  restorePassword(){
     if(this.email === '')
      return this.alertRequiredDatas();
    
    const item = {
       "EmailAddress": this.email      
    }
    this.spinner = true;
    Api.customerForgotPassword(item).then(response => { 
        this.spinner = false; 
        if(response.status === 200 ) {                     
          this.$ionic.modalController.dismiss()   
           return  this.$ionic.alertController
            .create({
                cssClass: 'my-custom-class',
                header: '',
                message: this.mssForgotPassword,
                buttons: [                   
                { text: this.buttonAcept,
                    handler: () => { },
                },
                ],
            })
            .then(a => a.present())
        }                      
      })
      .catch(e => {
        console.log(e);
        this.email = '';
        this.password = '';
        this.spinner = false;
        return  this.$ionic.alertController
          .create({
              cssClass: 'my-custom-class',
              header: 'Error',
              message: this.userNotFound,
              buttons: [                   
              {
                text: this.buttonAcept,
                handler: () => {},
              },
              ],
          })
          .then(a => a.present())
      })
  },

  async customerLogIng(){

    if(this.email === '' || this.password === '')
      return this.alertRequiredDatas();
    
    const item = {
      "EmailAddress": this.email,
      "Password": this.password
    }
    
    this.spinner = true;

    await Api.customerLogIn(item).then(response => { 
        this.spinner = false; 
        if(response.status === 200 ) {
          
          this.parent.$store.commit("setCustomer", JSON.parse(JSON.stringify(response.data)));                    
          this.clientId = response.data._id            
          this.CustomerName = response.data.Name  
          this.phone = response.data.Phone  
          if(response.data.MarketingConsent){
            this.marketingEmail = response.data.MarketingConsent.Email
            this.marketingPhone = response.data.MarketingConsent.Phone
          }
          
          this.email = response.data.EmailAddress 

          EventBus.$emit('updateCustomer', true); 
          EventBus.$emit('startCustomerCounter', true); 
         
         
          if(this.newRoute !== '')  EventBus.$emit('changeRoute', this.newRoute);   
          
          var nn = findNumbers(this.phone,{v2:true});
          if(nn.length > 0){
            var pais = this.countries.filter(p => p.country == nn[0].number.country)
            
            if(pais.length > 0){
              this.country = pais[0];
              this.phone = nn[0].number.nationalNumber;
            }            
          }
            this.$ionic.modalController.dismiss();               
        }                      
      })
      .catch(e => {
        console.log(e);
        this.email = '';
        this.password = '';
        this.spinner = false;
        return  this.$ionic.alertController
            .create({
                cssClass: 'my-custom-class',
                header: 'Error',
                message: this.errorLogIn,
                buttons: [                   
                {
                    text: this.buttonAcept,
                    handler: () => {                                 
                                  
                    },
                },
                ],
            })
            .then(a => a.present())
      })

    },

   validateEmail(email){

    let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
      if (emailRegex.test(email) == false || email === this.restaurantEmail){
        this.email ="";
        return this.alertEmailNotValid();
      } 
   },

  async duplicateEmail(email){

    let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
      if (emailRegex.test(email) == false || email === this.restaurantEmail){
        this.email ="";
        return this.alertEmailNotValid();
      }  
    this.spinner = true;
  
    try {
      const response = await Api.findCustomerByEmail(email);
      this.spinner = false;
      if(response){
        this.email='';
        return this.alertEmailExist()
      }
    } catch (error) {
      this.spinner = false;      
    }


    
    
    },

  createCustomer: function(client){
   
    this.spinner = true
    Api.postIn('Customer', client)
      .then(response => {
        if(response.status === 200){
           this.parent.$store.commit("setCustomer", JSON.parse(JSON.stringify(response.data)));
            this.spinner = false
            this.$ionic.modalController.dismiss() ;
            this.$ionic.alertController
              .create({
              cssClass: 'my-custom-class',
              header: '',
              message: this.mssCreateUser,
              buttons: [                   
              {
                  text: this.buttonAcept,
                  handler: () => {},
              },
              ],
          })
          .then(a => a.present())  
        }
                              
      })
      .catch(e => {
        this.spinner = false
        this.$ionic.modalController.dismiss() ;
        return  this.$ionic.alertController
            .create({
                cssClass: 'my-custom-class',
                header: 'Error',
                message: e,
                buttons: [                   
                {
                    text: this.buttonAcept,
                    handler: () => {                                
                                  
                    },
                },
                ],
            })
            .then(a => a.present())
      })
  },  

  validatePhone(phone){   
    
    if (!phone) {      
        document.querySelector('#phone-validator').style('border-bottom', '2px solid red'); 
      return '';
    }
    try {
      
      var nn= this.country.code+phone;
      const n = findNumbers(nn,{v2:true})      
      if (n.length < 1) { 
         document.querySelector('#phone-validator').style('border-bottom', '2px solid red');
        return '' 
      }
      else{       
        this.phone = n[0].number.number;
        return n[0].number.nationalNumber
      }  
     
    } 
    catch (err) {     
      return false;
    }

 
  },

 changeMarketing(value){
  if(value == 'marketingEmail'){
    this.marketingEmail = true;
    this.marketingPhone = false;
  }
    
  if(value == 'marketingPhone'){
    this.marketingEmail = false;
    this.marketingPhone = true;
  }
},

  ValidateCode(event){
    
    var hills = LibCodes.lookup(event);   
    if(!hills){
      this.state = "";
      this.city = "";
      this.code = '';
      return this.alertCodeNotValid();
    }  
    if(this.zipCodes.length > 0){
      const zip = this.zipCodes.filter(zc => zc === event);
      if(! zip.length >0 ){
        this.state = "";
        this.city = "";
        this.code = '';
        return this.alertNotZoneDelever();        
      }
      else{
        this.state = hills.state;
        this.city = hills.city;
      }      
    }
    
  },

  validateConfirmPassWord(){
    this.key ++;
    if(this.password !== this.passwordConfirmed){      
      this.passwordConfirmed = '';
        
      this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: 'Error',
          message: this.errPassNotCoinc ,
          buttons: [ {text: this.buttonAcept, handler: () => {  },},],
          })
          .then(a => a.present())
    }
  },

  resetPassword(){
    if(this.password === '' || this.passwordConfirmed ==='')
      return this.alertRequiredDatas();

     
    const item = {
       "Password": this.password,
       "_id": this.clientId      
    }
    this.spinner = true;
    Api.customerResetPassword(item).then(response => { 
        this.spinner = false; 
        if(response.status === 200 ) {                     
          this.$ionic.alertController
          .create({
              cssClass: 'my-custom-class',
              header: '',
              message: this.mssPasswordChangedCorrectly,
              buttons: [                   
              {
                  text: this.buttonAcept,
                  handler: () => {                                 
                                
                  },
              },
              ],
          })
          .then(a => a.present())      
            return this.$ionic.modalController.dismiss()   
        }                      
      })
      .catch(e => {
        this.spinner = false;
        return  this.$ionic.alertController
          .create({
              cssClass: 'my-custom-class',
              header: 'Error',
              message: e,
              buttons: [                   
              {
                text: this.buttonAcept,
                handler: () => {},
              },
              ],
          })
          .then(a => a.present())
      })


  },

  alertCodeNotValid(){
    return  this.$ionic.alertController
    .create({
        cssClass: 'my-custom-class',
        header: 'Error',
        message: this.zipCodeNotValid ,
        buttons: [                   
        {
          text: this.buttonAcept,
          handler: () => {                                 
                        
          },
        },
        ],
    })
    .then(a => a.present())                
  },

  alertNotZoneDelever(){
    return  this.$ionic.alertController
    .create({
        cssClass: 'my-custom-class',
        header: 'Error',
        message: this.deliveryZone,
        buttons: [                   
        {
          text: this.buttonAcept,
          handler: () => {                                 
                        
          },
        },
        ],
    })
    .then(a => a.present())
                
  },

  alertEmailNotValid(){
    return  this.$ionic.alertController
    .create({
        cssClass: 'my-custom-class',
        header: 'Error',
        message: this.notValidEmail,
        buttons: [                   
        {
          text: this.buttonAcept,
          handler: () => {                                 
                        
          },
        },
        ],
    })
    .then(a => a.present())
                
  },

  alertEmailExist(){
    return  this.$ionic.alertController
    .create({
        cssClass: 'my-custom-class',
        header: 'Error',
        message: this.errEmailExist,
        buttons: [                   
        {
          text: this.buttonAcept,
          handler: () => {                                 
                        
          },
        },
        ],
    })
    .then(a => a.present())
                
  },
}
 

}
</script>

<style>
  

  .menu-col-6{
    flex: 0 0 calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
}

</style>