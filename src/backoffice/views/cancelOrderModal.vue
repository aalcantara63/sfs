<template>
  <div>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ title }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
        <ion-list>
            <ion-item>
                <ion-label>{{parent.$t('backoffice.titles.cancellationType')}}</ion-label>
                <ion-select interface="popover" :ok-text="parent.$t('backoffice.form.messages.buttons.ok')" :cancel-text="parent.$t('backoffice.form.messages.buttons.dismiss')"
                @ionChange="cancellationType = $event.target.value" v-bind:value="cancellationType">
                    <ion-select-option value="no-refund">No refund</ion-select-option>
                    <ion-select-option value="refund" v-if="tokens.length != 0 && order.Payment.length == tokens.length && canRefund">{{parent.$t('backoffice.options.refund')}}</ion-select-option>
                    <ion-select-option value="void">{{parent.$t('backoffice.options.void')}}</ion-select-option>
                </ion-select>
            </ion-item>
        </ion-list>
        <ion-item><ion-label><span style="color: red">*</span>{{parent.$t('backoffice.form.fields.cancelationNote')}}</ion-label></ion-item>
        <ion-item>
          <ion-textarea name="notes" 
            @input="notes = $event.target.value" 
            v-bind:value="notes">
          </ion-textarea>
        </ion-item>
        <ion-item></ion-item>
        <ion-button expand="full" color="danger" :disabled="!isValidForm()" @click="refundOrder()">{{ button2 }}</ion-button>
        <ion-button expand="full" color="primary" @click="dismissModal()">X</ion-button>
        <div v-if="spinner">
            <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
        </div>
    </ion-content>
  </div>
</template>

<script>
import { Api } from '../api/api.js'
import { payAuthorizeNet } from '../api/payments.js'
import { Devices } from '../api/devices.js'

