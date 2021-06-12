<template >

    <div padding >  
      

      

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

      <modal name="catering-delivery"  width="80%" height="auto" style="left: 0px;width: auto;height: auto; max-width: 500px !important;">
            <ion-buttons slot="start" @click="hideDeliverCatering()">
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
                <ion-datetime :value="dateToDay" max="2030"  @ionChange="dateEstimateToPick=$event.target.value, validateHour()" :min="dateToDay"    
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
            <ion-button  @click="hideDeliverCatering()">{{ this.$t('frontend.home.cancel') }}</ion-button>
            <ion-button  @click="saveDeliveryCatering()">{{ this.$t('frontend.home.acept') }}</ion-button>
            
            </ion-card>          
        </modal>

        <modal name="catering-pickup" width="80%" height="auto" style="left: 0px;width: auto;height: auto; max-width: 500px !important;">
            <ion-buttons slot="start" @click="hidePickUpCatering()">
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
                <ion-datetime :value="dateToDay" max="2030"  @ionChange="dateEstimateToPick=$event.target.value, validateHour()" :min="dateToDay"     
                ></ion-datetime>
            </ion-item>
            <ion-item>
                <ion-label position="floating">{{$t('frontend.order.hourToPickEstimated')}} <strong style="color: red">*</strong></ion-label>
                <ion-datetime display-format="h:mm A" picker-format="h:mm A" :value="hourEstimateToPick"  @ionChange="hourEstimateToPick=$event.target.value, validateHour()" :key="key1 + '5'"        
                ></ion-datetime>
            </ion-item>          
            <ion-button  @click="hidePickUpCatering()">{{ this.$t('frontend.home.cancel') }}</ion-button>
            <ion-button  @click="savePickUpCatering()">{{ this.$t('frontend.home.acept') }}</ion-button>
            
            </ion-card>          
        </modal>

      <ion-progress-bar v-if="spinner" type="indeterminate" reversed="true"></ion-progress-bar>
       
      <div  v-if="!spinner && restaurantSelectedId" :disabled="spinner" >

        <v-breakpoint>
          <div slot-scope="scope">
            <div >

             
               
              <div v-if="scope.isSmall || scope.noMatch">                
                

                 <ion-slides pager="true"  :options="slideOpts" > 
                   <ion-slide>

                      <ion-card class="menu-col-12 card-categories" >
                       
                        <h6 style="margin:"> {{$t('frontend.home.choseView')}}</h6> 
                        <ion-toolbar style="text-align: center;">
                            <ion-button  @click="menuactive='grid';productKey++" :style="menuactive==='grid'? 'opacity: 1;border: outset;' : 'opacity: 0.65;border: none;' ">
                              <span class="iconify" data-icon="clarity:grid-chart-solid" data-inline="false" style="width: 20px;height: 20px;margin: 5px;"></span>
                            </ion-button>
                            <ion-button @click="menuactive='gridPicture';productKey++" :style="menuactive==='gridPicture'? 'opacity: 1;;border: outset;' : 'opacity: 0.65;border: none;' ">
                              <span class="iconify" data-icon="clarity:grid-chart-solid-badged" data-inline="false" style="width: 20px;height: 20px;margin: 5px;"></span>
                            </ion-button>
                            <ion-button @click="menuactive='list';productKey++" :style="menuactive==='list'? 'opacity: 1;;border: outset;' : 'opacity: 0.65;border: none;' ">
                              <span class="iconify" data-icon="foundation:list-bullet" data-inline="false" style="width: 20px;height: 20px;margin: 5px;"></span>
                            </ion-button>                
                          </ion-toolbar> 

                          <ion-toolbar>  
                            <div v-if="menuListInHome.length > 0">
                              <ion-select interface="popover" icon="add"
                              style="padding: 10px 50px;"
                              :ok-text="$t('backoffice.form.messages.buttons.ok')"
                              :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
                              :value="menuListInHome[0]._id"
                              :placeholder="$t('frontend.menu.menu')"
                                @ionChange="changeMenu($event.target.value)" >
                                  <ion-select-option v-for="res in menuListInHome"                    
                                    :key="res._id" 
                                    :value="res._id" > {{res.Name}}
                                  </ion-select-option>
                                
                              </ion-select>
                            </div>

                            <div v-if="dots" style="margin: 10px">              
                              <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
                            </div>

                            <ion-searchbar  
                              style="padding: 3px 1px;"
                              @ionClear="handleInput('')"
                              @input="$event.target.value?handleInput($event.target.value):handleInput('')"
                              :placeholder="$t('frontend.home.search')"> 
                              
                            </ion-searchbar>
                          </ion-toolbar>
                          
                          <div style="display: flex;flex-direction: row;flex-wrap: wrap;"  v-if="menuactive !=='list'">
                            <div  v-for="category in filterCategories" :key="category.Id" v-show="!category.ParentId"               
                              class="menu-col-6 card-categories">                  
                              <ion-card                          
                                color="primary" 
                                :key="productKey+ '1'" 
                                :style="categorySelected===category._id? 'opacity: 1': 'opacity: 0.75'"
                                @click="categorySelected !== category._id ?productsByCategory(category._id, category.Name, category.Service || false, category.Description): (categorySelected='', showProduct=false )"> 
                                <ion-avatar style="margin-inline: auto; margin-top: 25px;" v-if="menuactive==='gridPicture'">
                                  <img :src="category.ImageUrl">
                                </ion-avatar>
                                <h1 v-if="menuactive==='gridPicture'" class="elipsy-center" v-tooltip="category.Name" style="margin: 5px;">{{category.Name}}</h1>
                                <ion-label v-else class="ion-text-wrap menu-col-6" >
                                  <h1 class="elipsy-center" v-tooltip="category.Name">{{category.Name}}</h1>
                                </ion-label>                                                                                      
                              </ion-card>
                            </div> 
                          </div>
                          <div style="display: flex;flex-direction: row;flex-wrap: wrap;"  v-else>
                            <div  v-for="category in filterCategories" :key="category.Id" v-show="!category.ParentId"               
                              class='menu-col-12 card-categories'>                  
                              <ion-item                          
                                color="primary" 
                                :key="productKey+'2'" 
                                :style="categorySelected===category._id? 'opacity: 1': 'opacity: 0.75'"
                                @click="categorySelected !== category._id ?productsByCategory(category._id, category.Name, category.Service || false, category.Description): (categorySelected='', showProduct=false )"> 
                                <ion-thumbnail>
                                  <img :src="category.ImageUrl">
                                </ion-thumbnail>
                                <h3  class="elipsy-center" v-tooltip="category.Name" style="margin: 5px;">{{category.Name}}</h3>                                                                                                             
                              </ion-item>

                              <ion-card style="    max-width: 90% !important">
                                <vue-product  v-if="showProduct && !spinner && category.Name===categoryName"  :key="productKey + '3'"    
                                  
                                  :prod="prod"                                  
                                  :categories="categories"                                  
                                  :category="categoryName" 
                                  :isService="isService"
                                  :categoryDescription="categoryDescription"
                                  :menuactive="menuactive"
                                  :scopeM="scope"
                                  :orderFromCatering="isCatering"
                                  :orderType="orderType">
                                </vue-product>
                              </ion-card>

                              

                            </div> 
                          </div>

                          <div v-if="menuactive !=='list'">
                            <vue-product  v-if="showProduct && !spinner"  :key="productKey+ '4'"
                            :prod="prod"                           
                            :categories="categories"                           
                            :category="categoryName" 
                            :isService="isService"
                            :categoryDescription="categoryDescription"
                            :menuactive="menuactive"
                            :scopeM="scope"
                            :orderFromCatering="isCatering"
                            :orderType="orderType"
                          >
                          </vue-product>
                            
                          </div> 
                      </ion-card>

                   </ion-slide>
                    
                    <ion-slide>
                      <ion-card  class="menu-col-12 card-categories" color="light" :key="keyUpdateOrder" >
                        <ion-segment id="reservationSegment" :value="segmentValue" style="margin: 0px 0 25px;">
                             <ion-segment-button value="order"  @click="changeSegmentValue('order')">
                              <span class="iconify" data-icon="clarity:shopping-cart-solid" data-inline="false" data-width="15" data-height="15"></span>
                             {{$t('frontend.order.cart') }}  
                            </ion-segment-button>
                            <ion-segment-button value="table"  @click="changeSegmentValue('table')">
                              <span class="iconify" data-icon="grommet-icons:location-pin" data-inline="false" data-width="15" data-height="15"></span>
                              {{$t('frontend.order.location') }}
                            </ion-segment-button>
                            <ion-segment-button value="customer"  @click="changeSegmentValue('customer')">
                            <span class="iconify" data-icon="raphael:customer" data-inline="false" data-width="15" data-height="15"></span>
                              {{$t('frontend.order.client') }}
                            </ion-segment-button>
                           
                          </ion-segment>
                        
                          <div style="overflow: auto;" > 
                            <div v-if="segmentValue==='order'">                       
                              <cart
                                :key="keyForceUpdate+'C'+1"  
                                :showButtons ="false"                               
                              ></cart>
                            </div>

                            <div v-if="segmentValue==='customer'">
                              <guess :isCatering="isCatering">                          
                              </guess>
                            </div>

                            <div v-if="segmentValue==='table'" style="text-align: center;" :key="keyForceUpdate+'T'+1">
                            
                                <ion-button 
                                  v-if="configuration.viewDelivery && restaurantActive.hasPaymentCardConfig && $store.state.allTickets.length === 0 " 
                                  :style="isDelivery? 'opacity: 1;border: outset;width: 23%;' : 'opacity: 0.65;border: none;width: 23%;'" 
                                  color="secondary" 
                                  @click="!isCatering? showDeliver() : showDeliveryCatering()" 
                                  v-tooltip="$t('frontend.app.deliver')">
                                  <span class="iconify" data-icon="emojione-monotone:delivery-truck" data-inline="false" style="margin: 0;"></span>
                                  </ion-button>
                                
                                <ion-button 
                                  :style="isPick? 'opacity: 1;border: outset;width: 23%;' : 'opacity: 0.65;border: none;width: 23%;'"  
                                  color="secondary" 
                                  v-if="restaurantActive.hasPaymentCardConfig && $store.state.allTickets.length === 0" 
                                  @click="isCatering? showPickUpCatering(): configuration.selectPickHour? showPickUp() :  sinPickAction()" 
                                  v-tooltip="$t('frontend.app.pickup')" >                   
                                  <span class="iconify" data-icon="bx:bx-walk" data-inline="false" style="margin: 0;"></span>
                                </ion-button>
                                
                                <ion-button  
                                  v-if="configuration.viewOnTable && !isCatering" 
                                  :style="isTable? 'opacity: 1;border: outset;width: 23%;' : 'opacity: 0.65;border: none;width: 23%;'" 
                                  color="secondary" 
                                  @click="show"  
                                  v-tooltip="$t('frontend.app.table')" >
                                  <span class="iconify" data-icon="vs:table-o" data-inline="false" style="margin: 0;"></span>
                                </ion-button> 
                                
                                <ion-button
                                  v-if="configuration.viewCurbside && !isCatering && restaurantActive.hasPaymentCardConfig && $store.state.allTickets.length === 0" 
                                  :style="isCurbside? 'opacity: 1;border: outset;width: 23%;' : 'opacity: 0.65;border: none;width: 23%;'" 
                                  color="secondary" 
                                  @click="showCurbside" 
                                  v-tooltip="$t('frontend.app.curbside')">
                                  <span class="iconify" data-icon="raphael:car" data-inline="false" style="margin: 0;"></span>
                                </ion-button> 

                                <div >
                                        
                                  <div v-if="order.OrderType==='PickUp' || isPick">
                                    <ion-item>
                                        <h2>{{allTypeOrder['PickUp']}} </h2>
                                      </ion-item>
                                    <div v-if="isCatering"  @click="showPickUpCatering()">
                                       <ion-item >
                                          <ion-label position="floating">{{$t('frontend.order.dateToPickEstimated') }}<strong style="color: red">*</strong> </ion-label> 
                                          <ion-datetime  :value="dateEstimateToPick"  readonly="true" style="padding: 0;"></ion-datetime>
                                        </ion-item> 
                                        <ion-item >
                                            <ion-label position="floating">{{$t('frontend.order.hourToPickEstimated') }}<strong style="color: red">*</strong> </ion-label> 
                                            <ion-datetime display-format="h:mm A" picker-format="h:mm A" :value="hourEstimateToPick"  readonly="true" style="padding: 0;"></ion-datetime>
                                        </ion-item> 
                                    </div>
                                    <div v-else  @click="showPickUp()">                                      
                                      <ion-item   >
                                        <ion-label position="floating">{{$t('frontend.order.dateToPickEstimated') }}<strong style="color: red">*</strong> </ion-label> 
                                        <ion-datetime :key="key1 + '1'" style="text-align: left;" :min="minDay"
                                          :value="dateToDay" @ionChange="dateToDay=$event.target.value" ></ion-datetime>                                
                                      </ion-item>
                                      <ion-item  >
                                        <ion-label position="floating">{{$t('frontend.orderType.pickOut') }}<strong style="color: red">*</strong> </ion-label> 
                                        <ion-datetime display-format="h:mm A" picker-format="h:mm A" :key="key1 +'2' " style="text-align: left;"
                                          :value="thisMinHour" @ionChange="thisMinHour=ValidateHour($event.target.value), thisMinHour !==''? savePickUp() : ''" ></ion-datetime>                                
                                      </ion-item>

                                    </div>                                    
                                  </div>
                                          

                                  <div v-if="order.OrderType ==='Delivery' || isDelivery" >
                                      <ion-item>
                                        <h2>{{allTypeOrder['Delivery']}} </h2>
                                      </ion-item>
                                      <div v-if="isCatering" @click="showDeliveryCatering()">
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
                                                <ion-label position="floating">{{$t('frontend.home.address') }} 2 </ion-label> 
                                              <ion-input :value="addres2" readonly ></ion-input>     
                                          </ion-item> 
                                          <ion-item >
                                                <ion-label position="floating">ZipCode<strong style="color: red">*</strong> </ion-label> 
                                              <ion-input :value="zipCodeFlag" readonly ></ion-input>   
                                          </ion-item>

                                      </div>
                                      <div v-else @click="showDeliver()">
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
                                  </div>

                                  <ion-item  v-if="order.OrderType=='On Table' || isTable" @click="show()">
                                    <ion-item>
                                        <h2>{{allTypeOrder['On Table']}} </h2>
                                      </ion-item>
                                      <ion-label position="floating">{{$t('frontend.order.location')}} <strong style="color: red">*</strong></ion-label>
                                      <ion-input :value="order.tableService" readonly></ion-input>
                                  </ion-item> 

                                  <div v-if="order.OrderType==='Curbside' || isCurbside" @click="showCurbside()">
                                    <ion-item>
                                        <h2>{{allTypeOrder['Curbside']}} </h2>
                                      </ion-item>
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

                            </div>
                          </div>

                          <ion-footer class="ion-no-border">
                            
                            <ion-toolbar v-if="$store.state.cart.length > 0 " style="text-align: center">
                            

                              <div style="padding: 20px 0 0; text-align: center" v-if="$store.state.allTickets.length === 0 && !isCatering">
                                <ion-item v-if="( restaurantActive.payMethod==='SHIFT4' && order.OrderType === 'On Table' && (clientId !='' || staffName != '') ) ||
                                  (restaurantActive.payMethod==='TSYS' && order.OrderType === 'On Table'  && staffName != '')">
                                    <p style=" float: left;text-align: left;padding: 0" class="subtitles-order menu-col-4">{{$t('frontend.order.isTicket')}} </p>                               
                                    <ion-toggle color="primary" :value="isTicket" @ionChange="isTicket = !isTicket"></ion-toggle>
                                </ion-item> 

                                <ion-button                             
                                  @click="goHome()">{{$t('frontend.home.cancel')}}
                                </ion-button>  

                                <ion-button 
                                  v-if="!isTicket " 
                                  @click="segmentValue = 'order', openCardPayment()">{{$t('frontend.order.pay')}}
                                </ion-button>

                                <ion-button  
                                  v-if="isTicket " 
                                  @click="segmentValue = 'order', openCardPayment()">{{$t('frontend.order.payAsTicket')}}
                                </ion-button>  

                                <ion-button
                                  v-if="isTicket && staffName != ''" 
                                  @click="saveAsTicket()">{{$t('frontend.order.saveAsTicket')}}
                                </ion-button>                          
                              </div>
                              <div v-if="$store.state.allTickets.length > 0 && !isCatering" style="padding: 20px 0; text-align: center"> 
                                <ion-button  v-if="order.isTicket && $store.state.allTickets.length > 0" 
                                    @click="closeTicket()">
                                    {{$t('frontend.order.closeTicket')}}
                                </ion-button> 
                                <ion-button  
                                    @click="updateAuthorization()">
                                    {{$t('frontend.order.updateTicket')}}
                                  </ion-button>
                              </div>
                              <div v-if="isCatering" style="padding: 20px 0; text-align: center">

                              <div>
                                  <ion-label v-if="order.OrderType=='Delivery' && configuration.minAmountCateringDelivery > 0 && configuration.minAmountCateringDelivery > order.Total" class="menu-col-12 catering-amount" >{{$t('frontend.orderType.minAmountDelivery') +' '+  getFormatPrice(configuration.minAmountCateringDelivery)}}</ion-label>
                                <ion-label v-if="order.OrderType=='PickUp' && configuration.minAmoutCatering > 0 && configuration.minAmoutCatering > order.Total" class="menu-col-12 catering-amount">{{ $t('frontend.orderType.minAmountPickUp') + ' ' + getFormatPrice(configuration.minAmoutCatering)  }}</ion-label>                        
                              </div>
                                <ion-button                             
                                  @click="goHome()">{{$t('frontend.home.cancel')}}
                                </ion-button> 
                                <ion-button 
                                :disabled="clientId ==='' || !order.OrderType ||
                                (order.OrderType=='Delivery' && configuration.minAmountCateringDelivery > 0 && configuration.minAmountCateringDelivery > order.Total) ||
                                (order.OrderType=='PickUp' && configuration.minAmoutCatering > 0 && configuration.minAmoutCatering > order.Total)"
                                    @click="sendOrderCatering()">{{$t('frontend.order.sendRequest')}}
                                </ion-button> 
                              </div>

                              <a  style="font-size: 14px;text-transform: uppercase;font-weight: bold;"
                                  @click="showOrder()">{{$t('frontend.home.checkout')}}
                                </a>   
                            
                            </ion-toolbar>
                          </ion-footer>

                        
                      </ion-card>
                    </ion-slide>

                 </ion-slides>  

              

              </div>
            

              <div v-else >               

                <ion-card id="sideBarOpen" class="menu-col-8 card-categories" > 
                  <div style="top: 10px;right: 0;position: absolute;z-index: 20; background: #f4f5f8" :key="sideBarOpenFlag+'S'">                   
                    <div @click="showSideBar()" v-if="sideBarOpenFlag"> 
                      <span class="iconify" data-icon="eva:arrow-ios-back-outline" data-inline="false"></span>
                    </div>
                  </div>
                   <h6 style="margin:"> {{$t('frontend.home.choseView')}}</h6> 
                   <ion-toolbar style="text-align: center;">                     
                      <ion-button  @click="menuactive='grid';productKey++" :style="menuactive==='grid'? 'opacity: 1;border: outset;' : 'opacity: 0.65;border: none;' ">
                        <span class="iconify" data-icon="clarity:grid-chart-solid" data-inline="false" style="width: 20px;height: 20px;margin: 5px;"></span>
                      </ion-button>
                      <ion-button @click="menuactive='gridPicture';productKey++" :style="menuactive==='gridPicture'? 'opacity: 1;;border: outset;' : 'opacity: 0.65;border: none;' ">
                        <span class="iconify" data-icon="clarity:grid-chart-solid-badged" data-inline="false" style="width: 20px;height: 20px;margin: 5px;"></span>
                      </ion-button>
                      <ion-button @click="menuactive='list';productKey++" :style="menuactive==='list'? 'opacity: 1;;border: outset;' : 'opacity: 0.65;border: none;' ">
                        <span class="iconify" data-icon="foundation:list-bullet" data-inline="false" style="width: 20px;height: 20px;margin: 5px;"></span>
                      </ion-button>                
                    </ion-toolbar>                  

                    <ion-toolbar>  
                      <div v-if="menuListInHome.length > 0">
                        <ion-select interface="popover" icon="add"
                        style="padding: 10px 50px;"
                        :ok-text="$t('backoffice.form.messages.buttons.ok')"
                        :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
                        :value="menuListInHome[0]._id"
                        :placeholder="$t('frontend.menu.menu')"
                          @ionChange="changeMenu($event.target.value)" >
                            <ion-select-option v-for="res in menuListInHome"                    
                              :key="res._id" 
                              :value="res._id" > {{res.Name}}
                            </ion-select-option>
                          
                        </ion-select>
                      </div>

                      <div v-if="dots" style="margin: 10px">              
                        <ion-progress-bar  color="primary" type="indeterminate" reversed="true"></ion-progress-bar>
                      </div>

                      <ion-searchbar  
                        style="padding: 3px 1px;"
                        @ionClear="handleInput('')"
                        @input="$event.target.value?handleInput($event.target.value):handleInput('')"
                        :placeholder="$t('frontend.home.search')"> 
                        
                      </ion-searchbar>
                    </ion-toolbar>
                    
                    <div style="display: flex;flex-direction: row;flex-wrap: wrap;"  v-if="menuactive !=='list'">
                      <div  v-for="category in filterCategories" :key="category.Id" v-show="!category.ParentId"               
                        :class="scope.isMedium? 'menu-col-6 card-categories': 'menu-col-3 card-categories'">                  
                        <ion-card                          
                          color="primary" 
                          :key="productKey+ '5'" 
                          :style="categorySelected===category._id? 'opacity: 1': 'opacity: 0.75'"
                          @click="categorySelected !== category._id ?productsByCategory(category._id, category.Name, category.Service || false, category.Description): (categorySelected='', showProduct=false )"> 
                          <ion-avatar style="margin-inline: auto; margin-top: 25px;" v-if="menuactive==='gridPicture'">
                            <img :src="category.ImageUrl">
                          </ion-avatar>
                           <h1 v-if="menuactive==='gridPicture'" class="elipsy-center" v-tooltip="category.Name" style="margin: 5px;">{{category.Name}}</h1>
                          <ion-label v-else class="ion-text-wrap menu-col-6" >
                            <h1 class="elipsy-center" v-tooltip="category.Name">{{category.Name}}</h1>
                          </ion-label>                                                                                      
                        </ion-card>
                      </div> 
                    </div>
                    <div style="display: flex;flex-direction: row;flex-wrap: wrap;"  v-else>
                      <div  v-for="category in filterCategories" :key="category.Id" v-show="!category.ParentId"               
                        class='menu-col-12 card-categories'>                  
                        <ion-item                          
                          color="primary" 
                          :key="productKey+'6'" 
                          :style="categorySelected===category._id? 'opacity: 1': 'opacity: 0.75'"
                          @click="categorySelected !== category._id ?productsByCategory(category._id, category.Name, category.Service || false, category.Description): (categorySelected='', showProduct=false )"> 
                          <ion-thumbnail>
                            <img :src="category.ImageUrl">
                          </ion-thumbnail>
                           <h3  class="elipsy-center" v-tooltip="category.Name" style="margin: 5px;">{{category.Name}}</h3>                                                                                                             
                        </ion-item>

                        <ion-card style="    max-width: 90% !important">
                           <vue-product  v-if="showProduct && !spinner && category.Name===categoryName"  :key="productKey+'7'"    
                            :prod="prod"                           
                            :categories="categories"                            
                            :category="categoryName" 
                            :isService="isService"
                            :categoryDescription="categoryDescription"
                            :menuactive="menuactive"
                             :scopeM="scope"
                             :orderFromCatering="isCatering"
                            :orderType="orderType">
                          </vue-product>
                        </ion-card>

                         

                      </div> 
                    </div>

                    <div v-if="menuactive !=='list'">
                      <vue-product  v-if="showProduct && !spinner"  :key="productKey+'8'"  
                      :prod="prod"                      
                      :categories="categories"
                      :category="categoryName" 
                      :isService="isService"
                      :categoryDescription="categoryDescription"
                      :menuactive="menuactive"
                      :scopeM="scope"
                      :orderFromCatering="isCatering"
                      :orderType="orderType"
                     >
                    </vue-product>
                      
                    </div> 
                </ion-card>


                <ion-card  class="menu-col-4 card-categories" color="light" :key="keyUpdateOrder" id="sideBar">

                  <div style="top: 10px;left: 0px;position: absolute;z-index: 20;" :key="sideBarOpenFlag">
                    <div  @click="hideSideBar()" v-if="!sideBarOpenFlag"> 
                      <span class="iconify" data-icon="eva:arrow-ios-forward-outline" data-inline="false" style="margin: 0;"></span>
                    </div>                   
                  </div>
                

                    <ion-segment id="reservationSegment" :value="segmentValue" style="margin: 0px 0 25px;">
                      <ion-segment-button value="order"  @click="changeSegmentValue('order')">
                        <span class="iconify" data-icon="clarity:shopping-cart-solid" data-inline="false" data-width="15" data-height="15"></span>
                       {{$t('frontend.order.cart') }}  
                      </ion-segment-button>
                      <ion-segment-button value="table"  @click="changeSegmentValue('table')">
                        <span class="iconify" data-icon="grommet-icons:location-pin" data-inline="false" data-width="15" data-height="15"></span>
                        {{$t('frontend.order.location') }}
                      </ion-segment-button>
                      <ion-segment-button value="customer"  @click="changeSegmentValue('customer')">
                      <span class="iconify" data-icon="raphael:customer" data-inline="false" data-width="15" data-height="15"></span>
                       {{$t('frontend.order.client') }}
                      </ion-segment-button>
                      
                    </ion-segment>
                  
                    <div style="height: 72vh; overflow: auto;" > 
                      <div v-if="segmentValue==='order'">                       
                        <cart      
                        :key="keyForceUpdate+'C'+2"                                            
                          :showButtons ="false"
                        ></cart>
                      </div>

                      <div v-if="segmentValue==='customer'">
                        <guess :isCatering="isCatering">                          
                        </guess>
                      </div>

                      <div v-if="segmentValue==='table'" style="    text-align: center;" :key="keyForceUpdate+'T'+2">
                      
                          <ion-button 
                            v-if="configuration.viewDelivery && restaurantActive.hasPaymentCardConfig && $store.state.allTickets.length === 0" 
                            :style="isDelivery? 'opacity: 1;border: outset;width: 23%;' : 'opacity: 0.65;border: none;width: 23%;'" 
                            color="secondary" 
                            @click="!isCatering? showDeliver() : showDeliveryCatering()" 
                            v-tooltip="$t('frontend.app.deliver')">
                            <span class="iconify" data-icon="emojione-monotone:delivery-truck" data-inline="false" style="margin: 0;"></span>
                          </ion-button>

                          
                          <ion-button 
                            :style="isPick? 'opacity: 1;border: outset;width: 23%;' : 'opacity: 0.65;border: none;width: 23%;'"  
                            color="secondary" 
                            v-if="restaurantActive.hasPaymentCardConfig && $store.state.allTickets.length === 0" 
                            @click="isCatering? showPickUpCatering(): configuration.selectPickHour? showPickUp() :  sinPickAction() " 
                            v-tooltip="$t('frontend.app.pickup')" >                   
                            <span class="iconify" data-icon="bx:bx-walk" data-inline="false" style="margin: 0;"></span>
                          </ion-button>                         
                        
                          <ion-button  
                            v-if="configuration.viewOnTable && !isCatering" 
                            :style="isTable? 'opacity: 1;border: outset;width: 23%;' : 'opacity: 0.65;border: none;width: 23%;'" 
                            color="secondary" 
                            @click="show"  
                            v-tooltip="$t('frontend.app.table')" >
                            <span class="iconify" data-icon="vs:table-o" data-inline="false" style="margin: 0;"></span>
                          </ion-button> 
                          
                          <ion-button
                            v-if="configuration.viewCurbside && !isCatering && restaurantActive.hasPaymentCardConfig && $store.state.allTickets.length === 0" 
                            :style="isCurbside? 'opacity: 1;border: outset;width: 23%;' : 'opacity: 0.65;border: none;width: 23%;'" 
                            color="secondary" 
                            @click="showCurbside" 
                            v-tooltip="$t('frontend.app.curbside')">
                            <span class="iconify" data-icon="raphael:car" data-inline="false" style="margin: 0;"></span>
                          </ion-button>

                          <div :key="keyUpdateOrder+'T'">
                                  
                            <div v-if="order.OrderType==='PickUp' || isPick" >
                                <ion-item>
                                  <h2>{{allTypeOrder['PickUp']}} </h2>
                                </ion-item>
                                <div v-if="isCatering"  @click="showPickUpCatering()">
                                    <ion-item >
                                      <ion-label position="floating">{{$t('frontend.order.dateToPickEstimated') }}<strong style="color: red">*</strong> </ion-label> 
                                      <ion-datetime  :value="dateEstimateToPick"  readonly="true" style="padding: 0;"></ion-datetime>
                                    </ion-item> 
                                    <ion-item >
                                        <ion-label position="floating">{{$t('frontend.order.hourToPickEstimated') }}<strong style="color: red">*</strong> </ion-label> 
                                        <ion-datetime display-format="h:mm A" picker-format="h:mm A" :value="hourEstimateToPick"  readonly="true" style="padding: 0;"></ion-datetime>
                                    </ion-item> 
                                </div>
                                <div v-else  @click="showPickUp()">                                      
                                  <ion-item   >
                                    <ion-label position="floating">{{$t('frontend.order.dateToPickEstimated') }}<strong style="color: red">*</strong> </ion-label> 
                                    <ion-datetime :key="key1 + '3'" style="text-align: left;" :min="minDay"
                                      :value="dateToDay" @ionChange="dateToDay=$event.target.value" ></ion-datetime>                                
                                  </ion-item>
                                  <ion-item  >
                                    <ion-label position="floating">{{$t('frontend.orderType.pickOut') }}<strong style="color: red">*</strong> </ion-label> 
                                    <ion-datetime display-format="h:mm A" picker-format="h:mm A" :key="key1 + '4'" style="text-align: left;"
                                      :value="thisMinHour" @ionChange="thisMinHour=ValidateHour($event.target.value), thisMinHour !==''? savePickUp() : ''" ></ion-datetime>                                
                                  </ion-item>

                                </div> 
                            </div>
                                    

                            <div v-if="order.OrderType ==='Delivery' || isDelivery" >
                                <ion-item>
                                  <h2>{{allTypeOrder['Delivery']}} </h2>
                                </ion-item>
                                <div v-if="isCatering" @click="showDeliveryCatering()">
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
                                       <ion-label position="floating">{{$t('frontend.home.address') }} 2 </ion-label> 
                                    <ion-input :value="addres2" readonly ></ion-input>     
                                 </ion-item> 
                                <ion-item >
                                       <ion-label position="floating">ZipCode<strong style="color: red">*</strong> </ion-label> 
                                    <ion-input :value="zipCodeFlag" readonly ></ion-input>   
                                </ion-item>

                                </div>
                                <div v-else @click="showDeliver()">
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
                            </div>

                            <ion-item  v-if="order.OrderType=='On Table' || isTable" @click="show()">
                              <ion-item>
                                  <h2>{{allTypeOrder['On Table']}} </h2>
                                </ion-item>
                                <ion-label position="floating">{{$t('frontend.order.location')}} <strong style="color: red">*</strong></ion-label>
                                <ion-input :value="order.tableService" readonly></ion-input>
                            </ion-item> 

                            <div v-if="order.OrderType==='Curbside' || isCurbside" @click="showCurbside()">
                              <ion-item>
                                  <h2>{{allTypeOrder['Curbside']}} </h2>
                                </ion-item>
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

                      </div>
                    </div>

                  <ion-footer class="ion-no-border">
                    
                    <ion-toolbar v-if="$store.state.cart.length > 0 " style="text-align: center">
                     

                      <div style="padding: 20px 0 0; text-align: center" v-if="$store.state.allTickets.length === 0 && !isCatering">
                         <ion-item v-if="( restaurantActive.payMethod==='SHIFT4' && order.OrderType === 'On Table' && (clientId !='' || staffName != '') ) ||
                          (restaurantActive.payMethod==='TSYS' && order.OrderType === 'On Table'  && staffName != '')">
                            <p style=" float: left;text-align: left;padding: 0" class="subtitles-order menu-col-4">{{$t('frontend.order.isTicket')}} </p>                               
                            <ion-toggle color="primary" :value="isTicket" @ionChange="isTicket = !isTicket"></ion-toggle>
                        </ion-item> 

                        <ion-button                             
                          @click="goHome()">{{$t('frontend.home.cancel')}}
                        </ion-button>  

                        <ion-button 
                          v-if="!isTicket " 
                          @click="segmentValue = 'order', openCardPayment()">{{$t('frontend.order.pay')}}
                        </ion-button>

                        <ion-button  
                          v-if="isTicket " 
                          @click="segmentValue = 'order', openCardPayment()">{{$t('frontend.order.payAsTicket')}}
                        </ion-button>  

                        <ion-button
                          v-if="isTicket && staffName != ''" 
                          @click="saveAsTicket()">{{$t('frontend.order.saveAsTicket')}}
                        </ion-button>                          
                      </div>
                      <div v-if="$store.state.allTickets.length > 0 && !isCatering" style="padding: 20px 0; text-align: center"> 
                                              
                        <ion-button  v-if="order.isTicket && $store.state.allTickets.length > 0" 
                            @click="closeTicket()">
                            {{$t('frontend.order.closeTicket')}}
                         </ion-button> 
                         <ion-button  
                            @click="updateAuthorization()">
                            {{$t('frontend.order.updateTicket')}}
                          </ion-button>
                      </div>
                      <div v-if="isCatering" style="padding: 20px 0; text-align: center">

                       <div>
                          <ion-label v-if="order.OrderType=='Delivery' && configuration.minAmountCateringDelivery > 0 && configuration.minAmountCateringDelivery > order.Total" class="menu-col-12 catering-amount" >{{$t('frontend.orderType.minAmountDelivery') +' '+  getFormatPrice(configuration.minAmountCateringDelivery)}}</ion-label>
                        <ion-label v-if="order.OrderType=='PickUp' && configuration.minAmoutCatering > 0 && configuration.minAmoutCatering > order.Total" class="menu-col-12 catering-amount">{{ $t('frontend.orderType.minAmountPickUp') + ' ' + getFormatPrice(configuration.minAmoutCatering)  }}</ion-label>                        
                       </div>
                        <ion-button                             
                          @click="goHome()">{{$t('frontend.home.cancel')}}
                        </ion-button> 
                         <ion-button 
                         :disabled="clientId ==='' || !order.OrderType ||
                         (order.OrderType=='Delivery' && configuration.minAmountCateringDelivery > 0 && configuration.minAmountCateringDelivery > order.Total) ||
                         (order.OrderType=='PickUp' && configuration.minAmoutCatering > 0 && configuration.minAmoutCatering > order.Total)"
                            @click="sendOrderCatering()">{{$t('frontend.order.sendRequest')}}
                         </ion-button> 
                      </div>

                       <a  style="font-size: 14px;text-transform: uppercase;font-weight: bold;"
                          @click="showOrder()">{{$t('frontend.home.checkout')}}
                        </a>   
                     
                    </ion-toolbar>
                  </ion-footer>

                  
                </ion-card>
                
              </div>

            </div>


              
          
          </div>
        </v-breakpoint>

      </div>

    </div>
