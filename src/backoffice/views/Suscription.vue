<template>
  <div id="suscription" class="screen">

    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'ControlPanel'})"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>{{$t('backoffice.titles.suscriptor')}}</h1>            
            </ion-label>

            <ion-label slot="end">
              <router-link to="/suscriptor-form">
                  <ion-chip style="font-size: 30px" outline color="primary" v-if="hasPermission('canCreateSuscriptor')">
                      <ion-label><ion-icon name="add"></ion-icon></ion-label>
                  </ion-chip>
              </router-link>
            </ion-label>

          </ion-toolbar>

          <ion-searchbar  
                @input="handleInput($event.target.value)" @ionClear="filterSuscriptors = suscriptors"
                :placeholder="$t('frontend.home.search')">       
          </ion-searchbar>
    </ion-header>

    <div v-if="spinner">
        <ion-spinner name="lines" class="spinner"></ion-spinner>
    </div>
    <div v-else>
       <div v-if="screenWidth < 600">
          <paginate
          name="languages"
          :list="filterSuscriptors"
          :per="8"
          >
            <ion-list>
              <ion-item-sliding v-for="suscriptor in paginated('languages')" v-bind:key="suscriptor._id">
                <ion-item>
                  <ion-label>
                      <h2>{{ suscriptor.Name }}</h2>
                      <h3>{{ suscriptor.Email }}</h3>
                  </ion-label>
                  <div v-if="hasPermission('canDesactivateSuscriptor')">
                      <ion-checkbox v-if="suscriptor.State" checked="true" slot="end" @click="desactivateSuscriptor(suscriptor)"></ion-checkbox>
                      <ion-checkbox v-else checked="false" slot="end" @click="desactivateSuscriptor(suscriptor)"></ion-checkbox>
                  </div>
                  <span slot="end" class="iconify" data-icon="mdi:backburger" data-inline="false"></span>
                </ion-item>
                <ion-item-options side="end">
                  <ion-item-option v-if="hasPermission('canEditSuscriptor')" color="primary" @click="editSuscriptor(suscriptor._id)">
                    <ion-icon slot="icon-only" name="create"></ion-icon>
                  </ion-item-option>
                  <!-- <ion-item-option v-if="hasPermission('canDesactivateSuscriptor')" color="primary" @click="desactivateSuscriptor(suscriptor._id)">
                    <span class="iconify" data-icon="mdi:check-circle-outline" data-inline="false"></span>
                  </ion-item-option> -->
                  <ion-item-option v-if="isSupportUser" color="danger" @click="deleteSuscriptor(suscriptor._id)">
                    <ion-icon slot="icon-only" name="trash"></ion-icon>
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
          :list="filterSuscriptors"
          :per="8"
          >
            <ion-list>
              <ion-item v-for="suscriptor in paginated('languages')" v-bind:key="suscriptor._id">
                  <ion-item-group side="start">
                      <div v-if="hasPermission('canDesactivateSuscriptor')">
                        <ion-checkbox v-if="suscriptor.State == true" checked="true" slot="end" @click="desactivateSuscriptor(suscriptor)"></ion-checkbox>
                        <ion-checkbox v-else checked="false" slot="end" @click="desactivateSuscriptor(suscriptor)"></ion-checkbox>
                      </div>
                  </ion-item-group>
                  <ion-label style="margin-left: 15px">
                      <h2>{{ suscriptor.Name }}</h2>
                      <h3>{{ suscriptor.Email }}</h3>
                  </ion-label>
                <ion-item-group side="end">
                  <ion-button v-if="hasPermission('canEditSuscriptor')" color="primary" @click="editSuscriptor(suscriptor._id)">
                    <ion-icon slot="icon-only" name="create"></ion-icon>
                  </ion-button>
                  <!-- <ion-button v-if="hasPermission('canDesactivateSuscriptor')" color="primary" @click="desactivateSuscriptor(suscriptor)">
                    <ion-icon slot="icon-only" name="checkbox-outline"></ion-icon>
                  </ion-button> -->
                  <ion-button v-if="isSupportUser" color="danger" @click="deleteSuscriptor(suscriptor._id)">
                    <ion-icon slot="icon-only" name="trash"></ion-icon>
                  </ion-button>
                </ion-item-group>
              </ion-item>
          </ion-list>
        </paginate>

        <paginate-links for="languages" color="primary" 
          :simple="{
            next:'»' ,
            prev: '« ' }"
        ></paginate-links>  
      </div>

    </div>

  </div>
