<template>
<div>
  
      
  <ion-toolbar>
       <ion-card-title style="text-align: left;padding: 10px;">
           <!-- {{$t('frontend.reservation.reservations')}} -->

      </ion-card-title>
      
    <ion-segment id="reservationSegment" @ionChange="segmentChanged($event.target.value)" :value="segmentValue" @input="value=segmentValue">
      <ion-segment-button value="camera">
        <span class="iconify" data-icon="vs:profile" data-inline="false"></span>
          {{$t('frontend.menu.profil1')}}
          <!-- ADD -->
      </ion-segment-button>
      <ion-segment-button value="bookmark" v-if="restaurantSelectedId !==''">
        <span class="iconify" data-icon="bi:list-task" data-inline="false"></span>
        {{$t('frontend.order.yourOrders')}}
          <!-- SEARCH -->
      </ion-segment-button>
          <ion-segment-button value="heart" v-if="restaurantSelectedId !==''">
          <span class="iconify" data-icon="bi:list-task" data-inline="false"></span>
          {{$t('frontend.reservation.yoursReservations')}}
          <!-- LIST -->
    </ion-segment-button>
    </ion-segment>
   
  </ion-toolbar>

  <div v-if="camera" style="margin: 0 auto;">
      <hr>

     
        <ion-card >

          <div v-if="spinner" class="menu-col-12">
              <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
          </div>

           <ion-label class="ion-text-wrap menu-col-12" v-if="clientId ===''">
            <p style="display: inline-block; text-align: center; font-style: italic;color: red;font-weight: 500;" color="danger" v-if="clientId ===''" class="ion-text-wrap menu-col-12">
                <span class="iconify" data-icon="el:error-alt" data-inline="false" style="color: red; margin: 5px 0 0 15px; width: 18px;height: 18px;"></span>
                {{$t('frontend.home.clientRequired')}}</p>
            </ion-label> 

             <div   class="menu-col-12">
              <ion-item>
                <p class="menu-col-4"><strong>{{$t('frontend.orderType.name')}} </strong></p>
                <ion-input readonly=true type="text">{{CustomerName}}</ion-input>
              </ion-item>
              <ion-item>
                <p class="menu-col-4"><strong>{{$t('frontend.orderType.email')}} </strong></p>
                <ion-input readonly=true type="text">{{email}}</ion-input>
              </ion-item>
              <ion-item>
                <p class="menu-col-4"><strong>{{$t('frontend.orderType.phone')}} </strong></p>
                <ion-input readonly=true type="text">{{phone}}</ion-input>
              </ion-item> 
               <ion-item>
                <p class="menu-col-4"><strong>{{$t('frontend.orderType.contactedBy')}} </strong></p>
                <ion-input readonly=true type="text" v-if="marketingEmail">{{$t('frontend.orderType.email')}}</ion-input>
                <ion-input readonly=true type="text" v-if="marketingPhone">{{$t('frontend.orderType.phone')}}</ion-input>
              </ion-item>                       
          </div>       
         
        </ion-card>  

        <ion-button v-if="!spinner  && clientId !==''" @click="editInfo">{{ this.$t('frontend.menu.edit') }}</ion-button>

        



  </div>
  
  <div v-if="bookmark">
    <hr>
      <list-order
           
            :products ="this.products"           
            :fromMyAccount="'bookmark'"
           
          
      ></list-order>
    
      
        
  </div>

  <div v-if="heart">
        <hr>
           <ion-card-title>
      {{$t('frontend.reservation.yoursReservations')}}
       <ion-button fill="outline" style="float: right; margin-right: 10px;" @click="$router.push({ name: 'Reservation' })" v-tooltip="$t('frontend.tooltips.addOrder')"> +  </ion-button>

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
        <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
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
                  <h2>{{ reservation.Capacity }}</h2>               
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
                    <span class="iconify" data-icon="ic:round-local-printshop" data-inline="false"></span>
                </ion-item-option>  

            </ion-item-options>

          </ion-item-sliding>

          </paginate>

          <paginate-links
         
           for="allReservations"
           color="primary" 
          @change="onLangsPageChange()"  
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
import moment from 'moment-timezone';
import { EventBus } from '../event-bus';
import ListOrder from './ListOrder'
import { Commons } from '../commons'


