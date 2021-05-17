<template>
    
    <div class="screen">
        <ion-backdrop v-if="isBackdrop"></ion-backdrop>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'ControlPanel'})"></ion-back-button>
                </ion-buttons>
                <ion-label style="padding: 20px 100px;">
                <h1>{{title}}</h1>            
                </ion-label>
            </ion-toolbar>
        </ion-header>
        <br/>

    <div v-if="spinner">
        <ion-spinner name="lines" class="spinner"></ion-spinner>
    </div>
    <div v-else>
        <ion-item>
            <ion-label>{{$t('backoffice.form.titles.eposConfiguration')}}</ion-label>    
        </ion-item> 
        <ion-item>
              <ion-label>{{$t('backoffice.form.fields.epos')}}</ion-label>
              <ion-checkbox slot="end" name="eposIntegrate" 
                @ionChange="eposIntegrate = $event.target.checked"
                :checked="eposIntegrate"  >    
              </ion-checkbox>
        </ion-item>
        <div v-if="eposIntegrate">
            <ion-item>
                <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.endPointUrl')}}</ion-label>
                <ion-input type="text" name="ePosEndPointUrl"
                @input="ePosEndPointUrl = $event.target.value" 
                v-bind:value="ePosEndPointUrl">
                </ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.eposToken')}}</ion-label>
                <ion-input :type="showePosToken" name="eposToken"
                @input="eposToken = $event.target.value" 
                v-bind:value="eposToken">
                </ion-input>
                <ion-chip slot="end" color="primary" outline="true" @click="changeePosToken()"><ion-icon name="eye"></ion-icon></ion-chip>
            </ion-item>
        </div>
        <br/>
        <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="saveSetting()">{{ $t('backoffice.form.buttons.save') }}</ion-button>

    </div>
    </div>
</template>

