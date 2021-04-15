<template>
    <div>
        <div class="ion-padding">  

            
            SAVE ORDER WITH CASH PAYMENT

            <div style="padding: 20px 15px; text-align: center">

                <ion-button :disabled="spinner1? true: false"  fill="outline" @click="cancel">{{Cancel}}</ion-button>
                <ion-button :disabled="spinner1 || !canPay? true: false"
                fill="outline" 
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
        ccode:  {type: String, default:"" } ,
        postalCode:  {type: String, default:"" } ,
        addressLine1:  {type: String, default:"" } ,
        codeNotValid:  {type: String, default:"" } ,
        cityText:  {type: String, default:"" } ,
        stateText:  {type: String, default:"" } ,
        dataRequired:  {type: String, default:"" } ,
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