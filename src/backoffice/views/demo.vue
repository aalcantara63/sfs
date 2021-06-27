<template>

  <div id="demo">

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

    <!-- CONNECTED WITH a930 DEVICE -->
    <!-- <ion-header>
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
        <ion-label position="floating">Product Description</ion-label>
        <ion-input type="text" name="productDescription"
          @input="productDescription = $event.target.value" 
          v-bind:value="productDescription">
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
    </div> -->

    <!-- <div>
      <iframe :src="url" height="400" width="800" name="demo">
              <p>Su navegador no es compatible con iframes</p>
      </iframe>
    </div> -->

    <!-- <div id="payButton">

      <ion-button color="primary" @click="getUTC()">GetUtc</ion-button>
      <ion-button color="primary" @click="getSignature()">GetSignature</ion-button> -->
  
      <!-- <button api_access_id="b964756e3e0e60700f1bf1f8adc9f21e"
                method="sale"
                version_number="2.0"
                location_id="115161"
                :utc_time="utc_time" 
                hash_method="md5"
                :signature="signature"
                callback="oncallback"
                total_amount="50.00"
                order_number="A1234">
        Pay Now</button> -->

        <!-- <form method='Redirect' action= 'https://swp.paymentsgateway.net/co/default.aspx'><table cellSpacing='0' cellPadding='0' border='0'><tr><td align='right' width='300'></td><td align='left' width='200'><input type='hidden' name='pg_api_login_id' value='hfIU9scKMj'/></td></tr><tr><td align='right' width='300'></td><td align='left' width='200'><input type="submit" value='Pay Now'><br></td></tr></table></form>

    </div> -->

   <ion-button api_access_id="442f701ee5d25cf1b4ab6592d0b670a5"
  method="sale"
  version_number="2.0"	
  xdata_1="custom field"
  line_item_header="color,size"
  line_item_1="red,size 10"
  save_token="true" 
  location_id="277674"
  utc_time="637599022750760960" 
  hash_method="md5"
  signature="177a3ed9949a7a7b214cba047fba96ff"
  order_number="A030">
Pay Now</ion-button>

<div id="cont">
  <ion-button @click="sendMail()">Send Mail</ion-button>
  <ion-button @click="preview()">Preview</ion-button>
</div>

  </div>

</template>

<script>

