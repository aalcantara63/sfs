<template>
  <div>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{parent.$t('backoffice.form.fields.oldServerId')}}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">        
        <ion-item>
            <ion-label position="floating"><span style="color: red">*</span>{{parent.$t('backoffice.form.fields.oldServerId')}}</ion-label>
            <ion-input type="number" name="oldServerId"
            @input="oldServerId = $event.target.value" 
            v-bind:value="oldServerId">
            </ion-input>
        </ion-item>
        <ion-item>
            <ion-label position="floating"><span style="color: red">*</span>{{parent.$t('backoffice.form.fields.newServerId')}}</ion-label>
            <ion-input type="number" name="newServerId"
            @input="newServerId = $event.target.value" 
            v-bind:value="newServerId">
            </ion-input>
        </ion-item>
        <!-- <ion-item></ion-item> -->
        <ion-button expand="full" color="danger" :disabled="!isValidForm()" @click="changeServerId()">{{parent.$t('backoffice.form.buttons.change')}}</ion-button>
        <ion-button expand="full" color="primary" @click="dismissModal()">X</ion-button>
    </ion-content>
  </div>
</template>

<script>
import { Api } from '../api/api.js';
import { payAuthorizeNet } from '../api/payments.js';

export default {
  name: 'ChangeModal',
  props: {
    parent: { type: Object, default: null },
  },
  data() {
    return {
      content: 'Content',
      notes: '',
      cancellationType: 'refund',

      user: null,
      oldServerId: '',
      newServerId: ''

    }
  },
  created: function(){

    this.user = this.parent.$store.state.user
    console.log(this.user) 
    // Api.put('staff', restaurantID)
    // .then(response => {
    //     console.log(response.data)
    // })
    // .catch(e => {
    //    console.log(e)
    // })
  },
  methods:{
    ifErrorOccured(action){
      return this.parent.$ionic.alertController.create({
          title: this.parent.$t('backoffice.list.messages.connectionError'),
          message: this.parent.$t('backoffice.list.messages.connectionErrorMessage'),
          buttons: [
            {
              text: this.parent.$t('backoffice.list.messages.buttons.goToAdministration'),
              handler: () => {
                  this.parent.$router.push({
                      name: 'ControlPanel',
                  });
              }
            },
            {
              text: this.parent.$t('backoffice.list.messages.buttons.retry'),
              handler: () => {
                  action();
              }
            }
          ]
        })
        .then(a => a.present());
    },
    changeServerId(){
        // const item = {
        //     '_id': this.user._id,
        //     'ServerId': this.newServerId
        // }
        let user = this.user
        user.ServerId = this.newServerId
        Api.putIn('Staff', user)
        .then(response => {
            console.log(response.data)
            this.parent.$store.commit("setUser", user)
            payAuthorizeNet.setClerkId(user.ServerId)
            this.showToastMessage("The Server Id was changed successfully", "success")
            this.dismissModal()
        })
        .catch(e => {
            console.log(e)
            this.showToastMessage("An error occur change Server Id", "danger")
        })
    },
    dismissModal() { 
        this.$ionic.modalController.dismiss(null);
    },
    isValidForm(){
        if (this.oldServerId.toString().length != 4 ||  this.newServerId.toString().length != 4)
            return false
        if (this.oldServerId != this.user.ServerId)
            return false
        if (this.oldServerId == this.newServerId)
            return false
        return true
    },
    ShowMessage(type, message, topic='') {
        return this.$ionic.alertController
            .create({
                cssClass: 'my-custom-class',
                header: type,
                subHeader: topic,
                message: message,
                buttons: [this.parent.$t('backoffice.form.messages.buttons.ok')],
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
  },
}
</script>