<template>
    <div>
        <ion-header>
            <ion-toolbar>
                <ion-title>Payment order</ion-title>
            </ion-toolbar>
        </ion-header>
        <div class="ion-padding">
                <ion-item>
                    <ion-label>Device type</ion-label>
                    <ion-select interface="popover" ok-text="Ok" cancel-text="Cancel"
                    @ionChange="deviceType = $event.target.value" v-bind:value="deviceType">
                        <ion-select-option key="shift4" value="shift4" >Shift4</ion-select-option>
                        <ion-select-option key="tsys" value="tsys" >Tsys</ion-select-option>
                    </ion-select>
                </ion-item>
                <ion-item>
                    <ion-label>Communication mode</ion-label>
                    <ion-select interface="popover" ok-text="Ok" cancel-text="Cancel"
                    @ionChange="modeId = $event.target.value" v-bind:value="modeId">
                        <ion-select-option key="ipaddress" value="ipaddress" >Ip address</ion-select-option>
                        <ion-select-option key="serial" value="serial" >Serial number</ion-select-option>
                    </ion-select>
                </ion-item>
                <ion-item v-if="modeId === 'serial'">
                    <ion-label position="floating"><span style="color: red">*</span>DeviceSN</ion-label>
                    <ion-input type="text" name="name"
                    @input="sn = $event.target.value" 
                    v-bind:value="sn">
                    </ion-input>
                </ion-item>
                <br/>
                <ion-item v-if="modeId === 'ipaddress'">
                    <ion-label position="floating"><span style="color: red">*</span>Ip</ion-label>
                    <ion-input type="text" name="name"
                    @input="ip = $event.target.value" 
                    v-bind:value="ip">
                    </ion-input>
                </ion-item>
                <br/>
                <ion-item v-if="modeId === 'ipaddress'">
                    <ion-label position="floating"><span style="color: red">*</span>Port</ion-label>
                    <ion-input type="text" name="name"
                    @input="port = $event.target.value" 
                    v-bind:value="port">
                    </ion-input>
                </ion-item>
                <br/>
                <ion-item>
                    <p>SSL</p>
                    <ion-checkbox
                        slot="end"
                        @ionChange="ssl=$event.target.checked"
                        :checked="ssl"
                        >
                    </ion-checkbox>
                </ion-item>
                <br/>

                <ion-button fill="outline" @click="dismissModal()">CLOSE</ion-button>
                <ion-button :disabled="(sn === '' && ip === '' && port ==='') || (sn === '' && ip === '' && port !== '') || (sn === '' && ip !== '' && port === '')"  fill="outline" @click="doCredit()"><span class="iconify" data-icon="ic:twotone-payments" data-inline="false"></span> PAY</ion-button>

                <div v-if="spinner" style="margin: 10px; padding: 30px 0;">
                    <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
                </div>
               
        </div>
    </div>
</template>

