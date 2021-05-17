<template>
  <div id="customer" class="screen">

    <!-- <router-link to="/controlPanel"><ion-button expand="full" color="tertiary"><ion-icon name="hammer"></ion-icon>{{$t('backoffice.list.buttons.goToControlPanel')}}</ion-button></router-link>
    <router-link to="/table-form"><ion-button v-if="hasPermission('canCreateTable')" expand="full" color="primary"><ion-icon name="add"></ion-icon>{{$t('backoffice.list.actions.addANew')}} {{$t('backoffice.list.entitiesName.table')}}</ion-button></router-link> --> 

    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'ControlPanel'})"></ion-back-button>
            </ion-buttons>           

            <ion-label slot="end">
            <router-link to="/table-form">
                <ion-chip style="font-size: 30px" outline color="primary" v-if="hasPermission('canCreateTable')">
                    <ion-label><ion-icon name="add"></ion-icon></ion-label>
                </ion-chip>
            </router-link>
            </ion-label>

          </ion-toolbar>

          <ion-searchbar  
                @input="handleInput($event.target.value)" @ionClear="filterTables = tables"
                :placeholder="$t('frontend.home.search')">           
            </ion-searchbar>
    </ion-header>

    <ion-segment id="reservationSegment" scrollable
      @ionChange="segmentChanged($event.target.value)"
       :value="segmentValue"
        @input="value=segmentValue"
        style="widht: 100%">
        <ion-segment-button value="table">
              {{$t('backoffice.titles.tables')}}                   
        </ion-segment-button>
        <ion-segment-button value="orderTable">
              {{$t('backoffice.titles.tables')}} - Order           
        </ion-segment-button>
    </ion-segment>

    <ion-spinner  v-if="spinnerState"></ion-spinner>                  

    <div v-if="spinner">
        <ion-spinner name="lines" class="spinner"></ion-spinner>
    </div>
      
    <div v-if="!spinner && table">
      <div v-if="screenWidth < 600">
        <paginate
          name="languages"
          :list="filterTables"
          :per="8"
        >
          <ion-list>
            <ion-item-sliding v-for="table in paginated('languages')" v-bind:key="table._id">
              <ion-item>
                <ion-label>
                    <h2>{{ table.Name }}</h2>
                </ion-label>
                <ion-label>
                    <h3>{{ table.Description }}</h3>
                    <h3>{{ table.Capacity }}</h3>
                    <h3>{{ table.Barcode }}</h3>
                </ion-label>
                <span slot="end" class="iconify" data-icon="mdi:backburger" data-inline="false"></span>
              </ion-item>
              <ion-item-options side="end">
                <ion-item-option v-if="hasPermission('canEditTable')" color="primary" @click="editTable(table._id)">
                  <ion-icon slot="icon-only" name="create"></ion-icon>
                </ion-item-option>
                <ion-item-option v-if="hasPermission('canDeleteTable')" color="danger" @click="deleteTable(table._id)">
                  <ion-icon slot="icon-only" name="trash"></ion-icon>
                </ion-item-option>
                <ion-item-option color="success" >
                    <ion-icon slot="icon-only" name="list" @click="seeQrCode(table.Seats)"></ion-icon>
                </ion-item-option>
                <ion-item-option color="primary" v-if="(table.State=='Busy' || table.State=='Dirty') && hasPermission('canEditTable')">
                    <ion-icon slot="icon-only" name="checkmark" @click="setAvailable(table)"></ion-icon>
                </ion-item-option>
                <ion-item-option color="danger" v-if="table.State=='Free' && hasPermission('canEditTable')">
                    <ion-icon slot="icon-only" name="close" @click="setBusy(table)"></ion-icon>
                </ion-item-option>
              </ion-item-options>
            </ion-item-sliding>
        </ion-list>

        </paginate>

        <paginate-links for="languages" color="primary" 
          :simple="{
            next:'»' ,
            prev: '« ' }"
        ></paginate-links> 
      </div>

      <div v-if="screenWidth >= 600">
        <paginate
          name="languages"
          :list="filterTables"
          :per="8"
        >
          <ion-list>
            <ion-item-sliding v-for="table in paginated('languages')" v-bind:key="table._id">
              <ion-item  
                 @click="hasPermission('canEditTable')? editTable(table._id): false"
                :style="table.State=='Free' ? '--background:#76fb3838' :'--background:#ff00001f'">
                <ion-label class="menu-col-4 elipsis-menu">
                  <h2>{{ table.Name }}</h2>
                </ion-label>
                <ion-label class="menu-col-4 elipsis-menu">
                    <h3>{{ table.Description }}</h3>                   
                </ion-label>
                 <ion-label class="menu-col-4 elipsis-menu">                   
                    <h3 style="text-align: center;">{{ table.Seats.length }}</h3>
                    <div style="position: absolute;right: 0;top: 30%;">
                        <span class="iconify" data-icon="mdi:backburger" style="color: grey;margin:0;width: 20px; height: 20px;" data-inline="false"></span>                       
                    </div> 
                   

                </ion-label>
              </ion-item>

               <ion-item-options side="end">
                 
                    <ion-item-option v-if="hasPermission('canEditTable')" color="primary" @click="editTable(table._id)" v-tooltip="'Editar'">
                      <ion-icon slot="icon-only" name="create"></ion-icon>
                    </ion-item-option>
                    <ion-item-option v-if="hasPermission('canDeleteTable')" color="primary" @click="deleteTable(table._id)" v-tooltip="'Eliminar'">
                      <ion-icon slot="icon-only" name="trash"></ion-icon>
                    </ion-item-option>
                    <ion-item-option  @click="seeQrCode(table.Seats)" v-tooltip="'Ver Qrs'">
                       <span class="iconify" data-icon="ion:qr-code-sharp" data-inline="false"></span>  
                        <!-- <ion-icon slot="icon-only" name="list" ></ion-icon> -->
                    </ion-item-option>
                    <ion-item-option color="primary" v-if="(table.State=='Busy' || table.State=='Dirty') && hasPermission('canEditTable')" v-tooltip="'Liberar'">
                        <ion-icon slot="icon-only" name="checkmark" @click="setAvailable(table)"></ion-icon>
                    </ion-item-option>
                    <ion-item-option color="primary" v-if="table.State=='Free' && hasPermission('canEditTable')" v-tooltip="'Ocupar'">
                        <ion-icon slot="icon-only" name="close" @click="setBusy(table)"></ion-icon>
                    </ion-item-option>
                  
                 </ion-item-options>
            </ion-item-sliding>
        </ion-list>

        </paginate>

        <paginate-links for="languages" color="primary" 
          :simple="{
            next:'»' ,
            prev: '« ' }"
        ></paginate-links> 
      </div>

    </div>



    <div  v-if="!spinner && orderTable">
  

        <div  v-for="(table, index) in filterTables"  
       
        :key="index"
         
        class='menu-col-3 ' style="float: left; margin-top: 15px;"  >
       
          <ion-card 
            :color="table.State=='Free' ?'secondary': 'medium'" 
            style="font-size: 18px;font-weight: 600;border: 1px solid grey;"> 

                    <ion-fab horizontal="end" vertical="top" slot="fixed">
        <ion-fab-button color="light">
          <ion-icon md="caret-back" ios="chevron-back-circle-outline"></ion-icon>
        </ion-fab-button>
        <ion-fab-list side="botton">
          <ion-fab-button color="light">
            <ion-icon name="logo-facebook"></ion-icon>
          </ion-fab-button>
          <ion-fab-button color="light">
            <ion-icon name="logo-twitter"></ion-icon>
          </ion-fab-button>
          <ion-fab-button color="light">
            <ion-icon name="logo-vimeo"></ion-icon>
          </ion-fab-button>
        </ion-fab-list>
      </ion-fab>


          <ion-badge slot="end" style="padding: 10px; margin: 10px;" @click="getOrdersDetails(table.Name)"
              color="light">{{getListOrder(table.Name).length}} / {{table.Seats.length}}</ion-badge> 
           {{table.Name}} 
                <br>
             <p style="text-align: center;">TOTAL: {{ getAmoutByTable(table.Name) }}   </p>        
            
          </ion-card>  
        <!-- </ion-chip> -->

   

      </div>
    </div>
  </div>
