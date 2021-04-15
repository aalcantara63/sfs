<template>
    <div class="screen">
    <ion-backdrop v-if="isBackdrop"></ion-backdrop>
    <!-- <router-link to="/controlPanel"><ion-button expand="full" color="tertiary"><ion-icon name="hammer"></ion-icon>{{$t('backoffice.list.buttons.goToControlPanel')}}</ion-button></router-link>
    <router-link to="/table"><ion-button expand="full" color="tertiary"><ion-icon name="arrow-round-back"></ion-icon>{{$t('backoffice.form.buttons.backToTablesList')}}</ion-button></router-link> -->

    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'Table'})"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>{{title}}</h1>            
            </ion-label>
          </ion-toolbar>
    </ion-header>
    <br/>

      <!-- <ion-card> -->
    <div v-if="spinner">
        <ion-spinner name="lines" class="spinner"></ion-spinner>
    </div>
    <div v-else>   
        <ion-item>
            <ion-label>{{$t('backoffice.form.fields.name')}}: <strong>{{name}}</strong></ion-label>            
        </ion-item>
     
        <div v-if="!id">
            <ion-radio-group :value="type"  @ionChange="changeType($event.target.value)">
              <ion-item>
                <ion-label>Seat type</ion-label>
              </ion-item>
              <ion-item>
                <ion-label>Table</ion-label>
                <ion-radio slot="end" :value="tablePrefix"></ion-radio>
              </ion-item>
              <ion-item>
                <ion-label>Bar</ion-label>
                <ion-radio slot="end" :value="barPrefix"></ion-radio>
              </ion-item>
              <ion-item>
                <ion-label>Room</ion-label>
                <ion-radio slot="end" :value="roomPrefix"></ion-radio>
              </ion-item>
            </ion-radio-group>
        </div>
        
        <ion-item>
          <ion-label position="floating"><span style="color: red">*</span>{{$t('backoffice.form.fields.tableNumber')}}</ion-label>
            <ion-input type="number" name="tableNumber"
            @input="changeNumber($event.target.value)" 
            v-bind:value="tableNumber">
          </ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">{{$t('backoffice.form.fields.description')}}</ion-label>
          <strong>
            <ion-textarea name="description" 
          @input="description = $event.target.value" 
          v-bind:value="description">
          </ion-textarea>
          </strong>
          
        </ion-item>

        

        <div v-if="id">
            <ion-item>
                <ion-label><strong> Manage seats</strong></ion-label>
                <ion-button color="secondary" @click="addSeat()"><ion-icon slot="icon-only" name="add"></ion-icon></ion-button>
                <ion-button v-if="seats.length > 0" color="danger" @click="deleteSeat()"><ion-icon slot="icon-only" name="trash"></ion-icon></ion-button>
            </ion-item>
            <ion-list>
                <ion-item v-for="seat in seats" v-bind:key="seat.Name">
                  <ion-label class="menu-col-4 elipsis-menu">{{ formatSeat(seat)}} </ion-label>
                  <ion-label class="menu-col-4 elipsis-menu">{{ showStatus(seat) }}</ion-label>
                  <ion-label class="menu-col-4 elipsis-menu" style="    text-align: right;">
                    <ion-button @click="seeQrCode(seat)" color="light"> <span class="iconify" data-icon="ion:qr-code-sharp" data-inline="false" style="width: 22px;height: 22px;margin: 0;"></span></ion-button>
                    <ion-button v-if="!seat.available" color="danger" @click="setAvailable(seat)"><ion-icon slot="icon-only" name="close"></ion-icon></ion-button>
                    <ion-button v-else color="success" @click="setDisable(seat)"><ion-icon slot="icon-only" name="checkmark"></ion-icon></ion-button>
               

                  </ion-label>


                   </ion-item>
            </ion-list>
        </div>
      
        <ion-item>
           <ion-label>{{$t('backoffice.form.fields.available')}}</ion-label>
           <ion-checkbox slot="end" name="available" 
                @ionChange="available=$event.target.checked" 
                :checked="available">
          </ion-checkbox>
        </ion-item>
      <!-- </ion-card>  -->

      <ion-item>
          <ion-segment v-bind:value="state" @ionChange="changeState($event.detail.value)">
              <ion-segment-button value="Free">
                  <ion-label>{{$t('backoffice.form.fields.free')}}</ion-label>
              </ion-segment-button>
              <ion-segment-button value="Busy">
                  <ion-label>{{$t('backoffice.form.fields.busy')}}</ion-label>
              </ion-segment-button>
              <ion-segment-button value="Dirty">
                  <ion-label>{{$t('backoffice.form.fields.dirty')}}</ion-label>
              </ion-segment-button>
          </ion-segment>
      </ion-item>

      <br/>
      <ion-button expand="full" color="primary" :disabled="!isValidForm()" @click="saveTable()">{{ $t('backoffice.form.buttons.save') }}</ion-button>

    </div>
    </div>
