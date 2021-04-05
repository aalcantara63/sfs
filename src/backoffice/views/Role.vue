<template>
  <div id="user" class="screen">

    <!-- <router-link to="/controlPanel"><ion-button expand="full" color="tertiary"><ion-icon name="hammer"></ion-icon>{{$t('backoffice.list.buttons.goToControlPanel')}}</ion-button></router-link>
    <router-link to="/role-form"><ion-button v-if="hasPermission('canCreateRole')" expand="full" color="primary"><ion-icon name="add"></ion-icon>{{$t('backoffice.list.actions.addANew')}} {{$t('backoffice.list.entitiesName.role')}}</ion-button></router-link> -->

    <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'ControlPanel'})"></ion-back-button>
            </ion-buttons>
            <ion-label style="padding: 20px 100px;">
              <h1>{{$t('backoffice.titles.roles')}}</h1>            
            </ion-label>

            <ion-label slot="end">
            <router-link to="/role-form">
                <ion-chip style="font-size: 30px" outline color="primary" v-if="hasPermission('canCreateRole')">
                    <ion-label><ion-icon name="add"></ion-icon></ion-label>
                </ion-chip>
            </router-link>
            </ion-label>
          </ion-toolbar>

          <ion-searchbar  
                @input="handleInput($event.target.value)" @ionClear="filterRoles = roles"
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
          :list="filterRoles"
          :per="8"
        >

          <ion-list>
            <ion-item-sliding v-for="role in paginated('languages')" v-bind:key="role._id">
              <ion-item>
                <ion-label>
                    <h2>{{ role.Name }}</h2>
                    <h3>{{ role.Description }}</h3>
                </ion-label>
                <span slot="end" class="iconify" data-icon="mdi:backburger" data-inline="false"></span>
              </ion-item>
              <ion-item-options side="end">
                <ion-item-option v-if="hasPermission('canEditRole')" color="primary" @click="editRole(role._id)">
                  <ion-icon slot="icon-only" name="create"></ion-icon>
                </ion-item-option>
                <ion-item-option v-if="hasPermission('canDeleteRole')" color="danger" @click="deleteRole(role._id)">
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
          :list="filterRoles"
          :per="8"
        >

          <ion-list>
            <ion-item v-for="role in paginated('languages')" v-bind:key="role._id">
              <ion-label>
                  <h2>{{ role.Name }}</h2>
                  <h3>{{ role.Description }}</h3>
              </ion-label>
              <ion-item-group side="end">
                <ion-button v-if="hasPermission('canEditRole')" color="primary" @click="editRole(role._id)">
                  <ion-icon slot="icon-only" name="create"></ion-icon>
                </ion-button>
                <ion-button v-if="hasPermission('canDeleteRole')" color="danger" @click="deleteRole(role._id)">
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

  name: 'role',
  created: function(){
    this.screenWidth = screen.width;
   this.fetchRoles();
  },
  data () {
    return {
      modelName: 'Rol',
      roles: [],
      filterRoles: [],

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

      this.filterRoles = this.roles
      const query = value.toLowerCase();
      requestAnimationFrame(() => {   
        let cat2 = this.roles.filter(item => item.Name.toLowerCase().indexOf(query) > -1)
        if(cat2.length> 0)
          this.filterRoles = cat2
        else
          this.filterRoles = this.roles
      });
    },
    hasPermission(permission){
        
        let res = false;
        if (this.$store.state.authenticated)
        {
            let roles = this.$store.state.roles;
            for (let index = 0; index < roles.length; index++) {
                switch(permission){                        
                      case 'canCreateRole':
                          res = roles[index].canCreateRole;
                          break;
                      case 'canEditRole':
                          res = roles[index].canEditRole;
                          break;
                      case 'canDeleteRole':
                          res = roles[index].canDeleteRole;
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
    fetchRoles: function(){
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
                  this.roles = response.data
                  this.filterRoles = this.roles
                  loading.dismiss()
                })
                .catch(e => {
                  console.log(e)
                  loading.dismiss();
                  this.ifErrorOccured(this.fetchRoles)
                });
            })
        })
    },
    editRole: function(id){
        this.$router.push({
        name: 'RoleForm', 
        params: { roleId: id }
      });
    },
    deleteRole: function(id){

        return this.$ionic.alertController.create({
        title: this.$t('backoffice.list.messages.confirmDelete'),
        message: this.$t('backoffice.list.messages.deleteRole'),
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
                    //   this.$t('backoffice.list.messages.messageDeleteSuccessRole'),
                    //       this.$t('backoffice.list.messages.deleteSubtitleRole'));
                  this.showToastMessage(this.$t('backoffice.list.messages.messageDeleteSuccessRole'), "success");
                  this.fetchRoles();
                  this.spinner = false;
                  return response;
                })
                .catch(e => {
                  console.log(e);
                  this.ifErrorOccured(mess => {
                      this.deleteRole(id)
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