</template>

<script>

import { Api } from '../api/api.js';
import Modal from './QrModal.vue';
import TableOrderModal from './TableOrderModal';

export default {

  name: 'table',
  created: function(){
    this.screenWidth = screen.width;
   this.fetchTables();
  },
  data () {
    return {
      modelName: 'Table',
      tables: [],
      filterTables: [],

      paginate: ['languages'],

      spinner: false,
      spinnerState: false,
      screenWidth: 0,
      table: true,
      orderTable: false,
      segmentValue: 'table',
      orders: [],
    }
  }, 
  methods: {
     async segmentChanged(value){         
             if(value === 'table'){
                 this.table = true;
                 this.orderTable = false;                
             }
             if(value === 'orderTable'){
                await this.fetchOrdersTable();
                this.table = false;
                this.orderTable = true;
                console.log('orders');
                console.log(this.orders.length);
             }               
             this.segmentValue = value;

         },
    // showLoading(){
    //     return this.$ionic.loadingController
    //     .create({
    //       cssClass: 'my-custom-class',
    //       message: this.$t('backoffice.titles.loading'),
    //       duration: 1000,
    //       backdropDismiss: true
    //     })
    //     .then(a => a.present())
    // },
    ifErrorOccured(action){
      return this.$ionic.alertController.create({
          title: this.$t('backoffice.list.messages.connectionError'),
          message: this.$t('backoffice.list.messages.connectionErrorMessage'),
          buttons: [
            {
              text: this.$t('backoffice.list.messages.buttons.goToAdministration'),
              handler: () => {
                  this.$router.push({
                      name: 'ControlPanel',
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
    handleInput(value){

      this.filterTables = this.tables
      const query = value.toLowerCase();
      requestAnimationFrame(() => {   
        let cat2 = this.tables.filter(item => item.Name.toLowerCase().indexOf(query) > -1)
        if(cat2.length> 0)
          this.filterTables = cat2
        else
          this.filterTables = this.categories
      });
    },
    hasPermission(permission){
        
        let res = false;
        if (this.$store.state.authenticated)
        {
            let roles = this.$store.state.roles;
            for (let index = 0; index < roles.length; index++) {
                switch(permission){                        
                      case 'canCreateTable':
                          res = roles[index].canCreateTable;
                          break;
                      case 'canEditTable':
                          res = roles[index].canEditTable;
                          break;
                      case 'canDeleteTable':
                          res = roles[index].canDeleteTable;
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
    seeQrCode(seats){
      console.log('seats')
      console.log(seats)
        return this.$ionic.modalController
        .create({
          component: Modal,
          cssClass: 'my-custom-class',
          componentProps: {
            data: {
              content: seats,
              type: 'Multiple'
            },
            propsData: {
              title: this.$t('backoffice.form.fields.qrCode'),
              button: this.$t('backoffice.list.messages.buttons.close'),
            },
          },
        })
        .then(m => m.present())
    },
    setAvailable(table){
        this.spinnerState = true;
        table.State = 'Free';
        table.Seats.forEach(seat => {
            seat.available = true
        });
        Api.putIn('table', table).then(response => {
            this.showToastMessage('La mesa está hora disponible.', 'success')
            this.spinnerState = false
            return response
        })
        .catch(e => {
            console.log(e)
            this.spinnerState = false
        })
    },
    setBusy(table){
        this.spinner = true;
        table.State = 'Busy';
        table.Seats.forEach(seat => {
            seat.available = false
        });
        Api.putIn('table', table).then(response => {
            this.showToastMessage('Se ha ocupado la mesa.', 'success')
            this.spinner = false
            return response
        })
        .catch(e => {
            console.log(e)
            this.spinner = false
        })
    },
    /****** CRUD category methods ******/
    fetchTables: function(){
        this.$ionic.loadingController
        .create({
          cssClass: 'my-custom-class',
          message: this.$t('backoffice.titles.loading'),
          backdropDismiss: true
        })
        .then(loading => {
            loading.present()
            setTimeout(() => {
                //llamada ajax						
                Api.fetchAll(this.modelName).then(response => {
                  this.tables = response.data
                  this.filterTables = this.tables
                  loading.dismiss()
                })
                .catch(e => {
                  console.log(e)
                  loading.dismiss()
                  this.ifErrorOccured(this.fetchTables)
                });
            })
        })
    },
    editTable: function(id){
        this.$router.push({
        name: 'TableForm',
        params: { tableId: id }
      });
    },
    deleteTable: function(id){

      return this.$ionic.alertController.create({
        title: this.$t('backoffice.list.messages.confirmDelete'),
        message: this.$t('backoffice.list.messages.deleteTable'),
        buttons: [
          {
            text: this.$t('backoffice.list.messages.buttons.cancel'),
            role: 'cancel',
            handler: () => {
              
            }
          },
          {
            text: this.$t('backoffice.list.messages.buttons.delete'),
            handler: () => {

                this.spinner = true
                Api.deleteById(this.modelName, id)
                  .then(response => {
                    // this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
                    //   this.$t('backoffice.list.messages.messageDeleteSuccessTable'),
                    //       this.$t('backoffice.list.messages.deleteSubtitleTable'));
                    this.showToastMessage(this.$t('backoffice.list.messages.messageDeleteSuccessTable'), "success");
                    this.fetchTables();
                    this.spinner = false;
                    return response;
                  })
                  .catch(e => {
                    console.log(e);
                    this.ifErrorOccured(mess => {
                      this.deleteTable(id)
                      this.spinner = false
                      return mess
                    });
                  })
            }
          }
        ]
      })
      .then(a => a.present());  

     },

    async fetchOrdersTable(){
      this.$ionic.loadingController
      .create({
        cssClass: 'my-custom-class',
        message: this.$t('backoffice.titles.loading'),
        // duration: 1000,  
        backdropDismiss: true
      })
      .then(loading => {
          loading.present()
          setTimeout(async() => {  // Some AJAX call occurs
            const response = await Api.fetchAll('Order');
            if(response.status === 200)            
              this.orders = response.data.filter(order => order.State < 5 && order.OrderType === 'On Table');
            console.log('All Ordesr')
            console.log(this.orders)
            loading.dismiss();
          })
      })    
    },

     getAmoutByTable(value){
       console.log(value);
       const listO = this.getListOrder(value);
       console.log('listO')
       console.log(listO)
       let total = 0;

       listO.forEach( o => { total+= parseFloat(o.Total) })

        console.log('total '+ total)
       return total.toFixed(2);
    },

    

     async getOrdersDetails(value){
       console.log(value);
       const listO = this.getListOrder(value);
       if(listO.length > 0){
         console.log(listO.length)
         return this.$ionic.modalController
        .create({
          component: TableOrderModal,
          cssClass: 'my-custom-class',
          componentProps: {
            data: {
              content: listO,             
            },
            propsData: {  
              allStates: [this.$t('frontend.order.state0'),this.$t('frontend.order.state1'), this.$t('frontend.order.state2'),
      this.$t('frontend.order.state3'), this.$t('frontend.order.state4'), this.$t('frontend.order.state5'), this.$t('frontend.order.state6'), this.$t('frontend.order.state7'), this.$t('frontend.order.state8')],
                 
            },
          },
        })
        .then(m => m.present())
       }
       
     },

     getListOrder(value){
       const listO = [];
       for (const order of  this.orders) {
         const name = order.tableService;
         if(name.match(value)){
           listO.push(order);
         }         
       }
       console.log(listO)
       return listO;
     },
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

 .elipsis-menu{
        text-overflow: ellipsis !important;
    overflow: hidden !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
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

    .table-circle{
          width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 1px solid #e1dddd;
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