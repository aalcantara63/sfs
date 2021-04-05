<template>

 <v-breakpoint>
         <div slot-scope="scope" style="">
  <div :style="scope.isSmall || scope.noMatch ? 'position: relative;   height: 300px;width: 90%;margin: 0 auto;': 'position: relative;   height: 300px;width: 70%;margin: 0 auto;'" >
              
 
       <!-- <ionMenus/> -->
    <div id="color1" >
    <div>
      <ion-menu side="start"  contentId="my-content" >
        <ion-header>
          <ion-toolbar style="color:red !important">
            <ion-title>{{$t('frontend.menu.menu')}}</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content padding class="menu ion-page">  
          <ion-content>
            <ion-item> </ion-item>          

            
            <ion-card>
              <div class="logo" style="margin-bottom: 5px;">
                <img  src="" >
              </div>
              
              <ion-item> 
                <div style="position: absolute; bottom: 0;text-align: center;width: 100%;">
                  <a  >
                    <span class="iconify" color="#3b5998"  data-icon="ion-logo-facebook" data-inline="false" ></span> 
                  </a>
                  <a  >
                    <span class="iconify" color="#1DA1F2" data-icon="ion-logo-twitter" data-inline="false"></span> 
                  </a>
                  <a >
                    <span class="iconify" color="#8a3ab9" data-icon="ion-logo-instagram" data-inline="false"></span> 
                  </a>
                  <a  >
                    <span class="iconify" color="#FF0000" data-icon="ion-logo-youtube" data-inline="false"></span>  
                  </a>
                  <a >
                    <span class="iconify" color="primary" data-icon="foundation:web" data-inline="false"></span>  
                  </a>
                </div> 
              </ion-item>     
           
              <ion-item >  {{$t('frontend.menu.about')}}</ion-item> 
              <ion-item > {{$t('frontend.menu.menu')}}</ion-item>   
              <ion-item >  {{$t('frontend.menu.menuCatering')}}</ion-item>           
              <ion-item > {{$t('frontend.menu.reservation')}} <ion-badge >5</ion-badge></ion-item>  
              <ion-item > {{$t('frontend.menu.orders')}} <ion-badge >12</ion-badge> </ion-item> 
               <Language />

            </ion-card>     

          </ion-content>
        </ion-content>
      </ion-menu>

      <ion-menu side="end" contentId="my-content" >
        <ion-header>
          <ion-toolbar color="secondary">
             <ion-title >{{ $t('backoffice.options.menuTitle') }}</ion-title>              
          </ion-toolbar>
        </ion-header>

        <ion-content padding class="ion-page menu" >
            <ion-item> </ion-item>
                    
            <div style="margin-top: 20px">
                <Language />
            </div>

            <ion-content >
                <div >
                    <ion-card>
                        <ion-item>
                            <ion-input type="email" name="email" :placeholder="$t('backoffice.form.fields.email')"></ion-input>
                        </ion-item>
                        <ion-item>
                            <ion-input type="password" name="password" :placeholder="$t('backoffice.form.fields.password')"></ion-input>
                        </ion-item>
                        <ion-button expand="full" color="primary">{{$t('backoffice.form.login')}}</ion-button>
                        <ion-item>
                        <a class="forgotPass">{{$t('backoffice.options.forgotPassword')}}</a>
                        </ion-item>
                    </ion-card> 
                </div>
            </ion-content>
        </ion-content>
      </ion-menu>

      <div  main id="my-content">
        <ion-header> 
          <ion-toolbar color="primary">             
            <ion-icon @click="openStart" name="menu" class="menu-col-2" style="float: left;font-size: 30px;"></ion-icon> 
            <ion-title class="menu-col-8" style="float: left">Restaurant Name</ion-title>          
            <ion-icon @click="openEnd" name="settings" class="menu-col-2" style="float: right;font-size: 30px;"></ion-icon>
          </ion-toolbar>
        </ion-header>
        <ion-content></ion-content>
      </div>

    </div>
    <ion-menu-controller></ion-menu-controller>
  </div>

    <br>
  
        <div>

            <ion-button style="width: 25%;" color="primary"  >{{$t('frontend.app.deliver')}}</ion-button>
            <ion-button style="width: 25%;" color="secondary"  >{{$t('frontend.app.pickup')}}</ion-button>
            <ion-button  style="width: 25%;" color="tertiary" >{{$t('frontend.app.table')}}</ion-button> 

            <br>
            <div style="display: inline-block;">
                <ion-chip outline
                style="margin: 7px 0 0 5px;padding: 0 10px; float: left;">            
                <ion-icon name="cart" size="large" style="margin-right:0"></ion-icon>
                <ion-badge>3</ion-badge>
                </ion-chip>
                <div  style="float: left;margin: 15px;">
                <a >{{$t('frontend.home.checkout')}}</a>
                </div>
            </div>

        </div>

      
        


  </div>
         </div>
 </v-breakpoint>
</template>


<script>
 import { VBreakpoint } from 'vue-breakpoint-component'
export default {
  name: "ColorExample",

   data () {
    return {
    }},

    components:{    
    VBreakpoint: VBreakpoint,
    
  },
  props: {
     secondaryStyles: { type: Array,
      default: function (){
                return [{
                    'color': 'black',
                    'background-color': 'red',
                    'padding': '10px',
                    'width': '100px',
                    'height': '40px',
                    'display': 'inline-block',
                    'margin': '10px',
                    'border-radius': '6px'
                }]
            } 
      },
    //  primaryStyles: {type: String, default: '' },
    //  primaryStyles: {type: String, default: '' },
  },
  methods: { 

    openStart () {
        document.querySelector('ion-menu-controller').open('start')     
      },

    openEnd () {
        document.querySelector('ion-menu-controller').open('end')
      },
      
    closeEnd () {
        document.querySelector('ion-menu-controller').close('end')
      },
      
    closeStart () {
      if( document.querySelector('ion-menu-controller'))
        document.querySelector('ion-menu-controller').close('start')
      },
  }
}
</script>