</template>

<script>

  

import { add } from "ionicons/icons";
import { addIcons } from "ionicons";

addIcons({
  "ios-add": add.ios,
  "md-add": add.md,
  
});
 import Cart from '../components/Cart'
 import Guess from '../components/Guess'
import { Api } from '../../backoffice/api/api.js';
import { EventBus } from '../event-bus';
 import Products from './ProductsGrid'
 import { QrcodeStream } from 'vue-qrcode-reader'
 import { VBreakpoint } from 'vue-breakpoint-component'
 import Moment from 'moment'
 import moment from 'moment-timezone';
 import LibCodes from 'zipcodes'
 import PaymentModal from '../components/PaymentModal'
 import { payAuthorizeNet } from '../../backoffice/api/payments.js';
 import { Commons } from '../commons'




export default {
  name: "HomeGrid",
  props: {
  }, 
  created: async function(){ 
       //  LO DE LOS PROPS
    this.menuListSinCatering = this.$store.state.menuSinCatering || [];
    this.menuListConCatering = this.$store.state.menuConCatering || [];
    this.categoryMenuListSinCatering = this.$store.state.categoryMenuListSinCatering || [];
    this.categoryMenuConCatering = this.$store.state.categoryMenuConCatering || [];
    this.restaurantSelectedId = this.$store.state.restaurantActive.restaurantId || ''; 
    this.products = this.$store.state.products|| [];
    this.variants = this.$store.state.variants|| [];
    this.staffName = this.$store.state.staffName || '';
    this.staffId = this.$store.state.staffId || '';
    this.taxesName = this.$store.state.tax.taxesName || ''; 
    this.taxes = this.$store.state.tax.taxesName || 0;
    this.shippingName = this.$store.state.shipping.shippingName || '';
    this.shipping = this.$store.state.shipping.shipping || 0; 

    

     if(this.$route.params.isCatering){
        this.isCatering = true;
        this.categories = this.categoryMenuConCatering;
        this.filterCategories = this.categoryMenuConCatering;
        this.menuListInHome = this.menuListConCatering;
     }
     else{
      this.categories = this.categoryMenuListSinCatering;          
      this.filterCategories = this.categoryMenuListSinCatering;
      this.menuListInHome = this.menuListSinCatering;
     }

    if(this.$store.state.customer._id){
      this.clientId= this.$store.state.customer._id;            
    }

    this.order = this.$store.state.order;
    this.configuration = this.$store.state.configuration;
    this.restaurantActive = this.$store.state.restaurantActive    
    this.cart = this.$store.state.cart;
    this.thisMinHour = this.configuration.minHour;

    this.dateToDay = moment.tz(moment.tz.guess()).format('MM-DD-YYYY');
    if(this.isCatering)
      this.dateToDay = moment(this.dateToDay, "MM-DD-YYYY").add('days', this.configuration.cateringMarginDays);
   
    EventBus.$on('openDeliveryModal1', () => {         
      this.showDeliver();
      EventBus.$off('openDeliveryModal1');
    });

    
    EventBus.$on('openPickUpModal1', () => {     
      if(this.configuration.selectPickHour){
        this.showPickUp();  
        EventBus.$off('openPickUpModal1');      
      }        
      else
        this.sinPickAction(); 
      });

    EventBus.$on('openTableModal1', () => { 
         this.show(); 
         EventBus.$off('openTableModal1');                 
      });
      
    this.filterCategories = JSON.parse(JSON.stringify(this.categories))

    EventBus.$on('showProduct', (value) => {
      if(!value)
        this.filterCategories = JSON.parse(JSON.stringify(this.categories))
      this.showProduct = value;              
    });
    
    EventBus.$on('showOrder', (value) => {
      if(value){
        this.showOrder();
      }                     
    });
       
    if(this.order.OrderType){
      this.orderType = this.order.OrderType;
      this.changeOrderButton()
    }

   this.checkPickTime();

   if(this.order.addres1)
      this.addres1 = this.order.addres1;
    if(this.order.addres2)
      this.addres2 = this.order.addres2;
    if(this.order.zipCode)
      this.zipCodeFlag = this.order.zipCode;
    if(this.order.DateToPick)
      this.dateEstimateToPick = moment.tz(this.order.DateToPick, moment.tz.guess()).format('MM-DD-YYYY')
    if(this.order.HourToPick)
        this.hourEstimateToPick =  moment.tz(this.order.HourToPick , moment.tz.guess());
  },  
  data () {
    return {
      menuListSinCatering: [],
      menuListConCatering: [],
      categoryMenuListSinCatering:[],
      categoryMenuConCatering:[],
      restaurantSelectedId: '', 
      products: [], 
      variants: [],
      staffName: '' , 
      staffId: '' , 
      taxesName: '' ,
      taxes: 0 ,
      shippingName: '' ,
      shipping: 0 ,    
      menuListInHome: [],
      modelName: 'Customer',
      isDelivery: false,
      isPick: false,
      isTable: false,
      isCurbside: false,
      addressToDeliver:'',      
      hourToPick: '',
      tabeService:'',
      prod: [],
      cart: [],
      filterCategories: [],
      categories: [],
      spinner: false,
      dots: false,
      timeToPick: true,
      rangeToPick: '',     
      orderType:'',     
      clientId: '',
      CustomerName: '', 
      email: '', 
      phone: '',      
      tableService:'',
      order:{},
      showProduct: false,
      categoryName: '',   
      categoryDescription: '',         
      state: '',
      city:'',
      allTypeOrder:{'Delivery':this.$t('frontend.app.deliver'), 'PickUp':this.$t('frontend.app.pickup'), 'On Table':this.$t('frontend.app.table'),'Curbside':this.$t('frontend.app.curbside'), },
      zipCodeFlag: '',
      addres1: '',
      addres2: '',
      thisMinHour: '',
      licencePlate: '',
      vehicleModel: '',
      vehicleColor: '',
      key: 0,
      dateToDay: moment.tz(moment.tz.guess()).format('YYYY-MM-DD'),
      configuration: {},
      restaurantActive: {},      
      keyUpdateOrder: 1,
      segmentValue: 'order',
      minDay: moment.tz(moment.tz.guess()).format('YYYY-MM-DD'),
      key1: 1,
      key2: 3,
      isTicket: false,
      productKey: 2,
      categorySelected: '',
      menuactive: 'grid',
      sideBarOpenFlag: false,
      slideOpts:{speed: 400, slideShadows: true, initialSlide:1,  slidesPerView: 3,},
      spinnerTicket: false,
      isService: false,
      isCatering: false,
      hourEstimateToPick:'',
      dateEstimateToPick: this.dateToDay,

      keyForceUpdate: 0,
      
      




    }
  }, 
  components:{
    vueProduct: Products,
    VBreakpoint: VBreakpoint,
    QrcodeStream: QrcodeStream,
    Cart: Cart,
    Guess: Guess,
  },  
  methods: {

    handleInput(value){
      const query = value.toLowerCase();
      requestAnimationFrame(() => {       
        let cat2 = this.categories.filter(p => p.Name.toLowerCase().indexOf(query) > -1
                                    ||  p.Description.toLowerCase().indexOf(query) > -1)
        if(cat2.length> 0)
          this.filterCategories = cat2
        else
          this.filterCategories = this.categories  
      });
    },

    async changeMenu(id){
      this.dots = true;   
     // this.spinner = true;
      await Api.categoryByMenuId(id).then(response => {        
         if(response.status === 200){
         this.categories = response.data; 
         this.filterCategories = response.data;     
          this.dots=false     
         }        
      })
      .catch(e => {
        this.dots = false
        console.log(e)
      });
     //   

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
     
    productsByCategory(categoryId, categoryName, Service, categoryDescription){ 
      this.categoryDescription = categoryDescription;
      this.categoryName = categoryName;
      this.categorySelected=categoryId;
      this.isService = Service;
      this.prod = this.products.filter(p => p.CategoryId === categoryId && p.Available === true);

      let c1 = this.categories.filter(c => c.ParentId === categoryId);

      for(var i=0; i< c1.length; i++){
        let p =this.products.filter(p => p.CategoryId === c1[i]._id)
        p.forEach( p => this.prod.push(p));
      }

      this.showProduct = true;
      this.productKey ++;
    },
 
    
    showDeliver () {
      this.$modal.show('delivery-modal');
        },
    
    hideDeliver () {
      this.$modal.hide('delivery-modal');
        },

    saveDeliver(){
      if(this.addres1 ===''  ||this.zipCodeFlag == '')
        return this.alertRequiredDatas('');

      this.orderType = "Delivery"
      EventBus.$emit('updateOrderType', this.orderType);
      this.address = this.addres1 +' '+ this.addres2 +' State: '+ this.state +' City:'+ this.city + ' ZipCode: '+ this.zipCodeFlag;
          
      this.order.OrderType = "Delivery";
      this.changeOrderButton(); 
      this.order.AddressToDeliver = this.address; 
      this.order.addres1 = this.addres1; 
      this.order.addres2 = this.addres2; 
      this.order.zipCode = this.zipCodeFlag; 
      this.order.ClientId = this.clientId,  

      this.$store.commit('setOrder', this.order);         
      
      this.openToast(this.allTypeOrder[this.orderType] + ': ' + this.address)  
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
        return this.alertRequiredDatas('');

    this.orderType = "Curbside"
    EventBus.$emit('updateOrderType', this.orderType);
    this.hourToPick = Moment(this.thisMinHour, 'HH:mm').toISOString();
    // this.hourToPick = this.thisMinHour;
   
    this.order.OrderType = "Curbside";
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

  ValidateHour(value){

    let now = value

    if(Moment(value).isValid())
      now = Moment(value).format('HH:mm')
    this.key ++;     
   

    let min = Moment(this.thisMinHour).toISOString();
    min = moment.tz(min).format('HH:mm') ;

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

  savePickUp () {

    if(this.thisMinHour === '' || this.dateToDay === '')
        return this.alertRequiredDatas('');

    this.orderType = "PickUp"
    EventBus.$emit('updateOrderType', this.orderType);
    this.hourToPick = Moment(this.thisMinHour, 'HH:mm').toISOString();
    // this.hourToPick = this.thisMinHour;
   
    this.order.OrderType = "PickUp";
    this.changeOrderButton();
    this.order.HourToPick =  this.hourToPick;
    this.order.DateToPick =   Moment(this.dateToDay).toISOString();
    this.order.ClientId = this.clientId,  

    this.$store.commit('setOrder', this.order);        
   
    this.openToast(this.allTypeOrder[this.orderType] + ': ' + moment.tz(this.hourToPick, moment.tz.guess()).format('hh:mm A')  )

    this.hidePickUp();
    },

      getReservationHour(thisHour){
      return  moment.tz(thisHour, moment.tz.guess()).format('hh:mm A') 
    },



    async deliveryAction() { 
      
       let zipZCode = '';
       let aadress= '';
       if(this.order.AddressToDeliver){
         const zz = this.order.AddressToDeliver.split('ZipCode: ');
         const aa = this.order.AddressToDeliver.split('State:'); 
         if(zz.length>1)
          zipZCode = parseInt(zz[1])
         if(aa.length > 1) 
         aadress = aa[0]
       }
       const alert = await this.$ionic.alertController
      .create({
        cssClass: 'my-custom-class',
        header: this.$t('frontend.home.deliverDetail') ,
        inputs: [  
          { type:'text', name: 'address',id:'address-id', value: aadress, placeholder: this.$t('frontend.home.address') }, 
          { type:'text', name: 'address2',id:'address2-id', placeholder: this.$t('frontend.home.address')+2 }, 
          { type:'number', name: 'zipCode',id:'code-id', value: zipZCode, placeholder: this.$t('frontend.orderType.code'),
      
        },        
        ],  
        buttons: [
          {text: this.$t('frontend.home.cancel'),role: 'cancel', cssClass: 'secondary',
            handler: () => {                
            },
          },
          {
            text: this.$t('frontend.home.acept'),
            handler: async (data) => {
                if(data.address==='' || data.zipCode ==='')
                  return this.alertRequiredDatas(''); 
                  
              let code = await this.ValidateCode(data.zipCode); 
             

              if(code){
                
                this.orderType = "Delivery"
                EventBus.$emit('updateOrderType', this.orderType);
                this.address = data.address +' '+ data.address2 +' State: '+ this.state +' City:'+ this.city + ' ZipCode: '+ data.zipCode;
                                 
                this.order.OrderType = "Delivery";
                this.changeOrderButton();
                this.order.AddressToDeliver = this.address; 
                this.order.ClientId = this.clientId,  

                this.$store.commit('setOrder', this.order);              
                
                
                this.openToast(this.allTypeOrder[this.orderType] + ': ' + this.address)
              }     
              
            },
          },
        ],
      })
      // .then(a => a.present())
      return alert.present();
     
    },

    

    sinPickAction() {
        this.orderType = "PickUp"
        EventBus.$emit('updateOrderType', this.orderType);
        this.hourToPick = ''
              
        this.order.OrderType = "PickUp";
        this.changeOrderButton(); 
        this.order.HourToPick = moment.tz(this.hourToPick, moment.tz.guess()).format('hh:mm A');
        this.order.DateToPick =   Moment(this.dateToDay).toISOString();
        this.order.ClientId = this.clientId,
        this.$store.commit('setOrder', this.order);    
        
        this.showProduct = false;
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
              this.isCurbside = false;
              this.isPick = false;
              this.isTable = true;             
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

    alertRequiredDatas(mss){
      return  this.$ionic.alertController
      .create({
          cssClass: 'my-custom-class',
          header: 'Error',
          message: this.$t('frontend.home.errorRequired') + ' '+ mss,
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

    alertNoTimeToPick(min){
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

    changeOrderButton: function(){     
       if(this.orderType === 'Delivery' ){         
        this.isDelivery = true;
        this.isPick = false;
        this.isTable = false;  
        this.isCurbside = false;
        
       }
      if(this.orderType === 'PickUp' ){
        this.isDelivery = false;
        this.isPick = true;
        this.isTable = false;   
        this.isCurbside = false;
        
       }
       if(this.orderType === 'On Table' ){
        this.isDelivery = false;
        this.isPick = false;
        this.isTable = true;
        this.isCurbside = false; 
                
       }
        if(this.orderType === 'Curbside' ){
          this.isDelivery = false;
          this.isPick = false;
          this.isTable = false;
          this.isCurbside = true;                 
       }
     
    },

    alertCodeNotValid(){
    return  this.$ionic.alertController
    .create({
        cssClass: 'my-custom-class',
        header: 'Error',
        message: this.$t('frontend.home.zipCodeNotValid'),
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

    ValidateCode(event){
    
     var hills = LibCodes.lookup(event);   
    if(!hills){
      this.state = "";
      this.city = "";
      return this.alertCodeNotValid(), false;
    }  
    if(this.configuration.zipCodes.length > 0){
      const zip = this.configuration.zipCodes.filter(zc => zc.ZipCode === event);
      if(! zip.length >0 ){
        this.state = "";
        this.city = "";
        return this.alertNotZoneDelever(), false;        
      }
      else{
        this.state = hills.state;
        this.city = hills.city;
        this.openShowCodeDetail(this.state, this.city)
        return true;
      }      
    }
    
    
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
  
    async openToast(message) {
    return this.$ionic.toastController
    
      .create({
        message: message,
        duration: 2000,
        position: 'top',
        color:'success'
      })
    .then(a => a.present())
  },

   async openShowCodeDetail(city, state) {
    return this.$ionic.toastController
    
      .create({
        message: city +' '+ state,
        duration: 2000,
        position: 'top',
        color:'success'
      })
    .then(a => a.present())
  },

  showOrder(){   
        this.$router.push({ name: 'OrderFront',  params: {isCatering: this.isCatering } }); 
     
  },


    goHome: function(){ 
      this.order = {}      ;
      this.cart = [];
      this.$store.commit('setCart', []);
      this.$store.commit('setOrder', {}); 
      this.keyUpdateOrder ++;     
      this.showProduct = false;
      this.categorySelected='';
      this.isDelivery = false;
      this.isPick = false;
      this.isTable= false;
      this.isCurbside= false;      
      // this.hideSideBar();
    },   

    validateBeforePay(){

      let mss = '';
      let flag = 1;

      if(this.isCatering && !this.$store.state.guess._id){
         mss += this.$t('frontend.order.requiredCustomer') +'. ';
          flag = 0;
      }
      else if(this.order.OrderType !== 'On Table'){ 
         this.clientId= this.$store.state.guess._id || '';
         this.CustomerName= this.$store.state.guess.Name || '';
         this.email= this.$store.state.guess.EmailAddress || '';
         this.phone= this.$store.state.guess.Phone || '';   

        if(this.CustomerName ==='' || this.email === '' || this.phone === ''){
              mss += this.$t('frontend.order.requiredCustomer') +'. ';
              flag = 0;
        }               
      } 
      if(!this.order.OrderType){       
        mss += this.$t('frontend.order.requiredOrderType') +'. ';
        flag = 0;
      }
      if(flag === 0) return mss;
      return flag;
    },
  
    buildOrder(){ 
       this.order = this.$store.state.order;
       this.order.Products = this.$store.state.cart;
        if(this.staffName !='')
            this.order.StaffName = this.staffName;
        if(this.staffId !='')
            this.order.staffId = this.staffId        

        if(this.$store.state.guess._id)
          this.order.ClientId = this.$store.state.guess._id;
        if(this.$store.state.guess.Name)
          this.order.CustomerName = this.$store.state.guess.Name ;
        if(this.$store.state.guess.EmailAddress)
          this.order.CustomerEmail = this.$store.state.guess.EmailAddress;
        if(this.$store.state.guess.Phone)
          this.order.CustomerPhone = this.$store.state.guess.Phone;
        
        this.order.OrderForCatering = false; 
        this.order.Date = this.date;  
        if(this.isCatering){
            this.order.State = 7;  
            this.order.OrderForCatering = true; 
        }
        
        this.$store.commit("setOrder", this.order);
           
    },

    quotation(){
        let quo = 0;
        if(this.configuration.percentPayForQuotation > 0 && this.configuration.payForQuotation ){
          quo = this.configuration.percentPayForQuotation;
        }
        return quo.toFixed(2);

    },

    openCardPayment: async function(){
       
        this.order = this.$store.state.order;
        if(!this.order.Total) return 
            
        const flag = this.validateBeforePay();
        console.l
        if(flag !== 1 )
            return this.alertRequiredDatas(flag);
        this.buildOrder()
        let tt = parseFloat(this.order.Total).toFixed(2);
        let returnTo1 = 'OrderView'
        if(this.isCatering){
          tt = this.quotation();
          returnTo1 = 'OrderCatering';
        } 

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
                Total: tt,
                Tax:  this.taxes.toString(),
                TaxName: this.taxesName,     
                restaurantId: this.restaurantSelectedId,
                payMethod: this.restaurantActive.payMethod  ,  
                RestaurantName: this.restaurantActive.restaurantName, 
                currency: this.restaurantActive.currency,               
                returnTo: returnTo1,
                isTicket: this.isTicket,               
              },
            },
          })
          .then(m => m.present())  

    },

    saveAsTicket: async function(){
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

    getFormatPrice(price){
      const result = new Intl.NumberFormat('en', {style: "currency", currency: this.restaurantActive.currency} ).format(price)
      return result;
    },

    hideSideBar(){
       document.getElementById('sideBar').style.display = 'none'
       document.getElementById('sideBarOpen').classList.remove("menu-col-8"); 
       document.getElementById('sideBarOpen').classList.add('menu-col-12'); 
       this.sideBarOpenFlag = true;
    },
    showSideBar(){
      document.getElementById('sideBar').style.display = 'block'
      document.getElementById('sideBarOpen').classList.remove("menu-col-12"); 
      document.getElementById('sideBarOpen').classList.add('menu-col-8'); 
      this.sideBarOpenFlag = false;
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

   

   recivePaymentInCloseTicket: async function(res){  

        try {
            this.order.Payment = [{
            state: 1,
            total: res.total,
            paymentInfo: res, 
            PaymentMethod:res.method + ' '+ res.accountType+ ' '+ res.accountNumber
            }]   ;        
            this.order.State = 5;  

            const response = await Api.putIn('Order', this.order)
            if(response.status === 200 && response.statusText === "OK"){
                  this.spinner = false;
                  const paymentEntry = {                       
                            "Method": res.method,
                            "Payment": res.total,
                            "InvoiceNumber": res.transId,
                            "ModelId": response.data._id,
                            "ModelFrom": "Order",
                             "StaffName": this.order.StaffName,                    
                    }
                    await Api.postIn('allpayments', paymentEntry);
                  if(this.clientId !=='' ) await Commons.getTickets();  
                  await this.finishPayment(this.order, true); 
                  this.$store.commit('setAllTickets',[])  ;  
            }
            
        } catch (error) {            
            console.log(error)
            this.spinner = false; 
        }
      
    },

    recivePaymentCatering: async function(res){ 
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
                   if (this.staffName !== '') return this.$router.push({ name: ' Order' })  
                    return this.$router.push({ name: 'ListOrder' })  
                }
                
            } catch (error) {            
                console.log(error)
                this.spinner = false;
            }        
        },

    recivePayment: async function(res){  

      if(this.isCatering) return this.recivePaymentCatering(res);

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

            //  for(var i=0; i< this.order.Products.length; i++){
            //   this.order.Products[i].State = 1;
            // }  

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
                    console.log('AKIIIIII');
                    await this.$store.commit('setOrder', response.data);
                    await this.getTickets();
                    return this.$router.replace({ name: 'OrderFront' }) 
                  }                 
                }
                 
           }
            
        } catch (error) {            
            console.log(error)
            this.spinner = false;
        }
      
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

    async closeReservation(){
        if(this.order.CodeToDiscount !== ''){
             await Api.getReservationByCode(this.order.CodeToDiscount)
            .then(async response => {                 
                response.data.State = 6;
                await Api.putIn('Reservation',response.data);

                Commons.getListReservation();
            })
            .catch(e => {              
              console.log(e); 
            }) 
        }
    },

    async getOrders(){
      if(this.clientId =='')
        return false;
      this.spinner = true
       try {
         const response = await Api.getCustomerOrders(this.clientId)
        if(response.status === 200){
          this.$store.commit('setAllOrder', response.data)           
          this.spinner = false   
        }
        else
          this.spinner = false  
       } catch (error) {
         this.spinner = false 
            console.log(error);
       }       
    },

    async finishPayment(value, flag){
      if(this.clientId != '')  await this.getOrders();  
      if(flag){
        Commons.sendOrderEmail(value);
        this.goodPaymentToast();                  
        if(this.order.Discount > 0 && this.order.CodeToDiscount){
             await this.closeReservation(); 
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
        else return this.forceUpdateFunction();             
          
        //  return this.$router.replace({ name: 'Home' })  
        
         
    },

    forceUpdateFunction(){      
        this.keyForceUpdate ++;
        this.goHome();
      this.$forceUpdate();
    },

    noAuthorizedPayment(){
      this.spinner = false;
       return  this.$ionic.alertController
          .create({
              cssClass: 'my-custom-class',
              header: 'Error',
              message: this.$t('frontend.payment.insuficientFunds'),
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

    closeTicket: async function(){ 
      try {
        this.spinner = true;
        let autho = true;
        if(this.restaurantActive.payMethod !== 'TSYS')
          autho =  await this.generalAuthorization();
        if(autho){
          const invoiceNumber = this.order.AuthorizationPayment[0].paymentInfo.transId;
          const moto = this.order.AuthorizationPayment[0].paymentInfo.moto;

          const response = await payAuthorizeNet.captureOrder(invoiceNumber, moto, this.restaurantSelectedId, this.restaurantActive.payMethod,);      
          delete this.order.AuthorizationPayment;
          this.recivePaymentInCloseTicket(response);
        }
        else
          this.noAuthorizedPayment()
        
      } catch (error) {
        this.spinner = false;
        console.log(error);
        
      }

    
    },

    updateAuthorization: async function(){
     const autho =  await this.generalAuthorization();
     if(!autho)        
      return this.noAuthorizedPayment()
    },

     generalAuthorization: async function(){
       this.order = this.$store.state.order;
      
      const data =  {         
        restaurantId: this.restaurantSelectedId,
        payMethod: this.restaurantActive.payMethod,
        total: this.order.Total,
        tax: ((parseFloat(this.order.Taxe) * parseFloat(this.order.SubTotal) )/ 100).toFixed(2),
        tip: ((parseFloat(this.order.Tip) * parseFloat(this.order.SubTotal) )/ 100).toFixed(2),
        taxName: this.taxesName,         
        products: this.$store.state.cart,  
        firstName : this.order.CustomerName        
      }
      if(this.order.AuthorizationPayment){
       
        if(this.order.AuthorizationPayment[0].paymentInfo.transId){

          try {

            this.spinner = true;            
            data.invoiceNumber = this.order.AuthorizationPayment[0].paymentInfo.transId;
            const moto = this.order.AuthorizationPayment[0].paymentInfo.moto;
            if(this.order.AuthorizationPayment[0].paymentInfo.accountNumber)
              data.cardNumber = this.order.AuthorizationPayment[0].paymentInfo.accountNumber;

            const response = await payAuthorizeNet.firstAuthorizeOrder(data, moto);
            if(response){
               this.order.AuthorizationPayment = [{
                state: 1,
                total: response.total,
                paymentInfo: response, 
                PaymentMethod:response.method + ' '+ response.accountType+ ' '+ response.accountNumber
              }];
              this.buildOrder();
                
              const responseOrd = await Api.putIn('Order', this.order)
              await this.$store.commit('setOrder', responseOrd.data);
              this.spinner = false;
              return true;
            } 
            return false;          
              
          } catch (error) {
            this.spinner = false;
            console.log(error);            
          }

        }
        else{
          return false;
        }
      }
      else{
        return false;
      }
    },

    async refreshTicket(){
      this.spinnerTicket = true;
      try {
        const response = await Api.fetchById("Order", this.order._id)  
        if(response.status === 200){
           if(response.data.State === 5 ) return this.finishPayment(response.data)
          this.$store.commit('setOrder', response.data);          
          const cartTicket = this.cart;
          const cartOrder = response.data.Products
          for (const cart1 of cartTicket) {
            for (const order1 of cartOrder) {
              if(cart1.ProductId === order1.ProductId ){
                 cart1.State = order1.State;  
              }                             
            }              
          }
          this.$store.commit('setCart', cartTicket );
          this.order = response.data;
          this.cart = cartTicket;
          this.spinnerTicket = false;
          }
        else
         this.spinnerTicket = false;
        
      } catch (error) {
        console.log(error);
         this.spinnerTicket = false;
        
      }
     
    },

    // CATERING A PARTIR DE AQUI

    showDeliveryCatering () {
      this.$modal.show('catering-delivery');
    },
      
    hideDeliverCatering () {
      this.$modal.hide('catering-delivery');
    },

    showPickUpCatering(){
      this.$modal.show('catering-pickup');
    },
 
    hidePickUpCatering () {
      this.$modal.hide('catering-pickup');
      },

    saveDeliveryCatering(){
      if(this.addres1 ===''  ||this.zipCodeFlag == '' 
      || this.dateEstimateToPick ==='' || this.hourEstimateToPick === '' )
        return this.alertRequiredDatas();

     
      this.address = this.addres1 +' '+ this.addres2 +' State: '+ this.state +' City:'+ this.city + ' ZipCode: '+ this.zipCodeFlag; 
      this.orderType = 'Delivery'      
      this.order.OrderType = "Delivery";      
      this.changeOrderButton(); 
      this.order.AddressToDeliver = this.address; 
      this.order.addres1 = this.addres1; 
      this.order.addres2 = this.addres2; 
      this.order.zipCode = this.zipCodeFlag; 
      this.order.HourToPick = Moment(this.hourEstimateToPick).toISOString()  
      this.order.DateToPick = Moment(this.dateEstimateToPick).toISOString()
      if(this.$store.state.customer._id)
       this.order.ClientId = this.$store.state.customer._id;  
      this.$store.commit('setOrder', this.order);
      
      this.openToast(this.allTypeOrder[this.orderType] + ': ' + this.address)  
      this.hideDeliverCatering();
    },

    savePickUpCatering () {   
      if(this.hourEstimateToPick === '' || this.dateEstimateToPick === '')
        return this.alertRequiredDatas();

   
    this.hourToPick = this.hourEstimateToPick;        
    this.order.OrderType = "PickUp";
    this.orderType = 'PickUp'
    this.changeOrderButton();
    this.order.HourToPick =  Moment(this.hourEstimateToPick).toISOString();
    this.order.DateToPick =  Moment(this.dateEstimateToPick).toISOString();   
     if(this.$store.state.customer._id)
       this.order.ClientId = this.$store.state.customer._id;   
        
    this.$store.commit('setOrder', this.order);
    this.openToast(this.allTypeOrder[this.orderType] + ': ' + this.dateEstimateToPick + ' : ' + this.hourEstimateToPick)

    this.hidePickUpCatering();
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
        this.key ++;
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

    async sendOrderCatering(){
     
        const flag = this.validateBeforePay();
        console.l
        if(flag !== 1 )
            return this.alertRequiredDatas(flag);
        this.buildOrder()
       
        if(this.configuration.payForQuotation && this.configuration.percentPayForQuotation > 0){
          return this.openCardPayment();
        }
        else{
              try{
                this.spinner = true
                const response1 = await Api.postIn('Order', this.order);       
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

    changeSegmentValue(value){
      this.order = this.$store.state.order;
      this.cart = this.$store.state.cart;
      this.segmentValue=value;
      this.keyUpdateOrder++;
    }

  },
};

</script>


<style scoped>
#sideBarMovil{
  display: block;
}
#sideBarOpenMovil{
  display: none;
}
.disable-hover:hover{
    --background-hover: red;
    --background-hover-opacity: 1;
    --color-hover: grey;
}

.button-disabled-menu{
    --opacity: 0.6;
    /* pointer-events: none; */
    --ion-color-base: grey !important;
    --box-shadow: -2px -3px -1px 2px rgba(0,0,0,0.2),0 -2px -2px 0 rgba(0,0,0,0.14),0 -1px -5px 0 rgba(0,0,0,0.12) !important;
}

  .menu-col-2{
        flex: 0 0 calc(calc(2 / var(--ion-grid-columns, 12)) * 100%);
        width: calc(calc(2 / var(--ion-grid-columns, 12)) * 100%);
        max-width: calc(calc(2 / var(--ion-grid-columns, 12)) * 100%);
    }
      .menu-col-5{
        flex: 0 0 calc(calc(5 / var(--ion-grid-columns, 12)) * 100%);
        width: calc(calc(5 / var(--ion-grid-columns, 12)) * 100%);
        max-width: calc(calc(5 / var(--ion-grid-columns, 12)) * 100%);
        padding: 0 5px;
    }
    .menu-col-6{
        flex: 0 0 calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
        width: calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
        max-width: calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
        padding: 0 5px;
    }
    .menu-col-4{
    flex: 0 0 calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(4 / var(--ion-grid-columns, 12)) * 100%);
    padding: 0 5px;
    }
    .menu-col-12{
        flex: 0 0 calc(calc(12 / var(--ion-grid-columns, 12)) * 100%);
        width: calc(calc(12 / var(--ion-grid-columns, 12)) * 100%);
        max-width: calc(calc(12 / var(--ion-grid-columns, 12)) * 100%);
        padding: 0 5px;
    }
    .card-categories{
      float: left;
      margin: 0;    
      padding: 5px;
    }
    .card-categories .sc-ion-card-md-s img {
   
    width: 140px;
    }
    .card-categories ion-card{
    max-width: 420px !important;
    margin: 0 auto !important;
  }
    .card-categories .sc-ion-card-md-h:hover{
      box-shadow: 0 4px 1px 6px rgba(0,0,0,.2), 0 2px 2px 0 rgb(61 58 55 / 14%), 0 1px 5px 0 rgba(0,0,0,.12);
    }
    .card-categories .item-native{
          padding-inline-start: 0 !important;
    }
    .elipsy-center{
      text-overflow: ellipsis;
      overflow: hidden;
      display: -webkit-box; 
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;  
      text-align: center;
    }
    .opacity-active{
      opacity: 1;
      border: outset;
    }
    .opacacity-inactive{
     opacity: 0.65;
     border: none;
    }
    .swiper-pagination-bullet {
    width: 12px !important;
    height: 12px !important;
    opacity: 1 !important;
}
</style>