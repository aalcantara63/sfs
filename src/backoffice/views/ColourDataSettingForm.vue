<template>
    <div class="screen" style="margin-bottom: 160px">
    <ion-backdrop v-if="isBackdrop"></ion-backdrop>

    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'ControlPanel'})"></ion-back-button>
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

        <div class="fixed-outside" :style="[previewBackground()]">
            <div :style="[getToolbarStyles()]"><ion-icon name="menu" class="menu-col-2" style="float: left;font-size: 30px"></ion-icon><div style="margin-top: 5px; width: 66%; float:left">{{$t('backoffice.titles.restaurantName')}}</div><ion-icon name="settings" class="menu-col-2" style="float: right;font-size: 30px;"></ion-icon></div>
            <div :style="[getPrimaryStyles()]" >{{$t('frontend.app.deliver')}}</div>
            <div :style="[getSecondaryStyles()]" >{{$t('frontend.app.pickup')}}</div>
            <div :style="[getTertiaryStyles()]" >{{$t('frontend.app.table')}}</div>
        
            <div><ion-button color="primary" :disabled="!isValidForm()" @click="saveSetting()">{{ $t('backoffice.form.buttons.save') }}</ion-button>
            <ion-button color="secondary" :disabled="id === null" @click="setDefault()">{{$t('backoffice.form.buttons.defaultColor')}}</ion-button>
            </div>
        </div>
        <ion-item>
            <ion-label>{{$t('backoffice.form.colour.primaryColor')}}</ion-label>
        </ion-item>
        <ion-item>
            <slider-picker style="width: 100%" 
            @input="primaryBackground = $event"
            v-bind:value="primaryBackground" />
        </ion-item>
        <ion-item>
        </ion-item>
        <ion-item><ion-label>{{$t('backoffice.form.colour.primaryText')}}</ion-label></ion-item>
        <ion-item>
            <slider-picker style="width: 100%" 
            @input="primaryContrast = $event" 
            v-bind:value="primaryContrast" />
        </ion-item>
        <ion-item>
        </ion-item>

        <ion-item>
            <ion-label>{{$t('backoffice.form.colour.secondaryColor')}}</ion-label>
        </ion-item>
        <ion-item>
            <slider-picker style="width: 100%" 
            @input="secondaryBackground = $event" 
            v-bind:value="secondaryBackground" />
        </ion-item>
        <ion-item>
        </ion-item>
        <ion-item><ion-label>{{$t('backoffice.form.colour.secondaryText')}}</ion-label></ion-item>
        <ion-item>
            <slider-picker style="width: 100%" 
            @input="secondaryContrast = $event" 
            v-bind:value="secondaryContrast" />
        </ion-item>
        <ion-item>
        </ion-item>

        <ion-item>
            <ion-label>{{$t('backoffice.form.colour.tertiaryColor')}}</ion-label>
        </ion-item>
        <ion-item>
            <slider-picker style="width: 100%" 
            @input="tertiaryBackground = $event" 
            v-bind:value="tertiaryBackground" />
        </ion-item>
        <ion-item>
        </ion-item>
        <ion-item><ion-label>{{$t('backoffice.form.colour.tertiaryText')}}</ion-label></ion-item>
        <ion-item>
            <slider-picker style="width: 100%" 
            @input="tertiaryContrast = $event" 
            v-bind:value="tertiaryContrast" />
        </ion-item>
        <ion-item>
        </ion-item>

        <ion-item>
            <ion-label>{{$t('backoffice.form.colour.backgroundColor')}}</ion-label>
        </ion-item>
        <ion-item>
            <slider-picker style="width: 100%" 
            @input="backgroundColor = $event" 
            v-bind:value="backgroundColor" />
        </ion-item>
        <ion-item>
        </ion-item>
        
      <br/>
    </div>

    </div>
</template>

<script>

import { Api } from '../api/api.js';
import { Slider } from "vue-color";
// import ColorExample from '../../frontend/components/ColorExample'

