<template>
    <div class="screen">
    <ion-backdrop v-if="isBackdrop"></ion-backdrop>

    <ion-header>
          <ion-toolbar>
            <!-- <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'ControlPanel'})"></ion-back-button>
            </ion-buttons> -->
            <ion-label style="padding: 20px 100px;">
              <h1>{{$t('backoffice.titles.supportPanel')}} </h1>            
            </ion-label>

            <ion-segment scrollable id="productSegment" @ionChange="segmentChanged($event.target.value)" :value="segmentValue" @input="value=segmentValue">
                <ion-segment-button value="email">
                    <!-- <span class="iconify" data-icon="dashicons:businessman" data-inline="false"></span> -->
                    <span>{{$t('backoffice.form.fields.email')}}</span>
                </ion-segment-button>
                <ion-segment-button value="sms">
                    <!-- <span class="iconify" data-icon="mdi:sitemap" data-inline="false"></span> -->
                    <span>SMS</span>
                </ion-segment-button>
                <ion-segment-button value="payments">
                    <!-- <span class="iconify" data-icon="ant-design:unordered-list-outlined" data-inline="false"></span> -->
                    <span>{{$t('backoffice.titles.payments')}}</span>
                </ion-segment-button>
                <ion-segment-button value="capcha">
                    <!-- <span class="iconify" data-icon="ant-design:unordered-list-outlined" data-inline="false"></span> -->
                    <span>{{$t('backoffice.form.titles.capcha')}}</span>
                </ion-segment-button>
                <ion-segment-button value="user">
                    <!-- <span class="iconify" data-icon="ant-design:unordered-list-outlined" data-inline="false"></span> -->
                    <span>{{$t('backoffice.form.titles.supportUsers')}}</span>
                </ion-segment-button>
                 <ion-segment-button value="restaurants">
                    <!-- <span class="iconify" data-icon="ant-design:unordered-list-outlined" data-inline="false"></span> -->
                    <span>{{$t('frontend.createNew.restaurants')}}</span>
                </ion-segment-button>
            </ion-segment>
          </ion-toolbar>
    </ion-header>
    <br/>

    <div v-if="spinner">
        <ion-spinner name="lines" class="spinner"></ion-spinner>
    </div>
    <div v-else>
      <!-- <ion-card> -->
        <div v-if="email">
            <ion-item>
            <ion-label>{{$t('backoffice.form.titles.emailConfiguration')}}</ion-label> 
            </ion-item>
            <ion-item>
                <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.smtpHost')}}</ion-label>
                <ion-input type="text" name="SmtpHost"
                @input="SmtpHost = $event.target.value" 
                v-bind:value="SmtpHost">
                </ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.port')}}</ion-label>
                <ion-input type="number" name="Port"
                @input="Port = $event.target.value" 
                v-bind:value="Port">
                </ion-input>
            </ion-item>
            <ion-item>
            <ion-label>{{$t('backoffice.form.fields.secure')}}</ion-label>
            <ion-checkbox slot="end" name="Secure" 
                    @ionChange="Secure=$event.target.checked" 
                    :checked="Secure">
            </ion-checkbox>
            </ion-item>
            <ion-item>
                <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.email')}}</ion-label>
                <ion-input type="email" name="EmailHost"
                @input="EmailHost = $event.target.value" 
                v-bind:value="EmailHost">
                </ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.password')}}</ion-label>
                <ion-input type="password" name="Password"
                @input="Password = $event.target.value" 
                v-bind:value="Password">
                </ion-input>
            </ion-item>
            
            <ion-item>
                <ion-item-group side="start">
                    <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.email')}}</ion-label>
                    <ion-input type="email" name="EmailTest"
                    @input="EmailTest = $event.target.value" 
                    v-bind:value="EmailTest">
                    </ion-input>
                </ion-item-group>
                <ion-item-group side="end">
                    <ion-button color="primary" :disabled="checkEmailTest()" @click="emailTest()">Test email <ion-spinner v-if="emailspinner" name="crescent"></ion-spinner></ion-button>
                </ion-item-group>
            </ion-item>
            

            <br/>
            <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="save()">{{ $t('backoffice.form.buttons.save') }}</ion-button>
        </div>
        <div v-if="sms">
            <ion-item>
                <ion-label>{{$t('backoffice.form.titles.twilioSMS')}}</ion-label> 
            </ion-item>
            <ion-item>
                <ion-label >{{$t('backoffice.form.fields.acivateTwilio')}}
                    <ion-toggle name="activateTwilio" style="top: 12px;" Key="other"
                    @ionChange="setActivate($event.target.checked, 'twilio')" 
                    :checked ="activateTwilio">
                    </ion-toggle>
                </ion-label>
            </ion-item>
            <ion-item>
                <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.twFromNumber')}}</ion-label>
                <ion-input type="text" name="TwFromNumber"
                    @input="TwFromNumber = $event.target.value" 
                    v-bind:value="TwFromNumber">
                </ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.twAccountSID')}}</ion-label>
                <ion-input :type="showTwAccountSid" name="TwAccountSid"
                @input="TwAccountSid = $event.target.value" 
                v-bind:value="TwAccountSid">
                </ion-input>
                <ion-chip slot="end" color="primary" outline="true" @click="changeTwAccountSid()"><ion-icon name="eye"></ion-icon></ion-chip>
            </ion-item>
            <ion-item>
                <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.twToken')}}</ion-label>
                <ion-input :type="showTwToken" name="TwToken"
                @input="TwToken = $event.target.value" 
                v-bind:value="TwToken">
                </ion-input>
                <ion-chip slot="end" color="primary" outline="true" @click="changeTwToken()"><ion-icon name="eye"></ion-icon></ion-chip>
            </ion-item>

            <ion-item>
                <ion-label>{{$t('backoffice.form.titles.sinchSMS')}}</ion-label> 
            </ion-item>
            <ion-item>
                <ion-label >{{$t('backoffice.form.fields.acivateSinch')}}
                    <ion-toggle name="activateSinch" style="top: 12px;"
                    @ionChange="setActivate($event.target.checked, 'sinch')" 
                    :checked ="activateSinch">
                    </ion-toggle>
                </ion-label>
            </ion-item>
            <ion-item>
                <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.sinchFromNumber')}}</ion-label>
                <ion-input type="text" name="SinchFromNumber"
                    @input="SinchFromNumber = $event.target.value" 
                    v-bind:value="SinchFromNumber">
                </ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.sinchAccountSID')}}</ion-label>
                <ion-input :type="showSinchAccountSid" name="SinchAccountSid"
                @input="SinchAccountSid = $event.target.value" 
                v-bind:value="SinchAccountSid">
                </ion-input>
                <ion-chip slot="end" color="primary" outline="true" @click="changeSinchAccountSid()"><ion-icon name="eye"></ion-icon></ion-chip>
            </ion-item>
            <ion-item>
                <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.sinchToken')}}</ion-label>
                <ion-input :type="showSinchToken" name="SinchToken"
                @input="SinchToken = $event.target.value" 
                v-bind:value="SinchToken">
                </ion-input>
                <ion-chip slot="end" color="primary" outline="true" @click="changeSinchToken()"><ion-icon name="eye"></ion-icon></ion-chip>
            </ion-item>
            <br/>
            <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="save()">{{ $t('backoffice.form.buttons.save') }}</ion-button>
        </div>
        <!-- Capcha -->
        <div v-if="capcha">
            <ion-item>
                <ion-label>{{$t('backoffice.form.titles.capcha')}}</ion-label> 
            </ion-item>
            <ion-item>
                <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.capchaKey')}}</ion-label>
                <ion-input type="text" name="capchaKey"
                @input="capchaKey = $event.target.value" 
                v-bind:value="capchaKey">
                </ion-input>
            </ion-item>
        </div>
        <!-- Payments -->
        <div v-if="payments">
            <ion-segment id="paymentsSegment" @ionChange="paySegmentChanged($event.target.value)" :value="paySegmentValue" @input="value=paySegmentValue">
                <ion-segment-button value="shift4">
                    <!-- <span class="iconify" data-icon="dashicons:businessman" data-inline="false"></span> -->
                    <span>{{$t('backoffice.form.titles.shift4')}}</span>
                </ion-segment-button>
                <ion-segment-button value="auth">
                    <!-- <span class="iconify" data-icon="dashicons:businessman" data-inline="false"></span> -->
                    <span>{{$t('backoffice.form.titles.auth')}}</span>
                </ion-segment-button>
            </ion-segment>
            <!-- Shift4 -->
            <div v-if="shift4">
                <ion-item>
                    <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.endPointUrl')}}</ion-label>
                    <ion-input type="text" name="EndPointURLShift4"
                    @input="EndPointURLShift4 = $event.target.value" 
                    v-bind:value="EndPointURLShift4">
                    </ion-input>
                </ion-item>
                <ion-item>
                    <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.clientGuid')}}</ion-label>
                    <ion-input type="text" name="ClientGUIDShift4"
                    @input="ClientGUIDShift4 = $event.target.value" 
                    v-bind:value="ClientGUIDShift4">
                    </ion-input>
                </ion-item>
                <ion-item>
                    <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.interfazVersion')}}</ion-label>
                    <ion-input type="text" name="InterfaceVersionShift4"
                    @input="InterfaceVersionShift4 = $event.target.value" 
                    v-bind:value="InterfaceVersionShift4">
                    </ion-input>
                </ion-item>
                <ion-item>
                    <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.interfazName')}}</ion-label>
                    <ion-input type="text" name="InterfaceNameShift4"
                    @input="InterfaceNameShift4 = $event.target.value" 
                    v-bind:value="InterfaceNameShift4">
                    </ion-input>
                </ion-item>
                <ion-item>
                    <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.companyName')}}</ion-label>
                    <ion-input type="text" name="CompanyNameShift4"
                    @input="CompanyNameShift4 = $event.target.value" 
                    v-bind:value="CompanyNameShift4">
                    </ion-input>
                </ion-item>

                <div style="margin-top: 20px">
                    <!-- Aquí -->
                    <ion-item>
                        Tokens:
                    </ion-item>
                    <ion-item>
                        <ion-label position="floating"><span style="color: red">*</span>Access Token</ion-label>
                        <ion-input :type="showShift4AccessToken" name="Shift4AccessToken"
                        @input="Shift4AccessToken = $event.target.value" 
                        v-bind:value="Shift4AccessToken">
                        </ion-input>
                        <ion-chip slot="end" color="primary" outline="true" @click="changeShift4AccessToken()"><ion-icon name="eye"></ion-icon></ion-chip>
                    </ion-item>
                    <ion-item>
                        <ion-label position="floating"><span style="color: red">*</span>Moto Access Token</ion-label>
                        <ion-input :type="showShift4MotoAccessToken" name="Shift4MotoAccessToken"
                        @input="Shift4MotoAccessToken = $event.target.value" 
                        v-bind:value="Shift4MotoAccessToken">
                        </ion-input>
                        <ion-chip slot="end" color="primary" outline="true" @click="changeShift4MotoAccessToken()"><ion-icon name="eye"></ion-icon></ion-chip>
                    </ion-item>

                    <ion-item>
                        <ion-label position="floating"><span style="color: red">*</span>FB Access Token</ion-label>
                        <ion-input :type="showShift4FBAccessToken" name="Shift4FBAccessToken"
                        @input="Shift4FBAccessToken = $event.target.value" 
                        v-bind:value="Shift4FBAccessToken">
                        </ion-input>
                        <ion-chip slot="end" color="primary" outline="true" @click="changeShift4FBAccessToken()"><ion-icon name="eye"></ion-icon></ion-chip>
                    </ion-item>
                </div>

                <div style="margin-top: 20px">
                    <!-- Aquí -->
                    <ion-item>
                        <ion-label >Has Delivery Payment
                        <ion-toggle name="HasDeliveryPayment" style="top: 12px;" Key="other"
                            @ionChange="HasDeliveryPayment=$event.target.checked" 
                            :checked ="HasDeliveryPayment">
                        </ion-toggle>
                        </ion-label>
                    </ion-item>
                    <div v-if="HasDeliveryPayment">
                        <ion-item>
                            Delivery Account Tokens:
                        </ion-item>
                        <ion-item>
                            <ion-label position="floating"><span style="color: red">*</span>Delivery Access Token</ion-label>
                            <ion-input :type="showShift4DeliveryAccessToken" name="Shift4DeliveryAccessToken"
                            @input="Shift4DeliveryAccessToken = $event.target.value" 
                            v-bind:value="Shift4DeliveryAccessToken">
                            </ion-input>
                            <ion-chip slot="end" color="primary" outline="true" @click="changeShift4DeliveryAccessToken()"><ion-icon name="eye"></ion-icon></ion-chip>
                        </ion-item>
                        <ion-item>
                            <ion-label position="floating"><span style="color: red">*</span>Delivery Moto Access Token</ion-label>
                            <ion-input :type="showShift4DeliveryMotoAccessToken" name="Shift4DeliveryMotoAccessToken"
                            @input="Shift4DeliveryMotoAccessToken = $event.target.value" 
                            v-bind:value="Shift4DeliveryMotoAccessToken">
                            </ion-input>
                            <ion-chip slot="end" color="primary" outline="true" @click="changeShift4DeliveryMotoAccessToken()"><ion-icon name="eye"></ion-icon></ion-chip>
                        </ion-item>

                        <ion-item>
                            <ion-label position="floating"><span style="color: red">*</span>Delivery FB Access Token</ion-label>
                            <ion-input :type="showShift4DeliveryFBAccessToken" name="Shift4DeliveryFBAccessToken"
                            @input="Shift4DeliveryFBAccessToken = $event.target.value" 
                            v-bind:value="Shift4DeliveryFBAccessToken">
                            </ion-input>
                            <ion-chip slot="end" color="primary" outline="true" @click="changeShift4DeliveryFBAccessToken()"><ion-icon name="eye"></ion-icon></ion-chip>
                        </ion-item>
                    </div>
                </div>

            </div>
            <!-- Authorize.net -->
            <div v-if="auth">
                <ion-item>
                    <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.endPointUrl')}}</ion-label>
                    <ion-input type="text" name="endPointUrl"
                    @input="endPointUrl = $event.target.value" 
                    v-bind:value="endPointUrl">
                    </ion-input>
                </ion-item>
                <ion-item>
                    <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.apiLoginId')}}</ion-label>
                    <ion-input :type="showApiLoginId" name="apiLoginId"
                    @input="apiLoginId = $event.target.value" 
                    v-bind:value="apiLoginId">
                    </ion-input>
                    <ion-chip slot="end" color="primary" outline="true" @click="changeApiLoginId()"><ion-icon name="eye"></ion-icon></ion-chip>
                </ion-item>
                <ion-item>
                    <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.transactionKey')}}</ion-label>
                    <ion-input :type="showTransactionKey" name="transactionKey"
                    @input="transactionKey = $event.target.value" 
                    v-bind:value="transactionKey">
                    </ion-input>
                    <ion-chip slot="end" color="primary" outline="true" @click="changeTransactionKey()"><ion-icon name="eye"></ion-icon></ion-chip>
                </ion-item>
            </div>
            <br/>
            <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="save()">{{ $t('backoffice.form.buttons.save') }}</ion-button>
        </div>
        <div v-if="user">
            <ion-header>
                <ion-toolbar>
                    <ion-label style="padding: 20px 100px;">
                        <h1>{{$t('backoffice.form.titles.supportUsers')}}</h1>         
                    </ion-label>
                    <ion-label slot="end">
                        <ion-chip @click="newUser()" style="font-size: 30px" outline color="primary">
                            <ion-label><ion-icon name="add"></ion-icon></ion-label>
                        </ion-chip>
                    </ion-label>
                </ion-toolbar>
                <ion-searchbar  
                    @input="handleInput($event.target.value)" @ionClear="filterUsers = users"
                    :placeholder="$t('frontend.home.search')">           
                </ion-searchbar>
            </ion-header>
            <div v-if="spinner">
                <ion-spinner name="lines" class="spinner"></ion-spinner>
            </div>
            <div v-else>
            <div v-if="screenWidth < 600">
                <paginate
                name="languages"
                :list="filterUsers"
                :per="8"
                >
                    <ion-list>
                    <ion-item-sliding v-for="u in paginated('languages')" v-bind:key="u._id">
                        <ion-item>
                        <ion-thumbnail slot="start">
                            <ion-img v-if="u.ImageUrl  != ''" :src="u.ImageUrl"></ion-img>
                            <ion-img v-else :src="require('../assets/user.png')"></ion-img>
                        </ion-thumbnail>
                        <ion-label>
                            <h2>{{ u.FirstName }} {{u.LastName}}</h2>
                            <h3>{{ u.Email }}</h3>
                        </ion-label>
                        <span slot="end" class="iconify" data-icon="mdi:backburger" data-inline="false"></span>
                        </ion-item>
                        <ion-item-options side="end">
                        <ion-item-option color="primary" @click="editUser(u._id)">
                            <ion-icon slot="icon-only" name="create"></ion-icon>
                        </ion-item-option>
                        <ion-item-option color="danger" @click="deleteUser(u._id)">
                            <ion-icon slot="icon-only" name="trash"></ion-icon>
                        </ion-item-option>
                        </ion-item-options>
                    </ion-item-sliding>
                </ion-list>
                </paginate>

                <paginate-links for="languages" color="primary" 
                :simple="{
                    next:'»' ,
                    prev: '« ' }"
                ></paginate-links>  
            </div>

            <div v-if="screenWidth >= 600">
                <paginate
                name="languages"
                :list="filterUsers"
                :per="8"
                >
                    <ion-list>
                    <ion-item v-for="u in paginated('languages')" v-bind:key="u._id">
                        <ion-thumbnail slot="start">
                            <ion-img v-if="u.ImageUrl  != ''" :src="u.ImageUrl"></ion-img>
                            <ion-img v-else :src="require('../assets/user.png')"></ion-img>
                        </ion-thumbnail>
                        <ion-label>
                            <h2>{{ u.FirstName }} {{u.LastName}}</h2>
                            <h3>{{ u.Email }}</h3>
                        </ion-label>
                        <ion-item-group side="end">
                        <ion-button color="primary" @click="editUser(u._id)">
                            <ion-icon slot="icon-only" name="create"></ion-icon>
                        </ion-button>
                        <ion-button color="danger" @click="deleteUser(u._id)">
                            <ion-icon slot="icon-only" name="trash"></ion-icon>
                        </ion-button>
                        </ion-item-group>
                    </ion-item>
                </ion-list>
                </paginate>

                <paginate-links for="languages" color="primary" 
                :simple="{
                    next:'»' ,
                    prev: '« ' }"
                ></paginate-links>  
            </div>

            </div>
        </div>
        <!-- Restaurants -->
        <div v-if="segmentValue === 'restaurants'">
            <ion-segment :value="restaurantSegmentValue" @input="value=restaurantSegmentValue">
                <ion-segment-button value="create" @click="restaurantSegmentValue='create'">
                    <span>{{$t('frontend.createNew.restaurantType')}}</span>
                </ion-segment-button>
                <ion-segment-button value="deleter" @click="restaurantSegmentValue='deleter'">
                    <span>Delete</span>
                </ion-segment-button>
            </ion-segment>
            <!-- Crear -->
            <div v-if="restaurantSegmentValue==='create'">
                <RestaurantType/>
            </div>
            <!-- Delete -->
            <div v-if="restaurantSegmentValue==='deleter'" >
                
                
                 <div v-if="allRestaurant.length > 0"  style="display: flex;justify-content: center;padding: 40px 0;">
                      <ion-thumbnail >
                            <img  :src="imgRestaurant">
                      </ion-thumbnail> 
                              <ion-select interface="popover" icon="add"
                              style="padding: 10px 50px;"
                              :ok-text="$t('backoffice.form.messages.buttons.ok')"
                              :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
                              :value="allRestaurant[0]._id"
                              :placeholder="$t('frontend.menu.menu')"
                                @ionChange="idDeleteRestaurant=$event.target.value,getRestaurantImg()" >
                                  <ion-select-option v-for="res in allRestaurant"                    
                                    :key="res._id" 
                                    :value="res._id" > {{res.Name}}
                                  </ion-select-option>                                
                              </ion-select>

                            <ion-button :disabled="idDeleteRestaurant ===''? true : false" color="light"
                                v-if="!spinnerDelete"
                                @click="deleteRestaurant()">
                                <span  class="iconify" data-icon="fluent:delete-16-regular" data-inline="false" style="color: red;margin:0"></span>
                            </ion-button>
                            <ion-spinner v-if="spinnerDelete" color="danger"></ion-spinner>
                    </div>
            </div>
        </div>
    </div>
    </div>
