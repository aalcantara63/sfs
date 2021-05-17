<template>
  <div id="category" class="screen">

    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'ControlPanel'})"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>{{$t('backoffice.titles.about')}}</h1>            
            </ion-label>

            <ion-label slot="end">
            <router-link v-if="abouts.length < 3" to="/aboutDataSettingsForm">
                <ion-chip style="font-size: 30px" outline color="primary" v-if="hasPermission('canChangeSetting')">
                    <ion-label><ion-icon name="add"></ion-icon></ion-label>
                </ion-chip>
            </router-link>
            </ion-label>
          </ion-toolbar>
    </ion-header>

    <div v-if="spinner">
        <ion-spinner name="lines" class="spinner"></ion-spinner>
    </div>
    <div v-else>
      <div v-if="screenWidth < 600">
          <ion-list>
            <ion-item-sliding v-for="about in abouts" v-bind:key="about._id">
              <ion-item>
                <ion-label>
                    <h2>{{ about.Title }}</h2>
                    <h3>{{ about.Subtitle }}</h3>
                    <h3><div style="word-wrap: break-word">{{ about.Description }}</div></h3>
                </ion-label>
                <span class="iconify" data-icon="mdi:backburger" data-inline="false"></span>
              </ion-item>
              <ion-item-options side="end">
                <ion-item-option v-if="hasPermission('canChangeSetting')" color="primary" @click="editAbout(about._id)">
                  <ion-icon slot="icon-only" name="create"></ion-icon>
                </ion-item-option>
                <ion-item-option v-if="hasPermission('canChangeSetting')" color="danger" @click="deleteAbout(about._id)">
                  <ion-icon slot="icon-only" name="trash"></ion-icon>
                </ion-item-option>
              </ion-item-options>
            </ion-item-sliding>
        </ion-list>
    </div>
    <div v-if="screenWidth >= 600">

        <ion-list>
            <ion-item v-for="about in abouts" v-bind:key="about._id">
              <ion-label>
                  <h2>{{ about.Title }}</h2>
                  <h3>{{ about.Subtitle }}</h3>
              </ion-label>
              <ion-item-group side="end">
                <ion-button v-if="hasPermission('canChangeSetting')" color="primary" @click="editAbout(about._id)">
                  <ion-icon slot="icon-only" name="create"></ion-icon>
                </ion-button>
                <ion-button v-if="hasPermission('canChangeSetting')" color="danger" @click="deleteAbout(about._id)">
                  <ion-icon slot="icon-only" name="trash"></ion-icon>
                </ion-button>
              </ion-item-group>
            </ion-item>
        </ion-list>

    </div>
  </div>

  </div>
</template>

<script>

import { Api } from '../api/api.js';

export default {

  name: 'about',
  created: function(){
   this.fetchAbouts();
   this.screenWidth = screen.width;
  },
  data () {
    return {
      modelName: 'About',
      abouts: [],

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
    hasPermission(permission){
        
        let res = false;
        if (this.$store.state.authenticated)
        {
            let roles = this.$store.state.roles;
            for (let index = 0; index < roles.length; index++) {
                switch(permission){                        
                      case 'canChangeSetting':
                          res = roles[index].canChangeSetting;
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
    /****** CRUD category methods ******/
    fetchAbouts: function(){
      this.$ionic.loadingController
      .create({
        cssClass: 'my-custom-class',
        message: this.$t('backoffice.titles.loading'),
        backdropDismiss: true
      })
      .then(loading => {
          loading.present()
          setTimeout(() => {  // Some AJAX call occurs
              Api.fetchAll(this.modelName).then(response => {
                // console.log(response.data)
                this.abouts = response.data
                loading.dismiss()
              })
              .catch(e => {
                console.log(e)
                loading.dismiss()
                this.ifErrorOccured(this.fetchAbouts)
              });
          })
      })
    },
    editAbout: function(id){
        this.$router.push({
        name: 'AboutForm', 
        params: { aboutId: id }
      });
    },
    deleteAbout: function(id){

        return this.$ionic.alertController.create({
        title: this.$t('backoffice.list.messages.confirmDelete'),
        message: this.$t('backoffice.list.messages.deleteAbout'),
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
                  this.ShowMessage(this.$t('backoffice.list.messages.infoDeleteSuccess'), 
                                        this.$t('backoffice.list.messages.messageDeleteSuccessAbout'), 
                                                this.$t('backoffice.list.messages.deleteSubtitleAbout'));
                  this.fetchAbouts();
                  this.spinner = false;
                  return response;
                })
                .catch(e => {
                  console.log(e);
                   this.ifErrorOccured(mess => {
                      this.deleteAbout(id)
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