</template>

<script>

import { Api } from '../api/api.js';

export default {

  name: 'staff',
  created: function(){
    this.isSupportUser = this.$store.state.user.IsSupport

    //console.log("IS SUPERVISOR")
    //console.log(this.isForDriversSupervisor);

    //console.log(screen.width)
    this.screenWidth = screen.width;
    this.fetchSuscriptors();

    window.onresize = function() {
      this.screenWidth = screen.width
      //console.log(this.screenWidth)
    }
  },
  data () {
    return {
      modelName: 'Subscriptor',
      suscriptors: [],
      filterSuscriptors: [],
      isSupportUser: false,

      // file: null,
      // fileName: '',

      paginate: ['languages'],

      spinner: false,
      screenWidth: 0,
    }
  }, 
  methods: {
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

      this.filterSuscriptors = this.suscriptors
      const query = value.toLowerCase();
      requestAnimationFrame(() => {   
        let cat2 = this.users.filter(item => item.Email.toLowerCase().indexOf(query) > -1)
        if(cat2.length> 0)
          this.filterSuscriptors = cat2
        else
          this.filterSuscriptors = this.suscriptors
      });
    },
    hasPermission(permission){
        
        let res = false;
        if (this.$store.state.authenticated)
        {
            let roles = this.$store.state.roles;
            for (let index = 0; index < roles.length; index++) {
                switch(permission){                        
                      case 'canCreateSuscriptor':
                          res = roles[index].canCreateSuscriptor;
                          break;
                      case 'canEditSuscriptor':
                          res = roles[index].canEditUser;
                          break;
                      case 'canDesactivateSuscriptor':
                          res = roles[index].canDeleteUser;
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
    /****** CRUD category methods ******/
    fetchSuscriptors: function(){
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
                  // console.log(response.data)
                  this.suscriptors = response.data
                  this.filterSuscriptors = this.suscriptors
                  loading.dismiss()
                })
                .catch(e => {
                  console.log(e)
                  loading.dismiss()
                  this.ifErrorOccured(this.fetchSuscriptors)
                });
            })
        })
    },
    editSuscriptor: function(id){
        this.$router.push({
          name: 'SuscriptorForm', 
          params: { 
            suscriptorId: id,
          }
        });
    },
    desactivateSuscriptor(suscriptor){
        this.spinner = true
        let State = suscriptor.State
        suscriptor.State = !State
        Api.putIn(this.modelName, suscriptor)
        .then(() => {
            if (State)
              //Se ha desactivado
              this.showToastMessage(this.$t('backoffice.list.messages.messageDesactivareSuccessSuscriptor'), 'success')
            else
              //Se ha activado
              this.showToastMessage(this.$t('backoffice.list.messages.messageActivareSuccessSuscriptor'), 'success')
            this.fetchSuscriptors()
            this.spinner = false
        })
        .catch(e => {
            console.log(e)
            this.spinner = false
            this.showToastMessage(this.$t('backoffice.list.messages.errorMessage'), 'danger')
            this.ifErrorOccured(this.desactivateSuscriptor)
        })
    },
    deleteSuscriptor: function(id){

        return this.$ionic.alertController.create({
        title: this.$t('backoffice.list.messages.confirmDelete'),
        message: this.$t('backoffice.list.messages.deleteSuscriptor'),
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
                    //   this.$t('backoffice.list.messages.messageDeleteSuccessUser'),
                    //       this.$t('backoffice.list.messages.deleteSubtitleUser'));
                  this.showToastMessage(this.$t('backoffice.list.messages.messageDeleteSuccessSuscriptor'), "success");
                  this.fetchSuscriptors();
                  this.spinner = false;
                  return response;
                })
                .catch(e => {
                  console.log(e);
                  this.ifErrorOccured(mess => {
                      this.deleteSuscriptor(id)
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