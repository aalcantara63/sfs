<template>
    <div class="screen">
    <ion-backdrop v-if="isBackdrop"></ion-backdrop>

     <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'ControlPanel'})"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>{{title}}</h1>            
            </ion-label>
          </ion-toolbar>
    </ion-header>
    <br/>

    <!-- <ion-card> -->
    <div v-if="spinner">
        <ion-spinner name="lines" class="spinner"></ion-spinner>
    </div>
    <div v-else>
        <ion-item>
          <ion-label >{{$t('backoffice.form.fields.online')}}
          <ion-toggle name="online" style="top: 12px;"
          @ionChange="online=$event.target.checked" 
          :checked ="online">
          </ion-toggle></ion-label>
        </ion-item>

        <!-- <ion-item>
          <ion-label >{{$t('backoffice.form.fields.showOtherRestaurant')}}
          <ion-toggle name="showOthersRestaurant" style="top: 12px;"
          @ionChange="showOthersRestaurant=$event.target.checked" 
          :checked ="showOthersRestaurant">
          </ion-toggle></ion-label>
        </ion-item> -->

        <ion-item>
          <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.name')}}</ion-label>
          <ion-input type="text" name="name"
          @input="name = $event.target.value" 
          v-bind:value="name">
          </ion-input>
        </ion-item>        
        <ion-item>
          <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.address')}}</ion-label>
          <ion-textarea name="address" 
          @input="address = $event.target.value" 
          v-bind:value="address">
          </ion-textarea>
        </ion-item>
        <ion-item>
          <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.email')}}</ion-label>
          <ion-input type="email" name="email"
          @input="email = $event.target.value" 
          v-bind:value="email">
          </ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.phone')}}</ion-label>
          <ion-input type="tel" name="phone"
          @input="phone = $event.target.value" 
          v-bind:value="phone">
          </ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">{{$t('backoffice.form.fields.web')}}</ion-label>
          <ion-input type="text" name="web"
          @input="web = $event.target.value" 
          v-bind:value="web">
          </ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">{{$t('backoffice.form.fields.urlLocation')}}</ion-label>
          <ion-input type="text" name="urlLocation"
          @input="urlLocation = $event.target.value" 
          v-bind:value="urlLocation">
          </ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">{{$t('backoffice.form.fields.fax')}}</ion-label>
          <ion-input type="text" name="fax"
          @input="fax = $event.target.value" 
          v-bind:value="fax">
          </ion-input>
        </ion-item>

        <ion-item>
          <ion-card v-if="checkImage()" >
              <ion-img :src="file"></ion-img>
          </ion-card>
        </ion-item>
        <ion-item>
            <div>
                <ion-label><span style="color: red">*</span>{{$t('backoffice.form.fields.image')}}</ion-label>
            </div>
          <input type="file" accept="image/png, image/jpeg" @change="handleImage" />
        </ion-item>

        <!-- Currency -->
        <ion-item style="margin-top: 20px; margin-bottom: 20px">
          <ion-label>Restaturant currency</ion-label>
            <ion-select interface="popover" icon="add"
              :ok-text="$t('backoffice.form.messages.buttons.ok')"
              :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
              :value="currencyCode"
              placeholder="Select a currency"
              @ionChange="currencyCode = $event.target.value; change()">
                <ion-select-option v-for="curr in allCurrencies"                    
                  :key="curr.code" 
                  :value="curr.code" > {{curr.currency}} - {{curr.code}}
                </ion-select-option>
                
            </ion-select>
        </ion-item>
        <ion-item>
            {{example}}
        </ion-item>

        <!-- Horario del restaurante -->
        <ion-item>
            <h2>{{$t('backoffice.form.titles.restaurantHours')}}</h2>
        </ion-item>
        <ion-item>
              <ion-label>{{$t('backoffice.form.fields.sameHourForAllDays')}}</ion-label>
              <ion-checkbox slot="end" name="sameHourForAllDays" 
                    @ionChange="sameHourForAllDays = $event.target.checked; activeMonday = true"
                    :checked="sameHourForAllDays">
              </ion-checkbox>
        </ion-item>
        <div style="display: inherit">
            <ion-item>
                  <ion-checkbox v-if="!sameHourForAllDays" style="border-bottom: 1px solid lightgray; margin:5px" name="activeMonday" 
                        @ionChange="activeMonday = $event.target.checked"
                        :checked="activeMonday">
                  </ion-checkbox>
                  <ion-label v-if="!sameHourForAllDays">{{$t('backoffice.form.fields.monday')}}</ion-label>
                  <ion-label v-else>{{$t('backoffice.form.fields.allDays')}}</ion-label>
                  <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="mondayOpenHour" @ionChange="mondayOpenHour = $event.target.value" 
                                  v-bind:value="mondayOpenHour"
                                  placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                  :disabled="!activeMonday">
                  </ion-datetime>
                  -
                  <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="mondayCloseHour" @ionChange="mondayCloseHour = $event.target.value" 
                                  v-bind:value="mondayCloseHour"
                                  placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                  :disabled="!activeMonday">
                  </ion-datetime>
            </ion-item>
            <ion-item v-if="!sameHourForAllDays">
                  <ion-checkbox style="border-bottom: 1px solid lightgray; margin:5px" name="activeTuesday" 
                        @ionChange="activeTuesday = $event.target.checked"
                        :checked="activeTuesday">
                  </ion-checkbox>
                  <ion-label>{{$t('backoffice.form.fields.tuesday')}}</ion-label>
                  <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="tuesdayOpenHour" @ionChange="tuesdayOpenHour = $event.target.value" 
                                  v-bind:value="tuesdayOpenHour"
                                  placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                  :disabled="!activeTuesday">
                  </ion-datetime>
                  -
                  <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="tuesdayCloseHour" @ionChange="tuesdayCloseHour = $event.target.value" 
                                  v-bind:value="tuesdayCloseHour"
                                  placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                  :disabled="!activeTuesday">
                  </ion-datetime>
            </ion-item>
            <ion-item v-if="!sameHourForAllDays">
                  <ion-checkbox style="border-bottom: 1px solid lightgray; margin:5px" name="activeWednesday" 
                        @ionChange="activeWednesday = $event.target.checked"
                        :checked="activeWednesday">
                  </ion-checkbox>
                  <ion-label>{{$t('backoffice.form.fields.wednesday')}}</ion-label>
                  <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="wednesdayOpenHour" @ionChange="wednesdayOpenHour = $event.target.value" 
                                  v-bind:value="wednesdayOpenHour"
                                  placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                  :disabled="!activeWednesday">
                  </ion-datetime>
                  -
                  <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="wednesdayCloseHour" @ionChange="wednesdayCloseHour = $event.target.value" 
                                  v-bind:value="wednesdayCloseHour"
                                  placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                  :disabled="!activeWednesday">
                  </ion-datetime>
            </ion-item>
            <ion-item v-if="!sameHourForAllDays">
                  <ion-checkbox style="border-bottom: 1px solid lightgray; margin:5px" name="activeThursday" 
                        @ionChange="activeThursday = $event.target.checked"
                        :checked="activeThursday">
                  </ion-checkbox>
                  <ion-label>{{$t('backoffice.form.fields.thursday')}}</ion-label>
                  <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="thursdayOpenHour" @ionChange="thursdayOpenHour = $event.target.value" 
                                  v-bind:value="thursdayOpenHour"
                                  placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                  :disabled="!activeThursday">
                  </ion-datetime>
                  -
                  <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="thursdayCloseHour" @ionChange="thursdayCloseHour = $event.target.value" 
                                  v-bind:value="thursdayCloseHour"
                                  placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                  :disabled="!activeThursday">
                  </ion-datetime>
            </ion-item>
            <ion-item v-if="!sameHourForAllDays">
                  <ion-checkbox style="border-bottom: 1px solid lightgray; margin:5px" name="activeFriday" 
                        @ionChange="activeFriday = $event.target.checked"
                        :checked="activeFriday">
                  </ion-checkbox>
                  <ion-label>{{$t('backoffice.form.fields.friday')}}</ion-label>
                  <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="fridayOpenHour" @ionChange="fridayOpenHour = $event.target.value" 
                                  v-bind:value="fridayOpenHour"
                                  placeholder="Select" display-format="h:mm a" picker-format="h:mm a" :disabled="!activeFriday">
                  </ion-datetime>
                  -
                  <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="fridayCloseHour" @ionChange="fridayCloseHour = $event.target.value" 
                                  v-bind:value="fridayCloseHour"
                                  placeholder="Select" display-format="h:mm a" picker-format="h:mm a" :disabled="!activeFriday">
                  </ion-datetime>
            </ion-item>
            <ion-item v-if="!sameHourForAllDays">
                  <ion-checkbox style="border-bottom: 1px solid lightgray; margin:5px" name="activeSaturday" 
                        @ionChange="activeSaturday = $event.target.checked"
                        :checked="activeSaturday">
                  </ion-checkbox>
                  <ion-label>{{$t('backoffice.form.fields.saturday')}}</ion-label>
                  <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="saturdayOpenHour" @ionChange="saturdayOpenHour = $event.target.value" 
                                  v-bind:value="saturdayOpenHour"
                                  placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                  :disabled="!activeSaturday">
                  </ion-datetime>
                  -
                  <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="saturdayCloseHour" @ionChange="saturdayCloseHour = $event.target.value" 
                                  v-bind:value="saturdayCloseHour"
                                  placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                  :disabled="!activeSaturday">
                  </ion-datetime>
            </ion-item>
            <ion-item v-if="!sameHourForAllDays">
                  <ion-checkbox style="border-bottom: 1px solid lightgray; margin:5px" name="activeSunday" 
                        @ionChange="activeSunday = $event.target.checked"
                        :checked="activeSunday">
                  </ion-checkbox>
                  <ion-label>{{$t('backoffice.form.fields.sunday')}}</ion-label>
                  <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="sundayOpenHour" @ionChange="sundayOpenHour = $event.target.value" 
                                  v-bind:value="sundayOpenHour"
                                  placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                  :disabled="!activeSunday">
                  </ion-datetime>
                  -
                  <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px" name="sundayCloseHour" @ionChange="sundayCloseHour = $event.target.value" 
                                  v-bind:value="sundayCloseHour"
                                  placeholder="Select" display-format="h:mm a" picker-format="h:mm a"
                                  :disabled="!activeSunday">
                  </ion-datetime>
            </ion-item>
        </div>
        <div style="display: inherit">

            <ion-item>
                <ion-label>Custome Hours</ion-label>
                <ion-checkbox style="border-bottom: 1px solid lightgray; margin:5px" name="customHours" 
                    @ionChange="customHours = $event.target.checked"
                    :checked="customHours">
                </ion-checkbox>
            </ion-item>
            <ion-item v-if="customHours">
                <ion-textarea name="customHoursText" style="border-bottom: 1px solid lightgray; margin:5px"
                        @input="customHoursText = $event.target.value" 
                        v-bind:value="customHoursText">
                </ion-textarea>
            </ion-item>

        </div>

        <!-- Fin del horario del restaurante -->

      <!-- </ion-card>  -->

      <br/>
      <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="saveSetting()">{{ $t('backoffice.form.buttons.save') }}</ion-button>
    </div>
    </div>
