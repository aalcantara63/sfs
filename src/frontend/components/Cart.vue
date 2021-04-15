<template>
  <div>
    <ion-header>

        <ion-toolbar>
            <ion-buttons slot="start" @click="dismiss()">
              <ion-back-button default-href="home"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>{{title}} </h1>            
            </ion-label>
             
          </ion-toolbar>
    
    </ion-header>
    <ion-content class="ion-padding">

       

        <ion-card  >
         
            <ion-list>
                <div v-for="(car, index) in cart" :key="car.Name" >
                   
                         
                    <ion-item>

                        <div class="menu-col-4">                       
                            <p>{{car.Name}} <br> ( {{ getFormatPrice(parseFloat(car.Price)) }} )</p>
                        </div>

                        <div class="menu-col-4">     
                            <ion-input inputmode="numeric"
                              :readonly="car.State === 1"
                              type="number" min=1 :value="car.Cant" 
                              @input="car.y=$event.target.value" 
                              :style="car.State === 0 ? 'text-align: center;width: 60%;float: left;    border: 1px solid #80808042;':'text-align: center;width: 60%;float: left;    border: 0;'" >
                            </ion-input>  
                            <ion-icon 
                              v-if="car.State === 0"
                              name="refresh" color="blue" size="large" 
                              style="margin-top: 0px;width: 24px;" 
                              @click="addCant(index, car.y || car.Cant)" v-tooltip="refresh"> 
                            </ion-icon>   
                             <span 
                              v-if="car.State === 0"
                             style="font-size: 9px; display: table;">{{ refresh }}</span>                         
                        </div>

                        <div class="menu-col-4"> 
                            <p style="width: 70%; float: left;    margin-top: 10px;">{{ getFormatPrice(car.Price * car.Cant) }}</p> 
                            <ion-icon 
                              v-if="car.State === 0"
                              size="large" color="danger" 
                              @click="deleteToCart(index)" name="trash" 
                              style="float: right;"> 
                            </ion-icon>
                            <span 
                               v-if="car.State === 1"
                              class="iconify" 
                              data-icon="openmoji:pot-of-food" 
                              data-inline="false" 
                              style="float: right; margin:0"
                              color="green" >
                            </span> 

                        </div>
                    </ion-item>   

                      
                   
                    <p v-if="car.Aggregates.length > 0" style="margin: 0;padding-left: 20px;font-size: 0.7em;text-align: left;">{{aggregateFree}} {{car.CantAggr=car.AggregatesCant * car.Cant}} </p>

                   <ion-item v-for="(agg, index1) in car.Aggregates" :key="index1"  style="padding-left:25px" >
                                               
                        <div class="menu-col-4" >
                         <p >{{agg.Name}} <br> ( {{getFormatPrice(agg.SalePrice)}} )</p>  
                         </div>
                  
                        <div class="menu-col-4">     
                            <ion-input type="number" min=1 :value="agg.Cant" @input="agg.Cant=$event.target.value" style="text-align: center;width: 60%;float: left;" >
                            </ion-input>  
                            <ion-icon name="refresh" color="blue" size="large" style="margin-top: 0px;width: 24px;" @click="agg.Cant=addAgregate(index, index1, agg.Cant)"> </ion-icon>   
                        </div>
                         
                      <div class="menu-col-4" :key="key" >                        
                        <p v-if="car.CantAggr - agg.Cant >= 0" style="width: 70%; float: left;margin-top: 10px;">{{getFormatPrice(0) }}  <span style="opacity:0">{{car.CantAggr = car.CantAggr - agg.Cant}}</span></p> 
                        <p v-else style="width: 70%; float: left; margin-top: 10px;" > {{ getFormatPrice(agg.SalePrice * (agg.Cant-car.CantAggr)) }} <span style="opacity:0">{{car.CantAggr = 0}}</span></p> 
                        <ion-icon  size="large" color="danger" @click="deleteToAgg(index, index1)" name="trash" style="float: right; margin-top: 2px;width: 24px"> </ion-icon>                                               
                     
                     </div>

                    </ion-item>

                </div>  

                 <ion-item > 
                     <div class="menu-col-12" style="padding: 20px 0;font-weight: 600;"> 
                        <ion-label :key="key" style="text-align: right;">TOTAL: {{ getFormatPrice(finalTotal()) }}</ion-label>                                           
                    </div>
                </ion-item>
               
                
            </ion-list>  

       
          
        
        </ion-card>

        <ion-item>
          <ion-button color="primary" class="menu-col-6" size="normal" @click="dismiss">{{buttonCancel}}</ion-button>
          <ion-button color="primary" :disabled="cart.length ===0 " class="menu-col-6" size="normal" @click="checkOut">{{buttonAcept}}</ion-button>
        </ion-item>  
       
    </ion-content>
  </div>
