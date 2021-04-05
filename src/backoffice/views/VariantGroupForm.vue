<template>
    <div class="screen">
    <ion-backdrop v-if="isBackdrop"></ion-backdrop>
    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'VariantGroup'})"></ion-back-button>
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
          <ion-label position="floating">{{$t('backoffice.form.fields.description')}}</ion-label>
          <ion-textarea name="description" 
          @input="description = $event.target.value" 
          v-bind:value="description">
          </ion-textarea>
        </ion-item>

        <br/>
        <div v-if="!addVariant">
            <ion-item>
                <ion-button color="primary" @click="addVariant=true">+ {{$t('backoffice.form.buttons.addChoice')}}</ion-button>
            </ion-item>
        </div>
        <div v-else style="padding-left: 10%">
                <ion-item><h2>{{$t('backoffice.form.buttons.addChoice')}}</h2></ion-item>
                <ion-item>
                    <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.name')}}</ion-label>
                    <ion-input type="text" name="vf_name"
                    @input="vf_name = $event.target.value" 
                    v-bind:value="vf_name">
                    </ion-input>
                </ion-item>
                <ion-item>
                    <ion-label position="floating">{{$t('backoffice.form.fields.description')}}</ion-label>
                    <ion-textarea name="vf_description" 
                    @input="vf_description = $event.target.value" 
                    v-bind:value="vf_description">
                    </ion-textarea>
                </ion-item>
                <ion-item>
                    <ion-label position="floating">Size</ion-label>
                    <ion-input type="text" name="vf_size"
                    @input="vf_size = $event.target.value" 
                    v-bind:value="vf_size">
                    </ion-input>
                </ion-item>
                <ion-item>
                    <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.costPrice')}}</ion-label>
                    <ion-input type="number" name="vf_costPrice"
                    @input="vf_costPrice = $event.target.value" 
                    v-bind:value="vf_costPrice">
                    </ion-input>
                </ion-item>
                <ion-item>
                    <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.salePrice')}}</ion-label>
                    <ion-input type="number" name="vf_salePrice"
                    @input="vf_salePrice = $event.target.value" 
                    v-bind:value="vf_salePrice">
                    </ion-input>
                </ion-item>
                <ion-item>
                    <ion-card v-if="checkImage()" >
                        <ion-img :src="vf_file"></ion-img>
                    </ion-card>
                    <ion-card v-else>
                        {{ $t('backoffice.form.titles.imageText')}}
                    </ion-card>
                    <!-- <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.image')}}</ion-label>
                    <ion-input type="file" accept=".jpg,.png,.gif" name="vf_file"
                    @change="handleImage">
                    </ion-input> -->
                </ion-item>
                <ion-item>
                    <div>
                        <ion-label><span style="color: red">*</span>{{$t('backoffice.form.fields.image')}}</ion-label>
                    </div>
                  <input id="variantImg" type="file" accept="image/png, image/jpeg" @change="handleImage" />
                </ion-item>
                <ion-item>
                    <ion-label>{{$t('backoffice.form.fields.active')}}</ion-label>
                    <ion-checkbox slot="end" name="vf_active" 
                        @ionChange="vf_active = $event.target.checked"
                        :checked="vf_active" >    
                    </ion-checkbox>
                </ion-item>
                <ion-item>
                    <ion-button color="primary" @click="save()">{{$t('backoffice.form.buttons.save')}}</ion-button>
                    <ion-button color="danger" @click="clearForm()">{{$t('backoffice.list.messages.buttons.cancel')}}</ion-button>
                </ion-item>   
        </div>

        <div v-if="variants.length > 0">
            <ion-item><h2>Variants</h2></ion-item>

            <ion-list>
                <ion-item v-for="variant in variants" v-bind:key="variants.indexOf(variant)">
                    <ion-label>
                        <h3>{{variant.Name}}</h3>
                        <h3>Cost price:{{variant.CostPrice}}</h3>
                        <h3>Sale price{{variant.SalePrice}}</h3>
                    </ion-label>
                    <ion-label slot="end">
                        <ion-button color="primary" @click="editVariant(variants.indexOf(variant))"><ion-icon slot="icon-only" name="create"></ion-icon></ion-button>
                        <ion-button color="danger" @click="deleteVariant(variants.indexOf(variant))"><ion-icon slot="icon-only" name="trash"></ion-icon></ion-button>
                    </ion-label>
                </ion-item>
            </ion-list>

        </div>

      <br/>
      <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="saveVariantGroup()">{{ $t('backoffice.form.buttons.save') }}</ion-button>
    </div>
    </div>
