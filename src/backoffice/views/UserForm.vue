<template>
    <div class="screen">
    <ion-backdrop v-if="isBackdrop"></ion-backdrop>
    <!-- <router-link to="/controlPanel"><ion-button expand="full" color="tertiary"><ion-icon name="hammer"></ion-icon>{{$t('backoffice.list.buttons.goToControlPanel')}}</ion-button></router-link>
    <router-link to="/user"><ion-button expand="full" color="tertiary"><ion-icon name="arrow-round-back"></ion-icon>{{$t('backoffice.form.buttons.backToUsersList')}}</ion-button></router-link> -->

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
      <!-- <ion-card> -->
        <ion-item>
            <ion-card v-if="checkImage()" >
                <ion-img :src="file"></ion-img>
            </ion-card>
            <ion-card v-else>
              {{ $t('backoffice.form.titles.imageText')}}
            </ion-card>
            <!-- <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.image')}}</ion-label>
            <ion-input type="file" accept=".jpg,.png,.gif" name="file"
            @change="handleImage">
            </ion-input> -->
        </ion-item>
        <ion-item>
            <div>
                <ion-label><span style="color: red">*</span>{{$t('backoffice.form.fields.image')}}</ion-label>
            </div>
          <input type="file" accept="image/png, image/jpeg" @change="handleImage" />
        </ion-item>
        <ion-item>
          <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.firstName')}}</ion-label>
            <ion-input type="text" name="firstName"
            @input="firstName = $event.target.value" 
            v-bind:value="firstName">
          </ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.lastName')}}</ion-label>
            <ion-input type="text" name="lastName"
            @input="lastName = $event.target.value" 
            v-bind:value="lastName">
          </ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">{{$t('backoffice.form.fields.address')}}</ion-label>
          <ion-textarea name="address" 
          @input="address = $event.target.value" 
          v-bind:value="address">
          </ion-textarea>
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
        <ion-item v-if="!id">
            <ion-label position="floating"><span style="color: red">*</span>Service Id</ion-label>
            <ion-input type="number" name="serverId"
            @input="serverId = $event.target.value"
            v-bind:value="serverId">
            </ion-input>
        </ion-item>
        <ion-list>
            <ion-list-header>
                <ion-label>
                    <span style="color: red">*</span><router-link to="/occupation">{{$t('backoffice.form.fields.occupation')}}</router-link>
                </ion-label>
            </ion-list-header>

            <ion-item>
                <ion-label>{{$t('backoffice.form.titles.selectAnOccupation')}}</ion-label>
                <ion-select  :ok-text="$t('backoffice.form.messages.buttons.ok')" :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
                @ionChange="occupationId = $event.target.value" v-bind:value="occupationId">
                    <ion-select-option v-for="occupation in occupations" v-bind:key="occupation.Id" v-bind:value="occupation._id" >{{occupation.Name}}</ion-select-option>
                </ion-select>
            </ion-item>

        </ion-list>

        <div v-if="id==null">
            <ion-item>
              <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.password')}}</ion-label>
              <ion-input type="password" name="password"
              @input="password = $event.target.value" 
              v-bind:value="password">
              </ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.confirmPassword')}}</ion-label>
              <ion-input type="password" name="confirmPassword"
              @input="confirmPassword = $event.target.value" 
              v-bind:value="confirmPassword">
              </ion-input>
            </ion-item>
        </div>
        <div v-else>
          <ion-item>
            <ion-button expand="full" color="secondary" @click="changePassword()">Change password</ion-button>
          </ion-item>
        </div>

        <ion-item>
            <p><router-link to="/role">{{$t('backoffice.form.fields.roles')}}</router-link></p>
        </ion-item>
        <ion-list>
            <ion-item v-for="rol in allRoles" v-bind:key="rol._id">
            <ion-label>{{rol.Name}}</ion-label>
            <ion-checkbox
                slot="end"
                @ionChange="addDeleteRole($event.target.checked, rol._id)"
                :checked="hasUserRole(rol._id)">
            </ion-checkbox>
            </ion-item>
        </ion-list>

      <br/>
      <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="saveUser()">{{ $t('backoffice.form.buttons.save') }}</ion-button>

    </div>
    </div>
</template>

<script>

import { Api } from '../api/api.js';
import Modal from './ChangePasswordModal.vue';

