<template>
    <div>
       <form  v-if="utc!==''"
            id="send-form"
            METHOD="post" 
            ACTION="https://swp.paymentsgateway.net/co/default.aspx"
            callback="oncallback">

            <input type="hidden" name="pg_api_login_id" :value="appLoginId"/>

            <input type="hidden" name="pg_billto_postal_name_first" :value="merchantName"/>
            <input type="hidden" name="pg_billto_postal_name_last" :value="merchantLastName"/>            
            <input type="hidden" name="pg_billto_postal_street_line1" :value="merchantAddres"/>
            <input type="hidden" name="pg_billto_postal_city" :value="merchantCity"/>
            <input type="hidden" name="pg_billto_postal_stateprov" :value="merchantState"/>
            <input type="hidden" name="pg_billto_postal_postalcode" :value="merchantZipcode"/>
            <input type="hidden" name="pg_billto_telecom_phone_number" :value="merchantPhone"/>
            <input type="hidden" name="pg_billto_online_email" :value="merchantEmail"/>

            <input type="hidden" name="pg_transaction_type" value="10"/>
            <input type="hidden" name="pg_total_amount" :value="amount"/>
            <input type="hidden" name="pg_scheduled_transaction" value="1"/>
            <input type="hidden" name="pg_schedule_frequency" value="20"/>
            <input type="hidden" name="pg_schedule_continuous" value="1"/>
            <input type="hidden" name="pg_schedule_quantity" value="0"/>

            <input type="hidden" name="pg_version_number" value="2.0"/>          
            <input type="hidden" name="pg_utc_time" :value="utc"/> 
            <input type="hidden" name="pg_transaction_order_number" value="A001"/>
            <input type="hidden" name="pg_customer_token" value="A001"/>
            <input type="hidden" name="pg_paymethod_token" value="A001"/>
            <input type="hidden" name="pg_ts_hash" :value="getHash()"/>
            <input TYPE=SUBMIT>
        </form>
    </div>
</template>

<script>
import { Api } from '../../backoffice/api/api.js';
import MD5 from "crypto-js/md5";

export default {
    name: 'FortePayment',
     created: async function(){

         await this.getUTC();
         this.getHash();

         document.getElementById('send-form').submit();

    //      window.addEventListener('message',function(event) {
    //   var objMsg
    // //   objMsg = JSON.parse(event.data);
    //   console.log(event);
    //   // For best security practice, only accept event message from specified 
    //   //domain.
    //   if(event.origin !== 'https://swp.paymentsgateway.net/co/default.aspx?pg_api_login_id=hfIU9scKMj&pg_total_amount=59.00&pg_scheduled_transaction=1&pg_schedule_frequency=20&pg_schedule_continuous=1&pg_schedule_quantity=0') 
    //   return;
    //   // your code
    //   console.log("FORTE Respose")
    //   console.log(objMsg)
    //   switch(objMsg.Event) {
    //     case "begin":
    //         alert("begin transaction")
    //         break
    //     case "success":
    //         alert("Transaction complete")
    //         break
    //     case "failure":
    //         alert("Failure")
    //         break
    //     case "error":
    //         alert("error..")
    //         break
    //      case "abort":
    //         alert("abor..")
    //         break
    //      case "expired":
    //         alert("expired..")
    //         break
    //   }
    //   },false)
         
    },
    data() {
        return {  
            appLoginId: 'hfIU9scKMj',
            amount: 59.00, 
            api_access_id: 'b964756e3e0e60700f1bf1f8adc9f21e',
           api_secure_key: 'c0ee479ce110412f3b943f3eb72b3d2b',           
        }
    },      
    props:{
          merchantName: {type: String, default: '' } ,
          merchantLastName: {type: String, default: '' } ,
          merchantAddres: {type: String, default: '' } ,
          merchantCity: {type: String, default: '' } ,
          merchantState: {type: String, default: '' } ,
          merchantZipcode: {type: String, default: '' } ,
          merchantPhone: {type: String, default: '' } ,
          merchantEmail: {type: String, default: '' } ,
          utc: {type: String, default: '' } ,
    },
    methods:{
        getHash(){
            if(this.utc !== ''){
                let md5String = `${this.api_access_id}|schedule|2.0|${this.amount}|${this.utc}|A001|A001|A001`
                const signature = MD5(md5String, this.api_secure_key)
                return signature.toString();
            }
            return ''
        },
         oncallback(e) {
            var response = JSON.parse(e.data);
            switch (response.event)
            {
            case 'begin':
                console.log('begin')
                break;
            case 'success':
                //transaction successful 
                //(optional) validate from response.signature that this message is coming from forte
                //display a receipt
                alert('thanks for your order. the trace number is ' + response.trace_number);
                break;
            case 'failure':
                //handle failed transaction            
                alert('sorry, transaction failed. failed reason is ' + response.response_description);
                break;
            }
        },
        async getUTC(){
            try {
               const response = await Api.getUtc();              
               let resp = response.data.replace('(', '');
                resp = resp.replace(')', '');
                resp = resp.replace(';', '');
                this.utc = resp
            } catch (error) {
              console.log(error)  ;
            }
        },
    },

}
</script>