</template>

<script>

import { Api } from '../api/api.js';
// import QrcodeVue from 'qrcode.vue';
import Modal from './QrModal.vue';

export default {

  name: 'tableForm',
   
  data () {
    return {
      modelName: 'Table',
      /****** Form Data ******/
      id: null,
      name: '',
      description: '',
      tableNumber: 0,
      barcode: '',
      state: '',
      available: true,
      
      qr: '',

      type: '',
      seats: [],
      allTables: [],

      tablePrefix: 'table_',
      barPrefix: 'bar_',
      roomPrefix: 'room_',

      possiblesStates: ['Libre', 'Ocupada', 'Sucia'],

      isBackdrop: false,
      spinner: false,

    }
  },
  // components: {
  //     QrcodeVue,
  // },
  created: function(){
    
      this.init();
  },
  computed: {
        title() {
            return this.id ? this.$t('backoffice.form.titles.tableEditTitle') :  this.$t('backoffice.form.titles.tableNewTitle');
        }
  },
  methods: {
    init(){
        this.id = this.$route.params.tableId;
        this.fetchTables();
        this.type = 'table_';
        this.state = 'Free';
        this.changeType(this.type);
        if (this.id){
          this.$ionic.loadingController
          .create({
            cssClass: 'my-custom-class',
            message: this.$t('backoffice.titles.loading'),
            backdropDismiss: true
          })
          .then(loading => {
              loading.present()
              setTimeout(() => {  // Some AJAX call occurs
                  Api.fetchById(this.modelName, this.id)
                  .then(response => {
                    this.name = response.data.Name;
                    this.description = response.data.Description;
                    this.tableNumber = response.data.TableNumber;
                    this.type = response.data.Type;
                    this.seats = response.data.Seats;
                    this.available = response.data.Available;
                    this.state = response.data.State;
                    loading.dismiss();
                    return response;
                  })
                  .catch(e => {
                    loading.dismiss();
                    console.log(e);
                  }) 
              })
          })  
        }
        else{
          this.$ionic.loadingController
          .create({
            cssClass: 'my-custom-class',
            message: this.$t('backoffice.titles.loading'),
            backdropDismiss: true
          })
          .then(loading => {
              loading.present()
              setTimeout(() => {  // Some AJAX call occurs
                  Api.fetchAll('Setting').then(response => {
          
                    let funSettings = [];
                    funSettings = response.data;
                    if (funSettings.length > 0)
                    {
                        funSettings = response.data[0]
                        console.log(funSettings)
                        if (funSettings.TablePrefix && funSettings.TablePrefix != '')
                        {
                            this.tablePrefix = funSettings.TablePrefix + "_" 
                            this.type = this.tablePrefix;
                            this.changeType(this.type);

                        }
                        if (funSettings.BarPrefix && funSettings.BarPrefix != '')
                        {
                            this.barPrefix = funSettings.BarPrefix + "_"
                            // this.type = this.barPrefix
                        }
                        if (funSettings.RoomPrefix && funSettings.RoomPrefix != '')
                        {
                            this.roomPrefix = funSettings.RoomPrefix + "_"
                            // this.type = this.roomPrefix
                        }
                            
                    }
                    loading.dismiss();
                    return response;
                  })
                  .catch(e => {
                    loading.dismiss();
                    console.log(e);
                  }) 
              })
          })
        }

        console.log(this.$route.params);
    },
    ifErrorOccured(action){
      return this.$ionic.alertController.create({
          title: this.$t('backoffice.list.messages.connectionError'),
          message: this.$t('backoffice.list.messages.connectionErrorMessage'),
          buttons: [
            {
              text: this.$t('backoffice.list.messages.buttons.goToList'),
              handler: () => {
                  this.$router.push({
                      name: 'Table',
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
    isValidForm(){
        // let errors = [];
        if (this.name == "")
        {
            // errors.push(this.$t('backoffice.form.validate.name'));
            return false
        }
        if (!this.validateUniqueName(this.name))
        {
            // errors.push(this.$t('backoffice.form.validate.nameDuplicate'));
            return false
        }
        if (isNaN(this.tableNumber))
        {
            // errors.push(this.$t('backoffice.form.validate.tableNumber'));
            return false
        }
        if (this.tableNumber == 0)
        {
            // errors.push(this.$t('backoffice.form.validate.tableNumberGreater'));
            return false
        }

        return true

        // if (errors.length > 0)
        // {
        //     let message = "";
        //     for (let i = 0; i < errors.length; i++) {
        //          message += (i + 1) + "- " + errors[i] + "<br/>";
        //     }
        //     // this.ShowMessage(this.$t('backoffice.form.validate.validate'), message, this.$t('backoffice.form.validate.validateTable'));
        //     this.showToastMessage(message, "danger");
        //     return false;
        // }
        // else
        // {
        //     return true;
        // }
    },
    fetchTables: function(){
        Api.fetchAll(this.modelName).then(response => {
          this.allTables = response.data
          this.tableNumber = this.allTables.length + 1;
          this.changeNumber(this.tableNumber);
        })
        .catch(e => {
          console.log(e)
        });
    },
    changeState(state){
        console.log(state)
        this.state = state
          if (this.state == "Free")
          {
              this.seats.forEach(seat => {
              seat.available = true
          });
        }
    },
    addSeat(){  
        console.log(this.id + '-' + this.name + '_' + (this.seats.length + 1))
        const name = this.id + '-' + this.name + '_' + (this.seats.length + 1)
        const seat = {
            'name': name,
            'available': true
        }

        this.seats.push(seat);
    },
    deleteSeat(){
        this.seats.splice(this.seats.length - 1, 1);
    },
    setAvailable(seat){
        seat.available = true
        console.log(seat.available)

        let av = true
        this.seats.forEach(seat => {
            if (!seat.available)
              av = false
        });

        if (av)
          this.state = 'Free'
    },
    setDisable(seat){
        seat.available = false
        console.log(seat.available)

        let av = false
        this.seats.forEach(seat => {
            if (seat.available)
              av = true
        });

        if (!av)
          this.state = 'Busy'
    },
    formatSeat(seat){
       console.log("SEATs")
       console.log(seat)
       let name = seat.name.split('-')
       return name[1] 
    },
    showStatus(seat){
        return seat.available ? 'Disponible' : 'No disponible'
    },
    changeType(eventVal){
        console.log(eventVal);
        this.type = eventVal;
        let provisionalName = this.type + this.tableNumber;
        console.log("STEP-2")
        console.log("Provisional number: " + provisionalName)
        if (this.validateUniqueName(provisionalName))
        {
            console.log("STEP-3")
            console.log("Unique name")
            this.name = provisionalName;
            this.changeAllSeatName();
        }
        else
        {
            this.ShowMessage(this.$t('backoffice.form.validate.validate'), 
               this.$t('backoffice.form.validate.nameDuplicate'),
                   this.$t('backoffice.form.validate.validateTable'));
            this.name = provisionalName;
            this.changeAllSeatName();
        }
            
    },
    changeAllSeatName(){
        this.name + 'seat_' + (this.seats.length + 1)
        for (let i = 0; i < this.seats.length; i++) {
          // const name = this.name + 'seat_' + (i + 1);
          const name = this.id + "-" + this.name + "_" + (i + 1)
          this.seats[i].name = name
        }
        console.log("STEP-4: Seat names")
        console.log(this.seats)
    },
    seeQrCode(seat){
        console.log(seat);
        return this.$ionic.modalController
        .create({
          component: Modal,
          cssClass: 'my-custom-class',
          componentProps: {
            data: {
              content: [seat],
              type: 'unique',
            },
            propsData: {
              title: this.$t('backoffice.form.fields.qrCode'),
              button: this.$t('backoffice.list.messages.buttons.close')
            },
          },
        })
        .then(m => m.present())
    },
    changeNumber(val){
       this.tableNumber = val;
       console.log("STEP-1")
       console.log("Number: " + this.tableNumber)
       this.changeType(this.type);
    },
    validateUniqueName(name){
        for (let index = 0; index < this.allTables.length; index++) {
          const element = this.allTables[index];
          if (element.Name == name && element._id != this.id)
              return false;
        }
        return true;
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
    //Create or edit a new category
    saveTable: function(){

        if (this.isValidForm())
        {
              // this.isBackdrop = true;
              let item = {
              "Name": this.name,
              "Description": this.description,
              "State": this.state,
              "Available": this.available,
              "TableNumber": this.tableNumber,
              "Seats": this.seats,
              "Type": this.type,
            }
            //If I am editing
            if (this.id){
              item['_id'] = this.id;
              this.spinner = true;
              Api.putIn(this.modelName, item)
                  .then(response => {
                        // this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
                        //      this.$t('backoffice.list.messages.messageEditSuccessTable'), 
                        //         this.$t('backoffice.list.messages.titleEditTable'));
                        this.showToastMessage(this.$t('backoffice.list.messages.messageEditSuccessTable'), "success");
                        this.spinner = false;
                        this.$router.push({
                          name: 'Table', 
                        });
                        return response;
                  })
                  .catch(e => {
                        this.isBackdrop = false;
                        console.log(e);
                        this.spinner = false;
                        this.ShowMessage(this.$t('backoffice.list.messages.errorTitle'),
                               this.$t('backoffice.list.messages.errorMessage'),
                                   this.$t('backoffice.list.messages.titleEditTable'));
                  })
            }
            else{
              //Else, I am created a new category
              this.spinner = true;
              Api.postIn(this.modelName, item)
                  .then(response => {
                      // this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'),
                      //        this.$t('backoffice.list.messages.messageCreateSuccessTable'), 
                      //           this.$t('backoffice.list.messages.titleCreateTable'));
                        this.showToastMessage(this.$t('backoffice.list.messages.messageCreateSuccessTable'), "success");
                        console.log(response)
                        this.id = response.data._id
                        this.spinner = false
                        this.$router.push({
                          name: 'TableForm',
                          params: {
                              'tableId': response.data._id
                          } 
                        });
                      return response;
                  })
                  .catch(e => {
                      this.isBackdrop = false;
                      console.log(e);
                      this.spinner = false;
                      this.ShowMessage(this.$t('backoffice.list.messages.errorTitle'),
                          this.$t('backoffice.list.messages.errorMessage'),
                              this.$t('backoffice.list.messages.titleCreateTable'));
                  })
              }
        }
  
    },
    /**************** Support Methods ****************/
    //  editCategory: function(id, name, description){
    //     this.isEditing = true;
    //     this.editingId = id;
    //     this.name = name;
    //     this.description = description;
    //     this.file = null;
    //  },
    //  clearCategory: function(){
    //     this.isEditing = false;
    //     this.editingId = null;
    //     this.name = '';
    //     this.description = '';
    //     this.file = null;
    //  },
  },

}
    
</script>

<style>

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