<template>
    <div id="product" class="product">
        
        <div v-if="spinner">
            <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
        </div>

        

        <modal name="my-first-modal" width="80%" height="80%">
            <ion-header>
            <ion-toolbar>
                <ion-title>{{ $t('frontend.home.tableQr') }}</ion-title>
            </ion-toolbar>
            </ion-header>

            <div class="ion-padding" style="height: 90%">            
            <qrcode-stream @decode="onDecode" @init="onInit" />
            </div>    
        </modal>

        <modal name="delivery-modal"  width="80%" height="auto" style="left: 0px;width: auto;height: auto; max-width: 500px !important;">
            <ion-buttons slot="start" @click="hideDeliver()">
                <ion-back-button default-href="home"></ion-back-button>
            </ion-buttons>

            <ion-header>
                <ion-toolbar>
                    <ion-title>{{ $t('frontend.home.deliverDetail') }}</ion-title>
                </ion-toolbar>
                <ion-label v-if="city !=='' && state !== ''" style="color: green;">{{ this.$t('frontend.home.city') }}: {{city}}  |  {{ this.$t('frontend.home.state') }}: {{state}}</ion-label>          
            </ion-header>

            <ion-card>
            <ion-item>
                <ion-label position="floating">{{$t('frontend.home.address')}} <strong style="color: red">*</strong></ion-label>
                <ion-input type="text" :value="addres1" @input="addres1= $event.target.value"></ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="floating">{{$t('frontend.home.address')}} 2</ion-label>
                <ion-input type="text"  :value="addres2" @input="addres2= $event.target.value"></ion-input>
            </ion-item>
            <ion-item>
                <ion-label position="floating">{{$t('frontend.orderType.code')}} <strong style="color: red">*</strong></ion-label>
                <ion-input type="tel" :value="zipCodeFlag" @input="zipCodeFlag= $event.target.value" @change="zipCodeFlag=ValidateCodeInModal($event.target.value)">             
                </ion-input>
            </ion-item>
            <ion-button  @click="hideDeliver()">{{ this.$t('frontend.home.cancel') }}</ion-button>
            <ion-button  @click="saveDeliver()">{{ this.$t('frontend.home.acept') }}</ion-button>
            
            </ion-card>          
        </modal>

        <modal name="pickup-modal"  width="80%" height="auto"  style="left: 0px;width: auto;height: auto; max-width: 500px; ">
            <ion-buttons slot="start" @click="hidePickUp()">
                <ion-back-button default-href="home"></ion-back-button>
            </ion-buttons>

            <ion-header>
                <ion-toolbar>
                    <ion-title>{{ $t('frontend.home.pickupDetail') }}</ion-title>
                    <ion-label color="success"><p><strong>{{ this.$t('frontend.order.readyForPick') }}</strong></p></ion-label>
                </ion-toolbar>
                <ion-label >{{ this.$t('frontend.home.notTimeToPick') + this.configuration.minHour +' - '+ this.configuration.maxHour  +
                this.$t('frontend.home.cookTime') + this.configuration.minTimeToCook + this.$t('frontend.home.minuts') }}</ion-label> 
            </ion-header>

            <ion-card>
                 <ion-item>
                    <ion-label position="floating">{{$t('frontend.order.dateToPickEstimated')}} <strong style="color: red">*</strong></ion-label>
                    <ion-datetime :value="dateToDay" max="2030"  @ionChange="dateToDay=$event.target.value" :min="minDay"  display-format="MM-DD-YYYY"   
                    ></ion-datetime>
                </ion-item>
                <ion-item>
                    <ion-label position="floating">{{this.$t('frontend.orderType.pickOut') }}<strong style="color: red">*</strong></ion-label>
                    <ion-datetime display-format="h:mm A" picker-format="h:mm A" :key="key"
                    :value="thisMinHour" @ionChange="thisMinHour=ValidateHour($event.target.value)" ></ion-datetime>
                </ion-item>
            
                <ion-button  @click="hidePickUp()">{{ this.$t('frontend.home.cancel') }}</ion-button>
                <ion-button  @click="savePickUp()">{{ this.$t('frontend.home.acept') }}</ion-button>            
            </ion-card>          
        </modal>

        <modal name="curbside-modal"  width="80%" height="auto"  style="left: 0px;width: auto;height: auto; max-width: 500px; ">
          <ion-buttons slot="start" @click="hideCurbside()">
                <ion-back-button default-href="home"></ion-back-button>
          </ion-buttons>
          <ion-header>
            <ion-toolbar> 
              <ion-title>{{ $t('frontend.home.curbsideDetail') }}</ion-title>
            </ion-toolbar>
            <ion-label color="success"><p><strong>{{ this.$t('frontend.order.readyForPick') }}</strong></p></ion-label>
            <ion-label >{{ this.$t('frontend.home.notTimeToPick') + this.configuration.minHour +' - '+ this.configuration.maxHour  +
            this.$t('frontend.home.cookTime') + this.configuration.minTimeToCook + this.$t('frontend.home.minuts') }}</ion-label>          

          </ion-header>

        <ion-card>
           <ion-item>
            <ion-label position="floating">{{$t('frontend.order.dateToPickEstimated')}} <strong style="color: red">*</strong></ion-label>
            <ion-datetime :value="dateToDay" max="2030"  @ionChange="dateToDay=$event.target.value" :min="dateToDay"     
            ></ion-datetime>
          </ion-item>
          <ion-item>
            <ion-label position="floating">{{this.$t('frontend.orderType.pickOut') }}<strong style="color: red">*</strong></ion-label>
            <ion-datetime  display-format="h:mm A" picker-format="h:mm A" :key="key"
            :value="thisMinHour" @ionChange="thisMinHour=ValidateHour($event.target.value)" ></ion-datetime>
          </ion-item>
          <ion-item>
            <ion-label position="floating">{{this.$t('frontend.orderType.licencePlate') }}<strong style="color: red">*</strong></ion-label>
            <ion-input :value="licencePlate" @input="licencePlate = $event.target.value"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">{{this.$t('frontend.orderType.vehicleModel') }}<strong style="color: red">*</strong></ion-label>
            <ion-input :value="vehicleModel" @input="vehicleModel = $event.target.value"></ion-input>
          </ion-item>
           <ion-item>
            <ion-label position="floating">{{this.$t('frontend.orderType.vehicleColor') }}<strong style="color: red">*</strong></ion-label>
            <ion-input :value="vehicleColor" @input="vehicleColor = $event.target.value"></ion-input>
          </ion-item>

         
          <ion-button  @click="hideCurbside()">{{ this.$t('frontend.home.cancel') }}</ion-button>
          <ion-button  @click="saveCurbside()">{{ this.$t('frontend.home.acept') }}</ion-button>
          
        </ion-card>          
        </modal>

        <v-breakpoint  v-if="!spinner">
            <div slot-scope="scope">

                <span > 
                    <ion-toolbar>

                            <ion-buttons slot="start" @click="backToCall()">
                                <ion-back-button default-href="home"></ion-back-button>
                            </ion-buttons>    
                                                
                            <ion-card-title                          
                                style="padding: 10px;text-align: center;text-transform: uppercase;font-weight: bolder;">
                                {{$t('frontend.order.orderDetail')}} 
                            </ion-card-title>

                        </ion-toolbar>                  

                    <div :style="scope.isSmall || scope.isMedium || scope.noMatch? '': 'width: 80%; margin: 0 auto;'">
                        
                        
                        
                         <ion-card  style="padding: 0 10px 10px 0;"> 

                           <div  v-if="staffName !=''" style="display: flex">                                                 
                                <ion-label > <h2 class="titles-order" style="float: left;">  {{$t('frontend.orderType.worker')}}: {{staffName}} </h2>
                                </ion-label>  
                           </div>

                             
                            <div>
                              <ion-label class="ion-text-wrap menu-col-12">
                                <h2 class="titles-order" style="float: left;">{{$t('frontend.order.clientInfo')}}</h2>
                                <ion-button  v-if="clientId ==='' && staffName ===''" @click="logIng('')" fill="outline"  style="float: left; margin-right: 10px;" > <span class="iconify" data-icon="ei:user" data-inline="false" style="margin: 0 -13px;"></span> </ion-button>  
                              </ion-label>

                           
                               <p   v-if="clientId ==='' && staffName ===''"
                               style="display: inline-block; float: left; font-style: italic; 
                               color: #e3b030; font-weight: 500;width: 100%; text-align: left;font-size: 16px; margin: 5px;">
                                <span class="iconify" data-icon="twemoji:warning" data-inline="false" style="margin: 5px 0 0 15px; width: 18px;height: 18px;"></span>
                                {{$t('frontend.order.messageToast')}}</p>
                           
                               <p v-if="clientId ==='' && staffName ===''"
                                style="display: inline-block; float: left; font-style: italic;
                                 color: #e3b030; font-weight: 500;width: 100%; text-align: left;
                                 font-size: 16px; margin: 5px;">
                                <span class="iconify" data-icon="twemoji:warning" data-inline="false" style="margin: 5px 0 0 15px; width: 18px;height: 18px;"></span>
                                {{$t('frontend.order.messgForContact')}}</p>
                          
                            </div>

                            

                            

                              <ion-item :style="clientId ===''? 'border: 1px solid #262626;width: 100%' : 'width: 100%'">                    
                                <ion-label position="floating">{{$t('frontend.orderType.name')}} <strong style="color: red">*</strong></ion-label>                                                                                                                                
                                <ion-input :value="CustomerName" :readonly="clientId !=''" 
                                  @input="CustomerName = $event.target.value" 
                                  ></ion-input>
                              </ion-item>

                              <ion-item :style="clientId ===''? 'border: 1px solid #262626;width: 100%' : 'width: 100%'">                    
                                <ion-label position="floating">{{$t('frontend.orderType.email')}} 
                                  <strong v-if="order.OrderType !=='On Table' || staffName ===''" style="color: red">*</strong></ion-label>                                                                                                                                
                                <ion-input :value="email" :readonly="clientId !=''" 
                                @input="email = $event.target.value" 
                                @change="validateEmail()"
                                ></ion-input>
                              </ion-item>

                               <ion-item :style="clientId ===''? 'border: 1px solid #262626;width: 100%' : 'width: 100%'">                    
                                <ion-label position="floating">{{$t('frontend.orderType.phone')}} 
                                  <strong v-if="order.OrderType !=='On Table' || staffName ===''" style="color: red">*</strong></ion-label>                                                                                                                                
                               <ion-input :value="phone" :readonly="clientId !=''" 
                                @input="phone = $event.target.value" 
                                @change="validatePhone($event.target.value)" 
                                ></ion-input>
                              </ion-item>
         
                        </ion-card>
                             
                        <ion-card :key="keyOrderType">     

                            <ion-label class="ion-text-wrap menu-col-12" style="display: inline-block;">
                                <h2 class="titles-order" style="float: left;">{{$t('frontend.order.orderType')}}: <span v-if="!order.OrderType" style="color: red;"> * </span></h2>                            
                                   
                                <ion-select interface="popover" icon="add" style="text-align: left; float: left; display: inline-flex;"                                  
                                  :key="keyCurbside"
                                  :ok-text="$t('backoffice.form.messages.buttons.ok')"
                                  :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
                                  :value="allTypeOrder[order.OrderType]"   
                                  :placeholder=" $t('frontend.app.selectOrder')"                            
                                  @ionChange="allTypeOrder[$event.target.value], changeOrderType($event.target.value)" >
                                      <ion-select-option  v-if="configuration.viewDelivery && restaurantActive.hasPaymentCardConfig" :value="allTypeOrder['Delivery']"> {{allTypeOrder['Delivery']}} </ion-select-option>
                                      <ion-select-option v-if="restaurantActive.hasPaymentCardConfig" :value="allTypeOrder['PickUp']"> {{allTypeOrder['PickUp']}} </ion-select-option>
                                      <ion-select-option v-if="configuration.viewOnTable" :value="allTypeOrder['On Table']"> {{allTypeOrder['On Table']}} </ion-select-option>                                
                                      <ion-select-option v-if="configuration.viewCurbside" :value="allTypeOrder['Curbside']"> {{allTypeOrder['Curbside']}} </ion-select-option>                                
                              </ion-select> 
                            </ion-label>

                           <div :key="keyCurbside+1">
                             
                             <div v-if="order.OrderType==='PickUp' || isPick" @click="showPickUp()">
                              <ion-item   >
                               <ion-label position="floating">{{$t('frontend.order.dateToPickEstimated') }}<strong style="color: red">*</strong> </ion-label> 
                               <ion-datetime :key="key1" style="text-align: left;" :min="minDay"
                                 :value="dateToDay" @ionChange="dateToDay=$event.target.value" ></ion-datetime>                                
                              </ion-item>
                              <ion-item  >
                                <ion-label position="floating">{{$t('frontend.orderType.pickOut') }}<strong style="color: red">*</strong> </ion-label> 
                                <ion-datetime display-format="h:mm A" picker-format="h:mm A" :key="key1" style="text-align: left;"
                                  :value="thisMinHour" @ionChange="thisMinHour=ValidateHour($event.target.value), thisMinHour !==''? savePickUp() : ''" ></ion-datetime>                                
                              </ion-item>
                             </div>
                            

                            <div v-if="order.OrderType ==='Delivery' || isDelivery" @click="showDeliver()">
                                <ion-item >
                                  <ion-label position="floating">{{$t('frontend.home.address')}} <strong style="color: red">*</strong></ion-label>
                                  <ion-input :value="addres1" readonly></ion-input>
                                </ion-item> 
                                <ion-item v-if="addres2">                                     
                                  <ion-label position="floating">{{$t('frontend.home.address')}} 2</ion-label>
                                  <ion-input :value="addres2" readonly></ion-input>                     
                                </ion-item> 
                                <ion-item >
                                  <ion-label position="floating">{{$t('frontend.orderType.code')}} <strong style="color: red">*</strong></ion-label>
                                  <ion-input :value="zipCodeFlag" readonly></ion-input>
                                </ion-item>
                            </div>

                            <ion-item  v-if="order.OrderType=='On Table' || isTable" @click="show()">
                               <ion-label position="floating">{{$t('frontend.order.location')}} <strong style="color: red">*</strong></ion-label>
                                <ion-input :value="order.tableService" readonly></ion-input>
                            </ion-item> 

                            <div v-if="order.OrderType==='Curbside' || isCurbside" @click="showCurbside()">
                              <ion-item   >
                               <ion-label position="floating">{{$t('frontend.order.dateToPickEstimated') }}<strong style="color: red">*</strong> </ion-label> 
                               <ion-datetime style="text-align: left;" 
                                 :value="dateToDay" ></ion-datetime>                                
                              </ion-item>

                              <ion-item   >
                                <ion-label position="floating">{{$t('frontend.orderType.pickOut') }}<strong style="color: red">*</strong> </ion-label> 
                                <ion-datetime display-format="h:mm A" picker-format="h:mm A" style="text-align: left;"
                                  :value="thisMinHour" ></ion-datetime>                                
                              </ion-item>

                              <ion-item   >
                                <ion-label position="floating">{{$t('frontend.orderType.licencePlate') }}<strong style="color: red">*</strong> </ion-label> 
                                <ion-input :value="order.LicencePlate" ></ion-input>                                
                              </ion-item>

                              <ion-item   >
                                <ion-label position="floating">{{$t('frontend.orderType.vehicleModel') }}<strong style="color: red">*</strong> </ion-label> 
                                <ion-input :value="order.VehicleModel" ></ion-input>                                
                              </ion-item>

                               <ion-item   >
                                <ion-label position="floating">{{$t('frontend.orderType.vehicleColor') }}<strong style="color: red">*</strong> </ion-label> 
                                <ion-input :value="order.VehicleColor" ></ion-input>                                
                              </ion-item>
                            </div>
                           </div>
                        </ion-card>

                                

                        <ion-card >

                            <ion-label class="ion-text-wrap">
                                <h2 class="titles-order" style="float: left;">{{$t('frontend.order.products')}}</h2>
                                <ion-button fill="outline"  style="float: left; margin-right: 10px;" @click="addProductsToCart" v-tooltip="$t('frontend.tooltips.addOrder')"> + </ion-button>
                            </ion-label>
          
                            <ion-item-sliding v-for="(product, index) in cart" v-bind:key="index" style="    padding: 20px 0;">
                               
                                    <div class="ion-text-wrap menu-col-12" style="text-align: left" >
                                        <ion-label> <span style="font-size: 17px;color: black;"> {{product.Name }}</span>
                                        <p>
                                            <ion-input  :value="product.Note" :placeholder="$t('frontend.order.notes')"
                                            @input="product.Note=$event.target.value"
                                            style="margin-left: 20px;height: 25px;"></ion-input> 
                                        </p>                                       
                                        </ion-label>
                                    </div>   
                                

                                <ion-item>
                                    
                                    <div class="ion-text-wrap menu-col-3" style="text-align: center;">
                                        <ion-label>{{ getFormatPrice(product.Price)  }}</ion-label>
                                    </div>

                                    <div class="ion-text-wrap menu-col-3" >
                                        <ion-input type="number" style="text-align: center;width: 60%;float: left;"                                               
                                        @input="$event.target.value > 0 ? product.Cant = $event.target.value : product.Cant = 1" 
                                        :value="product.Cant" 
                                        @mouseleave="product.Cant = validateCant( $event.target.value)"                                           
                                        @change="getOtherCharges"                                           
                                        ></ion-input>
                                       <ion-icon name="refresh" color="blue" size="large" style="margin-top: 0px;width: 24px;" v-tooltip="$t('frontend.tooltips.refreshOrder')"> </ion-icon>                             
                                    </div>
                                        
                                    <div class="ion-text-wrap menu-col-3" style="text-align: center;">
                                        <ion-labe>{{ getFormatPrice(product.Cant * product.Price)  }}</ion-labe>
                                    </div>

                                    <div class="ion-text-wrap menu-col-3">
                                         <ion-icon size="large" color="danger"  @click="removeProductFromCart(product.ProductId)"   name="trash" style="float: right; margin-top: 2px;width: 24px" v-tooltip="$t('frontend.tooltips.deleteOrder')"> </ion-icon>
                                    </div>                        

                                </ion-item>

                                
                                <ion-list-header v-if="product.Aggregates.length > 0" style="padding: 20px 30px;">
                                    {{$t('frontend.home.aggregateFree')}}: {{product.CantAggr=product.AggregatesCant * product.Cant}}
                                </ion-list-header>

                                <ion-item v-for="(agg, index1) in product.Aggregates" :key="index1"  >
                                               
                                    <div class="menu-col-3" style="    text-align: center;">
                                       <p >{{agg.Name}} <br> {{getFormatPrice(agg.SalePrice) }}  </p>
                                    </div>
                            
                                    <div class="menu-col-3">     
                                        <ion-input type="number" min=1 :value="agg.Cant" @input="agg.Cant=$event.target.value" style="text-align: center;width: 60%;float: left;" >
                                        </ion-input>  
                                        <ion-icon name="refresh" color="blue" size="large" style="margin-top: 0px;width: 24px;" @click="agg.Cant=addAgregate(index, index1, agg.Cant)" v-tooltip="$t('frontend.tooltips.addOrder')"> </ion-icon>   
                                    </div>
                                    
                                    <div class="menu-col-3" :key="key" style="text-align: center;" >                        
                                        <p v-if="product.CantAggr - agg.Cant >= 0" style="text-align: center; margin-top: 10px;">{{getFormatPrice(0)}}  <span style="opacity:0">{{product.CantAggr = product.CantAggr - agg.Cant}}</span></p> 
                                        <p v-else style="text-align: center; margin-top: 10px;" >{{ getFormatPrice(agg.SalePrice * (agg.Cant-product.CantAggr)) }} <span style="opacity:0">{{product.CantAggr = 0}}</span></p> 
                                    
                                    </div>

                                    <div  class="menu-col-3">
                                       <ion-icon  size="large" color="danger" @click="deleteToAgg(index, index1)" name="trash" style="margin-top: 2px;width: 24px;float: right;" v-tooltip="$t('frontend.tooltips.deleteOrder')"> </ion-icon>                                               
                                    </div>

                                </ion-item>

                                                        
                            </ion-item-sliding>

                            <ion-item-sliding>
                                <ion-label class="ion-text-wrap" >
                                    <h2 class="titles-order" :style="otherCharges.length === 0 ? 'color: lightgrey;':'color: initial;'">{{$t('frontend.order.otherCharges')}}
                                    <ion-spinner style="padding-top:10px"  name="crescent" v-if="spinnerCharge" color="primary"></ion-spinner></h2> 
                                </ion-label>
                                
                                <ion-item-sliding v-for="charge in otherCharges" v-bind:key="charge.Id">
                                    <ion-item>

                                        <div class="menu-col-8">
                                            <p>{{ charge.Name }}</p>
                                        </div>
                                        <ion-label  class="menu-col-4" >
                                            <h2>{{ getFormatPrice(charge.Price) }}</h2>
                                        </ion-label>
                                        
                                    </ion-item>
                                </ion-item-sliding>

                            </ion-item-sliding>

                            <ion-item-slidin style="border-top: 1px solid grey;" >

                                  

                                    <ion-item>
                                      <h2 class="titles-order">{{$t('frontend.reservation.discount')}}</h2>
                                      <ion-toggle color="primary"  :key="key2 + 1"
                                        @ionChange="showDiscount = !showDiscount, showDiscount === false? discount = 0 : ''" 
                                        :value="showDiscount"></ion-toggle> 
                                    </ion-item>

                                      <ion-item  v-if="showDiscount" :key="key2 + 2">
                                          <ion-searchbar
                                          :key="key2"
                                          inputmode="text"
                                          animated :placeholder="$t('frontend.reservation.enterCode')" 
                                          search-icon=false                                       
                                          @ionChange="theCodeToDiscount= $event.target.value"
                                          >        
                                          </ion-searchbar >

                                          <ion-button fill="outline" v-if="!spinnerDiscount && theCodeToDiscount !==''" style="float: left; margin: 15px 0;" @click="findByCode()"
                                          ><span class="iconify" data-icon="flat-ui:search" data-inline="false" style="margin: 0 -10px;"></span>
                                          </ion-button>
                                          <ion-spinner style="padding-top:10px"  name="crescent" v-if="spinnerDiscount" color="primary"></ion-spinner>
                                      </ion-item>                                    
                                      <!-- <div class="menu-col-6" v-if="!showDiscount"></div>                     -->
                                          <!-- <div class="menu-col-3" v-if="discount > 0"><p class="menu-bold-title" style=" color:red; text-align: right">{{ discount.toFixed(2) }} </p></div>                     -->
                                 

                               
                                 <ion-item style="font-size: 16px;font-weight: bold;">
                                    <!-- <ion-label class="menu-col-3"></ion-label> -->
                                    <ion-label class="menu-col-2"></ion-label>
                                    <ion-label class="menu-col-6"><div class="menu-bold-title"  style="text-align: right;">{{$t('frontend.order.subtotal')}}</div></ion-label>
                                    <ion-label class="menu-col-4" style="text-align: right;" :key="key" >{{ getFormatPrice(finalSubTotal()) }}</ion-label>                                                        
                                </ion-item>                                
                                <ion-item style="font-size: 16px;font-weight: bold;"> 
                                    <!-- <ion-label class="menu-col-3"> </ion-label> -->
                                    <ion-label class="menu-col-2"> </ion-label>
                                    <ion-label class="menu-col-6"><div class="menu-bold-title"  style="text-align: right;" > {{$t('frontend.order.taxe')}} {{taxes.toFixed(2)}} %</div></ion-label>
                                    <ion-label class="menu-col-4"  style="text-align: right;" >{{ getFormatPrice(taxes * finalSubTotal() / 100)}} </ion-label> 
                                </ion-item>
                                <ion-item v-if="order.OrderType=='Delivery'" style="font-size: 16px;font-weight: bold;" > 
                                    <!-- <ion-label class="menu-col-3"> </ion-label> -->
                                    <ion-label class="menu-col-2"> </ion-label>
                                    <ion-label class="menu-col-6" > <div class="menu-bold-title" style="text-align: right;">{{$t('frontend.order.deliver')}}</div></ion-label>
                                    <ion-label class="menu-col-4" style="text-align: right;">{{getFormatPrice(shipping)}}</ion-label>  
                                </ion-item>

                                <ion-item style="font-size: 16px;font-weight: bold;"> 
                                    <ion-label class="menu-col-2"> </ion-label>
                                    <!-- <ion-label class="menu-col-4" v-if="(configuration.tips.findIndex(t => parseFloat(t) === parseFloat(tip)) !== -1) || configuration.tips.length === 0"> </ion-label> -->
                                    <div class="menu-col-6"><div class="menu-bold-title"  style="text-align: right;" > {{$t('frontend.order.tip')}} %</div>
                                                                        
                                    <ion-select interface="popover" icon="add" style="float: right;" 
                                        
                                        v-if="configuration.tips.length > 0"
                                        :ok-text="$t('backoffice.form.messages.buttons.ok')"
                                        :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
                                        :value="configuration.tips[0]"
                                        :disabled="configuration.tipRequire"
                                        :placeholder="$t('frontend.order.tip')"
                                        
                                        @ionChange="$event.target.value? tip = $event.target.value: tip=  0" >
                                        <ion-select-option v-for="res in configuration.tips"                    
                                            :key="res" 
                                            :value="res" > {{res.toFixed(2)}}
                                        </ion-select-option>
                                        <ion-select-option value="0" @selected="alert(1)">
                                             <ion-label >{{$t('frontend.order.other')}}</ion-label>                                           
                                        </ion-select-option>
                                    </ion-select> 

                                    </div>

                                    <div class="menu-col-4"  style="text-align:right">

                                      <ion-input  type="number"  v-if="(configuration.tips.findIndex(t => parseFloat(t) === parseFloat(tip)) === -1)"  
                                          style="text-align:right"                                              
                                          @input="$event.target.value <0 || $event.target.value=='' ?  tip = 0 :tip = $event.target.value " 
                                          :value="tip"                          
                                      ></ion-input>
                                    
                                      <ion-label  type="number"   
                                          style="text-align:right;max-width: initial;" v-if="!(configuration.tips.findIndex(t => parseFloat(t) === parseFloat(tip)) === -1)"                                                                                      
                                          :value="getFormatPrice(tip * finalSubTotal() / 100)"                          
                                      >{{getFormatPrice(tip * finalSubTotal() / 100)}}</ion-label>

                                    </div>

                                   
                                   
                                </ion-item>

                                 <ion-item v-if="discount > 0" style="font-size: 16px;font-weight: bold;">
                                    <!-- <ion-label class="menu-col-3"></ion-label> -->
                                    <ion-label class="menu-col-4"></ion-label>
                                    <ion-label class="menu-col-4"><div class="menu-bold-title"  style="text-align: right;">{{$t('frontend.reservation.discount')}}</div></ion-label>
                                    <ion-label class="menu-col-4" style="text-align: right;" >{{ getFormatPrice(discount) }}</ion-label>                                                        
                                </ion-item>

                              
                                <ion-item style="    color: red;    font-size: 16px;    font-weight: bold;    text-transform: uppercase;"> 
                                    <!-- <ion-label class="menu-col-3"> </ion-label> -->
                                    <ion-label class="menu-col-4"> </ion-label>
                                    <ion-label class="menu-col-4"  ><div class="menu-bold-title" style="color:red; text-align: right"> {{$t('frontend.order.total')}}  </div></ion-label>
                                    <ion-label class="menu-col-4"><div class="menu-bold-title" style=" color:red; text-align: right">{{ getFormatPrice(finalTotal()) }}  </div></ion-label>                    
                                </ion-item>

                                <ion-item v-if="getSplitPaymentDo() !==0 && order._id"
                                style="    color: red;    font-size: 16px;    font-weight: bold;    text-transform: uppercase;"> 
                                    <!-- <ion-label class="menu-col-3"> </ion-label> -->
                                    <ion-label class="menu-col-4"> </ion-label>
                                    <ion-label class="menu-col-4"  ><div class="menu-bold-title" style="color:green; text-align: right"> {{$t('frontend.order.payed')}}  </div></ion-label>
                                    <ion-label class="menu-col-4"><div class="menu-bold-title" style=" color:green; text-align: right">{{ getSplitPaymentDo() }}  </div></ion-label>                    
                                </ion-item>

                                

                                 <ion-item v-if="getPendingSplitPayment() !==0 && order._id"
                                style="    color: red;    font-size: 16px;    font-weight: bold;    text-transform: uppercase;"> 
                                    <!-- <ion-label class="menu-col-3"> </ion-label> -->
                                    <ion-label class="menu-col-4"> </ion-label>
                                    <ion-label class="menu-col-4"  ><div class="menu-bold-title" style="color:red; text-align: right"> {{$t('frontend.order.pendingPayment')}}  </div></ion-label>
                                    <ion-label class="menu-col-4"><div class="menu-bold-title" style=" color:red; text-align: right">{{ getPendingSplitPayment() }}  </div></ion-label>                    
                                </ion-item>

                               

                                
                            </ion-item-slidin>

                            <ion-item-slidin  >
                                <ion-item style="padding:15px 0" >
                                    <ion-label class="ion-text-wrap" >
                                        <h2 class="titles-order"> {{$t('frontend.order.notes')}}</h2> 
                                    </ion-label>
                            
                                    <ion-textarea class="menu-textarea" @input="note = $event.target.value"></ion-textarea>
                            
                                </ion-item>  
                            </ion-item-slidin>

                        </ion-card>
                        

                        <ion-card style="padding: 0 10px">

                            <ion-label class="ion-text-wrap" >
                                    <h2 class="titles-order">{{$t('frontend.order.payment')}}: </h2> 
                            </ion-label>                            

                            <!-- hasta saber si hay autho incremental in tsys (restaurantActive.payMethod==='SHIFT4' || restaurantActive.payMethod==='TSYS') -->
                            <ion-item v-if="(restaurantActive.payMethod==='SHIFT4' && order.OrderType === 'On Table' ) && (clientId !='' || staffName != '')">
                                <p style=" float: left;text-align: left;padding: 0" class="subtitles-order menu-col-4">{{$t('frontend.order.isTicket')}} </p>                               
                                <ion-toggle color="primary" :value="isTicket" @ionChange="isTicket = !isTicket"></ion-toggle>
                            </ion-item>

                            <div style="padding: 20px 0; text-align: center">
                              <ion-button  fill="outline" @click="goHome">{{$t('frontend.home.cancel')}}</ion-button>    
                              <ion-button v-if="!isTicket" fill="outline"  @click="openCardPayment()">{{$t('frontend.order.pay')}}</ion-button>
                              <ion-button  v-if="isTicket" fill="outline"  @click="openCardPayment()">{{$t('frontend.order.payAsTicket')}}</ion-button>                           
                              <ion-button  v-if="isTicket && staffName != ''" fill="outline"  @click="saveAsTicket()">{{$t('frontend.order.saveAsTicket')}}</ion-button>                           
                            </div>
                                            
                        </ion-card>
                    
                        

                    </div>
                </span>


               
            </div>
        </v-breakpoint>

       

    </div>
