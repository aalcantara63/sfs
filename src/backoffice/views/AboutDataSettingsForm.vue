<template>
    <div class="screen">
    <ion-backdrop v-if="isBackdrop"></ion-backdrop>

    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ path: '/aboutDataSettings'})"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>{{ titleT }}</h1>            
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
          <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.title')}}</ion-label>
          <ion-input type="text" name="title"
          @input="title = $event.target.value" 
          v-bind:value="title">
          </ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.subtitle')}}</ion-label>
          <ion-input type="text" name="subtitle"
          @input="subtitle = $event.target.value" 
          v-bind:value="subtitle">
          </ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">{{$t('backoffice.form.fields.description')}}</ion-label>
          <ion-textarea name="description" 
          @input="description = $event.target.value" 
          v-bind:value="description">
          </ion-textarea>
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
      <!-- </ion-card>  -->

      <br/>
      <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="saveAbout()">{{ $t('backoffice.form.buttons.save') }}</ion-button>
    </div>
    </div>
</template>

<script>

import { Api } from '../api/api.js';

export default {

  name: 'aboutForm',
   
  data () {
    return {
      modelName: 'About',
      /****** Form Data ******/
      id: null,
      title: '',
      subtitle: '',
      description: '',
      file: null,
      fileName: '',
      
      isBackdrop: false,

      spinner: false,
    }
  },
  created: function(){
    
    this.id = this.$route.params.aboutId;
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
               this.title = response.data.Title;
               this.subtitle = response.data.Title;
               this.description = response.data.Description;
               this.file = response.data.ImageUrl;
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
  computed: {
        titleT() {
            return this.id ? this.$t('backoffice.titles.editAboutForm') :  this.$t('backoffice.titles.newAboutForm');
        }
  },
  methods: {
    isValidForm(){
        // let errors = [];
        if (this.title == "")
        {
            // errors.push(this.$t('backoffice.form.validate.title'));
            return false
        }
        if (this.subtitle == "")
        {
            // errors.push(this.$t('backoffice.form.validate.subtitle'));
            return false
        }
        if (this.description == "")
        {
            // errors.push(this.$t('backoffice.form.validate.description'));
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
    //Create or edit a new category
    saveAbout: function(){

        if (this.isValidForm()){

            this.isBackdrop = true;
            let item = {
              "Title": this.title,
              "Subtitle": this.subtitle,
              "Description": this.description,
              "ImageUrl": "",
            }
            if (this.file != null)
            {
              item["ImageUrl"] = this.file;
              item["ImageName"] = this.fileName;
            }
            //If I am editing
            if (this.id){
              item['_id'] = this.id;
              this.spinner = true;
              Api.putIn(this.modelName, item)
                  .then(response => {
                        // alert("Success edited");
                        // this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
                        //      this.$t('backoffice.list.messages.messageCreateSuccessSetting'), 
                        //         this.$t('backoffice.list.messages.titleEditSuccess'));
                        this.showToastMessage(this.$t('backoffice.list.messages.messageCreateSuccessSetting'), "success");
                        this.title = '';
                        this.subtitle = '';
                        this.description = '';
                        this.isEditing = false;
                        this.id = null;
                        this.file = null;
                        this.spinner = false;
                        this.$router.push({
                          name: 'About', 
                        });
                        return response;
                  })
                  .catch(e => {
                        this.isBackdrop = false
                        console.log(e);
                        this.spinner = false;
                        this.ShowMessage(this.$t('backoffice.list.messages.errorTitle'),
                               this.$t('backoffice.list.messages.errorMessage'),
                                   this.$t('backoffice.list.messages.titleEditSetting'));
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
                      this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessSetting'), "success");
                      this.title = '';
                      this.subtitle = '';
                      this.description = '';
                      this.file = null;
                      this.spinner = false;
                      this.$router.push({
                        name: 'About', 
                      });
                      return response;
                  })
                  .catch(e => {
                      this.isBackdrop = false
                      console.log(e);
                      this.spinner = false;
                      this.ShowMessage(this.$t('backoffice.list.messages.errorTitle'),
                          this.$t('backoffice.list.messages.errorMessage'),
                              this.$t('backoffice.list.messages.titleCreateSetting'));
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