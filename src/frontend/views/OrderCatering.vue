<template>
    <div id="product" class="product">
        
        <div v-if="spinner">
           <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
        </div>

        <modal name="catering-modal"  width="80%" height="auto" style="left: 0px;width: auto;height: auto; max-width: 500px !important;">
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
                <ion-label position="floating">{{$t('frontend.order.dateToPickEstimated')}} <strong style="color: red">*</strong></ion-label>
                <ion-datetime :value="dateToDay" max="2030"  @ionChange="dateEstimateToPick=$event.target.value, validateHour()" :min="dateToDay.format('YYYY-MM-DD')"     
                ></ion-datetime>
            </ion-item>
            <ion-item>
                <ion-label position="floating">{{$t('frontend.order.hourToPickEstimated')}} <strong style="color: red">*</strong></ion-label>
                <ion-datetime display-format="h:mm A" picker-format="h:mm A" :value="hourEstimateToPick"  @ionChange="hourEstimateToPick = $event.target.value, validateHour()" :key="key2"        
                ></ion-datetime>
            </ion-item>
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
                <ion-input type="tel" :value="zipCodeFlag" @input="zipCodeFlag= $event.target.value" @change="zipCodeFlag=ValidateState($event.target.value)">             
                </ion-input>
            </ion-item>
            <ion-button  @click="hideDeliver()">{{ this.$t('frontend.home.cancel') }}</ion-button>
            <ion-button  @click="saveDeliver()">{{ this.$t('frontend.home.acept') }}</ion-button>
            
            </ion-card>          
        </modal>

        <modal name="pickup-modal" width="80%" height="auto" style="left: 0px;width: auto;height: auto; max-width: 500px !important;">
            <ion-buttons slot="start" @click="hidePickUp()">
                <ion-back-button default-href="home"></ion-back-button>
            </ion-buttons>
            <ion-header>
            <ion-toolbar>
                <ion-title>{{ $t('frontend.home.pickupDetail') }}</ion-title>
                <ion-label color="success"><p><strong>{{ this.$t('frontend.order.readyForPick') }}</strong></p></ion-label>
            </ion-toolbar>
            </ion-header>

            <ion-card>
                <ion-item>
                <ion-label position="floating">{{$t('frontend.order.dateToPickEstimated')}} <strong style="color: red">*</strong></ion-label>
                <ion-datetime :value="dateToDay" max="2030"  @ionChange="dateEstimateToPick=$event.target.value, validateHour()" :min="dateToDay.format('YYYY-MM-DD')"     
                ></ion-datetime>
            </ion-item>
            <ion-item>
                <ion-label position="floating">{{$t('frontend.order.hourToPickEstimated')}} <strong style="color: red">*</strong></ion-label>
                <ion-datetime display-format="h:mm A" picker-format="h:mm A" :value="hourEstimateToPick"  @ionChange="hourEstimateToPick=$event.target.value, validateHour()" :key="key1"        
                ></ion-datetime>
            </ion-item>          
            <ion-button  @click="hidePickUp()">{{ this.$t('frontend.home.cancel') }}</ion-button>
            <ion-button  @click="savePickUp()">{{ this.$t('frontend.home.acept') }}</ion-button>
            
            </ion-card>          
        </modal>

        <v-breakpoint  v-if="!spinner">
            <div slot-scope="scope">
                <span >  
                    <div :style="scope.isSmall || scope.isMedium || scope.noMatch? '': 'width: 80%; margin: 0 auto;'">
                        
                         <ion-toolbar>

                            <ion-buttons slot="start" @click="backToCall()">
                                <ion-back-button default-href="home"></ion-back-button>
                            </ion-buttons>    
                                                
                            <ion-card-title                          
                                style="padding: 10px;text-align: center;text-transform: uppercase;font-weight: bolder;">
                                {{$t('frontend.order.orderDetail')}} |  {{$t('frontend.menu.catering')}}
                            </ion-card-title>

                        </ion-toolbar>  
                        
                         <ion-card  style="padding: 0 10px 10px 0;"> 

                              <ion-label class="ion-text-wrap menu-col-12">
                                <h2 class="titles-order" style="width: 50%;float: left;">{{$t('frontend.order.clientInfo')}}</h2>
                                <ion-button  v-if="clientId ===''" @click="logIng('')" fill="outline"  style="float: right; margin-right: 10px;" > <span class="iconify" data-icon="ei:user" data-inline="false" style="margin: 0 -13px;"></span> </ion-button>
                                <p style="display: inline-block; text-align: left; font-style: italic;color: red;font-weight: 500;" color="danger" v-if="clientId ===''" class="ion-text-wrap menu-col-12">
                                    <!-- <span class="iconify" data-icon="twemoji:warning" data-inline="false" style="margin: 5px 0 0 15px; width: 18px;height: 18px;"></span> -->
                                    <span class="iconify" data-icon="el:error-alt" data-inline="false" style="color: red; margin: 5px 0 0 15px; width: 18px;height: 18px;"></span>
                                    {{$t('frontend.home.clientRequired')}}</p>
                            </ion-label>   

                             

                              <ion-item  v-if="staffName !=''" style="width: 100%">                    
                                <ion-label position="floating">{{$t('frontend.orderType.worker')}} </ion-label>                                                                                                                                
                                <ion-input :value="staffName" readonly                                 
                                 ></ion-input>
                              </ion-item>

                               <ion-item  v-if="clientId !=''" style="width: 100%">                    
                                <ion-label position="floating">{{$t('frontend.orderType.name')}} <strong style="color: red">*</strong></ion-label>                                                                                                                                
                                <ion-input :value="CustomerName" :readonly="clientId !=''" 
                                  @input="CustomerName = $event.target.value" 
                                  ></ion-input>
                              </ion-item>

                              <ion-item  v-if="clientId !=''" style="width: 100%">                    
                                <ion-label position="floating">{{$t('frontend.orderType.email')}} 
                                  <strong v-if="order.OrderType !=='On Table' || staffName ===''" style="color: red">*</strong></ion-label>                                                                                                                                
                                <ion-input :value="email" :readonly="clientId !=''" 
                                @input="email = $event.target.value" 
                                @change="validateEmail()"
                                ></ion-input>
                              </ion-item>

                               <ion-item  v-if="clientId !=''" style="width: 100%">                    
                                <ion-label position="floating">{{$t('frontend.orderType.phone')}} 
                                  <strong v-if="order.OrderType !=='On Table' || staffName ===''" style="color: red">*</strong></ion-label>                                                                                                                                
                               <ion-input :value="phone" :readonly="clientId !=''" 
                                @input="phone = $event.target.value" 
                                @change="validatePhone($event.target.value)" 
                                ></ion-input>
                              </ion-item>
                           
         
                        </ion-card>


                             
                        <ion-card> 

                            <ion-label>
                                <h2 class="titles-order" style="float: left;">Datos del evento: </h2>
                            </ion-label>  

                            <ion-item style="width: 100%;">
                                <ion-label position="floating"> {{$t('frontend.order.eventName')}}</ion-label> 
                                 <ion-input type="text" :value="eventName" @input="order.EventName = $event.target.value"  style=" float: left;text-align: left;"></ion-input>   
                            </ion-item> 
                            

                            <ion-item style="width: 100%;">
                                <ion-label position="floating"> {{$t('frontend.home.eventType')}}</ion-label> 
                                <ion-select interface="popover" icon="add" style="text-align: left; float: none;    max-width: 100%;"
                                    class="subtitles-order"
                                    v-if="configuration.cateringEvents.length > 0"
                                    :ok-text="$t('backoffice.form.messages.buttons.ok')"
                                    :cancel-text="$t('backoffice.form.messages.buttons.dismiss')" 
                                    :placeholder="$t('frontend.home.eventType')" 
                                    :value="event"                           
                                    @ionChange="event = $event.target.value" >
                                        <ion-select-option v-for="eve in configuration.cateringEvents"                    
                                                :key="eve" 
                                                :value="eve" > {{eve}}
                                        </ion-select-option>
                                        <!-- <ion-select-option value="other" >
                                                <ion-label >{{$t('frontend.order.other')}}</ion-label>                                           
                                        </ion-select-option> -->
                                </ion-select>                                    
                                <ion-input  type="text" 
                                    v-if="event !=='' && (configuration.cateringEvents.findIndex(t => (t) === (event)) === -1)"
                                    style="text-align:center; border: 1px solid grey;"                                             
                                    @change="event = $event.target.value " 
                                    :value="event"                          
                                ></ion-input> 
                            </ion-item> 

                            <ion-item style="width: 100%;">
                                <ion-label position="floating"> {{$t('frontend.order.guessNumber')}}</ion-label> 
                                <ion-input type="number" :value="numberOfGuess" @input="numberOfGuess = $event.target.value"  style=" float: left;text-align: left;"></ion-input>                               
                            </ion-item> 
                            
                              <ion-item style="width: 100%;">
                                <ion-label position="floating">  {{$t('frontend.order.eventDate')}} </ion-label> 
                                <ion-input type="date" :value="eventDate" @input="eventDate = $event.target.value"  style=" float: left;text-align: left;"></ion-input>                               
                            </ion-item> 

                            <ion-item style="width: 100%;">
                                <ion-label position="floating">{{$t('frontend.order.eventStartHour')}} </ion-label> 
                                <ion-datetime :value="eventTimeStart" @ionChange="eventTimeStart = $event.target.value"   display-format="h:mm A"  style=" float: left;text-align: left;"></ion-datetime>                               
                            </ion-item> 

                              <ion-item style="width: 100%;">
                                    <ion-label position="floating"> {{$t('frontend.order.eventEndHour')}} </ion-label> 
                                <ion-datetime :value="eventTimeEnd" @ionChange="eventTimeEnd = $event.target.value" display-format="h:mm A"   style=" float: left;text-align: left;"></ion-datetime>                               
                            </ion-item>                        
                            
                        </ion-card>

                        <ion-card :key="keyOrderType">    

                            <ion-label class="ion-text-wrap menu-col-12" style="display: inline-block;">
                                <h2 class="titles-order" style="float: left;">{{$t('frontend.order.orderType')}}: <span v-if="!order.OrderType" style="color: red;"> * </span></h2>                            
                                <ion-select 
                                    interface="popover"
                                    icon="add"   
                                    style="text-align: left; float: left; display: inline-flex;"                                                           
                                    :ok-text="$t('backoffice.form.messages.buttons.ok')"
                                    :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
                                    :value="allTypeOrder[order.OrderType]"   
                                    :placeholder="$t('frontend.app.selectOrder')"                            
                                    @ionChange="allTypeOrder[$event.target.value], changeOrderType($event.target.value)" >
                                        <ion-select-option :value="allTypeOrder['Delivery']"> {{allTypeOrder['Delivery']}} </ion-select-option>
                                        <ion-select-option :value="allTypeOrder['PickUp']"> {{allTypeOrder['PickUp']}} </ion-select-option>
                                </ion-select> 
                            </ion-label>         
                            
                          

                            <div  v-if="order.OrderType==='PickUp' || isPick"  @click="showPickUp()">
                                <ion-item >
                                    <ion-label position="floating">{{$t('frontend.order.dateToPickEstimated') }}<strong style="color: red">*</strong> </ion-label> 
                                    <ion-datetime  :value="dateEstimateToPick"  readonly="true" style="padding: 0;"></ion-datetime>
                                </ion-item> 
                                 <ion-item >
                                     <ion-label position="floating">{{$t('frontend.order.hourToPickEstimated') }}<strong style="color: red">*</strong> </ion-label> 
                                         <ion-datetime display-format="h:mm A" picker-format="h:mm A" :value="hourEstimateToPick"  readonly="true" style="padding: 0;"></ion-datetime>
                                </ion-item> 
                            </div>

                            <div v-if="order.OrderType ==='Delivery' || isDelivery" @click="showDeliver()">
                                <ion-item >
                                     <ion-label position="floating">{{$t('frontend.order.dateToPickEstimated') }}<strong style="color: red">*</strong> </ion-label> 
                                     <ion-datetime  :value="dateEstimateToPick"  readonly="true" style="padding: 0;"></ion-datetime>
                                </ion-item> 
                                 <ion-item >
                                     <ion-label position="floating">{{$t('frontend.order.hourToPickEstimated') }}<strong style="color: red">*</strong> </ion-label> 
                                    <ion-datetime display-format="h:mm A" picker-format="h:mm A" :value="hourEstimateToPick"  readonly="true" style="padding: 0;"></ion-datetime>
                                </ion-item> 
                                <ion-item >
                                    <ion-label position="floating">{{$t('frontend.home.address') }}<strong style="color: red">*</strong> </ion-label> 
                                    <ion-input :value="addres1" readonly ></ion-input>
                                </ion-item> 
                                <ion-item >
                                       <ion-label position="floating">{{$t('frontend.home.address') }} 2<strong style="color: red">*</strong> </ion-label> 
                                    <ion-input :value="addres2" readonly ></ion-input>     
                                 </ion-item> 
                                <ion-item >
                                       <ion-label position="floating">ZipCode<strong style="color: red">*</strong> </ion-label> 
                                    <ion-input :value="zipCodeFlag" readonly ></ion-input>   
                                </ion-item>
                            </div>


                        </ion-card>
                                

                        <ion-card >

                            <ion-label class="ion-text-wrap">
                                <h2 class="titles-order" style="width: 50%;float: left;">{{$t('frontend.order.products')}}</h2>
                                <ion-button fill="outline"  style="float: right; margin-right: 10px;" @click="addProductsToCart" v-tooltip="$t('frontend.tooltips.addOrder')"> + </ion-button>
                            </ion-label>

                            <!-- <ion-item-sliding>
                                <ion-item > -->
                                    <!-- <ion-label class="ion-text-wrap menu-col-6"><h2 style="font-size: 16px;font-weight: bold;">{{$t('frontend.order.name')}}</h2> </ion-label> -->
                                    <!-- <span class="ion-text-wrap menu-col-3 grey--text">{{$t('frontend.order.price')}}</span>
                                    <ion-label class="ion-text-wrap menu-col-3"> <h3  style="font-size: 16px;font-weight: bold;text-align:center">{{$t('frontend.order.cant')}}</h3></ion-label>
                                    <ion-label class="ion-text-wrap menu-col-3"><h3  style="font-size: 16px;font-weight: bold;text-align:center">{{$t('frontend.order.total')}}</h3></ion-label>
                                    <ion-label class="ion-text-wrap menu-col-3"></ion-label>
                                </ion-item>
                            </ion-item-sliding> -->
                            <ion-item-sliding v-for="(product, index) in cart" v-bind:key="index" style="    padding: 20px 0;">
                                <!-- <ion-item> -->
                                    <div class="ion-text-wrap menu-col-12" style="text-align: left" >
                                        <ion-label> <span style="font-size: 17px;color: black;">{{product.Name }}</span>
                                        <p>
                                            <ion-input  :value="product.Note" :placeholder="$t('frontend.order.notes')"
                                            @input="product.Note=$event.target.value"
                                            style="margin-left: 20px;height: 25px;"></ion-input> 
                                        </p>                                       
                                        </ion-label>
                                    </div>   
                                <!-- </ion-item> -->

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
                                       <p >{{agg.Name}} <br> {{getFormatPrice(agg.SalePrice)}}  </p>
                                    </div>
                            
                                    <div class="menu-col-3">     
                                        <ion-input type="number" min=1 :value="agg.Cant" @input="agg.Cant=$event.target.value" style="text-align: center;width: 60%;float: left;" >
                                        </ion-input>  
                                        <ion-icon name="refresh" color="blue" size="large" style="margin-top: 0px;width: 24px;" @click="agg.Cant=addAgregate(index, index1, agg.Cant)" v-tooltip="$t('frontend.tooltips.refreshOrder')" > </ion-icon>   
                                    </div>
                                    
                                    <div class="menu-col-3" :key="key" style="text-align: center;" >                        
                                        <p v-if="product.CantAggr - agg.Cant >= 0" style="text-align: center; margin-top: 10px;">{{ getFormatPrice(0) }}<span style="opacity:0">{{product.CantAggr = product.CantAggr - agg.Cant}}</span></p> 
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
                                <ion-item style="font-size: 16px;font-weight: bold;">
                                    <!-- <ion-label class="menu-col-3"></ion-label> -->
                                    <!-- <ion-label :class="scope.isSmall? '' : 'menu-col-3'"></ion-label> -->
                                    <ion-label class="menu-col-6"><div class="menu-bold-title"  style="text-align: right;">{{$t('frontend.order.subtotal')}}</div></ion-label>
                                    <ion-label class="menu-col-6" style="text-align: right;" :key="key" > {{getFormatPrice(finalSubTotal())}}</ion-label>  
                                                      
                                </ion-item>
                                <ion-item style="font-size: 16px;font-weight: bold;"> 
                                    <!-- <ion-label class="menu-col-3"> </ion-label> -->
                                     <!-- <ion-label :class="scope.isSmall ||  scope.noMatch? '' : 'menu-col-4'"></ion-label> -->
                                    <ion-label  class="menu-col-6"><div class="menu-bold-title"  style="text-align: right;" > {{$t('frontend.order.taxe')}} {{parseFloat(taxes).toFixed(2)}} % </div></ion-label>
                                    <ion-label  class="menu-col-6"  style="text-align: right;" > {{ getFormatPrice(taxes * finalSubTotal() / 100)}}</ion-label> 
                                </ion-item>
                                

                                <ion-item style="font-size: 16px;font-weight: bold;">                                   
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

                                    <div class="menu-col-6"  style="text-align:right">

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

                              
                                <ion-item style="    color: red;    font-size: 16px;    font-weight: bold;    text-transform: uppercase;"> 
                                    <!-- <ion-label class="menu-col-3"> </ion-label>
                                    <ion-label class="menu-col-3"> </ion-label> -->
                                    <ion-label class="menu-col-6"  ><div class="menu-bold-title" style="color:red; text-align: right"> {{$t('frontend.order.total')}}  </div></ion-label>
                                    <ion-label class="menu-col-6"><div class="menu-bold-title" style=" color:red; text-align: right"> {{ getFormatPrice(finalTotal())}}  </div></ion-label>                    
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

                        <ion-card style="padding: 0 10px" v-if="configuration.payForQuotation && configuration.percentPayForQuotation > 0">
                            
                            <ion-label class="ion-text-wrap" >
                                    <h2 class="titles-order">{{$t('frontend.order.quotationMessage1')  + getFormatPrice(configuration.percentPayForQuotation) +' ' + $t('frontend.order.quotationMessage2')}}  </h2> 
                            </ion-label>

                             <ion-item >
                                <p style=" float: left;text-align: left;padding: 0; color: red" class="subtitles-order menu-col-4">{{$t('frontend.order.pay')}}: {{getFormatPrice(quotation())}}                                    
                                </p> 
                            </ion-item>
                                            
                        </ion-card>
                        
                        <ion-label v-if="order.OrderType=='Delivery' && configuration.minAmountCateringDelivery > 0 && configuration.minAmountCateringDelivery > total" class="menu-col-12 catering-amount" >{{$t('frontend.orderType.minAmountDelivery') +' '+  getFormatPrice(configuration.minAmountCateringDelivery)}}</ion-label>
                        <ion-label v-if="order.OrderType=='PickUp' && configuration.minAmoutCatering > 0 && configuration.minAmoutCatering > total" class="menu-col-12 catering-amount">{{ $t('frontend.orderType.minAmountPickUp') + ' ' + getFormatPrice(configuration.minAmoutCatering)  }}</ion-label>
                                           
                        <div style="padding: 20px 0; text-align: center">
                            
                            <ion-button  fill="outline" @click="goHome">{{$t('frontend.home.cancel')}}</ion-button>
                            <ion-button  fill="outline" 
                              v-if="order.OrderType=='Delivery'"
                              @click="sendOrder"
                              :disabled="configuration.minAmountCateringDelivery > 0 && configuration.minAmountCateringDelivery > total"
                               >{{$t('frontend.order.sendRequest')}}
                            </ion-button>
                             <ion-button  fill="outline" 
                              v-if="order.OrderType=='PickUp'"
                              @click="sendOrder"
                              :disabled=" configuration.minAmoutCatering > 0 && configuration.minAmoutCatering > total"
                               >{{$t('frontend.order.sendRequest')}}
                            </ion-button>

                             <ion-button  fill="outline"  v-if="!order.OrderType"                              
                              @click="sendOrder"
                              :disabled="!order.OrderType? true : false"
                               >{{$t('frontend.order.sendRequest')}}
                            </ion-button>

                        </div>

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
 import Moment from 'moment'
 import orderType from '../components/selectOrderType'