</template>

<script>

import { Api } from '../api/api.js';
import { EventBus } from '../../frontend/event-bus';

import RestaurantType from './RestaurantType.vue'

export default {

  name: 'funDataSettingForm',
   
  data () {
    return {
      modelName: 'imenusupport',
      /****** Form Data ******/
      /* 
        SmtpHost: String,
        EmailHost: String,
        Port: Number,
        Secure: Boolean,
        Password: String,
        TwFromNumber: String,
        TwAccountSid: String,
        TwToken: String,
        EndPointURLShift4: { type: String, default: 'https://utgapi.shift4test.com/api/rest/v1/' },
        ClientGUIDShift4: String,
        InterfaceVersionShift4: String,
        InterfaceNameShift4: String,
        CompanyNameShift4: String,
        FreeTwilioMessage: { type: Number, default: 0 },
      */
      //Email
      emailspinner: false,

      SmtpHost: '',
      EmailHost: '',
      Port: 0,
      Secure: false,
      Password: '',

      //SMS
      TwFromNumber: '',
      TwAccountSid: '',
      TwToken: '',
      FreeTwilioMessage: 0,
      activateTwilio: false,

      showTwAccountSid: "password",
      showTwToken: "password",

      SinchFromNumber: '',
      SinchAccountSid: '',
      SinchToken: '',
      activateSinch: false,

      showSinchAccountSid: "password",
      showSinchToken: "password",

      //Authorize.net
      endPointUrl : '',
      apiLoginId: '',
      transactionKey:'',

      showApiLoginId: "password",
      showTransactionKey: "password",

      //Shift4
      EndPointURLShift4: '',
      ClientGUIDShift4: '',
      InterfaceVersionShift4: '',
      InterfaceNameShift4: '',
      CompanyNameShift4: '',

      //Shift4 Access Token
      showShift4AccessToken: "password",
      Shift4AccessToken: '',

      //Shift4 Moto Access Token
      showShift4MotoAccessToken: "password",
      Shift4MotoAccessToken: '',

      //Shift4 FB Access Token
      showShift4FBAccessToken: "password",
      Shift4FBAccessToken: '',

      HasDeliveryPayment: false,
      Setting_id: null,

      //Shift4 Delivery Access Token
      showShift4DeliveryAccessToken: "password",
      Shift4DeliveryAccessToken: '',

      //Shift4 Delivery Moto Access Token
      showShift4DeliveryMotoAccessToken: "password",
      Shift4DeliveryMotoAccessToken: '',

      //Shift4 Delivery FB Access Token
      showShift4DeliveryFBAccessToken: "password",
      Shift4DeliveryFBAccessToken: '',

      //Capcha
      capchaKey: '',

      id: null,
      methodPayment_id: null,
      isBackdrop: false,
      spinner: false,

      //Segment
      segmentValue: 'email',
      paySegmentValue: 'shift4',
      email: true,
      sms: false,
      payments: false,
      capcha: false,
      user: false,

      //Payments segments
      shift4: true,
      auth: false,

      //Users
      users: [],
      filterUsers: [],

      paginate: ['languages'],

      screenWidth: 0,

      restaurantSegmentValue: 'create',
      allRestaurant: [],
      idDeleteRestaurant: '',
      imgRestaurant: '',
      key: 0,
      spinnerDelete: false,

      //Email Test
      EmailTest: '',
    }
  },
  components:{
    RestaurantType
  },
  created: async function(){

      if(this.$route.params.segmentValue)
        this.segmentChanged(this.$route.params.segmentValue)
      
      await this.getAllRestaurant();
      this.imgRestaurant = this.allRestaurant[0].ImageUrl;
      this.init();
  },
  methods: {
    checkEmailTest(){
        if (this.EmailTest == '')
            return true
        else{
            let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
            if (emailRegex.test(this.EmailTest) == false){
                return true
            }
        }
        return false
    },
    emailTest(){
        this.emailspinner = true
        const test = {
            "Email": this.EmailTest,
            "mss": "This is a sample message. Please, dont respond this message.",
            "subject": "iMenuApps support."
        }
        Api.testSupportEmail(test)
        .then(res => {
            console.log("Success")
            console.log(res)
            this.emailspinner = false
        })
        .catch(e => {
            console.log("Error")
            console.log(e)
            this.emailspinner = false
        })
    },
    changeApiLoginId(){
        if (this.showApiLoginId == "password")
            this.showApiLoginId = "text"
        else
            this.showApiLoginId = "password"
    },
    changeTransactionKey(){
        if (this.showTransactionKey == "password")
            this.showTransactionKey = "text"
        else
            this.showTransactionKey = "password"
    },
    changeTwAccountSid(){
        if (this.showTwAccountSid == "password")
            this.showTwAccountSid = "text"
        else
            this.showTwAccountSid = "password"
    },
    changeTwToken(){
        if (this.showTwToken == "password")
            this.showTwToken = "text"
        else
            this.showTwToken = "password"
    },
    changeSinchAccountSid(){
        if (this.showSinchAccountSid == "password")
            this.showSinchAccountSid = "text"
        else
            this.showSinchAccountSid = "password"
    },
    changeSinchToken(){
        if (this.showSinchToken == "password")
            this.showSinchToken = "text"
        else
            this.showSinchToken = "password"
    },
    changeShift4AccessToken(){
        if (this.showShift4AccessToken == "password")
            this.showShift4AccessToken = "text"
        else
            this.showShift4AccessToken = "password"
    },
    changeShift4MotoAccessToken(){
        if (this.showShift4MotoAccessToken == "password")
            this.showShift4MotoAccessToken = "text"
        else
            this.showShift4MotoAccessToken = "password"
    },
    changeShift4FBAccessToken(){
        if (this.showShift4FBAccessToken == "password")
            this.showShift4FBAccessToken = "text"
        else
            this.showShift4FBAccessToken = "password"
    },

    changeShift4DeliveryAccessToken(){
        if (this.showShift4DeliveryAccessToken == "password")
            this.showShift4DeliveryAccessToken = "text"
        else
            this.showShift4DeliveryAccessToken = "password"
    },
    changeShift4DeliveryMotoAccessToken(){
        if (this.showShift4DeliveryMotoAccessToken == "password")
            this.showShift4DeliveryMotoAccessToken = "text"
        else
            this.showShift4DeliveryMotoAccessToken = "password"
    },
    changeShift4DeliveryFBAccessToken(){
        if (this.showShift4DeliveryFBAccessToken == "password")
            this.showShift4DeliveryFBAccessToken = "text"
        else
            this.showShift4DeliveryFBAccessToken = "password"
    },
    setActivate(val, system){
        if (system === 'twilio'){
            this.activateTwilio = val
            if (val)
                this.activateSinch = !val
        }
        if(system === 'sinch'){
            if (val)
                this.activateTwilio = !val
            this.activateSinch = val
        }
    },
    segmentChanged(value){            
        //console.log(value)
        if(value === 'email'){
            this.email = true
            this.sms = false
            this.payments = false
            this.capcha = false
            this.user = false
        }
        if(value === 'sms'){
            this.email = false
            this.sms = true
            this.payments = false
            this.capcha = false
            this.user = false
        }
        if(value === 'payments'){
            this.email = false
            this.sms = false
            this.payments = true
            this.capcha = false
            this.user = false          
        }
        if(value === 'capcha'){
            this.email = false
            this.sms = false
            this.payments = false
            this.capcha = true
            this.user = false          
        }
        if(value === 'user'){
            this.email = false
            this.sms = false
            this.payments = false
            this.capcha = false
            this.user = true
        }
        if(value === 'restaurants'){
            this.email = false
            this.sms = false
            this.payments = false
            this.capcha = false
            this.user = false
        }
        this.segmentValue = value;
    },
    paySegmentChanged(value){
        if(value === 'shift4'){
            this.shift4 = true
            this.auth = false
        }
        if(value === 'auth'){
            this.shift4 = false
            this.auth = true
        }
    },
    handleInput(value){
      this.filterUsers = this.users
      const query = value.toLowerCase();
      requestAnimationFrame(() => {   
        let cat2 = this.users.filter(item => item.Email.toLowerCase().indexOf(query) > -1)
        if(cat2.length> 0)
          this.filterUsers = cat2
        else
          this.filterUsers = this.users
      });
    },
    fetchUsers: function(){
        this.$ionic.loadingController
        .create({
          cssClass: 'my-custom-class',
          message: this.$t('backoffice.titles.loading'),
          backdropDismiss: true
        })
        .then(loading => {
            loading.present()
            setTimeout(() => {
                //llamada ajax						
                Api.fetchAll('Staff').then(response => {
                  this.users = response.data
                  this.users = this.users.filter(usr => usr.IsSupport == true)
                  this.filterUsers = this.users
                  loading.dismiss()
                })
                .catch(e => {
                  console.log(e)
                  loading.dismiss()
                  this.ifErrorOccured(this.fetchUsers)
                });
            })
        })
    },
    newUser: function(){
        this.$router.push({
        name: 'UserForm', 
        params: { 
            userId: null,
            isSupport: true
        }
      });
    },
    editUser: function(id){
        this.$router.push({
        name: 'UserForm', 
        params: { 
            userId: id,
            isSupport: true
        }
      });
    },
    deleteUser: function(id){

        return this.$ionic.alertController.create({
        title: this.$t('backoffice.list.messages.confirmDelete'),
        message: this.$t('backoffice.list.messages.deleteUser'),
        buttons: [
          {
            text: this.$t('backoffice.list.messages.buttons.cancel'),
            role: 'cancel',
            handler: () => {
              
            }
          },
          {
            text: this.$t('backoffice.list.messages.buttons.delete'),
            handler: () => {
              
              this.spinner = true
              Api.deleteById(this.modelName, id)
                .then(response => {
                    // this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
                    //   this.$t('backoffice.list.messages.messageDeleteSuccessUser'),
                    //       this.$t('backoffice.list.messages.deleteSubtitleUser'));
                  this.showToastMessage(this.$t('backoffice.list.messages.messageDeleteSuccessUser'), "success");
                  this.fetchUsers();
                  this.spinner = false;
                  return response;
                })
                .catch(e => {
                  console.log(e);
                  this.ifErrorOccured(mess => {
                      this.deleteUser(id)
                      this.spinner = false
                      return mess
                  });
                })

            }
          }
        ]
      })
      .then(a => a.present());
    },
    init(){
        this.screenWidth = screen.width;
        this.id = this.$route.params.settingId;
        if (this.$route.params.tab === 'user')
            this.segmentChanged('user');
        this.fetchUsers();
        this.$ionic.loadingController
        .create({
          cssClass: 'my-custom-class',
          message: this.$t('backoffice.titles.loading'),
          backdropDismiss: true
        })
        .then(loading => {
            loading.present()
            setTimeout(() => {  // Some AJAX call occurs
                Api.fetchAll(this.modelName)
                .then(response => {
                  //console.log(response)
                  if (response.data.length > 0)
                  {
                      //console.log("iMenuSupport")
                      //console.log(response.data[0])
                  if (response.data.length > 0)
                  {
                      this.id = response.data[0]._id
                      this.SmtpHost = response.data[0].SmtpHost
                      this.EmailHost = response.data[0].EmailHost
                      this.Port = response.data[0].Port
                      this.Secure = response.data[0].Secure
                      this.Password = response.data[0].Password
                      this.TwFromNumber = response.data[0].TwFromNumber
                      this.TwAccountSid = response.data[0].TwAccountSid
                      this.TwToken = response.data[0].TwToken

                      if (response.data[0].smsSystem === 'twilio')
                        this.activateTwilio = true
                      if (response.data[0].smsSystem === 'sinch')
                        this.activateSinch = true

                      this.SinchFromNumber = response.data[0].SinchFromNumber
                      this.SinchAccountSid = response.data[0].SinchAccountSid
                      this.SinchToken = response.data[0].SinchToken

                      this.FreeTwilioMessage = response.data[0].FreeTwilioMessage
                      this.EndPointURLShift4 = response.data[0].EndPointURLShift4
                      this.ClientGUIDShift4 = response.data[0].ClientGUIDShift4
                      this.InterfaceVersionShift4 = response.data[0].InterfaceVersionShift4
                      this.InterfaceNameShift4 = response.data[0].InterfaceNameShift4
                      this.CompanyNameShift4 = response.data[0].CompanyNameShift4
                      this.capchaKey = response.data[0].CaptchaKey
                  }
                  
                  loading.dismiss();
                  return response;
                }
                })
                // )
                .catch(e => {
                  console.log(e);
                  loading.dismiss();
                })

                //Has Delivery Payment
                Api.fetchAll('setting')
                .then(response => {
                    if (response.data.length > 0){
                        //console.log("SETTING")
                        //console.log(response.data)
                        this.Setting_id = response.data[response.data.length -1]._id
                        this.HasDeliveryPayment = response.data[response.data.length -1].HasDeliveryPayment
                    }
                        
                })
                .catch(e => {
                    console.log(e)
                })

                //Payment Methods
                Api.fetchAll('methodpay')
                .then(response => {
                    //console.log("METHODS PAY")
                    //console.log(response.data)
                    if (response.data.length > 0){
                        this.methodPayment_id = response.data[0]._id
                        this.Shift4AccessToken = response.data[0].AccessTokenShift4
                        this.Shift4MotoAccessToken = response.data[0].MotoAccessTokenShift4
                        this.Shift4FBAccessToken = response.data[0].FBAccessTokenShift4
                        this.Shift4DeliveryAccessToken = response.data[0].DeliveryAccessTokenShift4
                        this.Shift4DeliveryMotoAccessToken = response.data[0].DeliveryMotoAccessTokenShift4
                        this.Shift4DeliveryFBAccessToken = response.data[0].DeliveryFBAccessTokenShift4
                    }
                })
                .catch(e => {
                    console.log(e)
                })
            })
        })   
        //console.log(this.$route.params);
        
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
        return true
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
    save: function(){

        if (this.isValidForm()){

          this.isBackdrop = true;

            //console.log(this.pickFrom);

            let smsSystem = ''
            if (this.activateTwilio)
                smsSystem = 'twilio'
            if (this.activateSinch)
                smsSystem = 'sinch'
            
            let item = {
                "SmtpHost": this.SmtpHost,
                "EmailHost": this.EmailHost,
                "Port": this.Port,
                "Secure": this.Secure,
                "Password": this.Password,
                "TwFromNumber": this.TwFromNumber,
                "TwAccountSid": this.TwAccountSid,
                "TwToken": this.TwToken,
                "SinchFromNumber": this.SinchFromNumber,
                "SinchAccountSid": this.SinchAccountSid,
                "SinchToken": this.SinchToken,
                "smsSystem": smsSystem,
                "FreeTwilioMessage": this.FreeTwilioMessage,
                "EndPointURLShift4": this.EndPointURLShift4,
                "ClientGUIDShift4": this.ClientGUIDShift4,
                "InterfaceVersionShift4": this.InterfaceVersionShift4,
                "InterfaceNameShift4": this.InterfaceNameShift4,
                "CompanyNameShift4": this.CompanyNameShift4,
                "CaptchaKey": this.captchaKey,
            }

            let methodPaymentItem = {
                "AccessTokenShift4": this.Shift4AccessToken,
                "MotoAccessTokenShift4": this.Shift4MotoAccessToken,
                "FBAccessTokenShift4": this.Shift4FBAccessToken,
                "DeliveryAccessTokenShift4": this.Shift4DeliveryAccessToken,
                "DeliveryMotoAccessTokenShift4": this.Shift4DeliveryMotoAccessToken,
                "DeliveryFBAccessTokenShift4": this.Shift4DeliveryFBAccessToken
            }

            let settingItem = {
                "HasDeliveryPayment": this.HasDeliveryPayment
            }

            //If I am editing
            if (this.id){
              item['_id'] = this.id;
              this.spinner = true;
              Api.putIn(this.modelName, item)
                  .then(response => {
                        this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessSetting'), "success");
                        this.spinner = false;
                        if (this.methodPayment_id){
                            methodPaymentItem["_id"] = this.methodPayment_id
                            Api.putIn("methodpay", methodPaymentItem)
                            .catch(error => {
                                console.log(error)
                            })
                        }
                        // else{
                        //     Api.postIn("methodpay", methodPaymentItem)
                        //     .catch(error => {
                        //         console.log(error)
                        //     })
                        // }

                        if (this.Setting_id){
                            settingItem["_id"] = this.Setting_id
                            Api.putIn("setting", settingItem)
                            .catch(error => {
                                console.log(error)
                            })
                        }
                        // else{
                        //     Api.postIn("setting", settingItem)
                        //     .catch(error => {
                        //         console.log(error)
                        //     })
                        // }
                        
                        return response;
                  })
                  .catch(e => {
                        console.log(e);
                        this.spinner = false
                        this.ifErrorOccured(this.save);
                  })


            }
            // else{
            //   //Else, I am created a new category
            //   this.spinner = true
            //   Api.postIn(this.modelName, item)
            //       .then(response => {
            //           this.showToastMessage(this.$t('backoffice.list.messages.messageCreateSuccessSetting'), "success");
            //           this.spinner = false
            //           if (this.methodPayment_id){
            //             methodPaymentItem["_id"] = this.methodPayment_id
            //             Api.putIn("methodpay", methodPaymentItem)
            //             .catch(error => {
            //                 console.log(error)
            //             })
            //           }
            //           else{
            //             Api.postIn("methodpay", methodPaymentItem)
            //             .catch(error => {
            //                 console.log(error)
            //             })
            //           }

            //           if (this.Setting_id){
            //             settingItem["_id"] = this.Setting_id
            //             Api.putIn("setting", settingItem)
            //             .catch(error => {
            //                 console.log(error)
            //             })
            //           }
            //           else{
            //             Api.postIn("setting", settingItem)
            //             .catch(error => {
            //                 console.log(error)
            //             })
            //           }

            //           return response;
            //       })
            //       .catch(e => {
            //           console.log(e);
            //           this.spinner = false
            //           this.ifErrorOccured(this.save);
            //       })
            // }

        }
    },
    
    async getAllRestaurant(){
        for(var i =0; i < this.$store.state.user.AllRestaurant.length; i++){
            const rest = await Api.fetchById('Restaurant', this.$store.state.user.AllRestaurant[i]);
            if(rest.status === 200)
                this.allRestaurant.push(rest.data);
        }
    },

    async deleteRestaurant(){

        this.$ionic.alertController.create({
        title: this.$t('backoffice.list.messages.confirmDelete'),
        message: this.$t('backoffice.list.messages.deleteRestaurant'),
        buttons: [
          {
            text: this.$t('backoffice.list.messages.buttons.cancel'),
            role: 'cancel',
            handler: () => {
              
            }
          },
          {
            text: this.$t('backoffice.list.messages.buttons.delete'),
            handler: async() => {

                if(this.idDeleteRestaurant !== ''){
                    this.spinnerDelete = true;
                    await Api.deleteRestaurant(this.idDeleteRestaurant);

                    //DELETE RESTAURANT FROM STORAGE
                    let resIndex = this.$store.state.user.AllRestaurant.indexOf(this.idDeleteRestaurant);
                    console.log(resIndex)
                    if (resIndex){
                        this.$store.state.user.AllRestaurant.splice(resIndex, 1);
                        
                        this.allRestaurant = []
                        await this.getAllRestaurant()
                        EventBus.$emit('userRestaurant', this.allRestaurant)
                        this.showToastMessage(this.$t('backoffice.list.messages.messageDeleteSuccessRestaurant'), 'success')

                        console.log("Resto de restaurantes")
                        console.log(this.$store.state.user.AllRestaurant)
                    }
                    
                    this.spinnerDelete = false;
                }

            }
          }
        ]
      })
      .then(a => a.present());

        
    },

    getRestaurantImg(){ 
       //  this.key ++;      
        const index = this.allRestaurant.findIndex(r => r._id === this.idDeleteRestaurant)
            if(index !== -1){
                if(this.allRestaurant[index].ImageUrl){
                     this.imgRestaurant = this.allRestaurant[index].ImageUrl;
                     return;
                }
            }
                           
       
        this.imgRestaurant = '';
    }
  },
  
}
</script>

<style>

.menu-col-3{
    flex: 0 0 calc(calc(3 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(3 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(3 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
}
  
ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

.paginate-list {
  width: 159px;
  margin: 0 auto;
  text-align: left;
 
}
 .paginate-list li {
    display: block;   
  }

.paginate-list li:before {
    content: '⚬ ';
    font-weight: bold;
    color: slategray;
  }

.paginate-links.items {
  user-select: none;
}

a {
  cursor: pointer;
}

li.active a {
  font-weight: bold;
}

li.next:before {
  content: ' | ';
  margin-right: 13px;
  color: #ddd;
}

li.disabled a {
  color: #ccc;
  cursor: no-drop;
}

.prev, .next{
  font-size: 40px;
}

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