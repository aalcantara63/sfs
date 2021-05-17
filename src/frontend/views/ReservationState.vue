<template>
    <div id="product" class="product">

           <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start" @click="allReservation()">
              <ion-back-button default-href="home"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
                <h1> Detalles de la Reservación</h1>            
                       
            </ion-label>    
            <ion-chip color="primary" slot="end" @click="sendReservationEmail(reservation)" v-if="clientId !==''" v-tooltip="$t('frontend.tooltips.forward')">
                <span  class="iconify" data-icon="carbon:mail-all" data-inline="false"></span>
                <ion-spinner v-if="spinnerEmail"></ion-spinner>
            </ion-chip>       
            <ion-chip color="primary" slot="end" @click="sendPrint" v-tooltip="$t('frontend.tooltips.printRes')">
                <span class="iconify" data-icon="ic:round-local-printshop" data-inline="false">
            </span></ion-chip>
              
          </ion-toolbar>
        </ion-header>

         <div v-if="spinner1">
            <ion-spinner  name="lines" class="spinner"></ion-spinner>
        </div>

        <v-breakpoint v-if="!spinner1">
            <div slot-scope="scope" style="argin-top: 10px;">

                <span > 
                    <ion-card :style="scope.isSmall || scope.isMedium || scope.noMatch? '' :'width: 80%; margin: 0 auto;'">

                        <p v-if="reservation.CustomerName"> <ion-label class="ion-text-wrap" >
                            <h2  style="width: 100%;float: left;font-size: 16px;
                            text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                            {{$t('frontend.orderType.name')}}:<strong>  {{reservation.CustomerName}} </strong> </h2>
                        </ion-label></p>   

                        <p v-if="reservation.CustomerEmail"> <ion-label class="ion-text-wrap" >
                            <h2  style="width: 100%;float: left;font-size: 16px;
                            text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                            {{$t('frontend.orderType.email')}}:<strong>  {{reservation.CustomerEmail}} </strong> </h2>
                        </ion-label></p>   

                        <p v-if="reservation.CustomerPhone"> <ion-label class="ion-text-wrap" >
                            <h2  style="width: 100%;float: left;font-size: 16px;
                            text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                            {{$t('frontend.orderType.phone')}}:<strong>  {{reservation.CustomerPhone}} </strong> </h2>
                        </ion-label></p>

                        <div v-if="reservation.QuotationPayment">
                            <ion-label class="ion-text-wrap">
                                <h2  style="width: 100%;float: left;font-size: 16px;
                                text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                                    {{$t('frontend.order.payment')}}:  </h2>
                            </ion-label>
                                <h2 v-if="reservation.QuotationPayment" style="width: 100%;float: left;font-size: 16px;
                                text-align: left; padding-left: 40px;color: black;margin: 5px !important;">
                                    {{$t('frontend.order.total')}}: <strong>  {{ getFormatPrice(reservation.QuotationPayment)}} </strong>  |
                                    {{$t('frontend.order.transId')}}: <strong>  {{ reservation.PaymentTransId}} </strong>  |
                                    {{$t('frontend.order.paymentMethod')}}: <strong>  {{ reservation.PaymentMethod}} - </strong>  </h2>
                        </div>

                       
                         
                      
                        
                        
                                                     
                        <ion-item-divider style="margin-bottom: 15px;"/>


                        <ion-label class="ion-text-wrap col-md-12">                      
                            <strong  class="state-menu" style="padding: 10px"
                            :key="key1"
                            :style="
                                reservation.State===0 ? 'background: #edeb3038' // solicitada
                                :reservation.State===1 || reservation.State===2 ? 'background: #e8d21652' // aceptada o changedHour
                                :reservation.State=== 3 || reservation.State=== 5 ?'background:#ff00001f' //cancelada
                                : reservation.State===4 ? 'background:#1ee81652' // confirmada  
                                : reservation.State===6 ? 'background: #71676738' // carrada
                                :'background: '"
                            >
                                {{$t('frontend.home.state')}}: {{valEstate}}
                                <span>
                                    <ion-icon v-if="reservation.State === 0 && !spinner" name="refresh" @click="chargeReservation(),getReservations()" color="success" size="large" style="top: 10px;position: relative;" v-tooltip="$t('frontend.tooltips.refreshOrder')"> </ion-icon> 
                                    <span v-if="!spinner && reservation.State === 0 " style="font-size: 9px; display: contents;" color="success">{{$t('frontend.menu.refresh')}}</span>  
                               
                                </span>
                               <ion-spinner v-if="spinner" name="lines"  color="success" style="top: 10px;position: relative;"></ion-spinner>                           
                            </strong>                               
                        </ion-label>

                       <br>

                        <ion-label class="ion-text-wrap" v-if="showStates ===6 && reservation.CancelNote">                      
                            <strong  class="state-menu" :style="reservation.State===6 ? 'padding: 10px;background:rgb(255 0 0 / 43%)' : ''">
                                {{$t('frontend.order.cancelReason')}}: {{reservation.CancelNote}}
                            </strong> 
                        </ion-label>

                        <ion-item-divider/>   

                        <p v-if="reservation.Date"> <ion-label class="ion-text-wrap" >
                            <h2  style="width: 100%;float: left;font-size: 16px;
                            text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                            {{$t('frontend.reservation.reservationDate')}}:<strong>  {{getReservationDate(reservation.Date)}} </strong> </h2>
                        </ion-label></p>     

                        <p v-if="reservation.Hour"> <ion-label class="ion-text-wrap" >
                            <h2  style="width: 100%;float: left;font-size: 16px;
                            text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                            {{$t('frontend.reservation.reservationHour')}}:<strong>  {{getReservationHour(reservation.Hour)}} </strong> </h2>
                        </ion-label></p>

                         <p v-if="reservation.Capacity"> <ion-label class="ion-text-wrap" >
                            <h2  style="width: 100%;float: left;font-size: 16px;
                            text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                            {{$t('frontend.reservation.peoples')}}:<strong>  {{reservation.Capacity}} </strong> </h2>
                        </ion-label></p>

                        <p v-if="reservation.Reason"> <ion-label class="ion-text-wrap" >
                            <h2  style="width: 100%;float: left;font-size: 16px;
                            text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                            {{$t('frontend.reservation.reason')}}:<strong>  {{reservation.Reason}} </strong> </h2>
                        </ion-label></p>

                        <p v-if="reservation.Note"> <ion-label class="ion-text-wrap" >
                            <h2  style="width: 100%;float: left;font-size: 16px;
                            text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                            {{$t('frontend.order.notes')}}:<strong>  {{reservation.Note}} </strong> </h2>
                        </ion-label></p>

                        
                         <p v-if="reservation.Code"> <ion-label class="ion-text-wrap" >
                            <h2  style="width: 100%;float: left;font-size: 16px;
                            text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                            {{$t('frontend.reservation.code')}}:<strong>  {{reservation.Code}} </strong> </h2>
                        </ion-label></p>

                        <p v-if="reservation.QuotationPayment"> <ion-label class="ion-text-wrap" >
                            <h2  style="width: 100%;float: left;font-size: 16px;
                            text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                            {{$t('frontend.order.quotationPayment')}}:<strong> $  {{reservation.QuotationPayment.toFixed(2)}} </strong> </h2>
                        </ion-label></p>

                         <p v-if="reservation.restaurantNotes"> <ion-label class="ion-text-wrap" >
                            <h2  style="width: 100%;float: left;font-size: 16px;
                            text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                            {{$t('frontend.reservation.restaurantNotes')}}:<strong>  {{reservation.restaurantNotes}} </strong> </h2>
                        </ion-label></p>

                    </ion-card>

                    <ion-card :style="scope.isSmall || scope.isMedium || scope.noMatch? '' :'width: 80%; margin: 0 auto;'" v-if="configuration.hasReservationQuotation && configuration.payForReservationQuotation > 0 && (reservation.State === 1 || reservation.State === 2)"> 
             
                        <ion-label class="ion-text-wrap" >
                                <p class="titles-order" style="text-align: left;color: red">{{$t('frontend.order.quotationMessage1') + getFormatPrice(configuration.payForReservationQuotation) +' ' + $t('frontend.order.quotationMessage2')}}  </p> 
                        </ion-label>

                        <ion-item >
                            <h2 style=" float: left;text-align: left;padding: 0;color: red" class="subtitles-order menu-col-4">{{$t('frontend.order.pay')}}: {{getFormatPrice(configuration.payForReservationQuotation)}}                                    
                            </h2> 
                        </ion-item>
                                        
                    </ion-card>  

                    
                    <ion-card  style="padding: 0 10px" 
                    v-if="reservation.State === 1 || reservation.State === 2" >
                       
                        <ion-button color="danger" @click="cancelReservation">Cancelar</ion-button>
                        <ion-button v-if="!spinner2" color="primary" @click="confirmReservation" >                           
                            Confirmar
                             <ion-spinner v-if="spinnerPayment" name="lines-small"></ion-spinner>
                            </ion-button>
                        <ion-spinner v-if="spinner2" name="lines-small"  color="success" style="top: 10px;position: relative;"></ion-spinner>                           

                                        
                    </ion-card>
                    
                </span>

                
            </div>
        </v-breakpoint>

        


    </div>
