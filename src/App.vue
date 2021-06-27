<template>
  <ion-app  :key="key">

     
    <!-- <ionMenus/> -->
  <div id="app1">
    <div >
      <ion-menu contentId="my-content" side="start"  >
        <ion-header>
          <ion-toolbar color="secondary">
            <ion-title>{{$t('frontend.menu.menu')}}</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content padding class="menu ion-page">  
          <ion-content v-show="restaurantSelectedId !==''">
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

            <ion-card :key="storeKey+'SK'">
              <div class="logo" style="margin-bottom: 5px;">
                <img  :src="$store.state.restaurantActive.restaurantLogo" >
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
              <ion-item v-if="$store.state.configuration.viewCatering && $store.state.menuConCatering.length > 0 && hasCardPayCat()" @click="goCatering()">  {{$t('frontend.menu.menuCatering')}}</ion-item>           
              <ion-item v-if="restaurantSelected && $store.state.allTickets.length > 0"  @click="showTickets()"> {{$t('frontend.menu.ticketMenu')}} <ion-badge v-if="$store.state.allTickets.length > 0" slot="end" color="secondary">{{$store.state.allTickets.length}}</ion-badge></ion-item>  
              <ion-item v-if="restaurantSelected && $store.state.configuration.viewReservation && $store.state.configuration.viewCustomerReservation && hasCardPayRes()"  @click="getReservation()"> {{$t('frontend.menu.reservation')}} <ion-badge v-if="$store.state.allReservations.length >0" slot="end" color="secondary">{{$store.state.allReservations.length}}</ion-badge></ion-item> 
              <ion-item v-if="restaurantSelected"  @click="getOrderList"> {{$t('frontend.menu.orders')}} <ion-badge v-if="$store.state.allOrders.length >0" slot="end" color="secondary">{{$store.state.allOrders.length}}</ion-badge> </ion-item>  
              <ion-item v-if="restaurantSelected && hasAds()"  @click="goAds">  {{$t('frontend.menu.ads')}}</ion-item>
      
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
                        <img v-if="getUserAuthenticated.ImageUrl != ''" :src="getUserAuthenticated.ImageUrl">
                        <img v-else :src="require('./backoffice/assets/user.png')">
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

          <ion-content v-if="!getAuthenticated" :key="newRestaurantKey">
              <Login :createdRestaurantEmail="createdRestaurantEmail" />
          </ion-content>

          
          <ion-list>
              <ion-item>
                  <!-- <ion-label>{{$t('frontend.menu.restaurant')}}</ion-label> -->
                  <ion-select interface="popover" :ok-text="$t('backoffice.form.messages.buttons.ok')" :cancel-text="$t('backoffice.form.messages.buttons.dismiss')" style="    padding: 0"
                  @ionChange="changeUserLoginRestaurant($event.target.value)" v-bind:value="userLoginRestaurantId">
                      <ion-select-option v-for="restaurant in userLoginRestaurant" v-bind:key="restaurant._id" v-bind:value="restaurant._id" >{{restaurant.Name}}</ion-select-option>
                  </ion-select>
              </ion-item>
          </ion-list>
          
           
          <!-- <ion-item v-if="!getAuthenticated" @click="closeEnd"><router-link to="/login" >{{ $t('backoffice.options.login') }}</router-link></ion-item> -->


          <ion-item color='light' @click="session = !session" style="cursor: pointer">{{ $t('backoffice.menu.session') }}</ion-item>
            <ion-item v-if="getAuthenticated && session" @click="logOut" style="cursor: pointer"><span class="iconify" data-icon="mdi:logout-variant" data-inline="false"></span>{{ $t('backoffice.options.logout') }}</ion-item>
            <a style="cursor: pointer; text-decoration: none; color: black;" @click="changeServerId()"><ion-item v-if="getAuthenticated && session"><span class="iconify" data-icon="ri:exchange-box-line" data-inline="false"></span>{{ $t('backoffice.options.changeServerId') }}</ion-item></a>
            <router-link to="/controlPanel" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="accessToControlPanel() && session" @click="closeEnd()"><span class="iconify" data-icon="mdi:tools" data-inline="false"></span>{{ $t('backoffice.options.controlPanel') }}</ion-item></router-link>
            <a @click="showDeviceSettings()" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="getAuthenticated && session" @click="closeEnd()"><span class="iconify" data-icon="uil:mobile-android-alt" data-inline="false"></span>Set device</ion-item></a>
          
          <ion-item color='light' @click="foodservices = !foodservices" style="cursor: pointer" v-if="hasPermission('canViewMenu') || hasPermission('canViewCategory') || hasPermission('canViewProduct')">{{ $t('backoffice.menu.foodServices') }}</ion-item>
              <router-link to="/menu" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewMenu') && foodservices" @click="closeEnd()"><span class="iconify" data-icon="bx:bx-food-menu" color="primary" data-inline="false"></span>{{ $t('backoffice.options.manageMenus') }}</ion-item></router-link>
              <router-link to="/category" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewCategory') && foodservices" @click="closeEnd()"><span class="iconify" data-icon="carbon:category-new-each" data-inline="false"></span>{{ $t('backoffice.options.manageCategories') }}</ion-item></router-link>
              <router-link to="/product" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewProduct') && foodservices" @click="closeEnd()"><span class="iconify" data-icon="dashicons:products" data-inline="false"></span>{{ $t('backoffice.options.manageProducts') }}</ion-item></router-link>
              <router-link to="/product/service" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewProduct') && foodservices" @click="closeEnd()"><span class="iconify" data-icon="dashicons:businessman" data-inline="false"></span>{{ $t('backoffice.options.manageServices') }}</ion-item></router-link>

          <ion-item color='light' @click="orderstickets = !orderstickets" style="cursor: pointer" v-if="hasPermission('canViewOrder')">{{ $t('backoffice.menu.ordersTickets') }}</ion-item>
              <router-link to="/order" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewOrder') && orderstickets" @click="closeEnd()"><span class="iconify" data-icon="mdi:order-bool-descending" data-inline="false"></span>{{ $t('backoffice.options.viewOrders') }}</ion-item></router-link>
              <router-link to="/ticket" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewOrder') && orderstickets" @click="closeEnd()"><span class="iconify" data-icon="ph:ticket-duotone" data-inline="false"></span>{{ $t('backoffice.titles.tickets') }}</ion-item></router-link>
              <router-link to="/cateringOrder" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewOrder') && orderstickets" @click="closeEnd()"><span class="iconify" data-icon="mdi:order-bool-descending" data-inline="false"></span>{{ $t('backoffice.options.viewCateringOrders') }}</ion-item></router-link>

          <ion-item color='light' @click="deliveriesreservations = !deliveriesreservations" style="cursor: pointer" v-if="hasPermission('canViewOrderForDelivery') ||
                                     hasPermission('canViewReservation')">{{ $t('backoffice.menu.reservationsDeliveries') }}</ion-item>
              <router-link to="/orderForDelivered" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewOrderForDelivery') && deliveriesreservations" @click="closeEnd()"><span class="iconify" data-icon="mdi:truck-delivery-outline" data-inline="false"></span>{{ $t('backoffice.titles.ordersForDelivery') }}</ion-item></router-link>
              <router-link to="/reservationbackoffice" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewReservation') && deliveriesreservations" @click="closeEnd()"><span class="iconify" data-icon="ic:baseline-access-time" data-inline="false"></span>{{ $t('backoffice.options.manageReservation') }}</ion-item></router-link>

          <ion-item color='light' @click="restaurantadministration = !restaurantadministration" style="cursor: pointer" v-if="hasPermission('canViewTable') || hasPermission('canViewTax') ||
                                    hasPermission('canViewShipping') || hasPermission('canViewOtherCharge') ||
                                        hasPermission('canChangeSetting')">{{ $t('backoffice.menu.restaurantAdministration') }}</ion-item>
              <router-link to="/table" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewTable') && restaurantadministration" @click="closeEnd()"><span class="iconify" data-icon="vs:table-o" data-inline="false"></span>{{ $t('backoffice.options.manageTables') }}</ion-item></router-link>
              <router-link to="/tax" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewTax') && restaurantadministration" @click="closeEnd()"><span class="iconify" data-icon="heroicons-outline:receipt-tax" data-inline="false"></span>{{ $t('backoffice.options.manageTaxes') }}</ion-item></router-link>
              <router-link to="/shipping" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewShipping') && restaurantadministration" @click="closeEnd()"><span class="iconify" data-icon="la:truck-pickup-solid" data-inline="false"></span>{{ $t('backoffice.options.manageShippings') }}</ion-item></router-link>
              <router-link to="/otherCharge" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewOtherCharge') && restaurantadministration" @click="closeEnd()"><span class="iconify" data-icon="si-glyph:money-bag" data-inline="false"></span>{{ $t('backoffice.options.manageOtherCharges') }}</ion-item></router-link>
              <router-link to="/payment" style="cursor: pointer; text-decoration: none; color: black;" ><ion-item v-if="hasPermission('canViewPayments') && restaurantadministration" @click="closeEnd()"><span class="iconify" data-icon="ic:twotone-attach-money" data-inline="false"></span>{{ $t('backoffice.options.managePyments') }}</ion-item></router-link>

          <ion-item color='light' @click="staffoccupationscustomers = !staffoccupationscustomers" style="cursor: pointer" v-if="hasPermission('canViewUser') || 
                                    hasPermission('canViewRole') || hasPermission('canViewOccupation') 
                                        || hasPermission('canViewCustomer') || hasPermission('canViewDriver')">{{ $t('backoffice.menu.staffOccupationsCustomersDrivers') }}</ion-item>
              <a @click="showStaffList()" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewUser') && staffoccupationscustomers" @click="closeEnd()"><span class="iconify" color="primary" data-icon="simple-icons:codechef" data-inline="false"></span>{{ $t('backoffice.options.manageUsers') }}</ion-item></a>
              <router-link to="/role" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewRole') && staffoccupationscustomers" @click="closeEnd()"><span class="iconify" data-icon="ls:cookpad" data-inline="false"></span>{{ $t('backoffice.options.manageRoles') }}</ion-item></router-link>
              <router-link to="/occupation" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewOccupation') && staffoccupationscustomers" @click="closeEnd()"><span class="iconify" data-icon="tabler:tools-kitchen" data-inline="false"></span>{{ $t('backoffice.options.manageOccupation') }}</ion-item></router-link>
              <router-link to="/customer" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewCustomer') && staffoccupationscustomers" @click="closeEnd()"><span class="iconify" data-icon="raphael:people" data-inline="false"></span>{{ $t('backoffice.options.manageCustomers') }}</ion-item></router-link>
              <a @click="showDriverList()" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewDriver') && staffoccupationscustomers"><span class="iconify" data-icon="mdi:car-child-seat" data-inline="false"></span>Drivers</ion-item></a>

          <ion-item color='light' @click="marketing = !marketing" style="cursor: pointer" v-if="hasPermission('canViewSuscriptor')">{{ $t('backoffice.menu.marketing') }}</ion-item>
              <router-link to="/suscriptor" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewSuscriptor') && marketing" @click="closeEnd()"><span class="iconify" data-icon="mdi:email-newsletter" data-inline="false"></span>{{ $t('backoffice.titles.suscriptors') }}</ion-item></router-link>
              <!-- <router-link to="/newsletter" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canViewSuscriptor') && marketing" @click="closeEnd()"><span class="iconify" data-icon="mdi:email-newsletter" data-inline="false"></span>{{ $t('backoffice.titles.newsletter') }}</ion-item></router-link> -->

          <ion-item color='light' @click="settings = !settings" style="cursor: pointer" v-if="hasPermission('canChangeSetting') ||
                                     hasPermission('canSuperUser')">{{ $t('backoffice.menu.settings') }}</ion-item>
              <router-link to="/aboutDataSettings" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canChangeSetting') && settings" @click="closeEnd()"><span class="iconify" data-icon="grommet-icons:restaurant" data-inline="false"></span>{{ $t('backoffice.options.manageAboutSettings') }}</ion-item></router-link>
              <a @click="manageBasicSettings()" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canChangeSetting') && settings"><span class="iconify" data-icon="clarity:settings-line" data-inline="false"></span>{{ $t('backoffice.options.manageBasicSettings') }}</ion-item></a>
              <a @click="manageFunSettings()" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canChangeSetting') && settings"><span class="iconify" data-icon="clarity:file-settings-line" data-inline="false"></span>{{ $t('backoffice.options.manageFunSettings') }}</ion-item></a>
              <a @click="manageColourSettings()" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canChangeSetting') && settings"><span class="iconify" data-icon="vaadin:palete" data-inline="false"></span>{{ $t('backoffice.options.manageColourSettings') }}</ion-item></a>
              <a @click="manageKeySettings()" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canChangeSetting') && settings"><span class="iconify" data-icon="clarity:network-settings-solid" data-inline="false"></span>{{ $t('backoffice.options.manageKeySettings') }}</ion-item></a>
              <router-link to="/support" style="cursor: pointer; text-decoration: none; color: black;"><ion-item v-if="hasPermission('canSuperUser') && settings" @click="closeEnd()"><span class="iconify" data-icon="mdi:account-supervisor" data-inline="false"></span>{{ $t('backoffice.options.supportSettings') }}</ion-item></router-link>
          
          <!-- <ion-item v-if="hasPermission('canViewVariantGroup')" @click="closeEnd()"><router-link to="/variantGroup" style="cursor: pointer; text-decoration: none; color: black;">{{ $t('backoffice.options.manageVariantGroup') }}</router-link></ion-item> -->
          <!-- <ion-item><router-link to="/demo" style="cursor: pointer; text-decoration: none; color: black;">Demo</router-link></ion-item> -->

        </ion-content>
      </ion-menu>

     

      <div main id="my-content" >
        <ion-header>
          <ion-toolbar color="primary">  
            <div  v-if="!newRestaurant">          
              <ion-icon @click="openStart" name="menu" class="menu-col-2" style="float: left;font-size: 30px;"></ion-icon> 
              <ion-title class="menu-col-6" style="float: left">{{restaurantActive.restaurantName}}</ion-title>          
            
              <ion-icon @click="openEnd" name="settings" class="menu-col-1" style="float: right;font-size: 30px;margin: 0px 25px 0 15px;"></ion-icon>
              <div :key="keyUserLogin" style="float: right;" v-if="!CustomerName && !getAuthenticated" @click="logIng('','')"><span class="iconify" data-icon="ph:user-circle" data-inline="false"></span></div>
              <div :key="keyUserLogin+'L'" style="float: right;" v-if="CustomerName" @click="showEditUser=!showEditUser"><span class="iconify" data-icon="ph:user-circle-fill" data-inline="false"></span></div>
            </div>  
          </ion-toolbar>
        </ion-header>
          <ion-card v-if="showEditUser" style="position: absolute; right: 35px;margin:0 ">
               <ion-chip  @click="restaurantSelected? goMyAccount() : logIng(email, '') , showEditUser=false" style="padding: 0;" v-tooltip="$t('frontend.menu.edit')">                  
                 <span class="iconify" data-icon="fa-solid:user-edit" data-inline="false"></span>
                </ion-chip>
                <ion-chip @click="cerrarSesion(), showEditUser=false" style="padding: 0;" v-tooltip="$t('frontend.menu.logout')">                  
                 <span class="iconify" data-icon="eva:close-circle-fill" data-inline="false" ></span>
                </ion-chip>
            </ion-card>
        <ion-content></ion-content>
      </div>

    </div>
    <ion-menu-controller></ion-menu-controller>
  </div>

      
    

    <ion-content  id="app-ionic-vue"  >
         
        <ion-loading         
          v-if="spinner"
          showBackdrop="false"
          cssClass="my-custom-class"
          :message="$t('frontend.tooltips.loadRestaurant')"
        >
      </ion-loading>
    
      
              
        <div v-if="!restaurantSelected && !getAuthenticated && !newRestaurant">
          <ion-toolbar>
             <h1 >{{$t('frontend.menu.restaurant')}}</h1>
            <ion-searchbar  
            @ionClear="handleInput('')"
            @input="$event.target.value?handleInput($event.target.value):''"
            :placeholder="$t('frontend.home.search')">             
            </ion-searchbar>
          </ion-toolbar>

         

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

        <router-view style="padding:0 12px"/>  
        

            <new-resturant v-if="newRestaurant && showNew" :parent="this"></new-resturant>


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

