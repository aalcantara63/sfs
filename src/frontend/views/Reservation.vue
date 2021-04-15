<template>
<div>
  
      
  <ion-toolbar>
       <ion-card-title style="text-align: left;padding: 10px;">
           {{$t('frontend.reservation.reservations')}}

      </ion-card-title>
      
    <ion-segment id="reservationSegment" @ionChange="segmentChanged($event.target.value)" :value="segmentValue" @input="value=segmentValue">
      <ion-segment-button value="camera">
        <span class="iconify" data-icon="ant-design:plus-outlined" data-inline="false"></span>
         <!-- ADD -->
      </ion-segment-button>
      <ion-segment-button value="bookmark">
      <span class="iconify" data-icon="tabler:search" data-inline="false"></span>
      <!-- SEARCH -->
      </ion-segment-button>
      <ion-segment-button value="heart">
      <span class="iconify" data-icon="ant-design:unordered-list-outlined" data-inline="false"></span>
      <!-- LIST -->
    </ion-segment-button>
    </ion-segment>
   
  </ion-toolbar>

  <div v-if="camera" style="    width: 80%; margin: 0 auto;">
      <hr>
        <ion-card-title>{{$t('frontend.reservation.create')}} 
          <ion-chip @click="toastInfoHorarios" style="background: transparent; padding: 0; margin: 0;">
            <span  class="iconify" data-icon="ph:info-light" data-inline="false" style="width: 20px;height: 20px;"></span>
          </ion-chip>
        </ion-card-title>

       

        <div >

          <div v-if="spinner" class="menu-col-12">
            <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
          </div>

           <ion-label class="ion-text-wrap menu-col-12" v-if="clientId ===''">
            <p style="display: inline-block; text-align: center; font-style: italic;color: red;font-weight: 500;" color="danger" v-if="clientId ===''" class="ion-text-wrap menu-col-12">
                <span class="iconify" data-icon="el:error-alt" data-inline="false" style="color: red; margin: 5px 0 0 15px; width: 18px;height: 18px;"></span>
                {{$t('frontend.home.clientRequired')}}</p>
            </ion-label> 

          <ion-card  v-if="!spinner && clientId !==''">
                <ion-item>
                <ion-label position="floating">{{$t('frontend.orderType.name')}} <strong style="color: red">*</strong></ion-label>
                <ion-input type="text" :value="CustomerName" @input="theName = $event.target.value" :readonly="clientId !==''? true: false"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="floating">{{$t('frontend.orderType.email')}} <strong style="color: red">*</strong></ion-label>
                <ion-input type="text" :value="email"  @input="theEmail = $event.target.value" @change="value=ValidateEmail()" :readonly="clientId !==''? true: false"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="floating">{{$t('frontend.orderType.phone')}} <strong style="color: red">*</strong></ion-label>
                <ion-input type="text" :value="phone"  @input="thePhone = $event.target.value" :readonly="clientId !==''? true: false"></ion-input>
              </ion-item> 
                <ion-item>
                    <ion-label position="floating">{{$t('frontend.reservation.reservationDate')}} <strong style="color: red">*</strong></ion-label>
                    <ion-datetime :value="dateToDay" max="2030"  @ionChange="dateToReserv=$event.target.value, validateHour()" :min="dateToDay.format('YYYY-MM-DD')" >    
                   </ion-datetime>
              </ion-item>
              <ion-item>
                <ion-label position="floating">{{$t('frontend.reservation.reservationHour')}} <strong style="color: red">*</strong></ion-label>
                <!-- <ion-datetime display-format="h:mm A" picker-format="h:mm A" :value="hourEstimateToPick"  @ionChange="hourEstimateToPick = $event.target.value"         -->
                <ion-datetime :value="hourToReserv" display-format="h:mm A" picker-format="h:mm A" @ionChange="hourToReserv=$event.target.value, validateHour()" :key="key"></ion-datetime>           
              </ion-item>
              <ion-item>
                <ion-label position="floating">{{$t('frontend.reservation.peoples')}} <strong style="color: red">*</strong></ion-label>
                <ion-input type="number" :value="guest" @ionChange="guest=$event.target.value "></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="floating">{{$t('frontend.reservation.reason')}}</ion-label>
                <ion-input type="text"  @ionChange="reasonToReser=$event.target.value "></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="floating">{{$t('frontend.order.notes')}}</ion-label>
                <ion-textarea type="text"  @ionChange="noteToReserv=$event.target.value "></ion-textarea>
              </ion-item>
          </ion-card>  
          
         
        </div>  

        

        <ion-button @click="saveReservation()" v-if="!spinner  && clientId !==''">{{ this.$t('frontend.home.acept') }}</ion-button>


  </div>
  
  <div v-if="bookmark">
    <hr>
       <ion-card-title>{{$t('frontend.reservation.find')}}</ion-card-title>
      <ion-card>

      <div class="ion-text-wrap menu-col-12">
        <ion-searchbar 
        v-if="!spinner && clientId !==''"
         inputmode="text"
         animated :placeholder="$t('frontend.reservation.enterCode')" 
         search-icon=false
         class="menu-col-10"
         style="float: left"
         @ionChange="theCode= $event.target.value"
         >        
        </ion-searchbar >

        <ion-button fill="outline"  style="float: left; margin: 10px 0;" @click="findByCode()"
        v-if="!spinner && clientId !==''">
         <span class="iconify" data-icon="flat-ui:search" data-inline="false" style="margin: 0 -10px;"></span>
        </ion-button>
      </div>
          
      </ion-card>

      <ion-card>
          <div v-if="spinner" class="menu-col-12">
           <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
          </div>

           <ion-label class="ion-text-wrap menu-col-12" v-if="clientId ===''">
            <p style="display: inline-block; text-align: center; font-style: italic;color: red;font-weight: 500;" color="danger" v-if="clientId ===''" class="ion-text-wrap menu-col-12">
                <span class="iconify" data-icon="el:error-alt" data-inline="false" style="color: red; margin: 5px 0 0 15px; width: 18px;height: 18px;"></span>
                {{$t('frontend.home.clientRequired')}}</p>
            </ion-label> 

          <div v-if="!spinner && reservationByCode.CustomerName && clientId !==''"  class="menu-col-12">
              <ion-item>
                <p class="menu-col-4"><strong>{{$t('frontend.orderType.name')}} </strong></p>
                <ion-input readonly=true type="text">{{reservationByCode.CustomerName}}</ion-input>
              </ion-item>
              <ion-item>
                <p class="menu-col-4"><strong>{{$t('frontend.orderType.email')}} </strong></p>
                <ion-input readonly=true type="text">{{reservationByCode.CustomerEmail}}</ion-input>
              </ion-item>
              <ion-item>
                <p class="menu-col-4"><strong>{{$t('frontend.orderType.phone')}} </strong></p>
                <ion-input readonly=true type="text">{{reservationByCode.CustomerPhone}}</ion-input>
              </ion-item> 
              <ion-item>
                  <p class="menu-col-4"><strong>{{$t('frontend.reservation.reservationDate')}}</strong></p>
                  <ion-input readonly=true type="text">{{getReservationDate(reservationByCode.Date)}}</ion-input>
              </ion-item>
              <ion-item>
                <p class="menu-col-4"><strong> {{$t('frontend.reservation.reservationHour')}}</strong></p>
                <ion-input readonly=true type="text">{{getReservationHour(reservationByCode.Hour)}}</ion-input>         
              </ion-item>
              <ion-item>
                <p class="menu-col-4"><strong>{{$t('frontend.reservation.peoples')}} </strong></p>
                <ion-input readonly=true type="text">{{reservationByCode.Capacity}}</ion-input>
              </ion-item>
               <ion-item v-if="reservationByCode.QuotationPayment">
                <p class="menu-col-4"><strong>{{$t('frontend.order.quotationPayment')}} </strong></p>
                <ion-input readonly=true type="text"> $ {{reservationByCode.QuotationPayment.toFixed(2)}}</ion-input>
              </ion-item> 
              <ion-item
                :style="
                                reservationByCode.State===0 ? '--background: #edeb3038' // solicitada
                                :reservationByCode.State===1 || reservationByCode.State===2 ? '--background: #e8d21652' // aceptada o changedHour
                                :reservationByCode.State=== 3 || reservationByCode.State=== 5 ?'--background:#ff00001f' //cancelada
                                : reservationByCode.State===4 ? '--background:#1ee81652' // confirmada  
                                : reservationByCode.State===6 ? '--background: #71676738' // carrada
                                :'--background: '">
                <p class="menu-col-4"><strong>{{$t('frontend.home.state')}} </strong></p>
                <ion-input readonly=true type="text">{{allState[reservationByCode.State]}}</ion-input>
              </ion-item>   
               <ion-item v-if="reservationByCode.Note">
                <p class="menu-col-4"><strong>{{$t('frontend.order.notes')}} </strong></p>
                <ion-input readonly=true type="text">{{reservationByCode.Note}}</ion-input>
              </ion-item> 
               <ion-item v-if="reservationByCode.Reason">
                <p class="menu-col-4"><strong>{{$t('frontend.reservation.reason')}} </strong></p>
                <ion-input readonly=true type="text">{{reservationByCode.Reason}}</ion-input>
              </ion-item>          
          </div>

      </ion-card>
      
        
  </div>

  <div v-if="heart">



        <hr>
           <ion-card-title>
      {{$t('frontend.reservation.yoursReservations')}}
       <ion-button fill="outline" style="float: right; margin-right: 10px;" @click="segmentChanged('camera')" v-tooltip="$t('frontend.tooltips.addOrder')"> +  </ion-button>

        <ion-label class="ion-text-wrap"> 
        </ion-label>
         <ion-searchbar v-if="clientId !==''"
                @ionClear="handleInput('')"
                @input="$event.target.value?handleInput($event.target.value):handleInput('')"
                :placeholder="$t('frontend.home.search')">           
            </ion-searchbar>
      </ion-card-title>

      <ion-refresher 
        style="position: relative"
        slot="fixed"
        @ionRefresh="doRefresh($event)">
          <ion-refresher-content 
            refreshing-spinner="crescent"
          ></ion-refresher-content>
      </ion-refresher>
      

      <div v-if="spinner">
        <ion-spinner  name="lines" class="spinner"></ion-spinner>
      </div>

         <ion-label class="ion-text-wrap menu-col-12" v-if="clientId ===''">
            <p style="display: inline-block; text-align: center; font-style: italic;color: red;font-weight: 500;" color="danger" v-if="clientId ===''" class="ion-text-wrap menu-col-12">
                <span class="iconify" data-icon="el:error-alt" data-inline="false" style="color: red; margin: 5px 0 0 15px; width: 18px;height: 18px;"></span>
                {{$t('frontend.home.clientRequired')}}</p>
        </ion-label> 

        <div  v-if="clientId !=='' && !spinner">
          <ion-item-sliding>

            <ion-item >
                <ion-label class="ion-text-wrap menu-col-4 elipsis-menu"><h2 style="font-size: 16px;font-weight: bold;"> {{$t('frontend.reservation.completeDateReservacion')}} </h2> </ion-label>
                <ion-label class="ion-text-wrap menu-col-3 elipsis-menu"> <h3  style="font-size: 16px;font-weight: bold;">{{$t('frontend.reservation.peoples')}}</h3></ion-label>
                <ion-label class="ion-text-wrap menu-col-5 elipsis-menu"><h3  style="font-size: 16px;font-weight: bold;">{{$t('frontend.home.state')}}</h3></ion-label>
            </ion-item>

            

          </ion-item-sliding>

          <paginate
              ref="paginator"
              v-if="!spinner"
              name="allReservations"
              :list="reservationToFilter"
              :per="8"
            >
          <ion-item-sliding v-for="reservation in paginated('allReservations')" :key="reservation._id">
                 
            <ion-item
              @click="getReservationState(reservation)"
              style="width: 100%;"    
              :style="
               reservation.State===0 ? '--background: #edeb3038' // solicitada
               :reservation.State===1 || reservation.State===2 ? '--background: #e8d21652' // aceptada o changedHour
              :reservation.State=== 3 || reservation.State=== 5 ?'--background:#ff00001f' //cancelada
              : reservation.State===4 ? '--background:#1ee81652' // confirmada  
              : reservation.State===6 ? '--background: #71676738' // carrada
              :'--background: '">
                    
              <ion-label class="ion-text-wrap menu-col-4">
                  <h2>{{ getReservationDate(reservation.Date) }}</h2>               
                  <h2>{{ getReservationHour(reservation.Hour) }}</h2>               
              </ion-label>

              <ion-label  class="ion-text-wrap menu-col-3">
                  <h2 >{{ reservation.Capacity }}</h2>               
              </ion-label>

              <ion-label class="ion-text-wrap menu-col-5">
                  <h2 style="display: contents">{{allState[reservation.State] }}</h2> 
                 <span class="iconify" data-icon="mdi:backburger" style="color: grey;margin:0;width: 20px; height: 20px;float: right;" data-inline="false"></span>              
              </ion-label >

              

            </ion-item>

             <ion-item-options side="end">
                <ion-item-option color="primary" @click="sendReservationCustomer(reservation)" v-tooltip="$t('frontend.tooltips.forward')">
                     <span  class="iconify" data-icon="carbon:mail-all" data-inline="false"></span>
                     <ion-spinner v-if="spinnerEmail"></ion-spinner>
                </ion-item-option>  
                
                <ion-item-option color="primary" @click="sendPrint(reservation)" v-tooltip="$t('frontend.tooltips.printRes')">
                    <span class="iconify" data-icon="ic:round-local-printshop" data-inline="false" ></span>
                </ion-item-option>

            </ion-item-options>

          </ion-item-sliding>

          </paginate>

          <paginate-links for="allReservations" color="primary" 
           @change="onLangsPageChange()"  
           :async="true"
            :simple="{
              next:'»' ,
              prev: '« ' }"
          ></paginate-links>

        </div>


  
  


  </div>


