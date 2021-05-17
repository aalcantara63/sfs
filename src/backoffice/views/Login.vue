<template>
    <div>
      <div v-if="!forgotP">
          <ion-card>
            <!-- <div v-if="basicSettings != null" class="logo"> -->
              <!-- <img  src="../../frontend/views/logo.png" > -->
              <!-- <img  :src="basicSettings.ImageUrl" > -->
            <!-- </div> -->
            <ion-item>
              <ion-input type="email" name="email" :placeholder="$t('backoffice.form.fields.email')"
              @input="email = $event.target.value" 
              v-bind:value="email">
              </ion-input>
            </ion-item>
            <ion-item>
              <ion-input type="password" name="password" :placeholder="$t('backoffice.form.fields.password')"
              @input="password = $event.target.value" 
              v-bind:value="password">
              </ion-input>
            </ion-item>
                <ion-button expand="full" color="primary" @click="login">{{$t('backoffice.form.login')}}</ion-button>
            <ion-item>
                <a class="forgotPass" @click="forgotPassword()">{{$t('backoffice.options.forgotPassword')}}</a>
            </ion-item>
            <div v-if="spinner">
                <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
            </div>
          </ion-card> 
      </div>
      <div v-else>
          <ion-card>
              <ion-item>
                <ion-input type="email" name="forgotEmail" :placeholder="$t('backoffice.form.fields.email')"
                @input="forgotEmail = $event.target.value" 
                v-bind:value="forgotEmail">
                </ion-input>
              </ion-item>
              <ion-button :disabled="forgotEmail === ''" expand="full" color="primary" @click="sendNewPass()">{{$t('backoffice.options.sendNewPassword')}}</ion-button>
              <ion-item>
              <a class="forgotPass" @click="back()">Back</a>
              </ion-item>
              <div v-if="spinner">
                  <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
              </div>
          </ion-card>
      </div>

    </div>
</template>

<script>

import { Api } from '../api/api.js';
import { payAuthorizeNet } from '../api/payments.js';
import { EventBus } from '../../frontend/event-bus';

