<template>
    <div>
        <div style="padding: 20px;">
            <!-- <h3>{{$t('backoffice.titles.controlPanel')}}</h3> -->

            <div v-if="spinner">
                <ion-spinner  name="lines" class="spinner"></ion-spinner>
            </div>

            <v-breakpoint v-if="!spinner">
                <div slot-scope="scope">

                    <div>
                        <ion-list>
                            <ion-item>
                                <ion-label>{{$t('frontend.menu.restaurant')}}</ion-label>
                                <ion-select interface="popover" :ok-text="$t('backoffice.form.messages.buttons.ok')" :cancel-text="$t('backoffice.form.messages.buttons.dismiss')"
                                @ionChange="changeRestaurant($event.target.value)" v-bind:value="restaurantId">
                                    <ion-select-option v-for="restaurant in allRestaurant" v-bind:key="restaurant._id" v-bind:value="restaurant._id" >{{restaurant.Name}}</ion-select-option>
                                </ion-select>
                            </ion-item>
                        </ion-list>
                    </div>

                    <ion-title v-if="!online" style="color: rgb(172 127 14)">
                        <span class="iconify" data-icon="twemoji:warning" data-inline="false" style="margin: 5px 0 0 15px; width: 18px;height: 18px;"></span>
                        {{$t('backoffice.form.fields.onlineMss')}}</ion-title>
                     <ion-title v-if="online" style="color: rgb(44 172 14)">
                        <span class="iconify" data-icon="emojione-v1:left-check-mark" data-inline="false" style="margin: 5px 0 0 15px; width: 18px;height: 18px;"></span>
                        {{$t('backoffice.form.fields.onlineMss1')}}</ion-title>
                                     
                    <ion-card v-if="!scope.noMatch && options.series[0].data.length > 0">  

                        <div                         
                           :class="scope.isSmall || scope.noMatch || scope.isMedium  ? ' menu-col-12 card-category' : ' menu-col-6 card-category'" >  
                           <ion-label>{{$t('backoffice.titles.payments')}}</ion-label>                     
                           <v-chart    style="margin: 0 auto;"                                                
                           :options="optionsPayment"  />
                        </div>

                        <div
                            :class="scope.isSmall || scope.noMatch || scope.isMedium  ? ' menu-col-12 card-category' : ' menu-col-6 card-category'" >
                           <ion-la> Restaurant's Rating </ion-la>
                            <v-chart   style="margin: 0 auto;"                                                     
                             :options="options2"  />
                        </div>                        
                    </ion-card>

                    <ion-card>
                        <ion-card-header>
                            {{$t('backoffice.titles.controlPanel')}} 
                        </ion-card-header>

                        <div :class="scope.isSmall || scope.noMatch ? ' menu-col-12 card-category' : ' menu-col-6 card-category'" style="padding: 20px;">
                 
                            <ion-chip v-tooltip="'Description.'" v-if="hasPermission('canViewUser')" @click="$router.push('/user')"  color="secondary" style=" width: 70%;border: 1px solid grey;">
                              <span class="iconify"  color="primary" data-icon="simple-icons:codechef" data-inline="false"></span>
                                <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageUsers') }}</ion-label>   
                            </ion-chip>
                            <br>
                            <ion-chip v-tooltip="'Description.'" v-if="hasPermission('canViewOccupation')" @click="$router.push( '/occupation')"  color="secondary" style=" width: 70%;border: 1px solid grey;">
                                <span class="iconify" data-icon="tabler:tools-kitchen" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageOccupation') }}</ion-label>   
                            </ion-chip>
                            <br>
                            <ion-chip v-tooltip="'Description.'" v-if="hasPermission('canViewRole')"  @click="$router.push('/role')" color="secondary" style=" width: 70%;border: 1px solid grey;">
                                    <span class="iconify" data-icon="ls:cookpad" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageRoles') }}</ion-label>   
                            </ion-chip>
                            <br>
                            <ion-chip v-tooltip="'Description.'" v-if="hasPermission('canViewCustomer')"  @click="$router.push('/customer')" color="secondary" style=" width: 70%;border: 1px solid grey;">
                                    <span class="iconify" data-icon="raphael:people" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageCustomers') }}</ion-label>   
                            </ion-chip>
                        
                        </div>


                        <div :class="scope.isSmall || scope.noMatch ? ' menu-col-12 card-category' : ' menu-col-6 card-category'" style="padding: 20px;">
                 
                                <ion-chip v-tooltip="'Description.'" v-if="hasPermission('canViewCategory')"  @click="$router.push('/category')" color="secondary" style=" width: 70%;border: 1px solid grey;">
                                    <span class="iconify" data-icon="carbon:category-new-each" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageCategories') }}</ion-label>   
                                </ion-chip>
                                <br>
                                <ion-chip v-tooltip="'Description.'"  v-if="hasPermission('canViewProduct')" @click="$router.push('/product')"  color="secondary" style=" width: 70%;border: 1px solid grey;">
                                    <span class="iconify" data-icon="dashicons:products" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageProducts') }}</ion-label>   
                                </ion-chip>
                                <br>
                                <ion-chip v-tooltip="'Description.'" v-if="hasPermission('canViewProduct')" @click="$router.push('/product/service')"  color="secondary" style=" width: 70%;border: 1px solid grey;">
                                    <span class="iconify" data-icon="dashicons:businessman" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageServices') }}</ion-label>   
                                </ion-chip>
                                <br>
                                <ion-chip v-tooltip="'Description.'" v-if="hasPermission('canViewMenu')" @click="$router.push('/menu')" color="secondary" style=" width: 70%;border: 1px solid grey;">
                                    <span class="iconify" data-icon="bx:bx-food-menu" color="primary" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageMenus') }}</ion-label>   
                                </ion-chip>
                                <br>
                        </div>

                        <div :class="scope.isSmall || scope.noMatch ? ' menu-col-12 card-category' : ' menu-col-6 card-category'" style="padding: 20px;">
                        
                                <ion-chip v-tooltip="'Description.'" v-if="hasPermission('canViewOrder')" @click="$router.push( '/order')"  color="secondary" style=" width: 70%;border: 1px solid grey;">
                                    <span class="iconify" data-icon="mdi:order-bool-descending" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.viewOrders') }}</ion-label>   
                                </ion-chip>
                                <br>
                                <ion-chip v-tooltip="'Description.'" v-if="hasPermission('canViewOrder')" @click="$router.push( '/cateringOrder')"  color="secondary" style=" width: 70%;border: 1px solid grey;">
                                    <span class="iconify" data-icon="mdi:order-bool-descending" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.viewCateringOrders') }}</ion-label>   
                                </ion-chip>
                                <br>
                                <ion-chip v-tooltip="'Description.'" v-if="hasPermission('canViewOrderForDelivery')" @click="$router.push('/orderForDelivered')" color="secondary" style=" width: 70%;border: 1px solid grey;">
                                <span class="iconify" data-icon="mdi:truck-delivery-outline" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.titles.ordersForDelivery') }}</ion-label>   
                                </ion-chip>
                                <br>
                                <ion-chip v-tooltip="'Description.'" v-if="hasPermission('canViewOrder')" @click="$router.push('/ticket')" color="secondary" style=" width: 70%;border: 1px solid grey;">
                                <span class="iconify" data-icon="ph:ticket-duotone" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.titles.tickets') }}</ion-label>   
                                </ion-chip>
                        </div>

                        <div :class="scope.isSmall || scope.noMatch ? ' menu-col-12 card-category' : ' menu-col-6 card-category'" style="padding: 20px;">
                            
                            <ion-chip v-tooltip="'Description.'" v-if="hasPermission('canViewOtherCharge')"  @click="$router.push('/otherCharge')" color="secondary" style=" width: 70%;border: 1px solid grey;">
                                <span class="iconify" data-icon="si-glyph:money-bag" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageOtherCharges') }}</ion-label>   
                            </ion-chip>
                            <br>
                            <ion-chip v-tooltip="'Description.'" v-if="hasPermission('canViewTax')" @click="$router.push( '/tax')"  color="secondary" style=" width: 70%;border: 1px solid grey;">
                                <span class="iconify" data-icon="heroicons-outline:receipt-tax" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageTaxes') }}</ion-label>   
                            </ion-chip>
                            <br>
                            <ion-chip v-tooltip="'Description.'" v-if="hasPermission('canViewShipping')"  @click="$router.push('/shipping')" color="secondary" style=" width: 70%;border: 1px solid grey;">
                                <span class="iconify" data-icon="la:truck-pickup-solid" data-inline="false"></span>
                                <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageShippings') }}</ion-label>   
                            </ion-chip>
                            <br>
                            <ion-chip v-tooltip="'Description.'" v-if="hasPermission('canViewReservation')" @click="$router.push('/reservationbackoffice')" color="secondary" style=" width: 70%;border: 1px solid grey;">
                                <span class="iconify" data-icon="ic:baseline-access-time" data-inline="false"></span>
                                <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageReservation') }}</ion-label>   
                            </ion-chip>
                        </div>

                        <div :class="scope.isSmall || scope.noMatch ? ' menu-col-12 card-category' : ' menu-col-6 card-category'" style="padding: 20px;">

                                <!-- Aquí iba el menú -->
                                <ion-chip v-tooltip="'Description.'" v-if="hasPermission('canViewTable')" @click="$router.push('/table')" color="secondary" style=" width: 70%;border: 1px solid grey;">
                                <span class="iconify" data-icon="vs:table-o" data-inline="false"></span>
                                <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageTables') }}</ion-label>   
                                 </ion-chip>
                                <br>
                                <ion-chip v-tooltip="'Description.'" v-if="hasPermission('canChangeSetting')"  @click="$router.push('/aboutDataSettings')" color="secondary" style=" width: 70%;border: 1px solid grey;">
                                    <span class="iconify" data-icon="grommet-icons:restaurant" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageAboutSettings') }}</ion-label>   
                                </ion-chip>
                                <br>
                                <ion-chip v-tooltip="'Description.'" v-if="hasPermission('canChangeSetting')" @click="managePaymentSettings()"  color="secondary" style=" width: 70%;border: 1px solid grey;">
                                    <span class="iconify" data-icon="ic:twotone-payments" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.managePaymentSettings') }}</ion-label>
                                </ion-chip>
                                  <ion-chip v-tooltip="'Payments.'" v-if="hasPermission('canChangeSetting')" @click="$router.push('/payment')"  color="secondary" style=" width: 70%;border: 1px solid grey;">
                                    <span class="iconify" data-icon="ic:twotone-attach-money" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.managePyments') }}</ion-label>
                                </ion-chip>
                        </div>

                        <div :class="scope.isSmall || scope.noMatch ? ' menu-col-12 card-category' : ' menu-col-6 card-category'" style="padding: 20px;">
                        
                            <ion-chip v-tooltip="'Description.'" v-if="hasPermission('canChangeSetting')"  @click="manageBasicSettings()" color="secondary" style=" width: 70%;border: 1px solid grey;">
                                <span class="iconify" data-icon="clarity:settings-line" data-inline="false"></span>
                                <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageBasicSettings') }}</ion-label>   
                            </ion-chip>
                            <br>
                            <ion-chip v-tooltip="'Description.'" v-if="hasPermission('canChangeSetting')"  @click="manageFunSettings()" color="secondary" style=" width: 70%;border: 1px solid grey;">
                                <span class="iconify" data-icon="clarity:file-settings-line" data-inline="false"></span>
                                <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageFunSettings') }}</ion-label>   
                            </ion-chip>
                            <br>
                            <ion-chip v-tooltip="'Description.'" v-if="hasPermission('canChangeSetting')" @click="manageColourSettings()"  color="secondary" style=" width: 70%;border: 1px solid grey;">
                                    <span class="iconify" data-icon="vaadin:palete" data-inline="false"></span>
                                    <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageColourSettings') }}</ion-label>   
                            </ion-chip>
                            <br>
                            <ion-chip v-tooltip="'Description.'" v-if="hasPermission('canChangeSetting')"   @click="manageKeySettings()" color="secondary" style=" width: 70%;border: 1px solid grey;">
                                <span class="iconify" data-icon="clarity:network-settings-solid" data-inline="false"></span>
                                <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.manageKeySettings') }}</ion-label>   
                            </ion-chip>
                            <br>
                            <ion-chip v-tooltip="'Description.'" v-if="hasPermission('canSuperUser')"   @click="manageSupportSettings()" color="danger" style=" width: 70%;border: 1px solid grey;">
                                <span class="iconify" data-icon="mdi:account-supervisor" data-inline="false"></span>
                                <ion-label style=" width: 80%; text-align: center;">{{ $t('backoffice.options.supportSettings') }}</ion-label>   
                            </ion-chip>
                        </div>
                    </ion-card>
                </div>
            </v-breakpoint>
           
        </div>
    </div>
