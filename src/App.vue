<template>
  <ion-app >
 
    <!-- <ionMenus/> -->
    <div id="app1">
    <div>
      <ion-menu contentId="my-content" side="start"  >
        <ion-header>
          <ion-toolbar color="secondary">
            <ion-title>{{$t('frontend.menu.menu')}}</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content padding class="menu ion-page">  
          <ion-content v-show="restaurantSelected">
            <ion-item> </ion-item>
            <!-- <div style="margin-top: 20px">
                <Language />
            </div> -->

            <div style="margin-top: 20px" v-if="hasOptionToShowOtherRestaurants()">
                <ion-select interface="popover" icon="add"
                 :ok-text="$t('backoffice.form.messages.buttons.ok')"
                 :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
                 :value="restaurantSelectedId"
                 :placeholder="$t('frontend.menu.restaurant')"
                  @ionChange="changeRestaurant($event.target.value)" >
                    <ion-select-option v-for="res in allRestaurant"                    
                      :key="res._id" 
                      :value="res._id" > {{res.Name}}
                    </ion-select-option>
                   
                </ion-select>
            </div>

            <ion-card >
              <div class="logo" style="margin-bottom: 5px;">
                <img  :src="restaurantActive.restaurantLogo" >
              </div>
              
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
                    <span  class="iconify" data-icon="si-glyph:pin-location-2" data-inline="false"></span> 
                  </a>
                </div> 
              </ion-item>     
           
              <ion-item v-if="restaurantSelected"  @click="goAbout">  {{$t('frontend.menu.about')}}</ion-item> 
              <ion-item v-if="restaurantSelected && hasOptionToShowMenu()"  @click="goHome"> {{$t('frontend.menu.menu')}}</ion-item>   
              <ion-item v-if="configuration.viewCatering && hasCardPayCat()" @click="goCatering">  {{$t('frontend.menu.menuCatering')}}</ion-item>           
              <ion-item v-if="restaurantSelected && $store.state.allTickets.length > 0"  @click="showTickets()"> {{$t('frontend.menu.ticketMenu')}} <ion-badge v-if="$store.state.allTickets.length > 0" slot="end" color="secondary">{{$store.state.allTickets.length}}</ion-badge></ion-item>  
              <ion-item v-if="restaurantSelected && configuration.viewReservation && configuration.viewCustomerReservation && hasCardPayRes()"  @click="getReservation()"> {{$t('frontend.menu.reservation')}} <ion-badge v-if="allReservations.length >0" slot="end" color="secondary">{{allReservations.length}}</ion-badge></ion-item>  
              <ion-item v-if="restaurantSelected"  @click="getOrderList"> {{$t('frontend.menu.orders')}} <ion-badge v-if="allOrdersLength >0" slot="end" color="secondary">{{allOrdersLength}}</ion-badge> </ion-item>  
              <ion-item v-if="restaurantSelected && hasAds()"  @click="goAds">  {{$t('frontend.menu.ads')}}</ion-item>
              <!-- <ion-item v-if="clientId!=''"  @click="logIng(email, '')">  {{$t('frontend.menu.edit')}}</ion-item>  -->
      
                 <Language />

            </ion-card>     

          </ion-content>
        </ion-content>
      </ion-menu>

      <ion-menu contentId="my-content" side="end" >
        <ion-header>
          <ion-toolbar color="secondary">
             <ion-title v-if="!getAuthenticated">{{ $t('backoffice.options.menuTitle') }}</ion-title>
              <ion-title v-else style="margin-top: 5px; margin-bottom: 2px" >
                    <ion-avatar style="width: 40px; height: 40px; float: left">
                        <img :src="getUserAuthenticated.ImageUrl">
                    </ion-avatar>
                    <div>
                        <p style="font-size: 12px; margin-bottom: auto">{{getUserAuthenticated.FirstName}} {{getUserAuthenticated.LastName}}</p>
                        <p style="font-size: 10px; margin-top: auto">{{getUserAuthenticated.Email}}</p>
                    </div>
              </ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-content padding class="ion-page menu" >
          <ion-item> </ion-item>
                  
          <div style="margin-top: 20px">
              <Language />
          </div>

          <ion-content v-if="!getAuthenticated">
              <Login />
          </ion-content>
           
          <!-- <ion-item v-if="!getAuthenticated" @click="closeEnd"><router-link to="/login" >{{ $t('backoffice.options.login') }}</router-link></ion-item> -->


          <ion-item color='light' @click="session = !session" style="cursor: pointer">Session</ion-item>
            <router-link to="/login" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="getAuthenticated && session" @click="logOut"><span class="iconify" data-icon="mdi:logout-variant" data-inline="false"></span>{{ $t('backoffice.options.logout') }}</ion-item></router-link>
            <a style="cursor: pointer; text-decoration: none; color: black;" @click="changeServerId()"><ion-item v-if="getAuthenticated && session"><span class="iconify" data-icon="ri:exchange-box-line" data-inline="false"></span>{{ $t('backoffice.options.changeServerId') }}</ion-item></a>
            <router-link to="/controlPanel" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="accessToControlPanel() && session" @click="closeEnd()"><span class="iconify" data-icon="mdi:tools" data-inline="false"></span>{{ $t('backoffice.options.controlPanel') }}</ion-item></router-link>
            <a @click="showDeviceSettings()" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="getAuthenticated && session" @click="closeEnd()"><span class="iconify" data-icon="uil:mobile-android-alt" data-inline="false"></span>Set device</ion-item></a>
          
          <ion-item color='light' @click="foodservices = !foodservices" style="cursor: pointer">Food/Services</ion-item>
              <router-link to="/menu" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewMenu') && foodservices" @click="closeEnd()"><span class="iconify" data-icon="bx:bx-food-menu" color="primary" data-inline="false"></span>{{ $t('backoffice.options.manageMenus') }}</ion-item></router-link>
              <router-link to="/category" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewCategory') && foodservices" @click="closeEnd()"><span class="iconify" data-icon="carbon:category-new-each" data-inline="false"></span>{{ $t('backoffice.options.manageCategories') }}</ion-item></router-link>
              <router-link to="/product" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewProduct') && foodservices" @click="closeEnd()"><span class="iconify" data-icon="dashicons:products" data-inline="false"></span>{{ $t('backoffice.options.manageProducts') }}</ion-item></router-link>
              <router-link to="/product/service" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewProduct') && foodservices" @click="closeEnd()"><span class="iconify" data-icon="dashicons:businessman" data-inline="false"></span>{{ $t('backoffice.options.manageServices') }}</ion-item></router-link>

          <ion-item color='light' @click="orderstickets = !orderstickets" style="cursor: pointer">Orders/Tickets</ion-item>
              <router-link to="/order" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewOrder') && orderstickets" @click="closeEnd()"><span class="iconify" data-icon="mdi:order-bool-descending" data-inline="false"></span>{{ $t('backoffice.options.viewOrders') }}</ion-item></router-link>
              <router-link to="/ticket" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewOrder') && orderstickets" @click="closeEnd()"><span class="iconify" data-icon="ph:ticket-duotone" data-inline="false"></span>{{ $t('backoffice.titles.tickets') }}</ion-item></router-link>
              <router-link to="/cateringOrder" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewOrder') && orderstickets" @click="closeEnd()"><span class="iconify" data-icon="mdi:order-bool-descending" data-inline="false"></span>{{ $t('backoffice.options.viewCateringOrders') }}</ion-item></router-link>

          <ion-item color='light' @click="deliveriesreservations = !deliveriesreservations" style="cursor: pointer">Reservations/Deliveries</ion-item>
              <router-link to="/orderForDelivered" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewOrderForDelivery') && deliveriesreservations" @click="closeEnd()"><span class="iconify" data-icon="mdi:truck-delivery-outline" data-inline="false"></span>{{ $t('backoffice.titles.ordersForDelivery') }}</ion-item></router-link>
              <router-link to="/reservationbackoffice" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewReservation') && deliveriesreservations" @click="closeEnd()"><span class="iconify" data-icon="ic:baseline-access-time" data-inline="false"></span>{{ $t('backoffice.options.manageReservation') }}</ion-item></router-link>

          <ion-item color='light' @click="restaurantadministration = !restaurantadministration" style="cursor: pointer">Restaurant Administration</ion-item>
              <router-link to="/table" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewTable') && restaurantadministration" @click="closeEnd()"><span class="iconify" data-icon="vs:table-o" data-inline="false"></span>{{ $t('backoffice.options.manageTables') }}</ion-item></router-link>
              <router-link to="/tax" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewTax') && restaurantadministration" @click="closeEnd()"><span class="iconify" data-icon="heroicons-outline:receipt-tax" data-inline="false"></span>{{ $t('backoffice.options.manageTaxes') }}</ion-item></router-link>
              <router-link to="/shipping" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewShipping') && restaurantadministration" @click="closeEnd()"><span class="iconify" data-icon="la:truck-pickup-solid" data-inline="false"></span>{{ $t('backoffice.options.manageShippings') }}</ion-item></router-link>
              <router-link to="/otherCharge" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewOtherCharge') && restaurantadministration" @click="closeEnd()"><span class="iconify" data-icon="si-glyph:money-bag" data-inline="false"></span>{{ $t('backoffice.options.manageOtherCharges') }}</ion-item></router-link>
              <router-link to="/payment" style="cursor: pointer; text-decoration: none; color: black;" ><ion-item v-if="restaurantadministration" @click="closeEnd()"><span class="iconify" data-icon="ic:twotone-attach-money" data-inline="false"></span>{{ $t('backoffice.options.managePyments') }}</ion-item></router-link>

          <ion-item color='light' @click="staffoccupationscustomers = !staffoccupationscustomers" style="cursor: pointer">Staff/Occupations/Customers</ion-item>
              <router-link to="/user" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewUser') && staffoccupationscustomers" @click="closeEnd()"><span class="iconify" color="primary" data-icon="simple-icons:codechef" data-inline="false"></span>{{ $t('backoffice.options.manageUsers') }}</ion-item></router-link>
              <router-link to="/role" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewRole') && staffoccupationscustomers" @click="closeEnd()"><span class="iconify" data-icon="ls:cookpad" data-inline="false"></span>{{ $t('backoffice.options.manageRoles') }}</ion-item></router-link>
              <router-link to="/occupation" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewOccupation') && staffoccupationscustomers" @click="closeEnd()"><span class="iconify" data-icon="tabler:tools-kitchen" data-inline="false"></span>{{ $t('backoffice.options.manageOccupation') }}</ion-item></router-link>
              <router-link to="/customer" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewCustomer') && staffoccupationscustomers" @click="closeEnd()"><span class="iconify" data-icon="raphael:people" data-inline="false"></span>{{ $t('backoffice.options.manageCustomers') }}</ion-item></router-link>

          <ion-item color='light' @click="settings = !settings" style="cursor: pointer">Settings</ion-item>
              <router-link to="/aboutDataSettings" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canChangeSetting') && settings" @click="closeEnd()"><span class="iconify" data-icon="grommet-icons:restaurant" data-inline="false"></span>{{ $t('backoffice.options.manageAboutSettings') }}</ion-item></router-link>
              <a @click="manageBasicSettings()" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canChangeSetting') && settings"><span class="iconify" data-icon="clarity:settings-line" data-inline="false"></span>{{ $t('backoffice.options.manageBasicSettings') }}</ion-item></a>
              <a @click="manageFunSettings()" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canChangeSetting') && settings"><span class="iconify" data-icon="clarity:file-settings-line" data-inline="false"></span>{{ $t('backoffice.options.manageFunSettings') }}</ion-item></a>
              <a @click="manageColourSettings()" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canChangeSetting') && settings"><span class="iconify" data-icon="vaadin:palete" data-inline="false"></span>{{ $t('backoffice.options.manageColourSettings') }}</ion-item></a>
              <a @click="manageKeySettings()" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canChangeSetting') && settings"><span class="iconify" data-icon="clarity:network-settings-solid" data-inline="false"></span>{{ $t('backoffice.options.manageKeySettings') }}</ion-item></a>
              <router-link to="/support" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canSuperUser') && settings" @click="closeEnd()"><span class="iconify" data-icon="mdi:account-supervisor" data-inline="false"></span>{{ $t('backoffice.options.supportSettings') }}</ion-item></router-link>
          
          <!-- <ion-item v-if="hasPermission('canViewVariantGroup')" @click="closeEnd()"><router-link to="/variantGroup" style="cursor: pointer; text-decoration: none; color: black;">{{ $t('backoffice.options.manageVariantGroup') }}</router-link></ion-item> -->
          <ion-item><router-link to="/demo" style="cursor: pointer; text-decoration: none; color: black;">Demo</router-link></ion-item>

        </ion-content>
      </ion-menu>

      <div  main id="my-content">
        <ion-header>
          <ion-toolbar color="primary">             
            <ion-icon @click="openStart" name="menu" class="menu-col-2" style="float: left;font-size: 30px;"></ion-icon> 
            <ion-title class="menu-col-8" style="float: left">{{restaurantActive.restaurantName}}</ion-title>          
            <ion-icon @click="openEnd" name="settings" class="menu-col-2" style="float: right;font-size: 30px;"></ion-icon>
          </ion-toolbar>
        </ion-header>
        <ion-content></ion-content>
      </div>

    </div>
    <ion-menu-controller></ion-menu-controller>
  </div>


      

    <ion-content :readonly="!spinner? true: false" id="app-ionic-vue">
      
      
        <div id="front-login">
            <div style="text-align: right;padding: 12px 10px;" v-if="CustomerName"  color="secondary">  
              <a outline @click="goMyAccount" style="margin-right: 20px;" v-if="restaurantSelected">
                <span class="iconify" data-icon="icomoon-free:profile" data-inline="false" style="width: 20px; height: 20px;margin: -15px 3px 0 0;"></span>
                <ion-label>{{$t('frontend.menu.profil')}}</ion-label>
              </a>    
              <a outline @click="logIng(email, '')" style="margin-right: 20px;" v-if="!restaurantSelected">
                <span class="iconify" data-icon="icomoon-free:profile" data-inline="false" style="width: 20px; height: 20px;margin: -15px 3px 0 0;"></span>
                <ion-label>{{$t('frontend.menu.edit')}}</ion-label>
              </a>    
              <a outline @click="cerrarSesion">          
                  <span class="iconify" data-icon="mi:close" data-inline="false"  style="width: 20px; height: 20px;margin: -15px 3px 0 0;"></span>
                  <ion-label>{{$t('frontend.menu.logout')}}</ion-label>
              </a>
            </div>
          <div style="text-align: right; padding: 12px 10px;" v-if="!CustomerName && !getAuthenticated" >
            <a outline @click="logIng('','')">
              <ion-label>{{$t('frontend.menu.log')}}</ion-label>
            </a>
          </div>
        </div>
        
        <div v-if="!restaurantSelected && !getAuthenticated">
          <!-- <div v-if="!restaurantSelected" && !getAuthenticated> -->

          <ion-toolbar>
             <h1 >{{$t('frontend.menu.restaurant')}}</h1>
            <ion-searchbar  
            @ionClear="handleInput('')"
            @input="$event.target.value?handleInput($event.target.value):''"
            :placeholder="$t('frontend.home.search')">             
            </ion-searchbar>
          </ion-toolbar>

          <div v-if="spinner">
            <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
          </div>

          <ion-refresher 
            style="position: relative"
            slot="fixed"
            @ionRefresh="doRefresh($event)">
              <ion-refresher-content 
                refreshing-spinner="crescent"
              ></ion-refresher-content>
          </ion-refresher>

          <div   
            v-for="res in filterRestaurantSelect"
            :key="res._id" 
            class="menu-col-12">
            <ion-list  >

              <ion-item  @click="changeRestaurant(res._id)">                      
                <div class="menu-col-2" style="text-align: center;" >
                    <img :src="res.ImageUrl" style=" max-height: 60px;">
                </div>
                <ion-label class="ion-text-wrap menu-col-3" >
                    <h3>{{res.Name}} <br> 
                    <star-rating v-if="configuration.viewRating"
                     v-bind:rounded-corners=false
                      v-bind:increment="0.1"
                      v-bind:star-size="20" 
                      v-bind:readonly=true
                      v-bind:rating="totalRating(res)"
                     > </star-rating><br>
                     <!-- <span>{{$t('frontend.menu.catering')}}</span> -->
                    
                     </h3>   
                   
                </ion-label>  
                <ion-label class="ion-text-wrap menu-col-4" >
                    <p>{{res.Address}}</p>                       
                </ion-label> 
                <ion-label class="ion-text-wrap menu-col-3" v-if="res.RestaurantDaysAndTime" style="    text-align: center;">                  
                    <p>{{restaurantSchedule(res.RestaurantDaysAndTime)}}</p>    
                    <p v-if="restaurantOpen(res.RestaurantDaysAndTime) === true" style="color: rgb(9 200 70)">
                      {{$t('frontend.reservation.open')}} 
                      <span class="iconify" data-icon="et:clock" data-inline="false" style="width: 15px; height: 15px;color: rgb(9 200 70);margin: 0;"></span>
                    </p>                   
                    <p v-if="restaurantOpen(res.RestaurantDaysAndTime) === false" style="color: #f10b28eb">
                      {{$t('frontend.reservation.close')}} 
                      <!-- <span class="iconify" data-icon="et:clock" data-inline="false"  style="width: 15px; height: 15px;color: #f10b28eb; margin: 0;"></span> -->
                    </p>                   
                </ion-label> 
              </ion-item>  
            </ion-list>
          </div>

          

        </div> 
        <router-view style="padding:0 12px"
        :key="key"
        v-if="!spinner"     
        :restaurantSelected="this.restaurantSelected"
        :restaurantSelectedId="this.restaurantSelectedId"
        :menuListSinCatering="this.menuListSinCatering"
        :menuListConCatering="this.menuListConCatering"
        :prod="this.prod" 
        :staffName="this.staffName"
        :staffId="this.staffId"
        :products ="this.products"
        :variants ="this.variants"
        :categories ="this.categories"
        :taxesName="this.taxesName"
        :taxes="this.taxes"
        :shipping="this.shipping"
        :shippingName="this.shippingName"  
        :marketingEmail="this.marketingEmail"
        :marketingPhone="this.marketingPhone"    
        />          
     

      

     

    </ion-content>

    

    <ion-footer class="ion-no-border">
      <ion-toolbar >
        <ion-title class="menu-col-12"><a href="https://imenuapps.com/" style="text-decoration: none;">iMenuApps</a></ion-title>
      </ion-toolbar>
    </ion-footer>
  </ion-app>