</template>



<script>

import { eye } from "ionicons/icons";
import { addIcons } from "ionicons";
import PaymentModal from '../components/PaymentModal'
import QrModal from '../components/QrPaymentModal'


addIcons({
  "ios-eye": eye.ios,
  "md-eye": eye.md,
});

import { Api } from '../../backoffice/api/api.js';
import { EventBus } from '../event-bus';
import { VBreakpoint } from 'vue-breakpoint-component'
import LibCodes from 'zipcodes'
import { parsePhoneNumber } from 'libphonenumber-js'
import moment from 'moment-timezone';
import Moment from 'moment';
 import { QrcodeStream } from 'vue-qrcode-reader'
 import orderType from '../components/selectOrderType'


export default {
   name: 'Order',
   created: function(){

      if(this.$store.state.customer._id){
         this.clientId= this.$store.state.customer._id;
        this.CustomerName= this.$store.state.customer.Name;
        this.email= this.$store.state.customer.EmailAddress;
        this.phone=this.$store.state.customer.Phone;
       }

       this.order = this.$store.state.order;
       this.cart = this.$store.state.cart;
       this.configuration = this.$store.state.configuration;
       this.restaurantActive = this.$store.state.restaurantActive
       if(this.configuration.tips.length > 0)
        this.tip = this.configuration.tips[0] 

       EventBus.$on('updateCustomer', (value) => {if(value) this.customerUpdated(); });
       EventBus.$on('updateCart', (value) => { if(value) this.cart = this.$store.state.cart; });
       EventBus.$on('chargeOrder', (value) => { 
         this.$store.commit('setOrder', value);
         if(value) this.order = value; 
         this.getSplitPaymentDo(); });
       
       if(this.order.HourToPick)
          this.thisMinHour = this.order.HourToPick

        if(this.order.DateToPick)
          this.dateToDay = this.order.DateToPick 

       if(this.$route.params.backButton === true)
        this.buttonBack = this.$route.params.backButton; 
       else
        this.buttonBack = false; 

        this.spinner = true;
                
        this.getOrderInfo();
        this.getOtherCharges();        
    
        if(this.order.addres1)
            this.addres1 = this.order.addres1;
        if(this.order.addres2)
            this.addres2 = this.order.addres2;
        if(this.order.zipCode)
            this.zipCodeFlag = this.order.zipCode;
        if(this.order.LicencePlate)
          this.licencePlate = this.order.LicencePlate;
        if(this.order.VehicleModel)
          this.vehicleModel = this.order.VehicleModel;
        if(this.order.VehicleColor)
          this.vehicleColor = this.order.VehicleColor;
         
        
        this.spinner = false;
   },
   props: {    
   
    staffName: {type: String, default: "" } , 
    staffId: {type: String, default: "" } , 
    taxesName: {type: String, default:"" } ,
    taxes: {type: Number, default:0 } ,
    shippingName: {type: String, default:"" } ,
    shipping: {type: Number, default:0 } ,    
    restaurantSelectedId: {type: String, default:"" } ,

   
  },
   data () {
    return {
        barcode:'',        
        modelName: 'Order',
        order: {},
        cart: [] ,       
        tip:  0,
        products: [],
        note:'',
        orderInfo:"",
        otherCharges:[],
        spinner: false ,  
        spinnerCharge: false,    
        dateTodaymin: new Date().toISOString().substr(0, 7),
        dateTodaymax:  new Date().getFullYear(),
        date: Moment().toISOString(),     
        // date: moment.tz(moment.tz.guess()).format('MM/DD/YYYY HH:mm:ss'),
        cardNumber:'',
        cardCode: '',
        expirationCard:'',
        zipCode: '',
        address:'',
        allTypeOrder:{'Delivery':this.$t('frontend.app.deliver'), 'PickUp':this.$t('frontend.app.pickup'), 'On Table':this.$t('frontend.app.table'), 'Curbside':this.$t('frontend.app.curbside'), },
        key: 0,
        buttonBack: false,
        isTicket: false,
        key1:1,
        keyOrderType:2,
        keyCurbside: 3,
        state: '',
        city:'',
        zipCodeFlag: '',
        addres1: '',
        addres2: '',
        thisMinHour:  '',
        dateToDay: moment.tz(moment.tz.guess()).format('YYYY-MM-DD'),
        minDay: moment.tz(moment.tz.guess()).format('YYYY-MM-DD'),
        timeToPick: true,
        isDelivery: false,
        isPick: false,
        isTable: false,
        isCurbside: false,
        showDiscount: false,
        discount: 0,
        theCodeToDiscount: '',
        key2: 4,
        spinnerDiscount: false,
         clientId: '',
        CustomerName: '', 
        email: '', 
        phone: '',  
        marketingEmail: false,
        marketingPhone: false ,
        configuration: {},
        restaurantActive: {},
        licencePlate: '' ,
        vehicleModel: '',
        vehicleColor: '',
      
    }
  }, 
  computed: {
   
    subTotal(){
          let total = 0;
          this.cart.forEach(car => total += parseFloat( this.getSemiTotal(parseInt(car.AggregatesCant),  parseInt(car.Cant), parseFloat(car.Price), car.Aggregates) ))
           for (const obj of this.otherCharges){
              total += obj.Price ;
          }
          return total.toFixed(2);
      },
   
   total(){
    
         let percent = ( (this.finalSubTotal() * this.taxes) / 100) ;  
         let tipPercent = ( (this.finalSubTotal() * this.tip) / 100) ;
         var t = 1    
        if(this.order.OrderType=='Delivery')  
          t  = parseFloat(this.finalSubTotal()) + parseFloat(percent) + parseFloat(this.shipping) + parseFloat(tipPercent); 
        else
          t  = parseFloat(this.finalSubTotal()) + parseFloat(percent)  +  parseFloat(tipPercent);
        return t.toFixed(2);
      }
  },
   components:{
    VBreakpoint: VBreakpoint,
    QrcodeStream: QrcodeStream,
    
  }, 
   methods: {

    finalTotal(){
         let percent = ( (this.finalSubTotal() * this.taxes) / 100) ;
         let tipPercent = ( (this.finalSubTotal() * this.tip) / 100) ; 
         var t = 1    
        if(this.order.OrderType=='Delivery')  
          t  = parseFloat(this.finalSubTotal()) + parseFloat(percent) + parseFloat(this.shipping) + parseFloat(tipPercent); 
        else
          t  = parseFloat(this.finalSubTotal()) + parseFloat(percent)  +  parseFloat(tipPercent);
          t = t - this.discount;
        return t.toFixed(2);
      } ,  

    finalSubTotal(){
        let total = 0;
        this.cart.forEach(car => total += parseFloat( this.getSemiTotal(parseInt(car.AggregatesCant),  parseInt(car.Cant), parseFloat(car.Price), car.Aggregates) ))
        for (const obj of this.otherCharges){
            total += obj.Price ;
        }
        // total = total - this.discount;
        return total.toFixed(2);
      },

    getSemiTotal( aggregateCant, thisCant, thisPrice, thisAggregates) {
     
      let cant = aggregateCant * thisCant;
      let semiTotal = 0; 
      let t = 0;    
      for(var i=0 ; i < thisAggregates.length; i++){  
       
        if(cant - thisAggregates[i].Cant >= 0){
          cant -= thisAggregates[i].Cant;   
          thisAggregates[i].AllTotal = 0         
          continue;
        }
        else{
            thisAggregates[i].AllTotal =  ((thisAggregates[i].Cant -cant) * thisAggregates[i].SalePrice)
            semiTotal+= ((thisAggregates[i].Cant -cant) * thisAggregates[i].SalePrice); 
            cant = 0;       
        }
      } 

      t= (thisCant * thisPrice + semiTotal).toFixed(2) ;
      
      return t;
    },
   
    totalByProduct(cant, price){
        return cant * price;
    } ,
    
    addAgregate(index, index1, cant){
        if(cant < 1)
          return this.deleteToAgg(index, index1)
        else{        
          this.cart[index].Aggregates[index1].Cant = parseInt(cant);             
          this.$store.commit('setCart', this.cart);
          this.openToastProd();            
        } 
        this.key++;
        return cant;
    },

    deleteToAgg(index, index1){
        let obj = this.cart[index];
        obj.Aggregates.splice(index1, 1);
        this.openToastProd(); 
       this.$store.commit('setCart', this.cart);
    },

    async changeOrderType(value){ 
       
        if(value === 'Pick Up' || value === 'Recogida'){
            this.keyOrderType ++;
            if(!this.configuration.selectPickHour)
              return this.sinPickAction();
            return  this.showPickUp();
        }
            
        if(value === 'Delivery' || value === 'Entrega'){
            this.keyOrderType ++;
           return this.showDeliver()
        }

        if(value === 'Table' || value === 'Mesa'){
            this.keyOrderType ++;
            return this.show();            
        }

         if(value === 'Curbside' || value === 'En Auto'){
            this.keyOrderType ++;
            return this.showCurbside();            
        }

        
    },

    validateBeforePay(){

          if(this.order.OrderType === 'On Table'){            
            if(this.CustomerName ==='') return false;                   
            }   
          
          else if(this.CustomerName ==='' || this.email === '' || this.phone === ''){
                  return false;
            }
        
        if(!this.order.OrderType){
                return false;
            }

        if(this.order.OrderType === 'Delivery')
            if(this.address === '' || this.configuration.zipCodes === ''){
               return false;
            }

        if(this.order.OrderType === 'PickUp')
            if(this.order.HourToPick === ''){
                return false;
            }

        return true;
    },
  
    buildOrder(){ 
         this.order.Products = this.cart;
        if(this.staffName !='')
            this.order.StaffName = this.staffName;
        if(this.staffId !='')
            this.order.staffId = this.staffId
        if(this.note !='')
            this.order.Note = this.note;
        if(this.otherCharges !=[])
            this.order.OtherCharges = this.otherCharges;
        if(this.total !='')
            this.order.Total = (this.total - this.discount).toFixed(2);
        if(this.subTotal !='')
            this.order.SubTotal = this.subTotal;
        if(this.taxes !='')
            this.order.Taxe = this.taxes;
        if(this.shipping !=0)
            this.order.Shipping = this.shipping;
        this.order.ClientId = this.clientId;
        this.order.CustomerName = this.CustomerName;
        this.order.CustomerEmail = this.email;
        this.order.CustomerPhone = this.phone;
        this.order.Tip = this.tip;
        this.order.OrderForCatering = false; 
        this.order.Date = this.date;
        if(this.discount > 0)
            this.order.Discount = this.discount; 
            return true; 
        
        
           
    },

    openCardPayment: async function(){

        const flag = this.validateBeforePay();
        if(!flag )
            return this.alertRequiredDatas();
        this.buildOrder()

        return this.$ionic.modalController
          .create({
            component: PaymentModal,
            backdropDismiss: false,
            keyboardClose: false,
            cssClass: 'my-custom-class',
            componentProps: {
              data: {
                content: 'New Content',
              },
              propsData: { 
                parent: this, 
                order: this.order,   
                canSplitPayment: !this.isTicket,          
                Acept: this.$t('frontend.home.acept'),
                Cancel: this.$t('frontend.home.cancel'), 
                Total: parseFloat(this.order.Total).toFixed(2),
                Tax:  this.taxes.toString(),
                TaxName: this.taxesName,     
                restaurantId: this.restaurantSelectedId,
                payMethod: this.restaurantActive.payMethod  ,  
                RestaurantName: this.restaurantActive.restaurantName,              
                errorPaymentHeader: this.$t('frontend.order.transictionTitle'),
                errorPaymentMss: this.$t('frontend.order.transictionError'),
                gooPaymentHeader: this.$t('frontend.order.transictionTitle'),
                gooPaymentMss: this.$t('frontend.order.transictionOk'),
                notValidEmail: this.$t('frontend.home.notValidEmail'),
                codeNotValid: this.$t('frontend.home.zipCodeNotValid'),
                notValidCC: this.$t('frontend.order.notValidCC'),
                dataRequired: this.$t('frontend.home.errorRequired'),
                paymentByCard: this.$t('frontend.order.paymentByCard'),
                totalForPay: this.$t('frontend.order.totalForPay'),
                currency: this.restaurantActive.currency,
                ccard: this.$t('frontend.order.ccard'),
                expcard: this.$t('frontend.order.expcard'),
                ccode: this.$t('frontend.order.ccode'),
                cityText: this.$t('frontend.home.city'),
                stateText: this.$t('frontend.home.state'),
                firstNameText: this.$t('frontend.order.firstName'),
                lastNameText: this.$t('frontend.order.lastName'),
                postalCode: this.$t('frontend.order.postalCode'),
                addressLine1: this.$t('frontend.order.addressLine1'),
                payText: this.$t('frontend.order.pay'),
                 verifyText: this.$t('frontend.order.verify'),
                returnTo: 'OrderView',
                isTicket: this.isTicket,
              },
            },
          })
          .then(m => m.present())  

         

          

    },

    openQrPayment: async function(){

        const flag = this.validateBeforePay();
        if(!flag )
            return this.alertRequiredDatas();
        this.buildOrder()
       
        return this.$ionic.modalController
          .create({
            component: QrModal,
            backdropDismiss: false,
            keyboardClose: false,
            cssClass: 'my-custom-class',
            componentProps: {
              data: {
                content: 'New Content',
              },
              propsData: {    
                order: this.order,  
                staffName: this.staffName,  
                RestaurantName: this.restaurantActive.restaurantName,       
                Acept: this.$t('frontend.home.acept'),
                Cancel: this.$t('frontend.home.cancel'), 
                Total: this.order.Total,
                Tax:  this.taxes.toString(),
                TaxName: this.taxesName,     
                restaurantId: this.restaurantSelectedId,
                payMethod: this.restaurantActive.payMethod  ,                
                errorPaymentHeader: this.$t('frontend.order.transictionTitle'),
                errorPaymentMss: this.$t('frontend.order.transictionError'),
                gooPaymentHeader: this.$t('frontend.order.transictionTitle'),
                gooPaymentMss: this.$t('frontend.order.transictionOk'),
                notValidEmail: this.$t('frontend.home.notValidEmail'),
                codeNotValid: this.$t('frontend.home.zipCodeNotValid'),
                notValidCC: this.$t('frontend.order.notValidCC'),
                dataRequired: this.$t('frontend.home.errorRequired'),
                paymentByCard: this.$t('frontend.order.paymentByCard'),
                totalForPay: this.$t('frontend.order.totalForPay'),
                currency: this.restaurantActive.currency,
                ccard: this.$t('frontend.order.ccard'),
                expcard: this.$t('frontend.order.expcard'),
                ccode: this.$t('frontend.order.ccode'),
                cityText: this.$t('frontend.home.city'),
                stateText: this.$t('frontend.home.state'),
                firstNameText: this.$t('frontend.order.firstName'),
                lastNameText: this.$t('frontend.order.lastName'),
                postalCode: this.$t('frontend.order.postalCode'),
                addressLine1: this.$t('frontend.order.addressLine1'),
                verifyText: this.$t('frontend.order.verify'),
                returnTo: 'OrderView',
              },
            },
          })
          .then(m => m.present())

         

    },

    async getOrders(){
      if(this.clientId =='')
        return false;
      this.spinner = true
       try {
         const response = await Api.getCustomerOrders(this.clientId)
        if(response.status === 200){
          this.$store.commit('setAllOrder', response.data)
            this.allOrders = response.data; 
              this.spinner = false   
        }
        else
          this.spinner = false  
       } catch (error) {
         this.spinner = false 
            console.log(error);
       }       
    },

    async getTickets(){
      if(this.clientId =='')
        return false;
      this.spinner = true
       try {
         const response = await Api.getCustomerTickets(this.clientId)
        if(response.status === 200){
          this.$store.commit('setAllTickets', response.data)  
          this.cart = JSON.parse(JSON.stringify(response.data[0].Products)) ;         
          this.$store.commit('setCart', this.cart);
          this.order =JSON.parse(JSON.stringify(response.data[0])) ;
          this.$store.commit('setOrder', this.order);       
            this.spinner = false   
        }
        else
          this.spinner = false  
       } catch (error) {
         this.spinner = false 
            console.log(error);
       }       
    },

    async saveAsTicket(){      
        try {           
            
           if(this.isTicket){  
             
              const flag = this.validateBeforePay();
              if(!flag )
                  return this.alertRequiredDatas();
              this.buildOrder()
            this.order.State = 0;
            this.order.isTicket = true;           
           }           
           const response = await Api.postIn('Order', this.order)
           if(response.status === 200 && response.statusText === "OK"){
             this.finishPayment(response.data, false);
           }
            
        } catch (error) {            
            console.log(error)
            this.spinner = false;
        }

    },

   
    recivePayment: async function(res){  

        try {           
            
           if(this.isTicket){
            this.order.AuthorizationPayment = [{
            state: 1,
            total: res.total,
            paymentInfo: res, 
            PaymentMethod:res.method + ' '+ res.accountType+ ' '+ res.accountNumber
            }]   ;        
            this.order.State = 0;
            this.order.isTicket = true;           
           } 
           else{
            this.order.Payment = [{
            state: 1,
            total: res.total,
            paymentInfo: res, 
            PaymentMethod:res.method + ' '+ res.accountType+ ' '+ res.accountNumber
            }]   ;        
            this.order.State = 1;

            // if(res.method==='Cash')   this.order.Payment[0].state = 0;

             for(var i=0; i< this.order.Products.length; i++){
              this.order.Products[i].State = 1;
            }  

           }
           const response = await Api.postIn('Order', this.order)
           if(response.status === 200 && response.statusText === "OK"){

             if(!this.order.isTicket){
               const paymentEntry = {                       
                        "Method": res.method,
                        "Payment": res.total,
                        "InvoiceNumber": res.transId,
                        "ModelId": response.data._id,
                        "ModelFrom": "Order",
                        "StaffName": this.order.StaffName,               
                   }
                
                   await Api.postIn('allpayments', paymentEntry);                
             }

                 
                this.spinner = false;
                if(this.order.Payment)
                  this.finishPayment(response.data, true);
                else{
                  if(this.order.isTicket && this.order.StaffName){
                    this.$store.commit('setAllTickets',[])                
                    this.$store.commit('setCart', []);        
                    this.$store.commit('setOrder', {});    
                    return this.$router.replace({ name: 'Ticket' }) 
                  }
                  else{
                    await this.$store.commit('setOrder', response.data);
                    await this.getTickets();
                    return this.$router.replace({ name: 'Home' }) 
                  }
                 
                }
                 
           }
            
        } catch (error) {            
            console.log(error)
            this.spinner = false;
        }
      
    },

    async finishPayment(value, flag){
      if(this.clientId != '')  await this.getOrders();  
      if(flag){
        this.sendEmail(value);
        this.goodPaymentToast();                  
        if(this.discount > 0 && this.theCodeToDiscount != '');{
              this.closeReservation(); 
        }  
      }
        
        this.order = {};
        this.cart = [];   
        this.$store.commit('setCart', [] );
        this.$store.commit('setOrder', {}); 
                                             
        if(this.clientId !='')                                    
            return this.$router.push({ name: 'ListOrder', params: {customerId: this.clientId, CustomerName: this.CustomerName} })                                                                  
        else if(this.staffName !=='' && this.isTicket)
          return this.$router.push({ name: 'Ticket' });
        else if(this.staffName !== '' && !this.isTicket)
          return this.$router.push({ name: 'Order' });            
        else                   
            return this.$router.replace({ name: 'Home' })  
         
    },

    sendEmail(order){
       
        if(!order.Date) return false;
         var date = moment.tz(order.Date, moment.tz.guess()).format('MM/DD/YYYY HH:mm:ss');

        const  allStates = [this.$t('frontend.order.state0'),this.$t('frontend.order.state1'), this.$t('frontend.order.state2'),
        this.$t('frontend.order.state3'), this.$t('frontend.order.state4'), this.$t('frontend.order.state5')];

        let urlCurbside = '';
        let orderInfo = '';
        if(order.OrderType == 'Delivery')
            orderInfo = order.AddressToDeliver
        if(order.OrderType == 'PickUp')
            orderInfo = moment.tz(order.DateToPick, moment.tz.guess()).format('MM-DD-YYYY') + ' |  ' + moment.tz(order.HourToPick, moment.tz.guess()).format('hh:mm A')
        if(order.OrderType == 'On Table')
            orderInfo = order.tableService
        if(order.OrderType == 'Curbside'){
            orderInfo = moment.tz(order.DateToPick, moment.tz.guess()).format('MM-DD-YYYY') + ' |  ' + moment.tz(order.HourToPick, moment.tz.guess()).format('hh:mm A')
            if(order._id)
              urlCurbside = `https://imenuapps.net/?rid=${this.restaurantSelectedId}&curbside=${order._id}`;
              // urlCurbside = `http://localhost:8080/?rid=${this.restaurantSelectedId}&curbside=${order._id}`;
        }

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
        html += `<h2>${this.restaurantActive.restaurantName}</h2>  `;
        html += `<img src="${this.restaurantActive.restaurantLogo}" style="max-width: 100px;"></img> `;     
        html +=`</td>`;     
        html += `</tr>`;          
        html += '<tr><td colspan=6 >'
        if(order.Payment){
           html += `<br> <h2> ${this.$t('frontend.order.payment')}: </h2>`;
           for (const payment of order.Payment) {
            if(payment.paymentInfo)
              html += ` <h4> 
                ${this.$t('frontend.order.total')}: <strong>  ${ this.getFormatPrice(payment.total)} </strong>  |
                ${this.$t('frontend.order.transId')}: <strong>  ${ payment.paymentInfo.transId} </strong>  |
                ${this.$t('frontend.order.paymentMethod')}: <strong>  ${ payment.PaymentMethod} </strong> 
              </h4>`;
          }
        }
        html += `<h4>${this.$t('frontend.order.date')}: ${date} </h4><hr>`;
        html += `<h4>${this.$t('frontend.order.client')}: ${order.CustomerName} </h4>`;
        html += `<h4>${this.$t('frontend.orderType.phone')}: ${order.CustomerPhone} </h4>`;      
        html += `<h4>${this.$t('frontend.order.orderFor')} ${this.allTypeOrder[order.OrderType]}: ${orderInfo} </h4>`;
       
        html += `<h4>${this.$t('frontend.order.orderState')}: ${allStates[order.State]} </h4>`;
        if(order.State == 6)
            html += `<h4>${this.$t('frontend.order.cancelReason')}: ${order.CancelNote}</h4><hr>`;         
        if(urlCurbside !== ''){           
              html+= `<h2>${this.$t('frontend.home.curbsideDetail')}</h2>`  
              html += `<h4>${this.$t('frontend.orderType.licencePlate')}: ${order.LicencePlate} </h4>`;
              html += `<h4>${this.$t('frontend.orderType.vehicleModel')}: ${order.VehicleModel} </h4>`;
              html += `<h4>${this.$t('frontend.orderType.vehicleColor')}: ${order.VehicleColor} </h4>`;
              html += `<a href="${urlCurbside}">${this.$t('frontend.tooltips.getToRestaurant')}</a><hr>`;             
          } 
        html += `</td></tr>`;  
       
        html += `<tr ><td colspan=6 ><h2 ><strong>${this.$t('frontend.order.products')}</strong></h2></td></tr> <tr></tr>`;
        for(var i = 0; i<order.Products.length ; i++){
            html += `<tr ><td  colspan=4 style="width: 50%;border-bottom: 1px solid #dbd1d1;" ><strong >${order.Products[i].Name}</strong>` ;
            if(order.Products[i].Note !='')
                html +=`<p style="background: #f1f1004d;">${order.Products[i].Note}</p> `;
            html +=`</td><td style="width: 25%;border-bottom: 1px solid #dbd1d1;" > <p >( ${order.Products[i].Cant} X ${this.getFormatPrice(order.Products[i].Price)} )</p> </td>`;
            html += `<td style="width: 25%;border-bottom: 1px solid #dbd1d1;"> <p > ${ this.getFormatPrice( order.Products[i].Price * order.Products[i].Cant )}</p> </td>`;
            html += `</tr>`;
           if(order.Products[i].Aggregates.length > 0){
                html +=`<tr style="padding: 20px 35px;"> ${this.$t('frontend.home.aggregateFree')}: ${order.Products[i].CantAggr=order.Products[i].AggregatesCant * order.Products[i].Cant} </tr>`;

                 for(var a=0; a<order.Products[i].Aggregates.length; a++){
                    let agg = order.Products[i].Aggregates[a]
                    html += `<tr ><td  colspan=4 style="width: 50%;border-bottom: 1px solid #dbd1d1;" ><p style="padding-left: 20px;">${agg.Name} <br> ${this.getFormatPrice(agg.SalePrice)}</p>` ;
                    html +=`</td><td style="width: 25%;border-bottom: 1px solid #dbd1d1;" > <p > ${agg.Cant}</p> </td>`;
                    html += `<td style="width: 25%;border-bottom: 1px solid #dbd1d1;"> <p > ${ this.getFormatPrice( agg.AllTotal ) }</p> </td></tr >`;            
                 }
            }
            
        }

        if(order.OtherCharges.length >0){
            html += `<tr ><td colspan=6 ><h4 ><strong>${this.$t('frontend.order.otherCharges')}</strong></h4></td></tr>`;
            for(var e = 0; e< order.OtherCharges.length ; e++){
                html += ` <tr ><td colspan=5 style="width: 75%;border-bottom: 1px solid #dbd1d1;"><p >${order.OtherCharges[e].Name}</p></td> <td style="border-bottom: 1px solid #dbd1d1;"> <p> ${this.getFormatPrice(order.OtherCharges[e].Price)}</p></td></tr>`;
            }
        }
        html += `<tr ><td colspan=5 ><p ><strong>${this.$t('frontend.order.subtotal')}</strong></p></td> <td > <p > ${this.getFormatPrice(order.SubTotal)}</p></td></tr>`;
        html += `<tr><td  colspan=5><p  ><strong>${this.$t('frontend.order.taxe')} ${order.Taxe}%</strong></p></td> <td > <p >${ this.getFormatPrice(order.Taxe * order.SubTotal / 100) }</p> </td></tr>`;
        if(order.OrderType == 'Delivery')
            html +=  `<tr ><td colspan=5 ><p  ><strong>${this.$t('frontend.order.deliver')}</strong></p></td><td  ><p > ${this.getFormatPrice(order.Shipping) }</p></td></tr>`;
        if(order.Tip)
            html += `<tr ><td  colspan=5 ><p ><strong>${this.$t('frontend.order.tip')} ${order.Tip}%</strong></p></td><td ><p>${ this.getFormatPrice(order.Tip * order.SubTotal / 100) } </p> </td></tr>`;
        html += `<tr><td colspan=5 style="border-bottom: 1px solid #dbd1d1;"><p  ><strong>${this.$t('frontend.order.total')}</strong></p></td> <td style="border-bottom: 1px solid #dbd1d1;"> <strong > ${this.getFormatPrice(order.Total) }</strong> </td></tr>`;
        if(order.Note)
            html += `<tr ><td style="width: 20%;border-bottom: 1px solid grey;"><h4 >${this.$t('frontend.order.notes')}</h4></td><td colspan=5 style="width: 80%;border-bottom: 1px solid grey;" ><p >${order.Note}</p></td></tr>`;
        html += '<tr><td colspan=6 style=" text-align: center;">';
        html += `<h2>${this.restaurantActive.restaurantName}</h2>  `;
        html += `<h4>${this.restaurantActive.restaurantPhone} </h4> `;
        html += `<h4>${this.restaurantActive.restaurantAddress}  </h4>`; 
        if(this.restaurantActive.restaurantWeb)  
            html += `<h4>${this.restaurantActive.restaurantWeb}  </h4>`;   
        html +=`</td>`;     
        html += `</tr>`; 
        html += '<tr> <td colspan=6 align="center"  style="border-bottom: 1px solid grey;">';
        html += `<a href="mailto:${this.restaurantActive.restaurantEmail}" style="margin: 0 10px;"><img style="width: 32px;" src="https://storagemenusuccess.blob.core.windows.net/logo/email-icon.png"></img> </a>`;
        if(this.restaurantActive.restaurantFacebok)
            html += `<a href="${this.restaurantActive.restaurantFacebok}" style="margin: 0 10px;"><img style="width: 32px;" src="https://storagemenusuccess.blob.core.windows.net/logo/Facebook-icon.png"></img> </a>`;
        if(this.restaurantActive.restaurantInstagram)
            html += `<a  href="${this.restaurantActive.restaurantInstagram}" style="margin: 0 10px;"><img style="width: 32px;"  src="https://storagemenusuccess.blob.core.windows.net/logo/instagram-icon.png"></img> </a>`;
        if(this.restaurantActive.restaurantTwitter)
            html += `<a href="${this.restaurantActive.restaurantTwitter}" style="margin: 0 10px;"><img style="width: 32px;"  src="https://storagemenusuccess.blob.core.windows.net/logo/Twitter-icon.png"></img> </a>`;
        if(this.restaurantActive.restaurantYoutube)
            html += `<a href="${this.restaurantActive.restaurantYoutube}" style="margin: 0 10px;"><img style="width: 32px;"  src="https://storagemenusuccess.blob.core.windows.net/logo/Youtube-icon.png"></img> </a>`;
        
        html += '</td></tr>'
        html += `</table></div></body></html>`;
        
      //miguel.augusto1987
        var items = {
            "email": order.CustomerEmail,
            "mess": html,
            "subject": this.$t('frontend.order.invoice') + '-'+ order.Payment[0].paymentInfo.transId +' ' + this.restaurantActive.restaurantName
        }
      return Api.sendEmail(items);    

   },

    getOrderInfo: function(){
        if(this.order.OrderType == 'Delivery'){
            this.orderInfo = this.order.AddressToDeliver ;
            const deliveryAdress = this.orderInfo.split(' ZipCode: ');
            this.zipCode = deliveryAdress[1];        
            this.address = deliveryAdress[0];  
        }
        if(this.order.OrderType == 'PickUp'){           
          this.orderInfo = this.order.HourToPick;
        // this.orderInfo = moment.tz(this.order.Date, moment.tz.guess()).format('hh:mm A')
        }
        if(this.order.OrderType == 'On Table')
            this.orderInfo = this.order.tableService;
    },

    getOtherCharges: function(){        
        this.spinnerCharge = true;
        this.otherCharges = []
        for (const obj of this.cart){
            Api.findProductCharges(obj.ProductId, obj.Cant).then(response => {
                this.otherCharges = this.otherCharges.concat( response.data)               
                this.spinnerCharge = false;
                })
                .catch(e => {
                    console.log(e)
                     this.spinnerCharge = false;
                });  
         }
    },
   
    goHome: function(){       
        this.$store.commit('setCart', []);
        this.$store.commit('setOrder', {});      
        return this.$router.push({ name: 'Home', params: {cart:this.cart, order:this.order } })
    },

    removeProductFromCart: function(id){
        const element = (elem) => elem.ProductId == id;
        var index =this.cart.findIndex(element)
        this.cart.splice(index, 1)
        this.$store.commit('setCart', [] );
        this.getOtherCharges();
        if(this.cart.length == 0){
            return this.$router.push({ name: 'Home', params: {cart:this.cart } })
        }
    },
    
    addProductsToCart: function(){   
        return this.$router.push({ name: 'Home', params: {cart: this.cart, order: this.order } })
    },

    changeOrderInfo: function(event){

        if(!event)
            return this.alertRequiredDatas();
           
        if(this.order.OrderType == 'Delivery'){
            var hills = LibCodes.lookup(this.zipCode);  
            if(hills){
                const onlyAdress = event.split(' State: ');        
                if(onlyAdress.length > 0)
                    this.order.AddressToDeliver = onlyAdress[0] +' State: '+ hills.state +' City: '+ hills.city + ' ZipCode: '+ this.zipCode
                else   
                    this.order.AddressToDeliver = event +' State: '+ hills.state +' City: '+ hills.city + ' ZipCode: '+ this.zipCode 
                
                this.address = this.order.AddressToDeliver.split(' ZipCode: ')[0];
                event = this.order.AddressToDeliver;
            } 
            else{
                this.order.AddressToDeliver = event +' ZipCode: '+ ' '  
            }               
                    
           

            this.address = this.order.AddressToDeliver.split(' ZipCode: ')[0];
            event = this.order.AddressToDeliver;            
        }
        
        if(this.order.OrderType == 'PickUp'){
             this.order.HourToPick = moment.tz(event, moment.tz.guess()).format('hh:mm A');
        }
         
        if(this.order.OrderType == 'On Table')
          this.order.tableService = event;
         
         this.orderInfo = event;            
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
    
    getDeliveryInfo(value){

        const deliveryAdress = this.orderInfo.split(' ZipCode: ');
        if(value =='code'){
            return deliveryAdress[1]
        }
        if(value =='address'){
            return deliveryAdress[0]
        }
    
    },
    
    changeZipCode(value){
        var hills = LibCodes.lookup(value);   
        if(!hills){
        this.state = "";
        this.city = "";
        this.zipCode ='';
        return this.alertCodeNotValid();
        }  

        if(this.configuration.zipCodes.length > 0){
            const zip = this.configuration.zipCodes.filter(zc => zc.ZipCode === value);
            if(!zip.length >0){
                this.zipCode ='';
                return this.alertNotZoneDelever();  
            }              
        }

        const deliveryAdress = this.orderInfo.split(' ZipCode: ');
        const onlyAdress = deliveryAdress[0].split(' State: ');
        
        if(onlyAdress.length > 0)
            this.orderInfo = onlyAdress[0] +' State: '+ hills.state +' City:'+ hills.city + ' ZipCode: '+ value
        else   
           this.orderInfo = deliveryAdress[0] +' State: '+ hills.state +' City:'+ hills.city + ' ZipCode: '+ value 
        this.order.AddressToDeliver = this.orderInfo;

        this.address = this.orderInfo.split(' ZipCode: ')[0];

        this.zipCode = value;

    },

    alertCodeNotValid(){
    return  this.$ionic.alertController
    .create({
        cssClass: 'my-custom-class',
        header: 'Error',
        message: this.$t('frontend.home.zipCodeNotValid') ,
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
    
    alertNotZoneDelever(){
    return  this.$ionic.alertController
    .create({
        cssClass: 'my-custom-class',
        header: 'Error',
        message: this.$t('frontend.home.notZoneToDeliver') , 
        buttons: [                   
        {
          text: this.buttonAcept,
          handler: () => {                                 
                        
          },
        },
        ],
    })
    .then(a => a.present())
                
  },

    validateCant(event ){
        if(event>0)
            return event;
        else
            return '1';
        
        },
  
    alertEmailNotValid(){
    this.email =''
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
                
  },
  
    validatePhone(phone){     
    if (!phone) {
      return true;
    }
    try {
       const number = parsePhoneNumber(`+1${phone}`);
      //const number = parsePhoneNumberFromString(`+1${phone}`);
     
      if (!number.isValid()) {       
        return false;         
      }         
      this.phone = parsePhoneNumber(`+1${phone}`).formatNational();
      return true;
    } 
    catch (err) {     
      return false;
    } 
  },

    async openToastProd() {
      return this.$ionic.toastController
      
        .create({
          message: this.$t('frontend.product.massageToast'),
          duration: 2000,
          position: 'top',
          color:'success'
        })
      .then(a => a.present())
    },

    async openToast(mss) {
      return this.$ionic.toastController
      
        .create({
          message: mss,
          duration: 1000,
          position: 'top',
          color:'success'
        })
      .then(a => a.present())
    },

    async goodPaymentToast() {
      return this.$ionic.toastController      
        .create({
            header:this.$t('frontend.order.transictionTitle'),
            message:  this.$t('frontend.order.transictionOk'),
            duration: 2000,
            position: 'middle',
            color:'success'
            })
      .then(a => a.present())
    },

    async errorPaymentToast() {
      return this.$ionic.toastController      
        .create({
            header:this.$t('frontend.order.transictionTitle'),
            message:  this.$t('frontend.order.transictionError'),
            duration: 2000,
            position: 'middle',
            color:'danger'
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

     backToCall: function(){
      
        if(this.buttonBack)
         return this.allOrder();
        else
         return this.addProductsToCart() ;
    },

    allOrder: function(){
        return this.$router.push({ name: 'ListOrder', params: {customerId: this.order.ClientId, CustomerName: this.CustomerName} })    
    },

    checkPickTime(){
      let now = Moment().add(this.configuration.minTimeToCook, 'minutes'); 

      let min = Moment(this.configuration.minHour ,'HH:mm')                  
      let max = Moment(this.configuration.maxHour ,'HH:mm')    
       
      if(now > max)
        this.timeToPick = false;
      if(now > min && now < max){  
        this.timeToPick = true;                
         EventBus.$emit('updateMinHour', now.format('HH:mm'));
         return now.format('HH:mm');
      }
      return false;      
    },


ValidateHour(value){

    let now = value

    if(Moment(value).isValid())
      now = Moment(value).format('HH:mm')

     
    this.key ++;  

    let min = Moment(this.thisMinHour).toISOString();
    min = moment.tz(min,  moment.tz.guess()).format('HH:mm') ;

    let max = this.configuration.maxHour  

    let response = this.checkPickTime();
    if(response){
           
      min = response;
    }     
        
   
    if(now < min || now > max){      
      this.alertNoTimeToPick(min)
      this.thisMinHour = '';
      return this.thisMinHour;     
    }
    return value; 
  },

  alertNoTimeToPick(min){
    this.thisMinHour = Moment(this.thisMinHour, 'HH:mm').toISOString();
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: 'Info',
          message: this.$t('frontend.home.pickTime') + '<br>' +  this.$t('frontend.home.notTimeToPick') +
           Moment( min,'kk:mm').format('h:mm A')
           +' - '+ Moment(this.configuration.maxHour,'kk:mm').format('h:mm A')  + '<br>' +
           this.$t('frontend.home.cookTime') + this.configuration.minTimeToCook + this.$t('frontend.home.minuts'),
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

     show () {
      this.$modal.show('my-first-modal');
        },
    
    hide () {
      this.$modal.hide('my-first-modal');
        },

    onDecode (result) {
        this.result = result      
        this.tableAction(result)
        this.hide();
      },

    onInit (promise) {
      promise.then(() => {
        console.log('Successfully initilized! Ready for scanning now!')
      })
       .catch (error => {
        if (error.name === 'NotAllowedError') {
          this.error = "ERROR: you need to grant camera access permisson"
        } else if (error.name === 'NotFoundError') {
          this.error = "ERROR: no camera on this device"
        } else if (error.name === 'NotSupportedError') {
          this.error = "ERROR: secure context required (HTTPS, localhost)"
        } else if (error.name === 'NotReadableError') {
          this.error = "ERROR: is the camera already in use?"
        } else if (error.name === 'OverconstrainedError') {
          this.error = "ERROR: installed cameras are not suitable"
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.error = "ERROR: Stream API is not supported in this browser"
        }
      })
    },

     tableAction: async function(value) {

      var codeFromQr = value.split('-');
      var tableId = '';
      var sitName = '';
      if(codeFromQr.length === 2){
        tableId = codeFromQr[0];
        sitName = codeFromQr[1];
      }
      else
       return this.notValidQr();

      this.spinner = true

      Api.fetchById("Table", tableId).then(response => {        
      this.spinner = false  
     
        if(response.status === 200 && response.data.Available){

          const seat = response.data.Seats.findIndex(t => t.name === value)
          if(seat !== -1){
             if(response.data.Seats[seat].available !== true){
               this.spinner = false ;
                return this.notSeatAvailable();
             }             
            else{
               
              this.tableService = sitName;
              this.orderType = "On Table" 
              EventBus.$emit('updateOrderType', this.orderType);
              this.showProduct = false;
              this.isDelivery = false;
              this.isPick = false;
              this.isTable = true;   
              this.isCurbside = false;          
              this.order.OrderType = "On Table";
              this.order.tableService = this.tableService; 
              this.order.ClientId = this.clientId,    

              this.$store.commit('setOrder', this.order);
              
            
              this.changeOrderButton();                  
            
              response.data.State = 'Busy';
              response.data.Seats[seat].available = false;
              var tableBusy = response.data;
              Api.putIn("Table", tableBusy);

              this.openToast(this.$t('frontend.order.location') + ': ' + this.order.tableService)

              this.spinner = false  

            }

          }
          else
           return this.notSeatAvailable();
           

                    
        }
        else{
           return this.notValidQr();
        }
      })
      .catch(e => {
        this.spinner = false
        console.log(e)
        return this.notValidQr();
      });
   },

    
    showDeliver () {
      this.$modal.show('delivery-modal');
        },
    
    hideDeliver () {
      this.$modal.hide('delivery-modal');
        },

    saveDeliver(){
      if(this.addres1 ===''  ||this.zipCodeFlag == '')
        return this.alertRequiredDatas();

        this.ValidateCodeInModal(this.zipCodeFlag)

      this.orderType = "Delivery"
      EventBus.$emit('updateOrderType', this.orderType);
      this.address = this.addres1 +' '+ this.addres2 +' State: '+ this.state +' City:'+ this.city + ' ZipCode: '+ this.zipCodeFlag;
      this.clientHasOrderSelected = true;
      this.order.OrderType = "Delivery";      
      this.changeOrderButton();
      this.order.AddressToDeliver = this.address; 
      this.order.addres1 = this.addres1; 
      this.order.addres2 = this.addres2; 
      this.order.zipCode = this.zipCodeFlag; 
      this.order.ClientId = this.clientId,  
    
      this.$store.commit('setOrder', this.order);
            
      this.openToast(this.allTypeOrder[this.orderType] + ': ' + this.address);     
      this.hideDeliver();
    },

   showPickUp(){
    
      let min1 = this.configuration.minHour;
      let response = this.checkPickTime();
      if(!this.timeToPick )return this.alertNoTimeToPick(min1);
      if(response)  min1 = response;   
     

      if(this.order.HourToPick){      
        const userHour = Moment(this.order.HourToPick ,'HH:mm');
        const rHour = Moment(response ,'HH:mm');        
        if(userHour > rHour && userHour < this.configuration.maxHour) 
          this.thisMinHour = this.order.HourToPick;
        else
        this.thisMinHour = min1;  
      }  
      else
        this.thisMinHour = min1;         

      this.$modal.show('pickup-modal');

   },
 
  hidePickUp () {
  this.$modal.hide('pickup-modal');
    },

  savePickUp () {

    if(!Moment(this.thisMinHour).isValid())
      this.thisMinHour = Moment(this.thisMinHour, 'HH:mm').toISOString();
    
    if(this.thisMinHour === '')
        return this.alertRequiredDatas();

    this.orderType = "PickUp"
    EventBus.$emit('updateOrderType', this.orderType);
    this.hourToPick = Moment( Moment(this.thisMinHour)).toISOString();
    this.clientHasOrderSelected = true; 
    this.order.OrderType = "PickUp";
    this.order.HourToPick = this.hourToPick; 
    this.order.DateToPick =   Moment(this.dateToDay).toISOString();
    this.order.ClientId = this.clientId,  
    this.changeOrderButton();
    this.$store.commit('setOrder', this.order);
    this.openToast(this.allTypeOrder[this.orderType] + ': ' + moment.tz(this.hourToPick, moment.tz.guess()).format('hh:mm A'))

    this.hidePickUp();
    },

  sinPickAction() {
    this.orderType = "PickUp"
    EventBus.$emit('updateOrderType', this.orderType);
    this.hourToPick = ''
        this.clientHasOrderSelected = true; 
    this.order.OrderType = "PickUp";
    this.changeOrderButton(); 
    this.order.HourToPick = this.hourToPick; 
    this.order.DateToPick =   Moment(this.dateToDay).toISOString();
    this.order.ClientId = this.clientId,    
    this.$store.commit('setOrder', this.order);
    this.showProduct = false;
    }, 

   showCurbside(){

     let min1 = this.configuration.minHour;

      let response = this.checkPickTime();
      if(!this.timeToPick )return this.alertNoTimeToPick(min1);
      if(response)  min1 = response;
      

      if(this.order.HourToPick){
      const userHour = Moment(this.order.HourToPick ,'HH:mm');
      const rHour = Moment(response ,'HH:mm');
      if(userHour > rHour && userHour < this.configuration.maxHour) 
        this.thisMinHour = this.order.HourToPick;
      else
      this.thisMinHour = min1;  
      }  
      else
        this.thisMinHour = min1;         

      this.$modal.show('curbside-modal');

   },
  
  hideCurbside () {
    this.$modal.hide('curbside-modal');
    },

  saveCurbside () {

    if(this.thisMinHour === '' || this.dateToDay === '' ||
     this.licencePlate=== '' || this.vehicleModel=== ''|| this.vehicleColor=== '')
        return this.alertRequiredDatas();

    this.orderType = "Curbside"
    this.order.OrderType = "Curbside";
    this.keyCurbside ++;
    EventBus.$emit('updateOrderType', this.orderType);
    this.hourToPick = Moment(this.thisMinHour, 'HH:mm').toISOString();
    // this.hourToPick = this.thisMinHour;
   
    
    this.changeOrderButton();
    this.order.HourToPick =  this.hourToPick;
    this.order.DateToPick =   Moment(this.dateToDay).toISOString();
    this.order.ClientId = this.clientId,  
    this.order.LicencePlate = this.licencePlate;
    this.order.VehicleModel = this.vehicleModel;
    this.order.VehicleColor = this.vehicleColor;

    this.$store.commit('setOrder', this.order);        
   
    this.openToast(this.allTypeOrder[this.orderType] + ': ' + moment.tz(this.hourToPick, moment.tz.guess()).format('hh:mm A')  )

    this.hideCurbside();
    },

    ValidateCodeInModal(event){
    
     var hills = LibCodes.lookup(event);   
    if(!hills){
      this.state = "";
      this.city = "";
      this.zipCodeFlag = '';
      this.alertCodeNotValid(); 
      return '';
    }  
    if(this.configuration.zipCodes.length > 0){
      const zip = this.configuration.zipCodes.filter(zc => zc.ZipCode === event);
      if(!zip.length >0 ){
        this.state = "";
        this.city = "";
        this.zipCodeFlag = '';
         this.alertNotZoneDelever();   
         return '';     
      }
      else{
        this.state = hills.state;
        this.city = hills.city;
        this.zipCodeFlag = event;
      //  this.openShowCodeDetail(this.state, this.city)
        return event;
      }      
    }
    
    
    },

    changeOrderButton: function(){     
       if(this.order.OrderType === 'Delivery' && this.clientHasOrderSelected){         
        this.isDelivery = true;
        this.isPick = false;
        this.isTable = false;  
        this.isCurbside = false;
        
       }
      if(this.order.OrderType === 'PickUp' && this.clientHasOrderSelected){
        this.isDelivery = false;
        this.isPick = true;
        this.isTable = false;   
        this.isCurbside = false;
        
       }
       if(this.order.OrderType === 'On Table' && this.clientHasOrderSelected){
        this.isDelivery = false;
        this.isPick = false;
        this.isTable = true; 
        this.isCurbside = false;
                
       }
        if(this.order.OrderType === 'Curbside' && this.clientHasOrderSelected){
        this.isDelivery = false;
        this.isPick = false;
        this.isTable = false;   
        this.isCurbside = true;
        
       }
     
    },

      notValidQr(){
      this.changeOrderButton(); 
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: 'Error',
          message: this.$t('frontend.home.notValidQr'),
          buttons: [                   
            {
              text: this.$t('frontend.home.acept'),
              handler: () => {},
            },
          ],
      })
      .then(a => a.present())
    },

    notSeatAvailable(){
      this.changeOrderButton(); 
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: 'Error',
          message: this.$t('frontend.home.notSeatAvailable'),
          buttons: [                   
            {
              text: this.$t('frontend.home.acept'),
              handler: () => {},
            },
          ],
      })
      .then(a => a.present())
    },

    quotationBiggerThanSubtotal(){
         this.changeOrderButton(); 
            return  this.$ionic.alertController
            .create({
                cssClass: 'my-custom-class',
                header: 'Error',
                message: this.$t('frontend.reservation.subtotalNotForDiscount'),
                buttons: [                   
                    {
                    text: this.$t('frontend.home.acept'),
                    handler: () => {},
                    },
                ],
            })
            .then(a => a.present())
    },

    notDiscountToApply(){
         this.changeOrderButton(); 
            return  this.$ionic.alertController
            .create({
                cssClass: 'my-custom-class',
                header: 'Error',
                message: this.$t('frontend.reservation.notDiscountToApply'),
                buttons: [                   
                    {
                    text: this.$t('frontend.home.acept'),
                    handler: () => {},
                    },
                ],
            })
            .then(a => a.present())
    },

    orderCloseToDiscount(){
      this.changeOrderButton(); 
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: 'Error',
          message: this.$t('frontend.reservation.orderCloseToDiscount'),
          buttons: [                   
            {
              text: this.$t('frontend.home.acept'),
              handler: () => {},
            },
          ],
      })
      .then(a => a.present())
    },

    logIng: function(update) {
      
       return this.$ionic.modalController
        .create({
          component: orderType,
          cssClass: 'my-custom-class',
          componentProps: {
            data: {
              content: 'New Content',              
            },
          propsData: {
            parent: this,
            title: this.$t('frontend.app.selectDetail'),              
            buttonAcept:this.$t('frontend.home.acept'),
            buttonCancel:this.$t('frontend.home.cancel'),
            placeholderEmail: this.$t('frontend.orderType.email'),
            placeholderPassword: this.$t('frontend.orderType.password'),
            placeholderName: this.$t('frontend.orderType.name'),
            placeholderPhone: this.$t('frontend.orderType.phone'),             
            requiredData: this.$t('frontend.home.errorRequired'),
            contactedBy: this.$t('frontend.orderType.contactedBy'),
            notValidEmail: this.$t('frontend.home.notValidEmail') , 
            restaurantEmail: this.restaurantActive.restaurantEmail,
            update: update,             
            logIn:  this.$t('frontend.menu.logIn'), 
            register:  this.$t('frontend.menu.register'), 
            forgotPasswordText: this.$t('frontend.menu.forgotPassword'), 
            restablacerPassword: this.$t('frontend.menu.restablacerPassword'), 
            updateData: this.$t('frontend.menu.updateData'),           
            createUser:  this.$t('frontend.menu.createUser'), 
            newPassword:  this.$t('frontend.menu.newPassword'), 
            confirmPassword:  this.$t('frontend.menu.confirmPassword'), 
            mssForgotPassword:   this.$t('frontend.menu.mssForgotPassword'), 
            errorLogIn: this.$t('frontend.menu.errorLogIn'), 
            errEmailExist: this.$t('frontend.menu.errEmailExist'),
            errPassNotCoinc: this.$t('frontend.menu.errPassNotCoinc'),
            userNotFound: this.$t('frontend.menu.userNotFound'),
            newData: this.$t('frontend.menu.newData'),
            mssUpdateData: this.$t('frontend.menu.mssUpdateData'),
            mssCreateUser: this.$t('frontend.menu.mssCreateUser'),
            mssPasswordChangedCorrectly:  this.$t('frontend.menu.mssPasswordChangedCorrectly'),
          },
          },
        })
        .then(
          m => m.present(),
          )
    },

    closeReservation(){
        if(this.theCodeToDiscount !== ''){
             Api.getReservationByCode(this.theCodeToDiscount)
            .then(response => {                 
                response.data.State = 6;
                Api.putIn('Reservation',response.data);
            })
            .catch(e => {              
              console.log(e); 
            }) 
        }
    },

    findByCode(){
        this.key2++;
        if(this.theCodeToDiscount === '')
            return this.alertRequiredDatas();
        this.spinnerDiscount = true;
        Api.getReservationByCode(this.theCodeToDiscount)
            .then(response => {
                 this.spinnerDiscount = false;
                if(response.data.State === 6){
                    this.discount = 0;
                    return this.orderCloseToDiscount();
                }                    
                if(response.data.QuotationPayment > this.subTotal ){
                     this.discount = 0;
                     return this.quotationBiggerThanSubtotal();
                }                                    
                if(response.data.QuotationPayment && response.data.State === 4)
                    this.discount = response.data.QuotationPayment;  
                else{
                    this.theCodeToDiscount = '';
                    this.showDiscount = false;                    
                     return this.notDiscountToApply();
                }
                   

            })
            .catch(e => {
              this.spinnerDiscount = false;
              this.theCodeToDiscount = '';
              console.log(e);    
              return this.notDiscountToApply();
                        
            }) 
      },

    validateEmail(){
         let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
            if (emailRegex.test(this.email) == false){
                this.email = '';
                return this.alertEmailNotValid();
            }
               
    },
    
    getFormatPrice(price){
      const result = new Intl.NumberFormat('en', {style: "currency", currency: this.restaurantActive.currency} ).format(price)
      return result;
    },

    customerUpdated(){       
      this.clientId= this.$store.state.customer._id;
      this.CustomerName= this.$store.state.customer.Name;
      this.email= this.$store.state.customer.EmailAddress;
      this.phone=this.$store.state.customer.Phone;
      this.marketingEmail=this.$store.state.customer.MarketingConsent.Email;
      this.marketingPhone=this.$store.state.customer.MarketingConsent.Phone;
    },

    getSplitPaymentDo(){
      let count = 0;
      if(this.order.Payment)
        for(var i =0 ; i<this.order.Payment.length; i++ ){
          if(this.order.Payment[i].state===1)
              count += this.order.Payment[i].total
        }
        if(count > 0)
          return this.getFormatPrice(count);
        return count
    },

    getPendingSplitPayment(){
      let count = 0;
      if(this.order.Payment)
        for(var i =0 ; i<this.order.Payment.length; i++ ){
          if(this.order.Payment[i].state===1)
              count += this.order.Payment[i].total
        }
        if(count > 0)
          return this.getFormatPrice(this.order.Total - count);
        return count
    },


 
   
      
},
   
    
  

}
</script>

<style>
.searchbar-input{
    padding: 6px !important;
    text-align: center !important;
}
    .menu-bold-title{
        font-size: 16px;font-weight: bold;text-align: left;
    }
    .titles-order{
    font-size: 20px !important;
    font-weight: bold !important;
    text-align: left;
    padding: 10px;
    position: inherit;
    color: black;    
    }
    .subtitles-order{
    font-size: 16px !important;
    font-weight: bold !important;
    text-align: left;
    padding: 10px;
    position: inherit;
    color: black;    
    }
    .menu-textarea {
        border: 1px solid #80808073;
        margin-bottom: 20px;
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
        flex: 0 0 calc(calc(6 / var(--ion-grid-columns, 12)) * 100%) !important;
        width: calc(calc(6 / var(--ion-grid-columns, 12)) * 100%) !important;
        max-width: calc(calc(6 / var(--ion-grid-columns, 12)) * 100%) !important;
        text-align: left;
    }
    .menu-col-2{
        flex: 0 0 calc(calc(2 / var(--ion-grid-columns, 12)) * 100%) !important;
        width: calc(calc(2 / var(--ion-grid-columns, 12)) * 100%) !important;
        max-width: calc(calc(2 / var(--ion-grid-columns, 12)) * 100%) !important;
        text-align: left;
    }
    .menu-bold-title{
        padding-right: 15px;
    }

    .modalH {
        height: 40%;
        width: 70%;
        border-radius:10px;
        border: 1px solid  grey;
        top: 20%;
        margin: 0 auto;
    } 
    .select-text {
    font-size: 16px;
} 
</style>

