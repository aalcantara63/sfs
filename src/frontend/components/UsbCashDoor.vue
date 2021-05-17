<template>
    <div>
        <div class="ion-padding">  

            
            SAVE ORDER WITH CASH PAYMENT

            <div style="padding: 20px 15px; text-align: center">

                <ion-button   fill="outline" @click="cancel">{{Cancel}}</ion-button>
                <ion-button fill="outline" 
                 @click="senPayment">{{Acept}}</ion-button>

                <div v-if="spinner1" style="margin: 10px">
                    <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
                </div>

            </div>

       
    </div>
        
      

    </div>
</template>

<script>

export default {
    name: 'UsbCashDoor',
    created: async function(){        
       
    },  
    data() {
        return {     
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
        Acept:  {type: String, default:"" } ,
        Cancel:  {type: String, default:"" } ,
      
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