import { Devices } from '../api/devices.js';
import moment from 'moment-timezone';
import MD5 from "crypto-js/md5";
import { Api } from '../api/api.js';
// import HMACMD5 from "crypto-js/hmac-md5"
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

        ccode: '',
        productDescription: '',

        response: '',

        utc_time: '',
        signature: '',
        url: 'https://swp.paymentsgateway.net/co/default.aspx?pg_api_login_id=hfIU9scKMj&pg_billto_postal_name_company=&pg_billto_postal_name_first=&pg_billto_postal_name_last=&pg_billto_postal_street_line1=&pg_billto_postal_city=&pg_billto_postal_stateprov=&pg_billto_postal_postalcode=&pg_billto_telecom_phone_number=&pg_billto_online_email=&pg_transaction_type=10&pg_total_amount=59&pg_scheduled_transaction=1&pg_schedule_frequency=20&pg_schedule_continuous=1&pg_schedule_quantity=0&pg_version_number=2.0&pg_utc_time=637593803277390000&pg_transaction_order_number=A001&pg_customer_token=A001&pg_paymethod_token=A001&pg_paymethod_token=true&pg_ts_hash=be80dbc4a2c733ca2975d04707bf0275&pg_ts_hash=be80dbc4a2c733ca2975d04707bf0275&pg_save_token=true'
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

      // window.addEventListener('callback',function(event) {
      // var objMsg
      // objMsg = JSON.parse(event.data);
      // For best security practice, only accept event message from specified 
      //domain.
      // if(event.origin !== 'https://sandbox.payfabric.com') return;
      // your code
      // console.log("Forte Callbacks")
      // console.log(objMsg)
      // switch(objMsg.Event) {
      //   case "begin":
      //       alert("begin")
      //       break
      //   case "success":
      //       alert("success")
      //       break
      //   case "failure":
      //       alert("failure")
      //       break
      //   case "error":
      //       alert("error")
      //       break
      //   case "abort":
      //       alert("abort")
      //       break
      //   case "expired":
      //       alert("expired")
      //       break
      // }
      // },false)


      // this.ccode = this.$store.state.restaurantActive.restaurantZipCode
      // console.log("RESTAURANT CODE: " + this.ccode)

      // this.utc_time = this.getUTC().valueOf();
      // this.signature = this.getSignature()
      // this.url = "https://swp.paymentsgateway.net/co/default.aspx?pg_api_login_id=hfIU9scKMj&pg_billto_postal_name_company=&pg_billto_postal_name_first=&pg_billto_postal_name_last=&pg_billto_postal_street_line1=&pg_billto_postal_city=&pg_billto_postal_stateprov=&pg_billto_postal_postalcode=&pg_billto_telecom_phone_number=&pg_billto_online_email=&pg_transaction_type=10&pg_total_amount=59&pg_scheduled_transaction=1&pg_schedule_frequency=20&pg_schedule_continuous=1&pg_schedule_quantity=0&pg_version_number=2.0&pg_utc_time=637593871633310000&pg_transaction_order_number=A001&pg_customer_token=A001&pg_paymethod_token=A001&pg_paymethod_token=true&pg_ts_hash=${this.signature}&pg_ts_hash=${this.signature}&pg_save_token=true"


      this.utc_time = this.getUTC()
      console.log(this.utc_time)
      var butt = document.getElementById("pay")
      console.log(butt)

      this.loadTemplate()

  },
  methods: {
    preview(){
        this.$router.push({
            name: 'EMPreview'
        })
    },
    sendMail(){
        let items = {
          "email": 'miguel.augusto1987@gmail.com',
          "mess": this.loadTemplate(),
          "subject": 'test'
        };

        Api.sendEmail(items)
        .then(response => {
            console.log(response)
        })
        .catch(e => {
            console.log(e);
        })
    },
    loadTemplate(){
        let template = '<!DOCTYPE html>' +
        '<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">' +
        '<head>' +
        '<meta charset="utf-8">' +
        '<meta name="viewport" content="width=device-width,initial-scale=1">' +
        '<meta name="x-apple-disable-message-reformatting">' +
        '<title></title>' +
        '<style>' +
        'table, td, div, h1, p {' +
        'font-family: Arial, sans-serif;' +
        '}' +
        '@media screen and (max-width: 530px) {' +
        '.unsub {' +
        'display: block;' +
        'padding: 8px;' +
        'margin-top: 14px;' +
        'border-radius: 6px;' +
        'background-color: #555555;' +
        'text-decoration: none !important;' +
        'font-weight: bold;' +
        '}' +
        '.col-lge {' +
        'max-width: 100% !important;' +
        '}' +
        '}' +
        '@media screen and (min-width: 531px) {' +
        '.col-sml {' +
        'max-width: 27% !important;' +
        '}' +
        '.col-lge {' +
        'max-width: 73% !important;' +
        '}' +
        '}' +
        '</style>' +
        '</head>' +
        '<body style="margin:0;padding:0;word-spacing:normal;background-color:#939297;">' +
        '<div role="article" aria-roledescription="email" lang="en" style="text-size-adjust:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;background-color:#939297;">' +
        '<table role="presentation" style="width:100%;border:none;border-spacing:0;">' +
        '<tr>' +
        '<td align="center" style="padding:0;">' +
          '<table role="presentation" style="width:94%;max-width:600px;border:none;border-spacing:0;text-align:left;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">' +
            '<tr>' +
              '<td style="padding:40px 30px 30px 30px;text-align:center;font-size:24px;font-weight:bold;">' +
                '<a href="http://www.example.com/" style="text-decoration:none;"><img src="https://assets.codepen.io/210284/logo.png" width="165" alt="Logo" style="width:80%;max-width:165px;height:auto;border:none;text-decoration:none;color:#ffffff;"></a>' +
              '</td>' +
            '</tr>' +
            '<tr>' +
              '<td style="padding:30px;background-color:#ffffff;">' +
                '<h1 style="margin-top:0;margin-bottom:16px;font-size:26px;line-height:32px;font-weight:bold;letter-spacing:-0.02em;">Welcome to our responsive email!</h1>' +
                '<p style="margin:0;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tempus adipiscing felis, sit amet blandit ipsum volutpat sed. Morbi porttitor, <a href="http://www.example.com/" style="color:#e50d70;text-decoration:underline;">eget accumsan dictum</a>, nisi libero ultricies ipsum, in posuere mauris neque at erat.</p>' +
              '</td>' +
            '</tr>' +
            '<tr>' +
              '<td style="padding:0;font-size:24px;line-height:28px;font-weight:bold;">' +
                '<a href="http://www.example.com/" style="text-decoration:none;"><img src="https://assets.codepen.io/210284/1200x800-2.png" width="600" alt="" style="width:100%;height:auto;display:block;border:none;text-decoration:none;color:#363636;"></a>' +
              '</td>' +
            '</tr>' +
            '<tr>' +
              '<td style="padding:35px 30px 11px 30px;font-size:0;background-color:#ffffff;border-bottom:1px solid #f0f0f5;border-color:rgba(201,201,207,.35);">' +
                '<div class="col-sml" style="display:inline-block;width:100%;max-width:145px;vertical-align:top;text-align:left;font-family:Arial,sans-serif;font-size:14px;color:#363636;">' +
                  '<img src="https://assets.codepen.io/210284/icon.png" width="115" alt="" style="width:80%;max-width:115px;margin-bottom:20px;">' +
                '</div>' +
                '<div class="col-lge" style="display:inline-block;width:100%;max-width:395px;vertical-align:top;padding-bottom:20px;font-family:Arial,sans-serif;font-size:16px;line-height:22px;color:#363636;">' +
                  '<p style="margin-top:0;margin-bottom:12px;">Nullam mollis sapien vel cursus fermentum. Integer porttitor augue id ligula facilisis pharetra. In eu ex et elit ultricies ornare nec ac ex. Mauris sapien massa, placerat non venenatis et, tincidunt eget leo.</p>' +
                  '<p style="margin-top:0;margin-bottom:18px;">Nam non ante risus. Vestibulum vitae eleifend nisl, quis vehicula justo. Integer viverra efficitur pharetra. Nullam eget erat nibh.</p>' +
                  '<p style="margin:0;"><a href="https://example.com/" style="background: #ff3884; text-decoration: none; padding: 10px 25px; color: #ffffff; border-radius: 4px; display:inline-block; mso-padding-alt:0;text-underline-color:#ff3884"><!--[if mso]><i style="letter-spacing: 25px;mso-font-width:-100%;mso-text-raise:20pt">&nbsp;</i><![endif]--><span style="mso-text-raise:10pt;font-weight:bold;">Claim yours now</span><!--[if mso]><i style="letter-spacing: 25px;mso-font-width:-100%">&nbsp;</i><![endif]--></a></p>' +
                '</div>' +
              '</td>' +
            '</tr>' +
            '<tr>' +
              '<td style="padding:30px;font-size:24px;line-height:28px;font-weight:bold;background-color:#ffffff;border-bottom:1px solid #f0f0f5;border-color:rgba(201,201,207,.35);">' +
                '<a href="http://www.example.com/" style="text-decoration:none;"><img src="https://assets.codepen.io/210284/1200x800-1.png" width="540" alt="" style="width:100%;height:auto;border:none;text-decoration:none;color:#363636;"></a>' +
              '</td>' +
            '</tr>' +
            '<tr>' +
              '<td style="padding:30px;background-color:#ffffff;">' +
                '<p style="margin:0;">Duis sit amet accumsan nibh, varius tincidunt lectus. Quisque commodo, nulla ac feugiat cursus, arcu orci condimentum tellus, vel placerat libero sapien et libero. Suspendisse auctor vel orci nec finibus.</p>' +
              '</td>' +
            '</tr>' +
            '<tr>' +
              '<td style="padding:30px;text-align:center;font-size:12px;background-color:#404040;color:#cccccc;">' +
                '<p style="margin:0 0 8px 0;"><a href="http://www.facebook.com/" style="text-decoration:none;"><img src="https://assets.codepen.io/210284/facebook_1.png" width="40" height="40" alt="f" style="display:inline-block;color:#cccccc;"></a> <a href="http://www.twitter.com/" style="text-decoration:none;"><img src="https://assets.codepen.io/210284/twitter_1.png" width="40" height="40" alt="t" style="display:inline-block;color:#cccccc;"></a></p>' +
                '<p style="margin:0;font-size:14px;line-height:20px;">&reg; Someone, Somewhere 2021<br><a class="unsub" href="http://www.example.com/" style="color:#cccccc;text-decoration:underline;">Unsubscribe instantly</a></p>' +
              '</td>' +
            '</tr>' +
          '</table>' +
        '</td>' +
      '</tr>' +
    '</table>' +
  '</div>' +
'</body>' +
'</html>';
        return template;
    },

    //PayButton Methods

    getUTC(){
        // axios.get('https://sandbox.forte.net/checkout/getUTC?callback=?')
        // .then(response => {
        //     console.log(response)
        //     return response
        // })
        // .catch(e => {
        //     console.log(e)
        //     return ''
        // })

        // const themoment = new moment().utc()
        // console.log(themoment.valueOf())
        // return themoment

        //date_default_timezone_set("America/Chicago");
        // moment.tz.setDefault("America/Chicago")

        // this.utc_time = moment.utc().format('YYYY-MM-DD HH:mm:ss').
        // console.log(this.utc_time)
        let d = new Date().getTime();
        d.toLocaleString('en-US', { timeZone: 'America/Chicago' })
        console.log("Date")
        console.log(d.valueOf())

        // const raw_signature = HMACMD5(this.ap+'|sale|2.0||637599881817937024|A030||', signingKey);
        // const signature = raw_signature.toString(CryptoJS.enc.Base64);

        //$unixtime = strtotime(gmdate('Y-m-d H:i:s'));
        //const unixtime = new Date().toLocaleString();
        // const unixtime = moment().format('LTS')
        // console.log("UNIX TIME")
        // console.log(unixtime)

        // var timeArr = moment().tz("America/Chicago").format('HH:mm:ss').split(':');
        // var millitime = (timeArr[0] * 3600000) + (timeArr[1] * 60000);

        // console.log(millitime)

        // console.log("UTC")
        console.log(((d.valueOf() * 1000) * 10000) + 621355968000000000)


        //$millitime = microtime(true) * 1000;
        // const hrtime = process.hrtime();
        // const millitime =  ( hrtime[0] * 1000000 + hrtime[1] / 1000 ) / 1000;
        //$utc = number_format(($millitime * 10000) + 621355968000000000, 0, '.', '');

        // return ((millitime * 10000) + 621355968000000000).toFixed(2)
        return 621355968000000000

    },

    getSignature(){
      // this.utc_time = this.getUTC().valueOf();
      // let md5String = "b964756e3e0e60700f1bf1f8adc9f21e|sale|2.0|50.00|"+this.utc_time+"|A1234||"
      // const signature = MD5(md5String,"c0ee479ce110412f3b943f3eb72b3d2b")

      // console.log(signature.toString())
      
      // let element = document.getElementById("payB")
      // console.log(element)

      // let md5String = "b964756e3e0e60700f1bf1f8adc9f21e|schedule|2.0|59|637593901962350000|A001|A001|A001"
      // const signature = MD5(md5String, "c0ee479ce110412f3b943f3eb72b3d2b")
      // this.signature = signature.toString()
      // this.url = 'https://swp.paymentsgateway.net/co/default.aspx?pg_api_login_id=hfIU9scKMj&pg_billto_postal_name_company=&pg_billto_postal_name_first=&pg_billto_postal_name_last=&pg_billto_postal_street_line1=&pg_billto_postal_city=&pg_billto_postal_stateprov=&pg_billto_postal_postalcode=&pg_billto_telecom_phone_number=&pg_billto_online_email=&pg_transaction_type=10&pg_total_amount=59&pg_scheduled_transaction=1&pg_schedule_frequency=20&pg_schedule_continuous=1&pg_schedule_quantity=0&pg_version_number=2.0&pg_utc_time=637593901962350000&pg_transaction_order_number=A001&pg_customer_token=A001&pg_paymethod_token=A001&pg_paymethod_token=true&pg_ts_hash=${this.signature}&pg_ts_hash=${this.signature}&pg_save_token=true'
      // console.log(signature.toString())
      


      // return signature.toString()
      const data = "442f701ee5d25cf1b4ab6592d0b670a5|sale|2.0||"+this.utc_time+"|A030||";
      const signature = MD5(data, "c477ce46b6fcbad91bb30ebd5f69488f")
      console.log(signature.toString())
      return signature.toString()
    },

    oncallback(e){
      console.log(e)
    },

    oncallbackRes(res){
      console.log("Llegó")
      console.log(res)
    },

    //End PayButton Methods

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
          // 'commercialInformation': this.commercialInformation(),
          "productDescription": this.productDescription,
          "destinationZipCode": this.ccode       
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