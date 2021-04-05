<template>
    <div class="screen">
    <ion-backdrop v-if="isBackdrop"></ion-backdrop>
    <!-- <router-link to="/controlPanel"><ion-button expand="full" color="tertiary"><ion-icon name="hammer"></ion-icon>{{$t('backoffice.list.buttons.goToControlPanel')}}</ion-button></router-link>
    <router-link to="/tax"><ion-button expand="full" color="tertiary"><ion-icon name="arrow-round-back"></ion-icon>{{$t('backoffice.form.buttons.backToTaxesList')}}</ion-button></router-link> -->

    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'Tax'})"></ion-back-button>
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
      <!-- <ion-card> -->
        <ion-item>
          <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.name')}}</ion-label>
          <ion-input type="text" name="name"
          @input="name = $event.target.value" 
          v-bind:value="name">
          </ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.percent')}}</ion-label>
          <ion-input type="number" name="percent"
          @input="percent = $event.target.value" 
          v-bind:value="percent">
          </ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">{{$t('backoffice.form.fields.priority')}}</ion-label>
          <ion-input type="number" name="priority"
          @input="priority = $event.target.value" @change="validatePriority($event.target.value)"
          v-bind:value="priority">
          </ion-input>
        </ion-item>
        <ion-item>
           <ion-label>{{$t('backoffice.form.fields.available')}}</ion-label>
           <ion-checkbox slot="end" name="available"
                @ionChange="available = $event.target.checked"
                :checked="available">    
          </ion-checkbox>
        </ion-item>
      <!-- </ion-card>  -->
      <br/>
      <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="saveTax()">{{ $t('backoffice.form.buttons.save') }}</ion-button>
    </div>
    </div>
</template>

<script>

import { Api } from '../api/api.js';

export default {

  name: 'taxForm',
   
  data () {
    return {
      modelName: 'Tax',
      /****** Form Data ******/
      id: null,
      name: '',
      percent: 0,
      priority: 0,
      available: false,
      epos: null,

      isBackdrop: false,

      spinner: false,
    }
  },
  created: function(){
      this.init();
  },
  computed: {
        title() {
            return this.id ? this.$t('backoffice.form.titles.taxEditTitle') :  this.$t('backoffice.form.titles.taxNewTitle');
        }
  },
  methods: {
        init(){
            this.id = this.$route.params.taxId;
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
                        this.percent = response.data.Percentage;
                        this.priority = response.data.Priority;
                        this.available = response.data.Available;
                        this.epos = response.data.EposId;
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
                          name: 'Tax',
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
        validatePriority(value){
            if (parseInt(value) != 0 && parseInt(value) != 1){
                this.priority = 0
            }
        },
        isValidForm(){
            // let errors = [];
            if (this.name == "")
            {
                // errors.push(this.$t('backoffice.form.validate.name'));
                return false
            }
            if (isNaN(this.percent))
            {
                // errors.push(this.$t('backoffice.form.validate.percent'));
                return false
            }
            if (this.percent == 0)
            {
                // errors.push(this.$t('backoffice.form.validate.percentGreater'));
                return false
            }

            return true

            // if (errors.length > 0)
            // {
            //     let message = "";
            //     for (let i = 0; i < errors.length; i++) {
            //         message += (i + 1) + "- " + errors[i] + "<br/>";
            //     }
            //     // this.ShowMessage(this.$t('backoffice.form.validate.validate'),
            //     //          message, this.$t('backoffice.form.validate.validateTax'));
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
    saveTax: function(){

        if (this.isValidForm()){

            this.isBackdrop = true;
            let item = {
              "Name": this.name,
              "Percentage": this.percent,
              "Priority": this.priority,
              "Available": this.available,
            }
            //If I am editing
            if (this.id){
              item['_id'] = this.id;
              if (this.epos)
                  item["EposId"] = this.epos;
              this.spinner = true;
              Api.putIn(this.modelName, item)
                  .then(response => {
                        // alert("Success edited");
                        // this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
                        //      this.$t('backoffice.list.messages.messageEditSuccessTax'), 
                        //         this.$t('backoffice.list.messages.titleEditTax'));
                        this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessTax'), "success");
                        this.name = '';
                        this.percent = 0;
                        this.available = false;
                        this.id = null;
                        this.spinner = false;
                        this.$router.push({
                          name: 'Tax', 
                        });
                        return response;
                  })
                  .catch(e => {
                        this.isBackdrop = false;
                        console.log(e);
                        this.spinner = false;
                        this.ifErrorOccured(this.saveTax);
                  })
            }
            else{
              //Else, I am created a new category
              this.spinner = true;
              Api.postIn(this.modelName, item)
                  .then(response => {
                      // this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
                      //        this.$t('backoffice.list.messages.messageCreateSuccessTax'), 
                      //           this.$t('backoffice.list.messages.titleCreateTax'));
                      this.showToastMessage(this.$t('backoffice.list.messages.messageCreateSuccessTax'), "success");
                      this.name = '';
                      this.percent = 0;
                      this.available = null;
                      this.spinner = false;
                      this.$router.push({
                        name: 'Tax', 
                      });
                      return response;
                  })
                  .catch(e => {
                      this.isBackdrop = false;
                      console.log(e);
                      this.spinner = false;
                      this.ifErrorOccured(this.saveTax);
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