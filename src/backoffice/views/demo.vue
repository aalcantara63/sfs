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

    <!-- <div style="margin-right:33%; margin-left:33%">
        <ion-button color="primary" @click="initialize()" style="float: left">Initialize</ion-button>
        <ion-button color="success" @click="doCredit()">DoCredit</ion-button>
        <ion-button color="secondary" @click="showModal()">Show Modal</ion-button>
    </div>

    <div>
      <iframe src="https://sandbox.payfabric.com/Payment/Web/Transaction/Process?key=21050600903385&token=2:4udnr0bcv47s" height="400" width="800" name="demo">
              <p>Su navegador no es compatible con iframes</p>
      </iframe>
    </div>

    <div style="margin-right:33%; margin-left:33%">
        <ion-button color="primary" @click="tokenCreate()" style="float: left">Token Create</ion-button>
        <ion-button color="success" @click="createTransaction()">Create transaction</ion-button>
    </div> -->

    <!-- <ion-item>
        <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.name')}}</ion-label>
        <ion-input type="text" name="name"
        @input="name = $event.target.value" 
        v-bind:value="name">
        </ion-input>
    </ion-item> -->

    <ion-item>
        <ion-label position="floating"><span style="color: red">*</span>Amount</ion-label>
        <ion-input type="number" name="amount"
        @input="amount = $event.target.value" 
        v-bind:value="amount">
        </ion-input>
    </ion-item>
    <ion-item>
        <ion-label position="floating">Tax</ion-label>
        <ion-input type="number" name="tax"
        @input="tax = $event.target.value" 
        v-bind:value="tax">
        </ion-input>
    </ion-item>
    <ion-item>
        <ion-label position="floating">Tip</ion-label>
        <ion-input type="number" name="tip"
        @input="tip = $event.target.value" 
        v-bind:value="tip">
        </ion-input>
    </ion-item>
    <ion-item>
        <ion-label position="floating">First Name</ion-label>
        <ion-input type="text" name="firstname"
        @input="firstname = $event.target.value" 
        v-bind:value="firstname">
        </ion-input>
    </ion-item>
    <ion-item>
        <ion-label position="floating">Last Name</ion-label>
        <ion-input type="text" name="lastname"
        @input="lastname = $event.target.value" 
        v-bind:value="lastname">
        </ion-input>
    </ion-item>
    <ion-item>
        <ion-label position="floating">Transaction Number</ion-label>
        <ion-input type="number" name="transactionnumber"
        @input="transactionnumber = $event.target.value" 
        v-bind:value="transactionnumber">
        </ion-input>
    </ion-item>
    <ion-item>
        <ion-label position="floating">Clerk</ion-label>
        <ion-input type="number" name="clerk"
        @input="clerk = $event.target.value" 
        v-bind:value="clerk">
        </ion-input>
    </ion-item>
    <ion-item>
        <ion-label position="floating">Invoice Number</ion-label>
        <ion-input type="number" name="invoicenumber"
        @input="invoicenumber = $event.target.value" 
        v-bind:value="invoicenumber">
        </ion-input>
    </ion-item>
    <ion-item>
        <ion-label position="floating">Token</ion-label>
        <ion-input type="text" name="token"
        @input="token = $event.target.value" 
        v-bind:value="token">
        </ion-input>
    </ion-item>
    <ion-item>
        <ion-label position="floating">Card Number</ion-label>
        <ion-input type="number" name="cardnumber"
        @input="cardnumber = $event.target.value" 
        v-bind:value="cardnumber">
        </ion-input>
    </ion-item>
    <ion-item>
        <ion-label position="floating">Card Present</ion-label>
        <ion-input type="text" name="cardpresent"
        @input="cardpresent = $event.target.value" 
        v-bind:value="cardpresent">
        </ion-input>
    </ion-item>
    <ion-item>
        <p>SSL</p>
        <ion-checkbox
            slot="end"
            @ionChange="ssl=$event.target.checked"
            :checked="ssl"
            >
        </ion-checkbox>
    </ion-item>

    <div>
        <ion-button color="primary" @click="sale()" style="float: left">SALE</ion-button>
        <ion-button color="secondary" @click="authorize()" style="float: left">AUTHORIZE</ion-button>
        <ion-button color="light" @click="authIncremental()" style="float: left">AUTHORIZE INC</ion-button>
        <ion-button color="tertiary" @click="capture()" style="float: left">CAPTURE</ion-button>
        <ion-button color="danger" @click="refund()" style="float: left">REFUND</ion-button>
        <ion-button color="success" @click="voide()" style="float: left">VOID</ion-button>
        <ion-button color="success" @click="example()" style="float: left">EXAMPLE</ion-button>
    </div>

    <div style="margin: 1px solid red">
        {{response}}
    </div>

  </div>

