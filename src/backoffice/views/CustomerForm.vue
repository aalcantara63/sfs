<template>
    <div class="screen">
    <ion-backdrop v-if="isBackdrop"></ion-backdrop>

    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'Customer'})"></ion-back-button>
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
          <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.name')}}</ion-label>
          <ion-input type="text" name="name"
          @input="name = $event.target.value" 
          v-bind:value="name">
          </ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.phone')}}</ion-label>
          <ion-input type="tel" name="name"
          @input="phone = $event.target.value" 
          v-bind:value="phone">
          </ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.email')}}</ion-label>
          <ion-input type="email" name="emailAddress"
          @input="emailAddress = $event.target.value" 
          v-bind:value="emailAddress">
          </ion-input>
        </ion-item>
        <ion-item>
            <ion-label>{{$t('backoffice.form.fields.marketingConsent')}}</ion-label>
        </ion-item>
        <ion-item>
           <ion-label>{{$t('backoffice.form.fields.email')}}</ion-label>
           <ion-checkbox slot="end" name="mcemail" 
                @ionChange="mcemail = $event.target.checked"
                :checked="mcemail"  >
          </ion-checkbox>
        </ion-item>
        <ion-item>
           <ion-label>{{$t('backoffice.form.fields.phone')}}</ion-label>
           <ion-checkbox slot="end" name="mcphone" 
                @ionChange="mcphone = $event.target.checked" 
                v-bind:checked="mcphone">
          </ion-checkbox>
        </ion-item>
    
      <!-- </ion-card>  -->
      <br/>
      <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="saveCustomer()">{{ $t('backoffice.form.buttons.save') }}</ion-button>

    </div>
    </div>
</template>

<script>

import { Api } from '../api/api.js';

export default {

  name: 'customerForm',
   
  data () {
    return {
      modelName: 'Customer',
      /****** Form Data ******/
      id: null,
      name: '',
      emailAddress: '',
      phone: '',
      mcemail: false,
      mcphone: false,

      isBackdrop: false,

      spinner: false,
    }
  },
  created: function(){
      this.init();
  },
  computed: {
      title() {
          return this.id ? this.$t('backoffice.form.titles.customerEditTitle') :  this.$t('backoffice.form.titles.customerNewTitle');
      }
  },
  methods: {
    init(){
        this.id = this.$route.params.customerId;
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
                    this.emailAddress = response.data.EmailAddress;

                    if (response.data.MarketingConsent){
                          this.mcemail = response.data.MarketingConsent.Email;
                          this.mcphone = response.data.MarketingConsent.Phone;
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
        }
        console.log(this.$route.params);
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
                      name: 'Customer',
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
        if (this.emailAddress == "")
        {
            // errors.push(this.$t('backoffice.form.validate.email'));
            return false
        }
        if (this.phone == "")
        {
            // errors.push(this.$t('backoffice.form.validate.phone'));
            return false
        }

        if (this.emailAddress != ""){

            let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
            if (emailRegex.test(this.emailAddress) == false)
            {
                // errors.push(this.$t('backoffice.form.validate.emailIncorrect'));
                return false
            }
            
        }

        return true
        
        // let phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        // if (phoneRegex.test(this.phone) == false)
        // {
        //     errors.push("Phone is incorrect");
        // }

        // if (errors.length > 0)
        // {
        //     let message = "";
        //     for (let i = 0; i < errors.length; i++) {
        //          message += (i + 1) + "- " + errors[i] + "<br/>";
        //     }
        //     // this.ShowMessage(this.$t('backoffice.form.validate.validate'),
        //     //                      message,
        //     //                        this.$t('backoffice.form.validate.validateCustomer'));
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
    //Create or edit a new category
    saveCustomer: function(){
      
        if (this.isValidForm())
        {
            this.isBackdrop = true;
            let item = {
              "Name": this.name,
              "Phone": this.phone,
              "EmailAddress": this.emailAddress,
            };

            console.log(this.mcemail);
            console.log(this.mcphone);
            if (this.mcemail  || this.mcphone)
            {
                console.log("Entro")
                let MarketingConsent = {
                        "Email": this.mcemail,
                        "Phone": this.mcphone
                    }
                item["MarketingConsent"] = MarketingConsent;
            }

            //If I am editing
            if (this.id){
              item['_id'] = this.id;
              this.spinner = true;
              Api.putIn(this.modelName, item)
                  .then(response => {
                        // this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
                        //      this.$t('backoffice.list.messages.messageEditSuccessCustomer'), 
                        //         this.$t('backoffice.list.messages.titleEditCustomer'));
                        this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessCustomer'), "success");
                        this.name = '';
                        this.phone = '';
                        this.emailAddress = '';
                        this.mcemail = false;
                        this.mcphone = false;
                        this.spinner = false;
                        this.$router.push({
                          name: 'Customer', 
                        });
                        return response;
                  })
                  .catch(e => {
                        this.isBackdrop = false
                        console.log(e);
                        this.spinner = false;
                        this.ifErrorOccured(this.saveCustomer)
                  })
            }
            else{
              //Else, I am created a new category
              this.spinner = true
              Api.postIn(this.modelName, item)
                  .then(response => {
                      // this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
                      //        this.$t('backoffice.list.messages.messageCreateSuccessCustomer'), 
                      //           this.$t('backoffice.list.messages.titleCreateCustomer'));
                      this.showToastMessage(this.$t('backoffice.list.messages.messageCreateSuccessCustomer'), "success");
                      this.name = '';
                      this.phone = '';
                      this.emailAddress = '';
                      this.mcemail = false;
                      this.mcphone = false;
                      this.spinner = false;
                      this.$router.push({
                        name: 'Customer', 
                      });
                      return response;
                  })
                  .catch(e => {
                      this.isBackdrop = false
                      console.log(e);
                      this.spinner = false;
                      this.ifErrorOccured(this.saveCustomer)
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