export default {

  name: 'userForm',
   
  data () {
    return {
      email: '',
      password: '',

      userLogin: null,

      users: [],
      indexUserIsLogin: -1,

      forgotP: false,
      forgotEmail: '',
      // basicSettings: null,
      spinner: false,
    }
  },
  created: function(){
    //  this.getConfig();
    //  this.fetchUsers();
  },
  methods: {
      forgotPassword(){
          this.forgotP = true;
      },
      back(){
          this.forgotP = false;
      },
      sendNewPass(){
          this.spinner = true
          if (this.forgotEmail === "")
          {
              this.ShowMessage(this.$t('backoffice.form.validate.validate'), this.$t('backoffice.form.validate.email'), this.$t('backoffice.options.sendNewPassword'));
              return;
          }
          let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
          if (emailRegex.test(this.forgotEmail) == false)
          {
              this.ShowMessage(this.$t('backoffice.form.validate.validate'), this.$t('backoffice.form.validate.emailIncorrect'), this.$t('backoffice.options.sendNewPassword'));
              return
          }
          const item = {
              "Email": this.forgotEmail,
          }
          Api.loginForgot(item)
          .then(response => {
              console.log(response)
              this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'), this.$t('backoffice.list.messages.newPasswordSent'), this.$t('backoffice.options.login'))

              this.forgotEmail = ''
              this.forgotP = false
              this.spinner = false
          })
          .catch(e => {
              console.log(e)
              this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'), this.$t('backoffice.form.validate.emailDontExist'), this.$t('backoffice.options.login'))
              this.spinner = false
          })
      },
      ShowMessage(type, message, topic='') {
        return this.$ionic.alertController
          .create({
            cssClass: 'my-custom-class',
            header: type,
            subHeader: topic,
            message: message,
            buttons: ['OK'],
          })
        .then(a => a.present())
      },
      login: async function(){
          this.spinner = true
          if (this.email == "")
          {
              this.ShowMessage(this.$t('backoffice.form.validate.validate'), this.$t('backoffice.form.validate.email'), this.$t('backoffice.options.login'));
              return;
          }
          if (this.password == "")
          {
              this.ShowMessage(this.$t('backoffice.form.validate.validate'), this.$t('backoffice.form.validate.password'), this.$t('backoffice.options.login'));
              return;
          }
          //Comienza el login
          const item = {
              "Email": this.email,
              "Password": this.password
          }
          Api.login(item).then(response => {
              this.userLogin = response.data
              console.log("LOGIN");
              console.log(this.userLogin);
              this.$store.commit("setAuthentication", true);
              this.$store.commit("setUser", this.userLogin);
              //Set token
              console.log("Token");
              console.log(this.userLogin.token);
              Api.setTokenId(this.userLogin.token);
              Api.setRestaurantId(this.userLogin.RestaurantId);
              console.log("RESTAURANT")
              console.log(Api.getRestaurant())
              this.getConfig();

              //Set ClerkId for payments.
              payAuthorizeNet.setClerkId(this.userLogin.ServerId)

              console.log("roles")
              console.log(this.userLogin.Roles);
              let roles = [];
              this.userLogin.Roles.forEach(rol_id => {
                  Api.fetchById("rol", rol_id).then(response => {
                      roles.push(response.data);
                  })
              });
              console.log("Estos son los roles");
              console.log(roles);
              this.$store.commit("setRoles", roles);
              document.querySelector('ion-menu-controller').close('end')
              EventBus.$emit('blockScreen', 'true')
              EventBus.$emit('staffName', this.userLogin.FirstName + ' ' + this.userLogin.LastName)
              this.spinner = false
              if (this.userLogin.IsSupport){
                  this.$router.push({
                      name: 'Support'
                  });
              }
              else{
                  this.$router.push({
                      name: 'ControlPanel',
                      params: {
                          'firstLogin': true,
                      }
                  });
              }
          })
          .catch(e => {
            console.log(e)
            this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'), this.$t('backoffice.list.messages.emailOrPasswordIncorrect'), this.$t('backoffice.options.login'));
            this.spinner = false
          });

          // if (this.isUser()){
          //     let user = this.users[this.indexUserIsLogin];
          //     this.$store.commit("setAuthentication", true);
          //     this.$store.commit("setUser", user);
          //     Api.setRestaurantId(user.RestaurantId);
          //     this.getConfig();

          //     let roles = [];
          //     user.Roles.forEach(rol_id => {
          //         Api.fetchById("rol", rol_id).then(response => {
          //             roles.push(response.data);
          //         })
          //     });
          //     this.$store.commit("setRoles", roles);
          //     document.querySelector('ion-menu-controller').close('end')
          //     this.$router.push({
          //         name: 'ControlPanel'
          //     });
          // }else{
          //     this.ShowMessage('Info', 'Email or password incorrect', 'Login');
          // }
      },
      // isUser(){
      //     for (let index = 0; index < this.users.length; index++) {
      //         if (this.users[index].Email == this.email &&
      //                this.users[index].Password == this.password){
      //             this.indexUserIsLogin = index;
      //             return true;
      //         }
      //     }
      //     return false;
      // },
      fetchUsers: function(){
        Api.fetchAll("Login").then(response => {
          this.users = response.data
        })
        .catch(e => {
          console.log(e)
        });
      },
      getConfig: function(){
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
      // setConfig: function(){
      //    var allStyles= Api;
      //       document.querySelector('style').innerHTML += allStyles;
      // },
  },

}
    
</script>

<style>

    div.logo{
      text-align: center;
      text-align: -webkit-center;
      margin: 30px 0px 30px 0px;
    }

    div.logo img{
      width:50%;
    }

    .forgotPass{
      cursor: pointer;
      font-size: 13px;
    }

</style>