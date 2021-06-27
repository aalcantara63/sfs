<template>
    <div class="screen">
    <ion-backdrop v-if="isBackdrop"></ion-backdrop>

    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="backtoList()"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>{{title}}</h1>            
            </ion-label>
          </ion-toolbar>
    </ion-header>
    <br/>

    <div v-if="spinner">
        <ion-spinner name="lines" class="spinner"></ion-spinner>
    </div>
    <div v-else>
        <ion-item>
          <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.name')}}</ion-label>
            <ion-input type="text" name="name"
            @input="name = $event.target.value" 
            v-bind:value="name">
          </ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">{{$t('backoffice.form.fields.phone')}}</ion-label>
            <ion-input type="text" name="phone"
            @input="phone = $event.target.value" 
            v-bind:value="phone">
          </ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.email')}}</ion-label>
          <ion-input type="email" name="email"
          @input="email = $event.target.value" 
          v-bind:value="email">
          </ion-input>
        </ion-item>
        <ion-item>
            <ion-label>{{$t('backoffice.form.titles.state')}}</ion-label>
            <ion-checkbox slot="end" name="state" 
                  @ionChange="state=$event.target.checked" 
                  :checked="state">
            </ion-checkbox>
        </ion-item>
      <br/>
      <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="saveSuscription()">{{ $t('backoffice.form.buttons.save') }}</ion-button>

    </div>
    </div>
</template>

<script>

import { Api } from '../api/api.js';
import Moment from 'moment'

export default {

  name: 'suscriptorForm',
   
  data () {
    return {
      modelName: 'Subscriptor',
      /****** Form Data ******/
      id: null,
      suscription: null,

      name: '',
      phone: '',
      email: '',
      state: true,

      isBackdrop: false,

      spinner: false,
    }
  },
  created: function(){
      this.init();
      //console.log("SUPERVISOR")
      //console.log(this.isForDriversSupervisor)
  },
  computed: {
      title() {
          let t = this.$t('backoffice.form.titles.suscriptionNewTitle')
          if (this.id)
              t = this.$t('backoffice.form.titles.suscriptionEditTitle')

          return t;
          // return ""
      }
  },
  methods: {
    init(){
        this.id = this.$route.params.suscriptorId;
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
                    this.phone = response.data.Phone;
                    this.email = response.data.Email;
                    this.state = response.data.State;

                    console.log(response.data)
                    //console.log(this.occupationId);
                    //  this.password = response.data.Password;
                    //  this.confirmPassword = response.data.Password;

                    this.suscription = response.data;
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
        //console.log(this.$route.params);
    },
    ifErrorOccured(action){
      return this.$ionic.alertController.create({
          title: this.$t('backoffice.list.messages.connectionError'),
          message: this.$t('backoffice.list.messages.connectionErrorMessage'),
          buttons: [
            {
              text: this.$t('backoffice.list.messages.buttons.goToList'),
              handler: () => {
                  this.$router.push({
                      name: 'Suscriptor',
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
    ShowMessage(type, message, topic=''){
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
    backtoList(){
        this.$router.push(
          { 
            name: 'Suscriptor'
          }
        )
    },
    isValidForm(){
        // let errors = [];

        if (this.name == "")
        {
            // errors.push(this.$t('backoffice.form.validate.firstName'));
            return false
        }
        if (this.email == "")
        {
            // errors.push(this.$t('backoffice.form.validate.email'));
            return false
        }
        if (this.email != "")
        {
            let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
            if (emailRegex.test(this.email) == false)
            {
                // errors.push(this.$t('backoffice.form.validate.emailIncorrect'));
                return false
            }
        }

        return true
    },
    //Create or edit a new category
    saveSuscription: function(){
        if (this.isValidForm())
        {
            this.isBackdrop = true;
            //console.log(this.occupationId);
            let item = {
              "Name": this.name,
              "Phone": this.phone,
              "Email": this.email,
              "State": this.state,
              "Date": Moment().toISOString()
            }
            //If I am editing
            if (this.id){
              item['_id'] = this.id;
              // item['Password'] = this.user.Password;
              //console.log(this.fileName);
              this.spinner = true;
              Api.putIn(this.modelName, item)
                  .then(response => {
                        this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessSuscriptor'), "success");
                        this.spinner = false;
                        this.$router.push({
                          name: 'Suscriptor',
                        });
                        return response;
                  })
                  .catch(e => {
                        this.isBackdrop = false;
                        console.log("Error");
                        console.log(e);
                        this.spinner = false;
                        this.ifErrorOccured(this.saveSuscription);
                  })
            }
            else{
              //Else, I am created a new category
              this.spinner = true;
              Api.postIn(this.modelName, item)
                  .then(response => {
                      this.showToastMessage(this.$t('backoffice.list.messages.messageCreateSuccessSuscriptor'), "success");
                      this.spinner = false;
                      this.$router.push({
                        name: 'Suscriptor',
                      });
                      
                      return response;
                  })
                  .catch(e => {
                      this.isBackdrop = false;
                      console.log(e);
                      this.spinner = false;
                      this.ifErrorOccured(this.saveUser)
                  })
            }
        }
    } 
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