<template>
    <div class="screen">
    <ion-backdrop v-if="isBackdrop"></ion-backdrop>
    <!-- <router-link to="/controlPanel"><ion-button expand="full" color="tertiary"><ion-icon name="hammer"></ion-icon>{{$t('backoffice.list.buttons.goToControlPanel')}}</ion-button></router-link>
    <router-link to="/otherCharge"><ion-button expand="full" color="tertiary"><ion-icon name="arrow-round-back"></ion-icon>{{$t('backoffice.form.buttons.backToOtherChargesList')}}</ion-button></router-link> -->

    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'CateringOrder'})"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>{{title}}</h1>            
            </ion-label>
          </ion-toolbar>
    </ion-header>
    <br/>

    <!-- <ion-card> -->
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
                    <div><span class="title">{{$t('backoffice.form.titles.date')}}:</span> 
                        <ion-datetime style="border-bottom: 1px solid darkred" name="date" @ionChange="date = $event.target.value" 
                            v-bind:value="date" :placeholder="$t('backoffice.form.titles.selectDate')">
                        </ion-datetime>
                    </div>
                </ion-col>
                <ion-col>
                    <div><span class="title">{{$t('backoffice.form.titles.orderType')}}:</span> 
                        <ion-list>
                                <ion-select style="border-bottom: 1px solid darkred" interface="popover" :ok-text="$t('backoffice.form.messages.buttons.ok')" :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
                                    @ionChange="orderType = $event.target.value, shipping = 0, calcTotal()" v-bind:value="orderType">
                                    <ion-select-option value="PickUp">{{$t('frontend.app.pickup')}}</ion-select-option>
                                    <ion-select-option value="Delivery">{{$t('frontend.app.deliver')}}</ion-select-option>
                                </ion-select>
                        </ion-list>
                    </div>
                </ion-col>
            </ion-row>
            <ion-row class="left">
                <ion-col>
                    <div v-if="orderType == 'Delivery'"><span class="title">{{$t('backoffice.form.titles.addressToDelivery')}}:</span> 
                        <ion-textarea style="border-bottom: 1px solid darkred" type="text" name="address"
                            @input="address = $event.target.value" 
                            v-bind:value="address">
                        </ion-textarea>
                    </div>
                    <div v-if="orderType == 'PickUp'"><span class="title">{{$t('backoffice.form.titles.hourToPick')}}:</span>
                        <ion-datetime style="border-bottom: 1px solid darkred" name="hourToPick" @ionChange="hourToPick = $event.target.value" 
                                v-bind:value="hourToPick"
                                :placeholder="$t('backoffice.form.titles.pickToSelect')" display-format="HH:mm">
                        </ion-datetime>
                    </div>
                </ion-col>
            </ion-row>
        </ion-grid>
        <br/>
        <ion-grid>
            <ion-row class="left">
                <ion-col style="border-right: none">
                    <div>
                        <span class="title">{{$t('backoffice.form.titles.products')}}:</span>
                    </div>
                </ion-col>
                <ion-col style="border-left: none">
                    <div style="text-align: end;">
                        <ion-button size="small" slot="end" color="primary" @click="addProduct()">
                            <ion-icon slot="icon-only" name="add"></ion-icon>
                        </ion-button>
                    </div>
                </ion-col>
            </ion-row>


            <ion-list v-if="screenWidth < 600">
                <ion-item-sliding v-for="product in products" :key="product._id">
                    <ion-item v-if="!product.isService" style="border: 1px solid darkred">
                        <ion-input style="border-bottom: 1px solid darkred; margin:15px" type="text" name="productName"
                            @input="product.Name = $event.target.value" 
                            v-bind:value="product.Name">
                        </ion-input>
                        <ion-input style="border-bottom: 1px solid darkred; margin:15px" type="number" name="productCant"
                            @input="product.Cant = $event.target.value" @ionChange="calcTotal()"
                            v-bind:value="product.Cant">
                        </ion-input>
                        <ion-input style="border-bottom: 1px solid darkred; margin:15px" type="number" name="productCost"
                            @input="product.Price = $event.target.value" @ionChange="calcTotal()"
                            v-bind:value="product.Price">
                        </ion-input>
                        <ion-textarea style="border: 1px solid darkred; margin:15px" name="note" 
                                @input="product.Note = $event.target.value" 
                                v-bind:value="product.Note">
                        </ion-textarea>
                    </ion-item>
                    <ion-item-options side="end">
                        <ion-item-option color = "danger" @click="delProduct(product._id)">
                            <ion-icon slot="icon-only" name="trash"></ion-icon>
                        </ion-item-option>
                    </ion-item-options>
                </ion-item-sliding>
            </ion-list>
            <ion-list v-if="screenWidth >= 600" >
                    <ion-item v-for="product in products" :key="product._id">
                        <div style="display: inherit" v-if="!product.isService">
                            <ion-input style="border-bottom: 1px solid darkred; margin:5px" type="text" name="productName"
                                @input="product.Name = $event.target.value" 
                                v-bind:value="product.Name">
                            </ion-input>
                            <ion-input style="border-bottom: 1px solid darkred; margin:5px" type="number" name="productCant"
                                @input="product.Cant = $event.target.value" @ionChange="calcTotal()"
                                v-bind:value="product.Cant">
                            </ion-input>
                            <ion-input style="border-bottom: 1px solid darkred; margin:5px" type="number" name="productCost"
                                @input="product.Price = $event.target.value" @ionChange="calcTotal()"
                                v-bind:value="product.Price">
                            </ion-input>
                            <ion-textarea style="border: 1px solid darkred; margin:5px" name="note" 
                                    @input="product.Note = $event.target.value" 
                                    v-bind:value="product.Note">
                            </ion-textarea>
                            <ion-item-group side="end">
                                <ion-button color="danger" @click="delProduct(product._id)">
                                    <ion-icon slot="icon-only" name="trash"></ion-icon>
                                </ion-button>
                            </ion-item-group>
                        </div>
                    </ion-item>
            </ion-list>

            <ion-row class="left">
                <ion-col style="border-right: none">
                    <div>
                        <span class="title">{{$t('backoffice.options.manageServices')}}:</span>
                    </div>
                </ion-col>
                <ion-col style="border-left: none">
                    <div style="text-align: end;">
                        <ion-button size="small" slot="end" color="primary" @click="addService()">
                            <ion-icon slot="icon-only" name="add"></ion-icon>
                        </ion-button>
                    </div>
                </ion-col>
            </ion-row>


            <ion-list v-if="screenWidth < 600">
                <ion-item-sliding v-for="service in products" :key="service._id">
                    <ion-item v-if="service.isService" style="border: 1px solid darkred">
                        <ion-input style="border-bottom: 1px solid darkred; margin:15px" type="text" name="serviceName"
                            @input="service.Name = $event.target.value" 
                            v-bind:value="service.Name">
                        </ion-input>
                        <ion-input style="border-bottom: 1px solid darkred; margin:15px" type="number" name="serviceCant"
                            @input="service.Cant = $event.target.value" @ionChange="calcTotal()"
                            v-bind:value="service.Cant">
                        </ion-input>
                        <ion-input style="border-bottom: 1px solid darkred; margin:15px" type="number" name="serviceCost"
                            @input="service.Price = $event.target.value" @ionChange="calcTotal()"
                            v-bind:value="service.Price">
                        </ion-input>
                        <ion-textarea style="border: 1px solid darkred; margin:15px" name="note" 
                                @input="service.Note = $event.target.value" 
                                v-bind:value="service.Note">
                        </ion-textarea>
                    </ion-item>
                    <ion-item-options side="end">
                        <ion-item-option color = "danger" @click="delService(service._id)">
                            <ion-icon slot="icon-only" name="trash"></ion-icon>
                        </ion-item-option>
                    </ion-item-options>
                </ion-item-sliding>
            </ion-list>
            <ion-list v-if="screenWidth >= 600" >
                    <ion-item v-for="service in products" :key="service._id" >
                        <div style="display: inherit" v-if="service.isService">
                            <ion-input style="border-bottom: 1px solid darkred; margin:5px" type="text" name="serviceName"
                                @input="service.Name = $event.target.value" 
                                v-bind:value="service.Name">
                            </ion-input>
                            <ion-input style="border-bottom: 1px solid darkred; margin:5px" type="number" name="serviceCant"
                                @input="service.Cant = $event.target.value" @ionChange="calcTotal()"
                                v-bind:value="service.Cant">
                            </ion-input>
                            <ion-input style="border-bottom: 1px solid darkred; margin:5px" type="number" name="serviceCost"
                                @input="service.Price = $event.target.value" @ionChange="calcTotal()"
                                v-bind:value="service.Price">
                            </ion-input>
                            <ion-textarea style="border: 1px solid darkred; margin:5px" name="note" 
                                    @input="service.Note = $event.target.value" 
                                    v-bind:value="service.Note">
                            </ion-textarea>
                            <ion-item-group side="end">
                                <ion-button color="danger" @click="delService(service._id)">
                                    <ion-icon slot="icon-only" name="trash"></ion-icon>
                                </ion-button>
                            </ion-item-group>
                        </div>
                    </ion-item>
            </ion-list>

            <ion-row v-if="otherCharges.length > 0" class="left">
                <ion-col>
                    <div><span class="title">{{$t('backoffice.form.titles.otherCharges')}}:</span></div>
                </ion-col>
            </ion-row>
            <ion-row v-for="otherCharge in otherCharges" :key="otherCharge._id" class="left">
                <ion-col size="10">
                    <div>{{otherCharge.Name}}</div>
                </ion-col>
                <ion-col size="2">
                    <div class="end">
                        <ion-input style="border-bottom: 1px solid darkred" type="number" name="otherCharge"
                            @input="otherCharge.Price = $event.target.value" @ionChange="calcTotal()"
                            v-bind:value="otherCharge.Price">
                        </ion-input>
                    </div>
                </ion-col>
            </ion-row>
        </ion-grid>
        <br/>
        <ion-grid>
            <ion-row v-if="orderType == 'Delivery'">
                <ion-col>
                    <div class="end"><span class="title">{{$t('backoffice.form.titles.shippingPrice')}}:</span> 
                        <ion-input style="border-bottom: 1px solid darkred" type="number" name="shipping"
                            @input="shipping = $event.target.value" @ionChange="calcTotal()"
                            v-bind:value="shipping">
                        </ion-input>
                    </div>
                </ion-col>
            </ion-row>
            <ion-row>
                    <ion-item style="width: 100%"> 
                        <ion-input style="border-bottom: 1px solid darkred; margin-right: 5px; width: 10%" type="number" name="discount"
                            @input="calcDiscount($event.target.value)"
                            v-bind:value="discount">
                        </ion-input>
                        <ion-select style="width: 50%; border-bottom: 1px solid darkred;" interface="popover" :ok-text="$t('backoffice.form.messages.buttons.ok')" :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
                                @ionChange="changeDiscountType($event.target.value)" v-bind:value="discountType">
                                    <ion-select-option key="percent" value="percent" >{{$t('backoffice.form.fields.percent')}}</ion-select-option>
                                    <ion-select-option key="fixed" value="fixed" >{{$t('backoffice.form.fields.fixed')}}</ion-select-option>
                        </ion-select>
                        <ion-label style="width: 40%" slot="end"><span class="title">{{$t('backoffice.form.fields.discount')}}:</span> {{discountAmount}}</ion-label>
                    </ion-item>
            </ion-row>
            <ion-row>
                <ion-col>
                    <div class="end"><span class="title">{{$t('backoffice.form.titles.subtotal')}}:</span>{{ getFormateNumber(subtotal)}}</div>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col>
                    <div class="end"><span class="title">{{$t('backoffice.form.titles.tax')}}:</span> {{ getFormateNumber(calcTax)}} ({{taxe}}%)</div>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col>
                    <div class="end"><span class="title">{{$t('backoffice.form.titles.tip')}}:</span> {{ getFormateNumber(calcTip)}} ({{tip}}%)</div>
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col>
                    <div class="end"><span class="title">{{$t('backoffice.form.titles.total')}}:</span> {{ getFormateNumber(total)}}</div> 
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col>
                    <div class="end" style="color: red"><span class="title">{{$t('backoffice.form.fields.pendingPay')}}:</span> {{ getFormateNumber(pendingPay())}}</div> 
                </ion-col>
            </ion-row>
            <ion-row>
                <ion-col>
                    <div class="end" style="color: darkblue"><span class="title">{{$t('backoffice.form.fields.payed')}}:</span> {{ getFormateNumber(payed)}}</div> 
                </ion-col>
            </ion-row>
        </ion-grid>
        <br/>
        <!-- Plazos -->
        <ion-item>
            <ion-label>{{$t('backoffice.form.fields.deadlines')}}</ion-label>
            <ion-checkbox slot="end" name="haveDeadlines" 
                @ionChange="haveDeadlines = $event.target.checked"
                :checked="haveDeadlines"  >    
            </ion-checkbox>
        </ion-item>
        <div v-if="haveDeadlines" style="margin-left: 30px">
            <ion-list>
                <ion-item>
                    <h1>{{$t('backoffice.form.fields.deadlines')}}</h1>
                </ion-item>
                <ion-item>
                    <ion-datetime id="dateDeadLine" style="margin-left: 20px; margin-right: 20px; border-bottom: 1px solid darkred; padding: 5px !important; border-radius: 3px;" name="dateDeadLine" 
                        @ionChange="dateDeadLine = $event.target.value" 
                        v-bind:value="dateDeadLine" :placeholder="$t('backoffice.form.titles.selectDate')">
                    </ion-datetime>
                    <ion-input id="percentDeadLine" style="margin-left: 20px; margin-right: 20px; border-bottom: 1px solid darkred; padding: 0px !important; border-radius: 3px;" type="number" name="cateringPrice"
                        @input="percentDeadLine = $event.target.value" 
                        v-bind:value="percentDeadLine">
                    </ion-input>
                    <ion-button color="primary" @click="addDeadLine()"><ion-icon slot="icon-only" name="add"></ion-icon></ion-button>
                </ion-item>
                <ion-item style="margin-left: 30px" v-for="deadLine in deadLines" v-bind:key="deadLines.indexOf(deadLine)">
                    <ion-datetime style="margin-left: 20px; margin-right: 20px; border-bottom: 1px solid darkred; padding: 5px !important; border-radius: 3px;" name="date" 
                        @ionChange="deadLine.Date = $event.target.value" 
                        v-bind:value="deadLine.Date" :placeholder="$t('backoffice.form.titles.selectDate')">
                    </ion-datetime>
                    <ion-input style="margin-left: 20px; margin-right: 20px; border-bottom: 1px solid darkred; padding: 0px !important; border-radius: 3px;" type="number" name="cateringPrice"
                        @input="deadLine.Percent = $event.target.value" 
                        v-bind:value="deadLine.Percent" >
                    </ion-input>
                    <ion-button v-if="deadLines.length > 2" color="danger" @click="delDeadLine(deadLines.indexOf(deadLine))"><ion-icon slot="icon-only" name="trash"></ion-icon></ion-button>
                </ion-item>
                <ion-item>
                    <p style="color: red">{{$t('backoffice.form.titles.deadlinesNotes')}}</p>
                </ion-item>
            </ion-list>
        </div>

        <ion-grid>
            <ion-row class="left">
                <ion-col>
                    <span class="title">{{$t('backoffice.form.titles.notes')}}:</span>
                </ion-col>
            </ion-row>
            <ion-row class="left">
                <ion-col>
                    <ion-textarea style="border-bottom: 1px solid darkred" name="note" 
                        @input="note = $event.target.value" 
                        v-bind:value="note">
                    </ion-textarea>
                </ion-col>
            </ion-row>
            <ion-row class="left">
                <ion-col>
                    <div><span class="title">{{$t('backoffice.form.titles.state')}}:</span> {{getOrderState(order.State)}}</div> 
                </ion-col>
            </ion-row>
        </ion-grid>
        <ion-button color="primary" :key="deadLinePercentInc" :disabled="!isValidForm() ? true : false" @click="approve()">{{$t('frontend.order.state8')}}</ion-button>
        <ion-button color="danger" @click="cancel()">{{$t('frontend.order.state6')}}</ion-button>
    </div>
    </div>
