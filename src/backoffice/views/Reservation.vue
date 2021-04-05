<template>
<div class="screen">
  
    <ion-header>  
    <ion-toolbar>
        <ion-buttons slot="start">
            <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'ControlPanel'})"></ion-back-button>
        </ion-buttons>
       <!-- <ion-card-title style="text-align: left;padding: 10px;">
         
           {{$t('frontend.reservation.reservations')}}

      </ion-card-title> -->
      
    <ion-segment id="reservationSegment" @ionChange="segmentChanged($event.target.value)" :value="segmentValue" @input="value=segmentValue">
      <ion-segment-button value="camera">
        <span class="iconify" data-icon="ant-design:plus-outlined" data-inline="false"></span>
         <!-- ADD -->
      </ion-segment-button>
      <!-- <ion-segment-button value="bookmark"> -->
      <!-- <span class="iconify" data-icon="tabler:search" data-inline="false"></span> -->
      <!-- SEARCH -->
      <!-- </ion-segment-button> -->
      <ion-segment-button value="heart">
        <span class="iconify" data-icon="ant-design:unordered-list-outlined" data-inline="false"></span>
      <!-- LIST -->
      </ion-segment-button>
      <ion-segment-button value="waitlist">
        <span class="iconify" data-icon="mdi:playlist-plus" data-inline="false"></span>
      </ion-segment-button>

    </ion-segment>
   
  </ion-toolbar>
  </ion-header> 

  <div v-if="camera" style="    width: 80%; margin: 0 auto;">
      <hr>
        <ion-card-title>{{$t('frontend.reservation.create')}} 
          <ion-chip @click="toastInfoHorarios" style="background: transparent; padding: 0; margin: 0;">
            <span  class="iconify" data-icon="ph:info-light" data-inline="false" style="width: 20px;height: 20px;"></span>
          </ion-chip>
        </ion-card-title>

       

        <ion-card >

          <div v-if="spinner" class="menu-col-12">
            <ion-spinner  name="lines" class="spinner"></ion-spinner>
          </div>

          <div  v-if="!spinner">
                <ion-item>
                <ion-label position="floating">{{$t('frontend.orderType.name')}} <strong style="color: red">*</strong></ion-label>
                <ion-input type="text" :value="CustomerName" @input="theName = $event.target.value"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="floating">{{$t('frontend.orderType.email')}} <strong style="color: red">*</strong></ion-label>
                <ion-input type="text" :value="email"  @input="theEmail = $event.target.value" @change="value=ValidateEmail()" ></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="floating">{{$t('frontend.orderType.phone')}} <strong style="color: red">*</strong></ion-label>
                <ion-input type="text" :value="phone"  @input="thePhone = $event.target.value" ></ion-input>
              </ion-item> 
                <ion-item>
                    <ion-label position="floating">{{$t('frontend.reservation.reservationDate')}} <strong style="color: red">*</strong></ion-label>
                    <ion-datetime :value="dateToDay" max="2030"  @ionChange="dateToReserv=$event.target.value" :min="dateToDay.format('YYYY-MM-DD')" >
                   </ion-datetime>
              </ion-item>
              <ion-item>
                <ion-label position="floating">{{$t('frontend.reservation.reservationHour')}} <strong style="color: red">*</strong></ion-label>
                <!-- <ion-datetime display-format="h:mm A" picker-format="h:mm A" :value="hourEstimateToPick"  @ionChange="hourEstimateToPick = $event.target.value"         -->
                <ion-datetime display-format="h:mm A" picker-format="h:mm A" @ionChange="hourToReserv=$event.target.value "></ion-datetime>           
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
          </div>           
         
        </ion-card>  

        <ion-button @click="saveReservation()" v-if="!spinner" :disabled="!isValidForm()">{{ this.$t('frontend.home.acept') }}</ion-button>


  </div>
  
  <div v-if="bookmark">
    <hr>
       <ion-card-title>{{$t('frontend.reservation.find')}}</ion-card-title>
      <ion-card>

      <div class="ion-text-wrap menu-col-12">
        <ion-searchbar 
         inputmode="numeric"
         animated :placeholder="$t('frontend.reservation.enterCode')" 
         search-icon=false
         class="menu-col-10"
         style="float: left"
         @ionChange="theCode= $event.target.value"
         >        
        </ion-searchbar >

        <ion-button fill="outline"  style="float: left; margin: 10px 0;" @click="findByCode()">
         <span class="iconify" data-icon="flat-ui:search" data-inline="false" style="margin: 0 -10px;"></span>
        </ion-button>
      </div>
          
      </ion-card>

      <ion-card>
          <div v-if="spinner" class="menu-col-12">
            <ion-spinner  name="lines" class="spinner"></ion-spinner>
          </div>

          <div v-if="!spinner && reservationByCode.CustomerName"  class="menu-col-12">
              <ion-item>
                <ion-label class="menu-col-4"><strong>{{$t('frontend.orderType.name')}} </strong></ion-label>
                <ion-input readonly=true type="text">{{reservationByCode.CustomerName}}</ion-input>
              </ion-item>
              <ion-item>
                <ion-label class="menu-col-4"><strong>{{$t('frontend.orderType.email')}} </strong></ion-label>
                <ion-input readonly=true type="text">{{reservationByCode.CustomerEmail}}</ion-input>
              </ion-item>
              <ion-item>
                <ion-label class="menu-col-4"><strong>{{$t('frontend.orderType.phone')}} </strong></ion-label>
                <ion-input readonly=true type="text">{{reservationByCode.CustomerPhone}}</ion-input>
              </ion-item> 
              <ion-item>
                  <ion-label class="menu-col-4"><strong>{{$t('frontend.reservation.reservationDate')}}</strong></ion-label>
                  <ion-input readonly=true type="text">{{getReservationDate(reservationByCode.Date)}}</ion-input>
              </ion-item>
              <ion-item>
                <ion-label class="menu-col-4"><strong> {{$t('frontend.reservation.reservationHour')}}</strong></ion-label>
                <ion-input readonly=true type="text">{{getReservationHour(reservationByCode.Hour)}}</ion-input>         
              </ion-item>
              <ion-item>
                <ion-label class="menu-col-4"><strong>{{$t('frontend.reservation.peoples')}} </strong></ion-label>
                <ion-input readonly=true type="text">{{reservationByCode.Capacity}}</ion-input>
              </ion-item> 
              <ion-item>
                <ion-label class="menu-col-4"><strong>{{$t('frontend.home.state')}} </strong></ion-label>
                <ion-input readonly=true type="text">{{allState[reservationByCode.State]}}</ion-input>
              </ion-item>   
               <ion-item v-if="reservationByCode.Note">
                <ion-label class="menu-col-4"><strong>{{$t('frontend.order.notes')}} </strong></ion-label>
                <ion-input readonly=true type="text">{{reservationByCode.Note}}</ion-input>
              </ion-item> 
               <ion-item v-if="reservationByCode.Reason">
                <ion-label class="menu-col-4"><strong>{{$t('frontend.reservation.reason')}} </strong></ion-label>
                <ion-input readonly=true type="text">{{reservationByCode.Reason}}</ion-input>
              </ion-item>
              <ion-item>
                  <ion-button v-if="reservationByCode.State === 0 && (reservationByCode.Hour == reservationHour && reservationByCode.Date == reservationDate)" color="success" @click="approve()">Approve</ion-button>
                  <ion-button v-if="reservationByCode.State === 0 && (reservationByCode.Hour != reservationHour || reservationByCode.Date != reservationDate)"  color="primary" @click="proposedDateTime()">Proposed Date/Time</ion-button>
                  <ion-button v-if="reservationByCode.State === 0"  color="danger" @click="reject()" >Reject</ion-button>
                  <ion-button v-if="reservationByCode.State === 1 || reservationByCode.State === 2 || reservation.State === 4"  color="danger" @click="cancel()" >Cancel</ion-button>
                  <ion-button v-if="reservationByCode.State === 4" color="success" @click="close()" >Close</ion-button>
              </ion-item>        
          </div>

      </ion-card>
      
        
  </div>

  <div v-if="heart">
        <hr>
        <ion-card-title>
        <!-- {{$t('frontend.reservation.yoursReservations')}} -->
        <!-- <ion-button fill="outline" style="float: right; margin-right: 10px;" @click="segmentChanged('camera')"> +  </ion-button> -->

        <!-- <ion-label class="ion-text-wrap"> 
        </ion-label> -->
         <!-- <ion-searchbar v-if="clientId !==''" -->
         <!-- <ion-searchbar 
                @ionClear="handleInput('')"
                @input="$event.target.value?handleInput($event.target.value):handleInput('')"
                :placeholder="$t('frontend.home.search')">           
        </ion-searchbar> -->

        <ion-searchbar  
                @input="handleInput($event.target.value)" @ionClear="allReservations = reservations"
                :placeholder="$t('frontend.home.search')">           
        </ion-searchbar>
        <div style="width: 100%">
        <ion-segment scrollable color="tertiary" @ionChange="changeFilterStatus($event.target.value)" :value="filterStatus">
            <ion-segment-button value="all">
                  {{$t('frontend.reservation.all')}}
            </ion-segment-button>
            <ion-segment-button value="request">
                  {{$t('frontend.reservation.state0')}}
            </ion-segment-button>
            <ion-segment-button value="approved">
                  {{$t('frontend.reservation.state1')}}
            </ion-segment-button>
            <ion-segment-button value="proposed">
                  {{$t('frontend.reservation.state2')}}
            </ion-segment-button>
            <ion-segment-button value="confirmed">
                  {{$t('frontend.reservation.state4')}}
            </ion-segment-button>
            <ion-segment-button value="rejected">
                  {{$t('frontend.reservation.state3')}}
            </ion-segment-button>
            <ion-segment-button value="canceled">
                  {{$t('frontend.reservation.state5')}}
            </ion-segment-button>
            <ion-segment-button value="close">
                  {{$t('frontend.reservation.state6')}}
            </ion-segment-button>
        </ion-segment>
        </div>

        </ion-card-title>

      <div v-if="spinner">
        <ion-spinner  name="lines" class="spinner"></ion-spinner>
      </div>

         <!-- <ion-label class="ion-text-wrap menu-col-12" v-if="clientId ===''">
            <p style="display: inline-block; text-align: center; font-style: italic;color: red;font-weight: 500;" color="danger" v-if="clientId ===''" class="ion-text-wrap menu-col-12">
                <span class="iconify" data-icon="el:error-alt" data-inline="false" style="color: red; margin: 5px 0 0 15px; width: 18px;height: 18px;"></span>
                {{$t('frontend.home.clientRequired')}}</p>
        </ion-label>  -->

         <!-- <div  v-if="clientId !=='' && !spinner">  -->
         <div  v-if="!spinner">
          <ion-item-sliding>

            <ion-item >
                <ion-label class="ion-text-wrap menu-col-3"><h2 style="font-size: 16px;font-weight: bold;"> {{$t('backoffice.form.fields.name')}}, {{$t('frontend.reservation.completeDateReservacion')}} </h2> </ion-label>
                <ion-label class="ion-text-wrap menu-col-3"> <h3  style="font-size: 16px;font-weight: bold;">{{$t('frontend.reservation.peoples')}}</h3></ion-label>
                <ion-label class="ion-text-wrap menu-col-3"><h3  style="font-size: 16px;font-weight: bold;">{{$t('frontend.home.state')}}</h3></ion-label>
                <ion-label class="ion-text-wrap menu-col-3"><h3  style="font-size: 16px;font-weight: bold;">{{$t('frontend.reservation.code')}}</h3></ion-label>
                
            </ion-item>

          </ion-item-sliding>

          <paginate
              v-if="!spinner"
              name="allReservations"
              :list="allReservations"
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
                    
              <ion-label class="ion-text-wrap menu-col-3">
                  <h2>{{ reservation.CustomerName }}</h2>
                  <h2>{{ getReservationDate(reservation.Date) }}</h2>               
                  <h2>{{ getReservationHour(reservation.Hour) }}</h2>               
              </ion-label>

              <ion-label  class="ion-text-wrap menu-col-3">
                  <h2>{{ reservation.Capacity }}</h2>               
              </ion-label>

              <ion-label class="ion-text-wrap menu-col-3">
                  <h2>{{allState[reservation.State] }}</h2>               
              </ion-label >

              <ion-label class="ion-text-wrap menu-col-3">
                  <h2>{{ reservation.Code }}</h2>   
                  <div style="float: right; margin-top: -20px;color: #dbd4d4;">
                    <span class="iconify" data-icon="eva:arrow-ios-back-outline" data-inline="false"></span>
                  </div>  
                            
              </ion-label> 


            </ion-item>

            <ion-item-options side="end">
                <ion-item-option v-if="reservation.State === 0 && hasPermission('canEditReservation')" color="success" @click="approve(reservation)">
                    <span class="iconify" data-icon="ic:baseline-check" data-inline="false"></span>
                </ion-item-option> 
                <ion-item-option v-if="reservation.State === 4 && hasPermission('canEditReservation')" color="success" @click="close(reservation)">
                    <span class="iconify" data-icon="ic:baseline-check" data-inline="false"></span>
                </ion-item-option> 
                <ion-item-option color="primary" @click="sendPrint(reservation)">
                    <span class="iconify" data-icon="ic:round-local-printshop" data-inline="false"></span>
                </ion-item-option>  
            </ion-item-options>

          </ion-item-sliding>

          </paginate>

          <paginate-links for="allReservations" color="primary" 
            :simple="{
              next:'»' ,
              prev: '« ' }"
          ></paginate-links>

        </div>
  </div>

  <div v-if="waitlist">

        <hr>
        <ion-card-title>Wait List
          <ion-chip @click="toastInfoHorarios" style="background: transparent; padding: 0; margin: 0;">
            <span  class="iconify" data-icon="ph:info-light" data-inline="false" style="width: 20px;height: 20px;"></span>
          </ion-chip>
        </ion-card-title>

        <ion-card >
          <div v-if="spinner" class="menu-col-12">
            <ion-spinner  name="lines" class="spinner"></ion-spinner>
          </div>

          <div v-if="!spinner">
                <ion-item>
                <ion-label position="floating">{{$t('frontend.orderType.name')}} <strong style="color: red">*</strong></ion-label>
                <ion-input type="text" :value="waitName" @input="waitName = $event.target.value"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="floating">{{$t('frontend.orderType.email')}} <strong style="color: red">(* Required if phone is empty)</strong></ion-label>
                <ion-input type="text" :value="waitEmail"  @input="waitEmail = $event.target.value" ></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="floating">{{$t('frontend.orderType.phone')}} <strong style="color: red">(* Required if email is empty)</strong></ion-label>
                <ion-input type="text" :value="waitPhone"  @input="waitPhone = $event.target.value" ></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="floating">{{$t('frontend.reservation.peoples')}} <strong style="color: red">*</strong></ion-label>
                <ion-input type="number" :value="waitPeople" @ionChange="waitPeople=$event.target.value "></ion-input>
              </ion-item>
          </div>
          <ion-button @click="saveWaitList()" v-if="!spinner" :disabled="!isValidWaitList()">{{ this.$t('frontend.home.acept') }}</ion-button>           
        </ion-card>

        <div  v-if="!spinner">

          <div style="width: 100%">
              <ion-segment scrollable color="tertiary" @ionChange="changeWaitlistFilter($event.target.value)" :value="filterWaitList">
                  <ion-segment-button value="todaywaitlist">
                        Today<!-- {{$t('frontend.reservation.all')}} -->
                  </ion-segment-button>
                  <ion-segment-button value="activewaitlist">
                        Active<!-- {{$t('frontend.reservation.state0')}} -->
                  </ion-segment-button>
                  <ion-segment-button value="allwaitlist">
                        All<!-- {{$t('frontend.reservation.state1')}} -->
                  </ion-segment-button>
              </ion-segment>
          </div>

          <ion-item-sliding>

            <ion-item >
                <ion-label class="ion-text-wrap menu-col-3"><h2 style="font-size: 16px;font-weight: bold;"> {{$t('backoffice.form.fields.name')}}</h2> </ion-label>
                <ion-label class="ion-text-wrap menu-col-3"> <h3  style="font-size: 16px;font-weight: bold;">{{$t('backoffice.form.fields.phone')}}</h3></ion-label>
                <ion-label class="ion-text-wrap menu-col-3"> <h3  style="font-size: 16px;font-weight: bold;">{{$t('frontend.reservation.peoples')}}</h3></ion-label>
            </ion-item>

          </ion-item-sliding>

          <paginate
              v-if="!spinner && screenWidth < 600"
              name="allWaitList"
              :list="allWaitList"
              :per="5"
            >
          <ion-item-sliding v-for="wait in paginated('allWaitList')" :key="wait._id">
                 
            <ion-item style="width: 100%;" >
                    
              <ion-label class="ion-text-wrap menu-col-3">
                  <h2>{{ wait.CustomerName }}</h2>               
              </ion-label>

              <ion-label class="ion-text-wrap menu-col-3">
                  <h2>{{ wait.CustomerPhone }}</h2>               
              </ion-label>

              <ion-label  class="ion-text-wrap menu-col-3">
                  <h2>{{ wait.Capacity }}</h2>               
              </ion-label>

            </ion-item>

            <ion-item-options side="end">
                <!-- delete -->
                <ion-item-option v-if="hasPermission('canEditReservation')" color="danger" @click="deleteFromWaitList(wait._id)">
                    <span class="iconify" data-icon="mdi:delete" data-inline="false"></span>
                </ion-item-option>
                <!-- send notification -->
                <ion-item-option v-if="hasPermission('canEditReservation')" color="primary" @click="sendMessageWaitList(wait)">
                    <span class="iconify" data-icon="mdi:email-send" data-inline="false"></span>
                </ion-item-option>
                <!-- accept -->
                <ion-item-option v-if="hasPermission('canEditReservation')" color="success" @click="acceptWaitListItem(wait)">
                    <span class="iconify" data-icon="ic:baseline-check" data-inline="false"></span>
                </ion-item-option>  
            </ion-item-options>

          </ion-item-sliding>

          </paginate>

         <paginate
              v-if="!spinner && screenWidth >= 600"
              name="allWaitList"
              :list="allWaitList"
              :per="5"
            >
          <ion-list>
              <ion-item v-for="wait in paginated('allWaitList')" :key="wait._id" style="width: 100%;">
                      
                  <ion-label class="ion-text-wrap menu-col-3">
                      <h2>{{ wait.CustomerName }}</h2>               
                  </ion-label>

                  <ion-label class="ion-text-wrap menu-col-3">
                      <h2>{{ wait.CustomerPhone }}</h2>               
                  </ion-label>

                  <ion-label  class="ion-text-wrap menu-col-3">
                      <h2>{{ wait.Capacity }}</h2>               
                  </ion-label>


                <ion-item-group side="end">
                    <!-- delete -->
                    <ion-button v-if="hasPermission('canEditReservation')" color="danger" @click="deleteFromWaitList(wait._id)">
                        <span class="iconify" data-icon="mdi:delete" data-inline="false"></span>
                    </ion-button>
                    <!-- send notification -->
                    <ion-button v-if="hasPermission('canEditReservation')" color="primary" @click="sendMessageWaitList(wait)">
                        <span class="iconify" data-icon="mdi:email-send" data-inline="false"></span>
                    </ion-button>
                    <!-- accept -->
                    <ion-button v-if="hasPermission('canEditReservation')" color="success" @click="acceptWaitListItem(wait)">
                        <span class="iconify" data-icon="ic:baseline-check" data-inline="false"></span>
                    </ion-button>  
                </ion-item-group>

              </ion-item>
          </ion-list>

          </paginate>

          <paginate-links for="allWaitList" color="primary" 
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
//  import { EventBus } from '../../frontend/event-bus';

