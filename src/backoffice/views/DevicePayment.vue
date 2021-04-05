<template>
    <div>
        <ion-header>
            <ion-toolbar>
                <ion-title>Payment order</ion-title>
            </ion-toolbar>
        </ion-header>
        <div class="ion-padding">
                <ion-item>
                    <ion-label position="floating"><span style="color: red">*</span>DeviceSN</ion-label>
                    <ion-input type="text" name="name"
                    @input="sn = $event.target.value" 
                    v-bind:value="sn">
                    </ion-input>
                </ion-item>
                <br/>

                <ion-button fill="outline" @click="dismissModal()">CLOSE</ion-button>
                <ion-button fill="outline" @click="doCredit()"><span class="iconify" data-icon="ic:twotone-payments" data-inline="false"></span> PAY</ion-button>

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
            transactionType: this.deviceTransactionType,
            ip: '192.168.50.74',
            port: '10009',
            spinner: false,
        }
        
    },
    created(){
        this.serverId = this.grandfather.$store.state.user.ServerId.toString()
        this.datas.ClerkID = this.serverId
        this.datas.transactionType = this.transactionType
    },
    props: {
        datas: { type: Object, default:() => {} },
        parent: { type: Object, default: null },
        grandfather: { type: Object, default: null },
        deviceTransactionType: { type: String, default: '01' },
    },
    methods: {
        callback(res){
            console.log("SUCCESSFULLY---RESPONSE:")
            console.log(res)
            if (res[4] == '000000')
            {
                const resData = {
                        "total": parseInt(res[8][0])/100,
                        "transId": res[10][0],
                        "accountNumber": res[9][0],
                        "expirationCard": res[9][2],
                        "accountType": res[9][7],
                        "method": 'Device',
                }
                // const resData = {
                //     'total': parseInt(res[8][0])/100,
                //     'invoice': res[10][3],
                //     'accountNumber': res[9][0],
                //     'expirationCard': res[9][2],
                //     'accountType': res[9][7],
                // }
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
                Devices.a930.Initialize(this.ip, this.port, this.callback)
            }
            catch(e){
                console.log(e)
                this.showToastMessage('Ha ocurrido un error. El pago no se ha podido realizar', 'danger')
                this.dismissModal()
            }
        },
        async doCredit(){
            console.log(this.grandfather.$store.state.user.ServerId.toString())

            // const data = {
            //     'transactionType': '01', //SALE
            //     'amountInformation': {
            //         'TransactionAmount': 250.00,
            //         'TipAmount': 20.00,
            //         'TaxAmount': 25.00,
            //     },
            //     'ClerkID': this.$store.state.user.ServerId.toString(),
            //     'accountInformation':{
            //         'FirstName': 'Miguel'
            //     }
            // } 

            try{
              this.spinner = true
              await  Devices.a930.DoCredit(this.ip, this.port, this.datas, this.callback);
              
            }
            catch(e){
                console.log(e)
                 this.showToastMessage( e, 'danger')
                 this.spinner = false;
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