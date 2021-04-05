<template>
  <div>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ title }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">

        <ion-button @click="dismissQr" expand="full">
            <ion-icon slot="icon-only"  name="close"></ion-icon>
        </ion-button>

        <ion-card  >
            {{productId}}
           <v-btn >
                  <vue-goodshare-facebook 
                    :page_url= staticUrl+productId
                    :page_title="Title"             
                    has_counter
                    has_icon
                    title_social=""
                  ></vue-goodshare-facebook>
                </v-btn> 

                <v-btn>
                    <vue-goodshare-linked 
                    :page_url= staticUrl+productId
                    :page_title="Title"              
                    has_counter
                    has_icon
                    title_social=""
                  ></vue-goodshare-linked>
                </v-btn>

                <v-btn >
                    <vue-goodshare-email
                    :page_url= staticUrl+productId
                    :page_title="Title" 
                    has_icon
                    has_counter
                    title_social="Email"
                  ></vue-goodshare-email>
                </v-btn>  

        
        
        </ion-card>

       
    </ion-content>
  </div>
</template>

<script>

import VueGoodshareFacebook from "vue-goodshare/src/providers/Facebook.vue"
import VueGoodshareEmail from "vue-goodshare/src/providers/Email.vue" 
import VueGoodshareLinked from "vue-goodshare/src/providers/LinkedIn.vue" 

export default {
  name: 'ProductDetail',
  props: {
    title: { type: String, default: '' },    
    productId: { type: String, default: '' },    
  },
  components:{
      VueGoodshareFacebook: VueGoodshareFacebook,
      VueGoodshareEmail: VueGoodshareEmail,
      VueGoodshareLinked: VueGoodshareLinked
  },
  data() {
    return {
      content: 'Content',
      result: '',
      error: ''  ,
      staticUrl: 'https://miguelaugusto87.github.io/RestaurantMenuApp/?share='
    }
  },

methods: {

    dismissQr(){
       return this.$ionic.modalController.dismiss()
    }
 


}
 

}
</script>