</template>

<script>

import { Api } from '../api/api.js';
import Moment from 'moment';
// import CurrencyCodes from 'currency-codes'

export default {

  name: 'basicDataSettingForm',
   
  data () {
    return {
      modelName: 'Restaurant',
      /****** Form Data ******/
      id: null,
      name: '',
      address: '',
      online: false,
      // showOthersRestaurant: false,
      email: '',
      phone: '',
      web: '',
      urlLocation: '',
      fax: '',
      file: null,
      fileName: '',

      // Restaurant hours
      restaurantDaysAndTime: [],
      sameHourForAllDays: false,

      activeMonday: false,
      mondayOpenHour: '',
      mondayCloseHour: '',

      activeTuesday: false,
      tuesdayOpenHour: '',
      tuesdayCloseHour: '',
      
      activeWednesday: false,
      wednesdayOpenHour: '',
      wednesdayCloseHour: '',

      activeThursday: false,
      thursdayOpenHour: '',
      thursdayCloseHour: '',

      activefriday: false,
      fridayOpenHour: '',
      fridayCloseHour: '',

      activeSaturday: false,
      saturdayOpenHour: '',
      saturdayCloseHour: '',

      activeSunday: false,
      sundayOpenHour: '',
      sundayCloseHour: '',

      customHours: false,
      customHoursText: '',
      // End

      //Currencies
      allCurrencies: [],
      currencyCode: 'USD',
      example: '',
      
      isBackdrop: false,

      spinner: false,
    }
  },
  created: function(){
      this.init();
  },
  computed: {
        title() {
            return this.id ? this.$t('backoffice.form.titles.generalSettingEditTitle') :  this.$t('backoffice.form.titles.generalSettingNewTitle');
        }
  },
  methods: {
    change(){
        this.example = new Intl.NumberFormat('en', {style: "currency", currency: this.currencyCode} ).format(123456)
    },
    init(){
        this.allCurrencies = require('currency-codes/data');
        console.log('All currencies');
        console.log(this.allCurrencies);
        this.id = this.$route.params.settingId;
        if (this.id){
          this.$ionic.loadingController
          .create({
            cssClass: 'my-custom-class',
            message: this.$t('backoffice.titles.loading'),
            backdropDismiss: true
          })
          .then(loading => {
              loading.present()
              setTimeout(() => {  // Some AJAX call occurs
                  
                  Api.fetchById(this.modelName, this.id)
                  .then(response => {
                    this.name = response.data.Name;
                    this.address = response.data.Address;
                    this.online = response.data.Online;
                    // this.showOthersRestaurant = response.data.ShowOtherRestaurant;
                    this.email = response.data.Email;
                    this.phone = response.data.Phone;
                    this.web = response.data.Web;
                    this.urlLocation = response.data.UrlLocation;
                    this.fax = response.data.Fax;
                    this.file = response.data.ImageUrl;
                    this.currencyCode = response.data.Currency;
                    this.customHours = response.data.CustomHours;
                    this.customHoursText = response.data.CustomHoursText;
                    this.change();

                    // Restaurant date and time
                    if (response.data.RestaurantDaysAndTime)
                    {
                          response.data.RestaurantDaysAndTime.forEach(element => {
                              if (element.Day == 'Monday')
                              {
                                  this.activeMonday = true
                                  this.mondayOpenHour = Moment.tz(element.OpenHour, Moment.tz.guess()).format('HH:mm')
                                  this.mondayCloseHour = Moment.tz(element.CloseHour, Moment.tz.guess()).format('HH:mm')
                              }
                              if (element.Day == 'Tuesday')
                              {
                                  this.activeTuesday = true
                                  this.tuesdayOpenHour = Moment.tz(element.OpenHour, Moment.tz.guess()).format('HH:mm')
                                  this.tuesdayCloseHour = Moment.tz(element.CloseHour, Moment.tz.guess()).format('HH:mm')
                              }
                              if (element.Day == 'Wednesday')
                              {
                                  this.activeWednesday = true
                                  this.wednesdayOpenHour = Moment.tz(element.OpenHour, Moment.tz.guess()).format('HH:mm')
                                  this.wednesdayCloseHour = Moment.tz(element.CloseHour, Moment.tz.guess()).format('HH:mm')
                              }
                              if (element.Day == 'Thursday')
                              {
                                  this.activeThursday = true
                                  this.thursdayOpenHour = Moment.tz(element.OpenHour, Moment.tz.guess()).format('HH:mm')
                                  this.thursdayCloseHour = Moment.tz(element.CloseHour, Moment.tz.guess()).format('HH:mm')
                              }
                              if (element.Day == 'Friday')
                              {
                                  this.activeFriday = true
                                  this.fridayOpenHour = Moment.tz(element.OpenHour, Moment.tz.guess()).format('HH:mm')
                                  this.fridayCloseHour = Moment.tz(element.CloseHour, Moment.tz.guess()).format('HH:mm')
                              }
                              if (element.Day == 'Saturday')
                              {
                                  this.activeSaturday = true
                                  this.saturdayOpenHour = Moment.tz(element.OpenHour, Moment.tz.guess()).format('HH:mm')
                                  this.saturdayCloseHour = Moment.tz(element.CloseHour, Moment.tz.guess()).format('HH:mm')
                              }
                              if (element.Day == 'Sunday')
                              {
                                  this.activeSunday = true
                                  this.sundayOpenHour = Moment.tz(element.OpenHour, Moment.tz.guess()).format('HH:mm')
                                  this.sundayCloseHour = Moment.tz(element.CloseHour, Moment.tz.guess()).format('HH:mm')
                              }
                          
                          });
                          this.restaurantDaysAndTime
                    }

                    // End


                    loading.dismiss();
                    return response;
                  })
                  .catch(e => {
                    console.log(e);
                    loading.dismiss();
                    this.ifErrorOccured(this.init);
                  })
              })
          })   
        }
        console.log(this.$route.params);
    },
    ifErrorOccured(action){
      return this.$ionic.alertController.create({
          title: this.$t('backoffice.list.messages.connectionError'),
          message: this.$t('backoffice.list.messages.connectionErrorMessage'),
          buttons: [
            {
              text: this.$t('backoffice.list.messages.buttons.goToAdministration'),
              handler: () => {
                  this.$router.push({
                      name: 'ControlPanel',
                  });
              }
            },
            {
              text: this.$t('backoffice.list.messages.buttons.retry'),
              handler: () => {
                  action();
              }
            }
          ]
        })
        .then(a => a.present());
    },
    isValidForm(){
        // let errors = [];
        if (this.name == "")
        {
            // errors.push(this.$t('backoffice.form.validate.name'));
            return false
        }
        if (this.address == "")
        {
            // errors.push(this.$t('backoffice.form.validate.address'));
            return false
        }
        if (this.email == "")
        {
            // errors.push(this.$t('backoffice.form.validate.email'));
            return false
        }
        if (this.phone == "")
        {
            // errors.push(this.$t('backoffice.form.validate.phone'));
            return false
        }
        if (this.file == null)
        {
            // errors.push(this.$t('backoffice.form.validate.image'));
            return false
        }

        return true

        // if (errors.length > 0)
        // {
        //     let message = "";
        //     for (let i = 0; i < errors.length; i++) {
        //          message += (i + 1) + "- " + errors[i] + "<br/>";
        //     }
        //     // this.ShowMessage(this.$t('backoffice.form.validate.validate'),
        //     //                    message, this.$t('backoffice.form.validate.validateSetting'));
        //     this.showToastMessage(message, "danger");
        //     return false;
        // }
        // else
        // {
        //     return true;
        // }
    },
    ShowMessage(type, message, topic='') {
        return this.$ionic.alertController
          .create({
            cssClass: 'my-custom-class',
            header: type,
            subHeader: topic,
            message: message,
            buttons: [this.$t('backoffice.form.messages.buttons.ok')],
          })
        .then(a => a.present())
    },
    showToastMessage(message, tColor){
       return this.$ionic.toastController.create({
        color: tColor,
        position: 'top',
        duration: 3000,
        message: message,
        showCloseButton: false
      }).then(a => a.present())
    },
    /****** Load image use base64 encode esto debería ir en un componente******/
    checkImage: function(){
      return this.file != null;
    },
    handleImage: function(event)
    {
        const selectedImage = event.target.files[0];
        this.fileName = selectedImage.name;
        this.createBase64Img(selectedImage);
    },
    createBase64Img: function(fileObject){
        const reader = new FileReader();

        reader.onload = (e) => {
            this.file = e.target.result;
            console.log(this.file);
        };
        reader.readAsDataURL(fileObject);
    },
    /*******                              Fin                              *******/
    //Create or edit a new restaurant basic setting
    saveRestaurantDaysAndTime(){
        let reservation = [] 
        if (!this.sameHourForAllDays){
            if (this.activeMonday){
                reservation.push({
                    "Day": 'Monday',
                    "OpenHour": Moment(this.mondayOpenHour, 'HH:mm').toISOString(),
                    "CloseHour": Moment(this.mondayCloseHour, 'HH:mm').toISOString(),
                })
            }
            if (this.activeTuesday){
                reservation.push({
                    "Day": 'Tuesday',
                    "OpenHour": Moment(this.tuesdayOpenHour, 'HH:mm').toISOString(),
                    "CloseHour": Moment(this.tuesdayCloseHour, 'HH:mm').toISOString(),
                })
            }
            if (this.activeWednesday){
                reservation.push({
                    "Day": 'Wednesday',
                    "OpenHour": Moment(this.wednesdayOpenHour, 'HH:mm').toISOString(),
                    "CloseHour": Moment(this.wednesdayCloseHour, 'HH:mm').toISOString(),
                })
            }
            if (this.activeThursday){
                reservation.push({
                    "Day": 'Thursday',
                    "OpenHour": Moment(this.thursdayOpenHour, 'HH:mm').toISOString(),
                    "CloseHour": Moment(this.thursdayCloseHour, 'HH:mm').toISOString(),
                })
            }
            if (this.activeFriday){
                reservation.push({
                    "Day": 'Friday',
                    "OpenHour": Moment(this.fridayOpenHour, 'HH:mm').toISOString(),
                    "CloseHour": Moment(this.fridayCloseHour, 'HH:mm').toISOString(),
                })
            }
            if (this.activeSaturday){
                reservation.push({
                    "Day": 'Saturday',
                    "OpenHour": Moment(this.saturdayOpenHour, 'HH:mm').toISOString(),
                    "CloseHour": Moment(this.saturdayCloseHour, 'HH:mm').toISOString(),
                })
            }
            if (this.activeSunday){
                reservation.push({
                    "Day": 'Sunday',
                    "OpenHour": Moment(this.sundayOpenHour, 'HH:mm').toISOString(),
                    "CloseHour": Moment(this.sundayCloseHour, 'HH:mm').toISOString(),
                })
            }
        }
        else{
            reservation = [
                {
                  "Day": 'Monday',
                  "OpenHour": Moment(this.mondayOpenHour, 'HH:mm').toISOString(),
                  "CloseHour": Moment(this.mondayCloseHour, 'HH:mm').toISOString(),
                },
                {
                  "Day": 'Tuesday',
                  "OpenHour": Moment(this.mondayOpenHour, 'HH:mm').toISOString(),
                  "CloseHour": Moment(this.mondayCloseHour, 'HH:mm').toISOString(),
                },
                {
                  "Day": 'Wednesday',
                  "OpenHour": Moment(this.mondayOpenHour, 'HH:mm').toISOString(),
                  "CloseHour": Moment(this.mondayCloseHour, 'HH:mm').toISOString(),
                },
                {
                  "Day": 'Thursday',
                  "OpenHour": Moment(this.mondayOpenHour, 'HH:mm').toISOString(),
                  "CloseHour": Moment(this.mondayCloseHour, 'HH:mm').toISOString(),
                },
                {
                  "Day": 'Friday',
                  "OpenHour": Moment(this.mondayOpenHour, 'HH:mm').toISOString(),
                  "CloseHour": Moment(this.mondayCloseHour, 'HH:mm').toISOString(),
                },
                {
                  "Day": 'Saturday',
                  "OpenHour": Moment(this.mondayOpenHour, 'HH:mm').toISOString(),
                  "CloseHour": Moment(this.mondayCloseHour, 'HH:mm').toISOString(),
                },
                {
                  "Day": 'Sunday',
                  "OpenHour": Moment(this.mondayOpenHour, 'HH:mm').toISOString(),
                  "CloseHour": Moment(this.mondayCloseHour, 'HH:mm').toISOString(),
                },
            ]
        }
        // console.log(this.mondayOpenHour)
        // console.log(this.mondayCloseHour)
        console.log("The reservation")
        console.log(reservation)
        return reservation
    },
    saveSetting: function(){

        if (this.isValidForm()){
            this.isBackdrop = true;
            let item = {
              "Name": this.name,
              "Address": this.address,
              "Online": this.online,
              // "ShowOtherRestaurant": this.showOthersRestaurant,
              "Email": this.email,
              "Phone": this.phone,
              "Web": this.web,
              "Currency": this.currencyCode,
              "RestaurantDaysAndTime": this.saveRestaurantDaysAndTime(),
              "CustomHours": this.customHours,
              "CustomHoursText": this.customHoursText,
            }
            if (this.file != null)
            {
              item["ImageUrl"] = this.file;
              item["ImageName"] = this.fileName;
            }
            if (this.fax != '')
            {
               item["Fax"] = this.fax
            }
            if (this.urlLocation != '')
            {
               item["UrlLocation"] = this.urlLocation
            } 
            //If I am editing
            if (this.id){
              item['_id'] = this.id;
              this.spinner = true
              Api.putIn(this.modelName, item)
                  .then(response => {
                        // alert("Success edited");
                        // this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
                        //      this.$t('backoffice.list.messages.messageEditSuccessSetting'), 
                        //         this.$t('backoffice.list.messages.titleEditSetting'));
                        this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessSetting'), "success");
                        this.name = '';
                        this.description = '';
                        this.isEditing = false;
                        this.id = null;
                        this.file = null;
                        this.spinner = false;
                        this.$router.push({
                          name: 'ControlPanel', 
                        });
                        return response;
                  })
                  .catch(e => {
                        this.isBackdrop = false
                        console.log(e);
                        this.spinner = false;
                        this.ifErrorOccured(this.saveSetting);
                  })
            }
            else{
              //Else, I am created a new category
              this.spinner = true;
              Api.postIn(this.modelName, item)
                  .then(response => {
                      // this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
                      //        this.$t('backoffice.list.messages.messageCreateSuccessSetting'), 
                      //           this.$t('backoffice.list.messages.titleCreateSetting'));
                      this.showToastMessage(this.$t('backoffice.list.messages.messageCreateSuccessSetting'), "success");
                      this.spinner = false;
                      this.$router.push({
                        name: 'ControlPanel', 
                      });
                      return response;
                  })
                  .catch(e => {
                      this.isBackdrop = false
                      console.log(e);
                      this.spinner = false;
                      this.ifErrorOccured(this.saveSetting);
                  })
            }

        }
    },
  },

}
    
</script>

<style>

@media only screen and (min-width : 1024px){

    .screen{
        padding-left: 10%;
        padding-right: 10%;
        border: #edf1ee solid 1px;
        margin-right: 10%;
        margin-left: 10%;
        /* border-radius: 25px; */
    }

}

</style>