export default {
  name: 'Modal',
  props: {
    title: { type: String, default: 'Super Modal' },
    button: { type: String, default: 'Close'},
    button2: { type: String, default: 'Cancel order'},
    order: { type: Object, default: null },
    customer: { type: Object, default: null },
    parent: { type: Object, default: null },
  },
  data() {
    return {
      content: 'Content',
      notes: '',
      cancellationType: 'no-refund',

      apiLoginId: '',
      transactionKey: '',
      payUrl: '',

      tokens: [],

      spinner: false,
    }
  },
  created: async function(){
    const restaurantID = this.parent.$store.state.user.RestaurantId
    console.log("--------------")
    await this.getTokens(restaurantID)
    console.log("------TOKENS--------")
    console.log(this.tokens)
    Api.fetchById('Restaurant', restaurantID)
    .then(response => {
        this.apiLoginId = response.data.ApiLoginId
        this.transactionKey = response.data.TransactionKey
        this.payUrl = response.data.EndPointUrl
    })
    .catch(e => {
       console.log(e)
    })
  },
  computed:{
      canRefund(){
        this.order.Payment.forEach(pay => {
            if (pay.paymentInfo.method == 'Device')
                return false
        });
        return true    
      },
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
    dismissModal() {
        this.$ionic.modalController.dismiss(null);
        this.parent.$router.push({
          name: 'OrderDetails', 
          params: { orderId: this.order._id } 
        });
    },
    isValidForm(){
        // let errors = [];
        if (this.notes == '')
        {
            // errors.push(this.parent.$t('backoffice.form.validate.notes'));
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
    async refundOrder(){
        if (this.isValidForm())
        {
            this.spinner = true
            //Obtengo el restaurante
            const restaurantID = this.parent.$store.state.user.RestaurantId
            const restaurant = await Api.fetchById('restaurant', restaurantID)
            console.log(restaurantID)
            console.log(restaurant)
            
            if (restaurant.data.PayMethod == 'AUTH')
            {
                const cardNumber = this.order.PaymentMethod[this.order.PaymentMethod.length - 4] + 
                                this.order.PaymentMethod[this.order.PaymentMethod.length - 3] +
                                  this.order.PaymentMethod[this.order.PaymentMethod.length - 2] +
                                    this.order.PaymentMethod[this.order.PaymentMethod.length - 1]
                const expirationCardP = this.order.expirationCard.split('-')
                const expirationCard = expirationCardP[0][expirationCardP[0].length - 2] + 
                                        expirationCardP[0][expirationCardP[0].length - 1] + 
                                          expirationCardP[1]
                
                console.log(expirationCard)

                const refundDatas = {
                    "amount": this.order.Total,
                    "cardNumber": cardNumber,
                    "expirationDate": expirationCard,
                    "refTransId": this.order.PaymentTransId,
                }
                payAuthorizeNet.refund(refundDatas, this.payUrl, this.apiLoginId, this.transactionKey)
                .then(response => {
                    console.log(response);
                    this.cancelOrder();
                })
                .catch(e => {
                  console.log(e)
                  this.ifErrorOccured(this.refundOrder)
                  this.spinner = false
                })
            }

            if (restaurant.data.PayMethod == 'SHIFT4')
            {
                if (this.cancellationType == 'no-refund')
                {
                    this.cancelOrder()
                }
                if (this.cancellationType == 'refund')
                {
                    this.setRefund(restaurantID)
                }
                if (this.cancellationType == 'void')
                {
                    this.setVoid(restaurantID)
                }
            }  
        }

    },
    async pushToken(pay, restaurantID){

          const invoiceInformation = await payAuthorizeNet.invoiceInformation(pay.paymentInfo.transId, pay.paymentInfo.moto,
                                                                                      restaurantID, 'SHIFT4')
          if (invoiceInformation.data.length > 0)
          {
              this.tokens.push(invoiceInformation.data[0].card.token.value)
          }

    },
    async getTokens(restaurantID){
      this.order.Payment.forEach(pay => {

          this.pushToken(pay, restaurantID)
          
      });
      console.log(this.tokens)
    },
    async putRefund(pay, restaurantID, index){

          console.log("PAY STATE" + pay.state , index)
          if (pay.state == 1)
          { 
           
            const datas = {
                "restaurantId": restaurantID,
                "payMethod": 'SHIFT4',
                "total": pay.paymentInfo.total,
                // "cardExpirationDateF1": this.order.expirationCard,
                // "cardNumber": this.order.accountNumber,
                // "token": invoiceInformation.data[0].card.token.value,
                "token": this.tokens[index],
                "invoiceNumber": pay.paymentInfo.transId
            }

            const resRefund = await payAuthorizeNet.refundOrder(datas, pay.paymentInfo.moto)
            console.log("REFUND")
            console.log(resRefund)
            const paymeD = await Api.getPaymentByInvoice(pay.paymentInfo.transId, restaurantID);
            if(paymeD){                              
                const payUpd = paymeD.data[0];
                payUpd.Refund = pay.paymentInfo.total;
                await Api.putIn('Allpayments', payUpd);
            }                
          }
    },
    // PARA PASAR AL MODAL
    async setRefund(restaurantID){

        //Recorrer todos los pagos de la orden y hacer refund
        console.log("1 - R")
        if (this.order.Payment && this.order.Payment.length > 0)
        {
            console.log("2 - R")
            console.log(this.order.Payment.length)
            for (const pay of this.order.Payment) {
              await this.putRefund(pay, restaurantID, this.order.Payment.indexOf(pay))
            }

            // this.order.Payment.forEach(pay => {

            //   console.log('PAY' + restaurantID);
            //   console.log(pay);

            //    await this.putRefund(pay, restaurantID, this.order.Payment.indexOf(pay))
                
            // });

            this.cancelOrder('refund')
        }
    },
    async setVoid(restaurantID){

        if (this.order.Payment && this.order.Payment.length > 0)
        {
          // for (const pay of this.order.Payment) {
            
          // }
            for (const pay of this.order.Payment) {

                if (pay.state == 1) //Si el pago no está en estado pagado
                {
                    if (pay.paymentInfo.method == 'Device')
                    {
                        const data = {
                            'transactionType': '17',
                            'amountInformation': {
                                'TransactionAmount': '',
                                'TipAmount': '',
                                'TaxAmount': '',
                            },
                            'accountInformation':{
                                'FirstName': ''
                            },
                            'traceInformation':{
                                'TransactionNumber': pay.paymentInfo.transId
                            },
                            'ClerkID': this.$store.state.user.ServerId.toString(),
                        }
                        const ip = '192.168.50.74'
                        const port = '10009'
                        try{
                            Devices.a930.DoCredit(ip, port, false, data, this.callbackVoid)

                            const paymeD = await Api.getPaymentByInvoice(pay.paymentInfo.transId, restaurantID);
                            if(paymeD){
                                console.log('paymenD')
                                console.log(paymeD.data[0])
                                const payUpd = paymeD.data[0];
                                payUpd.Void = pay.paymentInfo.total;
                                await Api.putIn('Allpayments', payUpd);
                            }
                            this.spinner = false
                        }
                        catch(e){
                            console.log(e)
                            this.spinner = false
                        }
                    }

                    else if(pay.paymentInfo.method === "Cash" || pay.paymentInfo.method === "Check"){
                      const paymeD = await Api.getPaymentByInvoice(pay.paymentInfo.transId, restaurantID);
                        console.log('paymeD in VOID')
                        console.log(paymeD)
                        if(paymeD){                              
                            const payUpd = paymeD.data[0];
                            payUpd.Void = pay.paymentInfo.total;
                            await Api.putIn('Allpayments', payUpd);
                        }
                        this.spinner = false
                    }
                    else
                    {
                        const resVoid = await payAuthorizeNet.void(pay.paymentInfo.transId, pay.paymentInfo.moto, restaurantID, 'SHIFT4')
                        console.log("Response Void")
                        console.log(resVoid)
                        const paymeD = await Api.getPaymentByInvoice(pay.paymentInfo.transId, restaurantID);
                        console.log('paymeD in VOID')
                        console.log(paymeD)
                        if(paymeD){                              
                            const payUpd = paymeD.data[0];
                            payUpd.Void = pay.paymentInfo.total;
                            await Api.putIn('Allpayments', payUpd);
                        }
                        this.spinner = false
                    }   
                }
            }
        }

        this.cancelOrder('void')
    },
    cancelOrder(action=''){
          
          let Payment = this.order.Payment
          
          if (action === 'refund'){
              Payment.forEach(pay => {
                  pay["state"] = 2  
              })
          }
          if (action === 'void'){
              Payment.forEach(pay => {
                  pay["state"] = 3  
              })
          }
          let item = {
            "_id": this.order._id,
            "CancelNote": this.notes,
            "State": 6,
            "Payment": Payment,
          };

          // console.log("ORDEN DESPUES DE CAMBIOS")
          // console.log(item)
          Api.putIn('order', item)
            .then(() => {
                //Enviar email
                if (this.customer)
                {
                    // if (this.customer.MarketingConsent.Email)
                    //     this.sendEmail(this.customer.EmailAddress, this.parent.$t('backoffice.form.marketingMessages.canceled'));
                    //Enviar sms
                    // if (this.customer.MarketingConsent.Phone)
                    //     this.sendSms(this.customer.Phone, this.parent.$t('backoffice.form.marketingMessages.canceled'));
                    this.showToastMessage(this.parent.$t('backoffice.list.messages.changeOrderStateCanceled'), "success");
                    // this.ShowMessage(this.parent.$t('backoffice.list.messages.changeOrderStateMessage'),
                    //     this.parent.$t('backoffice.list.messages.changeOrderStateCanceled'), 
                    //         this.parent.$t('backoffice.list.messages.changeOrderStateMessage'));
                }
                // else{
                //     this.sendEmail(this.order.CustomerEmail, this.parent.$t('backoffice.form.marketingMessages.canceled'));
                // }
                
                console.log("Mostrar orders details.")
                // this.parent.$router.push({
                //   name: 'OrderDetails', 
                //   params: { orderId: this.order._id } 
                // });
                this.spinner = false
                this.dismissModal();

                // return response;
            })
            .catch(e => {
                console.log(e);
                // this.ShowMessage(this.parent.$t('backoffice.list.messages.changeOrderStateMessage'),
                //         this.parent.$t('backoffice.list.messages.errorMessage'),
                //             this.parent.$t('backoffice.list.messages.changeOrderStateMessage'));
                this.showToastMessage('Ocurrieron errores en el proceso', "danger");
                this.spinner = false
            })
      },
      sendEmail(email, mess){
           let item = {
              "email": email,
              "mess": mess
            };
            Api.sendEmail(this.modelName, item)
                .then(() => {
                    return 1;
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
