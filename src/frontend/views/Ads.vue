<template>
<ion-card>
  
      
  <ion-toolbar>
      
    <ion-segment id="reservationSegment" @ionChange="segmentChanged($event.target.value)" :value="segmentValue" @input="value=segmentValue">
      <ion-segment-button value="ads1">
        <span class="iconify" data-icon="ant-design:plus-outlined" data-inline="false"></span>
         <!-- ADD -->
      </ion-segment-button>
      <ion-segment-button value="ads2">
      <span class="iconify" data-icon="tabler:search" data-inline="false"></span>
      <!-- SEARCH -->
      </ion-segment-button>
      <ion-segment-button value="ads3">
      <span class="iconify" data-icon="ant-design:unordered-list-outlined" data-inline="false"></span>
      <!-- LIST -->
    </ion-segment-button>
    </ion-segment>
   
  </ion-toolbar>

  <div v-if="ads1" >
    ADS 1   
    <!-- <iframe width="853" height="480" src="https://www.youtube.com/embed/lZgHntLXIL0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>  -->
     <iframe  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" frameborder="0" 
      src="https://www.youtube.com/embed/lZgHntLXIL0" style="width: 100%; height: 90vh;"></iframe>

    <!-- {{adsList}} -->
  </div>
  
  <div v-if="ads2">
    ADS 2

    vuejs-2-the-complete-guide
    <!-- <video src="https://youtu.be/vxobr4A8pSA" width=320  height=240 controls >
      Lo sentimos. Este vídeo no puede ser reproducido en tu navegador.<br>
      La versión descargable está disponible en <a href="URL">Enlace</a>. 
    </video> -->

        
      <iframe :src="adsList[1].url" style="width: 100%; height: 90vh;"></iframe>
        
  </div>

  <div v-if="ads3">
      ADS 3
      <iframe src="https://youtu.be/vxobr4A8pSA" style="width: 100%; height: 90vh;"></iframe>

  </div>


</ion-card>
</template>
<script>


export default {
    name: 'Reservation',
     components: {   
  },
     data () {
      return {
         ads1: true,
         ads2: false,
         ads3: false,
         spinner: false,   
         segmentValue: 'ads1',    
         adsList: [],
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