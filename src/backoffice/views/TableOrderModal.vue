<template>
  <div>
    <ion-header>
      <ion-toolbar>
          <ion-item>
              
                <ion-button color="danger" @click="dismissModal()" >X</ion-button>
          </ion-item>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
                      
           <div  > 
                 <paginate
                name="orders"
                :list="content"
                :per="1"
                >
                    <ion-slide v-for="(order) in paginated('orders')" v-bind:key="order._id">
                        <div style="width: 100%; display: flex; flex-direction: column;align-items: center;">
                            <ion-chip style="margin: 0;bottom: -10px; font-weight: bold;" outline
                                  :color="order.State == 5 ? 'success' : order.State == 6 ? 'danger' : order.State == 0 ? 'warning' : order.State == 4 ? 'primary' : 'secondary'">
                                  {{getFormateHour(order.Date)}}
                          </ion-chip>
                          <ion-card style="text-align: left;width: 100%"   
                          :color="order.State == 5 ? 'success' : order.State == 6 ? 'danger' : order.State == 0 ? 'warning' : order.State == 4 ? 'primary' : 'secondary'">
                              <ion-card-header style="margin: 10px 5px 2px; padding: 10px;background:white;color: black;">
                                  <ion-card-title  style="color: black;">{{ order.OrderType }} - 
                                  <span style="text-transform: uppercase;"> {{order._id.slice(-4)}} </span>
                                  <span v-if="order.CarArrived && order.State !==5"                      
                                  class="iconify" data-icon="clarity:car-solid" data-inline="false" 
                                  style="float: right; color: #48bc76; margin:0"></span> 
                                  </ion-card-title>
                                  
                                  <ion-card-subtitle v-if="order.CustomerName"
                                  style="color: black; display: flex;justify-content: space-between;">
                                  <div style="text-align: center;"> 
                                      <span class="iconify" data-icon="bx:bxs-user-circle" data-inline="false" 
                                      style="color: #808080a6;width: 20px;  height: 20px; margin: 0;"></span>
                                  </div>
                                  <div style="text-align: right;"  >{{ order.CustomerName }}</div>
                                  </ion-card-subtitle>

                                  <ion-card-subtitle v-if="order.StaffName"
                                  style="color: black; display: flex;justify-content: space-between;">
                                  <div style="text-align: center;"> 
                                      <span class="iconify" data-icon="grommet-icons:restaurant"
                                      style="color: #808080a6; width: 20px;  height: 20px; margin: 0;" data-inline="false"></span>
                                  </div>
                                  <span style="text-align: right;"  > {{ order.StaffName }}</span>
                                  </ion-card-subtitle>
                                  
                                  </ion-card-header>

                                  <ion-card-content style="margin: 1px 5px; padding: 5px;background:white;color: black;" :key="cartKey + 'C'">
                                  <div v-for="(prod, index) in order.Products" :key="index" >
                                          <div style="display: flex;justify-content: space-between; padding: 2px;margin:5px 0">
                                          <span :style="prod.State===1? 'text-decoration: line-through;':'text-decoration: none'">{{prod.Cant}} X {{prod.Name}} </span> 
                                          <ion-checkbox v-if="prod.State === 0" color="secondary" @click="changeProductState(order, index)"></ion-checkbox>
                                          <ion-checkbox v-if="prod.State ===1"  checked disabled color="secondary"></ion-checkbox>
                                          </div>

                                          <div v-if="prod.Aggregates.length > 0" style="padding-left: 5px;">
                                          <div v-for="(agg, index1) in prod.Aggregates" :key="index1"  style="padding-left: 2px; display: list-item; list-style: inside" >                                                          
                                          {{agg.Cant}} X {{agg.Name}} 
                                          </div>
                                          </div>
                                          <div v-if="prod.Note" style="padding-left: 15px;">                                                                                          
                                              <span style="background: #ffff0047;" >{{i18n.t('frontend.order.notes')}}: {{prod.Note}}</span>                                 
                                          </div>                              
                                  </div>
                                  <div v-if="order.OtherCharges.length > 0">
                                      <ion-label class="ion-text-wrap" >
                                          <strong class="titles-order" >
                                              {{i18n.t('frontend.order.otherCharges')}}
                                          </strong> 
                                      </ion-label>
                                                      
                                      <div v-for="charge in order.OtherCharges" v-bind:key="charge.Id">                              
                                          <div style="padding-left: 2px; display: list-item; list-style: inside;">
                                              {{ charge.Name }}
                                          </div>                                
                                      </div>

                                  </div>
                                  </ion-card-content>
                                  
                                  <ion-card-content style="margin:5px; background:white;color: black;text-align: center; padding: 0;" :key="stateKey + 'S'">

                                  

                                      <ion-select  :value="statesAll[order.State].name" interface="popover" icon="add"
                                          style="font-size: 16px;font-weight: 500;"
                                          @ionChange="stateToChange(order, $event.target.value)" >
                                          <ion-select-option
                                          v-for="(ps, index) in stateByOrder(order)" :key="index" :value="ps.name">
                                          {{ps.name}}
                                          </ion-select-option>
                                      </ion-select>
                                  </ion-card-content>
                              <div style="display: flex;justify-content: space-between;align-items: center;"> 
                              <div v-tooltip="i18n.t('frontend.order.notes')" @click="showOrderNote(order)" >
                                  <span  class="iconify" data-icon="bi:info-circle-fill" data-inline="false" style="width: 20px;height: 20px;"></span>
                              </div>
                                  <h3 style="text-align: center;">{{ getFormatPrice(order.Total) }}</h3>
                                  <div v-tooltip="i18n.t('frontend.tooltips.editTicket')" @click="viewOrder(order._id)">
                                  <span   class="iconify" data-icon="el:file-edit-alt" data-inline="false" style="width: 20px;height: 20px;"></span>
                                  </div>
                              </div>                
                          </ion-card>
                        </div>
                    
                    </ion-slide>

                </paginate>

                <paginate-links for="orders" color="secondary" 
                :simple="{
                    next:'»' ,
                    prev: '« ' }"
                ></paginate-links> 
           </div>           
    </ion-content>
  </div>
