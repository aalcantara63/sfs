<template>
<div>
   
      <ion-toolbar>
      <ion-segment   @ionChange="segmentValue=$event.target.value" :value="segmentValue" >
        <ion-segment-button value="-1">
          <span class="iconify" data-icon="bx:bx-slider" data-inline="false"></span>
        </ion-segment-button>   
        <ion-segment-button v-for="(ads, index) in adsList" :key="index" :value="index">
          {{ads.Name}}
        </ion-segment-button>    
      </ion-segment>   
    </ion-toolbar>

    <div v-if="segmentValue==-1">      
          <ion-slides  pager="true" :options="slideOpts">               

                <ion-slide v-for="(ads, index) in adsList" :key="index"  >
                    <ion-card   style="padding:10px">
                        <ion-card-header>                           
                            <ion-card-title>{{ads.Name}}</ion-card-title>
                        </ion-card-header>
                        <ion-card-content>
                             <iframe v-if="['url','map'].includes(ads.Type)" :src="ads.Value" autoplay></iframe>
        
                              <video v-if="ads.Type=='video'" :src="ads.Value" controls autoplay></video>

                              <img v-if="ads.Type=='image'" :src="ads.Value"/>

                              <div v-if="ads.Type=='menu'">
                                 <menu-ads
                                    :menuId="ads.Value"
                                  ></menu-ads>
                              </div>
                        </ion-card-content>
                    </ion-card> 
               
                </ion-slide>

            </ion-slides> 
    </div>

    <div v-for="(ads, index) in adsList" :key="index">
      <div v-if="index==segmentValue">
      
        <iframe v-if="['url','map'].includes(ads.Type)" :src="ads.Value" autoplay></iframe>
        
        <video v-if="ads.Type=='video'" :src="ads.Value" controls autoplay></video>

        <img v-if="ads.Type=='image'" :src="ads.Value"/>

        <div v-if="ads.Type=='menu'">         
          <menu-ads
            :menuId="ads.Value"
          ></menu-ads>
        </div>



      </div>
    </div>
   

  <!-- <div v-if="ads1" >
    ADS 1   
     <iframe  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" frameborder="0" 
      src="https://www.youtube.com/embed/lZgHntLXIL0" style="width: 100%; height: 90vh;"></iframe>

  </div>
  
  <div v-if="ads2">
    ADS 2

    vuejs-2-the-complete-guide -->
    <!-- <video src="https://youtu.be/vxobr4A8pSA" width=320  height=240 controls >
      Lo sentimos. Este vídeo no puede ser reproducido en tu navegador.<br>
      La versión descargable está disponible en <a href="URL">Enlace</a>. 
    </video> -->

        
      <!-- <iframe :src="adsList[1].url" style="width: 100%; height: 90vh;"></iframe>
        
  </div>

  <div v-if="ads3">
      ADS 3
      <iframe src="https://youtu.be/vxobr4A8pSA" style="width: 100%; height: 90vh;"></iframe>

  </div>
 -->

</div>
</template>
<script>

import MenuAds from './MenuAds.vue'

export default {
    name: 'Reservation',
     components: { 
       MenuAds,  
  },
     data () {
      return {
         ads1: true,
         ads2: false,
         ads3: false,
         spinner: false,   
         segmentValue: 'ads1',    
         adsList: [],
         slideOpts:{ initialSlide: 0, slidesPerView: 1, autoplay:"5000", loop:"true", speed:"300"},
      }
     },     
     created: function(){

       this.adsList = this.$store.state.configuration.ads;
     },
    methods: {       
   
         
      segmentChanged(value){            
             if(value === 'ads1'){
                 this.ads1 = true;
                 this.ads2 = false;
                 this.ads3 = false;
             }
             if(value === 'ads2'){
                 this.ads1 = false;
                 this.ads2 = true;
                 this.ads3 = false;
             }  
              if(value === 'ads3'){
                 this.ads1 = false;
                 this.ads2 = false;
                 this.ads3 = true;                
             }
             this.segmentValue = value;

         },

     }
}

</script>

<style scoped>
iframe body{
  text-align: center;
}

#front-login{
    display: none !important;
}
   
ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

.paginate-list {
  width: 159px;
  margin: 0 auto;
  text-align: left;
 
}
 .paginate-list li {
    display: block;   
  }

 .paginate-list li:before {
      content: '⚬ ';
      font-weight: bold;
      color: slategray;
    }

.paginate-links.items {
  user-select: none;
}
  a {
    cursor: pointer;
  }
  li.active a {
    font-weight: bold;
  }
  li.next:before {
    content: ' | ';
    margin-right: 13px;
    color: #ddd;
  }
  li.disabled a {
    color: #ccc;
    cursor: no-drop;
  }
  .prev, .next{
    font-size: 40px;
  }
  .elipsis-menu{
        text-overflow: ellipsis !important;
    overflow: hidden !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
    
</style>