<template>
    <div>
        <div class="ion-padding">  

            
            SAVE ORDER WITH CASH PAYMENT

            <div style="padding: 20px 15px; text-align: center">

                <ion-button   fill="outline" @click="cancel">{{i18n.t('frontend.home.cancel')}}</ion-button>
                <ion-button fill="outline" 
                 @click="senPayment">{{i18n.t('frontend.home.acept')}}</ion-button>

                <div v-if="spinner1" style="margin: 10px">
                    <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
                </div>

            </div>

       
    </div>
        
      

    </div>
</template>

<script>
import {i18n} from '@/plugins/i18n'

export default {
    name: 'UsbCashDoor',
    created: async function(){        
       this.i18n = i18n; 
    },  
    data() {
        return { 
            i18n: {},     
            interval: 2000,  
            spinner1: false,
            canPay: true, 
            cardCode: '', 
            key: 0,
            zipCode: '',
            state:'',
            city: '',
            address: '',
        }
    }, 
    props:{
        parent: {type: Object, default: ()=> {}} , 
    },   
    
    methods:{

        cancel(){
             return this.$ionic.modalController.dismiss();
        },

        senPayment(){  
            return this.parent.responseCashPayment(true);            
        }, 
     
    },

}
</script>