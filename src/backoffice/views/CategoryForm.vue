<template>
    <div class="screen">

    <ion-backdrop v-if="isBackdrop"></ion-backdrop>
    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'Category'})"></ion-back-button>
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
           <ion-label>{{$t('backoffice.form.fields.service')}}</ion-label>
           <ion-checkbox slot="end" name="service" 
            @ionChange="service = $event.target.checked"
            :checked="service"  >    
          </ion-checkbox>
        </ion-item>
        <ion-item>
          <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.name')}}</ion-label>
          <ion-input type="text" name="name"
          @input="name = $event.target.value" 
          v-bind:value="name">
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
          <ion-card v-else>
              {{ $t('backoffice.form.titles.imageText')}}
          </ion-card>
        </ion-item>
        <ion-item>
            <div>
                <ion-label>{{$t('backoffice.form.fields.image')}}</ion-label>
            </div>
           <input type="file" accept="image/png, image/jpeg" @change="handleImage" />
        </ion-item>

        <ion-list>
            <ion-list-header>
                <ion-label>
                   {{$t('backoffice.form.fields.parentCategory')}}
                </ion-label>
            </ion-list-header>

            <ion-item>
                <ion-label>{{$t('backoffice.form.titles.selectACategory')}}</ion-label>
                <ion-select  :ok-text="$t('backoffice.form.messages.buttons.ok')" :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
                @ionChange="parentId = $event.target.value" v-bind:value="parentId">
                    <ion-select-option v-for="category in categories" v-bind:key="category.Id" v-bind:value="category._id" >{{category.Name}}</ion-select-option>
                </ion-select>
            </ion-item>
        </ion-list>

      <!-- </ion-card>  -->

      <br/>

      <div>
          <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="saveCategory()">{{ $t('backoffice.form.buttons.save') }}</ion-button>
      </div>

    </div>
    </div>
</template>

<script>

import { Api } from '../api/api.js';
// import { ImagePicker } from '@ionic-native/image-picker/'
// import { Camera } from '@ionic-native/camera';
// import { File } from '@ionic-native/file';
// import { FileChooser } from '@ionic-native/file-chooser/'

