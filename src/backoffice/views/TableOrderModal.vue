<template>
  <div>
    <ion-header>
      <ion-toolbar>
          <ion-item>
                <ion-title >Table Order Modal</ion-title>
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
                    <ion-slide v-for="(order, index) in paginated('orders')" v-bind:key="order._id">
                        <ion-card style="width: 100%;" color="secondary">
                            <ion-label>
                                <h2 class="qrTitle"><b>{{order.tableService}}</b></h2>                        
                            </ion-label>
                            
                                    
                            <div v-for="(product, indexP) in order.Products" v-bind:key="indexP" style="">

                                <ion-item color="secondary">                            
                                    <div class="ion-text-wrap menu-col-6" >
                                        <ion-label><strong>{{ product.Name  }}</strong></ion-label> 
                                        <ion-label v-if="product.Note">( {{product.Note}} )</ion-label>                               
                                    </div>
                                    <div class="ion-text-wrap menu-col-3" >
                                        <ion-label>{{product.Cant}}</ion-label>
                                    </div>
                                    <div class="ion-text-wrap menu-col-3"  v-if="order.isTicket" :key="key">                                
                                        <div v-if="product.State === 1" v-tooltip="'Ready'">
                                            <span class="iconify" data-icon="openmoji:pot-of-food" data-inline="false" color="green" ></span>
                                        </div>
                                        <div v-if="product.State === 0"  v-tooltip="'Set Ready'">
                                            <ion-button color="light" @click="setProductReady(order, index, product, indexP)">
                                            <ion-icon slot="icon-only" name="checkmark" ></ion-icon>
                                            </ion-button>
                                        </div>
                                                                        
                                    </div>                                                        
                                </ion-item>

                                <div v-if="product.Aggregates.length > 0" style="padding-left: 35px;">
                                    <ion-label class="ion-text-wrap">
                                        <h2 style="width: 100%;text-align: left;    text-decoration: underline;">Aggregates</h2>
                                    </ion-label>

                                    <ion-item v-for="(agg, index1) in product.Aggregates" :key="index1" color="secondary" >
                                                
                                        <div class="menu-col-6" style="">
                                            <ion-label>{{agg.Name}}   </ion-label>
                                        </div>
                                        <div class="menu-col-6" style="">
                                            <ion-label>{{agg.Cant}}   </ion-label>
                                        </div>

                                    </ion-item>  
                                </div>
                                                                            
                            </div>

                            <div v-if="order.OtherCharges.length > 0">
                                <!-- <ion-label class="ion-text-wrap" >
                                    <h2 class="titles-order" >OtherCharges</h2>
                                </ion-label> -->
                                
                                <ion-item v-for="charge in order.OtherCharges" v-bind:key="charge.Id" color="secondary">
                                    <div class="menu-col-8">
                                        <p>{{ charge.Name }}</p>
                                    </div>                            
                                </ion-item>  
                            </div>

                        

                        
                            <h2 style="width: 100%;text-align: left;" v-if="!order.isTicket" >
                                State: {{allStates[order.State]}}
                                <ion-spinner v-if="spinner" style="margin: 0 15px"></ion-spinner>
                            </h2>
                                            

                            <div v-if="!order.isTicket" color="light">
                            
                                <div class="ion-text-wrap menu-col-4" style="float: left" v-if="order.State < 2">
                                    <ion-button @click="changeOrderState(order, index, 2)">{{allStates[2]}}</ion-button>                                                           
                                </div>
                                <div class="ion-text-wrap menu-col-4" style="float: left" v-if="order.State < 3">
                                    <ion-button @click="changeOrderState(order,index, 3)">{{allStates[3]}}</ion-button>                                                           
                                </div>                        
                                <div class="ion-text-wrap menu-col-4" style="float: left" v-if="order.State < 5">
                                    <ion-button @click="changeOrderState(order,index, 5)">{{allStates[5]}}</ion-button>                                                           
                                </div>
                            </div>


                        </ion-card>
                    
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
export default {
  name: 'TableOrderModal',
  props: {
      allStates: {type: Array, default:() => [] },
    
  },
  components: {
    
  },
  data() {
    return {
      content: 'Content',
      slideOpts:{speed: 400, slideShadows: true, initialSlide:1,  slidesPerView: 3,},
      spinner: false,
      key: 0,
       paginate: ['orders'],
    }
  },
  created(){
          
  },
  methods:{
    dismissModal() { 
        this.$ionic.modalController.dismiss(null);
    },

    async changeOrderState(order, index, state){
        const orderUpd = order;
        console.log('state: '+ state);
        console.log('order');
        console.log(order.State);

        orderUpd.State = state;
        this.spinner = true;

        console.log('orderUpd');
        console.log(orderUpd.State);

        const response = await Api.putIn('Order', orderUpd);
        if(response.status === 200){
             this.spinner = false;
            console.log('update order')
            console.log(response.data)
            if(state === 5){
                this.content.splice(index, 1);
            }else{
               this.content[index].State = state; 
            }            
           
        }
        else this.spinner = false;
    },

    async setProductReady(order, index, product, indexP){
        console.log(order)
        console.log(index)
        console.log(product)
        console.log(indexP)

        this.key ++;
        const orderUpd = order;
        orderUpd.Products[indexP].State = 1;

        this.spinner = true;

        console.log('orderUpd');
        console.log(orderUpd.State);

        const response = await Api.putIn('Order', orderUpd);
        if(response.status === 200){
             this.spinner = false;           
               this.content[index].Products[indexP].State = 1;
        }
        else this.spinner = false;
    }
  },
}
</script>

<style >
.qrTitle{
  margin: 15px !important;
    font-size: 34px !important;
}
  
</style>