<template>
    <div>
         <div v-if="spinner">
            <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
        </div>

        <div >

            <ion-header>
                <ion-toolbar>
                    <ion-buttons slot="start" @click="goInit()" >
                        <ion-back-button default-href="/"></ion-back-button>
                    </ion-buttons>
                    <div style="display: flex;justify-content: center; align-items: center; " v-if="show">
                        <ion-avatar style="width: 50px; height: 50px; margin: 0 10px;">
                        <img :src="restaurant.ImageUrl">
                    </ion-avatar>
                      <h3 >{{restaurant.Name}}</h3>  

                    </div>                                    
                </ion-toolbar>
            </ion-header> 
            
         <v-breakpoint> 

             <div slot-scope="scope">

                 <ion-card   :class="scope.isSmall || scope.noMatch ? 'menu-col-12' : 'menu-col-8'" style="margin: 0 auto;">

                     <ion-card-header>
                        <strong style="font-size: 18px;">{{$t('frontend.unsubscribe.title')}}</strong>
                     </ion-card-header>

                     <ion-card-content :key="key" v-if="show && !done">
                        
                         <ion-item :disabled="spinner? true: false"  >
                            <ion-label position="floating">{{$t('frontend.unsubscribe.email')}}<strong style="color: red">*</strong></ion-label>                                          
                            <ion-input type="text" required=true                                 
                                :value="unsubscribeEmail" @input="unsubscribeEmail = $event.target.value"  @change="validateEmail($event.target.value)"
                            ></ion-input>
                        </ion-item>

                         <ion-button :disabled="spinner? true: false" @click="goInit()">{{$t('frontend.home.cancel')}}</ion-button>
                        <ion-button :disabled="spinner? true: false" @click="unsubscribeCustomer()" >{{$t('frontend.home.acept')}}</ion-button>

                     </ion-card-content>

                    <ion-card-header v-if="done" style="display: flex;align-items: center;justify-content: center;">
                        <strong style="font-size: 18px;">{{$t('frontend.unsubscribe.unsubscribeOk')}}</strong>
                        <span class="iconify" data-icon="flat-color-icons:ok" data-inline="false"></span>
                     </ion-card-header>

                     
                   
                                        
                 </ion-card>

             </div> 

         </v-breakpoint>

        </div>
    </div>
    
</template>

<script>

     

import { VBreakpoint } from 'vue-breakpoint-component'
import { Api } from '../../backoffice/api/api.js';
export default {
    name: 'Unsubscribe',
    created: async function(){

        if(this.$route.params.restaurantId)
            this.restaurantId = this.$route.params.restaurantId;
        if(this.$route.params.parent)
            this.parent = this.$route.params.parent;

        await this.getRestaurant();
    }, 
    props: {  
       
     },
    data() {
        return {  
          parent: {},
          restaurantId: '',
          spinner: false,
          unsubscribeEmail: '',
          restaurant: {},
          key: 0,
          show: false,
          done: false
        }
    },  
    components:{
        VBreakpoint,        
    },
    methods:{
        goInit(){
            this.parent.newRestaurant = false;  
            this.$router.push({name: 'AppVue' });
        },
    

        validateEmail(value){
         let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
            if (emailRegex.test(value) == false){
                this.unsubscribeEmail = '';
                this.key ++;
                return this.openMs(this.$t('frontend.home.notValidEmail'), 'danger');
            }               
        },

        async openMs(mss, color) {
            return this.$ionic.toastController      
            .create({
                header: '',
                message: mss,           
                position: 'top',
                color: color,
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

        getRestaurant: async function(){
            this.key ++
  
        try {
            const response = await Api.fetchById('Restaurant', this.restaurantId);
                if(response.status === 200)   {        
                    this.restaurant = response.data;
                    this.show = true;
                }
            
            } catch (error) {
                console.log(error);
                this.show = false;
                return this.openMs( this.$t('frontend.unsubscribe.restaurantFail'), "danger")
            }
      
         },

         async unsubscribeCustomer(){
             if(this.unsubscribeEmail !== ''){
                console.log('Unsubscribe a '+ this.unsubscribeEmail);
                try {
                  this.spinner = true;
                    const response = await  Api.unsubscribe(this.restaurantId,  {"Email": this.unsubscribeEmail});
                    if(response.status ===200){
                        console.log(response) 
                        this.spinner = false;                   
                        return this.done = true;
                    }  
                } catch (error) {
                    this.spinner = false;
                    console.log(error)
                    return this.openMs(this.$t('frontend.unsubscribe.unsubscribeFail'), 'danger')
                }
                
             }
         }

    
    





    },

    
        
}   
</script>



<style >

.fortebtn {
  background-color: transparent !important;
    border: none !important;
    padding: 0 !important;
}

</style>