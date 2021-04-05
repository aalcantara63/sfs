<template>
  <div>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ title }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
        <ion-button expand="full" color="danger" @click="dismissModal()" style="width: 49%;float: left;">X</ion-button>
        <ion-button expand="full" color="primary" @click="printQr()" style="width: 49%;float: left;"><ion-icon name="print" ></ion-icon> Print</ion-button>
        <ion-item></ion-item>
        <div id="multiple" v-if="type != 'unique'">
           <ion-slides pager="true"  :options="slideOpts" > 
            <ion-slide v-for="(seat,index) in content" v-bind:key="index">
                <ion-card>
                    <ion-label>
                        <h1 class="qrTitle"><b>{{getSeatName(seat.name)}}</b></h1>
                        <qrcode-vue :value="seat.name" :size=280 level="H"></qrcode-vue>
                    </ion-label>
                </ion-card>
                <ion-item></ion-item>
            </ion-slide>
           </ion-slides>
        </div>
        <div id="unique" v-else>
            <ion-card>
                <ion-label>
                    <h1 class="qrTitle"><b>{{getSeatName(content[0].name)}}</b></h1>
                    <qrcode-vue :value="content[0].name" :size=280 level="H"></qrcode-vue>
                </ion-label>
            </ion-card>
        </div>
        <ion-item></ion-item>
        <!-- <ion-button expand="full" color="primary" @click="printQr()"><ion-icon name="print"></ion-icon> Print</ion-button>
        <ion-button expand="full" color="danger" @click="dismissModal()">X</ion-button> -->
    </ion-content>
  </div>
</template>

<script>

import QrcodeVue from 'qrcode.vue';

export default {
  name: 'Modal',
  props: {
    title: { type: String, default: 'Super Modal' },
    button: { type: String, default: 'Close'}
  },
  components: {
      QrcodeVue,
  },
  data() {
    return {
      content: 'Content',
      type: 'unique',
      slideOpts:{speed: 400, slideShadows: true, initialSlide:1,  slidesPerView: 3,},
    }
  },
  created(){
          
  },
  methods:{
    dismissModal() { 
        this.$ionic.modalController.dismiss(null);
    },
    printQr(){

          let qrList = document.getElementsByTagName('canvas')
          let titles = document.getElementsByClassName('qrTitle')

          let windowContent = '<!DOCTYPE html><html><head></head><body>'
          let index = 0
          console.log("List")
          console.log(qrList[0])
          console.log(qrList.length)

          for (let qr of qrList) {
              console.log("Entró")
              let dataUrl = qr.toDataURL()
              windowContent += '<div>' + titles[index].innerHTML + '</div>'
              windowContent += '<img src="' + dataUrl + '">';
              windowContent += '<div style="margin-top: 180px"></div>'
              index++
          }
          // qrList.forEach(qr => {
          //     console.log("Entró")
          //     console.log(index)
              
          // });
          windowContent += '</body></html>';

          var winimp = window.open('', '');
          winimp.document.open();
          winimp.document.write( windowContent );
          winimp.document.close();
          winimp.focus();
          winimp.print();
          winimp.close();
    },
    getSeatName(seat){
      console.log(seat)
        
        let name = seat.split('-') 
        return name[1]
    },
  },
}
</script>

<style >
.qrTitle{
  margin: 15px !important;
    font-size: 34px !important;
}
  
</style>