export default {
    name: 'Myaccount',
     props: {   
     
  },
     data () {
      return {
         restaurantSelectedId : '',
         products : [],
         camera: true,
         bookmark: false,
         heart: false,
         spinner: false,
         allReservations: [], 
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
        currentPageReservation: 1,
        customerObj: {},
        clientId: '',
        CustomerName: '', 
        email: '', 
        phone: '',  
        marketingEmail: false,
        marketingPhone: false ,          
        allOrders: [],
        order: {},
        configuration: {},
        restaurantActive: {},
        coordinates: {
            lat: 0,
            lng: 0
          },
        driverName: '',
        isTravel: false,
        spinnerEmail: false,
      }
     },
     components:{
       ListOrder: ListOrder,      
     },
     mounted: function(){
        if(this.$route.params.currentPageReservation > 1){
          this.currentPageReservation = this.$route.params.currentPageReservation; 
           this.$refs.paginator.goToPage(this.currentPageReservation);
       }

     },
     created: function(){

       this.restaurantSelectedId = this.$store.state.restaurantActive.restaurantId || ''; 
       this. products = this.$store.state.products|| [];

       if(this.$store.state.customer._id){
          this.clientId= this.$store.state.customer._id;
        this.CustomerName= this.$store.state.customer.Name;
        this.email= this.$store.state.customer.EmailAddress;
        this.phone=this.$store.state.customer.Phone;
        this.marketingEmail=this.$store.state.customer.MarketingConsent.Email;
        this.marketingPhone=this.$store.state.customer.MarketingConsent.Phone; 
       }
        this.customerObj = JSON.parse(JSON.stringify(this.$store.state.customer))
        
        this.allOrders = this.$store.state.allOrders;
        this.order = this.$store.state.order;        
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
    

       if(this.$route.params.fromMyAccount){
         this.segmentChanged(this.$route.params.fromMyAccount);        
       }         

       
       this.dateToDay = moment.tz(moment.tz.guess()).format('MM-DD-YYYY'),    
       this.dateToDay = moment(this.dateToDay, "MM-DD-YYYY").add('days', this.configuration.minDayToReservation);

       
     


      
       
     },
     methods: {   

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
                 if (this.$refs.paginator) {
                    this.$refs.paginator.goToPage(this.currentPageReservation)
    }
             }
             this.segmentValue = value;

         },

      editInfo(){
        EventBus.$emit('editInfoClient', true ); 
      },

     
      getReservationDate(thisDate){
        return  moment.tz(thisDate, moment.tz.guess()).format('MM-DD-YYYY') 
      },

       getReservationHour(thisHour){
        return  moment.tz(thisHour, moment.tz.guess()).format('hh:mm A') 
      },

      getReservationState(reservation){
          return this.$router.push({ name: 'ReservationDetail', params: {reservation: reservation, fromMyAccount: 'heart', currentPageReservation: this.currentPageReservation } })    
      },

    
      sendPrint:  function(reservation){

           const html = Commons.htmlSendReservation(reservation);
          var winimp = window.open('/print', 'popimpr');         
          winimp.document.write( html );
          winimp.document.close();
          winimp.focus();
          winimp.print();
          winimp.close();
        },

      
      async sendReservationCustomer(reservation){

            this.spinnerEmail = true;
            const html = Commons.htmlSendReservation(reservation);
            let subject = this.$t('frontend.reservation.create') ;            
                    
            var items = {
                "email": reservation.CustomerEmail,
                "mess": html,
                "subject": subject
            }
            await Api.sendEmail(items);
            this.spinnerEmail = false;
      },

       onLangsPageChange () {   
                this.currentPageReservation = this.$refs.paginator.currentPage + 1;        
       },

    async doRefresh(event) {    
        await this.getReservations();      
        event.target.complete();
    },

     getReservations: async function(){
          if(this.clientId =='')
            return false;
           
            await Api.getCustomerReservations(this.clientId)
            .then(response => {
                this.$store.commit('setAllReservations', response.data)
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