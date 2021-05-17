<template>
    <div>
         <div v-if="spinner">
            <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
        </div>
        <div  v-if="!spinner">

            <ion-header>
                <ion-toolbar>
                    <div class="menu-col-6" style="margin: 0 auto; float: left;">
                      <h3 style="float: left;">{{$t('frontend.menu.about')}}</h3>
                     
                    </div>
                    
                    <ion-select interface="popover" icon="add" class="menu-col-6" style="margin-top: 20px;text-align: right;"
                       v-if="allRestaurants.length > 0 && hasOptionToShowOtherRestaurants()"
                       :ok-text="$t('backoffice.form.messages.buttons.ok')"
                        :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
                        :value="restaurantSelectedId"
                        :placeholder="$t('frontend.menu.restaurant')"
                        @ionChange="callChangeRestaurant($event.target.value)" >
                        <ion-select-option v-for="res in allRestaurants"                    
                            :key="res._id" 
                            :value="res._id" >{{res.Name}}
                        </ion-select-option>
                    </ion-select>
                </ion-toolbar>
            </ion-header>

            
          <div  style=" padding-top: 10px;">           
              <star-rating  v-if="configuration.viewRating" :key="key"
                    v-bind:readOnly="isReadOnlyRating()"
                    v-bind:increment="1"
                    v-bind:star-size="20" 
                     v-bind:animate="true" 
                    v-bind:rating="totalAllRating()"
                    @rating-selected ="setRating"
                    style="display: block; padding-top: 10px;"
                > </star-rating>
                <a @click="goMenu" v-if="menuListSinCatering.length > 0 && hasOptionToShowMenu()"  color="secondary" style="margin: 12px">
                    <span class="iconify" data-icon="bx:bx-food-menu" data-inline="false" style="width: 20px;height: 20px; margin: 0;"></span>
                    <ion-label style=" width: 80%; text-align: center;">{{$t('frontend.menu.menu')}}</ion-label>   
                </a>
                 <a @click="goCatering"  v-if="configuration.viewCatering && menuListConCatering.length > 0 && hasCardPayCat() " color="secondary" style="margin: 12px">
                    <span class="iconify" data-icon="bx:bx-food-menu" data-inline="false"  style="width: 20px;height: 20px; margin: 0;"></span>
                    <ion-label style=" width: 80%; text-align: center;">{{$t('frontend.menu.menuCatering')}}</ion-label>   
                </a>
          </div>

          <ion-car >
                <ion-slides pager="true"  :options="slideOpts" >               

                <ion-slide v-for="about in abouts" :key="about._id"  >
                    <ion-card   style="padding:10px">
                        <ion-card-header>
                            <img :src="about.ImageUrl" style="display: inline;">
                            <ion-card-title>{{about.Title}}</ion-card-title>
                            <ion-card-subtitle>{{about.Subtitle}}</ion-card-subtitle>
                        </ion-card-header>
                        <ion-card-content>
                            {{about.Description}}
                        </ion-card-content>
                    </ion-card> 
               
                </ion-slide>

            </ion-slides> 
          </ion-car>

           <ion-card  v-if="!restaurantActive.customHours">
                <ion-card-title style="margin: 12px 0 0;">{{$t('frontend.reservation.restaurantHour')}}</ion-card-title>
                <ion-item v-for="(iterator, index) in restaurantActive.restaurantDaysAndTime " :key="index">
                    <p style=" width: 100%;text-align: center;">
                        {{ iterator.Day }}:    
                        {{getReservationHour(iterator.OpenHour)}}  -  {{getReservationHour(iterator.CloseHour)}}</p>
                </ion-item>                    
            </ion-card>
            <ion-card v-if="restaurantActive.customHours">
                <ion-card-title style="margin: 12px 0 0;">{{$t('frontend.reservation.restaurantHour')}}</ion-card-title>                    
                    <ion-item >
                    <p style=" width: 100%;text-align: center;">
                        {{restaurantActive.customHoursText}}</p>
                </ion-item>
            </ion-card>

            <ion-card   ion-card v-if="restaurantActive.UrlLocation"> 
                <iframe :src="embebedMap" style="width: 100%; height: 200px;"></iframe>
            </ion-card>

            
         <v-breakpoint> 
           
           <!-- size="6"  -->
           
            <ion-row slot-scope="scope">
                <ion-col 
                :size="scope.isSmall || scope.noMatch ?'12' :  '6'"
                style="border: 0px !important;">
                     <ion-list>
                        <ion-icon name="pin" color="primary"></ion-icon> <div>{{restaurantActive.restaurantAddress}}</div>
                    </ion-list>  

                     <ion-list>
                        <ion-icon name="mail" color="primary"></ion-icon><div>{{restaurantActive.restaurantEmail}}</div>
                    </ion-list> 

                   

                                         
                </ion-col>

                

                <ion-col 
                :size="scope.isSmall || scope.noMatch ?'12' : '6' "
                 style="border: 0px !important;">

                     <ion-list v-if="restaurantActive.restaurantPhone">
                        <ion-icon name="call" color="primary"></ion-icon><div>{{restaurantActive.restaurantPhone}}</div>
                    </ion-list>
                     <ion-list v-if="restaurantActive.Fax">
                        <ion-icon name="print" color="primary"></ion-icon><div>{{restaurantActive.Fax}}</div>
                    </ion-list>                   
                    <ion-list v-if="restaurantActive.restaurantWeb!=''">
                        <ion-icon name="globe" color="primary" ></ion-icon> <div><a :href="restaurantActive.restaurantWeb">{{restaurantActive.restaurantWeb}}</a></div>
                    </ion-list>
                                            
                    
                </ion-col>
            </ion-row>

         </v-breakpoint>

            <!-- <div>
                <ion-label >
                    <ion-card-title style="margin: 12px 0 0;">Constact US</ion-card-title>                   
                </ion-label>

                <div                
                    style="max-width: 600px; margin: 0 auto; border: 1px solid #ececec;">
                    <ion-item >
                        <ion-label position="floating">{{$t('frontend.orderType.email')}} <strong style="color: red">*</strong> </ion-label> 
                        <ion-input  
                                :value="emailContact"
                                @input="emailContact = $event.target.value" 
                                @change="validateEmail" ></ion-input>
                    </ion-item> 
                    <ion-item >
                        <ion-label position="floating">Su Mensaje <strong style="color: red">*</strong> </ion-label> 
                        <ion-textarea @ionChange="msgContact = $event.target.value" :value="msgContact"></ion-textarea>
                    </ion-item>                  
                    <div style="display: inline-table;">
                       <vue-recaptcha 
                        :loadRecaptchaScript="true"
                            @verify="onVerify"
                            :sitekey="captchaKey">
                        </vue-recaptcha>
                    </div>
                    <ion-button expand="full" color="primary" @click="sendContactMsg()">                        
                        Send Message
                        <ion-spinner v-if="spinnerEmail" name="crescent" style="margin: 0 20px;"></ion-spinner>
                    </ion-button>
                </div>
               
            </div> -->


         
        <ion-item> 
                <div style="position: absolute; bottom: 0;text-align: center;width: 100%;">
                  <a :href="restaurantActive.restaurantFacebok" v-if="restaurantActive.restaurantFacebok != ''" target="_blanc" v-tooltip="'Facebook'">
                    <span class="iconify" color="#3b5998"  data-icon="ion-logo-facebook" data-inline="false" ></span> 
                  </a>
                  <a :href="restaurantActive.restaurantTwitter" v-if="restaurantActive.restaurantTwitter != ''" target="_blanc" v-tooltip="'Twitter'">
                    <span class="iconify" color="#1DA1F2" data-icon="ion-logo-twitter" data-inline="false"></span> 
                  </a>
                  <a :href="restaurantActive.restaurantInstagram" v-if="restaurantActive.restaurantInstagram != ''" target="_blanc" v-tooltip="'Instagram'">
                    <span class="iconify" color="#8a3ab9" data-icon="ion-logo-instagram" data-inline="false"></span> 
                  </a>
                  <a :href="restaurantActive.restaurantYoutube" v-if="restaurantActive.restaurantYoutube != ''" target="_blanc" v-tooltip="'Toutube'">
                    <span class="iconify" color="#FF0000" data-icon="ion-logo-youtube" data-inline="false"></span>  
                  </a>
                  <!-- <a :href="restaurantActive.restaurantWeb" v-if="restaurantActive.restaurantWeb != ''" target="_blanc">
                    <span class="iconify" color="primary" data-icon="foundation:web" data-inline="false"></span>  
                  </a> -->
                  <a @click="shareUrlLocation()" v-if="restaurantActive.UrlLocation != ''" target="_blanc" v-tooltip="$t('frontend.tooltips.shareLocation')">
                    <span class="iconify" data-icon="si-glyph:pin-location-2" data-inline="false"></span> 
                  </a>
                </div> 
        </ion-item>  
         
           
            


        </div>
    </div>

    