export default {
    name: 'Reservation',
     props: {   
      restaurantEmail:  {type: String, default:"" } ,
      allReservations: {type: Array, default:() => [] },
      // allWaitList: {type: Array, default:() => [] },
      reservationDaysAndTime: {type: Array, default:() => [] },
      minDayToReservation: { type: Number, default: 0},
      clientId: {type: String, default: "" } ,
      CustomerName: {type: String, default: "" } , 
      email: {type: String, default: "" }, 
      phone: {type: String, default: "" },     
  },
     data () {
      return {
         screenWidth: 0,
         camera: true,
         bookmark: false,
         heart: false,
         waitlist: false,
         spinner: false,
         paginate: ['allReservations', 'allWaitList'],
         reservations: [],
         theCode: '',
         reservationByCode: {},
         theName:  '', //  theName: this.CustomerName || '',
         theEmail: '', //  theEmail: this.email || '',
         thePhone: '', //  thePhone: this.phone || '',
         dateToReserv: '',
         hourToReserv: '',
         guest: 1,
         noteToReserv: '',
         reasonToReser: '',
         allState: [this.$t('frontend.reservation.state0'), this.$t('frontend.reservation.state1'),
                    this.$t('frontend.reservation.state2'), this.$t('frontend.reservation.state3'),
                    this.$t('frontend.reservation.state4'), this.$t('frontend.reservation.state5'),
                    this.$t('frontend.reservation.state6')],
        segmentValue: 'camera',
        filterStatus: 'all',
        dateToDay: '',
        restaurantConfig: null,
        restaurantCustomer: null,

        //Wait List
        waitlistL: [],
        allWaitList: [],
        waitName: '',
        waitEmail: '',
        waitPhone: '',
        waitPeople: 1,
        filterWaitList: 'todaywaitlist'
      }
     },
     created: function(){
        
       this.screenWidth = screen.width;
       if(this.$route.params.showAllReservation){
         this.segmentChanged('heart')
       }
       
       this.dateToDay = moment.tz(moment.tz.guess()).format('MM-DD-YYYY')    
       this.dateToDay = moment(this.dateToDay, "MM-DD-YYYY").add('days', this.minDayToReservation)
       this.getReservations()
       this.getWaitList()
       this.getRestaurantConfig()
       this.changeWaitlistFilter('todaywaitlist')
       
     },
     methods: {
      

      sendMessageWaitList(wait){

          this.$ionic.alertController.create({
            // title: this.$t('backoffice.list.messages.confirmDelete'),
            title: "Send message",
            // message: this.$t('backoffice.list.messages.deleteCategory'),
            message: "Do you want to send a message to customer?",
            buttons: [
              {
                text: this.$t('backoffice.list.messages.buttons.cancel'),
                role: 'cancel',
                handler: () => {
                }
              },
              {
                // text: this.$t('backoffice.list.messages.buttons.delete'),
                text: "Ok",
                handler: () => {
                  
                  if (wait.CustomerEmail != "")
                  {
                      this.spinner = true
                      console.log("Sending email")
                      let email = {
                        "email": wait.CustomerEmail,
                        "mess": "Your reservation is ready. We are waiting for you. Thanks.",
                        // "subject": this.$t('backoffice.form.marketingMessages.reservationChangeStatus')
                        "subject": "Reservation is Ready"
                      };
                      Api.sendEmail(email)
                      .then(() => {
                          console.log(email)
                          this.spinner = false
                          this.showToastMessage('An email has been sent to the customer successfully.', 'success')
                          this.changeWaitlistFilter(this.filterWaitList)
                      })
                      .catch(e => {
                          console.log(e)
                          this.ifErrorOccured(mess => {
                            this.sendMessageWaitList(wait)
                            this.spinner = false
                            return mess
                          });
                      })
                  }
                  if (wait.CustomerPhone != "")
                  {
                      this.spinner = true
                      console.log("Sending sms")
                      let text = {
                        "phone": wait.CustomerPhone,
                        "mess": "Your reservation is ready. We are waiting for you. Thanks."
                      };
                      Api.sendSms(text)
                      .then(() => {
                          console.log(text)
                          this.spinner = false
                          this.showToastMessage('A text has been sent to the customer successfully.', 'success')
                          this.changeWaitlistFilter(this.filterWaitList)
                      })
                      .catch(e => {
                          console.log(e)
                          this.ifErrorOccured(mess => {
                            this.sendMessageWaitList(wait)
                            this.spinner = false
                            return mess
                          });
                      })
                  }

                }
              }
            ]
          })
          .then(a => a.present());

      },
      acceptWaitListItem(item){

          this.$ionic.alertController.create({
            // title: this.$t('backoffice.list.messages.confirmDelete'),
            title: "Mark as done",
            // message: this.$t('backoffice.list.messages.deleteCategory'),
            message: "Do you want to mark as done this wait list item?",
            buttons: [
              {
                text: this.$t('backoffice.list.messages.buttons.cancel'),
                role: 'cancel',
                handler: () => {
                }
              },
              {
                // text: this.$t('backoffice.list.messages.buttons.delete'),
                text: "Done",
                handler: () => {
                  
                  this.spinner = true;
                  item.State = "Done"
                  console.log(item)
                  Api.putIn('waitlist', item)
                    .then(response => {
                      // this.showToastMessage(this.$t('backoffice.list.messages.messageDeleteSuccessCategory'), "success");
                      this.showToastMessage("The item was successfuly mark as done", "success");
                      this.getWaitList();
                      this.changeWaitlistFilter(this.filterWaitList)
                      this.spinner = false;
                      return response;
                    })
                    .catch(e => {
                      console.log(e);
                      this.ifErrorOccured(mess => {
                          this.acceptWaitListItem(item)
                          this.spinner = false
                          return mess
                      });
                    })

                }
              }
            ]
          })
          .then(a => a.present());

      },
      deleteFromWaitList(id){

            this.$ionic.alertController.create({
            title: this.$t('backoffice.list.messages.confirmDelete'),
            // message: this.$t('backoffice.list.messages.deleteCategory'),
            message: "Do you want to delete this item from wait list",
            buttons: [
              {
                text: this.$t('backoffice.list.messages.buttons.cancel'),
                role: 'cancel',
                handler: () => {
                }
              },
              {
                text: this.$t('backoffice.list.messages.buttons.delete'),
                handler: () => {
                  
                  this.spinner = true;
                  Api.deleteById('waitlist', id)
                    .then(response => {
                      // this.showToastMessage(this.$t('backoffice.list.messages.messageDeleteSuccessCategory'), "success");
                      this.showToastMessage("The item was successfuly deleted from the wait list", "success");
                      this.getWaitList();
                      this.changeWaitlistFilter(this.filterWaitList)
                      this.spinner = false;
                      return response;
                    })
                    .catch(e => {
                      console.log(e);
                      this.ifErrorOccured(mess => {
                          this.deleteFromWaitList(id)
                          this.spinner = false
                          return mess
                      });
                    })

                }
              }
            ]
          })
          .then(a => a.present());

      },
      changeWaitlistFilter(value){

            console.log(value)
            this.filterWaitList = value
            this.allWaitList = this.waitlistL
            if (value == 'allwaitlist')
            {
                this.allWaitList = this.waitlistL
            }
            if (value == 'activewaitlist')
            {
                requestAnimationFrame(() => {
                  let cat = this.allWaitList.filter(item => {
                      return item.State != "Done"
                  }) 
                  this.allWaitList = cat
                })
            }
            if (value == 'todaywaitlist')
            {
                requestAnimationFrame(() => {   
                  let cat2 = this.allWaitList.filter(item => {
                      //  const storeDate = moment(item.Date, 'YYYY/MM/DD')
                       const storeDate = item.Date.split('T')[0]
                       const now = moment().format('YYYY-MM-DD')
                      //  console.log("SD: " + storeDate)
                      //  console.log("NOW: " + now)
                       return storeDate == now 
                  })
                  console.log(cat2)
                  this.allWaitList = cat2
                })
            }
        },
        changeFilterStatus(value){
            console.log(value)
            let status = -1
            this.filterStatus = value
            this.allReservations = this.reservations
            if (value == 'all')
            {
                this.allReservations = this.reservations
                return
            }
            if (value == 'request')
            {
                status = 0
            }
            if (value == 'approved')
            {
                status = 1
            }
            if (value == 'proposed')
            {
                status = 2
            }
            if (value == 'confirmed')
            {
                status = 4
            }
            if (value == 'rejected')
            {
                status = 3
            }
            if (value == 'canceled')
            {
                status = 5
            }
            if (value == 'close')
            {
                status = 6
            }
            console.log(status)
            requestAnimationFrame(() => {   
              let cat2 = this.allReservations.filter(item => item.State == status)
              this.allReservations = cat2
            })
        },
        handleInput(value){

          this.filterStatus = 'all'
          const query = value.toLowerCase();
          if (value != '')
          {
              requestAnimationFrame(() => {   
              let cat2 = this.allReservations.filter(item => item.CustomerName.toLowerCase().indexOf(query) > -1 ||
                  item.Code.toLowerCase().indexOf(query) > -1 || item.CustomerEmail.toLowerCase().indexOf(query) > -1 ||
                  item.CustomerPhone.toLowerCase().indexOf(query) > -1)
              if(cat2.length> 0)
                this.allReservations = cat2
              else
                this.allReservations = this.reservations
            });
          }
          else this.allReservations = this.reservations
          
        },

       sendEmail(reservation, mess){
            let email = {
              "email": reservation.CustomerEmail,
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

        sendSMS(reservation, mess){
            let text = {
              "phone": reservation.CustomerPhone,
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

        getRestaurantConfig: function(){
            console.log("Step1")
            Api.fetchById('Restaurant', this.$store.state.user.RestaurantId).then(response => {
                    this.restaurantConfig = response.data;
                    this.getRestaurantCustomer();
            })
            .catch(e => {
                console.log(e)
            });
        },
        getRestaurantCustomer: function(){
            console.log("AQUI")
            Api.findCustomerByEmail(this.restaurantConfig.Email)
            .then(response => { 
                this.restaurantCustomer = response.data
                console.log("RESTAURANT CUSTOMER")
                console.log(this.restaurantCustomer)
            })
        },
         
      hasPermission(permission){
        
        let res = false;
        if (this.$store.state.authenticated)
        {
                let roles = this.$store.state.roles;
                for (let index = 0; index < roles.length; index++) {
                    switch(permission){                        
                        case 'canCreateReservation':
                            res = roles[index].canCreateReservation;
                            break;
                        case 'canEditReservation':
                            res = roles[index].canEditReservation;
                            break;
                        case 'canDeleteReservation':
                            res = roles[index].canDeleteReservation;
                            break;
                        default:
                            break;
                    }
                    if (res)
                    { 
                        return res;
                    }              
                }
            }
            return res;
        },
         
      segmentChanged(value){            
             console.log(value)
             if(value === 'camera'){
                 this.camera = true;
                 this.bookmark = false;
                 this.heart = false;
                 this.waitlist = false;
             }
             if(value === 'bookmark'){
                 this.camera = false;
                 this.bookmark = true;
                 this.heart = false;
                 this.waitlist = false;
             }  
             if(value === 'heart'){
                 this.camera = false;
                 this.bookmark = false;
                 this.heart = true;
                 this.waitlist = false;                
             }
             if(value === 'waitlist'){
                 this.camera = false;
                 this.bookmark = false;
                 this.heart = false;
                 this.waitlist = true;
                 this.changeWaitlistFilter('todaywaitlist')        
             }
             this.segmentValue = value;

         },

      approve(reservation){
          this.spinner = true
          reservation.State = 1
          Api.putIn('Reservation', reservation)
          .then(response => {
              console.log(response)
              this.sendEmail(reservation, this.$t('backoffice.form.marketingMessages.reservationApproved'))
              this.sendSMS(reservation, this.$t('backoffice.form.marketingMessages.reservationApproved'))
              this.getReservations()
              this.spinner = false
          })
          .catch(e => {
              this.spinner = false
              console.log(e)
          })

      },

      close(reservation){
          this.spinner = true
          reservation.State = 6
          Api.putIn('Reservation', reservation)
          .then(response => {
              console.log(response)
              // this.sendEmail(reservation, this.$t('backoffice.form.marketingMessages.reservationApproved'))
              // this.sendSMS(reservation, this.$t('backoffice.form.marketingMessages.reservationApproved'))
              this.getReservations()
              this.spinner = false
          })
          .catch(e => {
              this.spinner = false
              console.log(e)
          })

      },

      getReservations: function(){
        //   if(this.clientId =='')
        //     return false;
        //     this.spinner = true
        //     Api.getCustomerReservations(this.clientId)
        //     .then(response => {
        //         this.allReservations = response.data  ;
        //         EventBus.$emit('updateAllReservations', this.allReservations);
        //         this.spinner = false 
        //         console.log(response.data)         
        //     })
        //     .catch(e => {
        //       this.spinner = false 
        //         console.log(e);            
        //     }) 
            this.spinner = true 
            Api.fetchAll('Reservation')
            .then(response => {
                this.allReservations = response.data
                this.allReservations.reverse()
                this.reservations = this.allReservations
                this.spinner = false 
                console.log("ALL RESERVATIONS")
                console.log(this.allReservations)
            })
            .catch(e => {
                this.spinner = false
                console.log(e)
            })

        },

      getWaitList: function(){
          this.spinner = true 
            Api.fetchAll('Waitlist')
            .then(response => {
                this.allWaitList = response.data
                this.allWaitList.reverse()
                this.waitlistL = this.allWaitList
                this.spinner = false 
                console.log("ALL WAIT LIST")
                console.log(this.allWaitList)
                this.changeWaitlistFilter(this.filterWaitList)
            })
            .catch(e => {
                this.spinner = false
                console.log(e)
            })
      },

      findByCode(){
        console.log('theCode :' + this.theCode);
        if(this.theCode === '')
          return ('inserte un codigo valido')
         this.spinner = true;
        Api.getReservationByCode(this.theCode)
            .then(response => {
                this.reservationByCode = response.data  
                this.spinner = false;
                console.log(this.reservationByCode)       ;
            })
            .catch(e => {
              this.spinner = false 
                console.log(e);            
            }) 
      },

      async createCustomer(client){
            Api.postIn('Customer', client)
            .then(response => {
                console.log(response)
                return response.data;            
            })
            .catch(e => {
                console.log(e) 
            })
        },

      isValidForm(){
          if(this.theName===''  || this.theEmail==='' || this.thePhone ==='' ||
            this.dateToReserv === '' || this.hourToReserv=== '' || this.guest < 1)
              return false
          return true
      },
    
      async saveReservation(){

        // if(this.clientId !=''){
        //   this.theName= this.CustomerName;
        //  this.theEmail= this.email;
        //  this.thePhone = this.phone ;
        //   if(this.dateToReserv === '' || this.hourToReserv=== '' || this.guest < 1)
        //     return this.alertRequiredDatas();
        // }
        // else{
        //     console.log(this.theName)
        //     console.log(this.theEmail)
        //     console.log(this.thePhone)
        //     console.log(this.dateToReserv)
        //     console.log(this.hourToReserv)
        //     console.log(this.guest)
        // if(this.theName===''  || this.theEmail==='' || this.thePhone ==='' ||
        // this.dateToReserv === '' || this.hourToReserv=== '' || this.guest < 1)
        //     return this.alertRequiredDatas();
        // }          


        if (this.restaurantCustomer == null)
        {
            console.log("Cliente no existe")
            let client = {
                'Name': this.restaurantConfig.Name,
                'EmailAddress': this.restaurantConfig.Email,
                'Phone':  this.restaurantConfig.Phone,
            }
            const res = await this.createCustomer(client);   
            this.restaurantCustomer = res;
        }

        const Reservation = {
        "CustomerId" : this.restaurantCustomer._id,
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

        console.log(Reservation)

        try {
          this.spinner = true;
          const response = await Api.postIn('Reservation', Reservation);
          console.log(response);
          if(response.status === 200){
            this.dateToReserv = ''; this.hourToReserv = '' ; this.guest = 1;
            this.noteToReserv = ''; this.reasonToReser = ''; this.spinner = false;
            this.openToast();
            //  if(this.clientId !== '') 
            //   this.sendReservationEmail(Reservation);
            this.getReservations();  
            this.segmentChanged('heart');
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
          return this.$router.push({ name: 'ReservationDetails', params: {reservation: reservation } })    
      },
      sendReservationEmail(reservation){
           
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
           
            html += `</td></tr>`;      
           
            html += `</table></div></body></html>`;

            let subject = this.$t('frontend.reservation.create') ;
            
                    
            var items = {
                "email": this.restaurantEmail,
                "mess": html,
                "subject": subject
            }
            Api.sendEmail(items);
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

    alertRequiredDatas(){
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: 'Error',
          message: this.$t('frontend.home.errorRequired'),
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
          position: 'center',
          color:'success'
        })
      .then(a => a.present())
    },

    isValidWaitList(){

        if (this.waitName == "")
          return false
        if (this.waitEmail == "" && this.waitPhone == "")
          return false

        if (this.waitEmail != "")
        {
            const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
            if (emailRegex.test(this.waitEmail) == false)
            {
                return false
            }
        }
        
        if (this.waitPeople == "" || this.waitPeople < 1)
          return false

        return true

    },

    saveWaitList(){
        let item = {
            'CustomerName': this.waitName,
            'CustomerEmail': this.waitEmail,
            'CustomerPhone': this.waitPhone,
            'Capacity': this.waitPeople,
            // 'Date': moment().format('YYYY/MM/DD')
        }
        console.log(item)
        Api.postIn('waitlist', item)
        .then(response => {
            console.log(response.data)
            this.showToastMessage('Wait list update', 'success')
            this.getWaitList()
            this.clearWaitFields()
            console.log("Change waitlist: " + this.filterWaitList)
            this.changeWaitlistFilter(this.filterWaitList)
        })
        .catch(e => {
            console.log(e)
        })
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
          if(reservation.State)
            html += `<br> <h4> ${this.$t('frontend.home.state')}: ${this.allState[reservation.State]}</h4>`;
          
          html += `</td></tr>`;      
          
          html += `</table></div></body></html>`;


          var winimp = window.open('/print', 'popimpr');         
          winimp.document.write( html );
          winimp.document.close();
          winimp.focus();
          winimp.print();
          winimp.close();
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

    clearWaitFields(){
        this.waitName = ''
        this.waitEmail = ''
        this.waitPhone = ''
        this.waitPeople = 1
    },

    async toastInfoHorarios() {

      let html = '';
      for (const iterator of this.reservationDaysAndTime) {
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
              // side: 'start',
              icon: 'close',
              text: 'Done',
              role: 'cancel',
              handler: () => {
                console.log('Favorite clicked');
              }
            }
          ]
        })
      .then(a => a.present())
    },


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