// import RestaurantList from './backoffice/components/RestaurantList.vue'
import Language from './backoffice/views/Locale.vue'
import Login from './backoffice/views/Login.vue'
import { logOut, logIn, settings } from "ionicons/icons";
import { menu } from "ionicons/icons";
import { add } from "ionicons/icons";
import { logoFacebook } from "ionicons/icons";
import { addIcons } from "ionicons";
import { Utils } from './backoffice/utils/utils'
//  const {Commons} = require('./frontend/commons'); 


addIcons({
  "ios-add": add.ios,
  "md-add": add.md,
  "ios-menu": menu.ios,
  "md-menu": menu.md,
  "ios-settings": settings.ios,
  "md-settings": settings.md,
  "ios-logIn": logIn.ios,
  "md-logIn": logIn.md,
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
import NewResturant from './frontend/views/NewRestautant.vue';



export default {
  name: "AppVue",
  props: {
    msg: String
  },
 
  created: async function(){
   
    if (this.$route.query.new)   {  
        this.newRestaurant = true;
        this.showNew = true;
        // return this.$router.push({name: 'NewRestaurant', params: {parent: this} });
    }

    if (this.$route.query.unsubscribe)   {  
        this.newRestaurant = true;
        return this.$router.push({name: 'Unsubscribe', params:{restaurantId: this.$route.query.unsubscribe, parent: this} });
    }

    if (this.$route.query.share && this.$route.query.rid)   {      
      this.productDetail(this.$route.query.share, this.$route.query.rid)
    }
    
    if (this.$route.query.menu)   {  
      this.showMenuRestaurant(this.$route.query.menu);
    }

    if (this.$route.query.curbside && this.$route.query.rid)   {      
      this.setCurbsideArrive(this.$route.query.curbside, this.$route.query.rid)
    }
    
    await this.getAllRestaurant(); 
   
    if(this.$route.params.url){        
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
   
   

    EventBus.$on('updateCustomer', (value) => {if(value) this.customerUpdated(); });
    EventBus.$on('startCustomerCounter', (value) => {if(value) this.timeCounterCustomer(); });
    EventBus.$on('updateStoreKey', (value) => { if(value) this.storeKey ++}); 
    EventBus.$on('updateRestaurantSelectedId', (value) => { if (value != '')this.changeRestaurant(value);});
    EventBus.$on('staffName', async (value)  => {
      this.staffName = value;
      this.$store.commit('setStaffName',value) ;
      value
      if(value !== '' && this.$store.state.user)
       this.staffAllRestaurant = this.$store.state.user.AllRestaurant;
      else 
        this.staffAllRestaurant = [];

      await this.getAllRestaurant();
    });
    EventBus.$on('clientHasId', (value) => {  this.clientId = value;  });
    EventBus.$on('staffId', (value) => {    
      this.staffId = value;  
      this.$store.commit('setStaffId',value) ;
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
        return  this.$router.push({name: 'Home'})
      } 
      // EventBus.$off('openHome');
    }); 

    EventBus.$on('updateAllOrders', (value) => {      
     this.allOrders = value; 
     EventBus.$off('updateAllOrders'); 
    });

     EventBus.$on('changeRoute', async (value)   =>  { 
       console.log(value)  
      if(value ==='reservation') {
        return this.$router.push({ name: 'Reservation' })
      }        
      if(value ==='yourOrdersList')
      {
        return this.$router.push({ name: 'ListOrder' })
      }
    });

    EventBus.$on('editInfoClient', (value) => {   
       if(value && this.email !='')   
        this.logIng(this.email, '');
    });
    EventBus.$on('userRestaurant', (value) => {    
      this.userLoginRestaurant = value;
      this.userLoginRestaurantId = this.$store.state.user.RestaurantId;
    });
  
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
      marketing: false,
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
      spinnerKey: 0,
      
      products:[],
      categories:[],
      variants: [],
      taxesName:'',
      taxes: 1,
      shipping: 0,
      shippingName: '',
      allOrders: [],
     
      key: 0,
      rating: [],

      menuListSinCatering: [],
      categoryMenuListSinCatering: [],
      menuListConCatering: [],
      categoryMenuConCatering: [],
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
                    this.backgroundLockScreen()
                 }
              },
              throttle: 500
            }
      ),
      isBackLocked: false,

      //Backoffice
      userLoginRestaurant: [],
      userLoginRestaurantId: -1,
      showEditUser: false,
      keyUserLogin: 0,
      newRestaurant: false,
      showNew: false,
      createdRestaurantEmail: '',
      newRestaurantKey: 3,
      storeKey: 1,
           
    }
  }, 
  components:{
    // RestaurantList: RestaurantList,
    Language,
    Login,
    VBreakpoint: VBreakpoint,
    QrcodeStream: QrcodeStream,   
    StarRating,
    NewResturant
    
  },  
  computed:{
    getAuthenticated: function(){
      return this.$store.state.authenticated;
    },
    getUserAuthenticated: function(){
      return this.$store.state.user;
    },

  },
  methods: {
  
    changeUserLoginRestaurant(value){
        this.userLoginRestaurantId = value
        this.relogin()
    },

    relogin(){
            this.spinner = true
            let userLogin = this.$store.state.user
            userLogin.RestaurantId = this.userLoginRestaurantId

            Api.setRestaurantId(this.userLoginRestaurantId);
            this.getBackofficeConfig();

            Api.fetchById("staff", userLogin._id)
            .then(response => {
                    let roles = []
                    let staffMember = response.data
                    staffMember.Roles.forEach(rol_id => {
                        Api.fetchById("rol", rol_id).then(response => {
                            roles.push(response.data);
                        })
                    });
                    this.$store.commit("setRoles", roles);
                    // this.$router.push({
                    //     path: "/controlPanel/true"
                    // })
                    // this.init();
                  this.spinner = false
            })
            .catch(e => {
                console.log(e)
                this.spinner = false
            });
    },

    getBackofficeConfig: function(){
          Api.fetchAll("Setting").then(response=> {
              let settings = [];
              settings = response.data;
              if (settings.length > 0)
              {
                  var allStyles = settings[settings.length -1].AllStyles;
                  document.querySelector('style').innerHTML += allStyles;

              }
          })
          .catch(e => {
          console.log(e)
          });
    },

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
                      case 'canViewPayments':
                          res = roles[index].canViewPayments;
                          break;
                      case 'canSuperUser':
                          res = this.$store.state.user.IsSupport;
                          break;
                      case 'canViewDriver':
                          res = roles[index].canViewDriver;
                          break;
                      case  'canViewSuscriptor':
                          res = roles[index].canViewSuscriptor;
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
    showStaffList(){
        this.$router.push({
            name: 'User',
            params: {
                isForDriversSupervisor: false,
            }
        });
    },
    showDriverList(){
        this.$router.push({
            name: 'Driver',
            params: {
                isForDriversSupervisor: true,
            }
        });
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

        this.foodservices = false
        this.orderstickets = false
        this.deliveriesreservations = false
        this.restaurantadministration = false
        this.staffoccupationscustomers = false
        this.settings = false

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
      EventBus.$emit('staffName', '');
      EventBus.$emit('staffId', '');
      this.staffName = '';
      this.staffId = '';

      let onLine = rest != null ? rest.Online : false
      if (this.restaurantSelectedId && onLine)
      {    
          this.changeRestaurant(this.restaurantSelectedId)
      }
      else
      {
          this.restaurantSelectedId = '';
          this.$router.push({ name: 'AppVue' });
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

    changeRestaurant: async function(restaurantId){
      const {Commons} = require('./frontend/commons');
      
       this.$ionic.loadingController
          .create({
            cssClass: 'my-custom-class',
            message: this.$t('frontend.tooltips.loadRestaurant'),
            backdropDismiss: false
          })
          .then ( loading =>{
            loading.present()
            setTimeout( async() => {                  
              try {
                this.restaurantSelected = true;      
                this.restaurantSelectedId = restaurantId;             
                this.closeStart();               
                await Commons.changeRestaurant(restaurantId);
                loading.dismiss();
                this.$router.push({ name: 'AboutFront', params: {url: this.$store.state.restaurantActive.restaurantUrl, key: this.key}})
                this.$forceUpdate();
              } catch (error) {
                  console.log(error)
                  loading.dismiss();
                
              }

                           
            })
          })

    },
  
    logIng: function(update, newRoute) {

      this.keyUserLogin ++;      
       return this.$ionic.modalController
        .create({
          component: orderType,
          cssClass: 'my-custom-class1',
          componentProps: {
            data: {
              content: 'New Content',              
            },
          propsData: {            
            restaurantEmail: this.restaurantActive.restaurantEmail,
            update: update,
            newRoute: newRoute,           
          },
          },
        })
        .then(
          m => m.present(),
          )
    },
  
    goHome: function(){
      this.closeStart();
      this.$router.push({ name: 'Home', params: {isCatering: false, url: this.$store.state.restaurantActive.restaurantUrl} })
    },

    goCatering: function(){
      this.closeStart();
       this.$router.push({ name: 'Catering', params: {isCatering: true, url: this.$store.state.restaurantActive.restaurantUrl }})
    },
  
    goAbout: function(){
      this.closeStart();
      return this.$router.push({ name: 'AboutFront', params: {url: this.$store.state.restaurantActive.restaurantUrl} }).catch(()=>{})
    },

    goAds: function(){
      this.closeStart();
      return this.$router.push({ name: 'Ads', params: {url: this.restaurantActive.restaurantUrl} }).catch(()=>{})
    },

    getReservation: async function(){
       this.closeStart();
       if(this.ClientId !='' && this.CustomerName !='') return this.$router.push({ name: 'Reservation' })
       else return this.logIng('','reservation'); 
    },

    getOrderList: async function(){  
      this.closeStart();   
      if(this.ClientId !='' && this.CustomerName !='') 
        return this.$router.push({ name: 'ListOrder', params: {customerId:this.clientId, CustomerName: this.CustomerName} })
      else
        return this.logIng('','yourOrdersList');      

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
        const {Commons} = require('./frontend/commons');  
        this.spinner = true;
        const response = await Api.fetchById("Restaurant", restaurantId)  
        if(response.status === 200){
          const flag = response.data.Online;
          if(flag){
                
              this.restaurantSelected = true;      
              this.restaurantSelectedId = restaurantId;
              Api.setRestaurantId(restaurantId);
              await Commons.changeRestaurant(restaurantId);
              this.$router.push({ name: 'Home', params: {url: this.$store.state.restaurantActive.restaurantUrl}}) 
          }
          else{
            this.alertRestaurantOffline();                   
            this.$router.push({ name: 'AppVue' })
          }  
            this.spinner = false;
        } 

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
        try {  
            this.spinner = true;
            const {Commons} = require('./frontend/commons');
            this.restaurantSelected = true;      
            this.restaurantSelectedId = restaurantId;
            Api.setRestaurantId(restaurantId);
            await Commons.changeRestaurant(restaurantId);
            this.$router.push({ name: 'AboutFront', params: {url: this.restaurantActive.restaurantUrl}})  

            await Api.fetchById("Order", orderId).then(async response => {  
            
              if(response.status === 200){
                response.data.CarArrived = true; 
                const response1 = await Api.putIn('Order', response.data);
                this.spinner = false;
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
        
          
        } catch (error) {
          this.spinner = false;
            error;
          
        }    
   },

  productDetail: async function(productId, restaurantId){
      const {Commons} = require('./frontend/commons');
      this.spinner = true;     
      this.restaurantSelected = true;      
      this.restaurantSelectedId = restaurantId;
      Api.setRestaurantId(restaurantId);
      await Commons.changeRestaurant(restaurantId);
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
                orderType: this.orderType,               
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
    
    this.$store.commit("setCustomer",   {});
    this.$store.commit('setAllOrder', []) 
    this.$store.commit('setAllReservations', []) 
    this.$store.commit('setAllTickets', [])  

    this.keyUserLogin ++;
    this.$ionic.modalController.dismiss();
    return  this.$router.push({name: 'Home'})
  },

  goMyAccount: async function(){
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
      if(this.$store.state.configuration.viewCatering ){
        if(this.$store.state.configuration.payForQuotation){
          if(!this.$store.state.restaurantActive.hasPaymentCardConfig)
            return false;
          return true;
      }
       return true;
      }
      return false;
      
    },

    hasCardPayRes(){
      if(this.$store.state.configuration.hasReservationQuotation){
        if(!this.$store.state.restaurantActive.hasPaymentCardConfig)
          return false;
        return true;
      }
       return true;
    },

    hasOptionToShowMenu(){
      if(!this.$store.state.restaurantActive.hasPaymentCardConfig && !this.$store.state.configuration.viewOnTable)
        return false;
      return true;      
    },

    hasOptionToShowOtherRestaurants(){
      if(this.$store.state.configuration.showOtherRestaurant)
        return true;
      return false;      
    },

    //USING STORE
    async customerUpdated(){     
      const {Commons} = require('./frontend/commons');  
        this.clientId= this.$store.state.customer._id;
        this.CustomerName= this.$store.state.customer.Name;
        this.email= this.$store.state.customer.EmailAddress;
        this.phone=this.$store.state.customer.Phone;
        this.marketingEmail=this.$store.state.customer.MarketingConsent.Email;
        this.marketingPhone=this.$store.state.customer.MarketingConsent.Phone;

        //COMMONS
        Commons.clientId = this.clientId,
        Commons.CustomerName = this.CustomerName
        Commons.email = this.email;
        Commons.phone = this.phone;   

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
              try {
                  await Commons.getOrders();
                  await Commons.getListReservation();
                  await Commons.getTickets();
                  //SUBSCRIPTION
                  Commons.alertSubscription(this.email,this.CustomerName, this.phone);  
                  loading.dismiss();
                  this.key ++ ;
                
              } catch (error) {
                console.log(error);
                loading.dismiss();
              }
             
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
    return this.$router.push({ name: 'OrderFront'});
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

/* .alert-input.sc-ion-alert-md, .alert-input.sc-ion-alert-ios{
border-bottom: 1px solid #da0f0f;
} */

.alert-input-wrapper:before{
    /* content: "*"; */
    /* color: red; */
    float: left;
    margin-bottom: -15px;
}
.alert-message.sc-ion-alert-md {
   -webkit-user-modify: read-write-plaintext-only;
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
.ion-page {
    overflow: auto !important;
}
.loading-wrapper.sc-ion-loading-md {
    opacity: 1;
}
</style>