</template>

<script src="https://unpkg.com/ionicons@5.0.0/dist/ionicons.js"></script>

<script>

import Language from './backoffice/views/Locale.vue'
import Login from './backoffice/views/Login.vue'
import { logOut, settings } from "ionicons/icons";
import { menu } from "ionicons/icons";
import { add } from "ionicons/icons";
import { logoFacebook } from "ionicons/icons";
import { addIcons } from "ionicons";
import { Utils } from './backoffice/utils/utils'



addIcons({
  "ios-add": add.ios,
  "md-add": add.md,
  "ios-menu": menu.ios,
  "md-menu": menu.md,
  "ios-settings": settings.ios,
  "md-settings": settings.md,
});

import { Api } from './backoffice/api/api.js';
import orderType from './frontend/components/selectOrderType'
import { EventBus } from './frontend/event-bus';
import { VBreakpoint } from 'vue-breakpoint-component'
import { QrcodeStream } from 'vue-qrcode-reader'
import ProductDetail from './frontend/components/ProductDetail'
import Moment from 'moment'
import moment from 'moment-timezone';
import { parsePhoneNumber, findNumbers } from 'libphonenumber-js'
import StarRating from 'vue-star-rating'
import IdleTracker from 'idle-tracker';
import ChangeModal from './backoffice/views/changeServerId.vue';
import LockModal from './backoffice/views/LockScreen.vue';
import Modal from './backoffice/views/SetDeviceDataModal.vue';
import { Plugins } from '@capacitor/core';
const { Share } = Plugins;
import {Printer} from '@ionic-native/printer'
import axios from 'axios';


