<template>
    <div>
        <div class="ion-padding">  SWIPE A CARD

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
import LibCodes from 'zipcodes'

export default {
    name: 'UsbCardReader',
    created: async function(){ 
       
        
    },  
    data() {
        return {     
            interval: 2000,  
            spinner1: false,
            canPay: false, 
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

       

         async callFunction() {   
            if (navigator.usb) { 
                 try {                     
                    let device = await navigator.usb.requestDevice({ filters: [{ vendorId: 0xACD }]});
                    if(device){
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
                var hex = val.toString('hex'); 
                const data = {
                    hex : hex                    
                }
                return this.parent.responseSwipeCard(data);
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

        ValidateCodeInModal(event){
            this.key ++;
            
            var hills = LibCodes.lookup(event);   
            if(!hills){
                this.state = "";
                this.city = "";
                this.zipCode = '';      
                this.alertCodeNotValid();  
                return '';     
            }     
            else{
                this.state = hills.state;
                this.city = hills.city;
                this.zipCode = event;
                
                this.toastCityState();
                return event;
            }      
        },  

        alertCodeNotValid(){
            return  this.$ionic.alertController
            .create({
                cssClass: 'my-custom-class',
                header: 'Error',
                message: this.codeNotValid ,
                buttons: [                   
                {
                    text: this.Acept,
                    handler: () => {  },
                },
                ],
            })
            .then(a => a.present())
                        
        },

    async toastCityState() {
      return this.$ionic.toastController
      
        .create({
          message: `${this.cityText}: ${this.city} | ${this.stateText}: ${this.state}`,
          duration: 2000,
          position: 'top',
          color:'success'
        })
      .then(a => a.present())
    },
   
     

  
      

    
     
    },

}
</script>