</template>


  <script src="https://unpkg.com/vue@latest/dist/vue.js" defer></script>
  <script src="https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit" async defer></script>
<script>

import StarRating from 'vue-star-rating'
import { add } from "ionicons/icons";
import { addIcons } from "ionicons";
 import moment from 'moment-timezone';
  import { VBreakpoint } from 'vue-breakpoint-component'

addIcons({
  "ios-add": add.ios,
  "md-add": add.md
});

import { Api } from '../../backoffice/api/api';
import { EventBus } from '../event-bus';
import Moment from 'moment'
import { Plugins } from '@capacitor/core';
const { Share } = Plugins;
// import VueRecaptcha from 'vue-recaptcha';

export default {
    name: 'About',
    created: async function(){


        this.allRestaurant = this.$store.state.allRestaurant;
        this.configuration = this.$store.state.configuration;
        this.restaurantActive = this.$store.state.restaurantActive       
        this.allRestaurants= this.allRestaurant.filter(p => p._id != this.restaurantSelectedId);        
        this.sliderstData();

       const res = await Api.getCaptchaKey(this.restaurantSelectedId)
        this.captchaKey = res.data

        EventBus.$on('updateCustomer', (value) => {if(value) 
            this.clientId= this.$store.state.customer._id; });

        this.groupingDateandTime = [];   
        this.rating = this.$store.state.restaurantActive.rating; 
        this.hasRating= this.$store.state.hasRating; 
         if(this.$store.state.customer._id)
         this.clientId= this.$store.state.customer._id;  

        if(this.restaurantActive.UrlLocation){
            let location = this.restaurantActive.UrlLocation.split('g.page/')
            if(location.length > 0)
                this.embebedMap += location[1];
        }
            

        }, 
    data() {
        return {           
            slideOpts:{speed: 400, slideShadows: true, initialSlide:1,  slidesPerView: 3,},
            abouts: [],
            spinner: false,
            allRestaurant: [],   
            allRestaurants: [], 
            groupingDateandTime: [],
            rating: [],
            configuration: {},
            restaurantActive: {},
            clientId:'',
            hasRating: false,
            key: 0,
            embebedMap: 'https://www.google.com/maps/embed/v1/place?key=AIzaSyBawocz2WyVtKJaJx58SBKZewY1JRONmjk&q=',
            emailContact: '',
            msgContact: '',
            spinnerEmail: false,
            sitekey: "6LdVK4IaAAAAAECLMi3WkdELlSJ6bCpFOZAMcsAO",
            captchaKey: '',
        }
    },
    props: {     
    restaurantSelectedId:  {type: String, default:"" } ,
    menuListSinCatering: {type: Array, default:() => [] },
    menuListConCatering: {type: Array, default:() => [] },   
  },  
  components:{
   StarRating,
   VBreakpoint,
//    VueRecaptcha ,
  },
    methods:{
        sliderstData: function(){
            this.spinner =true
            Api.fetchAll("About").then(response => {                        
                if(response.status === 200){                     
                     
                     this.abouts = response.data;
                      this.spinner = false 
                }  
            })
            .catch(e => {
                this.spinner = false
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
                });
        },

        callChangeRestaurant: function(restaurantId){
            this.spinner = true;
            EventBus.$emit('updateRestaurantSelectedId',restaurantId);
        },
    
        setRating: async function(rating){
         if( this.clientId===''){           
            return this.notPermissionForRating()
         }           
       
         this.rating.push ({'rating':parseFloat(rating), 'date':new Moment()});                
        this.updateRestaurantRating();
         this.totalAllRating();
         this.thanksForRating();        
        },

        totalAllRating: function(){
            let totalRating = 0;
            
            if(this.rating.length > 0)
            {
                this.rating.forEach(r => totalRating += r.rating);            
                totalRating = totalRating / this.rating.length;           
                return totalRating
            }
            return totalRating
        },

        updateRestaurantRating(){          

             Api.fetchById("Restaurant",  this.restaurantSelectedId).then(response => {                        
                if(response.status === 200){ 
                    response.data.rating = this.rating;    
                    Api.putIn("Restaurant",  response.data).then(response1 => {                        
                        if(response1.status === 200){ 
                            this.hasRating = true;
                            this.key ++;
                            this.$store.commit('setHasRating',true) ;

                            const restaurant = this.$store.state.restaurantActive
                            restaurant.rating = this.rating
                            this.$store.commit('setRestaurantActive',restaurant) ;

                            
                        }  
                    })
                    .catch(e => {
                        this.spinner = false
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
                         });  
                }  
            })
            .catch(e => {
                this.spinner = false
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
                    });
        },

        isReadOnlyRating(){
            if(this.hasRating)
                return true;
            if(this.clientId === '')
                return true;
            return false;
        },

        async notPermissionForRating() {
        return this.$ionic.toastController      
            .create({               
                message:  this.$t('frontend.app.notPermissionForRating'),
                duration: 1000,
                position: 'top',
                color:'warning'
                })
        .then(a => a.present())
        },

        async thanksForRating() {
        return this.$ionic.toastController      
            .create({               
                message:  this.$t('frontend.app.thanksForRating'),
                duration: 600,
                position: 'top',
                color:'success'
                })
        .then(a => a.present())
        },

        async emailSended() {
        return this.$ionic.toastController      
            .create({               
                message:  this.$t('frontend.home.emailSended'),
                duration: 600,
                position: 'top',
                color:'success'
                })
        .then(a => a.present())
        },

        goMenu: function(){
        return this.$router.push({ name: 'Home' })
        },

        goCatering: function(){
        return this.$router.push({ name: 'Catering'  })
        },      

       getReservationHour(thisHour){
        return  moment.tz(thisHour, moment.tz.guess()).format('hh:mm A') 
      },

      verifyDayInArrayRegoup(day){
          let flag = false
          for (const iterator of this.groupingDateandTime) {            
              if(iterator.Day.substr(day)){
                  flag = true;
              }              
          }
          return flag;

      },

     hasCardPayCat(){
      if(this.configuration.payForQuotation){
        if(!this.restaurantActive.hasPaymentCardConfig)
          return false;
        return true;
      }
       return true;
    },
       hasOptionToShowMenu(){
      if(!this.restaurantActive.hasPaymentCardConfig && !this.configuration.viewOnTable)
        return false;
      return true;      
    },

    hasOptionToShowOtherRestaurants(){
      if(this.configuration.showOtherRestaurant)
        return true;
      return false;      
    },

      async shareUrlLocation(){
      try {
         
          await Share.share({
            title: 'Location ' +' / '+ this.restaurantActive.restaurantName,
            // text: name +' / '+ this.restaurantName,
            url: this.restaurantActive.UrlLocation,
            dialogTitle: `Share Location ${this.restaurantActive.restaurantName}`
          });

      } catch (error) {        
         this.getError(error);
        
      }
    },
    
    async getError(message) {
      return this.$ionic.toastController
    
      .create({
        message: message,
        duration: 2000,
        position: 'top',
        color:'danger'
      })
    .then(a => a.present())
  },


   validateEmail(){
        let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
        if (emailRegex.test(this.emailContact) == false){
            this.emailContact = '';
            return this.alertEmailNotValid();
        }
    },

     alertEmailNotValid(){
        this.email =''
        return  this.$ionic.alertController
        .create({
            cssClass: 'my-custom-class',
            header: 'Error',
            message: this.$t('frontend.home.notValidEmail') , 
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

  async sendContactMsg(){
      if(this.emailContact !=='' && this.msgContact !==''){

        var html =' <html><head>';    
        html +='<style> .progressBar { width: 100%;  border-bottom: 1px solid black;display: list-item;list-style: unset; padding: 0}';
        html += '.progressBar li {list-style-type: none; float: left; position: relative; text-align: center; margin:0}';
        html += '.progressBar li .before {content: " "; line-height: 30px; border-radius: 50%; width: 30px; height: 30px; border: 1px solid #ddd;';
        html += 'display: block;text-align: center;margin: 0 auto 10px;background-color: white}';
        html += '.progressBar li .after { content: "";position: absolute;width: 100%;height: 4px;background-color: #ddd;top: 15px;left: -50%;z-index: -1;}';
        html += '.progressBar li .one .after {content: none;}.progressBar li.active {color: black;}';
        html += '.progressBar li.active .before { border-color: #63ee68; background-color: #63ee68}.progressBar .active:after {background-color: #4ca44f;} </style>';
        
        html += '</head><body><div >';
        html += `<div> MESSAGE</div>`
        html += `<div> ${this.msgContact} </div>`
        html += `<div>FROM </div>`
        html += `<div> ${this.emailContact} </div>`       
        html += `</div></body></html>`;       


        var items = {
        "email": this.restaurantActive.restaurantEmail,
        "mess": html,
        "subject": 'Contact from: '+ this.emailContact +' to ' + this.restaurantActive.restaurantName
        }

        try {
            this.spinnerEmail = true;
            await Api.sendEmail(items); 
            this.emailContact ='' ;
            this.msgContact =''  ;
            this.spinnerEmail = false;
            this.emailSended();
            
        } catch (error) {
            this.spinnerEmail = false;
        }
       


      }
  },

  callback: function (response) {
       console.log('callback')
       console.log(response)
      },

     onSubmit: function () {
      this.$refs.invisibleRecaptcha.execute()
    },
    onVerify: function (response) {
      console.log('Verify: ' + response)
    },
    onExpired: function () {
      console.log('Expired')
    },
    resetRecaptcha() {
         console.log('resetRecaptcha')
      this.$refs.recaptcha.reset() // Direct call reset method
    },



    },

    
        
}
   
</script>



<style scope="scoped" >
.vue-star-rating{
    display: block !important;
}
.swiper-container-horizontal>.swiper-pagination-bullets {
    bottom: 12px !important;
}


</style>