export default {

  name: 'userForm',
   
  data () {
    return {
      modelName: 'Staff',
      /****** Form Data ******/
      id: null,
      user: null,

      firstName: '',
      lastName: '',
      address: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      occupations: [],
      occupationId: '',
      serverId: '',

      allRoles: [],
      userRoles: [],

      isBackdrop: false,
     
      file: null,
      fileName: '',

      spinner: false,

      //user support
      isSupport: false
    }
  },
  created: function(){

      this.init();
  },
  computed: {
        title() {
            return this.id ? this.$t('backoffice.form.titles.userEditTitle') :  this.$t('backoffice.form.titles.userNewTitle');
        }
  },
  methods: {
    init(){
        this.fetchRoles();
        this.fetchOccupations();
        this.id = this.$route.params.userId;
        this.isSupport = this.$route.params.isSupport || false;
        console.log("Support " + this.isSupport)
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
                    this.file = response.data.ImageUrl;
                    this.firstName = response.data.FirstName;
                    this.lastName = response.data.LastName;
                    this.address = response.data.Address;
                    this.phone = response.data.Phone;
                    this.email = response.data.Email;
                    this.serverId = response.data.ServerId;
                    this.occupationId = response.data.OccupationId;
                    console.log(this.occupationId);
                    //  this.password = response.data.Password;
                    //  this.confirmPassword = response.data.Password;
                    this.userRoles = response.data.Roles;

                    this.user = response.data;
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
                      name: 'User',
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
    fetchOccupations: function(){
        Api.fetchAll('Occupation').then(response => {
          this.occupations = response.data
        })
        .catch(e => {
          console.log(e)
        });
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
    fetchRoles: function(){
        Api.fetchAll('Rol').then(response => {
          this.allRoles = response.data
          console.log("Staff roles")
          console.log(this.allRoles)
        })
        .catch(e => {
          console.log(e)
        });
    },
    addDeleteRole(isChecked, rol_id){
        if (isChecked){
            if (!this.userRoles.includes(rol_id))
                this.userRoles.push(rol_id)
        }
        else
          this.userRoles.splice(this.userRoles.indexOf(rol_id), 1)
        console.log(this.userRoles)
    },
    backtoList(){
        if (this.isSupport)
        {
            this.$router.push(
              { 
                name: 'Support',
                params: {
                   'tab': 'user'
                }
              }
            )
        }
        else{
            this.$router.push({ name: 'User'})
        }
    },
    hasUserRole(rol_id){
      return this.userRoles.includes(rol_id);
    },
    isValidForm(){
        // let errors = [];

        if (this.firstName == "")
        {
            // errors.push(this.$t('backoffice.form.validate.firstName'));
            return false
        }
        if (this.lastName == "")
        {
            // errors.push(this.$t('backoffice.form.validate.lastName'));
            return false
        }
        if (this.email == "")
        {
            // errors.push(this.$t('backoffice.form.validate.email'));
            return false
        }
        if (this.occupationId == "")
        {
            // errors.push(this.$t('backoffice.form.validate.occupation'));
            return false
        }
        if (this.id == null)
        {
              if (this.password == "")
              {
                  // errors.push(this.$t('backoffice.form.validate.password'));
                  return false
              }
              if (this.password != this.confirmPassword)
              {
                  // errors.push(this.$t('backoffice.form.validate.confirmPassword'));
                  return false
              }
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
        if (this.serverId.toString().length > 4)
            return false

        return true

        // if (errors.length > 0)
        // {
        //     let message = "";
        //     for (let i = 0; i < errors.length; i++) {
        //          message += (i + 1) + "- " + errors[i] + "<br/>";
        //     }
        //     // this.ShowMessage(this.$t('backoffice.form.validate.validate'), message,
        //     //                           this.$t('backoffice.form.validate.validateUser'));
        //     this.showToastMessage(message, "danger");
        //     return false;
        // }
        // else
        // {
        //     return true;
        // }
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
    saveUser: function(){
        if (this.isValidForm())
        {
            this.isBackdrop = true;
            console.log(this.occupationId);
            let item = {
              "ImageUrl": "",
              "FirstName": this.firstName,
              "LastName": this.lastName,
              "Address": this.address,
              "Phone": this.phone,
              "Email": this.email,
              "OccupationId": this.occupationId,
              "Password": this.password,
              "Roles": this.userRoles,
            }
            if (this.isSupport)
            {
               item["IsSupport"] = true;
            }
            if (this.file != null)
            {
              item["ImageUrl"] = this.file;
              item["ImageName"] = this.fileName;
            }
            if (this.serverId != '')
            {
              item["ServerId"] = this.serverId;
            }
            //If I am editing
            if (this.id){
              item['_id'] = this.id;
              // item['Password'] = this.user.Password;
              console.log(this.fileName);
              this.spinner = true;
              Api.putIn(this.modelName, item)
                  .then(response => {
                        // alert("Success edited");
                        // this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
                        //      this.$t('backoffice.list.messages.messageEditSuccessUser'), 
                        //         this.$t('backoffice.list.messages.titleEditUser'));
                        console.log(response)
                        this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessUser'), "success");
                        this.userRoles = [];
                        // this.file = null;
                        this.spinner = false;
                        if (this.isSupport)
                        {
                            this.$router.push({
                              name: 'Support',
                              params: {
                                  tab: 'user',
                              } 
                            });
                        }
                        else{
                            this.$router.push({
                              name: 'User', 
                            });
                        }
                        return response;
                  })
                  .catch(e => {
                        this.isBackdrop = false;
                        console.log("Error");
                        console.log(e);
                        this.spinner = false;
                        this.ifErrorOccured(this.saveUser);
                  })
            }
            else{
              //Else, I am created a new category
              this.spinner = true;
              Api.postIn(this.modelName, item)
                  .then(response => {
                      // this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
                      //        this.$t('backoffice.list.messages.messageCreateSuccessUser'), 
                      //           this.$t('backoffice.list.messages.titleCreateUser'));
                      this.showToastMessage(this.$t('backoffice.list.messages.messageCreateSuccessUser'), "success");
                      this.userRoles = [];
                    //   this.file = null;
                      this.spinner = false;
                      if (this.isSupport)
                      {
                          this.$router.push({
                            name: 'Support',
                            params: {
                                tab: 'user',
                            } 
                          });
                      }
                      else{
                          this.$router.push({
                            name: 'User', 
                          });
                      }
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
    },
    changePassword(){
        return this.$ionic.modalController
            .create({
            component: Modal,
            cssClass: 'my-custom-class',
            componentProps: {
                // data: {
                //     content: this.order._id,
                // },
                propsData: {
                    user: this.user,
                    // button: this.$t('backoffice.list.messages.buttons.close'),
                    // button2: this.$t('backoffice.form.buttons.cancelOrder'),
                    // order: this.order,
                    // customer: this.customer,
                    parent: this,
                },
            },
            })
            .then(m => m.present())
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