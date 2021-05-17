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
                            <ion-img :src="u.ImageUrl"></ion-img>
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
                            <ion-img :src="u.ImageUrl"></ion-img>
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
    </div>
    </div>
</template>

<script>

import { Api } from '../api/api.js';

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

      //Capcha
      capchaKey: '',

      id: null,
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
    }
  },
  created: function(){
      this.init();
  },
  methods: {
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
        console.log(value)
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
                  // console.log(response.data)
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
                  console.log(response)
                  if (response.data.length > 0)
                  {
                      console.log("iMenuSupport")
                      console.log(response.data[0])
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
                })
                .catch(e => {
                  console.log(e);
                  loading.dismiss();
                })
            })
        })   
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

            console.log(this.pickFrom);

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

            //If I am editing
            if (this.id){
              item['_id'] = this.id;
              this.spinner = true;
              Api.putIn(this.modelName, item)
                  .then(response => {
                        this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessSetting'), "success");
                        this.spinner = false;
                        return response;
                  })
                  .catch(e => {
                        console.log(e);
                        this.spinner = false
                        this.ifErrorOccured(this.save);
                  })
            }
            else{
              //Else, I am created a new category
              this.spinner = true
              Api.postIn(this.modelName, item)
                  .then(response => {
                      this.showToastMessage(this.$t('backoffice.list.messages.messageCreateSuccessSetting'), "success");
                      this.spinner = false
                      return response;
                  })
                  .catch(e => {
                      console.log(e);
                      this.spinner = false
                      this.ifErrorOccured(this.save);
                  })
            }

        }
    },
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