<script>

    import { Devices } from '../api/devices.js';
    // import { EventBus } from '../../frontend/event-bus';

    export default {
        
    name: 'demo',
    
    data () {

        return {
            sn: '',
            serverId: '',
            modeId: 'ipaddress',
            transactionType: this.deviceTransactionType,
            ip: '',
            port: '',
            ssl: false,
            spinner: false,
            deviceType: 'shift4',
        }
        
    },
    created(){
        // this.getDeviceInfoBySerialNo('1170174939')
        this.serverId = this.grandfather.$store.state.user.ServerId.toString()
        this.datas.ClerkID = this.serverId
        this.datas.transactionType = this.transactionType

        //loading device
        const device = this.grandfather.$store.state.device
        console.log(device)
        this.ip = device.ip
        this.port = device.port
        this.sn = device.sn
    },
    props: {
        datas: { type: Object, default:() => {} },
        parent: { type: Object, default: null },
        grandfather: { type: Object, default: null },
        deviceTransactionType: { type: String, default: '01' },
    },
    methods: {
        changeModeId(val){
            console.log(val)
            this.modeId = val
        },
        async getDeviceInfoBySerialNo(number){
            const res = await Devices.a930.getDeviceInfoBySN(number)

            if (res.data){
                if (window.DOMParser)
                {
                    console.log("Caso1");
                    let parser = new DOMParser();
                    let xmlDoc = parser.parseFromString(res.data, "text/xml");
                    const code = xmlDoc.getElementsByTagName("ResultCode")[0].childNodes[0].nodeValue
                    if (code == 0)
                    {
                        const ipaddres = xmlDoc.getElementsByTagName("IPaddress")[0].childNodes[0].nodeValue
                        const port = xmlDoc.getElementsByTagName("Port")[0].childNodes[0].nodeValue
                        this.ip = ipaddres
                        this.port = port
                        return true
                    }
                    else{
                        return false
                    }
                }
                else // Internet Explorer
                {
                    console.log("Caso2");
                    let xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
                    xmlDoc.async = false;
                    xmlDoc.loadXML(res.data);
                    const code = xmlDoc.getElementsByTagName("ResultCode")[0].childNodes[0].nodeValue
                    if (code == 0)
                    {
                        const ipaddres = xmlDoc.getElementsByTagName("IPaddress")[0].childNodes[0].nodeValue
                        const port = xmlDoc.getElementsByTagName("Port")[0].childNodes[0].nodeValue
                        this.ip = ipaddres
                        this.port = port
                        return true
                    }
                    else{
                        return false
                    }

                    
                }   
            }
            else{
                return false
            }
        },
        callback(res){
            console.log("SUCCESSFULLY---RESPONSE:")
            console.log(res)
            if (res[4] == '000000')
            {
                const resData = {
                        "total": parseInt(res[8][0])/100,
                        "transId": res[6][3],
                        "transIdDevice": res[10][0],
                        "accountNumber": res[9][0],
                        "expirationCard": res[9][2],
                        "accountType": res[9][7],
                        "method": 'Device',
                        "moto": 'fb',
                }
                // const resData = {
                //     'total': parseInt(res[8][0])/100,
                //     'invoice': res[10][3],
                //     'accountNumber': res[9][0],
                //     'expirationCard': res[9][2],
                //     'accountType': res[9][7],
                // }
                console.log('TRANS-ID')
                console.log("res[5][3]" + res[5][3])
                console.log("res[6][3]" + res[6][3])
                console.log("res[4][3]" + res[4][3])
                console.log("res[5][4]" + res[5][4])
                console.log('RES DATA')
                console.log(resData)
                this.parent.responseDevicePay(resData)
                this.showToastMessage('El pago se realizó exitosamente', 'success')
                this.spinner = false
            }
            else if (res[4] == '100001')
            {
                this.showToastMessage('Time out', 'danger')
                this.spinner = false
            }
            else if (res[4] == '000100')
            {
                this.showToastMessage('Decline', 'danger')
                this.spinner = false
            }
            else{
                this.showToastMessage('Other errer', 'danger')
                this.spinner = false
            }
            
            this.dismissModal()
        },
        initialize(){
            try{
                Devices.a930.Initialize(this.ip, this.port, this.ssl, this.callback)
            }
            catch(e){
                console.log(e)
                this.showToastMessage('Ha ocurrido un error. El pago no se ha podido realizar', 'danger')
                this.dismissModal()
            }
        },
        async doCredit(){
            console.log(this.grandfather.$store.state.user.ServerId.toString())

            if (this.modeId == 'serial'){

                if (this.deviceType == 'shift4')
                {

                    const val = await this.getDeviceInfoBySerialNo(this.sn) 

                    if (val){
                        console.log("VAL1")
                        console.log(val)
                        console.log("IP address: " + this.ip)
                        console.log("Port: " + this.port)
                        try{
                            
                            this.spinner = true
                            const anw = await Devices.a930.DoCredit(this.ip, this.port, this.ssl, this.datas, this.callback);
                            console.log(anw)
                        }
                        catch(e){
                            console.log(e)
                            this.showToastMessage(e, 'danger')
                            this.spinner = false;
                        }
                    }
                    else{
                        console.log("VAL0")
                        this.showToastMessage('ERROR: There was an error get IP address and port of the device.', 'danger')
                    }

                }

                if (this.deviceType == 'tsys')
                {
                     console.log('Dailenis, tu código aquí')
                }

                
            }
            else{

                if (this.deviceType == 'shift4')
                {

                    try{    
                        this.spinner = true
                        const anw = await Devices.a930.DoCredit(this.ip, this.port, this.ssl, this.datas, this.callback);
                        console.log(anw)
                    }
                    catch(e){
                        console.log(e)
                        this.showToastMessage(e, 'danger')
                        this.spinner = false;
                    }

                }

                if (this.deviceType == 'tsys')
                {
                    console.log('Dailenis, tu código aquí')
                }

            }   
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