</template>

<script>


import { Api } from '../api/api.js';
import { Utils } from '../utils/utils.js';
import {i18n} from '@/plugins/i18n'
import router from '../router/index.js'
export default {
  name: 'TableOrderModal',
  props: {
      allStates: {type: Array, default:() => [] },
    
  },
  components: {
    
  },
created(){
      this.i18n = i18n;   
      this. statesAll = [
        { state: 0,
          name: this.i18n.t('frontend.order.state0')},
        { state: 1,
          name: this.i18n.t('frontend.order.state1')},
        { state: 2,
          name: this.i18n.t('frontend.order.state2')},
        { state: 3,
          name: this.i18n.t('frontend.order.state3')},        
        { state: 5,
          name: this.i18n.t('frontend.order.state5')},
        { state: 6,
          name: this.i18n.t('frontend.order.state6')},        
        ];
         
  },
  data() {
    return {
      content: 'Content',
      i18n: {},  
      slideOpts:{speed: 400, slideShadows: true, initialSlide:1,  slidesPerView: 3,},
      spinner: false,
      key: 0,
       paginate: ['orders'],
        cartKey: 0,
      stateKey: 0,
      statesAll: [],
     }
  },

  methods:{
    dismissModal() { 
        this.$ionic.modalController.dismiss(null);
    },

    async changeOrderState(order, index, state){
        const orderUpd = order;
        //console.log('state: '+ state);
        //console.log('order');
        //console.log(order.State);

        orderUpd.State = state;
        this.spinner = true;

        //console.log('orderUpd');
        //console.log(orderUpd.State);

        const response = await Api.putIn('Order', orderUpd);
        if(response.status === 200){
             this.spinner = false;
            //console.log('update order')
            //console.log(response.data)
            if(state === 5){
                this.content.splice(index, 1);
            }else{
               this.content[index].State = state; 
            }            
           
        }
        else this.spinner = false;
    },

    async setProductReady(order, index, product, indexP){
        //console.log(order)
        //console.log(index)
        //console.log(product)
        //console.log(indexP)

        this.key ++;
        const orderUpd = order;
        orderUpd.Products[indexP].State = 1;

        this.spinner = true;

        //console.log('orderUpd');
        //console.log(orderUpd.State);

        const response = await Api.putIn('Order', orderUpd);
        if(response.status === 200){
             this.spinner = false;           
               this.content[index].Products[indexP].State = 1;
        }
        else this.spinner = false;
    },

     getFormateHour: function(date){
        return Utils.getFormatHour(date);         
    },

    getFormatPrice: function(price){
        return Utils.getFormatPrice(price);         
    },

    stateByOrder(order){
      const possibleStates = [];
          for (let i = order.State; i < this.statesAll.length - 1; i++) {
              const element = this.statesAll[i];
              if (order.OrderType != "Delivery" && this.statesAll[i].name == "On the way")
                    continue;
              if (!possibleStates.includes(element))
                    possibleStates.push(element);
          }
      return possibleStates
    },

    async changeProductState(order, index){

      order.Products[index].State = 1;
      await Api.putIn('Order', order);
      this.cartKey ++;

    },

    async stateToChange(order, state){      
      const index = this.statesAll.findIndex(s => s.name === state)
      //console.log(index);
      if(index !== -1 ){
        order.State = index;
        await Api.putIn('Order', order);       
        this.stateKey ++;
      }      
    },

     viewOrder: function(id){
         this.dismissModal();
        router.push({
        name: 'OrderDetails', 
        params: { orderId: id }
      });
    },

        async showOrderNote(order){
      const alert = await this.$ionic.alertController
      .create({
        cssClass: 'my-custom-class',
        header: this.i18n.t('frontend.order.notes') ,
        message: order.Note,
        inputs: [  
          { type:'textarea', name: 'address', placeholder: this.i18n.t('frontend.order.add') },               
        ],  
        buttons: [
          {text: this.i18n.t('frontend.home.cancel'),role: 'cancel', cssClass: 'secondary',
            handler: () => {                
            },
          },
          {
            text: this.i18n.t('frontend.home.acept'),
            handler: async (data) => {
                if(data.address !== order.Note){
                  const n = order.Note || ''
                  order.Note = n + "\n" + data.address;
                  await Api.putIn('Order', order);
                }              
            },
          },
        ],
      })
      // .then(a => a.present())
      return alert.present();
    },

  },
}
</script>

<style >
.qrTitle{
  margin: 15px !important;
    font-size: 34px !important;
}
  
</style>