//import {moment} from 'moment'


export default {
   name: 'product',
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
        this.tip = this.configuration.tips[0];

       EventBus.$on('updateCustomer', (value) => {if(value) this.customerUpdated(); });
       EventBus.$on('updateCart', (value) => { if(value) this.cart = this.$store.state.cart; });

             
       this.dateToDay = moment.tz(moment.tz.guess()).format('MM-DD-YYYY');
    
      this.dateToDay = moment( this.dateToDay, "MM-DD-YYYY").add('days', this.configuration.cateringMarginDays);

       if(this.$route.params.backButton === true)
        this.buttonBack = this.$route.params.backButton; 
       else
        this.buttonBack = false; 

        if(this.$route.params.shippingName)
            this.shippingName = this.$route.params.shippingName; 

         if(this.$route.params.shipping)
            this.shipping = this.$route.params.shipping; 
  
      this.spinner = true;
              
      this.getOrderInfo();
      this.getOtherCharges();
   

    this.spinner = false;

    if(this.order.addres1)
        this.addres1 = this.order.addres1;
     if(this.order.addres2)
        this.addres2 = this.order.addres2;
     if(this.order.zipCode)
        this.zipCodeFlag = this.order.zipCode;
    if(this.order.HourToPick)
        this.hourEstimateToPick = moment.tz(this.order.HourToPick, moment.tz.guess()).format('HH:mm');
    if(this.order.DateToPick)
        this.dateEstimateToPick = moment.tz(this.order.DateToPick, moment.tz.guess()).format('MM-DD-YYYY')
    if(this.order.CateringEvent)
        this.event = this.order.CateringEvent;
    if(this.order.NumberOfGuess)
        this.numberOfGuess = this.order.NumberOfGuess;
    if(this.order.EventName)
       this.eventName = this.order.EventName;
    if(this.order.EventDate)  
        this.eventDate =  moment.tz(this.order.EventDate, moment.tz.guess()).format('MM-DD-YYYY')
    if(this.order.EventTimeStart)
        this.eventTimeStart =  moment.tz(this.order.EventTimeStart, moment.tz.guess()).format('hh:mm A');
    if(this.order.EventTimeEnd)
        this.eventTimeEnd =  moment.tz(this.order.EventTimeEnd , moment.tz.guess()).format('hh:mm A');

      
   },
   props: {        
    taxesName: {type: String, default:"" } ,
    taxes: {type: Number, default:1 } ,
    restaurantSelectedId: {type: String, default:"" } ,
    staffName: {type: String, default: "" } , 
    staffId: {type: String, default: "" } , 
     
  },
   data () {
    return {
        barcode:'',        
        modelName: 'Order',      
        tip: 0,
        products: [],
        note:'',
        orderInfo:"",
        otherCharges:[],
        spinner: false ,  
        spinnerCharge: false,    
        dateTodaymin: new Date().toISOString().substr(0, 7),
        dateTodaymax:  new Date().getFullYear(),      
        date: moment.tz(moment.tz.guess()).format('MM/DD/YYYY HH:mm:ss'),
        dateToDay: '',
        cardNumber:'',
        cardCode: '',
        expirationCard:'',
        zipCode: '',
        address:'',
        allTypeOrder:{'Delivery':this.$t('frontend.app.deliver'), 'PickUp':this.$t('frontend.app.pickup'), 'On Table':this.$t('frontend.app.table') },
        key: 0,
        buttonBack: false,
        shippingName: '' ,
        shipping: 0 ,
        state: '',
        city:'',
        zipCodeFlag: '',
        addres1: '',
        addres2: '',
        hourEstimateToPick:'',
        dateEstimateToPick: this.dateToDay,
        keyOrderType: 0,
        isDelivery: false,
        isPick: false,
        event:'',
        numberOfGuess: 0,
        eventName: '',
        eventDate: '',
        eventTimeStart: '',
        eventTimeEnd: '',
        key1:0,
        key2:0,
        clientId: '',
        CustomerName: '', 
        email: '', 
        phone: '', 
        order: {},
        cart: [], 
        configuration: {},
        restaurantActive: {}

      
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
        //   t  = parseFloat(this.finalSubTotal()) + parseFloat(percent) + parseFloat(this.shipping) + parseFloat(tipPercent); 
          t  = parseFloat(this.finalSubTotal()) + parseFloat(percent) +  parseFloat(tipPercent); 
        else
          t  = parseFloat(this.finalSubTotal()) + parseFloat(percent)  +  parseFloat(tipPercent);
        return t.toFixed(2);
      }
  },
   components:{
    VBreakpoint: VBreakpoint
  }, 
   methods: {

    finalTotal(){
         let percent = ( (this.finalSubTotal() * this.taxes) / 100) ;  
        let tipPercent = ( (this.finalSubTotal() * this.tip) / 100) ;
         var t = 1    
        if(this.order.OrderType=='Delivery')  
        //   t  = parseFloat(this.finalSubTotal()) + parseFloat(percent) + parseFloat(this.shipping) + parseFloat(tipPercent); 
          t  = parseFloat(this.finalSubTotal()) + parseFloat(percent) +  parseFloat(tipPercent); 
        else
          t  = parseFloat(this.finalSubTotal()) + parseFloat(percent)  +  parseFloat(tipPercent);
        return t.toFixed(2);
      } ,  

    finalSubTotal(){
        let total = 0;
        this.cart.forEach(car => total += parseFloat( this.getSemiTotal(parseInt(car.AggregatesCant),  parseInt(car.Cant), parseFloat(car.Price), car.Aggregates) ))
        for (const obj of this.otherCharges){
            total += obj.Price ;
        }
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

    quotation(){
        let quo = 0;
        if(this.configuration.percentPayForQuotation > 0 && this.configuration.payForQuotation ){
          quo = this.configuration.percentPayForQuotation;
        }
        return quo.toFixed(2);

    },
    
    addAgregate(index, index1, cant){
        if(cant < 1)
          return this.deleteToAgg(index, index1)
        else{        
          this.cart[index].Aggregates[index1].Cant = parseInt(cant); 
          this.$store.commit('setCart', this.cart );
          this.openToastProd();            
        } 
        this.key++;
        return cant;
    },

    deleteToAgg(index, index1){
        let obj = this.cart[index];
        obj.Aggregates.splice(index1, 1);
        this.openToastProd(); 
        this.$store.commit('setCart', this.cart );
    },

    sendOrder: async function(){
      
        if(!this.clientId)
          return this.alertRequiredClientId();
          
        if(this.CustomerName ==='' || this.email === '' || this.phone === '' ||
        !this.order.HourToPick || !this.order.DateToPick)
            return this.alertRequiredDatas();

        let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
            if (emailRegex.test(this.email) == false)
                return this.alertEmailNotValid();
 
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
            this.order.Total = this.total;
        if(this.subTotal !='')
            this.order.SubTotal = this.subTotal;
        if(this.taxes !='')
            this.order.Taxe = this.taxes.toFixed(2);
        if(this.event !='')
            this.order.CateringEvent = this.event;  
        if(this.numberOfGuess > 0)
            this.order.NumberOfGuess = this.numberOfGuess;
        if(this.eventName !== '')
            this.order.EventName = this.eventName;
        if(this.eventDate !== '')
            this.order.EventDate =  Moment(this.eventDate).toISOString();
        if(this.eventTimeStart !== '')
            this.order.EventTimeStart = Moment(this.eventTimeStart).toISOString();
        if(this.eventTimeEnd !== '')
            this.order.EventTimeEnd =  Moment(this.eventTimeEnd).toISOString();            
        this.order.ClientId = this.clientId;
        this.order.CustomerName = this.CustomerName;
        this.order.CustomerEmail = this.email;
        this.order.CustomerPhone = this.phone;
        this.order.Tip = this.tip;       
        this.order.State = 7;  
        this.order.OrderForCatering = true;  
         

       
        if(this.configuration.payForQuotation && this.configuration.percentPayForQuotation > 0){
          return this.openPayment();
        }
        else{
              try{
                this.spinner = true
                const response1 = await Api.postIn(this.modelName, this.order);       
                if(response1.status === 200 && response1.statusText === "OK"){   
                    this.cart = [];
                    this.order = {}                 
                    this.$store.commit('setCart', [] );
                    this.$store.commit('setOrder', {}); 
                    await this.getOrders();
                    this.goodPaymentToast();  
                    this.spinner = false;                                          
                    return this.$router.push({ name: 'ListOrder'})                                                                             
                }            
            } 
            catch (err) { 
                this.spinner = false;    
                return this.errorPaymentDetail(err);
            } 
        }           
       
    },

    async openPayment(){
                return this.$ionic.modalController
            .create({
                component: PaymentModal,
                cssClass: 'my-custom-class',               
                componentProps: {
                data: {
                    content: 'New Content',
                },
                propsData: { 
                order: this.order,
                parent: this,
                Acept: this.$t('frontend.home.acept'),
                Cancel: this.$t('frontend.home.cancel'), 
                Total: this.quotation(),
                Tax:  "0",
                TaxName: '',     
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
                payText: this.$t('frontend.order.pay'), 
                verifyText: this.$t('frontend.order.verify'),
                returnTo: 'OrderCatering',                      
              },
                },
            })
            .then(m => m.present())       
        },

    recivePayment: async function(res){ 
        this.spinner = true;
            try {
               
                this.order.QuotationPayment = this.quotation(); 
                this.order.QuotationPaymentDetail = res; 
                
                const response = await Api.postIn('Order', this.order);
                if(response.status === 200 && response.statusText === "OK"){                     
                     
                    this.cart = [];
                    this.order = {}                     ;
                    this.$store.commit('setCart', [] );                        
                    this.$store.commit('setOrder', {});  
                    await this.getOrders();
                    this.goodPaymentToast();  
                    this.spinner = false;       
                    
                     const paymentEntry = {                       
                        "Method": res.method,
                        "Payment": res.total,
                        "InvoiceNumber": res.transId,
                        "ModelId": response.data._id,
                        "ModelFrom": "Catering",
                        "StaffName": this.order.StaffName                    
                   }
                   await Api.postIn('allpayments', paymentEntry);
                    
                    return this.$router.push({ name: 'ListOrder' })                                                                             
                
                }
                
            } catch (error) {            
                console.log(error)
                this.spinner = false;
            }        
        },

    sendEmail(order){
         var date = moment.tz(order.Date, moment.tz.guess()).format('MM/DD/YYYY HH:mm:ss');

        const  allStates = [this.$t('frontend.order.state0'),this.$t('frontend.order.state1'), this.$t('frontend.order.state2'),
        this.$t('frontend.order.state3'), this.$t('frontend.order.state4'), this.$t('frontend.order.state5')];

        let orderInfo = '';
        if(order.OrderType == 'Delivery')
            orderInfo = order.AddressToDeliver
        if(order.OrderType == 'PickUp')
            orderInfo = order.HourToPick
        if(order.OrderType == 'On Table')
            orderInfo = order.tableService

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
        html += `<br> <h4> ${this.$t('frontend.order.paymentMethod')}: ${order.PaymentMethod}</h4>`;
        if(order.PaymentTransId)
            html += `<h4> ${this.$t('frontend.order.transId')}: ${order.PaymentTransId} </h4>`;
        html += `<h4>${this.$t('frontend.order.date')}: ${date} </h4><hr>`;
        html += `<h4>${this.$t('frontend.order.client')}: ${order.CustomerName} </h4>`;
        html += `<h4>${this.$t('frontend.orderType.phone')}: ${order.CustomerPhone} </h4>`;      
        html += `<h4>${this.$t('frontend.order.orderFor')} ${this.allTypeOrder[order.OrderType]}: ${orderInfo} </h4>`;
        
        html += `<h4>${this.$t('frontend.order.orderState')}: ${allStates[order.State]} </h4>`;
        if(order.State == 6)
            html += `<h4>${this.$t('frontend.order.cancelReason')}: ${order.CancelNote}</h4><hr>`;    
        html += `</td></tr>`;  

        html += '<tr><td colspan=6 >'
         if(order.EventName)
            html += `<h4> ${this.$t('frontend.order.eventName')}: ${order.EventName} </h4>`;
         if(order.CateringEvent)
            html += `<h4> ${this.$t('frontend.home.eventType')}: ${order.CateringEvent} </h4>`;
        if(order.NumberOfGuess)
            html += `<h4> ${this.$t('frontend.order.guessNumber')}: ${order.NumberOfGuess} </h4>`;
        if(order.EventDate)
            html += `<h4> ${this.$t('frontend.order.eventDate')}: ${moment.tz(order.EventDate, moment.tz.guess()).format('MM-DD-YYYY')}  </h4>`;
        if(order.EventTimeStart)
            html += `<h4> ${this.$t('frontend.order.eventStartHour')}: ${moment.tz(order.EventTimeStart, moment.tz.guess()).format('hh:mm A')} </h4>`;
        if(order.EventTimeEnd)
            html += `<h4> ${this.$t('frontend.order.eventEndHour')}:  ${moment.tz(order.EventTimeEnd, moment.tz.guess()).format('hh:mm A')}  </h4>`;
        html += `</td></tr>`; 
  
    
        html += `<tr ><td colspan=6 ><h4 ><strong>${this.$t('frontend.order.products')}</strong></h4></td></tr> <tr></tr>`;
        for(var i = 0; i<order.Products.length ; i++){
            html += `<tr ><td  colspan=4 style="width: 50%;border-bottom: 1px solid #dbd1d1;" ><strong >${order.Products[i].Name}</strong>` ;
            if(order.Products[i].Note !='')
                html +=`<p style="background: #f1f1004d;">${order.Products[i].Note}</p> `;
            html +=`</td><td style="width: 25%;border-bottom: 1px solid #dbd1d1;" > <p >( ${order.Products[i].Cant} X ${this.getFormatPrice(order.Products[i].Price)})</p> </td>`;
            html += `<td style="width: 25%;border-bottom: 1px solid #dbd1d1;"> <p >${ this.getFormatPrice( order.Products[i].Price * order.Products[i].Cant )}</p> </td>`;
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
                html += ` <tr ><td colspan=5 style="width: 75%;border-bottom: 1px solid #dbd1d1;"><p >${order.OtherCharges[e].Name}</p></td> <td style="border-bottom: 1px solid #dbd1d1;"> <p>${this.getFormatPrice(order.OtherCharges[e].Price)}</p></td></tr>`;
            }
        }
        html += `<tr ><td colspan=5 ><p ><strong>${this.$t('frontend.order.subtotal')}</strong></p></td> <td > <p > ${this.getFormatPrice(order.SubTotal) }</p></td></tr>`;
        html += `<tr><td  colspan=5><p  ><strong>${this.$t('frontend.order.taxe')} ${order.Taxe}%</strong></p></td> <td > <p >${ this.getFormatPrice(order.Taxe * order.SubTotal / 100) }</p> </td></tr>`;
        if(order.OrderType == 'Delivery' && order.Shipping)
            html +=  `<tr ><td colspan=5 ><p  ><strong>${this.$t('frontend.order.deliver')}</strong></p></td><td  ><p > ${this.getFormatPrice(order.Shipping)}</p></td></tr>`;
        if(order.Tip)
            html += `<tr ><td  colspan=5 ><p ><strong>${this.$t('frontend.order.tip')}  ${order.Tip}%</strong></p></td><td ><p>${ this.getFormatPrice(order.Tip * order.SubTotal / 100) } </p> </td></tr>`;
        html += `<tr><td colspan=5 style="border-bottom: 1px solid #dbd1d1;"><p  ><strong>${this.$t('frontend.order.total')}</strong></p></td> <td style="border-bottom: 1px solid #dbd1d1;"> <strong >${this.getFormatPrice(order.Total)}</strong> </td></tr>`;
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
      Api.sendEmail(items);

   },

    getOrderInfo: function(){
        if(this.order.OrderType == 'Delivery'){
            this.orderInfo = this.order.AddressToDeliver;
            const deliveryAdress = this.orderInfo.split(' ZipCode: ');
            this.zipCode = deliveryAdress[1];        
            this.address = deliveryAdress[0];        
        }
        if(this.order.OrderType == 'PickUp')
            this.orderInfo = this.order.HourToPick;
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
       this.$store.commit('setCart', [] );
       this.$store.commit('setOrder', {});     
       return this.$router.push({ name: 'Catering', params: {cart:this.cart, order:this.order }})
    },

    removeProductFromCart: function(id){
        const element = (elem) => elem.ProductId == id;
        var index =this.cart.findIndex(element)
        this.cart.splice(index, 1)
        this.$store.commit('setCart', this.cart );
        this.getOtherCharges();
        if(this.cart.length == 0){
            return this.$router.push({ name: 'Catering', params: {cart:this.cart }  })
        }
    },
    
    addProductsToCart: function(){   
        return this.$router.push({ name: 'Catering', params: {cart: this.cart, order: this.order } })
    },

    changeOrderInfo: function(event){

        if(!event)
            return this.alertRequiredDatas();
           
        if(this.order.OrderType == 'Delivery'){
            var hills = LibCodes.lookup(this.zipCode);           
            const onlyAdress = event.split(' State: ');        
            if(onlyAdress.length > 0)
                this.order.AddressToDeliver = onlyAdress[0] +' State: '+ hills.state +' City: '+ hills.city + ' ZipCode: '+ this.zipCode
            else   
                this.order.AddressToDeliver = event +' State: '+ hills.state +' City: '+ hills.city + ' ZipCode: '+ this.zipCode 

            this.address = this.order.AddressToDeliver.split(' ZipCode: ')[0];
            event = this.order.AddressToDeliver;            
        }
        
        if(this.order.OrderType == 'PickUp')
          this.order.HourToPick = event;
        if(this.order.OrderType == 'On Table')
          this.order.tableService = event;
         
         this.orderInfo = event;            
    },

    changeHourToPick: function(event){
        this.order.HourToPick =  Moment(event).toISOString()
    },
    changeDateToPick: function(event){
        this.order.DateToPick = Moment(event).toISOString();
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

     alertRequiredClientId(){
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: 'Error',
          message: this.$t('frontend.home.clientRequired'),
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
            const zip = this.configuration.zipCodes.filter(zc => zc.ZipCode === value && zc.IsCatering === true);
            if(!zip.length >0){
                this.zipCode ='';
                return this.alertNotZoneDelever();  
            }
            else{
            this.shippingName =  "Catering Delivering" +' State: '+ hills.state +' City:'+ hills.city ;
            this.shipping = zip[0].CateringPrice;  
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


    async goodPaymentToast() {
      return this.$ionic.toastController      
        .create({
            message:  this.$t('frontend.order.requestCatering'),
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

     allOrder(){
            return this.$router.push({ name: 'ListOrder', params: {customerId: this.order.ClientId, CustomerName: this.CustomerName} })    
        },

    backToCall: function(){
    if(this.buttonBack)
        return this.allOrder();
    else
        return this.addProductsToCart() ;
    },

showDeliver () {
    this.$modal.show('catering-modal');
    },
    
  hideDeliver () {
      this.$modal.hide('catering-modal');
        },

  showPickUp(){
      this.$modal.show('pickup-modal');
   },
 
  hidePickUp () {
  this.$modal.hide('pickup-modal');
    },

  savePickUp () {
   
    if(this.hourEstimateToPick === '' || this.dateEstimateToPick === '')
        return this.alertRequiredDatas();

    this.orderType = "PickUp"
    EventBus.$emit('updateOrderType', this.orderType);
    this.hourToPick = this.hourEstimateToPick;
    this.clientHasOrderSelected = true; 
    EventBus.$emit('clientHasOrderSelected', true );     
    this.order.OrderType = "PickUp";
    this.changeOrderButton();
    this.order.HourToPick =  Moment(this.hourEstimateToPick).toISOString();
    this.order.DateToPick =  Moment(this.dateEstimateToPick).toISOString();   
    this.order.ClientId = this.clientId,  
        
    this.$store.commit('setOrder', this.order);
    this.openToast(this.allTypeOrder[this.orderType] + ': ' + this.dateEstimateToPick + ' : ' + this.hourEstimateToPick)

    this.hidePickUp();
    },

    sinPickAction() {
        this.orderType = "PickUp"
        EventBus.$emit('updateOrderType', this.orderType);
        this.hourToPick = ''
         this.clientHasOrderSelected = true; 
         EventBus.$emit('clientHasOrderSelected', true );        
        this.order.OrderType = "PickUp";
        this.changeOrderButton(); 
        this.order.HourToPick = moment.tz(this.hourToPick, moment.tz.guess()).format('hh:mm A')
        this.order.ClientId = this.clientId,    
        this.$store.commit('setOrder', this.order);
        this.showProduct = false;
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
        
    },

    saveDeliver(){
      if(this.addres1 ===''  ||this.zipCodeFlag == '' 
      || this.dateEstimateToPick ==='' || this.hourEstimateToPick === '' 
      || this.dateEstimateToPick ==='' || this.hourEstimateToPick === '')
        return this.alertRequiredDatas();

      this.orderType = "Delivery"
      EventBus.$emit('updateOrderType', this.orderType);
      this.address = this.addres1 +' '+ this.addres2 +' State: '+ this.state +' City:'+ this.city + ' ZipCode: '+ this.zipCodeFlag;
      this.clientHasOrderSelected = true;
      EventBus.$emit('clientHasOrderSelected', true );       
      this.order.OrderType = "Delivery";
      this.changeOrderButton(); 
      this.order.AddressToDeliver = this.address; 
      this.order.addres1 = this.addres1; 
      this.order.addres2 = this.addres2; 
      this.order.zipCode = this.zipCodeFlag; 
      this.order.HourToPick = Moment(this.hourEstimateToPick).toISOString()  
      this.order.DateToPick = Moment(this.dateEstimateToPick).toISOString()
      this.order.ClientId = this.clientId,  
    
      this.$store.commit('setOrder', this.order);
      
      this.openToast(this.allTypeOrder[this.orderType] + ': ' + this.address)  
      this.hideDeliver();
    },

    changeOrderButton: function(){     
       if(this.orderType === 'Delivery' && this.clientHasOrderSelected){         
        this.isDelivery = true;
        this.isPick = false;   
       }
      if(this.orderType === 'PickUp' && this.clientHasOrderSelected){
        this.isDelivery = false;
        this.isPick = true;        
       }  
       
    
    },

    ValidateState(event){
      this.state = "";
      this.city = "";
      this.zipCodeFlag = '';
    
      var hills = LibCodes.lookup(event);   

      if(!hills){
        this.alertCodeNotValid(); 
        return '';
      }  
       if(this.configuration.zipCodesExcludes.length > 0){
        const zip = this.configuration.zipCodesExcludes.findIndex(zp => zp === event);
        if(zip !== -1 ){
          this.alertNotZoneDelever();   
          return '';     
        }
       }
      if(this.configuration.cateringStates.length > 0){
        const state = this.configuration.cateringStates.findIndex(st => st === hills.state);
        if(state === -1 ){
          this.alertNotZoneDelever();   
          return '';     
        }     
      }
        this.state = hills.state;
        this.city = hills.city;
        this.zipCodeFlag = event;      
        return event;
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

      getReservationHour(thisHour){
      return  moment.tz(thisHour, moment.tz.guess()).format('hh:mm A') 
    },

  alertNotGoodHour(message){
    return  this.$ionic.alertController
    .create({
        cssClass: 'my-custom-class',
        header: 'Error',
        message: message,
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

  validateHour(){
        this.key1 ++;
        this.key2 ++;

        if(this.hourEstimateToPick === '')
          return ''
        
        var hour = Moment(this.hourEstimateToPick).toISOString();
        var day =  Moment(this.dateEstimateToPick).toISOString();
        hour = moment.tz(hour,  moment.tz.guess()).format('HH:mm') ;
        day =  moment.tz(day,  moment.tz.guess()).format('dddd') ;
       
        const index = this.restaurantActive.restaurantDaysAndTime.findIndex(re=> re.Day === day);

        if(index !== -1){
          const openHour =  moment.tz(this.restaurantActive.restaurantDaysAndTime[index].OpenHour,  moment.tz.guess()).format('HH:mm') ; 
          const closeHour =  moment.tz(this.restaurantActive.restaurantDaysAndTime[index].CloseHour,  moment.tz.guess()).format('HH:mm') ; 
          
          if( hour < openHour || hour > closeHour){
            this.hourEstimateToPick = '';
                        
            const mess = this.$t('frontend.reservation.errorHourCaterin')+ day + 
            this.$t('frontend.reservation.errorHour2') +
            this.getReservationHour(this.restaurantActive.restaurantDaysAndTime[index].OpenHour) + ' - '+ this.getReservationHour(this.restaurantActive.restaurantDaysAndTime[index].CloseHour);

            this.alertNotGoodHour(mess);
           
          } 
        }


      },

    getFormatPrice(price){
      const result = new Intl.NumberFormat('en', {style: "currency", currency: this.restaurantActive.currency} ).format(price)
      return result;
    } ,

     customerUpdated(){       
      this.clientId= this.$store.state.customer._id;
      this.CustomerName= this.$store.state.customer.Name;
      this.email= this.$store.state.customer.EmailAddress;
      this.phone=this.$store.state.customer.Phone;
      this.marketingEmail=this.$store.state.customer.MarketingConsent.Email;
      this.marketingPhone=this.$store.state.customer.MarketingConsent.Phone;
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
  }

}
</script>

<style>
    .menu-bold-title{
        font-size: 16px;font-weight: bold;text-align: left;
    }
    .catering-amount{
    font-size: 16px;
    color: red;
    font-weight: 600;
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
    font-weight: 400;
    padding: 5px;
}
</style>

