<template>
  <div>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{parent.$t('backoffice.titles.changePassword')}}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
        <ion-item>
              <ion-label position="floating"><span style="color: red">*</span>{{parent.$t('backoffice.form.fields.password')}}</ion-label>
              <ion-input type="password" name="password"
              @input="password = $event.target.value" 
              v-bind:value="password">
              </ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating"><span style="color: red">*</span>{{parent.$t('backoffice.form.fields.confirmPassword')}}</ion-label>
              <ion-input type="password" name="confirmPassword"
              @input="confirmPassword = $event.target.value" 
              v-bind:value="confirmPassword">
              </ion-input>
        </ion-item>
        <br/>
        <ion-button expand="full" color="primary" @click="save()">{{parent.$t('backoffice.form.buttons.save')}}</ion-button>
        <ion-button expand="full" color="danger" @click="dismissModal()">{{parent.$t('backoffice.list.messages.buttons.close')}} </ion-button>
    </ion-content>
  </div>
</template>

<script>
import { Api } from '../api/api.js';

export default {
  name: 'ChangePasswordModal',
  props: {
    user: { type: Object, default: null },
    // button: { type: String, default: 'Close'},
    // button2: { type: String, default: 'Cancel order'},
    // order: { type: Object, default: null },
    // customer: { type: Object, default: null },
    parent: { type: Object, default: null },
  },
  data() {
    return {
        password: '',
        confirmPassword: '',
    }
  },
  created: function(){
    // const restaurantID = this.parent.$store.state.user.RestaurantId
    // Api.fetchById('Restaurant', restaurantID)
    // .then(response => {
    //     this.apiLoginId = response.data.ApiLoginId
    //     this.transactionKey = response.data.TransactionKey
    //     this.payUrl = response.data.EndPointUrl
    // })
    // .catch(e => {
    //    console.log(e)
    // })
  },
  methods:{
    dismissModal() { 
        this.$ionic.modalController.dismiss(null);
    },
    isValidForm(){
        // let errors = [];
        if (this.password == "")
        {
            // errors.push(this.parent.$t('backoffice.form.validate.password'));
            return false
        }
        if (this.password != this.confirmPassword)
        {
            // errors.push(this.parent.$t('backoffice.form.validate.confirmPassword'));
            return false
        }

        return true

        // if (errors.length > 0)
        // {
        //     let message = "";
        //     for (let i = 0; i < errors.length; i++) {
        //          message += (i + 1) + "- " + errors[i] + "<br/>";
        //     }
        //     this.showToastMessage(message, "danger");
        //     return false;
        // }
        // else
        // {
        //     return true;
        // }
    },
    showToastMessage(message, tColor){
        return this.parent.$ionic.toastController.create({
        color: tColor,
        position: 'top',
        duration: 3000,
        message: message,
        showCloseButton: false
        }).then(a => a.present())
    },
    save(){
        if (this.isValidForm())
        {
            let item = {
              "_id": this.user._id,
              // "ImageUrl": this.user.ImageUrl,
              // "ImageName": this.user.ImageName,
              // "FirstName": this.user.FirstName,
              // "LastName": this.user.LastName,
              // "Address": this.user.Address,
              // "Phone": this.user.Phone,
              "Email": this.user.Email,
              // "OccupationId": this.user.OccupationId,
              "Password": this.password,
              // "Roles": this.user.UserRoles,
            }
            Api.changePassword(item)
                  .then(response => {
                        this.showToastMessage(this.parent.$t('backoffice.list.messages.messageEditSuccessUser'), "success");
                        // this.$router.push({
                        //   name: 'UserForm',
                        //   params: {
                        //       userId: this.user._id
                        //   }
                        // });
                        this.dismissModal();
                        return response;
                  })
                  .catch(e => {
                        console.log(e);
                        this.showToastMessage(this.parent.$t('backoffice.list.messages.errorMessage'), "danger");
                  })
        } 
    },
  },
}
</script>