export default {
  name: "AppVue",
  props: {
    msg: String
  },
 
  mounted: async function(){


    //CUSTOM RESTAURANT FOR COMPILE
     // IN backoffoce ShowOtherRestaurant = false.
  //  this.restaurantSelected = true;
  //   await this.getAllRestaurant();     
  //   await this.changeRestaurant("5f6a0d0ddb8e8b157098ef3c");
      
      
   
    await this.getAllRestaurant();   
    
   
    if(this.$route.params.url){
      console.log('PARAMS');
      console.log(this.$route.params)    
      const urlRoute = this.$route.params.url;
      const restByRouteIndex = this.allRestaurant.findIndex(r => r.Url === urlRoute);
      if(restByRouteIndex === -1){
        this.$router.push({ name: 'AppVue' })  
        return this.alertNotRestaurantFound();
      }         
        else{
          this.changeRestaurant(this.allRestaurant[restByRouteIndex]._id);
        }   
    }
   
    if (this.$route.query.share && this.$route.query.rid)   {      
    this.productDetail(this.$route.query.share, this.$route.query.rid)
   }

    if (this.$route.query.menu)   {  
      console.log('OPEN RESTAURANT MENU con id '+this.$route.query.menu);
      this.showMenuRestaurant(this.$route.query.menu);
   }

    if (this.$route.query.curbside && this.$route.query.rid)   {      
      this.setCurbsideArrive(this.$route.query.curbside, this.$route.query.rid)
    }

    EventBus.$on('updateCustomer', (value) => {if(value) this.customerUpdated(); });
    EventBus.$on('startCustomerCounter', (value) => {if(value) this.timeCounterCustomer(); });
    EventBus.$on('updateAllReservations', (value) => { this.allReservations =  value});

   

          ///// REVISADO HASTA AQUI
 
   

   
    EventBus.$on('updateRestaurantSelectedId', (value) => {  
      if (value != '')
          this.changeRestaurant(value);
    });

    EventBus.$on('staffName', async (value)  => {
      this.staffName = value;
      if(value !== '' && this.$store.state.user)
       this.staffAllRestaurant = this.$store.state.user.AllRestaurant;
      else 
        this.staffAllRestaurant = [];

      await this.getAllRestaurant();
    });

    EventBus.$on('clientHasId', (value) => {    
      this.clientId = value;   
    });

    EventBus.$on('staffId', (value) => {    
      this.staffId = value;  
      EventBus.$off('staffId');   
    });
    
    EventBus.$on('blockScreen', (value) => { 
      if(value !== '')  {        
         this.idleTrackerBack.start();
      }        
      else{
        this.idleTrackerBack.end();  
      }
      // EventBus.$off('blockScreen');   
    });

 

    EventBus.$on('openHome', (value) => {
      if(value === true){  
        return  this.$router.push({name: 'Home', params: {cart: this.cart, order: this.order  }})
      } 
      // EventBus.$off('openHome');
    }); 

    EventBus.$on('updateAllOrders', (value) => {      
     this.allOrders = value; 
     EventBus.$off('updateAllOrders'); 
    });

     EventBus.$on('changeRoute', async (value)   =>  {   
      if(value ==='reservation') {
        await this.getListReservation();
        return this.$router.push({ name: 'Reservation' })
      }        
      if(value ==='yourOrdersList')
      {
        await this.getOrders();
        return this.$router.push({ name: 'ListOrder' })
      }
      
      EventBus.$off('changeRoute');
    });

     EventBus.$on('editInfoClient', (value) => {   
       if(value && this.email !='')   
        this.logIng(this.email, '');
      EventBus.$off('editInfoClient');
    });            
  
  },

  created: async function(){

  
      
  },
  data () {
    return {
      //Submenus

      session: false,
      foodservices: false,
      orderstickets: false,
      deliveriesreservations: false,
      restaurantadministration: false,
      staffoccupationscustomers: false,
      settings: false,

      allRestaurant: this.$store.state.allRestaurant,
      restaurantSelected: false,
      restaurantSelectedId: '',
      filterRestaurantSelect: [],
      staffName: '',
      staffId: '',
      staffAllRestaurant: [],

      modelName: 'Customer',
      clientId: this.$store.state.customer._id || '',
      CustomerName: this.$store.state.customer.Name || '',
      phone: this.$store.state.customer.Phone || '',
      email: this.$store.state.customer.EmailAddress || '',
      marketingEmail: false,
      marketingPhone: false,
          
      prod: [],
      cart: [],
      order:{},

      spinner: false,
      
      products:[],
      categories:[],
      variants: [],
      taxesName:'',
      taxes: 1,
      shipping: 0,
      shippingName: '',
      // showCooker: false,
      allOrders: [],
      allReservations: [],
      allTicket: [],
     
      key: 0,
      rating: [],

      menuListSinCatering: [],
      menuListConCatering: [],
      viewCatering: false,

      viewRating: false,    
      payForQuotation: false,  
      viewReservation: false,
      viewCustomerReservation: false,
      viewOnTable: false,
      viewCurbside: false,
      hasReservationQuotation: false,
      restaurantActive: {},
      configuration: {},
      idleTracker: new IdleTracker(
            {timeout: 600000, // Cierra sesion tras 10 min de inactividad. 600000
            onIdleCallback: () =>{console.log('iddle end: ' + this.idleTracker.state.idle);
            if (!this.idleTracker.state.idle) return  this.alertSesionExpired(); },
            throttle: 500
            }
          ),
      idleTrackerBack: new IdleTracker(
            {timeout: 60000, // Cierra sesion tras 1 min de inactividad.
              onIdleCallback: () =>{
                 if (!this.idleTrackerBack.state.idle && !this.isBackLocked){
                    console.log('Bloqueando pantalla');
                    this.backgroundLockScreen()
                 }
              },
              throttle: 500
            }
      ),
      isBackLocked: false,
           
    }
  }, 
  components:{
    Language,
    Login,
    VBreakpoint: VBreakpoint,
    QrcodeStream: QrcodeStream,   
    StarRating,
    
  },  
  computed:{
    getAuthenticated: function(){
      return this.$store.state.authenticated;
    },
    getUserAuthenticated: function(){
      return this.$store.state.user;
    },
    allOrdersLength: function(){
      return this.allOrders.length;
    }
  },
  methods: { 

    
    async doRefresh(event) {
    
      await this.getAllRestaurant();      
       event.target.complete();
    },
    
    handleInput(value){
      const query = value.toLowerCase();
      requestAnimationFrame(() => {       
        let cat2 = this.allRestaurant.filter(p => p.Name.toLowerCase().indexOf(query) > -1
                                    ||  p.Address.toLowerCase().indexOf(query) > -1)
        if(cat2.length> 0)
          this.filterRestaurantSelect = cat2
        else
          this.filterRestaurantSelect = this.allRestaurant;  
      });
    },
    
    hasPermission(permission){
        
        let res = false;
        if (this.$store.state.authenticated)
        {
            let roles = this.$store.state.roles;
            for (let index = 0; index < roles.length; index++) {
                switch(permission){                        
                      case 'canViewMenu':
                          res = roles[index].canViewMenu;
                          break;
                      case 'canViewCategory':
                          res = roles[index].canViewCategory;
                          break;
                      case 'canViewProduct':
                          res = roles[index].canViewProduct;
                          break;
                      case 'canViewCustomer':
                          res = roles[index].canViewCustomer;
                          break;
                      case 'canViewTable':
                          res = roles[index].canViewTable;
                          break;
                      case 'canViewTax':
                          res = roles[index].canViewTax;
                          break;
                      case 'canViewShipping':
                          res = roles[index].canViewShipping;
                          break;
                      case 'canViewOtherCharge':
                          res = roles[index].canViewOtherCharge;
                          break;
                      case 'canViewReservation':
                          res = roles[index].canViewReservation;
                          break;
                      case 'canViewUser':
                          res = roles[index].canViewUser;
                          break;
                      case 'canViewOccupation':
                          res = roles[index].canViewOccupation;
                          break;
                      case 'canViewRole':
                          res = roles[index].canViewRole;
                          break;
                      case 'canViewOrder':
                          res = roles[index].canViewOrder;
                          break;
                      case 'canViewOrderForDelivery':
                          res = roles[index].canViewOrderForDelivery;
                          break;
                      case 'canViewVariantGroup':
                          res = roles[index].canViewVariantGroup;
                          break;
                      case 'canChangeSetting':
                          res = roles[index].canChangeSetting;
                          break;
                      case 'canSuperUser':
                          res = this.$store.state.user.IsSupport;
                          break;
                      default:
                          break;
                }
                if (res)
                { 
                    return res;
                }              
            }
        }
        return res;
    },

    accessToControlPanel(){
        return (this.hasPermission('canViewMenu') || this.hasPermission('canViewOrder') || this.hasPermission('canViewCategory')
              || this.hasPermission('canViewProduct') || this.hasPermission('canViewCustomer') || this.hasPermission('canViewTable')
                || this.hasPermission('canViewTax') || this.hasPermission('canViewShipping') || this.hasPermission('canViewOtherCharge')
                  || this.hasPermission('canViewUser') || this.hasPermission('canViewRole'))
    },

    manageBasicSettings(){
            this.closeEnd();
            const restaurantID = this.$store.state.user.RestaurantId
            if (restaurantID)
            {
                this.$router.push({
                    name: 'BasicSettingForm',
                    params: {
                        "settingId": restaurantID,
                    }
                });
            }
            else{
                this.$router.push({
                    name: 'BasicSettingForm',
                });
            }
        },

    showDeviceSettings(){
        return this.$ionic.modalController
          .create({
          component: Modal,
          cssClass: 'my-custom-class',
          componentProps: {
              data: {
                  
              },
              propsData: {
                  parent: this
              },
          },
          })
          .then(m => m.present())
    },

    manageFunSettings(){
            this.closeEnd();
            Api.fetchAll('Setting').then(response => {
           
                let funSettings = [];
                funSettings = response.data;
             
                if (funSettings.length > 0)
                {
                    this.$router.push({
                        name: 'FunSettingForm',
                        params: {
                            "settingId": funSettings[funSettings.length - 1]._id,
                        }
                    });
                }
                else{
                    this.$router.push({
                        name: 'FunSettingForm',
                    });
                }
            })
            .catch(e => {
            console.log(e)
            });
        },
   
   manageColourSettings(){
            this.closeEnd();
            Api.fetchAll('Setting').then(response => {
                let colSettings = [];
                colSettings = response.data;
                if (colSettings.length > 0)
                {
                    this.$router.push({
                        name: 'ColourSettingForm',
                        params: {
                            "settingId": colSettings[colSettings.length - 1]._id,
                        }
                    });
                }
                else{
                    this.$router.push({
                        name: 'ColourSettingForm',
                    });
                }
            })
            .catch(e => {
            console.log(e)
            });
        },
   
   manageKeySettings(){
        this.closeEnd();
        const restaurantID = this.$store.state.user.RestaurantId
        if (restaurantID)
        {
            this.$router.push({
                name: 'KeySettingForm',
                params: {
                    "settingId": restaurantID,
                }
            });
        }
        else{
            this.$router.push({
                name: 'KeySettingForm',
            });
        }
    },

    backgroundLockScreen(){
      this.isBackLocked = true
      return this.$ionic.modalController
                .create({
                component: LockModal,
                backdropDismiss: false,
                cssClass: 'my-custom-class',
                componentProps: {
                    data: {
                        content: false,
                    },
                    propsData: {
                        parent: this,
                    },
                },
                })
                .then(m => m.present())
    },

    changeServerId(){
        this.closeEnd();
        
        return this.$ionic.modalController
                .create({
                component: ChangeModal,
                cssClass: 'my-custom-class',
                componentProps: {
                    data: {
                        content: false,
                    },
                    propsData: {
                        parent: this,
                    },
                },
                })
                .then(m => m.present())
    },
  
    openStart () {
        document.querySelector('ion-menu-controller').open('start')     
      },
    
    openEnd () {
        document.querySelector('ion-menu-controller').open('end')
      },
      
    closeEnd () {

        document.querySelector('ion-menu-controller').close('end')
      },
      
    closeStart () {
      if( document.querySelector('ion-menu-controller'))
        document.querySelector('ion-menu-controller').close('start')
      },

    logOut: async function(){
      this.closeEnd ();
      const rest = Api.getRestaurant()
      Api.setRestaurantId('');
      this.$store.commit("setAuthentication", false);
      this.$store.commit("setUser", null);

      // Reset Styles
      var allStyles = ":root { -ion-color-primary: #3880ff; " +
                            "--ion-color-primary-rgb: 56,128,255; " +
                            "--ion-color-primary-contrast: #ffffff; " +
                            "--ion-color-primary-contrast-rgb: 255,255,255; " +
                            "--ion-color-primary-shade: #3171e0; " +
                            "--ion-color-primary-tint: #4c8dff; " +

                            "--ion-color-secondary: #3dc2ff; " +
                            "--ion-color-secondary-rgb: 61,194,255; " +
                            "--ion-color-secondary-contrast: #ffffff; " +
                            "--ion-color-secondary-contrast-rgb: 255,255,255; " +
                            "--ion-color-secondary-shade: #36abe0; " +
                            "--ion-color-secondary-tint: #50c8ff; " +

                            "--ion-color-tertiary: #5260ff; " +
                            "--ion-color-tertiary-rgb: 82,96,255; " + 
                            "--ion-color-tertiary-contrast: #ffffff; " +
                            "--ion-color-tertiary-contrast-rgb: 255,255,255; " +
                            "--ion-color-tertiary-shade: #4854e0; " + 
                            "--ion-color-tertiary-tint: #6370ff; " +

                            "--ion-color-success: #2dd36f; " +
                            "--ion-color-success-rgb: 45,211,111; " +
                            "--ion-color-success-contrast: #ffffff; " +
                            "--ion-color-success-contrast-rgb: 255,255,255; " +
                            "--ion-color-success-shade: #28ba62; " + 
                            "--ion-color-success-tint: #42d77d; " +

                            "--ion-color-danger: #eb445a; " +
                            "--ion-color-danger-rgb: 235,68,90; " +
                            "--ion-color-danger-contrast: #ffffff; " + 
                            "--ion-color-danger-contrast-rgb: 255,255,255; " +
                            "--ion-color-danger-shade: #cf3c4f; " +
                            "--ion-color-danger-tint: #ed576b; }";
      document.querySelector('style').innerHTML += allStyles;

      this.$store.commit("setRoles", []);

      // Desvincular eventos.
      EventBus.$emit('clientHasId', '');
      EventBus.$emit('clientHasName', '');
      EventBus.$emit('clientHasPhone', '');
      EventBus.$emit('clientHasEmail', '');  
      EventBus.$emit('updateRestaurantSelectedId', ''); 
      EventBus.$emit('staffName', '');
      EventBus.$emit('staffId', '');
      this.staffName = '';
      this.staffId = '';

      let onLine = rest != null ? rest.Online : false
      console.log(rest)
      console.log("OnLine: " + onLine)
      if (this.restaurantSelectedId && onLine)
      {    
          console.log("CASO 1")     
          this.changeRestaurant(this.restaurantSelectedId)
      }
      else
      {
          // await this.getAllRestaurant();
          this.restaurantSelectedId = '';
          this.$router.push({ name: 'AppVue' });
          console.log("CASO 2") 
          // console.log(this.filterRestaurantSelect);
      }
      this.isBackLocked = false;
      this.idleTrackerBack.end();
      
    },
  
    getAllRestaurant: async function(){
      this.spinner = true;

      try {
        const response = await Api.fetchAll('Restaurant');
          if(response.status === 200){
          this.spinner = false;
          let allRest;
          if(this.staffName !== ''){
            allRest = response.data.filter(r => this.staffAllRestaurant.includes(r._id) );
          }
          else
            allRest = response.data.filter(r => r.Online === true)
          this.$store.commit('setAllRestaurant', JSON.parse(JSON.stringify(allRest)))
          this.allRestaurant = this.$store.state.allRestaurant;
          this.filterRestaurantSelect = this.$store.state.allRestaurant;   
          console.log('XX')
          console.log(this.filterRestaurantSelect)     
        }
        
      } catch (error) {
        this.spinner = false;
         return  this.$ionic.alertController
          .create({
              cssClass: 'my-custom-class',
              header: 'Error',
              message: error,
              buttons: [                   
              {
                  text: this.$t('frontend.home.acept'),
                  handler: () => {                                 
                                
                  },
              },
              ],
          })
          .then(a => a.present())
      }


    
    },

    async defaultData(restaurantId){
      
      this.prod = []
      this.cart = []  
         
      this.order = {}  

      // this.staffName = ''
      
      this.products=[],
      this.variants=[],
      this.categories=[],
      this.taxesName='',
      this.taxes= 1,
      this.shipping= 0,
      this.shippingName= '',
      
      this.allOrders=[],
      
      this.allReservations=[],
      this.allTicket = [],

      this.$store.commit('setCart', []) 
      this.$store.commit('setOrder', {})  
      this.$store.commit('setAllOrder', []) 
      this.$store.commit('setAllReservations', []) 
      this.$store.commit('setConfiguration', {})
      this.$store.commit('setAllTickets', [])
     
      
      
      
      document.querySelector('style').innerHTML += Utils.defaultStyles;
     

      await  this.getConfig();

      await this.fetchMenus();
  
      const flag = await this.restaurantData(restaurantId);

      await this.fetchProducts();  
       
      await this.fetchVariants();

      await this.fetchCategories();    

      await this.getTax();

      await this.getShipping();


      return flag;
    },

    changeRestaurant: async function(restaurantId){

       this.$ionic.loadingController
          .create({
            cssClass: 'my-custom-class',
            message: this.$t('frontend.tooltips.loadRestaurant'),
            backdropDismiss: false
          })
          .then ( loading =>{
            loading.present()
            setTimeout( async() => {                  
              this.restaurantSelected = true;      
              this.restaurantSelectedId = restaurantId;
              Api.setRestaurantId(restaurantId);
              this.closeStart();
              await this.defaultData(restaurantId);   
              this.$store.commit('setHasRating',false) ; 
                if(this.clientId !==''){
                    await this.getOrders();
                    await this.getListReservation();
                    await this.getTickets();
                }
               this.$router.push({ name: 'AboutFront', params: {url: this.restaurantActive.restaurantUrl}})
              loading.dismiss();             
            })
          })

       

      // if(this.clientId !==''){
      //     this.$ionic.loadingController
      //     .create({
      //       cssClass: 'my-custom-class',
      //       message: this.$t('frontend.tooltips.loadInfo'),
      //       backdropDismiss: false
      //     })
      //     .then ( loading =>{
      //       loading.present()
      //       setTimeout( async() => {
      //         await this.getOrders();
      //         await this.getListReservation();
      //         await this.getTickets();
      //         loading.dismiss();             
      //       })
      //     })
      // }

          
    },
    
    getConfig: function(){
     
      Api.fetchAll("Setting").then(response => {
        if(response.status === 200){
          
          var allStyles= response.data[0].AllStyles;
          document.querySelector('style').innerHTML += allStyles;

          const configuration = {
            showCooker: response.data[0].ShowCooker,
            selectPickHour: response.data[0].SelectPickHour,
            deliveryZone: response.data[0].DeliveryZone,
            zipCodes: response.data[0].ZipCodes,
            CanViewGeolocation: response.data[0].CanViewGeolocation,
            minTimeToCook: response.data[0].MinTimeToCook,
            minHour: response.data[0].PickFrom,
            maxHour: response.data[0].PickTo,
            viewCatering: response.data[0].ViewCatering,
            tipRequire: response.data[0].TipRequire || false, 
            tips: response.data[0].Tips || [],
            viewRating: response.data[0].ViewRating || false,
            payForQuotation: response.data[0].PayForQuotation || false, 
            percentPayForQuotation: response.data[0].PercentPayForQuotation || 0,  
            minAmountCateringDelivery: response.data[0].MinAmountCateringDelivery || 0,
            minAmoutCatering: response.data[0].MinAmoutCatering || 0, 
            cateringMarginDays : response.data[0].CateringMarginDays || 2, 
            cateringStates : response.data[0].CateringStates || [],
            zipCodesExcludes : response.data[0].ZipCodesExcludes || [],
            cateringEvents : response.data[0].CateringEvents || [],
            viewReservation : response.data[0].ViewReservation || false,
            viewCustomerReservation : response.data[0].ViewCustomerReservation || false,
            minDayToReservation : parseInt(response.data[0].MinDayToReservation) || 0,
            reservationDaysAndTime : response.data[0].ReservationDaysAndTime || [],
            viewDelivery : response.data[0].ViewDelivery || false,
            viewOnTable : response.data[0].ViewOnTable || false,  
            viewCurbside : response.data[0].ViewCurbside || false,                     
            hasReservationQuotation : response.data[0].HasReservationQuotation || false, 
            payForReservationQuotation : response.data[0].PayForReservationQuotation || 0,
            showOtherRestaurant: response.data[0].ShowOtherRestaurant || false,
            ads : response.data[0].Ads || [],
          }

          this.$store.commit('setConfiguration', configuration)
          this.configuration = configuration;
         
         }
      })
      .catch(e => {       
          console.log(e)                
      });
    },

    async fetchMenus(){   
     
      Api.menuSinCaterin().then(response => {
         if(response.status === 200){
          this.menuListSinCatering = response.data;           
         }
      })
      .catch(e => {
        console.log(e)
      })

      Api.menuConCaterin().then(response => {
         if(response.status === 200){
           this.menuListConCatering = response.data;
         }
      })
      .catch(e => 
      console.log(e))
    },
  
    fetchProducts: function(){
      
      Api.fetchAll("Product").then(response => {
        this.products = response.data
        
      })
      .catch(e => {
         return  this.$ionic.alertController
            .create({
                cssClass: 'modal',
                header: 'Error',
                message: e,
                buttons: [                   
                {
                    text: this.$t('frontend.home.acept'),
                    handler: () => {                                 
                                  
                    },
                },
                ],
            })
            .then(a => a.present())
      });
    },

    fetchVariants: function(){
      
      Api.fetchAll("Variantgroup").then(response => {
        this.variants = response.data;  
      })
      .catch(e => {        
        console.log(e)         
      });
    },
  
    fetchCategories: function(){
     
      Api.fetchAll('Menu').then(response => {
        if(response.data.length > 0){
          Api.getAllCategoryActiveMenu().then(response => {
          this.categories = response.data
          
          this.key++;
        }).
         catch(e => 
      console.log(e))

        }
      })
      .catch(e => 
      console.log(e))

     
    },

    getListReservation: async function(){
      if(this.clientId =='')
        return false;
      this.spinner = true
       await  Api.getCustomerReservations(this.clientId)
        .then(response => {
            this.$store.commit('setAllReservations', response.data)
            this.allReservations =  response.data;
            this.spinner = false          
        })
        .catch(e => {
          this.spinner = false 
            console.log(e);            
        })   
    },

    async getOrders(){
      if(this.clientId =='')
        return false;
      this.spinner = true
       try {
         const response = await Api.getCustomerOrders(this.clientId)
        if(response.status === 200){
          this.$store.commit('setAllOrder', response.data)
            this.allOrders = this.$store.state.allOrders; 
              this.spinner = false   
        }
        else
          this.spinner = false  
       } catch (error) {
         this.spinner = false 
            console.log(error);
       }       
    },

    async getTickets(){
      if(this.clientId =='')
        return false;
      this.spinner = true
       try {
         const response = await Api.getCustomerTickets(this.clientId)
        if(response.status === 200 && response.data.length > 0){
          this.$store.commit('setAllTickets', response.data)       
          this.allTicket  = response.data;
          this.cart = JSON.parse(JSON.stringify(this.allTicket[0].Products)) ;         
          this.$store.commit('setCart', this.cart);
          this.order =JSON.parse(JSON.stringify(this.allTicket[0])) ;
          this.$store.commit('setOrder', this.order);
          this.spinner = false   
        }
        else
          this.spinner = false  
       } catch (error) {
         this.spinner = false 
            console.log(error);
       }       
    },
 
    logIng: function(update, newRoute) {
      
       return this.$ionic.modalController
        .create({
          component: orderType,
          cssClass: 'my-custom-class1',
          componentProps: {
            data: {
              content: 'New Content',              
            },
          propsData: {
            parent: this,
            title: this.$t('frontend.app.selectDetail'),              
            buttonAcept:this.$t('frontend.home.acept'),
            buttonCancel:this.$t('frontend.home.cancel'),
            placeholderEmail: this.$t('frontend.orderType.email'),
            placeholderName: this.$t('frontend.orderType.name'),
            placeholderPhone: this.$t('frontend.orderType.phone'),             
            placeholderPassword: this.$t('frontend.orderType.password'),             
            requiredData: this.$t('frontend.home.errorRequired'),
            contactedBy: this.$t('frontend.orderType.contactedBy'),
            notValidEmail: this.$t('frontend.home.notValidEmail') , 
            restaurantEmail: this.restaurantActive.restaurantEmail,
            update: update,
            newRoute: newRoute,
            logIn:  this.$t('frontend.menu.logIn'), 
            register:  this.$t('frontend.menu.register'), 
            forgotPasswordText: this.$t('frontend.menu.forgotPassword'), 
            restablacerPassword: this.$t('frontend.menu.restablacerPassword'), 
            updateData: this.$t('frontend.menu.updateData'), 
            createUser:  this.$t('frontend.menu.createUser'), 
            newPassword:  this.$t('frontend.menu.newPassword'), 
            confirmPassword:  this.$t('frontend.menu.confirmPassword'), 
            mssForgotPassword:   this.$t('frontend.menu.mssForgotPassword'), 
            errorLogIn: this.$t('frontend.menu.errorLogIn'), 
            errEmailExist: this.$t('frontend.menu.errEmailExist'),
            errPassNotCoinc: this.$t('frontend.menu.errPassNotCoinc'),
            userNotFound: this.$t('frontend.menu.userNotFound'),
            newData: this.$t('frontend.menu.newData'),
            mssUpdateData: this.$t('frontend.menu.mssUpdateData'),
            mssCreateUser: this.$t('frontend.menu.mssCreateUser'),
            mssPasswordChangedCorrectly:  this.$t('frontend.menu.mssPasswordChangedCorrectly'),
          },
          },
        })
        .then(
          m => m.present(),
          )
    },

  
    goHome: function(){
      this.closeStart();
      console.log('GOIN HOME');
      return this.$router.push({ name: 'Home', params: {cart:this.cart, order: this.order, clientId: this.clientId } })
    },

    goCatering: function(){
      this.closeStart();
      return this.$router.push({ name: 'Catering', params: {cart:this.cart, order: this.order, clientId: this.clientId } })
    },
  
    goAbout: function(){
      this.closeStart();
      return this.$router.push({ name: 'AboutFront', params: {url: this.restaurantActive.restaurantUrl} }).catch(()=>{})
    },

    goAds: function(){
      this.closeStart();
      return this.$router.push({ name: 'Ads', params: {url: this.restaurantActive.restaurantUrl} }).catch(()=>{})
    },

    getReservation: async function(){
       this.closeStart();

       if(this.ClientId !='' && this.CustomerName !=''){  
         
         await this.getListReservation()
         return this.$router.push({ name: 'Reservation' })
         }
         else
         return this.logIng('','reservation'); 
    },

    getOrderList: async function(){  
      this.closeStart();   
      
      if(this.ClientId !='' && this.CustomerName !=''){    
         await this.getOrders();    
        return this.$router.push({ name: 'ListOrder', params: {customerId:this.clientId, CustomerName: this.CustomerName} })
      }
       else
         return this.logIng('','yourOrdersList');      

    },
    
    alertRequiredDatas(){
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: 'Error',
          message: this.$t('frontend.home.errorRequired'),
          buttons: [                   
          {
              text: this.$t('frontend.home.acept'),
              handler: () => {                                 
                            
              },
          },
          ],
      })
      .then(a => a.present())
                  
    },

    hasAds(){
      let flag = false;
      if(this.$store.state.configuration)
        if(this.$store.state.configuration.ads)
          if(this.$store.state.configuration.ads.length > 0 )
            flag = true;

      return flag;
    },

     async showMenuRestaurant(restaurantId) {

        const response = await Api.fetchById("Restaurant", restaurantId)  
       if(response.status === 200){
         const flag = response.data.Online;
         console.log(response.data)
         if(flag){
            this.spinner = true;     
            this.restaurantSelected = true;      
            this.restaurantSelectedId = restaurantId;
            Api.setRestaurantId(restaurantId);
            await this.defaultData(restaurantId); 
            this.$router.push({ name: 'Home', params: {url: this.restaurantActive.restaurantUrl}})   
         }
         else{
           this.alertRestaurantOffline();
            this.$router.push({ name: 'AppVue' })
         }         
       }
      // this.$router.push({ name: 'Home', params: {url: this.restaurantActive.restaurantUrl}}) 
   },

     alertRestaurantOffline(){
      this.email =''
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: 'Error',
          message: this.$t('frontend.tooltips.errorRestaurantOffline'),
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

   async setCurbsideArrive(orderId, restaurantId) {

      this.spinner = true;     
      this.restaurantSelected = true;      
      this.restaurantSelectedId = restaurantId;
      Api.setRestaurantId(restaurantId);

      await this.defaultData(restaurantId);
   
      this.$router.push({ name: 'AboutFront', params: {url: this.restaurantActive.restaurantUrl}})  

      this.spinner = true
      Api.fetchById("Order", orderId).then(async response => {  
        this.spinner = false;
        if(response.status === 200){
          response.data.CarArrived = true; 
          const response1 = await Api.putIn('Order', response.data);          
          if(response1.status === 200){
              return this.$ionic.toastController      
              .create({
                message: this.$t('frontend.tooltips.carArrivedInfo'),         
                position: 'middle',
                color:'success',
                buttons: [
                  { text: 'Done',
                    role: 'cancel',
                    handler: () => {} }
                ]
              })
              .then(a => a.present())

          }         
         
        }
      }
      )
      .catch(e => {
        console.log(e)
        this.spinner = false
        
      });
   },

  productDetail: async function(productId, restaurantId){
    
      this.spinner = true;     
      this.restaurantSelected = true;      
      this.restaurantSelectedId = restaurantId;
      Api.setRestaurantId(restaurantId);

      await this.defaultData(restaurantId);
   
       this.$router.push({ name: 'AboutFront', params: {url: this.restaurantActive.restaurantUrl}})  

      this.spinner = true
      Api.fetchById("Product", productId).then(response => {  
        this.spinner = false;
        if(response.status === 200){
          const pr = response.data
          var productVariant=[]

          if(pr.VariantGroupId !=''){
            productVariant = this.variants.filter(v => v._id == pr.VariantGroupId)
          }    
          return this.$ionic.modalController
          .create({
            component: ProductDetail,
            cssClass: 'my-custom-class',
            componentProps: {
              data: {
                content: 'New Content',
              },
              propsData: {
                title: this.$t('frontend.product.productDetail'),
                cart: this.cart,
                productId: pr._id,
                Name: pr.Name,
                SalePrice: parseFloat(pr.SalePrice),
                Description: pr.Description,
                ImageUrl: pr.ImageUrl,
                Note: pr.Note,
                productVariant: productVariant,
                aggregateCant: pr.AggregateCant || 0,
                Aggregates: pr.Aggregates || [],
                products: this.products,
                CantNoValid: this.$t('frontend.home.cantNotValid'),
                Acept: this.$t('frontend.home.acept'),
                orderType: this.orderType,
                mssOrderType: this.$t('frontend.home.selectOrderType'),
                message: this.$t('frontend.product.massageToast'),
                aggregateFree: this.$t('frontend.home.aggregateFree'),
                noteMss: this.$t('frontend.order.notes'),
                addMss: this.$t('frontend.order.add'),
                withoutIng: this.$t('frontend.home.withoutIngredients'),
                Ingredients: pr.Ingredients || [],
                currency: this.restaurantActive.currency,
              },
            },
          })
          .then(m => m.present())
        }
      }, 
        
      )
      .catch(e => {
        console.log(e)
        this.spinner = false
        
      });

    },

    restaurantData: async function(restaurantId){

      let flag = false;

      try{
        const response = await Api.fetchById("Restaurant", restaurantId)         
        if(response.status === 200){

          const dataRestaurant = {
            restaurantName: response.data.Name,
            restaurantUrl: response.data.Url,
            restaurantPhone: response.data.Phone,
            restaurantLogo: response.data.ImageUrl,
            restaurantEmail: response.data.Email,
            restaurantAddress: response.data.Address,
            currency: response.data.Currency,
            hasPaymentCardConfig: response.data.HasPaymentCardConfig || false,
            restaurantWeb : response.data.Web || '',          
            restaurantDaysAndTime : response.data.RestaurantDaysAndTime || [],          
            customHours: response.data.CustomHours || false,   
            customHoursText : response.data.CustomHoursText || '',          
            payMethod : response.data.PayMethod || '', 
            rating : response.data.rating || [],
            UrlLocation: response.data.UrlLocation || '',
            Fax: response.data.Fax || '',
          };

          flag = response.data.Online || false;

          const fcb = response.data.Sociasls.findIndex(pr => pr.SocialName === 'Facebook');
          if (fcb !== -1)  dataRestaurant.restaurantFacebok=  response.data.Sociasls[fcb].SocialUrl;
          const twt = response.data.Sociasls.findIndex(pr => pr.SocialName === 'Twitter');
          if (twt !== -1)  dataRestaurant.restaurantTwitter=  response.data.Sociasls[twt].SocialUrl;
          const itg = response.data.Sociasls.findIndex(pr => pr.SocialName === 'Instagram');
          if (itg !== -1)  dataRestaurant.restaurantInstagram =  response.data.Sociasls[itg].SocialUrl;
          const ytb = response.data.Sociasls.findIndex(pr => pr.SocialName === 'Youtube');
          if (ytb !== -1)  dataRestaurant.restaurantYoutube =  response.data.Sociasls[ytb].SocialUrl;

           this.$store.commit('setRestaurantActive', dataRestaurant)
           this.restaurantActive = dataRestaurant;
           
          } 

          return flag;

        }
        catch (error) {
          return flag;
        console.log(error);
      }

    },
       
    getTax: function(){
      Api.getAvailbleTax().then(response => {
          this.taxesName = response.data.Name
          this.taxes = response.data.Percentage        
      })
      .catch(e => {
          console.log(e)
      });   
   },
       
    getShipping: function(){
      
      Api.getAvailbleShipping().then(response => {            
              this.shippingName = response.data.Name
              this.shipping = parseFloat(response.data.Price);           
               this.spinner = false;
         
          })
          .catch(e => {
             console.log(e)
               this.spinner = false;
          });       
   },
  
    alertEmailNotValid(){
      this.email =''
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: 'Error',
          message: 'Not valid email',
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

  async alertSesionExpired(){   
    this.idleTracker.end()
    this.cerrarSesion()   
    const modal = await this.$ionic.alertController
    .create({
        cssClass: 'my-custom-class',
        header: '',
        message: this.$t('frontend.app.sessionExpired'),
        buttons: [                   
        {
          text: this.$t('frontend.home.acept'),
          handler: () => {                                 
                        
          },
        },
        ],
    })
    return modal.present();
    // .then(a => a.present())                
  },

  alertNotRestaurantFound(){      
    return  this.$ionic.alertController
    .create({
        cssClass: 'my-custom-class',
        header: '',
        message: this.$t('frontend.app.notRestaurantFound'),
        buttons: [                   
        {
          text: this.$t('frontend.home.acept'),
          handler: () => {                                 
                        
          },
        },
        ],
    })
    .then(a => a.present())                
  },

  cerrarSesion: function(){
    this.clientId = ''            
    this.CustomerName =''  
    this.phone = '' 
    this.email = ''
    this.allOrders =[] 
    this.allReservations = []
    this.allTicket = []
    
    this.$store.commit("setCustomer",   {});
 

    this.$ionic.modalController.dismiss();
    return  this.$router.push({name: 'Home', params: {cart: this.cart, order: this.order  }})
  },

  goMyAccount: async function(){
    await this.getOrders();
    await this.getListReservation();
    return  this.$router.push({name: 'Myaccount'});
  },


    totalRating: function(res){
      if(res.rating){
        let totalRating = 0;        
        res.rating.forEach(r => totalRating += r.rating);
        totalRating = totalRating / res.rating.length;
        return totalRating;
      }
      else
       return 0
     
    },

     restaurantOpen(horarios){
      
      const day =  moment.tz(moment.tz.guess()).format('dddd') ;
      const hour = moment.tz(moment.tz.guess()).format('HH:mm') ;

     
      const index = horarios.findIndex(re=> re.Day === day);
      if(index !== -1){
        const openHour =  moment.tz(horarios[index].OpenHour,  moment.tz.guess()).format('HH:mm') ; 
        const closeHour =  moment.tz(horarios[index].CloseHour,  moment.tz.guess()).format('HH:mm') ; 

        if( hour < openHour || hour > closeHour)
          return false;
        else
          return true;       
      }

    },

    restaurantSchedule(horarios){
     
      const day =  moment.tz( moment.tz.guess()).format('dddd') ;
      

      const index = horarios.findIndex(re=> re.Day === day);
      if(index !== -1){
        const mss = `${this.getReservationHour(horarios[index].OpenHour)} - ${this.getReservationHour(horarios[index].CloseHour)}`
        return mss;        
      }

    },
     getReservationHour(thisHour){
        return  moment.tz(thisHour, moment.tz.guess()).format('hh:mm A') 
      },

    hasCardPayCat(){
      if(this.configuration.payForQuotation){
        if(!this.restaurantActive.hasPaymentCardConfig)
          return false;
        return true;
      }
       return true;
    },
    hasCardPayRes(){
      if(this.configuration.hasReservationQuotation){
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

    //USING STORE
    async customerUpdated(){       
        this.clientId= this.$store.state.customer._id;
        this.CustomerName= this.$store.state.customer.Name;
        this.email= this.$store.state.customer.EmailAddress;
        this.phone=this.$store.state.customer.Phone;
        this.marketingEmail=this.$store.state.customer.MarketingConsent.Email;
        this.marketingPhone=this.$store.state.customer.MarketingConsent.Phone;

        if(this.restaurantSelected){

        this.$ionic.loadingController
          .create({
            cssClass: 'my-custom-class',
            message: this.$t('frontend.tooltips.loadInfo'),
            backdropDismiss: false
          })
          .then ( loading =>{
            loading.present()
            setTimeout( async() => {
              await this.getOrders();
              await this.getListReservation();
              await this.getTickets();
              loading.dismiss();             
            })
          })

         
        }
         

    },

    timeCounterCustomer(){
      this.idleTracker.start();
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
         console.log(error)
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

  async showTickets(){
    this.closeStart();  
    console.log('show list ticket');
    return this.$router.push({ name: 'OrderTicket'});
  }

  },


};

</script>


<style id="all-menu-styles">

@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap');

ion-app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.select-icon-inner{  
    opacity: 0.9 !important;
}

.alert-input.sc-ion-alert-md, .alert-input.sc-ion-alert-ios{
border-bottom: 1px solid #da0f0f;
}
.alert-input-wrapper:before{
    content: "*";
    color: red;
    float: left;
    margin-bottom: -15px;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #3880ff;
}
.spinner {  
    display: inline-block;
    position: relative;
    width: 70px;
    height: 70px;
    color: var(--color);
    user-select: none;
}
#app1 {   
     z-index: 20;   
     margin-bottom: 10px; 
}
  .menu-col-8{
    flex: 0 0 calc(calc(8 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(8 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(8 / var(--ion-grid-columns, 12)) * 100%);
}
  .menu-col-9{
    flex: 0 0 calc(calc(9 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(9 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(9 / var(--ion-grid-columns, 12)) * 100%);
}
  .menu-col-10{
    flex: 0 0 calc(calc(10 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(10 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(10 / var(--ion-grid-columns, 12)) * 100%);
}
.menu-col-2{
    flex: 0 0 calc(calc(2 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(2 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(2 / var(--ion-grid-columns, 12)) * 100%);
}
.menu-col-3{
    flex: 0 0 calc(calc(3 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(3 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(3 / var(--ion-grid-columns, 12)) * 100%);
}
.menu-col-4{
    flex: 0 0 calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
}
.menu-col-12{
    flex: 0 0 calc(calc(12 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(12 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(12 / var(--ion-grid-columns, 12)) * 100%);
}
.iconify{
  width: 30px;
  height: 30px;
  margin: 2px 10px;
}
ion-button{
  max-height: 48px !important;
}
.swiper-wrapper {
    padding-bottom: 30px !important;
    }

</style>
