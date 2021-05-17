<template>
    <div id="product" class="product">

           <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start"  @click="allOrder()" v-if="clientId !==''">
              <ion-back-button default-href="home"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
                <h1  v-if="order.OrderForCatering"> {{$t('frontend.order.orderDetail')}} |  {{$t('frontend.menu.catering')}}</h1>            
                <h1 v-else> {{$t('frontend.order.orderDetail')}} </h1>            
            </ion-label>
           
              
          </ion-toolbar>
        </ion-header>

            <ion-label>
                 <div style="text-align: right;">
                     <ion-chip color="primary" slot="end" @click="sendReorder" v-if="clientId !==''" v-tooltip="$t('frontend.tooltips.reOrder')">
                        <span class="iconify" data-icon="mi:shopping-cart-add" data-inline="false">
                    </span></ion-chip>
                    <ion-chip color="primary" slot="end" @click="sendEmail(order)" v-if="clientId !==''" v-tooltip="$t('frontend.tooltips.forward')">
                        <span  class="iconify" data-icon="carbon:mail-all" data-inline="false"></span>
                        <ion-spinner v-if="spinnerEmail"></ion-spinner>
                        </ion-chip>
                    <ion-chip color="primary" slot="end" @click="sendPrint" v-if="clientId !==''" v-tooltip="$t('frontend.tooltips.printOrder')">
                        <span class="iconify" data-icon="ic:round-local-printshop" data-inline="false">
                    </span></ion-chip>
                 </div>
             </ion-label>

         <div v-if="spinner1">
           <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
        </div>

        <ion-label class="ion-text-wrap menu-col-12" v-if="clientId ===''">
            <p style="display: inline-block; text-align: center; font-style: italic;color: red;font-weight: 500;" color="danger" v-if="clientId ===''" class="ion-text-wrap menu-col-12">
                <span class="iconify" data-icon="el:error-alt" data-inline="false" style="color: red; margin: 5px 0 0 15px; width: 18px;height: 18px;"></span>
                {{$t('frontend.home.clientRequired')}}</p>
        </ion-label>

        <v-breakpoint v-if="!spinner1 && clientId !==''">
            <div slot-scope="scope" style="argin-top: 10px;">

                <span > 
                    <ion-card :style="scope.isSmall || scope.isMedium || scope.noMatch? '' :'width: 80%; margin: 0 auto;'">

                        <p v-if="order.StaffName"> <ion-label class="ion-text-wrap" >
                            <h2  style="width: 100%;float: left;font-size: 16px;
                            text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                            {{$t('frontend.orderType.worker')}}:<strong>  {{order.StaffName}} </strong> </h2>
                        </ion-label></p>   
                         
                       <p> <ion-label class="ion-text-wrap" >
                            <h2  style="width: 100%;float: left;font-size: 16px;
                            text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                            {{$t('frontend.order.client')}}:<strong>  {{CustomerName}} </strong> </h2>
                        </ion-label></p>
                        
                        <p v-if="order.OrderForCatering && order.State !== 7"><ion-label class="ion-text-wrap">
                            <h2  style="width: 100%;float: left;font-size: 16px;
                            text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                               {{$t('frontend.order.date')}}: <strong>  {{ dateEstimateToPick }} : {{ hourEstimateToPick }}</strong>  </h2>
                        </ion-label></p>

                        <p v-if="order.OrderForCatering && order.State === 7"><ion-label class="ion-text-wrap">
                            <h2  style="width: 100%;float: left;font-size: 16px;
                            text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                               {{$t('frontend.order.dateToPickEstimated')}}: <strong>  {{ dateEstimateToPick }} </strong>  </h2>
                        </ion-label></p>

                        <p v-if="order.OrderForCatering && order.State === 7"><ion-label class="ion-text-wrap">
                            <h2  style="width: 100%;float: left;font-size: 16px;
                            text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                               {{$t('frontend.order.hourToPickEstimated')}}: <strong> {{ hourEstimateToPick }}</strong>  </h2>
                        </ion-label></p>

                        <p v-if="!order.OrderForCatering && order.OrderType !=='PickUp'"><ion-label class="ion-text-wrap">
                            <h2  style="width: 100%;float: left;font-size: 16px;
                            text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                               {{$t('frontend.order.date')}}: <strong>  {{ date }}</strong>  </h2>
                        </ion-label></p>

                        <p v-if="!order.OrderForCatering"><ion-label class="ion-text-wrap">
                            <h2  style="width: 100%;float: left;font-size: 16px;
                            text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                                {{ allTypeOrder[order.OrderType] }}: <strong>  {{ orderInfo}} </strong>  </h2>
                        </ion-label></p>

                        <div v-if="order.Payment || order.QuotationPaymentDetail || order.PaymentMethod">
                            <ion-label class="ion-text-wrap">
                                <h2  style="width: 100%;float: left;font-size: 16px;
                                text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                                    {{$t('frontend.order.payment')}}:  </h2>
                            </ion-label>

                            <div v-if="order.QuotationPaymentDetail">
                                <h2 v-if="order.QuotationPaymentDetail" style="width: 100%;float: left;font-size: 16px;
                                text-align: left; padding-left: 40px;color: black;margin: 5px !important;">
                                    {{$t('frontend.order.total')}}: <strong>  {{ getFormatPrice(order.QuotationPaymentDetail.total)}} </strong>  |
                                    {{$t('frontend.order.transId')}}: <strong>  {{ order.QuotationPaymentDetail.transId}} </strong>  |
                                    {{$t('frontend.order.paymentMethod')}}: <strong>  {{ order.QuotationPaymentDetail.method}} -  {{ order.QuotationPaymentDetail.accountNumber}}</strong>  </h2>

                            </div>
                             <div v-if="order.Payment">
                                <p v-for="(payment, Index) of order.Payment" v-bind:key="Index"><ion-label class="ion-text-wrap">
                                    <h2 v-if="payment.paymentInfo" style="width: 100%;float: left;font-size: 16px;
                                    text-align: left; padding-left: 40px;color: black;margin: 5px !important;">
                                        {{$t('frontend.order.total')}}: <strong>  {{ getFormatPrice(payment.total)}} </strong>  |
                                        {{$t('frontend.order.transId')}}: <strong>  {{ payment.paymentInfo.transId}} </strong>  |
                                        {{$t('frontend.order.paymentMethod')}}: <strong>  {{ payment.PaymentMethod}} </strong>  </h2>
                                </ion-label></p>
                            </div>
                            <div v-if="order.PaymentMethod">
                                <p ><ion-label class="ion-text-wrap">                               
                                    <h2  style="width: 100%;float: left;font-size: 16px;
                                        text-align: left; padding-left: 40px;color: black;margin: 5px !important;">
                                        {{$t('frontend.order.total')}}: <strong>  {{ getFormatPrice(order.AmountCheckPayment)}} </strong>  |                                
                                        {{$t('frontend.order.paymentMethod')}}: <strong>  {{ order.PaymentMethod}} </strong>  </h2>
                                </ion-label></p>
                            </div>

                        </div>
                       

                        <div v-if="order.OrderType ==='Curbside'" style="margin: 25px; 0px" :key="keyCurbside">
                            <ion-item-divider />
                            
                            <ion-item class="ion-text-wrap">
                                <h2 class="titles-order" style="float: left;">{{$t('frontend.home.curbsideDetail')}}</h2>
                                <ion-button 
                                v-if="order.State !=5 && !order.CarArrived"
                                fill="outline"  
                                style="float: left; margin-right: 10px;" 
                                @click="updateCurbsideOrder()" 
                                v-tooltip="$t('frontend.tooltips.editTicket')"> 
                                   <ion-spinner v-if="spinnerUpdateCurbside" name="lines"  ></ion-spinner>
                                   <span class="iconify" v-if="!spinnerUpdateCurbside" data-icon="ant-design:edit-filled" data-inline="false" style="width: 20px;height: 20px; margin: 0;"></span>                                    
                                </ion-button>                               
                            </ion-item>                    
                             <ion-item>
                                <ion-label position="floating">{{$t('frontend.orderType.licencePlate') }}<strong style="color: red">*</strong></ion-label>
                                <ion-input 
                                :readonly="order.State ===5 || order.CarArrived? true : false"
                                :value="order.LicencePlate" 
                                @input="licencePlate = $event.target.value"></ion-input>
                            </ion-item>
                            <ion-item>
                                <ion-label position="floating">{{$t('frontend.orderType.vehicleModel') }}<strong style="color: red">*</strong></ion-label>
                                <ion-input
                                :readonly="order.State ===5 || order.CarArrived? true : false"
                                :value="order.VehicleModel"
                                @input="vehicleModel = $event.target.value"></ion-input>
                            </ion-item>
                            <ion-item>
                                <ion-label position="floating">{{$t('frontend.orderType.vehicleColor') }}<strong style="color: red">*</strong></ion-label>
                                <ion-input 
                                :readonly="order.State ===5 || order.CarArrived? true : false"
                                :value="order.VehicleColor" 
                                @input="vehicleColor = $event.target.value"></ion-input>
                            </ion-item>
                             <ion-item v-if="order.State !==5 && !order.CarArrived" :key="keyCarArrived">
                                <ion-label style="display: contents;">{{$t('frontend.tooltips.getToRestaurant') }}</ion-label>
                                 <ion-button fill="outline"  style="float: left; margin: 15px;" @click="carArrived()" > 
                                    <ion-spinner v-if="spinnerCarArrived" name="lines"  ></ion-spinner>
                                    <span class="iconify" v-if="!spinnerCarArrived" data-icon="clarity:car-solid" data-inline="false" style="width: 20px;height: 20px; margin: 0;"></span>
                                </ion-button>
                            </ion-item>
                            <ion-item v-if="order.CarArrived && !spinnerCarArrived && order.State !==5" :key="keyCarArrived+1">
                                <ion-label style="display: contents;">{{$t('frontend.tooltips.carInRestaurant') }}</ion-label>     
                                <span class="iconify" data-icon="clarity:car-solid" data-inline="false" style="width: 20px;height: 20px; float: left; margin: 15px;color: #48bc76;"></span>                               
                            </ion-item>
                            
                        </div>

                                                                                                   
                        <ion-item-divider v-else style="margin-bottom: 15px;"/>

                        <div v-if="order.OrderForCatering">

                            <ion-label class="ion-text-wrap"  v-if="order.EventName">
                                <h2  style="width: 100%;float: left;font-size: 16px;
                                text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                                {{$t('frontend.order.eventName')}}: <strong> {{order.EventName}} </strong> </h2>
                             </ion-label>
                             <ion-label class="ion-text-wrap"  v-if="order.CateringEvent">
                                <h2  style="width: 100%;float: left;font-size: 16px;
                                text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                                {{$t('frontend.home.eventType')}}: <strong> {{order.CateringEvent}} </strong> </h2>
                             </ion-label>
                             <ion-label class="ion-text-wrap"  v-if="order.NumberOfGuess">
                                <h2  style="width: 100%;float: left;font-size: 16px;
                                text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                                {{$t('frontend.order.guessNumber')}}: <strong> {{order.NumberOfGuess}} </strong> </h2>
                             </ion-label>
                              <ion-label class="ion-text-wrap"  v-if="order.EventDate">
                                <h2  style="width: 100%;float: left;font-size: 16px;
                                text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                                {{$t('frontend.order.eventDate')}}: <strong> {{order.EventDate}} </strong> </h2>
                             </ion-label>
                             <ion-label class="ion-text-wrap"  v-if="order.EventTimeStart">
                                <h2  style="width: 100%;float: left;font-size: 16px;
                                text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                                {{$t('frontend.order.eventStartHour')}}: <strong> {{order.EventTimeStart}} </strong> </h2>
                             </ion-label>
                             <ion-label class="ion-text-wrap"  v-if="order.EventTimeEnd">
                                <h2  style="width: 100%;float: left;font-size: 16px;
                                text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                                {{$t('frontend.order.eventEndHour')}}: <strong> {{order.EventTimeEnd}} </strong> </h2>
                             </ion-label>
                            <ion-item-divider style="margin-bottom: 15px;"/>
                        </div>


                        <ion-label class="ion-text-wrap"  v-if="showCooker && cooker!=''">
                            <h2  style="width: 100%;float: left;font-size: 16px;
                            text-align: left; padding-left: 20px;color: black;margin: 5px !important;">
                            {{$t('frontend.order.cooker')}}: <strong> {{cooker}} </strong> </h2>
                        </ion-label>

                        <ion-label class="ion-text-wrap col-md-12">                      
                            <strong  class="state-menu" :style="order.State===6 ? 'padding: 10px;background:rgb(255 0 0 / 43%)' : ''">
                                {{$t('frontend.order.orderState')}}: {{valEstate}}
                                <span>
                                    <ion-icon v-if="order.OrderType ==='Delivery' && !spinner && showStates<5" name="refresh" @click="chargeOrder" color="success" size="large" style="top: 10px;position: relative;" v-tooltip="$t('frontend.tooltips.refreshOrder')"> </ion-icon>  
                                    <ion-icon v-if="order.OrderType !=='Delivery' && !spinner && showStates < 4" name="refresh" @click="chargeOrder" color="success" size="large" style="top: 10px;position: relative;" v-tooltip="$t('frontend.tooltips.refreshOrder')"> </ion-icon>  
                                    <ion-icon v-if="!spinner && showStates === 7" name="refresh" @click="chargeOrder" color="success" size="large" style="top: 10px;position: relative;" v-tooltip="$t('frontend.tooltips.refreshOrder')"> </ion-icon>  
                                    <span v-if="!spinner && showStates !==8 && showStates !==6 && showStates !==5" style="font-size: 9px; display: contents;" color="success">{{$t('frontend.menu.refresh')}}</span>   
                                </span>                               
                               <ion-spinner v-if="spinner" name="lines"  color="success" style="top: 10px;position: relative;"></ion-spinner>                           
                            </strong>                               
                        </ion-label>

                       <br>

                        <ion-label class="ion-text-wrap" v-if="showStates ===6 && order.CancelNote">                      
                            <strong  class="state-menu" :style="order.State===6 ? 'padding: 10px;background:rgb(255 0 0 / 43%)' : ''">
                                {{$t('frontend.order.cancelReason')}}: {{order.CancelNote}}
                       </strong> 
                        </ion-label>


                        <ion-range v-if="order.OrderType == 'Delivery' && showStates < 6 "
                        min="1" max="5" step="1" snaps="true" :key="key"
                         color="secondary" :value="showStates" pin="true" ticks="true"                    
                        @ionChange="valueEstate($event.target.value)">
                            <ion-label slot="start" ></ion-label>
                             <ion-chip slot="end" color="secondary">
                                <ion-label>{{currentState || valEstate}}</ion-label>
                            </ion-chip>
                        </ion-range>

                        <ion-range
                         v-if="order.OrderType != 'Delivery' && showStates < 5 "
                         :key="key"
                            min="1" 
                            max="4"
                            step="1" 
                            snaps="true" 
                            style="padding-top: 8px;"
                            color="secondary" 
                            :value="showStates" 
                            pin="true"
                            ticks="true"                    
                            @ionChange="valueEstate($event.target.value)">
                            <ion-label slot="start" ></ion-label>
                             <ion-chip slot="end" color="secondary">
                                <ion-label>{{currentState || valEstate}}</ion-label>
                            </ion-chip>
                        </ion-range>

                        <Localization  
                           v-if="order.OrderType == 'Delivery' && showStates ===4 && order.IsAccept && configuration.CanViewGeolocation"                          
                            :orderProps="order" 
                            :funProps="'read'"
                            style="padding: 0 10px;"
                        ></Localization>
                          
                        <ion-item-divider/>        

                        <ion-list>
                            <ion-label class="ion-text-wrap">
                                <h2 class="titles-order" style="width: 50%;float: left;">{{$t('frontend.order.products')}}</h2>
                            </ion-label>
                            <ion-item-sliding>
                                <ion-item >
                                    <ion-label class="ion-text-wrap menu-col-4 elipsis-menu"><h2 style="font-size: 16px;font-weight: bold;">{{$t('frontend.order.name')}}</h2> </ion-label>
                                    <ion-label class="ion-text-wrap menu-col-2 elipsis-menu"> <h3  style="font-size: 16px;font-weight: bold;">{{$t('frontend.order.cant')}}</h3></ion-label>
                                    <ion-label class="ion-text-wrap menu-col-3 elipsis-menu"><h3  style="font-size: 16px;font-weight: bold;">{{$t('frontend.order.price')}}</h3></ion-label>
                                    <ion-label class="ion-text-wrap menu-col-3 elipsis-menu"><h3  style="font-size: 16px;font-weight: bold;">{{$t('frontend.order.total')}}</h3></ion-label>
                                </ion-item>
                            </ion-item-sliding>
                            <ion-item-sliding v-for="product in order.Products" v-bind:key="product.ProductId">

                                <ion-item>
                                    <div class="ion-text-wrap menu-col-4" >
                                        <p> <strong>{{ product.Name }}</strong></p>
                                        <p v-if="product.Note !=''" style="background: #f1f1004d;">{{product.Note}}</p>
                                    </div>
                                    <ion-label class="ion-text-wrap menu-col-2">                        
                                        <h3>{{ product.Cant }}</h3>                       
                                    </ion-label>
                                    <ion-label class="ion-text-wrap menu-col-3" >
                                        <h3> {{ getFormatPrice(product.Price) }}</h3>
                                    </ion-label>
                                    <ion-label class="ion-text-wrap menu-col-3" >
                                        <h3>{{ getFormatPrice(product.Price * product.Cant) }}</h3>
                                    </ion-label>
                                </ion-item>

                                 <ion-list-header v-if="product.Aggregates.length > 0" style="padding: 20px 35px;">
                                    {{$t('frontend.home.aggregateFree')}}: {{product.CantAggr=product.AggregatesCant * product.Cant}}
                                </ion-list-header>

                                <ion-item v-for="(agg, index1) in product.Aggregates" :key="index1"  >
                                               
                                    <div class="menu-col-4" style="    text-align: left;padding-left: 30px;">
                                        <p>{{agg.Name}} <br> </p>  
                                    </div>                                                             
                                    <div class="menu-col-2">  
                                        <ion-label>{{agg.Cant}} </ion-label>  
                                    </div> 
                                     <div class="menu-col-3">  
                                        <ion-label>{{getFormatPrice(agg.SalePrice)}}</ion-label>  
                                    </div>                                      
                                     <div class="menu-col-3">  
                                        <ion-label>{{getFormatPrice(agg.AllTotal) }} </ion-label>  
                                    </div>                                   
                                </ion-item>
                                
                            </ion-item-sliding>

                            <ion-item-sliding>
                                <ion-label class="ion-text-wrap" v-if="order.OtherCharges.length >0">
                                    <h2 class="titles-order">{{$t('frontend.order.otherCharges')}}</h2> 
                                </ion-label>
                                <ion-item-sliding  v-for="charge in order.OtherCharges" v-bind:key="charge.Id">
                                    <ion-item>
                                        <div class="menu-col-4">
                                            <p>{{ charge.Name }} </p>
                                        </div>
                                        <ion-label  class="menu-col-2"> </ion-label>
                                        <ion-label  class="menu-col-3"> </ion-label>
                                        <ion-label  class="menu-col-3" >
                                            <h3> {{ getFormatPrice(charge.Price) }} </h3>
                                        </ion-label>
                                        
                                    </ion-item>
                                </ion-item-sliding>
                            </ion-item-sliding>


                            <ion-item-slidin style="border-top: 1px solid grey;" >

                                <ion-item style="font-size: 16px;font-weight: bold;"> 
                                    <ion-label :class="scope.isSmall ||  scope.noMatch? '' : 'menu-col-4'"></ion-label>
                                    <div :class="scope.isSmall || scope.noMatch? 'menu-col-6' : 'menu-col-3'" ><p  style="text-align:right">{{$t('frontend.order.subtotal')}} </p></div>
                                    <div :class="scope.isSmall ||  scope.noMatch? 'menu-col-5 padding-menu' : 'menu-col-3'"  style="text-align:right">{{getFormatPrice(order.SubTotal)}}</div>                    
                                </ion-item>                               

                                <ion-item style="font-size: 16px;font-weight: bold;"> 
                                    <ion-label :class="scope.isSmall ||  scope.noMatch? '' : 'menu-col-4'"> </ion-label>
                                    <div :class="scope.isSmall || scope.noMatch? 'menu-col-6' : 'menu-col-3'" ><p class="menu-bold-title" style="text-align:right"> {{$t('frontend.order.taxe')}} {{order.Taxe }}%</p></div>
                                    <p :class="scope.isSmall || scope.noMatch? 'menu-col-5' : 'menu-col-3'"  style="text-align:right">{{ getFormatPrice(order.Taxe * order.SubTotal / 100)}} </p>                    
                                </ion-item>

                                <ion-item v-if="order.OrderType =='Delivery' && order.Shipping" style="font-size: 16px;font-weight: bold;"> 
                                    <ion-label :class="scope.isSmall ||  scope.noMatch? '' : 'menu-col-4'"> </ion-label>
                                    <div :class="scope.isSmall || scope.noMatch? 'menu-col-6' : 'menu-col-3'"> <p class="menu-bold-title" style="text-align:right">{{$t('frontend.order.deliver')}}  </p></div>
                                    <p :class="scope.isSmall || scope.noMatch? 'menu-col-5' : 'menu-col-3'"  style="text-align:right">{{getFormatPrice(order.Shipping)}}</p>                    
                                </ion-item>

                                <ion-item style="font-size: 16px;font-weight: bold;" v-if="order.Tip"> 
                                    <ion-label :class="scope.isSmall ||  scope.noMatch? '' : 'menu-col-4'"> </ion-label>
                                    <div :class="scope.isSmall || scope.noMatch? 'menu-col-6' : 'menu-col-3'" > <p class="menu-bold-title" style="text-align:right">{{$t('frontend.order.tip')}} {{order.Tip }}%</p></div>
                                    <p :class="scope.isSmall || scope.noMatch? 'menu-col-5' : 'menu-col-3'"  style="text-align:right" >{{ getFormatPrice(order.Tip * order.SubTotal / 100) }} </p>                    
                                </ion-item>

                                <ion-item v-if="order.Discount" style="font-size: 16px;font-weight: bold;"> 
                                    <ion-label :class="scope.isSmall ||  scope.noMatch? '' : 'menu-col-4'"></ion-label>
                                    <div :class="scope.isSmall || scope.noMatch? 'menu-col-6' : 'menu-col-3'" ><p  style="text-align:right">{{$t('frontend.reservation.discount')}} </p></div>
                                    <p :class="scope.isSmall || scope.noMatch? 'menu-col-5' : 'menu-col-3'"  style="text-align:right"> {{getFormatPrice(order.Discount) }}</p>                    
                                </ion-item>
                                
                                <ion-item style="    color: red;    font-size: 16px;    font-weight: bold;    text-transform: uppercase;"> 
                                    <ion-label :class="scope.isSmall ||  scope.noMatch? '' : 'menu-col-4'"> </ion-label>
                                    <div :class="scope.isSmall || scope.noMatch? 'menu-col-6' : 'menu-col-3'" ><p class="menu-bold-title" style="text-align:right">{{$t('frontend.order.total')}}  </p></div>
                                    <p :class="scope.isSmall || scope.noMatch? 'menu-col-5 menu-bold-title' : 'menu-col-3 menu-bold-title'"  style="text-align:right">{{getFormatPrice(order.Total)}}</p>                    
                                </ion-item>

                                <ion-item  v-if="order.QuotationPayment" style="color: #399922;font-size: 16px;font-weight: bold;text-transform: uppercase;"> 
                                    <ion-label  :class="scope.isSmall ||  scope.noMatch? '' : 'menu-col-4'"> </ion-label>
                                    <div :class="scope.isSmall || scope.noMatch? 'menu-col-6' : 'menu-col-3'" ><p class="menu-bold-title" style="text-align:right">{{$t('frontend.order.quotationPayment')}}  </p></div>
                                    <p :class="scope.isSmall || scope.noMatch? 'menu-col-5 menu-bold-title' : 'menu-col-3 menu-bold-title'" style="text-align:right">{{getFormatPrice(order.QuotationPayment)}}</p>                    
                                </ion-item>

                                <ion-item  v-if="order.QuotationPayment && !parcialPayment && order.PendingPayment === undefined" style="    color: #ff5500;    font-size: 16px;    font-weight: bold;    text-transform: uppercase;"> 
                                    <ion-label :class="scope.isSmall ||  scope.noMatch? '' : 'menu-col-4'"> </ion-label>
                                    <div :class="scope.isSmall || scope.noMatch? 'menu-col-6' : 'menu-col-3'" ><p class="menu-bold-title" style="text-align:right">{{$t('frontend.order.pendingPayment')}}  </p></div>
                                    <p :class="scope.isSmall || scope.noMatch? 'menu-col-5 menu-bold-title' : 'menu-col-3 menu-bold-title'" style="text-align:right">{{ getFormatPrice(order.Total - order.QuotationPayment)}}</p>                    
                                </ion-item>

                                 <ion-item  v-if="parcialPayment && order.Deadline && order.State === 8" style="    color: #ff5500;    font-size: 16px;    font-weight: bold;    text-transform: uppercase;"> 
                                    <ion-label :class="scope.isSmall ||  scope.noMatch? '' : 'menu-col-4'"> </ion-label>
                                    <div :class="scope.isSmall || scope.noMatch? 'menu-col-6' : 'menu-col-3'" ><p class="menu-bold-title" style="text-align:right">{{$t('frontend.order.parcialPayment')}}  </p></div>
                                    <p :class="scope.isSmall || scope.noMatch? 'menu-col-5 menu-bold-title' : 'menu-col-3 menu-bold-title'" style="text-align:right"> {{ getFormatPrice(totalWithoutQuotation * order.Deadline[0].Percent / 100) }}</p>                    
                                </ion-item>

                                <ion-item  v-if="parcialPayment && order.Deadline && order.State === 8" style="    color: #ff5500;    font-size: 16px;    font-weight: bold;    text-transform: uppercase;"> 
                                    <ion-label :class="scope.isSmall ||  scope.noMatch? '' : 'menu-col-4'"> </ion-label>
                                    <div :class="scope.isSmall || scope.noMatch? 'menu-col-6' : 'menu-col-3'"  ><p class="menu-bold-title" style="text-align:right">{{$t('frontend.order.pendingPayment')}}  </p></div>
                                    <p :class="scope.isSmall || scope.noMatch? 'menu-col-5 menu-bold-title' : 'menu-col-3 menu-bold-title'" style="text-align:right"> {{ getFormatPrice(pendingPayment()) }}</p>                    
                                </ion-item>

                                <ion-item  v-if="order.PendingPayment !== undefined && order.State !== 8" style="    color: #ff5500;    font-size: 16px;    font-weight: bold;    text-transform: uppercase;"> 
                                    <ion-label :class="scope.isSmall ||  scope.noMatch? '' : 'menu-col-4'"> </ion-label>
                                    <div :class="scope.isSmall || scope.noMatch? 'menu-col-6' : 'menu-col-3'" ><p class="menu-bold-title" style="text-align:right">{{$t('frontend.order.pendingPayment')}}  </p></div>
                                    <p :class="scope.isSmall || scope.noMatch? 'menu-col-5 menu-bold-title' : 'menu-col-3 menu-bold-title'" style="text-align:right"> {{ getFormatPrice(order.PendingPayment) }}</p>                    
                                </ion-item>

                                <div v-if="order.State !== 8 && order.Deadline">
                                     <ion-card-title v-if="order.State !== 8 && order.Deadline.length > 0" >                                         
                                       {{$t('frontend.order.parcialPayment')}}  
                                </ion-card-title>

                                <div v-if="order.State !== 8 && order.Deadline.length > 0" class="subtitles-order" style="display: flex;overflow: auto;">

                                   
                                                               
                                    <ion-card v-for="dead in order.Deadline" v-bind:key="dead.Date" 
                                     :class="scope.isSmall || scope.noMatch ? 'subtitles-order menu-col-6 sc-ion-card-md-h sc-ion-card-md-s md hydrated' :'subtitles-order menu-col-3 sc-ion-card-md-h sc-ion-card-md-s md hydrated'"
                                     style="text-align: center;display: inline-block; visibility: visible;">
                                                                                                                  
                                        <ion-label> <p class="percent-payment"> {{dead.Percent}}% </p> 
                                                    <span class="iconify" data-icon="ic:baseline-update" data-inline="false" style="width: 18px;height: 18px;float: left;"></span>
                                                    <p style="text-align: left; font-weight: bold"> {{ getFormatDate(dead.Date) }} </p>
                                        </ion-label> 
                                        <ion-progress-bar color="success" :value="dead.State=== 0 ? 0 : 1" ></ion-progress-bar>
                                        <ion-label :color="dead.State=== 1 ?'success': 'danger'">
                                            <strong>  {{getFormatPrice(totalWithoutQuotation * dead.Percent / 100)}} </strong>
                                            <span v-if="dead.State=== 1" class="iconify" data-icon="emojione-v1:left-check-mark" data-inline="false" style="width: 18px;height: 18px;float: right;"></span>   
                                        </ion-label>
                                    
                                    </ion-card>
                                </div>

                                </div>

                               
                            </ion-item-slidin>

                        </ion-list>

                        <ion-card v-if="order.Note">
                            <ion-label class="ion-text-wrap" >
                                <h2 class="titles-order"> {{$t('frontend.order.notes')}}</h2> 
                            </ion-label>
                            <ion-label>{{order.Note}} </ion-label>
                        </ion-card>

                    </ion-card>

                    
                    <ion-card  style="padding: 0 10px" v-if="order.State === 8">

                        <ion-label class="ion-text-wrap" >
                                <h2 class="titles-order">{{$t('frontend.order.payment')}}: </h2> 
                        </ion-label>

                        

                         <ion-item v-if="order.Deadline">
                            <p style=" float: left;text-align: left;padding: 0" class="subtitles-order menu-col-4">{{$t('frontend.order.parcialPayment')}} </p>                               
                            <ion-toggle color="primary" :value="parcialPayment" @ionChange="parcialPayment = !parcialPayment"></ion-toggle>
                        </ion-item>

                        <div v-if="parcialPayment && order.Deadline" class="subtitles-order" style="display: flex;overflow: auto;">
                            
                            <ion-card v-for="(dead, index) in order.Deadline" v-bind:key="index" 
                             :class="scope.isSmall || scope.noMatch ? 'subtitles-order menu-col-6' :'subtitles-order menu-col-3'" 
                             :style="index === 0 ? 'text-align: center;display: inline-block; border: 2px solid #21e321a6;' : 'display: inline-block; text-align: center;'">
                                
                                
                               
                                <ion-label> <p class="percent-payment"> {{dead.Percent}}% </p> 
                                    <span class="iconify" data-icon="ic:baseline-update" data-inline="false" style="width: 18px;height: 18px;float: left;"></span>
                                    <p style="text-align: left; font-weight: bold"> {{ getFormatDate(dead.Date) }} </p>
                                </ion-label> 
                                <ion-progress-bar color="success" :value="dead.State=== 0 ? 0 : 1" ></ion-progress-bar>
                                <ion-label :color="dead.State=== 1 ?'success': 'danger'">
                                    <strong> {{ getFormatPrice(totalWithoutQuotation * dead.Percent / 100)}} </strong>
                                    <span v-if="dead.State=== 1" class="iconify" data-icon="emojione-v1:left-check-mark" data-inline="false" style="width: 18px;height: 18px;float: right;"></span>   
                                </ion-label>
                               
                            </ion-card>
                        </div>


                        <ion-button  color="danger"   @click.stop=" cancelOrder"> {{$t('frontend.home.cancel')}}</ion-button>
                        <ion-button  color="primary"  @click.stop="payOrder">{{$t('frontend.order.pay')}}</ion-button>

                                        
                    </ion-card>
                    
                </span>

                
            </div>
        </v-breakpoint>

        


    </div>