</template>

<script>
import { Api } from '../api/api.js';
import ECharts from 'vue-echarts';
import { VBreakpoint } from 'vue-breakpoint-component'
import Modal from './SetDeviceDataModal.vue';
import Moment from 'moment'
import 'echarts';

export default {
    data(){
        return{
            optionsPayment: {
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: [],
                    type: 'line',
                    smooth: true
                }],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                    type: 'shadow',
                    },
                },
            },
            options: {
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: [],
                    type: 'line',
                    smooth: true
                }],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                    type: 'shadow',
                    },
                },
            },

            options2: {
                title: {
                    text: '',
                    subtext: '',
                    left: 'center'
                },
                grid: {
                     right: '25%',
                    left: 0,
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                // legend: {
                //     orient: 'vertical',
                //     left: 'left',
                //     data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                // },
                series: [
                    {
                        name: 'Rating by Star',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '50%'],
                        data: [
                            {value: 0, name: '1'},
                            {value:0, name: '2'},
                            {value: 0, name: '3'},
                            {value: 0, name: '4'},
                            {value: 0, name: '5'}
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            },
            spinner: false,

            allRestaurant: [],
            restaurantId: -1,
            
            item: 0,
            online: false,
        }
    },
    created: function(){  
        this.init()
    }, 
    components: {
        vChart: ECharts ,
        VBreakpoint: VBreakpoint,
    },
    methods: {    
        showHint(){
            alert("Hint")
        },
        showSetDeviceModal(){
            return this.$ionic.modalController
                .create({
                component: Modal,
                cssClass: 'my-custom-class',
                componentProps: {
                    data: {
                        
                    },
                    propsData: {
                        parent: this
                    },
                },
                })
                .then(m => m.present())
        },
        init(){
            this.spinner = true 

            this.initData()
            this.fetchAllRestaurant()
            console.log("RESTAURANTES")
            console.log(this.$store.state.user.RestaurantId)
            if(this.$store.state.user.RestaurantId){
                this.restaurantId = this.$store.state.user.RestaurantId
                let oneStart = 0;              
                let twoStart = 0;              
                let threeStart = 0;              
                let fourStart = 0;              
                let fiveStart = 0; 

                Api.fetchAll('Allpayments').then(response => {
                const payments= response.data; 
                 if(payments.length > 0)
                        {
                            payments.forEach(r =>{
                                this.optionsPayment.xAxis.data.push(Moment(r.date).format('YYYY-MM-DD')),                               
                                this.optionsPayment.series[0].data.push( parseFloat(r.Payment) - r.Refund - r.Void) ;                                              
                            });
                        }              
              })
              .catch(e => {
                console.log(e)
                
               
              });

                Api.fetchById("Restaurant",  this.restaurantId).then(response => {
                    console.log(0)                        
                    if(response.status === 200){ 
                        const rating =  response.data.rating 
                        this.online = response.data.Online; 
                                    
                        if(rating.length > 0)
                        {
                            rating.forEach(r =>{
                                this.options.xAxis.data.push(Moment(r.date).format('YYYY-MM-DD')),
                                this.options.series[0].data.push(r.rating) ;
                                console.log(r.rating >=4 && r.rating <=5)
                                if( r.rating >=1 && r.rating <=1.9) oneStart++;
                                if(r.rating >=2 && r.rating <=2.9) twoStart++;
                                if(r.rating >=3 && r.rating <=3.9) threeStart++;
                                if(r.rating >=4 && r.rating <=4.9) fourStart++;
                                if(r.rating ===5) fiveStart++;                          
                            });
                        }
                        this.options2.series[0].data['0'].value = oneStart            
                        this.options2.series[0].data['1'].value = twoStart            
                        this.options2.series[0].data['2'].value = threeStart            
                        this.options2.series[0].data['3'].value = fourStart            
                        this.options2.series[0].data['4'].value = fiveStart

                        //Load modal set device
                        this.showSetDeviceModal();

                        this.spinner = false;   
                                
                    }  
                })
                .catch(e => {
                    console.log(e)
                    this.spinner = false
                });
            } 
        },
        initData(){
            this.options = {
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: [],
                    type: 'line',
                    smooth: true
                }],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                    type: 'shadow',
                    },
                },
            };

            this.options2 = {
                title: {
                    text: '',
                    subtext: '',
                    left: 'center'
                },
                grid: {
                     right: '25%',
                    left: 0,
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                series: [
                    {
                        name: 'Rating by Star',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '50%'],
                        data: [
                            {value: 0, name: '1'},
                            {value:0, name: '2'},
                            {value: 0, name: '3'},
                            {value: 0, name: '4'},
                            {value: 0, name: '5'}
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };

            this.allRestaurant = []
            this.restaurantId = -1

        },
        fetchAllRestaurant(){
            Api.fetchAll('Restaurant').then(response => {
                if(response.status === 200){

                    let restaurants = response.data
                    let myRestaurants = this.$store.state.user.AllRestaurant

                    restaurants.forEach(restaurant => {
                        if (myRestaurants.indexOf(restaurant._id) != -1)
                            this.allRestaurant.push(restaurant)
                    });

                    console.log("AllRestaurant")
                    console.log(this.allRestaurant)
                }
            })
            .catch(e => {
                console.log(e)
            });
        },
        changeRestaurant(value){
            this.restaurantId = value

            this.relogin()
        },
        relogin(){
            this.spinner = true
            let userLogin = this.$store.state.user
            userLogin.RestaurantId = this.restaurantId
            // this.$store.commit("setAuthentication", true);
            // this.$store.commit("setUser", userLogin);
            //Set token
            // Api.setTokenId(userLogin.token);
            Api.setRestaurantId(this.restaurantId);
            this.getConfig();

            Api.fetchById("staff", userLogin._id)
            .then(response => {
                    let roles = []
                    let staffMember = response.data
                    staffMember.Roles.forEach(rol_id => {
                        Api.fetchById("rol", rol_id).then(response => {
                            roles.push(response.data);
                        })
                    });
                    this.$store.commit("setRoles", roles);
                    this.init();
            })
            .catch(e => {
                console.log(e)
                this.spinner = false
            });
        },
        getConfig: function(){
            Api.fetchAll("Setting").then(response=> {
                let settings = [];
                settings = response.data;
                if (settings.length > 0)
                {
                    var allStyles = settings[settings.length -1].AllStyles;
                    document.querySelector('style').innerHTML += allStyles;

                }
            })
            .catch(e => {
            console.log(e)
            });
        },
        hasPermission(permission){
            
            let res = false;
            if (this.$store.state.authenticated)
            {
                let roles = this.$store.state.roles;
                for (let index = 0; index < roles.length; index++) {
                    switch(permission){                        
                        case 'canViewMenu':
                            res = roles[index].canViewMenu;
                            break;
                        case 'canViewCategory':
                            res = roles[index].canViewCategory;
                            break;
                        case 'canViewProduct':
                            res = roles[index].canViewProduct;
                            break;
                        case 'canViewVariantGroup':
                            res = roles[index].canViewVariantGroup;
                            break;
                        case 'canViewCustomer':
                            res = roles[index].canViewCustomer;
                            break;
                        case 'canViewTable':
                            res = roles[index].canViewTable;
                            break;
                        case 'canViewTax':
                            res = roles[index].canViewTax;
                            break;
                        case 'canViewShipping':
                            res = roles[index].canViewShipping;
                            break;
                        case 'canViewOtherCharge':
                            res = roles[index].canViewOtherCharge;
                            break;
                        case 'canViewReservation':
                            res = roles[index].canViewReservation;
                            break;
                        case 'canViewUser':
                            res = roles[index].canViewUser;
                            break;
                        case 'canViewOccupation':
                            res = roles[index].canViewOccupation;
                            break;
                        case 'canViewRole':
                            res = roles[index].canViewRole;
                            break;
                        case 'canViewOrder':
                            res = roles[index].canViewOrder;
                            break;
                        case 'canViewOrderForDelivery':
                            res = roles[index].canViewOrderForDelivery;
                            break;
                        case 'canChangeSetting':
                            res = roles[index].canChangeSetting;
                            break;
                        case 'canSuperUser':
                            res = this.$store.state.user.IsSupport;
                            break;
                        default:
                            break;
                    }
                    if (res)
                    { 
                        return res;
                    }              
                }
            }
            return res;
        },
        manageBasicSettings(){
            const restaurantID = this.$store.state.user.RestaurantId
            if (restaurantID)
            {
                this.$router.push({
                    name: 'BasicSettingForm',
                    params: {
                        "settingId": restaurantID,
                    }
                });
            }
            else{
                this.$router.push({
                    name: 'BasicSettingForm',
                });
            }
        },
        managePaymentSettings(){
            const restaurantID = this.$store.state.user.RestaurantId
            if (restaurantID)
            {
                this.$router.push({
                    name: 'PaymentSettingsForm',
                    params: {
                        "settingId": restaurantID,
                    }
                });
            }
            else{
                this.$router.push({
                    name: 'PaymentSettingsForm',
                });
            }
        },
        manageFunSettings(){
            Api.fetchAll('Setting').then(response => {
            // console.log(response.data)
                let funSettings = [];
                funSettings = response.data;
                if (funSettings.length > 0)
                {
                    this.$router.push({
                        name: 'FunSettingForm',
                        params: {
                            "settingId": funSettings[funSettings.length - 1]._id,
                        }
                    });
                }
                else{
                    this.$router.push({
                        name: 'FunSettingForm',
                    });
                }
            })
            .catch(e => {
            console.log(e)
            });
        },
        manageColourSettings(){
            Api.fetchAll('Setting').then(response => {
            // console.log(response.data)
                let colSettings = [];
                colSettings = response.data;
                if (colSettings.length > 0)
                {
                    this.$router.push({
                        name: 'ColourSettingForm',
                        params: {
                            // "settingId": colSettings[colSettings.length - 1]._id,
                            "settingId": colSettings[0]._id,
                        }
                    });
                }
                else{
                     this.$router.push({
                        name: 'ColourSettingForm',
                    });
                }
            })
            .catch(e => {
            console.log(e)
            });
        },
        manageSupportSettings(){
            this.$router.push({
                name: 'Support',
            });
        },
        manageKeySettings(){
            const restaurantID = this.$store.state.user.RestaurantId
            if (restaurantID)
            {
                this.$router.push({
                    name: 'KeySettingForm',
                    params: {
                        "settingId": restaurantID,
                    }
                });
            }
            else{
                this.$router.push({
                    name: 'KeySettingForm',
                });
            }
        },
}

}
</script>