</template>

<script>
// import Stepper from '../components/Stepper'
import { add } from "ionicons/icons";
import { addIcons } from "ionicons";
import { VBreakpoint } from 'vue-breakpoint-component'
import { Api } from '../../backoffice/api/api.js';
import moment from 'moment-timezone';
 import { EventBus } from '../event-bus';
 import PaymentSplited from '../components/PaymentSplited'

addIcons({
  "ios-add": add.ios,
  "md-add": add.md
});

export default {
    name: 'ReservationState', 
    components:{
        VBreakpoint: VBreakpoint
    },
     props:{          
        restaurantSelectedId: {type: String, default:"" } ,
     }, 
    created: function(){
            
        this.reservation = this.$route.params.reservation;
        this.configuration = this.$store.state.configuration;
        this.restaurantActive = this.$store.state.restaurantActive

        if( this.$route.params.fromMyAccount)
            this.fromMyAccount = this.$route.params.fromMyAccount;

        if( this.$route.params.currentPageReservation > 1)
            this.currentPageReservation = this.$route.params.currentPageReservation;

        this.valEstate = this.allState[this.reservation.State];  

               
        
    }, 
    data() {
        return {
            parent: this,
            showStates: '',              
            currentState: this.showStates,
            valEstate:'',
            date: '',
           spinner: false,
            spinner1: false,
            spinner2: false,
            key:0,  
            key1: 0, 
            allState : [this.$t('frontend.reservation.state0'), this.$t('frontend.reservation.state1'),
                    this.$t('frontend.reservation.state2'), this.$t('frontend.reservation.state3'),
                    this.$t('frontend.reservation.state4'), this.$t('frontend.reservation.state5'),
                    this.$t('frontend.reservation.state6')],
            cardNumber:'',
            cardCode: '',
            expirationCard:'',
            dateTodaymin: new Date().toISOString().substr(0, 7),
            dateTodaymax:  new Date().getFullYear(),
            fromMyAccount: '',
            currentPageReservation: 1,
            configuration: {},
            restaurantActive: {},
            googleData: {},
            spinnerPayment: false,
            spinnerEmail: false,
        }
    },
    computed:{
         
    },
 
    methods:{    
     
        async cancelReservation(){
            this.reservation.State = 5
            this.spinner = true;
            await Api.putIn('Reservation', this.reservation);
            this.chargeReservation();
        },

         async confirmReservation(){

            if(this.configuration.hasReservationQuotation && this.configuration.payForReservationQuotation > 0){
                this.spinnerPayment = true;
                await this.getWalletInformation();
                this.spinnerPayment = false;
                return this.openPayment();
            }
            else{
                this.reservation.State = 4
                this.spinner = true;
                await Api.putIn('Reservation', this.reservation);
                this.sendReservationEmail(this.reservation);
                this.getReservations();
                this.chargeReservation();
                this.spinner = false;
            }

            
        },

        async openPayment(){
                return this.$ionic.modalController
            .create({
                component: PaymentSplited,
                cssClass: 'my-custom-class',
                componentProps: {
                data: {
                    content: 'New Content',
                },
                propsData: {  
                    parent:this,
                    order: {
                        Total: this.configuration.payForReservationQuotation.toFixed(2),
                        Taxe: "1.00",
                        Tip: 0,
                        SubTotal: this.configuration.payForReservationQuotation.toFixed(2),
                        Products: []
                    },             
                    Acept: this.$t('frontend.home.acept'),
                    Cancel: this.$t('frontend.home.cancel'),
                    Total: this.configuration.payForReservationQuotation.toFixed(2),
                    Tax:  "1.00",
                    TaxName: '',     
                    restaurantId: this.restaurantSelectedId,
                    payMethod: this.restaurantActive.payMethod  ,                
                    errorPaymentHeader: this.$t('frontend.order.transictionTitle'),
                    errorPaymentMss: this.$t('frontend.order.transictionError'),
                    gooPaymentHeader: this.$t('frontend.order.transictionTitle'),
                    gooPaymentMss: this.$t('frontend.order.transictionOk'),
                    notValidEmail: this.$t('frontend.home.notValidEmail'),
                    codeNotValid: this.$t('frontend.home.zipCodeNotValid'),
                    notValidCC: this.$t('frontend.order.notValidCC'),
                    dataRequired: this.$t('frontend.home.errorRequired'),
                    paymentByCard: this.$t('frontend.order.paymentByCard'),
                    totalForPay: this.$t('frontend.order.totalForPay'),
                    currency: this.restaurantActive.currency,
                    ccard: this.$t('frontend.order.ccard'),
                    expcard: this.$t('frontend.order.expcard'),
                    ccode: this.$t('frontend.order.ccode'),
                    cityText: this.$t('frontend.home.city'),
                    stateText: this.$t('frontend.home.state'),
                    firstNameText: this.$t('frontend.order.firstName'),
                    lastNameText: this.$t('frontend.order.lastName'),
                    postalCode: this.$t('frontend.order.postalCode'),
                    addressLine1: this.$t('frontend.order.addressLine1'),
                    payText: this.$t('frontend.order.pay'),
                    verifyText: this.$t('frontend.order.verify'),
                    returnTo: 'ReservationState',
                    qrPayment: this.$t('frontend.payment.qrPayment'),
                    cardPayment: this.$t('frontend.payment.tjtPayment'),
                    cashPayment: this.parent.$t('frontend.payment.cashPayment'),
                    googleData: this.googleData,
                    doingPayment: this.$t('frontend.payment.doingPayment'),
                    staffName: '',
                    deviceTransactionType: '01',
                    deviceData: {
                        'amountInformation': {
                                'TransactionAmount': this.configuration.payForReservationQuotation.toFixed(2),
                                'TipAmount': 0,
                                'TaxAmount': "1.00",
                            },
                            'accountInformation':{
                                'FirstName': this.reservation.CustomerName
                            },
                            'traceInformation':{
                                'TransactionNumber': ''
                            }
                    },                   
                    shareText1: this.$t('frontend.payment.shareText1a'),
                    shareText2: this.$t('frontend.payment.shareText2'),
                    customerName: this.reservation.CustomerName,
                    restaurantName: this.restaurantActive.restaurantName,

              },
                },
            })
            .then(m => m.present())
        
        },

        async makeSplitPayment(res){  

            try {
                this.spinner2 = true;

                this.reservation.QuotationPayment = this.configuration.payForReservationQuotation; 
                this.reservation.State = 4;    
                this.reservation.PaymentTransId = res.transId;            
                this.reservation.PaymentMethod =res.method + ' '+ res.accountType+ ' '+ res.accountNumber;            
                this.reservation.accountNumber = res.accountNumber;   
                this.reservation.expirationCard = res.expirationCard ; 
                const response = await Api.putIn('Reservation', this.reservation);
                if(response.status === 200 && response.statusText === "OK"){
                    this.chargeReservation(); 
                    this.getReservations();
                    this.sendReservationEmail(this.reservation);
                    this.spinner2 = false;
                   
                   const paymentEntry = {                       
                        "Method": res.method,
                        "Payment": res.total,
                        "InvoiceNumber": res.transId,
                        "ModelId": response.data._id,
                        "ModelFrom": "Reservation"                   
                   }
                   await Api.postIn('allpayments', paymentEntry);
                }
                
            } catch (error) {            
                console.log(error)
                this.spinner = false;
            }
        
        },
       
        chargeReservation(){
            this.key1 ++;
           const allState = [this.$t('frontend.reservation.state0'), this.$t('frontend.reservation.state1'),
                    this.$t('frontend.reservation.state2'), this.$t('frontend.reservation.state3'),
                    this.$t('frontend.reservation.state4'), this.$t('frontend.reservation.state5'),
                    this.$t('frontend.reservation.state6')]

            this.spinner = true;
            Api.fetchById('Reservation', this.reservation._id).then(response => {
                if(response.status === 200){ 
                    this.key++;          
                    this.reservation = response.data;               
                    this.showStates = this.reservation.State;
                    this.valEstate = allState[this.showStates];
                    this.currentState = this.valEstate;
                    this.spinner = false;
                                }                   
        })
        .catch(e => {
        this.spinner = false;
         return  this.$ionic.alertController
            .create({
                cssClass: 'my-custom-class',
                header: 'Error',
                message: e,
                buttons: [                   
                {
                    text: this.buttonAcept,
                    handler: () => {                                 
                                  
                    },
                },
                ],
            })
            .then(a => a.present())
        });

        },

        allReservation: function(){
            if(this.fromMyAccount === '')
                 return this.$router.push({ name: 'Reservation', params: {showAllReservation: true, currentPageReservation: this.currentPageReservation } }) 
            else 
                return this.$router.push({ name: 'Myaccount', params: { fromMyAccount: this.fromMyAccount, currentPageReservation: this.currentPageReservation } })  
        },

        getReservationDate(thisDate){
        return  moment.tz(thisDate, moment.tz.guess()).format('MM-DD-YYYY') 
        },

        getReservationHour(thisHour){
            return  moment.tz(thisHour, moment.tz.guess()).format('hh:mm A') 
        },
    
        sendPrint:  function(){

            var html =' <html><head>';    
            html +='<style> .progressBar { width: 100%;  border-bottom: 1px solid black;display: list-item;list-style: unset; padding: 0}';
            html += '.progressBar li {list-style-type: none; float: left; position: relative; text-align: center; margin:0}';
            html += '.progressBar li .before {content: " "; line-height: 30px; border-radius: 50%; width: 30px; height: 30px; border: 1px solid #ddd;';
            html += 'display: block;text-align: center;margin: 0 auto 10px;background-color: white}';
            html += '.progressBar li .after { content: "";position: absolute;width: 100%;height: 4px;background-color: #ddd;top: 15px;left: -50%;z-index: -1;}';
            html += '.progressBar li .one .after {content: none;}.progressBar li.active {color: black;}';
            html += '.progressBar li.active .before { border-color: #63ee68; background-color: #63ee68}.progressBar .active:after {background-color: #4ca44f;} </style>';
            
            html += '</head><body><div >';
            html += '<table  align=center style="width: 90%;">';
            html += '<tr><td colspan=6 style="text-align: center;">';
            html += `<h2>${this.$t('frontend.reservation.reservationDetail')}</h2>  `;
            html +=`</td>`;     
            html += `</tr>`; 
             html += '<tr><td colspan=6 style="text-align: center;">';
            html += `<h4>${this.restaurantActive.restaurantName}</h4>  `;       
            html += `<img src="${this.restaurantActive.restaurantLogo}" style="max-width: 100px;"></img> `;     
            html +=`</td></tr>`;         
            html += '<tr><td colspan=6 >'
            if(this.reservation.CustomerName)
              html += `<h4> ${this.$t('frontend.orderType.name')}: ${this.reservation.CustomerName}</h4>`;
            if(this.reservation.CustomerEmail)
              html += ` <h4> ${this.$t('frontend.orderType.email')}: ${this.reservation.CustomerEmail}</h4>`;
            if(this.reservation.CustomerPhone)
              html += ` <h4> ${this.$t('frontend.orderType.phone')}: ${this.reservation.CustomerPhone}</h4>`;
            if(this.reservation.Capacity)
              html += ` <h4> ${this.$t('frontend.reservation.peoples')}: ${this.reservation.Capacity}</h4>`;
            if(this.reservation.Date)
              html += ` <h4> ${this.$t('frontend.reservation.reservationDate')}: ${this.getReservationDate(this.reservation.Date)}</h4>`;
            if(this.reservation.Hour)
              html += ` <h4> ${this.$t('frontend.reservation.reservationHour')}: ${this.getReservationHour(this.reservation.Hour)}</h4>`;
            if(this.reservation.Note)
              html += ` <h4> ${this.$t('frontend.order.notes')}: ${this.reservation.Note}</h4>`;
            if(this.reservation.Reason)
              html += ` <h4> ${this.$t('frontend.reservation.reason')}: ${this.reservation.Reason}</h4>`;
            if(this.reservation.State)
              html += ` <h4> ${this.$t('frontend.home.state')}: ${this.allState[this.reservation.State]}</h4>`;
            if(this.reservation.Code)
              html += ` <h4> ${this.$t('frontend.reservation.code')}: ${this.reservation.Code}</h4>`;
            if(this.reservation.QuotationPayment)
              html += `<h4> ${this.$t('frontend.order.quotationPayment')}:$ ${this.reservation.QuotationPayment.toFixed(2)}</h4>`;

           
            html += `</td></tr>`;      
           
            html += `</table></div></body></html>`;


            var winimp = window.open('/print', 'popimpr');         
            winimp.document.write( html );
            winimp.document.close();
            winimp.focus();
            winimp.print();
            winimp.close();
         },

        async sendReservationEmail(reservation){

            this.spinnerEmail = true
           
            var html =' <html><head>';    
            html +='<style> .progressBar { width: 100%;  border-bottom: 1px solid black;display: list-item;list-style: unset; padding: 0}';
            html += '.progressBar li {list-style-type: none; float: left; position: relative; text-align: center; margin:0}';
            html += '.progressBar li .before {content: " "; line-height: 30px; border-radius: 50%; width: 30px; height: 30px; border: 1px solid #ddd;';
            html += 'display: block;text-align: center;margin: 0 auto 10px;background-color: white}';
            html += '.progressBar li .after { content: "";position: absolute;width: 100%;height: 4px;background-color: #ddd;top: 15px;left: -50%;z-index: -1;}';
            html += '.progressBar li .one .after {content: none;}.progressBar li.active {color: black;}';
            html += '.progressBar li.active .before { border-color: #63ee68; background-color: #63ee68}.progressBar .active:after {background-color: #4ca44f;} </style>';
            
            html += '</head><body><div >';
            html += '<table  align=center style="width: 90%;">';
             html += '<tr><td colspan=6 style="text-align: center;">';
            html += `<h2>${this.restaurantName}</h2>  `;
            html += `<img src="${this.restaurantActive.restaurantLogo}" style="max-width: 100px;"></img> `;     
            html +=`</td>`;     
            html += `</tr>`;
            html += '<tr><td colspan=6 style="text-align: center;">';
            html += `<h2>${this.$t('frontend.reservation.create')}</h2>  `;
            html +=`</td>`;     
            html += `</tr>`;          
            html += '<tr><td colspan=6 >'
            if(reservation.CustomerName)
              html += `<h4> ${this.$t('frontend.orderType.name')}: ${reservation.CustomerName}</h4>`;
            if(reservation.CustomerEmail)
              html += ` <h4> ${this.$t('frontend.orderType.email')}: ${reservation.CustomerEmail}</h4>`;
            if(reservation.CustomerPhone)
              html += `<h4> ${this.$t('frontend.orderType.phone')}: ${reservation.CustomerPhone}</h4>`;
            if(reservation.Capacity)
              html += ` <h4> ${this.$t('frontend.reservation.peoples')}: ${reservation.Capacity}</h4>`;
            if(reservation.Date)
              html += `<h4> ${this.$t('frontend.reservation.reservationDate')}: ${this.getReservationDate(reservation.Date)}</h4>`;
            if(reservation.Hour)
              html += ` <h4> ${this.$t('frontend.reservation.reservationHour')}: ${this.getReservationHour(reservation.Hour)}</h4>`;
            if(reservation.Note)
              html += ` <h4> ${this.$t('frontend.order.notes')}: ${reservation.Note}</h4>`;
            if(reservation.Reason)
              html += `<h4> ${this.$t('frontend.reservation.reason')}: ${reservation.Reason}</h4>`;
            if(reservation.QuotationPayment)
              html += `<h4> ${this.$t('frontend.order.quotationPayment')}: $ ${reservation.QuotationPayment}</h4>`;
            if(reservation.restaurantNotes)
              html += `<h4> ${this.$t('frontend.reservation.restaurantNotes')}: ${reservation.restaurantNotes}</h4>`;


              
           
            html += `</td></tr>`; 
            html += '<tr> <td colspan=6 align="center"  style="border-bottom: 1px solid grey;">';
            html += `<a href="mailto:${this.restaurantActive.restaurantEmail}" style="margin: 0 10px;"><img style="width: 32px;" src="https://storagemenusuccess.blob.core.windows.net/logo/email-icon.png"></img> </a>`;
            if(this.restaurantActive.restaurantFacebok)
                html += `<a href="${this.restaurantActive.restaurantFacebok}" style="margin: 0 10px;"><img style="width: 32px;" src="https://storagemenusuccess.blob.core.windows.net/logo/Facebook-icon.png"></img> </a>`;
            if(this.restaurantActive.restaurantInstagram)
                html += `<a  href="${this.restaurantActive.restaurantInstagram}" style="margin: 0 10px;"><img style="width: 32px;"  src="https://storagemenusuccess.blob.core.windows.net/logo/instagram-icon.png"></img> </a>`;
            if(this.restaurantActive.restaurantTwitter)
                html += `<a href="${this.restaurantActive.restaurantTwitter}" style="margin: 0 10px;"><img style="width: 32px;"  src="https://storagemenusuccess.blob.core.windows.net/logo/Twitter-icon.png"></img> </a>`;
            if(this.restaurantActive.restaurantYoutube)
                html += `<a href="${this.restaurantActive.restaurantYoutube}" style="margin: 0 10px;"><img style="width: 32px;"  src="https://storagemenusuccess.blob.core.windows.net/logo/Youtube-icon.png"></img> </a>`;
        
        html += '</td></tr>'     
           
            html += `</table></div></body></html>`;

            let subject = this.$t('frontend.reservation.create')+' ' + this.$t('frontend.reservation.state4') ;
            
                    
            var items = {
                "email": reservation.CustomerEmail,
                "mess": html,
                "subject": subject
            }
            await Api.sendEmail(items);
            this.spinnerEmail = false;
        },

        async errorPaymentDetail(msg) {
            return this.$ionic.toastController      
            .create({
                header:'Error',
                message:  msg,
                duration: 5000,
                position: 'middle',
                color:'danger'
                })
            .then(a => a.present())
         },

        alertRequiredDatas(mss){
            return  this.$ionic.alertController
            .create({
                cssClass: 'my-custom-class',
                header: 'Error',
                message: this.$t('frontend.home.errorRequired') + ': ' + mss,
                buttons: [                   
                {
                    text: this.$t('frontend.home.acept'),
                    handler: () => {  
                    },
                },
                ],
            })
            .then(a => a.present())                        
        },

        validateCard(event){
            var valid = require("card-validator");
    
            var numberValidation = valid.number(event);
    
            if (!numberValidation.isValid) {
                this.cardNumber = ""
                return  this.$ionic.alertController
                    .create({
                        cssClass: 'my-custom-class',
                        header: 'Error',
                        message: this.$t('frontend.order.notValidCC'),
                        buttons: [                   
                        {
                            text: this.$t('frontend.home.acept'),
                            handler: () => {                                 
                                            
                            },
                        },
                        ],
                    })
                    .then(a => a.present())
                        }
    
            else {
            this.cardNumber = event;
            }  
        
        },

        getReservations: async function(){ 
            await Api.getCustomerReservations(this.reservation.CustomerId)
            .then(response => {
                this.$store.commit('setAllReservations', response.data)
                this.allReservations = response.data; 
                EventBus.$emit('updateAllReservationsInParent', response.data); 
            })
            .catch(e => {             
                console.log(e);            
            })  
        },

        getFormatPrice(price){
            let result = price
            if(this.currency !== '')
            result = new Intl.NumberFormat('en', {style: "currency", currency: this.restaurantActive.currency} ).format(price);
            return result;
        },

    async getWalletInformation(){
      const  newT =  parseInt( this.configuration.payForReservationQuotation.toFixed(2).replace('.', ''));
      const basket = {"invoice": 666, "total": newT };       
      
     
      const ipClient = await Api.getClientIp();
      const res = await Api.walletInformation(basket, this.restaurantSelectedId, ipClient.data.ip); 
      if(res.status === 200 && res.statusText === "OK"){
               
        this.googleData.merchantId = res.data.walletConfig.merchantID.toString();  
        this.googleData.gateway = res.data.walletConfig.googlePay.gateway;           
        this.googleData.allowedAuthMethods= res.data.walletConfig.googlePay.allowedAuthMethods;         
        this.googleData.allowedCardNetworks= res.data.walletConfig.googlePay.allowedCardNetworks;  
        this.googleData.currencyCode =res.data.walletConfig.currencyCode; 
        this.googleData.countryCode =res.data.walletConfig.countryCode;      
        
      }      
      
    
    },

        

  }, 


 



 

}
</script>

