<template>
  <div>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ title }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
        <ion-item>
          <ion-label><span style="color: red">*</span>{{parent.$t('backoffice.form.titles.date')}}</ion-label>
          <ion-datetime name="date" @ionChange="date = $event.target.value" 
              v-bind:value="date" :placeholder="parent.$t('backoffice.form.titles.selectDate')"
              display-format="MM-DD-YYYY">
          </ion-datetime>
        </ion-item>
        <ion-item>
              <ion-label><span style="color: red">*</span>{{parent.$t('backoffice.form.fields.paymentMethod')}}</ion-label>
              <ion-select style="width: 18%" interface="popover" :ok-text="parent.$t('backoffice.form.messages.buttons.ok')" :cancel-text="parent.$t('backoffice.form.messages.buttons.dismiss')"
                          @ionChange="payMethod = $event.target.value" v-bind:value="payMethod">
                          <ion-select-option value="cash">{{parent.$t('backoffice.form.fields.cash')}}</ion-select-option>
                          <ion-select-option value="card">{{parent.$t('backoffice.form.fields.card')}}</ion-select-option>
                          <ion-select-option value="check">{{parent.$t('backoffice.form.fields.check')}}</ion-select-option>
              </ion-select>
        </ion-item>
        <ion-grid>
              <ion-row class="right">
                  <ion-col>
                    <div class="end"><span class="title">{{parent.$t('backoffice.form.titles.toPay')}}:</span> ${{toPay(order.Deadline[deadline].Percent)}}</div>
                  </ion-col>
              </ion-row>
              <ion-row class="right">
                  <ion-col>
                      <div style="color: red" class="end"><span class="title">{{parent.$t('backoffice.form.titles.pending')}}:</span> ${{pendingPay()}}</div>
                  </ion-col>
              </ion-row>
              <ion-row class="right">
                  <ion-col>
                      <div style="color: darkblue" class="end"><span class="title">{{parent.$t('backoffice.form.titles.payed')}}:</span> ${{payed()}}</div>
                  </ion-col>
              </ion-row>
        </ion-grid>
        <ion-item></ion-item>
        <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="pay()">{{parent.$t('frontend.order.pay')}}</ion-button>
        <ion-button expand="full" color="danger" @click="dismissModal()">X</ion-button>
    </ion-content>
  </div>
</template>

<script>
import { Api } from '../api/api.js';
import Moment from 'moment';

export default {
  name: 'Modal',
  props: {
    title: {type: String, default: 'Super Modal'},
    button: {type: String, default: 'Close'},
    button2: {type: String, default: 'Cancel order'},
    order: {type: Object, default: null},
    deadline: {type: Number, default: -1},
    customer: {type: Object, default: null},
    parent: {type: Object, default: null},
  },
  data() {
    return {
      content: 'Content',
      date: '',
      payMethod: 'cash',

    }
  },
  created: function(){
      this.date = Moment( new Date() ,'kk:mm').format('MM-DD-YYYY')
  },
  methods:{
    pendingPay(){
        const total = parseFloat(this.order.Total) - parseFloat(this.order.QuotationPayment)
        let pendingPay = total
        this.order.Deadline.forEach(dl => {
            if (dl.State == 1)
              pendingPay -= this.toPay(dl.Percent)
        });
        return  pendingPay.toString()
    },
    payed(){
        let payed = parseFloat(this.order.QuotationPayment)
        this.order.Deadline.forEach(dl => {
            if (dl.State == 1)
              payed += this.toPay(dl.Percent)
        });
        return payed
    },
    toPay(percent){
        const total = parseFloat(this.order.Total) - parseFloat(this.order.QuotationPayment)
        return total * percent / 100
    },
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
    dismissModal() { 
        this.$ionic.modalController.dismiss(null);
    },
    isValidForm(){
        // let errors = [];
        if (this.payMethod == '')
        {
            return false
        }

        if (this.date == '')
        {
            return false
        }

        return true

    },
    pay(){
        if (this.isValidForm())
        {
            this.order.Deadline[this.deadline].State = 1
            this.order.Deadline[this.deadline].Date = this.date
            const amontToPay = this.toPay(this.order.Deadline[this.deadline].Percent)
            this.order.Deadline[this.deadline].AmountPayed  = amontToPay
            this.order.PendingPayment -= amontToPay
            
            Api.putIn("order", this.order).then(response => {
                console.log(response)
                this.dismissModal()
            }).catch(e => {
                console.log(e)
                this.ifErrorOccured(this.pay)
            })

            // console.log(this.order.Deadline)
            // alert("Pay")
            // this.dismissModal()
        }

    },
    
      sendEmail(email, mess){
           let item = {
              "email": email,
              "mess": mess
            };
            Api.sendEmail(this.modelName, item)
                .then(() => {
                    return;
                })
                .catch(e => {
                  console.log(e);
                  this.showToastMessage('Ocurrió un error al enviar el email', "danger");
                })
      },
      sendSms(phone, mess){
            let item = {
              "phone": phone,
              "mess": mess
            };
            Api.sendSms(this.modelName, item)
                .then(() => {
                    return;
                })
                .catch(e => {
                  console.log(e);
                  this.showToastMessage('Ocurrió un error al enviar el sms', "danger");
                })
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

<style>

span.title{
    font-weight: bolder;
}

div.end{
    text-align: end;
}

</style>
