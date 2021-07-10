<template>
    <div >   
         <ion-loading style="--backdrop-opacity:0"
          v-if="spinner"          
          cssClass="my-custom-class"         
        ></ion-loading>  
        <ion-input @ionChange="paymentRes=$event.target.value" id="TrxKeyPayment" style="display:none"></ion-input>
       <iframe 
        v-if="urlPayFabric!==''" 
        :src="urlPayFabric" 
        style="width: 100%; height: 65vh;">
       </iframe>
       

    </div>
</template>


<script>

import { payAuthorizeNet } from '../../backoffice/api/payments.js';

export default {
    name: 'PayFabric',
    mounted: async function(){         
    },
   
    async created() {
         await this.getUrlPayFabric()
    }  ,
    data() {
        return { 
          urlPayFabric: '',
          spinner: false,
          paymentRes: ''
        }
    }, 
     props: { 
        parent: {type: Object, default: ()=> {}} ,       
        total: {type: String, default:"" } ,
        isSplit: {type: Boolean, default: false}
    },
    watch:{
         paymentRes(value) {
            if(value.TrxKey){
                const response = {
                        "total": this.total,
                        "transId": value.TrxKey,
                        "accountNumber": "",
                        "expirationCard": '',
                        "accountType": '',
                        "method": 'Card',
                        "moto": false,
                    }              
             return this.$parent.responsePayFabric(response);
          
            }
         }
     },
    methods: {
        async getUrlPayFabric(){
        try {
            this.spinner = true;
            const data = {
            "total" : this.total,
            "payMethod": 'PayFabric'
            }
            const response = await payAuthorizeNet.payOrder(data); 
            if(response)
                this.urlPayFabric = response;
            this.spinner = false;
        
            
        } catch (error) {
            error;
            this.spinner = false
            
        }
        }, 
    }
}
</script>