<template>
<div id="ProductForm" class="screen">
    <ion-backdrop v-if="isBackdrop"></ion-backdrop>
    <ion-header>
            <ion-toolbar>
            <ion-item>
                <ion-buttons slot="start">
                    <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'ControlPanel'})"></ion-back-button>
                </ion-buttons>
                <ion-label v-if="screenWidth < 600" style="padding: 20px 0px;">
                    <h1>{{title}}</h1>            
                </ion-label>
                <ion-label v-if="screenWidth >= 600" style="padding: 20px 35%;">
                    <h1>{{title}}</h1>            
                </ion-label>
            </ion-item>
            </ion-toolbar>
        </ion-header>
    <br/>

    <div v-if="spinner">
        <ion-spinner name="lines" class="spinner"></ion-spinner>
    </div>
    <div v-else>
        <div>
            <ion-card>
                <ion-item><h5 style="text-align: left">Shift4</h5></ion-item>
                <ion-item>
                    <ion-label>{{$t('backoffice.form.fields.active')}} Shift4</ion-label>
                    <ion-toggle :disabled="!testActiveMethods('SHIFT4')" color="primary"
                    @ionChange="changePayMethod($event.target.checked, 'SHIFT4')"
                    :checked="payShift4"></ion-toggle>
                </ion-item>
                <!-- <ion-item v-if="!testActiveMethods('SHIFT4')"> -->
                <ion-item>
                    <ion-label position="floating">
                        <span style="color: red" >*</span>{{$t('backoffice.form.fields.authenticationToken')}}
                    </ion-label>
                    <ion-input type="text" name="tokenShift4"
                    @input="tokenShift4 = $event.target.value" 
                    v-bind:value="tokenShift4">
                    </ion-input>
                    <ion-label position="floating">
                        {{$t('backoffice.form.fields.authenticationTokenMoto')}}
                    </ion-label>
                    <ion-input type="text" name="tokenMotoShift4"
                    @input="tokenMotoShift4 = $event.target.value" 
                    v-bind:value="tokenMotoShift4">
                    </ion-input>
                    <ion-button color="primary" :disabled="!isValidToken('SHIFT4')" @click="submitShift4Token()">{{$t('backoffice.form.fields.submitToken')}}</ion-button>
                </ion-item>
            </ion-card>
        </div>
        <div>
            <ion-card>

                <ion-item><h5 style="text-align: left">Authorize.Net</h5></ion-item>
                <ion-item>
                    <ion-label>{{$t('backoffice.form.fields.active')}} Authorize.Net</ion-label>
                    <ion-toggle :disabled="!testActiveMethods('AUTH')" color="primary"
                    @ionChange="changePayMethod($event.target.checked, 'AUTH')"
                    :checked="payAuth"></ion-toggle>
                </ion-item>
                <ion-item v-if="!testActiveMethods('AUTH')">
                    <ion-button color="primary" @click="activeAuthNet()">{{$t('backoffice.form.fields.active')}}</ion-button>
                </ion-item>
            </ion-card>
        </div>
        <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="save()">{{ $t('backoffice.form.buttons.save') }}</ion-button>
        <!-- <ion-button color="primary" @click="clear()">Clear</ion-button> -->
    </div>
</div>
</template>

<script>
import { Api } from '../api/api';
import { payAuthorizeNet } from '../api/payments';

