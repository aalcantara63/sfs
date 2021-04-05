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
       <qrcode-stream @decode="onDecode" @init="onInit" />

       
    </ion-content>
  </div>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'
import { EventBus } from '../event-bus';

export default {
  name: 'Modal',
  props: {
    title: { type: String, default: 'Super Modal' },
  },
  data() {
    return {
      content: 'Content',
      result: '',
      error: ''  
    }
  },
components:{
   
    QrcodeStream: QrcodeStream  ,
  },
  beforeDestroy(){
  },
methods: {

     onDecode (result) {
      this.result = result      
      EventBus.$emit('updateTable', this.result );
      this.dismissQr();
    },

    onInit (promise) {
      promise.then(() => {
        console.log('Successfully initilized! Ready for scanning now!')
      })
       .catch (error => {
        if (error.name === 'NotAllowedError') {
          this.error = "ERROR: you need to grant camera access permisson"
        } else if (error.name === 'NotFoundError') {
          this.error = "ERROR: no camera on this device"
        } else if (error.name === 'NotSupportedError') {
          this.error = "ERROR: secure context required (HTTPS, localhost)"
        } else if (error.name === 'NotReadableError') {
          this.error = "ERROR: is the camera already in use?"
        } else if (error.name === 'OverconstrainedError') {
          this.error = "ERROR: installed cameras are not suitable"
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.error = "ERROR: Stream API is not supported in this browser"
        }
      })
    },

    dismissQr(){
       return this.$ionic.modalController.dismiss()
    }
 


}
 

}
</script>