
<template>

  <div id="order" class="screen">
    <ion-backdrop v-if="isBackdrop"></ion-backdrop>
    <!-- <router-link to="/controlPanel"><ion-button expand="full" color="tertiary"><ion-icon name="hammer"></ion-icon>{{$t('backoffice.list.buttons.goToControlPanel')}}</ion-button></router-link>
    <router-link to="/order"><ion-button expand="full" color="tertiary"><ion-icon name="arrow-round-back"></ion-icon>{{$t('backoffice.form.buttons.backToOrdersList')}}</ion-button></router-link>   -->

    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="goToBack()"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>{{$t('frontend.order.orderDetail')}}</h1>           
            </ion-label>
          </ion-toolbar>
    </ion-header>
    <br/>


<!-- 
        <ion-item v-if="order.State == 1">
            <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.cooker')}}</ion-label>
            <ion-input type="text" name="cooked"
            @input="cooked = $event.target.value" 
            v-bind:value="cooked">
            </ion-input>
        </ion-item> -->
    <div v-if="spinner">
        <ion-spinner name="lines" class="spinner"></ion-spinner>
    </div>
    <div v-else>
      

        <ion-grid>
            <ion-row class="left">
                <ion-col>
                    <div v-if="customer"><span class="title">{{$t('backoffice.form.titles.customer')}}:</span> {{customer.Name}}</div>
                    <div v-else><span class="title">{{$t('backoffice.form.titles.customer')}}:</span> {{order.CustomerName}}</div>
                </ion-col>
            </ion-row>
            <ion-row class="left">
                <ion-col>
                    <div><span class="title">{{$t('backoffice.form.titles.date')}}:</span> {{getFormatedDate(order.Date)}}</div>
                </ion-col>               
            </ion-row>
            <ion-row class="left">                
                <ion-col>
                    <div><span class="title">{{$t('backoffice.form.titles.orderType')}}:</span> {{order.OrderType}}</div>
                </ion-col>
            </ion-row>
            <ion-row class="left">
                <ion-col>
                    <div v-if="order.OrderType == 'Delivery'"><span class="title">{{$t('backoffice.form.titles.addressToDelivery')}}:</span> {{order.AddressToDeliver}}</div>
                    <div v-if="order.OrderType == 'PickUp' || order.OrderType == 'Curbside' "><span class="title">{{$t('backoffice.form.titles.hourToPick')}}:</span> {{order.HourToPick}}</div>
                    <div v-if="order.OrderType == 'On Table'"><span class="title">{{$t('backoffice.form.titles.tableService')}}:</span> {{order.tableService}}</div>
                </ion-col>
            </ion-row>
            <ion-row class="left" v-if="order.OrderType == 'Curbside' ">
                <ion-col>
                    <span class="title">{{$t('frontend.home.curbsideDetail')}}</span> 
                    <div><span >{{$t('frontend.orderType.licencePlate') }}: </span> {{order.LicencePlate}}</div>
                    <div><span>{{$t('frontend.orderType.vehicleModel') }}: </span> {{order.VehicleModel}}</div>
                    <div><span >{{$t('frontend.orderType.vehicleColor') }}: </span> {{order.VehicleColor}}</div>
                    <ion-item v-if="order.CarArrived" >
                        <h2 style="display: contents;">{{$t('frontend.tooltips.carInRestaurant') }}</h2>     
                        <span class="iconify" data-icon="clarity:car-solid" data-inline="false" style="width: 40px;height: 40px; float: left; margin: 15px;color: #48bc76;"></span>                               
                    </ion-item>
                </ion-col>
            </ion-row>
        </ion-grid>
        <br/>

        <ion-grid v-if="order.StaffName">
            <ion-row class="left">
                <ion-col>
                    <div><span class="title">{{$t('backoffice.form.fields.serverName')}}:</span> {{order.StaffName}}</div>
                </ion-col>
            </ion-row>
        </ion-grid>
        <br v-if="order.StaffName" />
        
        <ion-grid>
            <ion-row class="left">
                <ion-col>
                    <div><span class="title">{{$t('backoffice.form.titles.products')}}:</span></div>
                </ion-col>
            </ion-row>
            <div v-for="product in order.Products" :key="product._id">
                <ion-row class="left" v-if="!product.isService">
                    <ion-col size="3">
                        <div>{{product.Name}}</div>
                    </ion-col>
                    <ion-col size="2">
                        <div>{{product.Cant}}</div>
                    </ion-col>
                    <ion-col size="2">
                        <div class="end"> {{getFormateNumber(product.Price)}}</div>
                    </ion-col>
                    <ion-col size="5">
                        <div style="background-color: yellow">{{product.Note}}</div>
                    </ion-col>
                </ion-row>
            </div>
        </ion-grid>
        <ion-grid v-if="haveServices()">
            <ion-row class="left">
                <ion-col>
                    <div><span class="title">{{$t('backoffice.form.titles.services')}}:</span></div>
                </ion-col>
            </ion-row>
            <div v-for="product in order.Products" :key="product._id">
                <ion-row class="left" v-if="product.isService == true">
                    <ion-col size="3">
                        <div>{{product.Name}}</div>
                    </ion-col>
                    <ion-col size="2">
                        <div>{{product.Cant}}</div>
                    </ion-col>
                    <ion-col size="2">
                        <div class="end">{{ getFormateNumber(product.Price)}}</div>
                    </ion-col>
                    <ion-col size="5">
                        <div style="background-color: yellow">{{product.Note}}</div>
                    </ion-col>
                </ion-row>
            </div>
        </ion-grid>
        <ion-grid>
            <ion-row v-if="order.OtherCharges.length > 0" class="left">
                <ion-col>
                    <div><span class="title">{{$t('backoffice.form.titles.otherCharges')}}:</span></div>
                </ion-col>
            </ion-row>
            <ion-row v-for="otherCharge in order.OtherCharges" :key="otherCharge._id" class="left">
                <ion-col size="10">
                    <div>{{otherCharge.Name}}</div>
                </ion-col>
                <ion-col size="2">
                    <div class="end">{{ getFormateNumber(otherCharge.Price)}}</div>
                </ion-col>
            </ion-row>
        </ion-grid>
        <div v-if="order.Deadline && order.State != 6">
            <ion-grid v-if="order.Deadline.length > 0 ">
                <ion-row class="left">
                    <ion-col>
                        <div><span class="title">{{$t('backoffice.form.fields.deadlines')}}:</span></div>
                    </ion-col>
                </ion-row>
                <ion-row class="left">
                    <ion-col size="4">
                        {{$t('backoffice.form.fields.percent')}}
                    </ion-col>
                    <ion-col size="4">
                        {{$t('backoffice.form.fields.date')}}
                    </ion-col>
                    <ion-col size="4">
                        {{$t('backoffice.form.fields.states')}}
                    </ion-col>
                </ion-row>
                <ion-row v-for="deadLine in order.Deadline" :key="order.Deadline.indexOf(deadLine)" class="left">
                    <ion-col size="4">
                        <div>{{deadLine.Percent}}%</div>
                    </ion-col>
                    <ion-col size="4">
                        <div>{{getFormatedDate(deadLine.Date)}}</div>
                    </ion-col>
                    <ion-col size="4" v-if="deadLine.State == 1">
                        <div class="end">{{$t('backoffice.form.titles.payed')}} {{ getFormateNumber(deadLine.AmountPayed)}}</div>
                    </ion-col>
                    <ion-col v-else>
                        <div class="end"><ion-button @click="payDeadLine(order.Deadline.indexOf(deadLine))">{{$t('frontend.order.pay')}}</ion-button></div>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </div>
        <br/>

        <ion-grid v-if="order.Payment && order.Payment.length > 0">
            <ion-row class="left">
                <ion-col>
                    <div><span class="title">{{$t('backoffice.titles.payments')}}:</span></div>
                </ion-col>
            </ion-row>
            <ion-row class="left">
                <ion-col size="2">
                    <div><span class="title">{{$t('backoffice.form.fields.amount')}}</span></div>
                </ion-col>
                <ion-col size="3">
                    <div><span class="title">{{$t('frontend.order.transId')}}</span></div>
                </ion-col>
                <ion-col size="3">
                    <div><span class="title">{{$t('frontend.order.paymentMethod')}}</span></div>
                </ion-col>
                
                <ion-col size="4">
                </ion-col>
            </ion-row>
            <div v-for="pay in order.Payment" :key="order.Payment.indexOf(pay)">
                <ion-row class="left">
                    <ion-col size="2">
                        <div class="end" v-if="pay.paymentInfo">{{ pay.paymentInfo.total }}</div>
                    </ion-col>
                    <ion-col size="3">
                        <div v-if="pay.paymentInfo">{{ pay.paymentInfo.transId }}</div>
                    </ion-col>
                    <ion-col size="3">
                        <div v-if="pay.paymentInfo">{{ pay.PaymentMethod }}</div>
                    </ion-col>
                    
                    <ion-col size="4" v-if="pay.paymentInfo">
                        <div v-if="pay.state == 1" >
                            <div style="float: left; text-align: center;"> <!-- v-if="pay.paymentInfo.method != 'Device'"--> 
                                <ion-input type="number" :value="count=pay.total" @ionChange="count= $event.target.value"></ion-input>
                                <ion-button color="danger" @click="setRefund(pay, order.Payment.indexOf(pay), count)">Refund</ion-button>
                            </div>
                            <div style="text-align: center;padding-top: 38.75px;">
                                <ion-button color="danger" @click="setVoid(pay, order.Payment.indexOf(pay), count)">Void</ion-button>
                            </div>

                
                        </div>
                        <div v-if="pay.state == 2">
                            <span class="title" v-if="pay.refundValue">{{$t('frontend.home.state')}}: Refund: {{getFormateNumber(pay.refundValue)}}</span> 
                            <span class="title" v-else>{{$t('frontend.home.state')}}: Refund: {{getFormateNumber(pay.total)}}</span> 
                        </div>
                        <div v-if="pay.state == 3">
                            <span class="title" v-if="pay.voidValue">{{$t('frontend.home.state')}}: Void: {{getFormateNumber(pay.voidValue)}}</span>
                            <span class="title" v-else>{{$t('frontend.home.state')}}: Void: {{getFormateNumber(pay.total)}}</span>
                        </div>
                    </ion-col>
                </ion-row>
            </div>
        </ion-grid>

        <br/>


        <ion-grid>
            <ion-row v-if="order.OrderType == 'Delivery'">
                <ion-col>
                    <div class="end"><span class="title">{{$t('backoffice.form.titles.shippingPrice')}}:</span>{{ getFormateNumber(order.Shipping)}}</div>
                </ion-col>
            </ion-row>
            <ion-row v-if="order.Discount">
                <ion-col>
                    <div class="end"><span class="title">{{$t('backoffice.form.fields.discount')}}:</span>{{ getFormateNumber(order.Discount)}}</div>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col>
                    <div class="end"><span class="title">{{$t('backoffice.form.titles.subtotal')}}:</span>{{ getFormateNumber(order.SubTotal)}}</div>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col>
                    <div class="end"><span class="title">{{$t('backoffice.form.titles.tax')}}:</span> {{ getFormateNumber(calcTax)}} ({{order.Taxe}}%)</div>
                </ion-col>
            </ion-row>
             <ion-row>
                <ion-col>
                    <div class="end"><span class="title">{{$t('backoffice.form.titles.tip')}}:</span> {{ getFormateNumber(calcTip)}} ({{order.Tip}}%)</div>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col>
                    <div class="end"><span class="title">{{$t('backoffice.form.titles.total')}}:</span> {{ getFormateNumber(order.Total)}}</div> 
                </ion-col>
            </ion-row>
            <div v-if="cType != 'order'">
                <ion-row>
                    <ion-col>
                        <div class="end" style="color: red"><span class="title">{{$t('backoffice.form.titles.pendingPay')}}:</span> {{ getFormateNumber(pendingPay)}}</div> 
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col>
                        <div class="end" style="color: darkblue"><span class="title">{{$t('backoffice.form.titles.payed')}}:</span> {{ getFormateNumber(payed)}}</div> 
                    </ion-col>
                </ion-row>
            </div>
        </ion-grid>
        <br/>

        <ion-grid>
            <ion-row v-if="order.Note" class="left">
                <ion-col>
                    <span class="title">{{$t('backoffice.form.titles.notes')}}:</span>
                </ion-col>
            </ion-row>
            <ion-row v-if="order.Note" class="left">
                <ion-col>
                    {{order.Note}}
                </ion-col>
            </ion-row>
            <ion-row v-if="order.State == 6" class="left">
                <ion-col>
                    <span class="title">{{$t('backoffice.form.titles.cancelNotes')}}:</span>
                </ion-col>
            </ion-row>
            <ion-row v-if="order.State == 6" class="left">
                <ion-col>
                    {{order.CancelNote}}
                </ion-col>
            </ion-row>
            <ion-row v-if="order.Cooker" class="left">
                <ion-col>
                    <span class="title">{{$t('backoffice.form.titles.cooker')}}:</span> {{getWorker(order.Cooker)}}
                </ion-col>
            </ion-row>
            <ion-row v-if="order.Driver" class="left">
                <ion-col>
                    <span class="title">{{$t('backoffice.form.fields.driver')}}:</span> {{getWorker(order.Driver)}}
                </ion-col>
            </ion-row>
            <ion-row class="left">
                <ion-col>
                    <div><span class="title">{{$t('backoffice.form.titles.state')}}:</span> {{getOrderState(order.State)}}</div> 
                </ion-col>
            </ion-row>
        </ion-grid>

        <br/>
        <ion-list v-if="order.State == 1">
            <ion-list-header>
                <ion-label>
                    <span style="color: red">*</span>{{$t('backoffice.form.fields.cooker')}}
                </ion-label>
            </ion-list-header>

            <ion-item>
                <ion-label>{{$t('backoffice.form.titles.selectACooker')}}</ion-label>
                <ion-select  :ok-text="$t('backoffice.form.messages.buttons.ok')" :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
                @ionChange="cooker = $event.target.value" v-bind:value="cooker">
                    <ion-select-option v-for="user in users" v-bind:key="user.Id" v-bind:value="user._id" >{{user.FirstName}} {{user.LastName}} - {{getOccupationName(user.OccupationId)}}</ion-select-option>
                </ion-select>
            </ion-item>
        </ion-list>
        <ion-list v-if="order.State == 3 && order.OrderType == 'Delivery'">
            <ion-list-header>
                <ion-label>
                    <span style="color: red">*</span>{{$t('backoffice.form.fields.driver')}}
                </ion-label>
            </ion-list-header>

            <ion-item>
                <ion-label>{{$t('backoffice.form.titles.selectADriver')}}</ion-label>
                <ion-select  :ok-text="$t('backoffice.form.messages.buttons.ok')" :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
                @ionChange="driver = $event.target.value" v-bind:value="driver">
                    <ion-select-option v-for="user in users" v-bind:key="user.Id" v-bind:value="user._id" >{{user.FirstName}} {{user.LastName}} - {{getOccupationName(user.OccupationId)}}</ion-select-option>
                </ion-select>
            </ion-item>

        </ion-list>
        <ion-list v-if="order.State != 0 && order.State != 5 && order.State != 6 && order.State != 7 && order.State != 8">
            <ion-list-header>
                <ion-label>
                    {{$t('backoffice.form.fields.states')}}
                </ion-label>
            </ion-list-header>

            <ion-item>
                <ion-label>{{$t('backoffice.form.titles.selectAState')}}</ion-label>
                <ion-select  :ok-text="$t('backoffice.form.messages.buttons.ok')" :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
                    @ionChange="stateToChange = $event.target.value" v-bind:value="stateToChange">
                    <ion-select-option v-for="ps in possibleStates" v-bind:key="ps" v-bind:value="ps" >{{ps}}</ion-select-option>
                </ion-select>
            </ion-item>

        </ion-list>

        <ion-button v-if="order.State != 0 && order.State != 6 && order.State != 5 && order.State != 7 && order.State != 8" expand="full" color="success" @click="changeStatus()">Change State</ion-button>
        <ion-button v-if="order.State == 4 && order.IsAccept" expand="full" color="warning" @click="showDeliveringLocation(order)">Show delivering location</ion-button>
        <ion-button v-if="order.State != 0 && order.State != 6 && order.State != 5 && order.State != 7 && order.State != 8" expand="full" color="danger" @click="candelOrder()">{{$t('backoffice.form.buttons.cancelOrder')}}</ion-button>
       
    </div>
    </div>