<style>

  .card-category{
      float: left;
      margin: 0;
      padding: 10px 2px;
    }

   .menu-col-6{
    flex: 0 0 calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
    width: calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
    max-width: calc(calc(6 / var(--ion-grid-columns, 12)) * 100%);
    padding: 0 5px;
    }
    .menu-col-12{
        flex: 0 0 calc(calc(12 / var(--ion-grid-columns, 12)) * 100%);
        width: calc(calc(12 / var(--ion-grid-columns, 12)) * 100%);
        max-width: calc(calc(12 / var(--ion-grid-columns, 12)) * 100%);
        padding: 0 5px;
    }

.tooltip {
  display: block !important;
  z-index: 10000;
}
 
.tooltip .tooltip-inner {
  background: #3880ff;
  color: white;
  border-radius: 10px;
  padding: 5px 10px 4px;
}
 
.tooltip .tooltip-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
  border-color: #3880ff;
  z-index: 1;
}
 
.tooltip[x-placement^="top"] {
  margin-bottom: 5px;
}
 
.tooltip[x-placement^="top"] .tooltip-arrow {
  border-width: 5px 5px 0 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}
 
.tooltip[x-placement^="bottom"] {
  margin-top: 5px;
}
 
.tooltip[x-placement^="bottom"] .tooltip-arrow {
  border-width: 0 5px 5px 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}
 
.tooltip[x-placement^="right"] {
  margin-left: 5px;
}
 
.tooltip[x-placement^="right"] .tooltip-arrow {
  border-width: 5px 5px 5px 0;
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}
 
.tooltip[x-placement^="left"] {
  margin-right: 5px;
}
 
.tooltip[x-placement^="left"] .tooltip-arrow {
  border-width: 5px 0 5px 5px;
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}
 
.tooltip.popover .popover-inner {
  background: #f9f9f9;
  color: #3880ff;
  padding: 24px;
  border-radius: 5px;
  box-shadow: 0 5px 30px rgba(#3880ff, .1);
}
 
.tooltip.popover .popover-arrow {
  border-color: #f9f9f9;
}
 
.tooltip[aria-hidden='true'] {
  visibility: hidden;
  opacity: 0;
  transition: opacity .15s, visibility .15s;
}
 
.tooltip[aria-hidden='false'] {
  visibility: visible;
  opacity: 1;
  transition: opacity .15s;
}

</style>