</template>

<script>

import { Api } from '../api/api.js';
import Modal from './addProductSeviceModal.vue';
import { EventBus } from '../../frontend/event-bus';
import Moment from 'moment';

export default {

  name: 'orderCateringForm',
   
  data () {
    return {
      modelName: 'Order',
       /****** Form Data ******/
      id: null,
      productName: '',
      order: null,
      customer: null,
      date: '',
      orderType: '',
      address: '',
      hourToPick: '',
      products: [],
      otherCharges: [],
      shipping: 0,
      subtotal: 0,

      discountType: 'percent',
      discount: 0,
      discountAmount: 0,

      taxe: 0,
      tip: 0,
      payed: 0,
      total: 0,
      note: '',

      deadLines: [
          {
              'Percent': 50,
              'Date': '',
              'State': 0		
          },
          {
              'Percent': 50,
              'Date': '',
              'State': 0
          }
      ],
      dateDeadLine: '',
      percentDeadLine: 0,
      haveDeadlines : false,
      deadLinePercentInc : 0,

      isBackdrop: false,

      spinner: false,
      screenWidth: 0,

      currency: 'USD',

      allTypeOrder:{'Delivery':this.$t('frontend.app.deliver'), 'PickUp':this.$t('frontend.app.pickup'), 'On Table':this.$t('frontend.app.table') },
      workflowOrderStaus: [this.$t('frontend.order.state0'), this.$t('frontend.order.state1'), this.$t('frontend.order.state2'), this.$t('frontend.order.state3'), this.$t('frontend.order.state4'), this.$t('frontend.order.state5'), this.$t('frontend.order.state6'), this.$t('frontend.order.state7'), this.$t('frontend.order.state8')],

    }
  },
  mounted: function(){
    EventBus.$on('ProductsSelected', (productsSelected) => {
      console.log(productsSelected)
      productsSelected.forEach(prod => {
          this.products.push(prod) 
      })    
    });
    EventBus.$on('ServicesSelected', (servicesSelected) => {
      console.log(servicesSelected)
      servicesSelected.forEach(serv => {
          this.products.push(serv) 
      })  
    });
  },
  created: function(){
    this.init();
    this.screenWidth = screen.width;
  },
  computed: {
        title() {
            return  this.$t('backoffice.form.titles.orderCateringForm');
        },
        calcTax(){
            return this.subtotal * this.taxe / 100;
        },
        calcTip(){
            return this.subtotal * this.tip / 100;
        }
  },
  methods: {
    init(){
        this.id = this.$route.params.orderId;
        this.getCurrency();
        this.getOrder();
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
    changeDiscountType(value){
        this.discount = 0
        this.calcTotal()
        this.discountType = value
        this.calcDiscount(this.discount)
    },
    calcDiscount(value){

        this.discount = 0
        this.discountAmount = 0
        this.calcTotal()
        this.discount = value
        if (this.discountType == 'percent')
        {
            this.discountAmount = (this.discount * this.subtotal / 100).toFixed(2)
        }
        else{
            this.discountAmount = value
        }
        
        this.calcTotal()
    },
    calcSubtotal(){
        let partialSubtotal = 0

        let productsSubtotal = 0;
        this.products.forEach(prod => {
            productsSubtotal += parseFloat(prod.Price * prod.Cant)
        });
        partialSubtotal += productsSubtotal

        let otherChargeSubtotal = 0;
        this.otherCharges.forEach(och => {
            otherChargeSubtotal += parseFloat(och.Price)
        });
        partialSubtotal += otherChargeSubtotal
        partialSubtotal -= this.discountAmount

        this.subtotal = partialSubtotal.toString()
        console.log("SUBTOTAL")
        console.log(this.subtotal)
    },
    calcTotal(){
        console.log("HELLO")
        let partialTotal = 0
        
        this.calcSubtotal()
        partialTotal += parseFloat(this.subtotal)

        partialTotal +=  parseFloat(this.calcTax)
        partialTotal += parseFloat(this.calcTip)
        partialTotal += parseFloat(this.shipping)

        this.total = partialTotal.toString()
        console.log("TOTAL")
        console.log(this.total)
    },
    pendingPay(){
        this.calcTotal()
        const pendingPay = parseFloat(this.total) - parseFloat(this.payed)
        return  pendingPay.toString()
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
                        console.log("ORDER");
                        console.log(response.data);
                        this.order = response.data;
                        this.date = this.order.Date;
                        this.orderType = this.order.OrderType;
                        this.address = this.order.AddressToDeliver;
                        this.hourToPick = this.order.HourToPick;
                        this.products = this.order.Products;
                        this.otherCharges = this.order.OtherCharges;
                        this.shipping = this.order.Shipping || 0;
                        this.subtotal = this.order.SubTotal;
                        this.taxe = this.order.Taxe;
                        this.tip = this.order.Tip;
                        this.payed = this.order.QuotationPayment;
                        this.total = this.order.Total;
                        this.note = this.order.Note;
                        loading.dismiss();
                        return this.getCustomer(this.order.ClientId);
                    })
                    .catch(e => {
                        console.log(e);
                        loading.dismiss();
                        this.ifErrorOccured(this._init)
                    })     
                })
            }) 
        }
    },
    delProduct(id){
        // console.log(this.products.findIndex(prod => prod._id === id));
        this.products.splice(this.products.findIndex(prod => prod._id === id), 1);
        this.calcTotal();
    },
    delService(id){
        // console.log(this.products.findIndex(prod => prod._id === id));
        this.products.splice(this.products.findIndex(serv => serv._id === id), 1);
        this.calcTotal();
    },
    addProduct(){
        return this.$ionic.modalController
                .create({
                component: Modal,
                cssClass: 'my-custom-class',
                componentProps: {
                    data: {
                        content: '',
                    },
                    propsData: {
                        title: 'Select Product',
                        button: 'Close',
                        button2: 'Save',
                        parent: this,
                    },
                },
                })
                .then(m => m.present())
    },
    addService(){
        return this.$ionic.modalController
                .create({
                component: Modal,
                cssClass: 'my-custom-class',
                componentProps: {
                    data: {
                        content: '',
                    },
                    propsData: {
                        title: 'Select Service',
                        button: 'Close',
                        button2: 'Save',
                        parent: this,
                        addType: 'Service',
                    },
                },
                })
                .then(m => m.present())
    },
    delDeadLine(id){
        this.deadLines.splice(id, 1)
    },
    addDeadLine(){
        if (this.percentDeadLine < 1 || this.percentDeadLine > 100)
        {
            this.ShowMessage('El porciento de pago debe ser un valor entre 1 y 100.')
            return;
        }
        if (isNaN(this.percentDeadLine))
        {
            this.ShowMessage('El porciento de pago debe ser un número.')
            return;
        }
        if (this.dateDeadLine == ''){
            this.ShowMessage('La fecha tentativa del pago del plazo es requerida.')
            return;
        }
        const dl = {
              'Percent': this.percentDeadLine,
              'Date': this.dateDeadLine,
              'State': 0		
          }
        this.deadLines.push(dl);
        document.getElementById('percentDeadLine').value = '';
        document.getElementById('dateDeadLine').value = '';
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
    getFormateNumber: function(number){
        return new Intl.NumberFormat('en', {style: "currency", currency: this.currency} ).format(number).toString()
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
                      name: 'OrderCateringForm',
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
        
        console.log("VALID FORM")
        this.deadLinePercentInc++
        if (this.products.length == 0)
        {
            return false
        }
        if (this.haveDeadlines)
        {
            let s = 0
            this.deadLines.forEach(dl => {
                if (dl.Date == '')
                    return false
                if (isNaN(dl.Percent))
                    return false
                s +=  parseFloat(dl.Percent)

            })
            if(s != 100) return false
            
        }

        console.log("TRUE EN ESTE PUNTO");
        return true;

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
    // fetchProducts: function(){
    //     Api.fetchAll('Product').then(response => {
    //       // console.log(response.data)
    //       this.products = response.data
    //     })
    //     .catch(e => {
    //       console.log(e)
    //     });
    // },
    //Create or edit a new product
    cancel: function(){
        let item = {
            "_id": this.id,
            "State": 6,
        }
        // console.log(item)
        // return
        this.spinner = true;  
            Api.putIn(this.modelName, item)
            .then(response => {
                const orderInfo = this.customer.Name + this.$t('backoffice.form.marketingMessages.cateringCancel');
                if (this.customer)
                {
                    if (this.customer.MarketingConsent.Phone)
                        this.sendSms(this.customer.Phone, orderInfo);
                    if (this.customer.MarketingConsent.Email)
                        this.sendCancelEmail(this.customer.Email)
                }
                else
                {
                    this.sendCancelEmail(this.order.CustomerEmail);
                }
                this.spinner = false;
                this.showToastMessage(this.$t('backoffice.list.messages.messageCateringCancelled'), "success");
                this.$router.push({
                    name: 'CateringOrder', 
                });
                return response;
            })
            .catch(e => {
                this.isBackdrop = false;
                console.log(e);
                this.spinner = false;
                this.ifErrorOccured(this.approve);
            })

    },
    approve: function(){

      if (this.isValidForm()){

            // this.isBackdrop = true;
            
            this.order.Date = this.date;
            this.order.OrderType = this.orderType;
            this.order.Products = this.products;
            this.order.OtherCharges = this.otherCharges;
            this.order.SubTotal = this.subtotal;
            this.order.Discount = this.discountAmount;
            this.order.Taxe = this.taxe;
            this.order.Total = this.total;
            this.order.State = 8;

            // let item = {
            // "_id": this.id,
            // "Date": this.date,
            // "OrderType": this.orderType,
            // "Products": this.products,
            // "OtherCharges": this.otherCharges,
            // "SubTotal": this.subtotal,
            // "Taxe": this.taxe,
            // "Total": this.total,
            // "State": 8,
            // }
            if(this.orderType == 'Delivery')
            {
                if (this.shipping < 1)
                {
                    this.ShowMessage('Debe rellenar un precio de envío')
                    return
                }
                else{
                    // item["Shipping"] = this.shipping
                    this.order.Shipping = this.shipping;
                }
                // item["AddressToDeliver"] = this.address
                this.order.AddressToDeliver = this.address;
            }
            if(this.orderType == 'PickUp')
            {
                // item["HourToPick"] = this.hourToPick
                this.order.HourToPick = this.hourToPick;
            }
            if (this.haveDeadlines && this.deadLines.length > 1)
            {
                // item["DeadLines"] = this.deadLines
                this.order.Deadline = this.deadLines;
            }
            if(this.note != ""){
                // item["Note"] = this.note
                this.order.Note = this.note;
            }

            // console.log(item);
            // return;
            this.spinner = true;  
            Api.putIn(this.modelName, this.order)
            .then(response => {
                this.sendEmail(this.order);

                if (this.customer && this.customer.MarketingConsent.Phone)
                {
                    const orderInfo = this.customer.Name + this.$t('backoffice.form.marketingMessages.cateringApproved');
                    this.sendSms(this.customer.Phone, orderInfo);
                }
                    
                this.spinner = false;
                this.showToastMessage(this.$t('backoffice.list.messages.messageCateringApproved'), "success");
                this.$router.push({
                    name: 'CateringOrder', 
                });
                return response;
            })
            .catch(e => {
                this.isBackdrop = false;
                console.log(e);
                this.spinner = false;
                this.ifErrorOccured(this.approve);
            })
            
        }  
    },
    sendCancelEmail(email){
          console.log(email);
           let items = {
              "email": email,
              "mess": this.$t('backoffice.list.messages.cateringCancel'),
              "subject": this.$t('backoffice.form.marketingMessages.orderInfo')
            };
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
    sendEmail(order){
        var date = this.dateEstimateToPick + " : " + this.hourToPickEstimated;

        const  allStates = [this.$t('frontend.order.state0'),this.$t('frontend.order.state1'), this.$t('frontend.order.state2'),
        this.$t('frontend.order.state3'), this.$t('frontend.order.state4'), this.$t('frontend.order.state5')];

        let orderInfo = '';
        if(order.OrderType == 'Delivery Catering')
            orderInfo = order.AddressToDeliver
        if(order.OrderType == 'PickUp Catering')
            orderInfo = date
        if(order.OrderType == 'On Table Catering')
            orderInfo = order.tableServices

        
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
        html += `<img src="${this.restaurantLogo}" style="max-width: 100px;"></img> `;     
        html +=`</td>`;     
        html += `</tr>`;          
        html += '<tr><td colspan=6 >'
        if(order.PaymentMethod)
        html += `<br> <h4> ${this.$t('frontend.order.paymentMethod')}: ${order.PaymentMethod}</h4>`;
        if(order.PaymentTransId)
            html += `<h4> ${this.$t('frontend.order.transId')}: ${order.PaymentTransId} </h4>`;
        html += `<h4>${this.$t('frontend.order.date')}: ${date} </h4><hr>`;
        html += `<h4>${this.$t('frontend.order.client')}: ${order.CustomerName} </h4>`;
        html += `<h4>${this.$t('frontend.orderType.phone')}: ${order.CustomerPhone} </h4>`;      
        html += `<h4>${this.$t('frontend.order.orderFor')} ${this.allTypeOrder[order.OrderType]}: ${orderInfo} </h4>`;
        // if(this.showCooker && order.Cooker)
        // html += `<h4>${this.$t('frontend.order.cooker')}: ${Cookername} </h4>`;
        html += `<h4>${this.$t('frontend.order.orderState')}: ${allStates[order.State]} </h4>`;
        if(order.State == 6)
            html += `<h4>${this.$t('frontend.order.cancelReason')}: ${order.CancelNote}</h4>`;
    
        html += '<hr>';
        html += '<tr><td colspan=6 >'
        if(order.EventName)
            html += `<h4> ${this.$t('frontend.order.eventName')}: ${order.EventName} </h4>`;
        if(order.CateringEvent)
            html += `<h4> ${this.$t('frontend.home.eventType')}: ${order.CateringEvent} </h4>`;
        if(order.NumberOfGuess)
            html += `<h4> ${this.$t('frontend.order.guessNumber')}: ${order.NumberOfGuess} </h4>`;
        if(order.EventDate)
            html += `<h4> ${this.$t('frontend.order.eventDate')}: ${Moment( order.EventDate ,'kk:mm').format('MM-DD-YYYY')} </h4>`;
        if(order.EventTimeStart)
            html += `<h4> ${this.$t('frontend.order.eventStartHour')}: ${ Moment( order.EventTimeStart ,'kk:mm').format('hh:mm A')} </h4>`;
        if(order.EventTimeEnd)
            html += `<h4> ${this.$t('frontend.order.eventEndHour')}: ${ Moment( order.EventTimeEnd ,'kk:mm').format('hh:mm A')} </h4>`;
        html += `</td></tr>`;
        html += '<hr>'; 

        html += `</td></tr>`;      
        html += `<tr ><td colspan=6 ><h4 ><strong>${this.$t('frontend.order.products')}</strong></h4></td></tr> <tr></tr>`;
        for(var i = 0; i<order.Products.length ; i++){
            html += `<tr ><td  colspan=4 style="width: 50%;border-bottom: 1px solid #dbd1d1;" ><strong >${order.Products[i].Name}</strong>` ;
            if(order.Products[i].Note !='')
                html +=`<p style="background: #f1f1004d;">${order.Products[i].Note}</p> `;
            html +=`</td><td style="width: 25%;border-bottom: 1px solid #dbd1d1;" > <p >( ${order.Products[i].Cant} X $ ${order.Products[i].Price.toFixed(2)})</p> </td>`;
            html += `<td style="width: 25%;border-bottom: 1px solid #dbd1d1;"> <p >$ ${ ( order.Products[i].Price * order.Products[i].Cant ).toFixed(2)}</p> </td>`;
            html += `</tr>`;
        if(order.Products[i].Aggregates.length > 0){
                html +=`<tr style="padding: 20px 35px;"> ${this.$t('frontend.home.aggregateFree')}: ${order.Products[i].CantAggr=order.Products[i].AggregatesCant * order.Products[i].Cant} </tr>`;

                for(var a=0; a<order.Products[i].Aggregates.length; a++){
                    let agg = order.Products[i].Aggregates[a]
                    html += `<tr ><td  colspan=4 style="width: 50%;border-bottom: 1px solid #dbd1d1;" ><p style="padding-left: 20px;">${agg.Name} <br> $ ${agg.SalePrice.toFixed(2)}</p>` ;
                    html +=`</td><td style="width: 25%;border-bottom: 1px solid #dbd1d1;" > <p > ${agg.Cant}</p> </td>`;
                    html += `<td style="width: 25%;border-bottom: 1px solid #dbd1d1;"> <p >$ ${ ( agg.AllTotal ).toFixed(2) }</p> </td></tr >`;            
                }
            }
            
        }

        if(order.OtherCharges.length >0){
            html += `<tr ><td colspan=6 ><h4 ><strong>${this.$t('frontend.order.otherCharges')}</strong></h4></td></tr>`;
            for(var e = 0; e< order.OtherCharges.length ; e++){
                html += ` <tr ><td colspan=5 style="width: 75%;border-bottom: 1px solid #dbd1d1;"><p >${order.OtherCharges[e].Name}</p></td> <td style="border-bottom: 1px solid #dbd1d1;"> <p>$ ${order.OtherCharges[e].Price.toFixed(2)}</p></td></tr>`;
            }
        }
        html += `<tr ><td colspan=5 ><p ><strong>${this.$t('frontend.order.subtotal')}</strong></p></td> <td > <p >$ ${order.SubTotal}</p></td></tr>`;
        html += `<tr><td  colspan=5><p  ><strong>${this.$t('frontend.order.taxe')}</strong></p></td> <td > <p >${order.Taxe} %</p> </td></tr>`;
        if(order.OrderType == 'Delivery' && order.Shipping)
            html +=  `<tr ><td colspan=5 ><p  ><strong>${this.$t('frontend.order.deliver')}</strong></p></td><td  ><p >$ ${order.Shipping}</p></td></tr>`;
        if(order.Tip)
            html += `<tr ><td  colspan=5 ><p ><strong>${this.$t('frontend.order.tip')}</strong></p></td><td ><p>% ${ parseInt(order.Tip).toFixed(2) }</p> </td></tr>`;
        html += `<tr><td colspan=5 style="border-bottom: 1px solid #dbd1d1;"><p  ><strong>${this.$t('frontend.order.total')}</strong></p></td> <td style="border-bottom: 1px solid #dbd1d1;"> <strong >$ ${order.Total}</strong> </td></tr>`;
        if(order.QuotationPayment)
            html += `<tr><td colspan=5 style="border-bottom: 1px solid #399922;"><p  ><strong>${this.$t('frontend.order.quotationPayment')}</strong></p></td> <td style="border-bottom: 1px solid #399922;"> <strong >$ ${order.QuotationPayment}</strong> </td></tr>`;
            if(order.PendingPayment)
            html += `<tr><td colspan=5 style="border-bottom: 1px solid #ff5500;"><p  ><strong>${this.$t('frontend.order.pendingPayment')}</strong></p></td> <td style="border-bottom: 1px solid #ff5500;"> <strong >$ ${order.PendingPayment}</strong> </td></tr>`;
        if(order.PendingPayment > 0 && order.Deadline){
            html += `<tr ><td colspan=6 ><h4 ><strong>${this.$t('frontend.order.parcialPayment')}</strong></h4></td></tr>`;
            for(var dead = 0; dead < order.Deadline.length ; dead ++){
                html += ` <tr ><td colspan=3 style="border-bottom: 1px solid #dbd1d1;"><p >${order.Deadline[dead].Date}  </p></td> `
                html += ` <td colspan=3 style="border-bottom: 1px solid #dbd1d1;"><strong >  ${order.Deadline[dead].Percent}%  =  $ ${ (this.totalWithoutQuotation * order.Deadline[dead].Percent / 100).toFixed(2)}</strong></td> `
                if(order.Deadline[dead].State === 1)
                html += ` <td style="border-bottom: 1px solid #dbd1d1;"> <strong  style= "color: #399922;  ">${this.$t('frontend.order.payed')}</strong></td>`;
                else html += ` <td style="border-bottom: 1px solid #dbd1d1;"><strong  style= "color: #ff5500; ">${this.$t('frontend.order.toPay')}</strong> </td>`;
                html += ` </tr>`;
            }
        }
        if(order.Note)
            html += `<tr ><td style="width: 20%;border-bottom: 1px solid grey;"><h4 >${this.$t('frontend.order.notes')}</h4></td><td colspan=5 style="width: 80%;border-bottom: 1px solid grey;" ><p >${order.Note}</p></td></tr>`;
        html += '<tr><td colspan=6 style=" text-align: center;">';
        html += `<h2>${this.restaurantName}</h2>  `;
        html += `<h4>${this.restaurantPhone} </h4> `;
        html += `<h4>${this.restaurantAddress}  </h4>`; 
        if(this.restaurantWeb)  
            html += `<h4>${this.restaurantWeb}  </h4>`;   
        html +=`</td>`;     
        html += `</tr>`; 
        html += '<tr> <td colspan=6 align="center"  style="border-bottom: 1px solid grey;">';
        html += `<a href="mailto:${this.restaurantEmail}" style="margin: 0 10px;"><img style="width: 32px;" src="https://storagemenusuccess.blob.core.windows.net/logo/email-icon.png"></img> </a>`;
        if(this.restaurantFacebok)
            html += `<a href="${this.restaurantFacebok}" style="margin: 0 10px;"><img style="width: 32px;" src="https://storagemenusuccess.blob.core.windows.net/logo/Facebook-icon.png"></img> </a>`;
        if(this.restaurantInstagram)
            html += `<a  href="${this.restaurantInstagram}" style="margin: 0 10px;"><img style="width: 32px;"  src="https://storagemenusuccess.blob.core.windows.net/logo/instagram-icon.png"></img> </a>`;
        if(this.restaurantTwitter)
            html += `<a href="${this.restaurantTwitter}" style="margin: 0 10px;"><img style="width: 32px;"  src="https://storagemenusuccess.blob.core.windows.net/logo/Twitter-icon.png"></img> </a>`;
        if(this.restaurantYoutube)
            html += `<a href="${this.restaurantYoutube}" style="margin: 0 10px;"><img style="width: 32px;"  src="https://storagemenusuccess.blob.core.windows.net/logo/Youtube-icon.png"></img> </a>`;
        
        html += '</td></tr>'
        html += `</table></div></body></html>`;

        let subject = this.$t('frontend.order.invoice') ;
        if(order.PaymentTransId)
            subject += '-'+ order.PaymentTransId
        if(order.OrderForCatering)
            subject += ' | '+ this.$t('frontend.menu.catering') ;
        subject += ' ' + this.restaurantName    
            
                
        var items = {
            "email": order.CustomerEmail,
            "mess": html,
            "subject": subject
        }
        Api.sendEmail(items);

        }

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