export default {

  name: 'basicDataSettingForm',
   
  data () {
    return {
      modelName: 'Setting',
      /****** Form Data ******/
      id: null,
      //Recuperar colores: 'Hex-a-b-g-r' 
      //                   '#3880ff-1-255-128-56'
      primaryBackground: {hex: '#3880ff', rgba: {a: 1, b: 255, g: 128, r: 56}},
      primaryContrast: {hex: '#ffffff', rgba: {a: 1, b: 255, g: 255, r: 255}},

      secondaryBackground: {hex: '#3dc2ff', rgba: {a: 1, b: 255, g: 194, r: 61}},
      secondaryContrast: {hex: '#ffffff', rgba: {a: 1, b: 255, g: 255, r: 255}},

      tertiaryBackground: {hex: '#5260ff', rgba: {a: 1, b: 255, g: 96, r: 82}},
      tertiaryContrast: {hex: '#ffffff', rgba: {a: 1, b: 255, g: 255, r: 255}},

    //   successBackground: {hex: '#2dd36f', rgba: {a: 1, b: 111, g: 211, r: 45}},
    //   successContrast: {hex: '#ffffff', rgba: {a: 1, b: 255, g: 255, r: 255}},

    //   dangerBackground: {hex: '#eb445a', rgba: {a: 1, b: 90, g: 68, r: 235}},
    //   dangerContrast: {hex: '#ffffff', rgba: {a: 1, b: 255, g: 255, r: 255}},

      backgroundColor: {hex: '#ffffff', rgba: {a: 1, b: 255, g: 255, r: 255}},
      
      isBackdrop: false,

      spinner: false,
    }
  },
  created: function(){
    
      this.init();
  },
  computed: {
        title() {
            return this.id ? this.$t('backoffice.titles.editColorSetting') :  this.$t('backoffice.titles.createColorSetting');
        }
  },
  components: {
    "slider-picker": Slider,
    // ColorExample,
  },
  methods: {
      init(){
            this.id = this.$route.params.settingId;
            console.log("SETTING_ID")
            console.log(this.id)
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
                        this.loadColors(response.data);
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
    //   setColorPreview(){
    //       let allStyles = ":root { -ion-color-primary: #0ff; " +
    //                         "--ion-color-primary-rgb: 56,128,255; " +
    //                         "--ion-color-primary-contrast: #ffffff; " +
    //                         "--ion-color-primary-contrast-rgb: 255,255,255; " +
    //                         "--ion-color-primary-shade: #3171e0; " +
    //                         "--ion-color-primary-tint: #4c8dff; " +

    //                         "--ion-color-secondary: #0ff; " +
    //                         "--ion-color-secondary-rgb: 61,194,255; " +
    //                         "--ion-color-secondary-contrast: #ffffff; " +
    //                         "--ion-color-secondary-contrast-rgb: 255,255,255; " +
    //                         "--ion-color-secondary-shade: #36abe0; " +
    //                         "--ion-color-secondary-tint: #50c8ff; " +

    //                         "--ion-color-tertiary: #5260ff; " +
    //                         "--ion-color-tertiary-rgb: 82,96,255; " + 
    //                         "--ion-color-tertiary-contrast: #ffffff; " +
    //                         "--ion-color-tertiary-contrast-rgb: 255,255,255; " +
    //                         "--ion-color-tertiary-shade: #4854e0; " + 
    //                         "--ion-color-tertiary-tint: #6370ff; " +

    //                         "--ion-color-success: #2dd36f; " +
    //                         "--ion-color-success-rgb: 45,211,111; " +
    //                         "--ion-color-success-contrast: #ffffff; " +
    //                         "--ion-color-success-contrast-rgb: 255,255,255; " +
    //                         "--ion-color-success-shade: #28ba62; " + 
    //                         "--ion-color-success-tint: #42d77d; " +

    //                         "--ion-color-danger: #eb445a; " +
    //                         "--ion-color-danger-rgb: 235,68,90; " +
    //                         "--ion-color-danger-contrast: #ffffff; " + 
    //                         "--ion-color-danger-contrast-rgb: 255,255,255; " +
    //                         "--ion-color-danger-shade: #cf3c4f; " +
    //                         "--ion-color-danger-tint: #ed576b; }";
    //         ColorExample.querySelector('style').innerHTML += allStyles;
            
    //   },
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
      loadColors(data){
          const primary = data.Primary
          if (primary != '')
          {
              let pColors = primary.split('-')
              this.primaryBackground = {hex: pColors[0], rgba: {a: pColors[1], b: pColors[2], g: pColors[3], r: pColors[4]}}
          }
          const pConstrast = data.PrimaryContrast
          if (pConstrast != '')
          {
              let pContrastColors = pConstrast.split('-')
              this.primaryContrast = {hex: pContrastColors[0], rgba: {a: pContrastColors[1], b: pContrastColors[2], g: pContrastColors[3], r: pContrastColors[4]}}
          }
          const secondary = data.Secondary
          if (secondary != '')
          {
              let sColors = secondary.split('-')
              this.secondaryBackground = {hex: sColors[0], rgba: {a: sColors[1], b: sColors[2], g: sColors[3], r: sColors[4]}}
          }
          const sConstrast = data.SecondaryContrast
          if (sConstrast != '')
          {
              let sContrastColors = sConstrast.split('-')
              this.secondaryContrast = {hex: sContrastColors[0], rgba: {a: sContrastColors[1], b: sContrastColors[2], g: sContrastColors[3], r: sContrastColors[4]}}
          }
          const tertiary = data.Tertiary
          if (tertiary != '')
          {
              let tColors = tertiary.split('-')
              this.tertiaryBackground = {hex: tColors[0], rgba: {a: tColors[1], b: tColors[2], g: tColors[3], r: tColors[4]}}
          }
          const tConstrast = data.TertiaryContrast
          if (tConstrast != '')
          {
              let tContrastColors = tConstrast.split('-')
              this.tertiaryContrast = {hex: tContrastColors[0], rgba: {a: tContrastColors[1], b: tContrastColors[2], g: tContrastColors[3], r: tContrastColors[4]}}
          }
        //   const success = data.Success
        //   if (success != '')
        //   {
        //       let sucColors = success.split('-')
        //       this.successBackground = {hex: sucColors[0], rgba: {a: sucColors[1], b: sucColors[2], g: sucColors[3], r: sucColors[4]}}
        //   }
        //   const sucConstrast = data.SuccessContrast
        //   if (sucConstrast != '')
        //   {
        //       let sucContrastColors = sucConstrast.split('-')
        //       this.successContrast = {hex: sucContrastColors[0], rgba: {a: sucContrastColors[1], b: sucContrastColors[2], g: sucContrastColors[3], r: sucContrastColors[4]}}
        //   }
        //   const danger = data.Danger
        //   if (danger != '')
        //   {
        //       let dColors = danger.split('-')
        //       this.dangerBackground = {hex: dColors[0], rgba: {a: dColors[1], b: dColors[2], g: dColors[3], r: dColors[4]}}
        //   }
        //   const dConstrast = data.DangerContrast
        //   if (dConstrast != '')
        //   {
        //       let dContrastColors = dConstrast.split('-')
        //       this.dangerContrast = {hex: dContrastColors[0], rgba: {a: dContrastColors[1], b: dContrastColors[2], g: dContrastColors[3], r: dContrastColors[4]}}
        //   }
          const bColor = data.BackgroungColor
          if (bColor != '')
          {
              let backgroundColors = bColor.split('-')
              this.backgroundColor = {hex: backgroundColors[0], rgba: {a: backgroundColors[1], b: backgroundColors[2], g: backgroundColors[3], r: backgroundColors[4]}}
          }
      },
      previewBackground(){
            return {
                'border': '1px solid lightgray',
                'padding': '3px',
                'background-color': this.backgroundColor.hex,
                'position': 'fixed',
                'left': '0px',
                'right': '0px',
                'bottom': '54px',
                'z-index': 3,
            }
      },
      getCartStyles(){
          return {
                    'color': 'gray',
                    // 'background-color': this.primaryBackground.hex,
                    'padding': '10px',
                    'width': '80px',
                    'height': '45px',
                    'margin': '10px',
                    'border-radius': '58px',
                    'border': 'gray solid 1px'
                }
      },
      getToolbarStyles(){
          console.log(this.primaryBackground);
          return {
                    'color': this.primaryContrast.hex,
                    'background-color': this.primaryBackground.hex,
                    'padding': '10px',
                    'width': 'auto',
                    'height': '60px',
                    'margin': '10px',
                    'border-radius': '1px'
                }
      },
      getPrimaryStyles(){
          console.log(this.primaryBackground);
          return {
                    'color': this.primaryContrast.hex,
                    'background-color': this.primaryBackground.hex,
                    'padding': '10px',
                    'width': '85px',
                    'height': '40px',
                    'display': 'inline-block',
                    'margin': '10px',
                    'border-radius': '6px'
                }
      },
     getSecondaryStyles(){
          return {
                    'color': this.secondaryContrast.hex,
                    'background-color': this.secondaryBackground.hex,
                    'padding': '10px',
                    'width': '100px',
                    'height': '40px',
                    'display': 'inline-block',
                    'margin': '10px',
                    'border-radius': '6px'
                }
      },
      getTertiaryStyles(){
          return {
                    'color': this.tertiaryContrast.hex,
                    'background-color': this.tertiaryBackground.hex,
                    'padding': '10px',
                    'width': '85px',
                    'height': '40px',
                    'display': 'inline-block',
                    'margin': '10px',
                    'border-radius': '6px'
                }
      },
    //   getSuccessStyles(){
    //       return {
    //                 'color': this.successContrast.hex,
    //                 'background-color': this.successBackground.hex,
    //             }
    //   },
    //   getDangerStyles(){
    //       return {
    //                 'color': this.dangerContrast.hex,
    //                 'background-color': this.dangerBackground.hex,
    //             }
    //   },
      getBackgroundStyles(){
           return {
                    'background-color': this.backgroundColor.hex,
                }
      },
      isValidForm(){
        // let errors = [];
        if (this.colour == "")
        {
            // errors.push(this.$t('backoffice.form.validate.name'));
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
    LightenDarkenColor(col, amt) {
       col = col.replace('#', '')
       col = parseInt(col,16);
       let val = (((col & 0x0000FF) + amt) | ((((col>> 8) & 0x00FF) + amt) << 8) | (((col >> 16) + amt) << 16)).toString(16);
       return '#' + val;
    },
    //Create or edit a new category
    saveSetting: function(){

        if (this.isValidForm()){
            //'Hex-a-b-g-r' 
            this.isBackdrop = true;
            let item = {
              "Primary": this.primaryBackground.hex +'-'+this.primaryBackground.rgba.a+'-'+this.primaryBackground.rgba.b+'-'+this.primaryBackground.rgba.g+'-'+this.primaryBackground.rgba.r,
              "PrimaryContrast": this.primaryContrast.hex +'-'+this.primaryContrast.rgba.a+'-'+this.primaryContrast.rgba.b+'-'+this.primaryContrast.rgba.g+'-'+this.primaryContrast.rgba.r,
              "Secondary": this.secondaryBackground.hex +'-'+this.secondaryBackground.rgba.a+'-'+this.secondaryBackground.rgba.b+'-'+this.secondaryBackground.rgba.g+'-'+this.secondaryBackground.rgba.r,
              "SecondaryContrast": this.secondaryContrast.hex +'-'+this.secondaryContrast.rgba.a+'-'+this.secondaryContrast.rgba.b+'-'+this.secondaryContrast.rgba.g+'-'+this.secondaryContrast.rgba.r,
              "Tertiary": this.tertiaryBackground.hex +'-'+this.tertiaryBackground.rgba.a+'-'+this.tertiaryBackground.rgba.b+'-'+this.tertiaryBackground.rgba.g+'-'+this.tertiaryBackground.rgba.r,
              "TertiaryContrast": this.tertiaryContrast.hex +'-'+this.tertiaryContrast.rgba.a+'-'+this.tertiaryContrast.rgba.b+'-'+this.tertiaryContrast.rgba.g+'-'+this.tertiaryContrast.rgba.r,
            //   "Success": this.successBackground.hex +'-'+this.successBackground.rgba.a+'-'+this.successBackground.rgba.b+'-'+this.successBackground.rgba.g+'-'+this.successBackground.rgba.r,
            //   "SuccessContrast": this.successContrast.hex +'-'+this.successContrast.rgba.a+'-'+this.successContrast.rgba.b+'-'+this.successContrast.rgba.g+'-'+this.successContrast.rgba.r,
            //   "Danger": this.dangerBackground.hex +'-'+this.dangerBackground.rgba.a+'-'+this.dangerBackground.rgba.b+'-'+this.dangerBackground.rgba.g+'-'+this.dangerBackground.rgba.r,
            //   "DangerContrast": this.dangerContrast.hex +'-'+this.dangerContrast.rgba.a+'-'+this.dangerContrast.rgba.b+'-'+this.dangerContrast.rgba.g+'-'+this.dangerContrast.rgba.r,
              "BackgroungColor": this.backgroundColor.hex +'-'+this.backgroundColor.rgba.a+'-'+this.backgroundColor.rgba.b+'-'+this.backgroundColor.rgba.g+'-'+this.backgroundColor.rgba.r,
              "AllStyles": ":root { --ion-color-primary: "+ this.primaryBackground.hex +
                                "; --ion-color-primary-rgb: " + this.primaryBackground.rgba.r +", " + 
                                this.primaryBackground.rgba.g +" , " + this.primaryBackground.rgba.b + 
                                "; --ion-color-primary-contrast: " +  this.primaryContrast.hex + 
                                "; --ion-color-primary-contrast-rgb: " + this.primaryContrast.rgba.r + ", " + 
                                this.primaryContrast.rgba.g + ", " + this.primaryContrast.rgba.b + 
                                ";--ion-color-primary-shade: " + this.LightenDarkenColor(this.primaryBackground.hex, 20) + ";"  + 
                                ";--ion-color-primary-tint: " + this.LightenDarkenColor(this.primaryBackground.hex, -20) + ";"  + 
                                
                                "--ion-color-secondary: "+ this.secondaryBackground.hex +
                                "; --ion-color-secondary-rgb: " + this.secondaryBackground.rgba.r +", " + 
                                this.secondaryBackground.rgba.g +" , " + this.secondaryBackground.rgba.b + 
                                "; --ion-color-secondary-contrast: " +  this.secondaryContrast.hex + 
                                "; --ion-color-secondary-contrast-rgb: " + this.secondaryContrast.rgba.r + ", " + 
                                this.secondaryContrast.rgba.g + ", " + this.secondaryContrast.rgba.b + 
                                ";--ion-color-secondary-shade: " + this.LightenDarkenColor(this.secondaryBackground.hex, 20) + ";"  + 
                                ";--ion-color-secondary-tint: " + this.LightenDarkenColor(this.secondaryBackground.hex, -20) + ";"  +

                                "--ion-color-tertiary: "+ this.tertiaryBackground.hex +
                                "; --ion-color-tertiary-rgb: " + this.tertiaryBackground.rgba.r +", " + 
                                this.tertiaryBackground.rgba.g +" , " + this.tertiaryBackground.rgba.b + 
                                "; --ion-color-tertiary-contrast: " +  this.tertiaryContrast.hex + 
                                "; --ion-color-tertiary-contrast-rgb: " + this.tertiaryContrast.rgba.r + ", " + 
                                this.tertiaryContrast.rgba.g + ", " + this.tertiaryContrast.rgba.b + 
                                ";--ion-color-tertiary-shade: " + this.LightenDarkenColor(this.tertiaryBackground.hex, 20) + ";"  + 
                                ";--ion-color-tertiary-tint:  " + this.LightenDarkenColor(this.tertiaryBackground.hex, -20) + ";"  +

                                // "--ion-color-success: "+ this.successBackground.hex +
                                // "; --ion-color-success-rgb: " + this.successBackground.rgba.r +", " + 
                                // this.successBackground.rgba.g +" , " + this.successBackground.rgba.b + 
                                // "; --ion-color-success-contrast: " +  this.successContrast.hex + 
                                // "; --ion-color-success-contrast-rgb: " + this.successContrast.rgba.r + ", " + 
                                // this.successContrast.rgba.g + ", " + this.successContrast.rgba.b + 
                                // ";--ion-color-success-shade: mix(#000, " + this.successBackground.hex + ", 12%)" + 
                                // ";--ion-color-success-tint: mix(#fff, " + this.successBackground.hex + ", 10%);" +

                                // "--ion-color-danger: "+ this.dangerBackground.hex +
                                // "; --ion-color-danger-rgb: " + this.dangerBackground.rgba.r +", " + 
                                // this.dangerBackground.rgba.g +" , " + this.dangerBackground.rgba.b + 
                                // "; --ion-color-danger-contrast: " +  this.dangerContrast.hex + 
                                // "; --ion-color-danger-contrast-rgb: " + this.dangerContrast.rgba.r + ", " + 
                                // this.dangerContrast.rgba.g + ", " + this.dangerContrast.rgba.b + 
                                // ";--ion-color-danger-shade: mix(#000, " + this.dangerBackground.hex + ", 12%)" + 
                                // ";--ion-color-danger-tint: mix(#fff, " + this.dangerBackground.hex + " , 10%);" +
                                
                                "--ion-background-color: " + this.backgroundColor.hex + ";}",
            }
            //If I am editing
            if (this.id){
              item['_id'] = this.id;
              this.spinner = true;
              Api.putIn(this.modelName, item)
                  .then(response => {
                        // alert("Success edited");
                        // this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
                        //      this.$t('backoffice.list.messages.messageEditSuccessSetting'), 
                        //         this.$t('backoffice.list.messages.titleEditSetting'));
                        this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessSetting'), "success");
                        var allStyles= item['AllStyles'];
                            document.querySelector('style').innerHTML += allStyles;
                        this.spinner = false;
                        this.$router.push({
                          name: 'ControlPanel',
                        });
                        return response;
                  })
                  .catch(e => {
                        this.isBackdrop = false;
                        console.log(e);
                        this.spinner = false;
                        this.ifErrorOccured(this.saveSetting);
                  })
            }
            else{
              //Else, I am created a new category
              this.spinner = true;
              Api.postIn(this.modelName, item)
                  .then(response => {
                    //   this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
                    //          this.$t('backoffice.list.messages.messageCreateSuccessSetting'), 
                    //             this.$t('backoffice.list.messages.titleCreateSetting'));
                      var allStyles = document.querySelector('style').innerHTML += allStyles;
                      this.showToastMessage(this.$t('backoffice.list.messages.messageCreateSuccessSetting'), "success");
                      this.spinner = false;
                      this.$router.push({
                        name: 'ControlPanel', 
                      });
                      return response;
                  })
                  .catch(e => {
                      this.isBackdrop = false;
                      console.log(e);
                      this.spinner = false;
                      this.ifErrorOccured(this.saveSetting);
                  })
            }

        }
    },
    setDefault: function(){
        let item = {
              "_id": this.id,
              "Primary": '#3880ff'+'-'+1+'-'+255+'-'+128+'-'+56,
              "PrimaryContrast": '#ffffff'+'-'+1+'-'+255+'-'+255+'-'+255,
              "Secondary": '#3dc2ff' +'-'+1+'-'+255+'-'+194+'-'+61,
              "SecondaryContrast": '#ffffff' +'-'+1+'-'+255+'-'+255+'-'+255,
              "Tertiary": '#5260ff' +'-'+1+'-'+255+'-'+96+'-'+82,
              "TertiaryContrast": '#ffffff'+'-'+1+'-'+255+'-'+255+'-'+255,
            //   "Success": '#2dd36f' +'-'+1+'-'+111+'-'+211+'-'+45,
            //   "SuccessContrast": '#ffffff' +'-'+255+'-'+255+'-'+255+'-'+255,
            //   "Danger": '#eb445a' +'-'+1+'-'+90+'-'+68+'-'+235,
            //   "DangerContrast": '#ffffff' +'-'+1+'-'+255+'-'+255+'-'+255,
              "BackgroungColor": '#ffffff' +'-'+1+'-'+255+'-'+255+'-'+255,
              "AllStyles": ":root { -ion-color-primary: #3880ff; " +
                            "--ion-color-primary-rgb: 56,128,255; " +
                            "--ion-color-primary-contrast: #ffffff; " +
                            "--ion-color-primary-contrast-rgb: 255,255,255; " +
                            "--ion-color-primary-shade: #3171e0; " +
                            "--ion-color-primary-tint: #4c8dff; " +
                            "--ion-color-secondary: #3dc2ff; " +
                            "--ion-color-secondary-rgb: 61,194,255; " +
                            "--ion-color-secondary-contrast: #ffffff; " +
                            "--ion-color-secondary-contrast-rgb: 255,255,255; " +
                            "--ion-color-secondary-shade: #36abe0; " +
                            "--ion-color-secondary-tint: #50c8ff; " +
                            "--ion-color-tertiary: #5260ff; " +
                            "--ion-color-tertiary-rgb: 82,96,255; " + 
                            "--ion-color-tertiary-contrast: #ffffff; " +
                            "--ion-color-tertiary-contrast-rgb: 255,255,255; " +
                            "--ion-color-tertiary-shade: #4854e0; " + 
                            "--ion-color-tertiary-tint: #6370ff; " +
                            // "--ion-color-success: #2dd36f; " +
                            // "--ion-color-success-rgb: 45,211,111; " +
                            // "--ion-color-success-contrast: #ffffff; " +
                            // "--ion-color-success-contrast-rgb: 255,255,255; " +
                            // "--ion-color-success-shade: #28ba62; " + 
                            // "--ion-color-success-tint: #42d77d; " +
                            // "--ion-color-danger: #eb445a; " +
                            // "--ion-color-danger-rgb: 235,68,90; " +
                            // "--ion-color-danger-contrast: #ffffff; " + 
                            // "--ion-color-danger-contrast-rgb: 255,255,255; " +
                            // "--ion-color-danger-shade: #cf3c4f; " +
                            // "--ion-color-danger-tint: #ed576b; " + 
                            "}",
            }
        this.spinner = true
        Api.putIn(this.modelName, item)
                  .then(response => {
                    //   this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
                    //          this.$t('backoffice.list.messages.messageCreateSuccessSetting'), 
                    //             this.$t('backoffice.list.messages.titleCreateSetting'));
                      var allStyles= item['AllStyles'];
                            document.querySelector('style').innerHTML += allStyles;
                      this.showToastMessage(this.$t('backoffice.list.messages.messageCreateSuccessSetting'), "success");
                      this.spinner = false
                      this.$router.push({
                        name: 'ControlPanel', 
                      });
                      return response;
                  })
                  .catch(e => {
                      console.log(e);
                      this.spinner = false;
                      this.ifErrorOccured(this.setDefault);
                  })
    }
  },

}
    
</script>

<style>
    .preView{
        width: 60%;
        margin-left: 25%; 
        margin-right: 25%; 
        margin-top: 20px; 
        margin-bottom: 20px; 
        font-size: 20px; 
        text-align: center;
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
