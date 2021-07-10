<template>
  <div id="order" class="screen">
    
    <ion-header>
          <div style="display: flex; align-items: center;flex-direction: row; justify-content: space-between;">
            <ion-buttons slot="start">
              <ion-back-button default-href="/support"  @click="$router.push({ name: 'Specialsprice'})"></ion-back-button>
            </ion-buttons>
            
               <h1>{{$t('frontend.specialsPrice.title')}}</h1>  
           
            <div>
              <ion-button @click="savespecialsPrice()">{{$t('backoffice.form.buttons.save')}}</ion-button>
              <ion-button v-if="specialsPrice._id && specialsPrice.CanDelete" @click="deletespecialsPrice()">Delete</ion-button>
            </div>
          </div>
                  
                  
    </ion-header>

      <ion-refresher 
        style="position: relative"
        slot="fixed"
        @ionRefresh="doRefresh($event)">
          <ion-refresher-content 
            refreshing-spinner="crescent"
          ></ion-refresher-content>
      </ion-refresher>

  
      <ion-loading
        v-if="spinner"
        cssClass="my-custom-class"
        :message="$t('frontend.tooltips.loadRestaurant')"
      ></ion-loading>
  
      <div :key="key"> 

        <ion-item :disabled="spinner? true: false">                  
            <ion-label position="floating">{{$t('frontend.specialsPrice.name')}} <strong style="color: red">*</strong></ion-label>                               
            <ion-input type="text" required=true  
            class="menu-col-8" 
            :value="specialsPrice.Name" @input="specialsPrice.Name = $event.target.value"
                ></ion-input>
            
        </ion-item> 

          <ion-item :disabled="spinner? true: false">                  
              <ion-label position="floating">{{$t('frontend.specialsPrice.amount')}} <strong style="color: red">*</strong></ion-label>                               
              <ion-input type="text" required=true  
              class="menu-col-8" 
              :value="specialsPrice.Amount" @input="specialsPrice.Amount = $event.target.value"
                  ></ion-input>
          </ion-item>  

        <ion-item :disabled="spinner? true: false">                  
              <ion-label position="floating">{{$t('frontend.specialsPrice.type')}} <strong style="color: red">*</strong></ion-label>  
              <ion-select interface="popover" icon="add"                         
              :value="specialsPrice.Type"
              :placeholder="$t('frontend.createNew.select')"
                @ionChange="specialsPrice.Type=$event.target.value" >
                  <ion-select-option v-for="(res) in ['Percent', 'Amount']"                    
                    :key="res" 
                    :value="res" >{{res}}
                  </ion-select-option>                                
              </ion-select>
          </ion-item> 

        

          <ion-item :disabled="spinner? true: false">                  
              <ion-label position="floating">{{$t('frontend.specialsPrice.for')}} <strong style="color: red">*</strong></ion-label>  
              <ion-select interface="popover" icon="add"                         
                :value="specialsPrice.For"
                :placeholder="$t('frontend.createNew.select')"
                  @ionChange="specialsPrice.For=$event.target.value" >
                  <ion-select-option v-for="(res) in ['Increase', 'Decrease']"                    
                    :key="res" 
                    :value="res" >{{res}}
                  </ion-select-option>                                
              </ion-select>
          </ion-item>           
       
          <ion-item :disabled="spinner? true: false">                  
            <ion-label position="floating">{{$t('frontend.specialsPrice.apply')}} <strong style="color: red">*</strong></ion-label>  
            <ion-select interface="popover" icon="add"                         
              :value="hasApply"
              :placeholder="$t('frontend.createNew.select')"
                @ionChange="changeApplyTo($event.target.value), keyShow+=1, specialsPrice.ApplyProduct = '', specialsPrice.ApplyCategory = ''" >
                <ion-select-option 
                  value="-1" >All Products
                </ion-select-option> 
                <ion-select-option v-for="(res) in applyToList"                    
                  :key="res.name" 
                  :value="res.name" >{{res.value}}
                </ion-select-option>                                                
            </ion-select>
        </ion-item> 
    
        <div v-if="showToApply" :key="keyShow">
                      
               <ion-select interface="popover" icon="add"  v-if="showProduct"                    
                    :placeholder="$t('frontend.createNew.select')"
                    :value="productApply"
                    :key="keyShow+'P'"
                      @ionChange="specialsPrice.ApplyProduct=$event.target.value" >                   
                      <ion-select-option v-for="(res) in allProducts"                    
                        :key="res._id" 
                        :value="res._id" >{{res.Name}}
                      </ion-select-option>                                                
              </ion-select>
       
              <ion-select interface="popover" icon="add"  v-if="!showProduct"
                :value="categoryApply"
                :key="keyShow+'C'"
                :placeholder="$t('frontend.createNew.select')"
                  @ionChange="specialsPrice.ApplyCategory=$event.target.value" >                   
                  <ion-select-option v-for="(res) in allCategories"                    
                    :key="res._id" 
                    :value="res._id" >{{res.Name}}
                  </ion-select-option>                                                
              </ion-select>
        </div>

          <ion-item :disabled="spinner? true: false">                  
              <ion-label position="floating">{{$t('frontend.specialsPrice.repite')}} <strong style="color: red">*</strong></ion-label>  
              <ion-select interface="popover" icon="add"                         
                :value="specialsPrice.Repeat"
                :placeholder="$t('frontend.createNew.select')"
                  @ionChange="specialsPrice.Repeat=$event.target.value, key+=1" >
                  <ion-select-option v-for="(res) in ['One', 'Weekly', 'Monthly', 'Annual'] "                    
                    :key="res" 
                    :value="res" >{{res}}
                  </ion-select-option>                                
              </ion-select>
          </ion-item> 
         
           <div style="display: flex;justify-content: space-evenly;">

            <div  style="display: flex;align-items: baseline;">

              <span v-if="specialsPrice.Repeat ==='One'">{{$t('frontend.specialsPrice.oneStarDate')}}</span>
              <span v-if="specialsPrice.Repeat ==='Weekly'">{{$t('frontend.specialsPrice.weekStarDate')}}</span>
              <span v-if="specialsPrice.Repeat ==='Monthly'">{{$t('frontend.specialsPrice.monthStardDat')}}</span>
              <span v-if="specialsPrice.Repeat ==='Annual'">{{$t('frontend.specialsPrice.annualStartDat')}}</span>

              <ion-datetime   @ionChange="specialsPrice.StartDate=$event.target.value"
              :display-format="specialsPrice.Repeat ==='Weekly'? 'h:mm A' :
              specialsPrice.Repeat ==='One' ? 'MM-DD h:mm A ':
              specialsPrice.Repeat ==='Annual' ? 'MM-DD': 'DD'" 
              :picker-format="specialsPrice.Repeat ==='Weekly'? 'h:mm A' :
              specialsPrice.Repeat ==='One' ? 'MM-DD h:mm A ':
              specialsPrice.Repeat ==='Annual' ? 'MM-DD': 'DD'" 
              :value="specialsPrice.StartDate"></ion-datetime>
            </div>

            <div  v-if="['Weekly','One'].includes(specialsPrice.Repeat)"
             style="display: flex;align-items: baseline;">
              
              <span v-if="specialsPrice.Repeat ==='One'">{{$t('frontend.specialsPrice.oneEndDate')}}</span>
              <span v-if="specialsPrice.Repeat ==='Weekly'">{{$t('frontend.specialsPrice.weekEndDate')}}</span>


              <ion-datetime  @ionChange="specialsPrice.EndDate=$event.target.value"
                :display-format="specialsPrice.Repeat ==='Weekly'? 'h:mm A' :
                specialsPrice.Repeat ==='One' ? 'MM-DD h:mm A ':
                specialsPrice.Repeat ==='Annual' ? 'MM-DD': 'DD'" 
              :picker-format="specialsPrice.Repeat ==='Weekly'? 'h:mm A' :
                specialsPrice.Repeat ==='One' ? 'MM-DD h:mm A ':
                specialsPrice.Repeat ==='Annual' ? 'MM-DD': 'DD'" 
              :value="specialsPrice.EndDate"></ion-datetime>
            </div>
         </div>


          <div v-if="specialsPrice.Repeat==='Weekly'" 
            style="display: flex;justify-content: space-between;padding: 10px;">
            <ion-card  
            class="menu-col-1 card-categories"
            style="padding: 4px 12px;"
            v-for="(item, index) in weaklyArray" 
            :key="index" >
              <ion-label>{{item}}</ion-label>
              <ion-checkbox
                 :checked ="dataPrice.includes(item)? true: false"
                slot="end"
                style="    margin: 0 5px;"
                @ionChange="changeDataWeekly(item, $event.target.checked)">
              </ion-checkbox>
            </ion-card>
             
          </div> 

        
       
           
          <ion-item :disabled="spinner? true: false" >                  
              <ion-label>{{$t('frontend.specialsPrice.active')}}                           
                <ion-toggle :checked ="specialsPrice.Active" @ionChange="specialsPrice.Active=$event.target.checked"></ion-toggle>
              </ion-label>   
          </ion-item>



        
         

         
        

      </div>
            
  </div>
