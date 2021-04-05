<template>

  <div id="demo">

    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'ControlPanel'})"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>DEMO - CONECTION WITH a930</h1>            
            </ion-label>
          </ion-toolbar>
    </ion-header>
    <br/>

    <ion-item>
        <ion-label position="floating"><span style="color: red">*</span>IP</ion-label>
        <ion-input type="text" name="ip"
        @input="ip = $event.target.value" 
        v-bind:value="ip">
        </ion-input>
    </ion-item>

    <ion-item>
        <ion-label position="floating"><span style="color: red">*</span>PORT</ion-label>
        <ion-input type="text" name="port"
        @input="port = $event.target.value" 
        v-bind:value="port">
        </ion-input>
    </ion-item>

    <div style="margin-right:33%; margin-left:33%">
        <ion-button color="primary" @click="initialize()" style="float: left">Initialize</ion-button>
        <ion-button color="success" @click="doCredit()">DoCredit</ion-button>
        <ion-button color="secondary" @click="showModal()">Show Modal</ion-button>
    </div>

    <!-- <ion-item>
        <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.name')}}</ion-label>
        <ion-input type="text" name="name"
        @input="name = $event.target.value" 
        v-bind:value="name">
        </ion-input>
    </ion-item> -->

  </div>

</template>

<script>

import { Devices } from '../api/devices.js';
import DevicePayment from './DevicePayment.vue';

export default {
    
  name: 'demo',
   
  data () {

      return {
        ip: '127.0.0.1',
        port: '10009',
      }
      
  },
  methods: {
    showModal(){
          const data = {
                'amountInformation': {
                    'TransactionAmount': 250.00,
                    'TipAmount': 20.00,
                    'TaxAmount': 25.00,
                },
                'accountInformation':{
                    'FirstName': 'Miguel'
                }
          }
          return this.$ionic.modalController
                .create({
                component: DevicePayment,
                cssClass: 'my-custom-class',
                componentProps: {
                    data: data,
                    propsData: {
                        datas: data,
                        parent: this
                    },
                },
                })
                .then(m => m.present())
    },
    callback(res){
        console.log("SUCCESSFULLY---RESPONSE:")
        console.log(res)
    },

    initialize(){
        try{
            Devices.a930.Initialize(this.ip, this.port, this.callback)
        }
        catch(e){
           console.log(e)
        }
      },
    doCredit(){
        console.log(this.$store.state.user.ServerId.toString())

        const data = {
          'transactionType': '01', //SALE
          'amountInformation': {
              'TransactionAmount': 250.00,
              'TipAmount': 20.00,
              'TaxAmount': 25.00,
          },
          'ClerkID': this.$store.state.user.ServerId.toString(),
        }
        try{
            Devices.a930.DoCredit(this.ip, this.port, data, this.callback)
        }
        catch(e){
            console.log(e)
        }
    }
  }

}

</script>