<template>
    <div>
        <ion-header>
            <ion-toolbar>
                <ion-title>Set Device Data</ion-title>
            </ion-toolbar>
        </ion-header>
        <div class="ion-padding">
                <ion-item>
                    <ion-label position="floating"><span style="color: red">*</span>Ip</ion-label>
                    <ion-input type="text" name="name"
                    @input="ip = $event.target.value" 
                    v-bind:value="ip">
                    </ion-input>
                </ion-item>
                <br/>
                <ion-item>
                    <ion-label position="floating"><span style="color: red">*</span>Port</ion-label>
                    <ion-input type="text" name="name"
                    @input="port = $event.target.value" 
                    v-bind:value="port">
                    </ion-input>
                </ion-item>
                <br/>
                <ion-item>
                    <ion-label position="floating">DeviceSN</ion-label>
                    <ion-input type="text" name="name"
                    @input="sn = $event.target.value" 
                    v-bind:value="sn">
                    </ion-input>
                </ion-item>
                <br/>

                <ion-button fill="outline" @click="dismissModal()">Cancel</ion-button>
                <ion-button :disabled="(ip === '' && port ==='')"  fill="outline" @click="save()"> Save</ion-button>
        </div>
    </div>
</template>

<script>

    export default {
        
    name: 'setDeviceDataModal',
    
    data () {

        return {
            sn: '',
            ip: '',
            port: '',
        }
        
    },
    created(){
        const device = this.parent.$store.state.device  
        this.sn = device.sn
        this.ip = device.ip
        this.port = device.port
    },
    props: {
        parent: { type: Object, default: null },
    },
    methods: {
        async save(){
            const obj = {
                'ip': this.ip,
                'port': this.port,
                'sn': this.sn,
            }
            this.parent.$store.commit("setDevice", obj);
            this.$ionic.modalController.dismiss(null);
            this.showToastMessage('The device is setting successfully.', 'success');

        },
        dismissModal() {
            this.$ionic.modalController.dismiss(null);
        },
        showToastMessage(message, tColor){
          return this.$ionic.toastController.create({
            color: tColor,
            position: 'top',
            duration: 3000,
            message: message,
            showCloseButton: false
          }).then(a => a.present())
        },
    }

}

</script>