<script>
    import { Api } from '../api/api.js';

    export default {
        
        name: 'keySettingForm',
        data () {
            return {
                modelName: 'Restaurant',
                id: null,
                endPointUrl : '',
                apiLoginId: '',
                transactionKey:'',
                // smtpHost: '',
                // port: 0,
                // secure: false,
                // email: '',
                // password: '',
                // twFromNumber: '',
                // twAccountSid: '',
                // twToken: '',
                eposIntegrate: false,
                ePosEndPointUrl: '',
                eposToken: '',


                showApiLoginId: "password",
                showTransactionKey: "password",
                // showTwAccountSid: "password",
                // showTwToken: "password",
                showePosToken: "password",

                isBackdrop: false,

                spinner: false,
            }
        },
        created: function(){
            this.id = this.$route.params.settingId;
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
                        .then(response => {
                            console.log(response);
                            this.endPointUrl = response.data.EndPointUrl;
                            this.apiLoginId = response.data.ApiLoginId;
                            this.transactionKey = response.data.TransactionKey;
                            // this.smtpHost = response.data.SmtpHost;
                            // this.port = response.data.Port;
                            // this.secure = response.data.Secure;
                            // this.email = response.data.EmailHost;
                            // this.password = response.data.Password;
                            // this.twFromNumber = response.data.TwFromNumber;
                            // this.twAccountSid = response.data.TwAccountSid;
                            // this.twToken = response.data.TwToken;
                            if (response.data.EposIntegrate == true)
                            {
                                this.eposIntegrate = true;
                                this.ePosEndPointUrl = response.data.EPosEndPointUrl;
                                this.eposToken = response.data.EposToken;
                            }
                            
                            loading.dismiss();
                            return response;
                        })
                        .catch(e => {
                            console.log(e);
                            loading.dismiss();
                        })
                    })
                })   
            }
        },
        computed: {
            title() {
                return this.id ? this.$t('backoffice.form.titles.keySettingEditTitle') :  this.$t('backoffice.form.titles.keySettingNewTitle');
            }
        },
        methods: {
            ifErrorOccured(action){
                return this.$ionic.alertController.create({
                    title: this.$t('backoffice.list.messages.connectionError'),
                    message: this.$t('backoffice.list.messages.connectionErrorMessage'),
                    buttons: [
                        {
                        text: this.$t('backoffice.list.messages.buttons.goToAdministration'),
                        handler: () => {
                            this.$router.push({
                                name: 'ControlPanel',
                            });
                        }
                        },
                        {
                        text: this.$t('backoffice.list.messages.buttons.retry'),
                        handler: () => {
                            action();
                        }
                        }
                    ]
                    })
                    .then(a => a.present());
            },
            isValidForm(){
                // let errors = [];
                if (this.endPointUrl == "")
                {
                    // errors.push(this.$t('backoffice.form.validate.endPointUrl'));
                    return false
                }
                if (this.apiLoginId == "")
                {
                    // errors.push(this.$t('backoffice.form.validate.apiLoginId'));
                    return false
                }
                if (this.transactionKey == "")
                {
                    // errors.push(this.$t('backoffice.form.validate.transactionKey'));
                    return false
                }
                // if (this.smtpHost == "")
                // {
                //     // errors.push(this.$t('backoffice.form.validate.smtpHost'));
                //     return false
                // }
                // if (this.email == "")
                // {
                //     // errors.push(this.$t('backoffice.form.validate.email'));
                //     return false
                // }
                // if (this.password == "")
                // {
                //     // errors.push(this.$t('backoffice.form.validate.password'));
                //     return false
                // }
                // if (this.twFromNumber == "")
                // {
                //     // errors.push(this.$t('backoffice.form.validate.twFromNumber'));
                //     return false
                // }
                // if (this.twAccountSid == "")
                // {
                //     // errors.push(this.$t('backoffice.form.validate.twAccountSid'));
                //     return false
                // }
                // if (this.twToken == "")
                // {
                //     // errors.push(this.$t('backoffice.form.validate.twToken'));
                //     return false
                // }

                if (this.eposIntegrate)
                {
                    if (this.ePosEndPointUrl == '' || this.eposToken == '')
                        return false
                }

                return true

                // if (errors.length > 0)
                // {
                //     let message = "";
                //     for (let i = 0; i < errors.length; i++) {
                //         message += (i + 1) + "- " + errors[i] + "<br/>";
                //     }
                //     // this.ShowMessage(this.$t('backoffice.form.validate.validate'),
                //     //                 message, this.$t('backoffice.form.validate.validateSetting'));
                //     this.showToastMessage(message, "danger");
                //     return false;
                // }
                // else
                // {
                //     return true;
                // }
            },
            ShowMessage(type, message, topic='') {
                return this.$ionic.alertController
                .create({
                    cssClass: 'my-custom-class',
                    header: type,
                    subHeader: topic,
                    message: message,
                    buttons: [this.$t('backoffice.form.messages.buttons.ok')],
                })
                .then(a => a.present())
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
            // changeApiLoginId(){
            //     if (this.showApiLoginId == "password")
            //         this.showApiLoginId = "text"
            //     else
            //         this.showApiLoginId = "password"
            // },
            // changeTransactionKey(){
            //     if (this.showTransactionKey == "password")
            //         this.showTransactionKey = "text"
            //     else
            //         this.showTransactionKey = "password"
            // },
            // changeTwAccountSid(){
            //     if (this.showTwAccountSid == "password")
            //         this.showTwAccountSid = "text"
            //     else
            //         this.showTwAccountSid = "password"
            // },
            // changeTwToken(){
            //     if (this.showTwToken == "password")
            //         this.showTwToken = "text"
            //     else
            //         this.showTwToken = "password"
            // },
            changeePosToken(){
                if (this.showePosToken == "password")
                    this.showePosToken = "text"
                else
                    this.showePosToken = "password"
            },
            saveSetting: function(){

                if (this.isValidForm()){
                    this.isBackdrop = true;
                    let item = {
                        "EndPointUrl": this.endPointUrl,
                        "ApiLoginId": this.apiLoginId,
                        "TransactionKey": this.transactionKey,
                        // "SmtpHost": this.smtpHost,
                        // "Port": this.port,
                        // "Secure": this.secure,
                        // "EmailHost": this.email,
                        // "Password": this.password,
                        // "TwFromNumber": this.twFromNumber,
                        // "TwAccountSid": this.twAccountSid,
                        // "TwToken": this.twToken,
                        "EposIntegrate": this.eposIntegrate
                    }
                    if (this.eposIntegrate)
                    {
                        item["EPosEndPointUrl"] = this.ePosEndPointUrl
                        item["EposToken"] = this.eposToken
                    }
                    //If I am editing
                    if (this.id){
                    item['_id'] = this.id;
                    console.log(item);
                    this.spinner = true;
                    Api.putIn(this.modelName, item)
                        .then(response => {
                                // alert("Success edited");
                                // this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
                                //     this.$t('backoffice.list.messages.messageEditSuccessSetting'), 
                                //         this.$t('backoffice.list.messages.titleEditSetting'));
                                this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessSetting'), "success");
                                this.spinner = false;
                                this.$router.push({
                                    name: 'ControlPanel', 
                                });
                                return response;
                        })
                        .catch(e => {
                            this.isBackdrop = false;
                            console.log(e);
                            this.spinner = false;
                            this.ifErrorOccured(this.saveSetting);
                        })
                    }
                    else{
                    //Else, I am created a new category
                    this.spinner = true;
                    Api.postIn(this.modelName, item)
                        .then(response => {
                            // this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
                            //         this.$t('backoffice.list.messages.messageCreateSuccessSetting'), 
                            //             this.$t('backoffice.list.messages.titleCreateSetting'));
                            this.showToastMessage(this.$t('backoffice.list.messages.messageCreateSuccessSetting'), "success");
                            this.spinner = false;
                            this.$router.push({
                                name: 'ControlPanel', 
                            });
                            return response;
                        })
                        .catch(e => {
                            this.isBackdrop = false;
                            console.log(e);
                            this.spinner = false;
                            this.ifErrorOccured(this.saveSetting);
                        })
                    }

                }
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