</template>

<script>

import { EventBus } from '../event-bus';


export default {
  name: 'ProductDetail',
  props: { 
    parent: { type: Object, default: () => {} },
    title: { type: String, default: '' },
    message: { type: String, default: '' },    
    buttonCancel: { type: String, default: '' },    
    buttonAcept: { type: String, default: '' }, 
    aggregateFree: { type: String, default: '' },    
    refresh: { type: String, default: '' },
    currency:  { type: String, default: '' },
  },
  created: function(){
    
    this.cart = this.parent.$store.state.cart
    
  },
  computed: {
    Total(){
          let total = 0;      
          this.cart.forEach(car => total += parseFloat( this.getTotal(parseInt(car.AggregatesCant),  parseInt(car.Cant), parseFloat(car.Price), car.Aggregates) ))
          
          return total;
      },

  
  },
  data() {
    return {
      content: 'Content',
      staticUrl:"https://imenuapps.net/?share=",
      thisCant:1,
      thisNote: this.Note,
      thisPrice: this.SalePrice,
      thisName: '',
      key:0,
      cart: [],
    }
  },
   components:{
     
  },
 
methods: {

    dismiss(){
       return this.$ionic.modalController.dismiss()
    },

    addCant(index, Cant){
        if(Cant < 1)
         return this.deleteToCart(index);

        this.cart[index].Cant= Cant;       
        this.openToast(); 
        this.parent.$store.commit('setCart', this.cart);
        EventBus.$emit('updateCart', true); 
       
    },
   
   deleteToCart(index){
      if(index != -1){
        this.cart[index].Aggregates = []
          this.cart.splice(index,1)  
          this.openToast();  
           this.parent.$store.commit('setCart', this.cart); 
           EventBus.$emit('updateCart', true);
          if(this.cart.length ===0)
            this.dismiss(); 
      }

    },

    deleteToAgg(index, index1){
        let obj = this.cart[index];
        obj.Aggregates.splice(index1, 1);       
        this.openToast(); 
         this.parent.$store.commit('setCart', this.cart);
         EventBus.$emit('updateCart', true);

    },

    addAgregate(index, index1, cant){
        if(cant < 1)
          return this.deleteToAgg(index, index1)
        else{       
          this.cart[index].Aggregates[index1].Cant = parseInt(cant);       
          this.finalTotal();
          this.openToast();          
          this.parent.$store.commit('setCart', this.cart); 
          EventBus.$emit('updateCart', true);        
        } 
        this.key++;
        return cant;
    },

    finalTotal(){
      let total = 0;          
      this.cart.forEach(car => total += parseFloat( this.getTotal(parseInt(car.AggregatesCant),  parseInt(car.Cant), parseFloat(car.Price), car.Aggregates) ))     
      return total;
          },

    getTotal( aggregateCant, thisCant, thisPrice, thisAggregates) {
     
      let cant = aggregateCant * thisCant;
      let semiTotal = 0; 
      let t = 0;    
      for(var i=0 ; i < thisAggregates.length; i++){  
       
        if(cant - thisAggregates[i].Cant >= 0){
          cant -= thisAggregates[i].Cant; 
          continue;
        }
        else{
         semiTotal+= ((thisAggregates[i].Cant -cant) * thisAggregates[i].SalePrice); 
         cant = 0;       
        }
      } 

      t= (thisCant * thisPrice + semiTotal).toFixed(2) ;
      return t;
    },
  
    async openToast() {
      return this.$ionic.toastController      
        .create({
          message: this.message,
          duration: 2000,
          position: 'top',
          color:'success'
        })
      .then(a => a.present())
    },

    checkOut(){
        if(this.cart.length > 0) 
            EventBus.$emit('showOrder', true ); 
        this.dismiss();
                    
    },

    getFormatPrice(price){
      const result = new Intl.NumberFormat('en', {style: "currency", currency: this.currency} ).format(price)
      return result;
    }
}
 

}
</script>