</template>

<script>
import PaymentModal from '../components/PaymentModal'
import { add } from "ionicons/icons";
import { addIcons } from "ionicons";
import { VBreakpoint } from 'vue-breakpoint-component'
import { Api } from '../../backoffice/api/api.js';
import moment from 'moment-timezone';
import Localization from '../../backoffice/views/Localization'
import { EventBus } from '../event-bus';
 import Moment from 'moment'

addIcons({
  "ios-add": add.ios,
  "md-add": add.md
});

export default {
    name: 'OrderState', 
    components:{
        Localization,
        VBreakpoint: VBreakpoint
    },
     props:{           
       
        taxes: {type: Number, default:1 } ,
        shippingName: {type: String, default:"" } ,
        shipping: {type: Number, default:0 } ,

 
        products: {type: Array, default:() => [] },
        restaurantSelectedId: {type: String, default:"" } ,
       
     }, 
    created: function(){

        if(this.$store.state.customer._id){
            this.clientId= this.$store.state.customer._id;
            this.CustomerName= this.$store.state.customer.Name;       
       }
      
        if(this.$store.state.configuration)
            this.showCooker = this.$store.state.configuration.showCooker;

        
        if( this.$route.params.currentPageOrder > 1)
            this.currentPageOrder = this.$route.params.currentPageOrder;        
        
            
        this.order = this.$route.params.order;
        this.configuration = this.$store.state.configuration;
        this.restaurantActive = this.$store.state.restaurantActive

        this.fromMyAccount = this.$route.params.fromMyAccount;


        if(this.order.OrderType === 'PickUp' || this.order.OrderType === 'Curbside'){
            this.orderInfo =  moment.tz(this.order.DateToPick, moment.tz.guess()).format('MM-DD-YYYY') +'  |  '+ moment.tz(this.order.HourToPick, moment.tz.guess()).format('hh:mm A')
        }
        else this.orderInfo = this.$route.params.orderInfo;  
        this.showStates = this.order.State;
        this.date = moment.tz(this.order.Date, moment.tz.guess()).format('MM-DD-YYYY hh:mm A')
        if(this.order.Cooker != undefined){
        Api.fetchById('Staff', this.order.Cooker).then(response => {
            if(response.status === 200){           
            this.cooker = response.data.FirstName + ' '+ response.data.LastName;
            }                   
        })
            .catch(e => {
            console.log(e)
             return  this.$ionic.alertController
                .create({
                    cssClass: 'my-custom-class',
                    header: 'Error',
                    message: e,
                    buttons: [                   
                    {
                        text: this.buttonAcept,
                        handler: () => {                                 
                                    
                        },
                    },
                    ],
                })
                .then(a => a.present())
            
            });
            
        }
            
           
        const allStates=[this.$t('frontend.order.state0'),this.$t('frontend.order.state1'), this.$t('frontend.order.state2'),
        this.$t('frontend.order.state3'), this.$t('frontend.order.state4'), this.$t('frontend.order.state5'), this.$t('frontend.order.state6'),this.$t('frontend.order.state7'), this.$t('frontend.order.state8')]; 
        
        this.valEstate = allStates[this.showStates];   

        if(this.order.QuotationPayment)        
            this.totalWithoutQuotation = this.order.Total - this.order.QuotationPayment;
        else
            this.totalWithoutQuotation = this.order.Total;

               
        if(this.order.HourToPick)
            this.hourEstimateToPick = moment.tz(this.order.HourToPick, moment.tz.guess()).format('hh:mm A');
        if(this.order.DateToPick)
            this.dateEstimateToPick =  moment.tz(this.order.DateToPick, moment.tz.guess()).format('MM-DD-YYYY');
        if(this.order.EventDate)
            this.order.EventDate =  moment.tz(this.order.EventDate, moment.tz.guess()).format('MM-DD-YYYY');
        if(this.order.EventTimeStart)
            this.order.EventTimeStart = moment.tz(this.order.EventTimeStart, moment.tz.guess()).format('hh:mm A');
        if(this.order.EventTimeEnd)
          this.order.EventTimeEnd = moment.tz(this.order.EventTimeEnd, moment.tz.guess()).format('hh:mm A');
        if(this.order.LicencePlate)
        this.licencePlate =this.order.LicencePlate
        if(this.order.VehicleModel)
            this.vehicleModel =this.order.VehicleModel;
         if(this.order.VehicleColor)
            this.vehicleColor =this.order.VehicleColor;
    }, 
    data() {
        return {
            order: [],
            CustomerName: '',
            clientId: '',
            showStates: '',
            showCooker: false,
            cooker: '',            
            currentState: this.showStates,
            valEstate:'',
            date: '',
            allTypeOrder:{'Delivery':this.$t('frontend.app.deliver'), 'PickUp':this.$t('frontend.app.pickup'), 'On Table':this.$t('frontend.app.table'),'Curbside':this.$t('frontend.app.curbside'), },
            spinner: false,
            spinner1: false,
            spinnerUpdateCurbside: false,
            spinnerCarArrived: false,
            key:0,
            keyCurbside: 1,
            keyCarArrived: 2,
            showPay: false,
            dateTodaymin: new Date().toISOString().substr(0, 7),
            dateTodaymax:  new Date().getFullYear(),
            cardNumber:'',
            cardCode: '',           
            parcialPayment: false,           
            totalWithoutQuotation: '',
            hourEstimateToPick:'',
            dateEstimateToPick:'',
            fromMyAccount: '',
            currentPageOrder: 1,
            allOrders: [],
            configuration: {},
            restaurantActive: {},
            licencePlate: '',
            vehicleModel: '',
            vehicleColor: '',
            spinnerEmail: false,

        }
    },
    computed:{
         
    },
 
    methods:{    
         pendingPayment() {
            let t = this.order.Total;
            if(this.order.QuotationPayment)
              t = t - this.order.QuotationPayment;
            if(this.parcialPayment && this.order.Deadline)  {
                const parcial = (this.totalWithoutQuotation * this.order.Deadline[0].Percent) / 100;
                t = t- parcial;
            }              
            return t.toFixed(2)        ;
        },
        
        valueEstate(value){
             let allStates=[this.$t('frontend.order.state0'),this.$t('frontend.order.state1'), this.$t('frontend.order.state2'),
                this.$t('frontend.order.state3'),this.$t('frontend.order.state5'), this.$t('frontend.order.state5')]
           if(this.order.OrderType=='Delivery')               
                allStates=[this.$t('frontend.order.state0'),this.$t('frontend.order.state1'), this.$t('frontend.order.state2'),
                this.$t('frontend.order.state3'), this.$t('frontend.order.state4'), this.$t('frontend.order.state5')]; 
       
           this.currentState = allStates[value];
           
        },

         getFormatDate(thisDate){
            return  moment.tz(thisDate, moment.tz.guess()).format('MM-DD-YYYY') 
        },

        async cancelOrder(){
            this.order.State = 6
            this.spinner = true;
            await Api.putIn('Order', this.order);
            this.chargeOrder();
            await this.getOrders();
        },

        async saveCheckPayment(res){          
                
                this.order.AmountCheckPayment = res.total;                   
                this.spinner1 = true;
                this.showPay = false;
                this.order.State = 1;   
                this.order.RoutingNumber = res.routingNumber;        
                this.order.AccountCheckNumber = res.accountCheckNumber;        
                this.order.BankName = res.bankName;        
                this.order.PaymentMethod = 'CHECK';
                await Api.putIn('Order', this.order).then(async response => { 
                    this.sendEmail(response.data);
                    this.chargeOrder();    
                    this.getOrders();                    
                    this.spinner1 = false;
                     const paymentEntry = {                       
                        "Method": res.method,
                        "Payment": res.total,
                        "InvoiceNumber": res.transId,
                        "ModelId": response.data._id,
                        "ModelFrom": "Catering",
                         "StaffName": this.order.StaffName                    
                   }
                    await Api.postIn('allpayments', paymentEntry); 
                })
                .catch(e => {  
                    let msg = e;
                    console.log(e)
                    this.spinner1 = false;
                    this.errorPaymentDetail(msg);                     
                }); 

           
            
        },

        async payOrder(){
            const dateToday = Moment().toISOString();

            this.order.OrderForCatering = true; 
            let amountForPay = this.order.Total.toString();

            if(this.parcialPayment  && this.order.Deadline){
                this.order.PendingPayment = this.pendingPayment();
                const parcial = (this.totalWithoutQuotation * this.order.Deadline[0].Percent) / 100;
                this.order.Deadline[0].State = 1;
                this.order.Deadline[0].Date = dateToday;
                this.order.Deadline[0].AmountPayed = parcial;
                amountForPay = parcial;
                return this.openPayment(amountForPay.toString());  
        } 
        else{
            if(this.order.QuotationPayment)
                amountForPay = amountForPay - this.order.QuotationPayment;
            this.order.PendingPayment = 0;
            this.order.Deadline = [];
     
            return this.openPayment(amountForPay.toString());  
        }
                                    
            
            
        },

        async openPayment(total){
                return this.$ionic.modalController
            .create({
                component: PaymentModal,
                cssClass: 'my-custom-class',
                componentProps: {
                data: {
                    content: 'New Content',
                },
                propsData: {    
                parent: this,
                order: this.order,
                isCatering: true,
                Acept: this.$t('frontend.home.acept'),
                Cancel: this.$t('frontend.home.cancel'), 
                Total: total,
                Tax:  this.taxes.toString(),
                TaxName: this.TaxName,     
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
                returnTo: 'OrderState',                     
              },
                },
            })
            .then(m => m.present())       
        },

        async recivePayment(res){  

        try {
           
            this.spinner1 = true;          

            this.order.Payment=[{
                total : res.total,
                state : 1,
                paymentInfo : res,
                PaymentMethod :res.method + ' '+ res.accountType+ ' '+ res.accountNumber,
                }];
        
            this.order.State = 1;
            
            const response = await Api.putIn('Order', this.order)
            if(response.status === 200 && response.statusText === "OK"){  
                await this.getOrders();  
                this.chargeOrder();     
                this.sendEmail(response.data);                 
                this.spinner1 = false;

                const paymentEntry = {                       
                        "Method": res.method,
                        "Payment": res.total,
                        "InvoiceNumber": res.transId,
                        "ModelId": response.data._id,
                        "ModelFrom": "Catering",
                         "StaffName": this.order.StaffName                    
                   }
                   await Api.postIn('allpayments', paymentEntry);
            }            
            } catch (error) {            
                console.log(error)
                this.spinner1 = false;           
            }        
        },


        chargeOrder(){
            let allStates=[this.$t('frontend.order.state0'),this.$t('frontend.order.state1'), this.$t('frontend.order.state2'),
                this.$t('frontend.order.state3'), this.$t('frontend.order.state5'), this.$t('frontend.order.state5'), this.$t('frontend.order.state6'), this.$t('frontend.order.state7'), this.$t('frontend.order.state8')]
           if(this.order.OrderType=='Delivery')               
                allStates=[this.$t('frontend.order.state0'),this.$t('frontend.order.state1'), this.$t('frontend.order.state2'),
                this.$t('frontend.order.state3'), this.$t('frontend.order.state4'), this.$t('frontend.order.state5'), this.$t('frontend.order.state6'), this.$t('frontend.order.state7'), this.$t('frontend.order.state8')]; 
       

            this.spinner = true;           
            Api.fetchById('Order', this.order._id).then(response => {
                if(response.status === 200){ 
                    this.key++;          
                    this.order = response.data;               
                    this.showStates = this.order.State;
                    this.valEstate = allStates[this.showStates];
                    this.currentState = this.valEstate;
                    if(this.order.EventDate)
                        this.order.EventDate =  moment.tz(this.order.EventDate, moment.tz.guess()).format('MM-DD-YYYY');
                    if(this.order.EventTimeStart)
                        this.order.EventTimeStart = moment.tz(this.order.EventTimeStart, moment.tz.guess()).format('hh:mm A');
                    if(this.order.EventTimeEnd)
                        this.order.EventTimeEnd = moment.tz(this.order.EventTimeEnd, moment.tz.guess()).format('hh:mm A');
        
                    if(this.order.Cooker != undefined){
                        Api.fetchById('Staff', this.order.Cooker).then(response => {
                            if(response.status === 200){           
                            this.cooker = response.data.FirstName + ' '+ response.data.LastName;
                            }                   
                        })
                        .catch(e => {
                        console.log(e)
                         return  this.$ionic.alertController
                            .create({
                                cssClass: 'my-custom-class',
                                header: 'Error',
                                message: e,
                                buttons: [                   
                                {
                                    text: this.buttonAcept,
                                    handler: () => {                                 
                                                
                                    },
                                },
                                ],
                            })
                            .then(a => a.present())
                        });
                            
                    }


                    let index = this.allOrders.findIndex( o => o._id === this.order._id)
                    if(index !==-1){
                        this.allOrders.splice(index, 1, this.order);
                        EventBus.$emit('updateAllOrders', this.allOrders);
                    }                        
                    this.spinner = false;
                                }                   
        })
        .catch(e => {
        console.log(e)
        this.spinner = false;
         return  this.$ionic.alertController
            .create({
                cssClass: 'my-custom-class',
                header: 'Error',
                message: e,
                buttons: [                   
                {
                    text: this.buttonAcept,
                    handler: () => {                                 
                                  
                    },
                },
                ],
            })
            .then(a => a.present())
        });

        },

        allOrder: function(){
        if(this.fromMyAccount === '')
            return this.$router.push({ name: 'ListOrder', params: {customerId: this.order.ClientId, CustomerName: this.CustomerName, currentPageOrder: this.currentPageOrder} })    
        else 
            return this.$router.push({ name: 'Myaccount', params: { fromMyAccount: this.fromMyAccount, currentPageOrder: this.currentPageOrder } })    
   
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

       async sendEmail(order){
           this.spinnerEmail = true;
            var date = moment.tz(order.Date, moment.tz.guess()).format('MM-DD-YYYY hh:mm A');
               if(order.OrderForCatering === true)
                  date = moment.tz(order.DateToPick, moment.tz.guess()).format('MM-DD-YYYY') + ' ' +  moment.tz(order.HourToPick, moment.tz.guess()).format('hh:mm A') ;


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
            html += `<h2>${this.restaurantActive.restaurantName}</h2>  `;
            html += `<img src="${this.restaurantActive.restaurantLogo}" style="max-width: 100px;"></img> `;     
            html +=`</td>`;     
            html += `</tr>`;          
            html += '<tr><td colspan=6 >'
            if(order.Payment){
            html += `<br> <h4> ${this.$t('frontend.order.payment')}:</h4>`;
            for (const payment of order.Payment) {
                if(payment.paymentInfo)
                html += `<br> <h4> 
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
            if(order.State === 6)
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
                html += `<h4> ${this.$t('frontend.order.eventDate')}: ${moment.tz(order.EventDate, moment.tz.guess()).format('MM-DD-YYYY')}  </h4>`;
            if(order.EventTimeStart)
                html += `<h4> ${this.$t('frontend.order.eventStartHour')}: ${moment.tz(order.EventTimeStart, moment.tz.guess()).format('hh:mm A')} </h4>`;
            if(order.EventTimeEnd)
                html += `<h4> ${this.$t('frontend.order.eventEndHour')}:  ${moment.tz(order.EventTimeEnd, moment.tz.guess()).format('hh:mm A')}  </h4>`;
            html += `</td></tr>`;
            html += '<hr>'; 

            html += `</td></tr>`;      
            html += `<tr ><td colspan=6 ><h4 ><strong>${this.$t('frontend.order.products')}</strong></h4></td></tr> <tr></tr>`;
            for(var i = 0; i<order.Products.length ; i++){
                html += `<tr ><td  colspan=4 style="width: 50%;border-bottom: 1px solid #dbd1d1;" ><strong >${order.Products[i].Name}</strong>` ;
                if(order.Products[i].Note !='')
                    html +=`<p style="background: #f1f1004d;">${order.Products[i].Note}</p> `;
                html +=`</td><td style="width: 25%;border-bottom: 1px solid #dbd1d1;" > <p >( ${order.Products[i].Cant} X  ${this.getFormatPrice(order.Products[i].Price)})</p> </td>`;
                html += `<td style="width: 25%;border-bottom: 1px solid #dbd1d1;"> <p >${ this.getFormatPrice(order.Products[i].Price * order.Products[i].Cant )}</p> </td>`;
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
            html += `<tr ><td colspan=5 ><p ><strong>${this.$t('frontend.order.subtotal')}</strong></p></td> <td > <p > ${this.getFormatPrice(order.SubTotal)}</p></td></tr>`;
            if(order.Discount)
                html +=  `<tr ><td colspan=5 ><p  ><strong>${this.$t('frontend.reservation.discount')}</strong></p></td><td  ><p > ${this.getFormatPrice(order.Discount)}</p></td></tr>`;            
            html += `<tr><td  colspan=5><p  ><strong>${this.$t('frontend.order.taxe') } ${order.Taxe } %</strong></p></td> <td > <p >${  this.getFormatPrice(order.Taxe * order.SubTotal / 100) } </p> </td></tr>`;
            if(order.OrderType == 'Delivery' && order.Shipping)
                html +=  `<tr ><td colspan=5 ><p  ><strong>${this.$t('frontend.order.deliver')}</strong></p></td><td  ><p >${this.getFormatPrice(order.Shipping)}</p></td></tr>`;
            if(order.Tip)
                html += `<tr ><td  colspan=5 ><p ><strong>${this.$t('frontend.order.tip')} ${order.Tip }%</strong></p></td><td ><p> ${  this.getFormatPrice(order.Tip * order.SubTotal / 100) }</p> </td></tr>`;
            html += `<tr><td colspan=5 style="border-bottom: 1px solid #dbd1d1;"><p  ><strong>${this.$t('frontend.order.total')}</strong></p></td> <td style="border-bottom: 1px solid #dbd1d1;"> <strong >${this.getFormatPrice(order.Total)}</strong> </td></tr>`;
            if(order.QuotationPayment)
                html += `<tr><td colspan=5 style="border-bottom: 1px solid #399922;"><p  ><strong>${this.$t('frontend.order.quotationPayment')}</strong></p></td> <td style="border-bottom: 1px solid #399922;"> <strong >${this.getFormatPrice(order.QuotationPayment)}</strong> </td></tr>`;
             if(order.PendingPayment)
                html += `<tr><td colspan=5 style="border-bottom: 1px solid #ff5500;"><p  ><strong>${this.$t('frontend.order.pendingPayment')}</strong></p></td> <td style="border-bottom: 1px solid #ff5500;"> <strong > ${this.getFormatPrice(order.PendingPayment)}</strong> </td></tr>`;
            if(order.PendingPayment > 0 && order.Deadline){
                html += `<tr ><td colspan=6 ><h4 ><strong>${this.$t('frontend.order.parcialPayment')}</strong></h4></td></tr>`;
                for(var dead = 0; dead < order.Deadline.length ; dead ++){
                    html += ` <tr ><td colspan=3 style="border-bottom: 1px solid #dbd1d1;"><p >${order.Deadline[dead].Date}  </p></td> `
                    html += ` <td colspan=3 style="border-bottom: 1px solid #dbd1d1;"><strong >  ${order.Deadline[dead].Percent}%  =  ${ this.getFormatPrice(this.totalWithoutQuotation * order.Deadline[dead].Percent / 100)}</strong></td> `
                    if(order.Deadline[dead].State === 1)
                    html += ` <td style="border-bottom: 1px solid #dbd1d1;"> <strong  style= "color: #399922;  ">${this.$t('frontend.order.payed')}</strong></td>`;
                    else html += ` <td style="border-bottom: 1px solid #dbd1d1;"><strong  style= "color: #ff5500; ">${this.$t('frontend.order.toPay')}</strong> </td>`;
                    html += ` </tr>`;
                }
            }
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

             let subject = this.$t('frontend.order.invoice') ;
            if(order.OrderForCatering){
                if(order.QuotationPaymentDetail)
                    subject += order.QuotationPaymentDetail.transId;
                subject += ' | '+ this.$t('frontend.menu.catering') ;
            }
            else{
                if(order.Payment)
                if(order.Payment[0].paymentInfo)
                    subject += '-'+ order.Payment[0].paymentInfo.transId;
            }   
                          
            subject += ' ' + this.restaurantActive.restaurantName    
              
                    
            var items = {
                "email": order.CustomerEmail,
                "mess": html,
                "subject": subject
            }
            await Api.sendEmail(items);
            this.spinnerEmail = false;

         },

        alertNotProductForReoder(){
            return  this.$ionic.alertController
            .create({
                cssClass: 'my-custom-class',
                header: 'Error',
                message: this.$t('frontend.home.noProductForReorder'),
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

         sendReorder: function(){
             const reOrder = JSON.parse(JSON.stringify(this.order));
           
             
            for(var i=0; i< reOrder.Products.length; i++){
            const inx = this.products.findIndex(pr => pr._id === reOrder.Products[i].ProductId);      
            if(inx !== -1){              
                if(this.products[inx].Available === false){         
                reOrder.Products.splice(i, 1);
                this.producstNotAvailables +=', ' + this.products[inx].Name;
                }  
            }               
            }           
            if(reOrder.Products.length === 0)            
                return this.alertNotProductForReoder();
            else
                EventBus.$emit('sendReorder', this.order);
         },

         sendPrint:  function(){
             EventBus.$emit('sendPrint', this.order);
         },

        getFormatPrice(price){
            const result = new Intl.NumberFormat('en', {style: "currency", currency: this.restaurantActive.currency} ).format(price)
            return result;
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

        async updateCurbsideOrder(){

            try {
                if(this.licencePlate=== '' || this.vehicleModel=== ''|| this.vehicleColor=== '')
                    return this.alertRequiredDatas();    
                this.order.LicencePlate = this.licencePlate;
                this.order.VehicleModel = this.vehicleModel;
                this.order.VehicleColor = this.vehicleColor;
                this.spinnerUpdateCurbside = true;   
                this.keyCurbside ++;                
                await Api.putIn('Order', this.order);
                await this.getOrders();
                this.spinnerUpdateCurbside = false;
                
                return this.openToastProd(); 
                
            } catch (error) {
                console.log(error);
                
            }

        },

        async carArrived(){
            try {                
                this.order.CarArrived = true;
                this.spinnerCarArrived = true;   
                this.keyCarArrived ++;                
                await Api.putIn('Order', this.order);
                await this.getOrders();
                this.spinnerCarArrived = false;
                return this.openToastProd(); 
                
            } catch (error) {
                console.log(error);                
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
      .elipsis-menu{
        text-overflow: ellipsis !important;
        overflow: hidden !important;
        display: -webkit-box !important;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
     }

</style>