export default {

  name: 'categoryForm',
   
  data () {
    return {
      modelName: 'Category',
      /****** Form Data ******/
      id: null,
      name: '',
      description: '',
      file: null,
      fileName: '',
      service: false,

      epos: null,
      
      categories: [],
      parentId: null,

      //Bloque de pantalla
      isBackdrop: false,

      temp: '',

      spinner: false,
    }
  },
  created: function(){
      this.init()
  },
  computed: {
        title() {
            return this.id ? this.$t('backoffice.form.titles.categoryEditTitle') :  this.$t('backoffice.form.titles.categoryNewTitle');
        }
  },
  methods: {
    init(){
        this.fetchParentId();

        this.id = this.$route.params.categoryId;
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
                      this.service = response.data.Service;
                      this.name = response.data.Name;
                      this.description = response.data.Description;
                      this.file = response.data.ImageUrl;
                      this.parentId = response.data.ParentId;
                      this.epos = response.data.EposId;
                      loading.dismiss();
                      return response;
                    })
                    .catch(e => {
                      console.log(e);
                      loading.dismiss();
                      this.ifErrorOccured(this.init)
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
                      name: 'Category',
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
        // if (this.file == null)
        // {
        //     // errors.push(this.$t('backoffice.form.validate.image'));
        //     return false
        // }

        return true

        // if (errors.length > 0)
        // {
        //     let message = "";
        //     for (let i = 0; i < errors.length; i++) {
        //          message += (i + 1) + "- " + errors[i] + "<br/>";
        //     }
        //     // this.ShowMessage(this.$t('backoffice.form.validate.validate'),
        //     //                    message, this.$t('backoffice.form.validate.validateCategory'));
        //     this.showToastMessage(message, "danger")                   
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
    // pickImage(sourceType) {
    //   const options = {
    //     quality: 100,
    //     sourceType: sourceType,
    //     destinationType: Camera.DestinationType.FILE_URI,
    //     encodingType: Camera.EncodingType.JPEG,
    //     mediaType: Camera.MediaType.PICTURE
    //   }
    //   Camera.getPicture(options).then((imageData) => {
    //     // imageData is either a base64 encoded string or a file URI
    //     // let croppedImagePath = 'data:image/jpeg;base64,' + imageData;
    //     alert("algo")
    //     console.log(File)
    //     console.log(imageData)
    //   }, (err) => {
    //     // Handle error
    //     alert(err)
    //     this.temp = "Noooo"
    //     console.log("Se produjo el siguiente error: " + err)  
    //   });
    // },
    handleImage: function(event)
    {
        //    this.pickImage(Camera.PictureSourceType.PHOTOLIBRARY);

        // ImagePicker.getPictures({}).then((results) => {
        //   for (var i = 0; i < results.length; i++) {
        //       console.log('Image URI: ' + results[i]);
        //   }
        // }, (err) => { console.log(err) });

        const selectedImage = event.target.files[0];
        this.fileName = selectedImage.name;
        this.createBase64Img(selectedImage);
    },
    // handleImage2: function(event){
    //     const selectedImage = event.target.files[0];
    //     this.fileName = selectedImage.name;
    //     alert(this.fileName);
    // },
    // handleImage3: function(){
    //     FileChooser.open()
    //     .then(uri => console.log(uri))
    //     .catch(e => {
    //         console.log(e)
    //         alert(e)
    //     });
    // },
    // handleImage4: function(){
    //     ImagePicker.getPictures({}).then((results) => {
    //       for (var i = 0; i < results.length; i++) {
    //           console.log('Image URI: ' + results[i]);
    //       }
    //     }, (err) => { 
    //       alert(err)
    //       console.log(err)
    //     });
    // },
    createBase64Img: function(fileObject){
        const reader = new FileReader();

        reader.onload = (e) => {
            this.file = e.target.result;
            console.log(this.file);
        };
        reader.readAsDataURL(fileObject);
    },
    /*******                              Fin                              *******/
    fetchParentId(){
         Api.fetchAll(this.modelName).then(response => {
          // console.log(response.data)
          this.categories = response.data;
          if (this.id)
              this.categories = this.categories.filter(item => item._id != this.id && !item.ParentId);
        })
        .catch(e => {
          console.log(e)
        });
    },
    //Create or edit a new category
    saveCategory: function(){
        
        if (this.isValidForm()){

            this.isBackdrop = true;

            let item = {
              "Name": this.name,
              "Description": this.description,
              "Service": this.service,
              "ImageUrl": "",
            }
            if (this.file != null)
            {
              item["ImageUrl"] = this.file;
              item["ImageName"] = this.fileName;
            }
            if (this.parentId)
            {
                item["ParentId"] = this.parentId;
            }
            //If I am editing
            if (this.id){
              item['_id'] = this.id;
              if (this.epos)
              {
                  item["EposId"] = this.epos;
              }
              this.spinner = true;
              Api.putIn(this.modelName, item)
                  .then(response => {
                        // alert("Success edited");
                        // this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
                        //      this.$t('backoffice.list.messages.messageEditSuccessCategory'), 
                        //         this.$t('backoffice.list.messages.titleEditCategory'));
                        this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessCategory'), "success");
                        this.name = '';
                        this.description = '';
                        this.isEditing = false;
                        this.id = null;
                        this.file = null;
                        this.spinner = false;
                        this.$router.push({
                          name: 'Category', 
                        });
                        return response;
                  })
                  .catch(e => {
                        this.isBackdrop = false
                        console.log(e);
                        this.spinner = false;
                        this.ifErrorOccured(this.saveCategory)
                  })
            }
            else{
              //Else, I am created a new category
              this.spinner = true;
              Api.postIn(this.modelName, item)
                  .then(response => {
                      // this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
                      //        this.$t('backoffice.list.messages.messageCreateSuccessCategory'), 
                      //           this.$t('backoffice.list.messages.titleCreateCategory'));
                      this.showToastMessage(this.$t('backoffice.list.messages.messageCreateSuccessCategory'), "success");
                      this.name = '';
                      this.description = '';
                      this.file = null;
                      this.spinner = false;
                      this.$router.push({
                        name: 'Category', 
                      });
                      return response;
                  })
                  .catch(e => {
                      this.isBackdrop = false
                      console.log(e);
                      this.spinner = false;
                      this.ifErrorOccured(this.saveCategory)
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