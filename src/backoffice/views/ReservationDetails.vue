<template>
    <div id="product" class="screen">

           <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start" @click="$router.push({ name: 'ReservationBackoffice', params: {showAllReservation: true } })">
              <ion-back-button default-href="home"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
                <h1> Detalles de la Reservación</h1>            
                       
            </ion-label>           
            <ion-chip color="primary" slot="end" @click="sendPrint">
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
                               <ion-icon v-if="reservation.State ===0 && !spinner" name="refresh" @click="chargeReservation" color="success" size="large" style="top: 10px;position: relative;"> </ion-icon>  
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

                        <ion-item>
                            <ion-label style="color: red" v-if="reservation.State == 0">{{$t('backoffice.form.fields.proposeNewDataTime')}}</ion-label>
                            <ion-toggle v-if="reservation.State == 0"
                                style="float: left; margin: 10px;" color="primary" 
                                @ionChange="proposeDayTime=$event.target.checked; reservation.Date = reservationDate; reservation.Hour = reservationHour"
                                :checked="proposeDayTime"
                            ></ion-toggle>
                        </ion-item>

                        <div v-if="reservation.State != 0 || proposeDayTime==false">
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
                        </div>
                        <div v-if="reservation.State == 0 && proposeDayTime==true">
                            <p v-if="reservation.Date"> <ion-label class="ion-text-wrap" >
                                <h2  style="width: 100%;float: left;font-size: 16px;
                                text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                                {{$t('frontend.reservation.reservationDate')}}:<strong>  
                                    <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px; display: inline-table" name="saturdayOpenHour" @ionChange="reservation.Date = $event.target.value" 
                                        v-bind:value="reservation.Date"
                                        placeholder="Select" display-format="YYYY-MM-DD" picker-format="YYYY-MM-DD">
                                    </ion-datetime>
                                </strong> </h2>
                            </ion-label></p>
                            

                            <p v-if="reservation.Hour"> <ion-label class="ion-text-wrap" >
                                <h2  style="width: 100%;float: left;font-size: 16px;
                                text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                                {{$t('frontend.reservation.reservationHour')}}:<strong>  
                                    <ion-datetime style="border-bottom: 1px solid lightgray; margin:5px; display: inline-table" name="saturdayOpenHour" @ionChange="reservation.Hour = $event.target.value" 
                                        v-bind:value="reservation.Hour"
                                        placeholder="Select" display-format="h:mm a" picker-format="h:mm a">
                                    </ion-datetime>
                                 </strong> </h2>
                            </ion-label></p>
                        </div>

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

                    </ion-card>

                    <ion-card :style="scope.isSmall || scope.isMedium || scope.noMatch? '' :'width: 80%; margin: 0 auto;'" v-if="reservation.State === 0 || reservation.State === 1 || reservation.State === 2 || reservation.State === 4">

                        <ion-label>Restaurant notes</ion-label>
                        <ion-textarea style="margin: 1px solid lightgray; text-align: left; font-size: 16px" name="restaurantNotes" 
                            @input="reservation.restaurantNotes = $event.target.value" 
                            v-bind:value="reservation.restaurantNotes">
                        </ion-textarea>

                    </ion-card>

                    <ion-card :style="scope.isSmall || scope.isMedium || scope.noMatch? '' :'width: 80%; margin: 0 auto;'" v-if="(reservation.State === 3 || reservation.State === 4 || reservation.State === 5) && reservation.restaurantNotes">

                        <ion-label>Restaurant notes</ion-label>
                        <p style="margin: 1px solid lightgray; text-align: left; font-size: 16px">{{reservation.restaurantNotes}}</p>

                    </ion-card>

                    <ion-card  style="padding: 0 10px">
                        
                        <ion-button v-if="reservation.State === 0 && (reservation.Hour == reservationHour && reservation.Date == reservationDate)" color="success" @click="approve()">Approve</ion-button>
                        <ion-button v-if="reservation.State === 0 && (reservation.Hour != reservationHour || reservation.Date != reservationDate)"  color="primary" @click="proposedDateTime()">Proposed Date/Time</ion-button>
                        <ion-button v-if="reservation.State === 0"  color="danger" @click="reject()" >Reject</ion-button>
                        <ion-button v-if="reservation.State === 1 || reservation.State === 2 || reservation.State === 4"  color="danger" @click="cancel()" >Cancel</ion-button>
                        <ion-button v-if="reservation.State === 4" color="success" @click="close()" >Close</ion-button>
                                        
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
import Moment from 'moment';
// import { EventBus } from '../event-bus';

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
        allOrders: {type: Array, default:() => [] },         
        restaurantName:  {type: String, default:"" } ,
        restaurantPhone:  {type: String, default:"" } ,
        restaurantLogo:  {type: String, default:"" } ,
        restaurantEmail:  {type: String, default:"" } ,
        restaurantAddress:  {type: String, default:"" } ,
        restaurantWeb:  {type: String, default:"" } ,
        restaurantFacebok:  {type: String, default:"" } ,
        restaurantTwitter:  {type: String, default:"" } ,
        restaurantInstagram:  {type: String, default:"" } ,
        restaurantYoutube:  {type: String, default:"" } ,
     }, 
    created: function(){
            
        this.reservation = this.$route.params.reservation;
        this.reservationDate =  this.reservation.Date;
        // Moment.tz(this.reservation.Date, Moment.tz.guess()).format('YYYY-MM-DD');
        this.reservationHour =  this.reservation.Hour;

        console.log(JSON.stringify(this.reservation));
           
        

        this.valEstate = this.allState[this.reservation.State];   
    }, 
    data() {
        return {
          
            restaurantNotes: '',
            
            reservationDate: '',
            reservationHour: '',

            showStates: '',              
            currentState: this.showStates,
            valEstate:'',
            date: '',
            proposeDayTime: false,
            spinner: false,
            spinner1: false,
            key:0,  
            key1: 0, 
            currency:'USD',
            allState : [this.$t('frontend.reservation.state0'), this.$t('frontend.reservation.state1'),
                    this.$t('frontend.reservation.state2'), this.$t('frontend.reservation.state3'),
                    this.$t('frontend.reservation.state4'), this.$t('frontend.reservation.state5'),
                    this.$t('frontend.reservation.state6')]
        

        }
    },
    computed:{
         
    },
 
    methods:{    

        sendEmail(mess){
            let email = {
              "email": this.reservation.CustomerEmail,
              "mess": mess,
              "subject": this.$t('backoffice.form.marketingMessages.reservationChangeStatus')
            };
            Api.sendEmail(email)
            .then(() => {
                console.log(email)
            })
            .catch(e => {
                console.log(e);
            })
        },

        sendSMS(mess){
            let text = {
              "phone": this.reservation.CustomerPhone,
              "mess": mess
            };
            Api.sendSms(text)
            .then(() => {
                console.log(text)
            })
            .catch(e => {
                console.log(e);
            })
        },
     
        async approve(){
            // this.reservation.RestaurantNote = this.restaurantNotes
            this.reservation.State = 1
            this.spinner = true;
            await Api.putIn('Reservation', this.reservation);
            const mess = this.$t('backoffice.form.marketingMessages.reservationApproved') + Moment.tz(this.reservation.Date, Moment.tz.guess()).format('MM-DD-YYYY') + ', ' + Moment.tz(this.reservation.Hour, Moment.tz.guess()).format('HH:mm') + this.$t('backoffice.form.marketingMessages.reservationApproved2');
            this.sendEmail(mess);
            this.sendSMS(mess);
            this.chargeReservation();
        },

        async proposedDateTime(){
            // this.reservation.RestaurantNote = this.restaurantNotes
            this.reservation.Date = Moment(this.reservation.Date, 'YYYY-MM-dd').toISOString()
            this.reservation.Hour = Moment(this.reservation.Hour, 'HH:mm').toISOString()
            this.reservation.State = 2
            this.spinner = true;
            await Api.putIn('Reservation', this.reservation);
            const mess = this.$t('backoffice.form.marketingMessages.reservationProposedDateTime') + Moment.tz(this.reservation.Date, Moment.tz.guess()).format('MM-DD-YYYY') + ', ' + Moment.tz(this.reservation.Hour, Moment.tz.guess()).format('HH:mm');
            this.sendEmail(mess);
            this.sendSMS(mess);
            this.chargeReservation();
        },

        async reject(){
            // this.reservation.RestaurantNote = this.restaurantNotes
            this.reservation.State = 3
            this.spinner = true;
            await Api.putIn('Reservation', this.reservation);
            const mess = this.$t('backoffice.form.marketingMessages.reservationRejected');
            this.sendEmail(mess);
            this.sendSMS(mess);
            this.chargeReservation();
        },

        async cancel(){
            // this.reservation.RestaurantNote = this.restaurantNotes
            this.reservation.State = 5
            this.spinner = true;
            await Api.putIn('Reservation', this.reservation);
            const mess = this.$t('backoffice.form.marketingMessages.reservationCancel');
            this.sendEmail(mess);
            this.sendSMS(mess);
            this.chargeReservation();
        },

        async close(){
            // this.reservation.RestaurantNote = this.restaurantNotes
            this.reservation.State = 6
            this.spinner = true;
            await Api.putIn('Reservation', this.reservation);
            // const mess = '';
            // this.sendEmail(mess);
            // this.sendSMS(mess);
            this.chargeReservation();
        },

        //  async confirmReservation(){
        //     this.reservation.State = 4
        //     this.spinner = true;
        //     await Api.putIn('Reservation', this.reservation);
        //     this.chargeReservation();
        // },
       
        chargeReservation(){
            this.key1 ++;
           const allState = [this.$t('frontend.reservation.state0'), this.$t('frontend.reservation.state1'),
                    this.$t('frontend.reservation.state2'), this.$t('frontend.reservation.state3'),
                    this.$t('frontend.reservation.state4'), this.$t('frontend.reservation.state5'),
                    this.$t('frontend.reservation.state6')]

            this.spinner = true;
            console.log(this.reservation._id)
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
        console.log(e)
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
            //hacer emit
             return this.$router.push({ name: 'Reservation', params: {showAllReservation: true } }) 
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
            html += `<h2>${this.$t('frontend.reservation.create')}</h2>  `;
            html +=`</td>`;     
            html += `</tr>`;          
            html += '<tr><td colspan=6 >'
            if(this.reservation.CustomerName)
              html += `<br> <h4> ${this.$t('frontend.orderType.name')}: ${this.reservation.CustomerName}</h4>`;
            if(this.reservation.CustomerEmail)
              html += `<br> <h4> ${this.$t('frontend.orderType.email')}: ${this.reservation.CustomerEmail}</h4>`;
            if(this.reservation.CustomerPhone)
              html += `<br> <h4> ${this.$t('frontend.orderType.phone')}: ${this.reservation.CustomerPhone}</h4>`;
            if(this.reservation.Capacity)
              html += `<br> <h4> ${this.$t('frontend.reservation.peoples')}: ${this.reservation.Capacity}</h4>`;
            if(this.reservation.Date)
              html += `<br> <h4> ${this.$t('frontend.reservation.reservationDate')}: ${this.getReservationDate(this.reservation.Date)}</h4>`;
            if(this.reservation.Hour)
              html += `<br> <h4> ${this.$t('frontend.reservation.reservationHour')}: ${this.getReservationHour(this.reservation.Hour)}</h4>`;
            if(this.reservation.Note)
              html += `<br> <h4> ${this.$t('frontend.order.notes')}: ${this.reservation.Note}</h4>`;
            if(this.reservation.Reason)
              html += `<br> <h4> ${this.$t('frontend.reservation.reason')}: ${this.reservation.Reason}</h4>`;
            if(this.reservation.State)
              html += `<br> <h4> ${this.$t('frontend.home.state')}: ${this.allState[this.reservation.State]}</h4>`;
           
            html += `</td></tr>`;      
           
            html += `</table></div></body></html>`;


            var winimp = window.open('/print', 'popimpr');         
            winimp.document.write( html );
            winimp.document.close();
            winimp.focus();
            winimp.print();
            winimp.close();
         },

           getFormatPrice(price){
            let result = price
            if(this.currency !== '')
            result = new Intl.NumberFormat('en', {style: "currency", currency: this.currency} ).format(price);
            return result;
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