<style >

.percent-payment{
    width: 25%;
    float: left;
    font-weight: 800;
}
.range-pin::before{
    content:"hola hola"
}
    .state-ship ion-chip{
        padding: 0 15px;
        border: 1px solid gray;
        margin: 0 10px;
    }

.titles-order{
    font-size: 20px !important;
    font-weight: bold !important;
    text-align: left;
    padding: 10px;
    position: inherit;
    color: black;    
    }
    .menu-col-3{
        flex: 0 0 calc(calc(3 / var(--ion-grid-columns, 12)) * 100%);
        width: calc(calc(3 / var(--ion-grid-columns, 12)) * 100%);
        max-width: calc(calc(3 / var(--ion-grid-columns, 12)) * 100%);
        text-align: left;
    }
    .menu-col-8{
        flex: 0 0 calc(calc(8 / var(--ion-grid-columns, 12)) * 100%);
        width: calc(calc(8 / var(--ion-grid-columns, 12)) * 100%);
        max-width: calc(calc(8 / var(--ion-grid-columns, 12)) * 100%);
        text-align: left;
    }
    .menu-col-4{
        flex: 0 0 calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
        width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
        max-width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
        text-align: left;
    }
    .menu-col-6{
        flex: 0 0 calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
        width: calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
        max-width: calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
        text-align: left;
    }
    .menu-col-2{
        flex: 0 0 calc(calc(2 / var(--ion-grid-columns, 12)) * 100%);
        width: calc(calc(2 / var(--ion-grid-columns, 12)) * 100%);
        max-width: calc(calc(2 / var(--ion-grid-columns, 12)) * 100%);
        text-align: left;
    }
    .menu-bold-title{
        padding-right: 15px;
    }
    .state-menu{
        width: 100%;
        float: left;
        font-size: 16px;
        text-align: left; 
        padding-left: 20px;
        color: black;
    }

</style>