export default {
    name: 'paymentSettingForm',
    
    data () {
        return {
            modelName: 'Restaurant',
            id: null,
            screenWidth: 0,
            isBackdrop: false,
            spinner: false,

            //Shift4
            payShift4: false,
            tokenShift4: '',
            tokenMotoShift4: '',

            //Authorize.net
            payAuth: false,

            payMethod: '',
            paymentMethods: [],
        }
    },
    created(){
        this.screenWidth = screen.width;
        this.id = this.$route.params.settingId;
        this.getPaymentData()
    },
    computed: {
        title() {
            return this.$t('backoffice.form.titles.changePaymentSetting');
        }
    },
    methods: {
        // clear(){
        //     const item = {
        //         "_id": this.id,
        //         "PaymentMethods": []
        //     }
        //     Api.putIn(this.modelName, item)
        //     .then(() => {
        //         this.getPaymentData()
        //     })
        // },
        testActiveMethods(method){
            return this.paymentMethods.includes(method)
        },
        getPaymentData(){
            if (this.id){
                 this.$ionic.loadingController
                .create({
                    cssClass: 'my-custom-class',
                    message: this.$t('backoffice.titles.loading'),
                    backdropDismiss: true
                })
                .then(loading => {
                    loading.present()
                    setTimeout(() => {  // Some AJAX call occurs
                            Api.fetchById(this.modelName, this.id)
                            .then(res => {
                                console.log(res.data)
                                this.payMethod = res.data.PayMethod
                                this.paymentMethods = res.data.PaymentMethods
                                if (this.testActiveMethods(this.payMethod) && this.payMethod)
                                    this.changePayMethod(true, this.payMethod)
                                loading.dismiss();
                            })
                            .catch(e => {
                                console.log(e)
                                loading.dismiss();
                            })
                    })
                })
            }
            else{
                this.showToastMessage("Aún no se han configurado los datos del restaurante. " + 
                        "Por favor, configure primero los datos del restaurante", "danger")
            }     
        },
        changePayMethod(value, method){
            if (method === 'SHIFT4'){
                if (value){
                    this.payAuth = false
                    this.payShift4 = true
                    this.payMethod = method
                }
                else
                    this.payShift4 = false
            }
            if (method === 'AUTH'){
                if (value){
                    this.payShift4 = false
                    this.payAuth = true
                    this.payMethod = method
                }
                else
                    this.payAuth = false
            }
        },
        isValidForm(){
            if (!this.id)
                return false
            if (!this.payShift4 && !this.payAuth)
                return false    
            return true
        },
        isValidToken(method){
            if (method === 'SHIFT4')
            {
                if (this.tokenShift4 != '')
                    return true
            }
            return false
        },
        submitShift4Token(){
            if (!this.testActiveMethods('SHIFT4'))
            {
                let items = {
                    "payMethod": "SHIFT4",
                    "authToken": this.tokenShift4,
                    "authTokenMoto": this.tokenMotoShift4
                }
                this.$ionic.loadingController
                .create({
                    cssClass: 'my-custom-class',
                    message: this.$t('backoffice.titles.loading'),
                    backdropDismiss: true
                })
                .then(loading => {
                    loading.present()
                    setTimeout(() => {  // Some AJAX call occurs
                        payAuthorizeNet.activatePaymentMethod(items)
                        .then(res => {
                            console.log(res)
                            if (res.status == 200 && res.statusText === 'OK')
                            {
                                if (res.data.msg != "error")
                                {
                                    this.getPaymentData()
                                    
                                    this.showToastMessage('Shift4 ' + this.$t('backoffice.form.messages.activatePaymentMethod'), 'success')
                                    this.paymentMethods.push('SHIFT4')
                                    items = {
                                        "_id": this.id,
                                        "PaymentMethods": this.paymentMethods
                                    }
                                    Api.putIn(this.modelName, items)
                                    .then(() => {
                                        this.getPaymentData()
                                        loading.dismiss()
                                    })
                                    .catch(e => {
                                        console.log(e)
                                        loading.dismiss()
                                    })
                                }
                                else
                                {
                                    this.showToastMessage(this.$t('backoffice.form.messages.incorrectToken'), 'danger')
                                    loading.dismiss()
                                }
                            }
                            else{
                                this.showToastMessage(this.$t('backoffice.form.messages.activationMethodError'), 'danger')
                                console.log(res)
                                loading.dismiss()
                            } 
                        })
                        .catch(e => {
                            console.log(e)
                            this.showToastMessage(this.$t('backoffice.form.messages.unexpectedError'), 'danger')
                            loading.dismiss()
                        })
                    })
                })
            }
        },
        activeAuthNet(){
            if (!this.testActiveMethods('AUTH'))
            {
                this.paymentMethods.push('AUTH');
                const items = {
                    "_id": this.id,
                    "PaymentMethods": this.paymentMethods
                }
                this.$ionic.loadingController
                .create({
                    cssClass: 'my-custom-class',
                    message: this.$t('backoffice.titles.loading'),
                    backdropDismiss: true
                })
                .then(loading => {
                    loading.present()
                    setTimeout(() => {  // Some AJAX call occurs
                        Api.putIn(this.modelName, items)
                        .then(() => {
                            this.getPaymentData()
                            this.showToastMessage('Authorize.Net ' + this.$t('backoffice.form.messages.activatePaymentMethod'), 'success')
                            loading.dismiss()
                        })
                        .catch(e => {
                            console.log(e)
                            this.showToastMessage(this.$t('backoffice.form.messages.unexpectedError'), 'danger')
                            loading.dismiss()
                        })
                    })
                })
            }
        },
        save(){
            if (this.payShift4 || this.payAuth)
            {
                console.log(this.payMethod)
                const item = {
                    "_id": this.id,
                    "PayMethod": this.payMethod
                }

                this.$ionic.loadingController
                .create({
                    cssClass: 'my-custom-class',
                    message: this.$t('backoffice.titles.loading'),
                    backdropDismiss: true
                })
                .then(loading => {
                    loading.present()
                    setTimeout(() => {  // Some AJAX call occurs
                         Api.putIn(this.modelName, item)
                        .then(() => {
                            this.showToastMessage(this.$t('backoffice.form.messages.savePaymentMethodSuccess'), "success")
                            loading.dismiss()
                            this.$router.push({
                                name: 'ControlPanel', 
                            });
                        })
                        .catch(e => {
                            console.log(e)
                            this.showToastMessage(this.$t('backoffice.form.messages.savePaymentMethodError'), "error")
                            loading.dismiss()
                        })
                    })
                })
            }
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

<style>

@media only screen and (min-width : 1024px){

    .screen{
        padding-left: 10%;
        padding-right: 10%;
        border: #edf1ee solid 1px;
        margin-right: 10%;
        margin-left: 10%;
        /* border-radius: 25px; */
    }

}

</style>