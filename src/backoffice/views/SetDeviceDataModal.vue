<template>
    <div class="modal">
        <!-- <ion-header>
            <ion-toolbar>
                <ion-title>Set Device Data</ion-title>
            </ion-toolbar>
        </ion-header> -->
        <div class="ion-padding">
                <div style="width: 150px; display:inline-block; ">
                    <ion-card>
                        <ion-img :src="require('../assets/a930.jpg')"></ion-img>
                    </ion-card>
                </div>    

                <ion-item>
                    <ion-label>Server device</ion-label>
                    <ion-select  :ok-text="parent.$t('backoffice.form.messages.buttons.ok')" :cancel-text="parent.$t('backoffice.form.messages.buttons.dismiss')"
                    @ionChange="device = $event.target.value" v-bind:value="device">
                        <ion-select-option v-for="dev in devices" v-bind:key="dev.Name" v-bind:value="dev.Name" >{{dev.Name}} | {{dev.Company}}</ion-select-option>
                    </ion-select>
                </ion-item>
                <br/>

                <ion-button fill="outline" @click="dismissModal()">Cancel</ion-button>
                <ion-button :disabled="device == ''"  fill="outline" @click="save()"> Save</ion-button>
        </div>
    </div>
</template>

<script>
    import { Api } from '../api/api.js';

    export default {
        
    name: 'setDeviceDataModal',
    
    data () {

        return {
            // sn: '',
            // ip: '',
            // port: '',

            devices: [],
            device: '',
        }
        
    },
    created(){
        // this.sn = device.sn
        // this.ip = device.ip
        // this.port = device.port
        this.loadDevice()
    },
    props: {
        parent: { type: Object, default: null },
    },
    methods: {
        loadDevice(){
            Api.fetchAll("Setting").then(response=> {
                let settings = [];
                settings = response.data;
                if (settings.length > 0)
                {
                    this.devices = settings[settings.length -1].Devices;
                    const dev = this.parent.$store.state.device
                    this.device = dev.name
                    //console.log(this.devices);
                }
            })
            .catch(e => {
                console.log(e)
            });
        },
        findDevice(name){
            return this.devices.find(dev => dev.Name == name)
        },
        async save(){

            const dev = this.findDevice(this.device);
            //console.log(this.device);
            //console.log("DISPOSITIVO")
            //console.log(dev);
            const obj = {
                'name': dev.Name,
                'company': dev.Company,
                'ip': dev.Ip,
                'port': dev.Port,
            }
            this.parent.$store.commit("setDevice", obj);
            //console.log(obj)
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