</template>

<script>

import { Api } from '../api/api.js';

export default {

  name: 'variantGroupForm',
   
  data () {
    return {
      modelName: 'variantGroup',
      /****** Form Data ******/
      addVariant: false,

      id: null,
      name: '',
      description: '',

      //Variant form data vf_
      vf_id: -1,
      vf_name: '',
      vf_description: '',
      vf_size: '',
      vf_costPrice: 0,
      vf_salePrice: 0,
      vf_active: false,
      vf_file: null,
      vf_fileName: '',
      vf_qr: '',

      //Variant list
      variants: [],
      isBackdrop: false,

      spinner: false,
    }
  },
  created: function(){
      this.init()
  },
  computed: {
        title() {
            return this.id ? this.$t('backoffice.form.titles.variantGroupEditTitle') :  this.$t('backoffice.form.titles.variantGroupNewTitle');
        }
  },
  methods: {
    init(){
        this.id = this.$route.params.variantGroupId;
        if (this.id){
            console.log(this.id)
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
                      this.description = response.data.Description;
                      this.variants = response.data.Variants;
                      console.log(response.data);
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
                      name: 'VariantGroup',
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
        if (this.name == ""){
            // errors.push(this.$t('backoffice.form.validate.name'));
            return false
        }
        if (this.variants.length == 0){
            // errors.push("El grupo debe tener variantes");
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
        //     //                    message, this.$t('backoffice.form.validate.validateVariantGroup')); // Traducciones
        //     this.showToastMessage(message, "danger");
        //     return false;
        // }
        // else
        // {
        //     return true;
        // }
    },
    isValidVariantForm(){
        let errors = [];
        if (this.vf_name == "")
        {
            errors.push(this.$t('backoffice.form.validate.name'));
        }
        if (this.vf_file == null)
        {
            errors.push(this.$t('backoffice.form.validate.image'));
        }
        if (isNaN(this.vf_costPrice))
        {
            errors.push(this.$t('backoffice.form.validate.costPriceNumber'));
        }
        if (isNaN(this.vf_salePrice))
        {
            errors.push(this.$t('backoffice.form.validate.salePriceNumber'));
        }
        if (this.vf_costPrice == 0)
        {
            errors.push(this.$t('backoffice.form.validate.costPriceGreater'));
        }
        if (this.vf_salePrice == 0)
        {
            errors.push(this.$t('backoffice.form.validate.salePriceGreater'));
        }

        if (errors.length > 0)
        {
            let message = "";
            for (let i = 0; i < errors.length; i++) {
                 message += (i + 1) + "- " + errors[i] + "<br/>";
            }
            // this.ShowMessage(this.$t('backoffice.form.validate.validate'),
            //                    message, this.$t('backoffice.form.validate.validateVariantGroup')); // Traducciones
            this.showToastMessage(message, "danger");
            return false;
        }
        else
        {
            return true;
        }
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
      return this.vf_file != null;
    },
    handleImage: function(event)
    {
        const selectedImage = event.target.files[0];
        this.vf_fileName = selectedImage.name;
        this.createBase64Img(selectedImage);
    },
    createBase64Img: function(fileObject){
        const reader = new FileReader();

        reader.onload = (e) => {
            this.vf_file = e.target.result;
            console.log(this.vf_file);
        };
        reader.readAsDataURL(fileObject);
    },
    clearForm(){
        this.addVariant = false
        this.vf_id = -1
        this.vf_name = ''
        this.vf_description = ''
        this.vf_size = ''
        this.vf_costPrice = 0
        this.vf_salePrice = 0
        this.vf_active = false
        this.vf_file = null
        this.vf_fileName = ''
        document.getElementById('variantImg').value = ''
        this.vf_qr = ''
    },
    save(){
        if (this.isValidVariantForm())
        {
            let item = {
                "Name": this.vf_name,
                "Description": this.vf_description,
                "CostPrice": this.vf_costPrice,
                "SalePrice": this.vf_salePrice,
                "Size": this.vf_size,
                "Active": this.vf_active,
            }
            if (this.vf_file != null)
            {
                item["ImageUrl"] = this.vf_file;
                item["ImageName"] = this.vf_fileName;
            }

            if (this.vf_id != -1) // Editing
            {
                this.variants[this.vf_id].Name = item.Name;
                this.variants[this.vf_id].Description = item.Description;
                this.variants[this.vf_id].CostPrice = item.CostPrice;
                this.variants[this.vf_id].SalePrice = item.SalePrice;
                this.variants[this.vf_id].Size = item.Size;
                this.variants[this.vf_id].Active = item.Active;

                if (item.ImageUrl){
                    this.variants[this.vf_id].ImageUrl = item.ImageUrl;
                    this.variants[this.vf_id].ImageName = item.ImageName;
                }
                this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessVariant'), "success");
            }
            else{ // Create
                this.variants.push(item)
                this.showToastMessage(this.$t('backoffice.list.messages.messageCreateSuccessVariant'), "success");
            }

            this.clearForm()

        }
        
    },
    //Create or edit a new category
    saveVariantGroup: function(){

        if (this.isValidForm()){
            console.log("VARIANTES")
            console.log(JSON.stringify(this.variants))
            this.isBackdrop = true;
            let item = {
              "Name": this.name,
              "Description": this.description,
              "Variants": this.variants,
            }

            //If I am editing
            if (this.id){
              item['_id'] = this.id;
              this.spinner = true;
              Api.putIn(this.modelName, item)
                  .then(response => {
                        // alert("Success edited");
                        // this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
                        //      this.$t('backoffice.list.messages.messageEditSuccessVariantGroup'), 
                        //         this.$t('backoffice.list.messages.titleEditVariantGroup'));
                        this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessVariantGroup'), "success");
                        this.name = '';
                        this.description = '';
                        this.spinner = false;
                        this.$router.push({
                          name: 'VariantGroup', 
                        });
                        return response;
                  })
                  .catch(e => {
                        this.isBackdrop = false;
                        console.log(e);
                        this.spinner = false;
                        this.ifErrorOccured(this.saveVariantGroup) //Traduccion
                  })
            }
            else{
              //Else, I am created a new category
              this.spinner = true;
              Api.postIn(this.modelName, item)
                  .then(response => {
                      // this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
                      //        this.$t('backoffice.list.messages.messageCreateSuccessVariantGroup'),
                      //           this.$t('backoffice.list.messages.titleCreateVariantGroup'));
                      this.showToastMessage(this.$t('backoffice.list.messages.messageCreateSuccessVariantGroup'), "success");
                      this.name = '';
                      this.description = '';
                      this.spinner = false;
                      this.$router.push({
                        name: 'VariantGroup', 
                      });
                      return response;
                  })
                  .catch(e => {
                      this.isBackdrop = false;
                      console.log(e);
                      this.spinner = false;
                      this.ifErrorOccured(this.saveVariantGroup); //Traducion
                  })
            }

        }
    },
    deleteVariant(pos){

        return this.$ionic.alertController.create({
        title: this.$t('backoffice.list.messages.confirmDelete'),
        message: this.$t('backoffice.list.messages.deleteVariantGroup'), 
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

                this.variants.splice(pos, 1);
                this.showToastMessage(this.$t('backoffice.list.messages.messageDeleteSuccessVariant'), "success");
            }
          }
        ]
      })
      .then(a => a.present());
    },
    editVariant(pos){
        this.vf_id = pos
        this.vf_name = this.variants[pos].Name
        this.vf_description = this.variants[pos].Description
        this.vf_size = this.variants[pos].Size
        this.vf_costPrice = this.variants[pos].CostPrice
        this.vf_salePrice = this.variants[pos].SalePrice
        this.vf_active = this.variants[pos].Active

        if (this.variants[pos].ImageUrl){
            this.vf_file = this.variants[pos].ImageUrl
            this.vf_fileName = this.variants[pos].ImageName
        }
        
        this.vf_qr = ''
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