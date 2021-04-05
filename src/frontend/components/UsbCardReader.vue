<template>
    <div>
        <div class="ion-padding">  

            <textarea id="target" style=" width: 100%;height: 100px;"  @change="noData()"></textarea>        

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
//  import HID from 'node-hid';

export default {
    name: 'UsbCardReader',
    created: async function(){ 
        this.callFunction()
        
    },  
    data() {
        return {     
            interval: 2000,  
            spinner1: false,
            canPay: false,  
        }
    }, 
    props:{
        parent: {type: Object, default: ()=> {}} ,
        Acept:  {type: String, default:"" } ,
        Cancel:  {type: String, default:"" } ,
    },   
    
    methods:{

       

         async callFunction() {   
            if (navigator.usb) { 
                 try {                     
                    let device = await navigator.usb.requestDevice({ filters: [{ vendorId: 0xACD }]});
                    if(device){
                        //console.log(device);
                        document.getElementById('target').focus();
                    }
                    else
                        return this.error('Not IDTech device connected.');
                   
                } catch (error) {                      
                    console.log(error);
                    return this.error('Not IDTech device connected.');
                }                 
            } else {               
                return this.error('WebUSB not supported. Try another payment method.')
            }
        },

        noData(){

            if(document.getElementById('target')){
                 const val = document.getElementById('target').value;
                if(val !== '')
                      this.canPay = true;
            }
        },

        cancel(){
             return this.$ionic.modalController.dismiss();
        },

        senPayment(){
            const val = document.getElementById('target').value;
            if(val){
                console.log('send payment');
                var hex = val.toString('hex'); 
                return this.parent.responseIDTEch(hex);
            }
            else
                return this.error('Swipe Card and wait the info was write in te textarea.')
            
        },

        async error(message) {
            return this.$ionic.toastController
        
            .create({
            message: message,
            position: 'top',
            color:'danger',
            buttons: [
                {
                text: 'Done',
                role: 'cancel',
                handler: () => {
                }
                }
            ]
            })
        .then(a => a.present())
        },

  
      

    
     
    },

}
</script>