<template>
    <div id="product" class="product">

           <ion-header>
          <ion-toolbar>
           <ion-buttons slot="start">
              <ion-back-button default-href="/payment" @click="$router.push({ name: 'Payment'})"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
                <h1> Detalles del Pago</h1>            
                       
            </ion-label>
          </ion-toolbar>
        </ion-header>

         <div v-if="spinner1">
            <ion-spinner  name="lines" class="spinner"></ion-spinner>
        </div>

            <div  style="argin-top: 10px;">

                <span > 
                    <ion-card >

                        <p > <ion-label class="ion-text-wrap" >
                            <h2  style="width: 100%;float: left;text-align: left; padding: 0 15px; color: black;">
                            {{ payment.ModelFrom }}:<a><strong style="text-decoration: underline" @click="viewOrder(payment.ModelFrom, payment.ModelId)">  {{payment.InvoiceNumber}} </strong></a> </h2>
                        </ion-label></p>  

                        <p > <ion-label class="ion-text-wrap" >
                            <h2  style="width: 100%;float: left;text-align: left; padding: 0 15px; color: black;">
                            {{$t('frontend.reservation.completeDateReservacion')}}:<strong>  {{getReservationDate(payment.Date)}} </strong> </h2>
                        </ion-label></p>  

                        <p > <ion-label class="ion-text-wrap" >
                            <h2 style="width: 100%;float: left;text-align: left; padding: 0 15px; color: black;">
                           Pagado por:<strong>  {{payment.Method}} </strong> </h2>
                        </ion-label></p> 

                         <p v-if="payment.StaffName"> <ion-label class="ion-text-wrap" >
                            <h2  style="width: 100%;float: left;text-align: left; padding: 0 15px; color: black;">
                            {{$t('frontend.orderType.worker')}}:<strong>  {{payment.StaffName}} </strong> </h2>
                        </ion-label></p>                           
                                                     
                        <ion-item-divider style="margin-bottom: 15px;"/>

                        <p > <ion-label class="ion-text-wrap" >
                            <h2 style="width: 100%;float: left;text-align: left; padding: 0 15px; color: black;">
                            Pagado: <strong> {{getFormatPrice(payment.Payment)}} </strong> </h2>
                        </ion-label></p>

                        <p > <ion-label class="ion-text-wrap" >
                            <h2  style="width: 100%;float: left;text-align: left; padding: 0 15px; color: black;">
                            Void: <strong>{{getFormatPrice(payment.Void)}} </strong> </h2>
                        </ion-label></p>

                        <p > <ion-label class="ion-text-wrap" >
                            <h2  style="width: 100%;float: left;text-align: left; padding: 0 15px; color: black;">
                            Refund: <strong> {{getFormatPrice(payment.Refund)}} </strong> </h2>
                        </ion-label></p>

                        <p > <ion-label class="ion-text-wrap" >
                            <h2  style="width: 100%;float: left;text-align: left; padding: 0 15px; color: red;">
                            TOTAL:<strong> {{getTotal()}} </strong> </h2>
                        </ion-label></p>

                         

                    </ion-card>
                  
                    
                </span>

                
            </div>

        


    </div>
</template>

<script>
// import Stepper from '../components/Stepper'
import { add } from "ionicons/icons";
import { addIcons } from "ionicons";
// import { VBreakpoint } from 'vue-breakpoint-component'
import { Api } from '../../backoffice/api/api.js';
import moment from 'moment-timezone';

addIcons({
  "ios-add": add.ios,
  "md-add": add.md
});

export default {
    name: 'ReservationState', 
    components:{
        // VBreakpoint: VBreakpoint
    },
     props:{          
        
     }, 
    created: function(){
         if(this.$route.params.payment){
             this.payment = this.$route.params.payment;
         }
          if(this.$route.params.currency){
             this.currency = this.$route.params.currency;
         }
    }, 
    data() {
        return {   
            payment: {},
            currency: 'USD' ,         
            spinner1: false,           
            spinnerPayment: false,
            key: 0,
        }
    }, 
 
    methods:{         
      
        chargePayment(){            
            this.spinner1 = true;
            Api.fetchById('Payment', this.payment._id).then(response => {
                if(response.status === 200){ 
                    this.key++;          
                    this.payment = response.data;  
                    this.spinner1 = false  
            }                   
        })
        .catch(e => {
            this.spinner1 = false;
            console.log(e)
        
        });

        },

        getFormatPrice(price){
            let result = price
            if(this.currency !== '')
            result = new Intl.NumberFormat('en', {style: "currency", currency: this.currency} ).format(price);
            return result;
        }, 
        
        getReservationDate(thisDate){
        return  moment.tz(thisDate, moment.tz.guess()).format('MM-DD-YYYY') 
      },

      getTotal(){
          const rest = parseFloat(this.payment.Payment) - this.payment.Refund - this.payment.Void
          return this.getFormatPrice(rest);

      },

       viewOrder: async function(from, id){
           if(from ==='Order' || from ==='Catering'){
                this.$router.push({
                name: 'OrderDetails', 
                params: { orderId: id }
                });
           }
           else if(from=='Reservation'){
              try {
                  this.spinner1 = true;
                const reservation = await Api.fetchById('Reservation', id);
                 this.spinner1 = false;
                if(reservation)
                this.$router.push({
                    name: 'ReservationDetails',
                    params: {reservation: reservation.data }
                    }) 
                
              } catch (error) {
                  this.spinner1 = false;
                  console.log(error);
                  
              }                 
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