</template>

<script>

import { Api } from '../api/api.js';
// import { Utils } from '../utils/utils.js';
// import { VBreakpoint } from 'vue-breakpoint-component'

export default {

  name: 'specialsPrice',
  created: function(){  
    
    if(this.$route.params.specialsPrice){
      this.specialsPrice = this.$route.params.specialsPrice;     
      if(this.specialsPrice.ApplyProduct && this.specialsPrice.ApplyProduct !=''){
        this.hasApply = 'ApplyProduct';
        this.showProduct = true;
        this.showToApply = true;
        this.productApply =this.specialsPrice.ApplyProduct
        this.keyShow ++;
      }     
       if(this.specialsPrice.ApplyCategory  && this.specialsPrice.ApplyCategory !=''){
          this.hasApply = 'ApplyCategory';
          this.showToApply = true;
          this.categoryApply = this.specialsPrice.ApplyCategory ;
          this.keyShow ++;
       }
     
    } 
    else{
      this.specialsPrice.Type = 'Percent';
      this.specialsPrice.For = 'Decrease';
      this.specialsPrice.Repeat = 'One';
      this.specialsPrice.Active = true;
      this.specialsPrice.ApplyProduct = '';
      this.specialsPrice.ApplyCategory = '';     
      this.showToApply = false;
    }
    

    if(this.specialsPrice.Datas)
      if(this.specialsPrice.Datas.length > 0)
        this.dataPrice =this.specialsPrice.Datas

    this.getAllCategories();
    this.getAllProducts();
  
  },
  components:{   
    // VBreakpoint: VBreakpoint,  
  },
  data () {
    return {
      modelName: 'SpecialsPriceDetail',     
      spinner: false,     
      currency: 'USD',
      specialsPrice: {},
       weaklyArray: ['Monday' ,'Tuesday' ,'Wednesday', 'Thursday' ,'Friday' ,'Saturday' ,'Sunday'],    
       dataPrice: [],
       key: 0,
       applyToList:  [       
        {name: 'ApplyProduct' ,value:  'One Product', id: ''},
        {name: 'ApplyCategory' ,value: 'OneCategory', id: ''}
      ],
      showToApply: false,
      showProduct: false,
      keyShow: 0,
      allProducts: [],
      allCategories: [], 
      hasApply : -1 ,
      productApply: '',
      categoryApply: '',

    }
  }, 
  methods: {


   getFormatPrice(price){
       let result = price           
          if (this.currency)
            result = new Intl.NumberFormat('en', {style: "currency", currency: this.currency} ).format(price)      
         return result;
    },

    async toastMss(message, color) {
      return this.$ionic.toastController      
        .create({
          message: message,         
          position: 'top',
          color: color,
           duration: 1000
        
        })
      .then(a => a.present())
    },

   alertRequiredDatas(){
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: 'Error',
          message: this.$t('frontend.home.errorRequired') ,
          buttons: [                   
          {
              text: this.$t('frontend.home.acept'),
              handler: () => {},
          },
          ],
      })
      .then(a => a.present())                  
    },
    
    async savespecialsPrice(){

      if(['', undefined].includes(this.specialsPrice.Name)  ||  ['', undefined].includes(this.specialsPrice.Amount) )
          return this.alertRequiredDatas();

      if(this.dataPrice.length > 0)
        this.specialsPrice.Datas = this.dataPrice
      
     try {
       this.spinner = true;
        let res;
        if(this.specialsPrice._id)
            res = await Api.putIn('specialsPrice', this.specialsPrice)
        else
          res = await Api.postIn('specialsPrice', this.specialsPrice)
        this.spinner = false;
        if(res.status === 200){
            this.specialsPrice = res.data;
            return this.toastMss('Ok', 'success')
        }
       
     } catch (error) {
       error
       this.spinner = false;
       return this.toastMss('mal hecho', 'danger')
     }
    },

    async deletespecialsPrice(){
      const id = this.specialsPrice._id
      try {
        this.spinner = true;
        const response = await Api.deleteById('specialsPrice', id);
        if(response.status === 200)          
         this.spinner = false;
        
      } catch (error) {
        error
         this.spinner = false;
      }
    },

    changeDataWeekly(day, checked){
      if(checked){
        this.dataPrice.push(day);        
      }
      else{
        const index = this.dataPrice.findIndex(d => d === day);
        if(index !== -1){
          this.dataPrice.splice(index,1);
        }
      }
    },

    changeApplyTo(value){
      if(value == -1){
        this.showToApply = false;
        this.keyShow ++;
      }
      else{
        this.showToApply = true;
        if(value==='ApplyProduct') this.showProduct = true
        if(value==='ApplyCategory') this.showProduct = false      
      }
     
      
    },

    async getAllCategories(){

      try {
        const category = await Api.fetchAll('Category')
        if(category.status === 200)
            this.allCategories = category.data
      } catch (error) {
        error;
      }
    },

    async getAllProducts(){
      try {
        const products = await Api.fetchAll('Product')
        if(products.status === 200){
          const pRes = products.data.filter(p => p.Available == true);
           this.allProducts = pRes;
        }
           
      } catch (error) {
        error;
      }
    }
   



  },

}

</script>

<style>

.menu-col-3{
    flex: 0 0 calc(calc(3 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(3 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(3 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
}

  .menu-col-4{
    flex: 0 0 calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
    visibility: visible;
    }

    .menu-col-6{
    flex: 0 0 calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
    visibility: visible;
    }
    
    .menu-col-5{
    flex: 0 0 calc(calc(5 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(5 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(5 / var(--ion-grid-columns, 12)) * 100%);
    text-align: left;
    visibility: visible;
    }

    
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

  h6 {
    font-size: 16px;
    margin: 5px;
    font-weight: 200;
}

 .elipsis-menu{
        text-overflow: ellipsis !important;
    overflow: hidden !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

@media only screen and (min-width : 1024px){

    .screen{
        /* padding-left: 10%;
        padding-right: 10%;
        border: #edf1ee solid 1px; */
        margin-right: 10%;
        margin-left: 10%;
        /* border-radius: 25px; */
    }

}

</style>