</div>
</template>
<script>

import { Api } from '../../backoffice/api/api.js';
 import Moment from 'moment'
 import moment from 'moment-timezone';
  import { EventBus } from '../event-bus';

export default {
    name: 'Reservation',
     components: {   
  },
     data () {
      return {
        spinnerEmail: false,
         camera: true,
         bookmark: false,
         heart: false,
         spinner: false,
         paginate: ['allReservations'],
         theCode: '',
         reservationByCode: {},
         theName: this.CustomerName || '',
         theEmail: this.email || '',
         thePhone: this.phone || '',
         dateToReserv: this.dateToDay,
         hourToReserv: '',
         guest: 1,
         noteToReserv: '',
         reasonToReser: '',
         allState: [this.$t('frontend.reservation.state0'), this.$t('frontend.reservation.state1'),
                    this.$t('frontend.reservation.state2'), this.$t('frontend.reservation.state3'),
                    this.$t('frontend.reservation.state4'), this.$t('frontend.reservation.state5'),
                    this.$t('frontend.reservation.state6')],
        segmentValue: 'camera',
        dateToDay: '',
        key: 0,
        reservationToFilter: [],
        cardNumber:'',
        cardCode: '',
        expirationCard:'',
        dateTodaymin: new Date().toISOString().substr(0, 7),
        dateTodaymax:  new Date().getFullYear(),
        currentPageReservation: 1,
         clientId: '',
        CustomerName: '', 
        email: '', 
        phone: '',  
        allReservations: [],
        configuration: {},
        restaurantActive: {}
      }
     },     
     created: function(){

        if(this.$store.state.customer._id){
          this.clientId= this.$store.state.customer._id;
        this.CustomerName= this.$store.state.customer.Name;
        this.email= this.$store.state.customer.EmailAddress;
        this.phone=this.$store.state.customer.Phone;
        this.marketingEmail=this.$store.state.customer.MarketingConsent.Email;
        this.marketingPhone=this.$store.state.customer.MarketingConsent.Phone; 
       }

       this.allReservations = this.$store.state.allReservations;
      this.configuration = this.$store.state.configuration; 
      this.restaurantActive = this.$store.state.restaurantActive  
       
      for(var i=0; i< this.allReservations.length; i++){
        this.allReservations[i].iState = this.allState[this.allReservations[i].State];
      }

      this.reservationToFilter = this.allReservations 
       

       if(this.$route.params.showAllReservation){
         this.segmentChanged('heart')
       } 
       
       this.dateToDay = moment.tz(moment.tz.guess()).format('MM-DD-YYYY'),    
       this.dateToDay = moment(this.dateToDay, "MM-DD-YYYY").add('days', this.configuration.minDayToReservation);

        EventBus.$on('updateAllReservationsInParent', (value) => { this.allReservations =  value});
       
     },
    mounted: function(){
        if(this.$route.params.currentPageReservation > 1){
          this.currentPageReservation = this.$route.params.currentPageReservation; 
           this.$refs.paginator.goToPage(this.currentPageReservation);
       }
      },
     methods: { 
       


    async doRefresh(event) {    
      await this.getReservations();      
      event.target.complete();
    },
       
      handleInput(value){
        this.reservationToFilter = this.allReservations
        const query = value.toLowerCase();
        requestAnimationFrame(() => {   
          let cat2 = this.allReservations.filter(item => item.Code.toLowerCase().indexOf(query) > -1 ||
                                            item.iState.toLowerCase().indexOf(query) > -1  )
          
          if(cat2.length> 0)
            this.reservationToFilter = cat2
          else
            this.reservationToFilter = this.allReservations 
        });
      },
         
      segmentChanged(value){            
             if(value === 'camera'){
                 this.camera = true;
                 this.bookmark = false;
                 this.heart = false;
             }
             if(value === 'bookmark'){
                 this.camera = false;
                 this.bookmark = true;
                 this.heart = false;
             }  
              if(value === 'heart'){
                 this.camera = false;
                 this.bookmark = false;
                 this.heart = true;                
             }
             this.segmentValue = value;

         },

      getReservations: async function(){
          if(this.clientId =='')
            return false;
           
            await Api.getCustomerReservations(this.clientId)
            .then(response => {
                this.$store.commit('setAllReservations', response.data)
                EventBus.$emit('updateAllReservations', response.data);
                this.allReservations = response.data;  
                for(var i=0; i< this.allReservations.length; i++){
                  this.allReservations[i].iState = this.allState[this.allReservations[i].State];
                }
                this.reservationToFilter = this.allReservations 
            })
            .catch(e => {
                console.log(e);            
            })  
        },

      findByCode: async function(){
        if(this.theCode === '')
          return this.notCodeFind();
         this.spinner = true;
       
        try {
           const response =await Api.getReservationByCode(this.theCode);
           if(response.status === 200){
              this.reservationByCode = response.data  
              this.spinner = false;
           }
           else{
             this.spinner = false;
             return this.notCodeFind();
           }            
          
        } catch (error) {
           this.spinner = false 
                console.log(error);  
        }
            
      },

      async saveReservation(){
        
        if(this.clientId !=''){
          this.theName= this.CustomerName;
         this.theEmail= this.email;
         this.thePhone = this.phone ;
          if(this.dateToReserv === '' || this.hourToReserv=== '' || this.guest < 1){
            let mss = '';
            if(this.dateToReserv === '') mss +='<br>'+ this.$t('frontend.reservation.reservationDate');
            if(this.hourToReserv === '') mss +='<br>'+ this.$t('frontend.reservation.reservationHour');
            if(this.guest < 1) mss +='<br>'+ this.$t('frontend.reservation.peoples') +' > 1';
             return this.alertRequiredDatas(mss);
          }          
        }
        else{
          if(this.theName===''  || this.theEmail==='' || this.thePhone ==='' ||
            this.dateToReserv === '' || this.hourToReserv=== '' || this.guest < 1)
            var mss1 = '';
            if(this.dateToReserv === '') mss1 += '<br>' + this.$t('frontend.reservation.reservationDate');
            if(this.hourToReserv === '') mss1 +='<br>'+ this.$t('frontend.reservation.reservationHour');
            if(this.guest < 1) mss1 +='<br>'+ this.$t('frontend.reservation.peoples')+ ' > 1';
              return this.alertRequiredDatas(mss1);
        }          

        const Reservation = {
        "CustomerId" : this.clientId,
        "CustomerName": this.theName,
        "CustomerEmail": this.theEmail,
        "CustomerPhone":  this.thePhone,
        "Capacity":  this.guest,
        "Date": Moment(this.dateToReserv).toISOString(),
        "Hour": Moment(this.hourToReserv).toISOString(),
        "Note": this.noteToReserv,
        "Reason": this.reasonToReser,
        "State": 0
        }
        
        
        try {
          this.spinner = true;
          const response = await Api.postIn('Reservation', Reservation);          
          if(response.status === 200){
            this.dateToReserv = this.dateToDay;
            this.hourToReserv = '' ; this.guest = 1;
            this.noteToReserv = ''; this.reasonToReser = ''; this.spinner = false;
            this.openToast();             
            this.sendReservationEmail(Reservation);
            this.getReservations();            
            this.segmentChanged('heart');    
            this.spinner = false;             
          }
        
        } catch (error) {
          console.log(error);
          this.spinner = false;          
        }       

    
      },

      getReservationDate(thisDate){
        return  moment.tz(thisDate, moment.tz.guess()).format('MM-DD-YYYY') 
      },

       getReservationHour(thisHour){
        return  moment.tz(thisHour, moment.tz.guess()).format('hh:mm A') 
      },

      getReservationState(reservation){
          return this.$router.push({ name: 'ReservationDetail', params: {reservation: reservation, currentPageReservation: this.currentPageReservation } })    
      },

      htmlToUse(reservation){
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
            if(reservation.CustomerName)
              html += `<br> <h4> ${this.$t('frontend.orderType.name')}: ${reservation.CustomerName}</h4>`;
            if(reservation.CustomerEmail)
              html += `<br> <h4> ${this.$t('frontend.orderType.email')}: ${reservation.CustomerEmail}</h4>`;
            if(reservation.CustomerPhone)
              html += `<br> <h4> ${this.$t('frontend.orderType.phone')}: ${reservation.CustomerPhone}</h4>`;
            if(reservation.Capacity)
              html += `<br> <h4> ${this.$t('frontend.reservation.peoples')}: ${reservation.Capacity}</h4>`;
            if(reservation.Date)
              html += `<br> <h4> ${this.$t('frontend.reservation.reservationDate')}: ${this.getReservationDate(reservation.Date)}</h4>`;
            if(reservation.Hour)
              html += `<br> <h4> ${this.$t('frontend.reservation.reservationHour')}: ${this.getReservationHour(reservation.Hour)}</h4>`;
            if(reservation.Note)
              html += `<br> <h4> ${this.$t('frontend.order.notes')}: ${reservation.Note}</h4>`;
            if(reservation.Reason)
              html += `<br> <h4> ${this.$t('frontend.reservation.reason')}: ${reservation.Reason}</h4>`;
            if(reservation.QuotationPayment)
              html += `<h4> ${this.$t('frontend.order.quotationPayment')}: ${reservation.QuotationPayment}</h4>`;

              
           
            html += `</td></tr>`;      
           
            html += `</table></div></body></html>`;

            return html;
      },

      async sendReservationEmail(reservation){

            this.spinnerEmail = true;
            const html = this.htmlToUse(reservation); 
            let subject = this.$t('frontend.reservation.create') ;            
                    
            var items = {
                "email": this.restaurantActive.restaurantEmail,
                "mess": html,
                "subject": subject
            }
            await Api.sendEmail(items);
            this.spinnerEmail = false;
      },

        async sendReservationCustomer(reservation){

            this.spinnerEmail = true;
            const html = this.htmlToUse(reservation); 
            let subject = this.$t('frontend.reservation.create') ;            
                    
            var items = {
                "email": reservation.CustomerEmail,
                "mess": html,
                "subject": subject
            }
            await Api.sendEmail(items);
            this.spinnerEmail = false;
      },

      validateHour(){
        this.key ++;
        if(this.hourToReserv === '')
          return ''
        
        var hour = Moment(this.hourToReserv).toISOString();
        var day =  Moment(this.dateToReserv).toISOString();
        hour = moment.tz(hour,  moment.tz.guess()).format('HH:mm') ;
        day =  moment.tz(day,  moment.tz.guess()).format('dddd') ;
      

        const index = this.configuration.reservationDaysAndTime.findIndex(re=> re.Day === day);

        if(index !== -1){
          const openHour =  moment.tz(this.configuration.reservationDaysAndTime[index].OpenHour,  moment.tz.guess()).format('HH:mm') ; 
          const closeHour =  moment.tz(this.configuration.reservationDaysAndTime[index].CloseHour,  moment.tz.guess()).format('HH:mm') ; 

      
          if( hour < openHour || hour > closeHour){
            this.hourToReserv = '';           
            
            const mess = this.$t('frontend.reservation.errorHour')+ day + 
            this.$t('frontend.reservation.errorHour2') +
            this.getReservationHour(this.configuration.reservationDaysAndTime[index].OpenHour) + ' - '+ this.getReservationHour(this.configuration.reservationDaysAndTime[index].CloseHour);

            this.alertNotGoodHour(mess);
           
          } 
        }
      },

      ValidateEmail(){
        let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
            if (emailRegex.test(this.theEmail) == false){
              this.theEmail =''
              return  this.$ionic.alertController
              .create({
                  cssClass: 'my-custom-class',
                  header: 'Error',
                  message: this.$t('frontend.home.notValidEmail') , 
                  buttons: [                   
                  {
                    text: this.buttonAcept,
                    handler: () => {                                 
                                  
                    },
                  },
                  ],
              })
              .then(a => a.present())
            }
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

      alertNotGoodHour(message){
        return  this.$ionic.alertController
        .create({
            cssClass: 'my-custom-class',
            header: 'Error',
            message: message,
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

      async openToast() {
        return this.$ionic.toastController
        
          .create({
            message: this.$t('frontend.product.massageToast'),
            duration: 500,
            position: 'middle',
            color:'success'
          })
        .then(a => a.present())
      },

      async notCodeFind() {
        return this.$ionic.toastController
        
          .create({
            message: this.$t('frontend.reservation.notcodefind'),
            duration: 700,
            position: 'middle',
            color:'danger'
          })
        .then(a => a.present())
      },

      sendPrint:  function(reservation){

            var html =' <html><head>';    
            html +='<style> .progressBar { width: 100%;  border-bottom: 1px solid black;display: list-item;list-style: unset; padding: 0}';
            html += '.progressBar li {list-style-type: none; float: left; position: relative; text-align: center; margin:0}';
            html += '.progressBar li .before {content: " "; line-height: 30px; border-radius: 50%; width: 30px; height: 30px; border: 1px solid #ddd;';
            html += 'display: block;text-align: center;margin: 0 auto 10px;background-color: white}';
            html += '.progressBar li .after { content: "";position: absolute;width: 100%;height: 4px;background-color: #ddd;top: 15px;left: -50%;z-index: -1;}';
            html += '.progressBar li .one .after {content: none;}.progressBar li.active {color: black;}';
            html += '.progressBar li.active .before { border-color: #63ee68; background-color: #63ee68}.progressBar .active:after {background-color: #4ca44f;} </style>';
            
            html += `</head><body ><div >`;
            
            // html +=`<input type="button" value="Print this page" onClick="${window.close()}">`;
          
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
            if(reservation.CustomerName)
              html += `<br> <h4> ${this.$t('frontend.orderType.name')}: ${reservation.CustomerName}</h4>`;
            if(reservation.CustomerEmail)
              html += ` <h4> ${this.$t('frontend.orderType.email')}: ${reservation.CustomerEmail}</h4>`;
            if(reservation.CustomerPhone)
              html += ` <h4> ${this.$t('frontend.orderType.phone')}: ${reservation.CustomerPhone}</h4>`;
            if(reservation.Capacity)
              html += `<h4> ${this.$t('frontend.reservation.peoples')}: ${reservation.Capacity}</h4>`;
            if(reservation.Date)
              html += ` <h4> ${this.$t('frontend.reservation.reservationDate')}: ${this.getReservationDate(reservation.Date)}</h4>`;
            if(reservation.Hour)
              html += ` <h4> ${this.$t('frontend.reservation.reservationHour')}: ${this.getReservationHour(reservation.Hour)}</h4>`;
            if(reservation.Note)
              html += ` <h4> ${this.$t('frontend.order.notes')}: ${reservation.Note}</h4>`;
            if(reservation.Reason)
              html += ` <h4> ${this.$t('frontend.reservation.reason')}: ${reservation.Reason}</h4>`;
            if(reservation.State)
              html += ` <h4> ${this.$t('frontend.home.state')}: ${this.allState[reservation.State]}</h4>`;
            if(reservation.Code)
              html += ` <h4> ${this.$t('frontend.reservation.code')}: ${reservation.Code}</h4>`;
            if(reservation.QuotationPayment)
              html += `<h4> ${this.$t('frontend.order.quotationPayment')}: $ ${reservation.QuotationPayment.toFixed(2)}</h4>`;

            
            html += `</td></tr>`;      
            
            html += `</table></div></body></html>`;

       

            // var winimp = window.open('', '', 'left=0,top=0,width=800,height=600,toolbar=0,scrollbars=0,status=0');        
            // var winimp = window.open('/print', 'popimpr');         
            var winimp = window.open();         
            winimp.document.write( html );
            winimp.document.close();
            winimp.focus();
            winimp.print();
            winimp.close();

           

          
           
      },
    

      async toastInfoHorarios() {

        let html = '';
        for (const iterator of this.configuration.reservationDaysAndTime) {
          html += '<ion-item>';
          html += `<p>${iterator.Day}:   </p>`
          html += `<p>${this.getReservationHour(iterator.OpenHour)}   -   </p>`
          html += `<p>${this.getReservationHour(iterator.CloseHour)}</p>`
          html += '</ion-item>';
          
        }
        return this.$ionic.toastController
          .create({
            header: 'Hora de reservaciones semanales',
            message: html,
            position: 'middle',
            buttons: [
              {
                side: 'start',
                icon: 'close',
                role: 'cancel',
                handler: () => {
                }
              }
            ]
          })
        .then(a => a.present())
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

     onLangsPageChange () {          
        this.currentPageReservation = this.$refs.paginator.currentPage + 1;        
       }


     }
}

</script>

<style>
   
ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

.paginate-list {
  width: 159px;
  margin: 0 auto;
  text-align: left;
 
}
 .paginate-list li {
    display: block;   
  }

 .paginate-list li:before {
      content: '⚬ ';
      font-weight: bold;
      color: slategray;
    }

.paginate-links.items {
  user-select: none;
}
  a {
    cursor: pointer;
  }
  li.active a {
    font-weight: bold;
  }
  li.next:before {
    content: ' | ';
    margin-right: 13px;
    color: #ddd;
  }
  li.disabled a {
    color: #ccc;
    cursor: no-drop;
  }
  .prev, .next{
    font-size: 40px;
  }
  .elipsis-menu{
        text-overflow: ellipsis !important;
    overflow: hidden !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
    
</style>