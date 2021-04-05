<template>
    <div class="screen">
    <ion-backdrop v-if="isBackdrop"></ion-backdrop>
    <!-- <router-link to="/controlPanel"><ion-button expand="full" color="tertiary"><ion-icon name="hammer"></ion-icon>{{$t('backoffice.list.buttons.goToControlPanel')}}</ion-button></router-link>
    <router-link to="/shipping"><ion-button expand="full" color="tertiary"><ion-icon name="arrow-round-back"></ion-icon>{{$t('backoffice.form.buttons.backToShippingsList')}}</ion-button></router-link> -->

    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'Shipping'})"></ion-back-button>
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
          <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.price')}}</ion-label>
          <ion-input type="number" name="price"
          @input="price = $event.target.value" 
          v-bind:value="price">
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
      <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="saveShipping()">{{ $t('backoffice.form.buttons.save') }}</ion-button>
    </div>
    </div>
</template>

<script>

import { Api } from '../api/api.js';

export default {

  name: 'shippingForm',
   
  data () {
    return {
      modelName: 'Shipping',
      /****** Form Data ******/
      id: null,
      name: '',
      price: 0,
      available: false,

      isBackdrop: false,

      spinner: false,
    }
  },
  created: function(){
      this.init();
  },
  computed: {
        title() {
            return this.id ? this.$t('backoffice.form.titles.shippingEditTitle') :  this.$t('backoffice.form.titles.shippingNewTitle');
        }
  },
  methods: {
        init(){
            this.id = this.$route.params.shippingId;
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
                        this.price = response.data.Price;
                        this.available = response.data.Available;
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
                          name: 'Shipping',
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
        if (isNaN(this.price))
        {
            // errors.push(this.$t('backoffice.form.validate.price'));
            return false
        }
        if (this.price == 0)
        {
            // errors.push(this.$t('backoffice.form.validate.priceGreater'));
            return false
        }

        return true

        // if (errors.length > 0)
        // {
        //     let message = "";
        //     for (let i = 0; i < errors.length; i++) {
        //          message += (i + 1) + "- " + errors[i] + "<br/>";
        //     }
        //     // this.ShowMessage(this.$t('backoffice.form.validate.validate'), message,
        //     //                            this.$t('backoffice.form.validate.validateShipping'));
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
    saveShipping: function(){
        if (this.isValidForm())
        {
          this.isBackdrop = true;
          let item = {
          "Name": this.name,
          "Price": this.price,
          "Available": this.available,
          }
          //If I am editing
          if (this.id){
            item['_id'] = this.id;
            this.spinner = true;
            Api.putIn(this.modelName, item)
                .then(response => {
                      // alert("Success edited");
                        // this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
                        //      this.$t('backoffice.list.messages.messageEditSuccessShipping'), 
                        //         this.$t('backoffice.list.messages.titleEditShipping'));
                        this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessShipping'), "success");
                      this.name = '';
                      this.price = 0;
                      this.available = false;
                      this.id = null;
                      this.spinner = false;
                      this.$router.push({
                        name: 'Shipping', 
                      });
                      return response;
                })
                .catch(e => {
                      this.isBackdrop = false;
                      console.log(e);
                      this.spinner = false;
                      this.ifErrorOccured(this.saveShipping)
                })
          }
          else{
            //Else, I am created a new category
            this.spinner = true;
            Api.postIn(this.modelName, item)
                .then(response => {
                      // this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
                      //        this.$t('backoffice.list.messages.messageCreateSuccessShipping'), 
                      //           this.$t('backoffice.list.messages.titleCreateShipping'));
                    this.showToastMessage(this.$t('backoffice.list.messages.messageCreateSuccessShipping'), "success");
                    this.name = '';
                    this.price = 0;
                    this.available = null;
                    this.spinner = false;
                    this.$router.push({
                      name: 'Shipping', 
                    });
                    return response;
                })
                .catch(e => {
                    this.isBackdrop = false;
                    console.log(e);
                    this.spinner = false;
                    this.ifErrorOccured(this.saveShipping)
                })
          }

        }
    },
    /**************** Support Methods ****************/
    //  editCategory: function(id, name, description){
    //     this.isEditing = true;
    //     this.editingId = id;
    //     this.name = name;
    //     this.description = description;
    //     this.file = null;
    //  },
    //  clearCategory: function(){
    //     this.isEditing = false;
    //     this.editingId = null;
    //     this.name = '';
    //     this.description = '';
    //     this.file = null;
    //  },
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