</template>

<script>

import { Api } from '../api/api.js';
import { Utils } from '../utils/utils.js';
import Modal from './cancelOrderModal.vue';
import ModalDeadline from './payDeadlineModal.vue';
import { payAuthorizeNet } from '../api/payments.js';
import { Devices } from '../api/devices.js';

export default {
    
  name: 'categoryForm',
   
  data () {
    return {
      modelName: 'order',
      /****** Form Data ******/
      id: null,
      order: null,
      customer: null,

      cooker: '',
      driver: '',

      users: [],
      occupations: [],
      stateToChange: '',

      currency: 'USD',

    //   workflowOrderStaus: ['Pending of pay', 'Started', 'In kitchen', 'Cooked', 'Delivering', 'Delivered', 'Canceled'],
      workflowOrderStaus: [this.$t('frontend.order.state0'), this.$t('frontend.order.state1'), this.$t('frontend.order.state2'), this.$t('frontend.order.state3'), this.$t('frontend.order.state4'), this.$t('frontend.order.state5'), this.$t('frontend.order.state6'), this.$t('frontend.order.state7'), this.$t('frontend.order.state8')],
      possibleStates: [],

      cType: 'order',

      isBackdrop: false,

      spinner: false,

      /***** Is editing  *****/
    }
  },
  created: function(){
      this.init();
  },
  computed:{
      nextStatus() {
          if (this.order)
          {
              if (this.order.OrderType != 'Delivery' && this.order.State == 3)
                return this.workflowOrderStaus[this.order.State + 2];
            return this.workflowOrderStaus[this.order.State + 1];
          }
          return '';   
      },
      calcTax(){
          if (this.order)
              return this.order.SubTotal * this.order.Taxe / 100;
          return 0;
      },
      calcTip(){
          if (this.order)
              return this.order.SubTotal * this.order.Tip / 100;
          return 0;
      },
      pay(){
          return payAuthorizeNet.payEvo2()
        //   .then(response => {
        //       console.log("OK")
        //       console.log(response)
        //   })
        //   .catch(e => {
        //       console.log("ERROR")
        //       console.log(e)
        //   })
      },
      pendingPay(){
          if (this.cType != 'order')
          {
              let deadlinesPayed = 0
              if(this.order.Deadline){
                  this.order.Deadline.forEach(dl => {
                      if (dl.State == 1)
                        deadlinesPayed += dl.AmountPayed
                  });
              }
              return parseFloat(this.order.Total) - (parseFloat(this.order.QuotationPayment) + deadlinesPayed)
          }
                
          return 0
      },
      payed(){
          if (this.cType != 'order')
          {
              let payed = parseFloat(this.order.QuotationPayment)
              if(this.order.Deadline){
                  this.order.Deadline.forEach(dl => {
                      if (dl.State == 1)
                        payed += parseFloat(dl.AmountPayed)
                  });
              }
              return payed
          }

          return 0
      }
  },
  methods:{

      async setRefund(pay, key, count){

          //Obtengo el restaurante
            this.spinner = true
            const restaurantID = this.$store.state.user.RestaurantId
            const restaurant = await Api.fetchById('restaurant', restaurantID)

            console.log(pay.paymentInfo)

          if (pay.paymentInfo.method === "Cash" || pay.paymentInfo.method === "Check"){

                this.order.Payment[key]["state"] = 2;
                this.order.Payment[key]["refundValue"] = parseFloat(count).toFixed(2);
                let item = {
                    "_id": this.order._id,
                    "Payment": this.order.Payment,
                };
                Api.putIn('order', item)
                .then(response => {
                    console.log(response)
                })
                .catch(e => {
                    console.log(e)
                })

                const paymeD = await Api.getPaymentByInvoice(pay.paymentInfo.transId, restaurantID);
                if(paymeD){
                    console.log('paymenD')
                    console.log(paymeD.data[0])
                    const payUpd = paymeD.data[0];
                    payUpd.Refund = parseFloat(count).toFixed(2);
                    await Api.putIn('Allpayments', payUpd);
                }

                this.spinner = false
                
                return true;

          }

           else if (restaurant.data.PayMethod == 'SHIFT4')
            {

                //Hay que obtener el token.
                if (pay.paymentInfo){

                    console.log("Invoice information")
                    console.log(pay.paymentInfo.transId)
                    
                    try
                    {
                        const invoiceInformation = await payAuthorizeNet.invoiceInformation(pay.paymentInfo.transId, pay.paymentInfo.moto,
                                                                                                restaurantID, 'SHIFT4')
                        console.log("invoiceInformation")
                        console.log(invoiceInformation)
                        // return;
                        if (invoiceInformation.data.length > 0)
                        {
                                const datas = {
                                    "restaurantId": restaurantID,
                                    "payMethod": 'SHIFT4',
                                    "total": parseFloat(count).toFixed(2),
                                    // "cardExpirationDateF1": this.order.expirationCard,
                                    // "cardNumber": this.order.accountNumber,
                                    "token": invoiceInformation.data[0].card.token.value,
                                    "invoiceNumber": pay.paymentInfo.transId
                                }

                                console.log(datas)
                            const resRefund = await payAuthorizeNet.refundOrder(datas, pay.paymentInfo.moto)
                            
                            const paymeD = await Api.getPaymentByInvoice(pay.paymentInfo.transId, restaurantID);
                            if(paymeD){
                                console.log('paymenD')
                                console.log(paymeD.data[0])
                                const payUpd = paymeD.data[0];
                                payUpd.Refund = parseFloat(count).toFixed(2);
                                await Api.putIn('Allpayments', payUpd);
                            }
                            console.log(resRefund)

                                this.order.Payment[key]["state"] = 2;
                                this.order.Payment[key]["refundValue"] = parseFloat(count).toFixed(2);
                                let item = {
                                    "_id": this.order._id,
                                    "Payment": this.order.Payment,
                                };
                                Api.putIn('order', item)
                                .then(response => {
                                    console.log(response)
                                })
                                .catch(e => {
                                    console.log(e)
                                })

                                this.spinner = false
                        }
                        else{
                            this.showToastMessage('The invoice is not found in payment gateway. The order cant be refund', 'danger')
                            this.spinner = false
                        }
                    }
                    catch(e){
                        console.log(e)
                        this.showToastMessage(e, 'danger')
                        this.spinner = false
                    }

                }
                
            }
            
      },
      async setVoid(pay, key){
          //Obtengo el restaurante
            this.spinner = true
            const restaurantID = this.$store.state.user.RestaurantId
            const restaurant = await Api.fetchById('restaurant', restaurantID)

            if (pay.paymentInfo.method === "Cash" || pay.paymentInfo.method === "Check"){

                this.order.Payment[key]["state"] = 2;
                this.order.Payment[key]["voidValue"] = pay.paymentInfo.total;
                let item = {
                    "_id": this.order._id,
                    "Payment": this.order.Payment,
                };
                Api.putIn('order', item)
                .then(response => {
                    console.log(response)
                })
                .catch(e => {
                    console.log(e)
                })

                const paymeD = await Api.getPaymentByInvoice(pay.paymentInfo.transId, restaurantID);
                if(paymeD){
                    console.log('paymenD')
                    console.log(paymeD.data[0])
                    const payUpd = paymeD.data[0];
                    payUpd.Void = pay.paymentInfo.total;
                    await Api.putIn('Allpayments', payUpd);
                }

                this.spinner = false
                 
                return;

            }
            /* else if (pay.paymentInfo.method == 'Device'){ //Si el pago se hizo a traves del dispositivo, 
                                //el void debe ser a traves del dispositivo.
                 const data = {
                    'transactionType': '17',
                    'amountInformation': {
                        'TransactionAmount': '',
                        'TipAmount': '',
                        'TaxAmount': '',
                    },
                    'accountInformation':{
                        'FirstName': ''
                    },
                    'traceInformation':{
                        'TransactionNumber': pay.paymentInfo.transId
                    },
                    'ClerkID': this.$store.state.user.ServerId.toString(),
                }
                //Obtener la ip y el port de la sesion
                const device = this.$store.state.device
                let ip = device.ip || ''
                let port = device.port || ''
                let sn = device.sn || ''
                if ((ip === '' || port === '') && sn === '')
                {
                    this.showToastMessage('You must configure ip and port, or device serial number')
                    return;
                }
                else if ((ip === '' || port === '') && sn !== ''){
                    //Buscar ip y puerto por el número de serie.
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
                                ip = ipaddres
                                port = port
                            }
                            else{
                                this.showToastMessage('It was impossible contact with the device throw the serial number', 'danger')
                                return;
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
                                ip = ipaddres
                                port = port
                            }
                            else{
                                this.showToastMessage('It was impossible contact with the device throw the serial number', 'danger')
                                return;
                            }                            
                        }   
                    }
                    else{
                        this.showToastMessage('It was impossible contact with the device throw the serial number', 'danger')
                        return;
                    }
                }
                
                if (ip !== '' && port !== '')
                {
                    // Realizar la transacción por ip y puerto
                    try{
                        Devices.a930.DoCredit(ip, port, false, data, this.callbackVoid)
                        const paymeD = await Api.getPaymentByInvoice(pay.paymentInfo.transId, restaurantID);
                        if(paymeD){
                            console.log('paymenD')
                            console.log(paymeD.data[0])
                            const payUpd = paymeD.data[0];
                            payUpd.Void = pay.paymentInfo.total;
                            await Api.putIn('Allpayments', payUpd);
                        }
                    }
                    catch(e){
                        console.log(e)
                    }
                } 


                //Usando FB de Shift 4
                

            }*/
            else if(restaurant.data.PayMethod == 'SHIFT4' || restaurant.data.PayMethod == 'Device') {
                
                try
                {
                    const resVoid = await payAuthorizeNet.void(pay.paymentInfo.transId, pay.paymentInfo.moto, restaurantID, 'SHIFT4')
                    console.log("Response Void")
                    console.log(resVoid)
                    const paymeD = await Api.getPaymentByInvoice(pay.paymentInfo.transId, restaurantID);
                    if(paymeD){
                        console.log('paymenD')
                        console.log(paymeD.data[0])
                        const payUpd = paymeD.data[0];
                        payUpd.Void = pay.paymentInfo.total;
                        await Api.putIn('Allpayments', payUpd);
                    }

                    this.order.Payment[key]["state"] = 3
                    this.order.Payment[key]["voidValue"] = pay.paymentInfo.total;
                    let item = {
                    "_id": this.order._id,
                    "Payment": this.order.Payment,
                    };
                    Api.putIn('order', item)
                    .then(response => {
                        console.log(response)
                    })
                    .catch(e => {
                        console.log(e)
                    })

                    this.spinner = false
                }
                catch(e)
                {
                    console.log(e)
                    this.showToastMessage(e, 'danger')
                    this.spinner = false

                }
            }
        // else if (restaurant.data.PayMethod == 'TSYS')
            
            
      },
      callbackVoid(res){
            console.log("SUCCESSFULLY---RESPONSE:")
            console.log(res)
            if (res[5] == 'OK')
            {
                this.showToastMessage('La devolución se realizó exitosamente', 'success')
            }
            else{
                this.showToastMessage('Algo no fue bien', 'danger')
            }
            
            this.dismissModal()
      },

      payExample(){

        //   Api.doCreditStore()
        // //   Api.initPaxStore()
        //   .then(response => {
        //       console.log("1")
        //       console.log(JSON.stringify(response.data))
        //   })
        //   .catch(e => {
        //       console.log("2")
        //       console.log(e)
        //   })
        
        // Devices.a930.DoCredit();
        Devices.a930.Initialize()
        .then(response => {
            console("SUCCESSFULLY---RESPONSE:")
            console.log(response)
        })
        .catch(e => {
            console.log("ERROR:")
            console.log(e)
        })

        //   payAuthorizeNet.payCardStream()
        //   .then(response => {
        //       console.log(response)
        //   })
        //   .catch(e => {
        //       console.log(e)
        //   })
        // shift4.paySale()
        // .then(res => {
        //     alert("Yeeeeeesss")
        //     console.log(res)
        // })
        // .catch(e => {
        //     console.log(e)
        // })
        // payAuthorizeNet.payEvo2()
        // .then(res => {
        //     console.log(res)
        // })
        // .catch(e=> {
        //     console.log(e)
        // })
      },
      getCurrency(){
          const restaurantID = this.$store.state.user.RestaurantId
          if (restaurantID){
              Api.fetchById('Restaurant', restaurantID).then(response => {
                  this.currency = response.data.Currency
              }).catch(e => {
                  console.log(e)
              })
          } 
      },
      payDeadLine(index){
          return this.$ionic.modalController
                .create({
                component: ModalDeadline,
                cssClass: 'my-custom-class',
                componentProps: {
                    data: {
                        content: this.order._id,
                    },
                    propsData: {
                        title: 'Pay deadline',
                        button: this.$t('backoffice.list.messages.buttons.close'),
                        button2: this.$t('backoffice.form.buttons.cancelOrder'),
                        order: this.order,
                        deadline: index,
                        customer: this.customer,
                        parent: this
                    },
                },
                })
                .then(m => m.present())
      },
      haveServices(){
          let services = this.order.Products.find(prod => prod.isService)
          if (services)
                return true;
          return false;

      },
      init(){
            this.cType = this.$route.params.type || 'order';
            this.getCurrency();
            this.fetchOccupations();
            this.fetchUsers();
            this.id = this.$route.params.orderId;
            console.log(this.id);
            this.getOrder();
      },
      goToBack(){
          if (this.cType == 'order')
            this.$router.push({ path: '/order'})
          else if (this.cType == 'ticket')
            this.$router.push({path: '/ticket'})
          else
            this.$router.push({ path: '/cateringOrder'})
      },
      ifErrorOccured(action){
        return this.$ionic.alertController.create({
            title: this.$t('backoffice.list.messages.connectionError'),
            message: this.$t('backoffice.list.messages.connectionErrorMessage'),
            buttons: [
                {
                text: this.$t('backoffice.list.messages.buttons.goToList'),
                handler: () => {
                    this.$router.push({
                        name: 'Order',
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
      getWorker(workerId){
        const worker = this.users.find(item => item._id == workerId)
        return worker.FirstName + ' ' + worker.LastName
      },
      fillPossibleStates: function(){
          console.log(this.order.State)
          for (let i = this.order.State + 1; i < this.workflowOrderStaus.length - 1; i++) {
              const element = this.workflowOrderStaus[i];
              if (this.order.OrderType != "Delivery" && this.workflowOrderStaus[i] == "On the way")
                    continue;
              if (!this.possibleStates.includes(element))
                    this.possibleStates.push(element);
          }
          this.stateToChange = this.nextStatus;
      },
      fetchUsers: function(){
        Api.fetchAll('Staff').then(response => {
          this.users = response.data
        })
        .catch(e => {
          console.log(e)
        });
      },
      fetchOccupations: function(){
        Api.fetchAll('Occupation').then(response => {
          this.occupations = response.data
        })
        .catch(e => {
          console.log(e)
        });
      },
      getOccupationName(id){
         let occupation = null;
         occupation = this.occupations.filter(item => item._id.indexOf(id) > 1);
         if (occupation)
         {
             return occupation.Name;
         }
         return '';
      },
      getOrder(){
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
                                    this.order = response.data;
                                    console.log("THE ORDER:");
                                    console.log(this.order);
                                    console.log(this.order);
                                    this.fillPossibleStates();
                                    loading.dismiss();
                                    return this.getCustomer(this.order.ClientId);
                                })
                                .catch(e => {
                                    console.log(e);
                                    loading.dismiss();
                                    this.ifErrorOccured(this.init)
                                }) 
                            
                        })
                    }) 
            }
      },
      getCustomer(id){
            Api.fetchById("customer", id)
            .then(response => {
                this.customer = response.data;
                return response;
            })
            .catch(e => {
                console.log(e);
                return e;
            })  
      },
      getOrderState(state){
          return this.workflowOrderStaus[state];
      },
      getFormatedDate: function(date){
          return Utils.getFormatedDate(date);         
      },
      getFormateNumber: function(number){
          return new Intl.NumberFormat('en', {style: "currency", currency: this.currency} ).format(number).toString()
      },
      showDeliveringLocation(orderP){
        this.$router.push({
            name: 'Localization',
            params: {
              order: orderP,
              fun: 'read'
            }
        });
      },
      changeStatus(){
        //   this.changeOrder(this.stateToChange);

          let newStatus = this.workflowOrderStaus.indexOf(this.stateToChange);

          if (newStatus == 2 && this.cooker == '')
          {
                // this.ShowMessage(this.$t('backoffice.list.messages.changeOrderStateMessage'),
                //     this.$t('backoffice.form.validate.cooker'), 
                //         this.$t('backoffice.list.messages.changeOrderStateMessage'));
                this.showToastMessage(this.$t('backoffice.form.validate.cooker'), "danger");
                return;
          }
          if (newStatus == 4 && this.driver == '')
          {
                this.showToastMessage("Debe escoger un chofer para entregar la orden", "danger");
                return;
          }
          let item = {
              "_id": this.order._id,
              "State": newStatus,
            };
          if (newStatus == 2){
             item['Cooker'] = this.cooker;
          }
          if (newStatus == 4)
          {
              item['Driver'] = this.driver;
              item['IsAccept'] = false;
              item['Lat'] = 0;
              item['Lng'] = 0;
          }
          this.isBackdrop = true;
          this.spinner = true;
          Api.putIn(this.modelName, item)
            .then(response => {
                // Determinar mensaje en base al estado al que se está cambiando la orden.
                let orderInfo = ''
                if (newStatus == 2){
                    //En Concina
                    if (this.customer)
                        orderInfo = this.customer.Name + this.$t('backoffice.form.marketingMessages.inKitchen')
                    else
                         orderInfo = this.order.CustomerName + this.$t('backoffice.form.marketingMessages.inKitchen')
                } 
                if (newStatus == 3) //Cocinada
                    orderInfo = this.$t('backoffice.form.marketingMessages.cooked')
                if (newStatus == 4) //Entregándose
                    orderInfo = this.$t('backoffice.form.marketingMessages.delivering')
                if (newStatus == 5) //Entregada
                    orderInfo = this.$t('backoffice.form.marketingMessages.delivered')

                //Enviar email
                if (this.customer)
                {
                    if (this.customer.MarketingConsent.Email)
                        this.sendEmail(this.customer.EmailAddress, orderInfo);
                    // this.sendEmail("miguel.augusto1987@gmail.com", "Mensaje") + '<br/>';
                    //Enviar sms
                    if (this.customer.MarketingConsent.Phone)
                        this.sendSms(this.customer.Phone, orderInfo);
                }
                else{
                        this.sendEmail(this.order.CustomerEmail, orderInfo);

                }
               
                    // this.sendSms("+1 973-832-3170", "Mensaje") + '<br/>';

                // this.ShowMessage(this.$t('backoffice.list.messages.changeOrderStateMessage'),
                //     this.$t('backoffice.list.messages.changeOrderStateSuccess'), 
                //         this.$t('backoffice.list.messages.changeOrderStateMessage'));
                this.showToastMessage(this.$t('backoffice.list.messages.changeOrderStateSuccess'), "success");

                // this.$router.push({
                //     path: '/order', 
                // });
                this.init();
                this.isBackdrop = false;
                this.spinner = false;
                return response;
            })
            .catch(e => {
                this.isBackdrop = false;
                console.log(e);
                this.spinner = false;
                this.ifErrorOccured(this.changeStatus)
            })
      },
      candelOrder(){
           return this.$ionic.modalController
                .create({
                component: Modal,
                cssClass: 'my-custom-class',
                componentProps: {
                    data: {
                        content: this.order._id,
                    },
                    propsData: {
                        title: this.$t('backoffice.form.titles.cancelOrder'),
                        button: this.$t('backoffice.list.messages.buttons.close'),
                        button2: this.$t('backoffice.form.buttons.cancelOrder'),
                        order: this.order,
                        customer: this.customer,
                        parent: this,
                    },
                },
                })
                .then(m => m.present())
      },
      sendEmail(email, mess){
          console.log(email);
          console.log(mess);
           let items = {
              "email": email,
              "mess": mess,
              "subject": this.$t('backoffice.form.marketingMessages.orderInfo')
            };
            // let items = {
            //   "email": "miguel.augusto1987@gmail.com",
            //   "mess": "mensaje",
            //   "subject": "Your order change status"
            // };
            Api.sendEmail(items)
                .then(() => {
                      console.log(items)
                })
                .catch(e => {
                    console.log(e);
                    this.spinner = false;
                })
      },
      sendSms(phone, mess){
            console.log(phone);
             console.log(mess);
            let items = {
              "phone": phone,
              "mess": mess
            };
            // let item = {
            //   "phone": "+1 973-832-3170",
            //   "mess": "message"
            // };
            Api.sendSms(items)
                .then(() => {
                    console.log(items)
                })
                .catch(e => {
                    console.log(e);
                    this.spinner = false;
                })
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
  },

}
</script>
<style>

ion-col{

    border: 1px solid lightgray;

}

span.title{
    font-weight: bolder;
}

div.end{
    text-align: end;
}

ion-row.left{
    text-align: left;
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