</template>

<script>

import { Devices } from '../api/devices.js';
import moment from 'moment-timezone';
// import DevicePayment from './DevicePayment.vue';
// import axios from 'axios';

export default {
    
  name: 'demo',
   
  data () {

      return {
        ip: '127.0.0.1',
        port: '10009',
        ssl: false,

        amount: 0,
        tax: '',
        tip: '',
        firstname: '',
        lastname: '',
        transactionnumber: '',
        clerk: '',
        invoicenumber: '',
        token: '',
        cardnumber: '',
        cardpresent: '',

        response: '',
      }
      
  },
  created: function(){
      // window.addEventListener('message',function(event) {
      // var objMsg
      // objMsg = JSON.parse(event.data);
      // // For best security practice, only accept event message from specified 
      // //domain.
      // if(event.origin !== 'https://sandbox.payfabric.com') return;
      // // your code
      // console.log("PayFabric Respose")
      // console.log(objMsg)
      // switch(objMsg.Event) {
      //   case "OnSaveTransactionCompleted":
      //       alert("Save transaction complete")
      //       break
      //   case "OnTransactionCompleted":
      //       alert("Transaction complete")
      //       break
      //   case "OnWalletCreateCompleted":
      //       alert("Wallet create complete")
      //       break
      //   case "OnWalletUpdateCompleted":
      //       alert("Wallet update complete")
      //       break
      // }
      // },false)
  },
  methods: {

    example(){
        console.log(moment().format('HHmmss'))
        console.log(moment().format('YYYYMMDD'))
    },

    callback(res){

          console.log("SUCCESSFULLY---RESPONSE:")
          console.log(res)
          if (res[4] == '000000')
          {
              this.response = res.data
              console.log("Transacción exitosa.")
              console.log(res)
              console.log("INVOICE: " + res[6][3])
              console.log("DATETIME: " + new Date(res[10]["TimeStamp"]).toISOString())
          }
          else if (res[4] == '100001')
          {
              this.response = res.data
              console.log("Time out.")
              console.log(res)
          }
          else if (res[4] == '000100')
          {
              this.response = res.data
              console.log("DECLINE.")
              console.log(res)
          }
          else{
              this.response = res.data
              console.log("Otro Error.")
              console.log(res)
          }
            
        },

    async sale(){    
      console.log("SALE")

      const data = {
          "transactionType": '01',
          "amountInformation": {
            "TransactionAmount": this.amount,
            "TipAmount": this.tip,
            "TaxAmount": this.tax
          },
          "accountInformation": {
            "Account": this.cardnumber || '',
            "FirstName": this.firstname,
            "LastName": this.lastname
          },
          "traceInformation":{
            "InvoiceNumber": this.invoicenumber || '',			
            "TransactionNumber": this.transactionnumber
          },
          "ClerkID": this.clerk,        
      }

      const anw = await Devices.a930.DoCredit(this.ip, this.port, this.ssl, data, this.callback);
      console.log("RESPONSE")
      console.log(anw)
      this.response = anw
    },
    async authorize(){
      console.log("AUTHORIZE")

      const data = {
          "transactionType": '03',
          "amountInformation": {
            "TransactionAmount": this.amount,
            "TipAmount": this.tip,
            "TaxAmount": this.tax
          },
          "accountInformation": {
            "Account": this.cardnumber || '',
            "FirstName": this.firstname,
            "LastName": this.lastname
          },
          "traceInformation":{
            "InvoiceNumber": this.invoicenumber || '',			
            "TransactionNumber": this.transactionnumber
          },
          "ClerkID": this.clerk,        
      }

      const anw = await Devices.a930.DoCredit(this.ip, this.port, this.ssl, data, this.callback);
      console.log("RESPONSE")
      console.log(anw)
      this.response = anw
    },
    async authIncremental(){
      console.log("AUTH INCREMENTAL")

      const data = {
          "transactionType": '33',
          "amountInformation": {
            "TransactionAmount": this.amount,
            "TipAmount": this.tip,
            "TaxAmount": this.tax
          },
          "accountInformation": {
            "Account": this.cardnumber || '',
            "FirstName": this.firstname,
            "LastName": this.lastname
          },
          "traceInformation":{
            "InvoiceNumber": this.invoicenumber || '',			
            "TransactionNumber": this.transactionnumber
          },
          "ClerkID": this.clerk,        
      }

      const anw = await Devices.a930.DoCredit(this.ip, this.port, this.ssl, data, this.callback);
      console.log("RESPONSE")
      console.log(anw)
      this.response = anw
    },
    async capture(){
      console.log("CAPTURE")

      const data = {
          "transactionType": '04',
          "amountInformation": {
            "TransactionAmount": this.amount,
            "TipAmount": this.tip,
            "TaxAmount": this.tax
          },
          "accountInformation": {
            "Account": this.cardnumber || '',
            "FirstName": this.firstname,
            "LastName": this.lastname
          },
          "traceInformation":{
            "InvoiceNumber": this.invoicenumber || '',			
            "TransactionNumber": this.transactionnumber
          },
          "ClerkID": this.clerk,        
      }

      const anw = await Devices.a930.DoCredit(this.ip, this.port, this.ssl, data, this.callback);
      console.log("RESPONSE")
      console.log(anw)
      this.response = anw
    },
    async refund(){
      console.log("REFUND")

      const data = {
          "transactionType": '02',
          "amountInformation": {
            "TransactionAmount": this.amount,
            "TipAmount": this.tip,
            "TaxAmount": this.tax
          },
          "accountInformation": {
            "Account": this.cardnumber || '',
            "FirstName": this.firstname,
            "LastName": this.lastname
          },
          "traceInformation":{
            "InvoiceNumber": this.invoicenumber || '',			
            "TransactionNumber": this.transactionnumber
          },
          "ClerkID": this.clerk,        
      }

      const anw = await Devices.a930.DoCredit(this.ip, this.port, this.ssl, data, this.callback);
      console.log("RESPONSE")
      console.log(anw)
      this.response = anw
    },
    async voide(){
      console.log("VOID")

      const data = {
          "transactionType": '16',
          "amountInformation": {
            "TransactionAmount": this.amount,
            "TipAmount": this.tip,
            "TaxAmount": this.tax
          },
          "accountInformation": {
            "Account": this.cardnumber || '',
            "FirstName": this.firstname,
            "LastName": this.lastname
          },
          "traceInformation":{
            "InvoiceNumber": this.invoicenumber || '',			
            "TransactionNumber": this.transactionnumber
          },
          "ClerkID": this.clerk,        
      }

      const anw = await Devices.a930.DoCredit(this.ip, this.port, this.ssl, data, this.callback);
      console.log("RESPONSE")
      console.log(anw)
      this.response = anw
    },

    // tokenCreate(){
    //     return axios.get("https://sandbox.payfabric.com/payment/api/token/create", {headers: {'Authorization': '2:9733b62e-fd05-7b5a-5b71-cbeba76a8374|@Anibal63', 'Content-Type': 'application/json'}})
    // },
    // createTransaction(){
    //   console.log('Hello would')

    // },
    // showModal(){
    //       const data = {
    //             'amountInformation': {
    //                 'TransactionAmount': 250.00,
    //                 'TipAmount': 20.00,
    //                 'TaxAmount': 25.00,
    //             },
    //             'accountInformation':{
    //                 'FirstName': 'Miguel'
    //             }
    //       }
    //       return this.$ionic.modalController
    //             .create({
    //             component: DevicePayment,
    //             cssClass: 'my-custom-class',
    //             componentProps: {
    //                 data: data,
    //                 propsData: {
    //                     datas: data,
    //                     parent: this
    //                 },
    //             },
    //             })
    //             .then(m => m.present())
    // },
    // callback(res){
    //     console.log("SUCCESSFULLY---RESPONSE:")
    //     console.log(res)
    // },

    // initialize(){
    //     try{
    //         Devices.a930.Initialize(this.ip, this.port, this.callback)
    //     }
    //     catch(e){
    //        console.log(e)
    //     }
    //   },
    // doCredit(){
    //     console.log(this.$store.state.user.ServerId.toString())

    //     const data = {
    //       'transactionType': '01', //SALE
    //       'amountInformation': {
    //           'TransactionAmount': 250.00,
    //           'TipAmount': 20.00,
    //           'TaxAmount': 25.00,
    //       },
    //       'ClerkID': this.$store.state.user.ServerId.toString(),
    //     }
    //     try{
    //         Devices.a930.DoCredit(this.ip, this.port, false, data, this.callback)
    //     }
    //     catch(e){
    //         console.log(e)
    //     }
    // }
  }

}

</script>