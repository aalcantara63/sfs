<template>
    <div>
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
    </div>
</template>

<script>

import { Api } from '../api/api.js';

export default {

    name: 'RestaurantList',

    data () {
        return {
            restaurantId: null,
            allRestaurant: []            
        }
    },

    // mounted: function(){
    //     console.log("AQUIIII")
    //     this.fetchAllRestaurant()
    // },

    // computed: {

    //     allRestaurant(){
    //         Api.fetchAll('Restaurant').then(response => {
    //             if(response.status === 200){

    //                 let restaurants = response.data
    //                 let myRestaurants = this.$store.state.user.AllRestaurant

    //                 let backRestaurants = []
    //                 restaurants.forEach(restaurant => {
    //                     if (myRestaurants.indexOf(restaurant._id) != -1)
    //                         backRestaurants.push(restaurant)
    //                 });

    //                 console.log("Todos Restaurantes")
    //                 console.log(backRestaurants)
    //                 return backRestaurants
    //             }
    //         })
    //         .catch(e => {
    //             console.log(e)
    //             return []
    //         });
    //     }

    // },

    methods: {
        getAllRestaurant(){
            Api.fetchAll('Restaurant').then(response => {
                if(response.status === 200){

                    let restaurants = response.data
                    let myRestaurants = this.$store.state.user.AllRestaurant

                    restaurants.forEach(restaurant => {
                        if (myRestaurants.indexOf(restaurant._id) != -1)
                            this.allRestaurant.push(restaurant)
                    });

                    console.log("Todos Restaurantes")
                    console.log(this.allRestaurant)
                }
            })
            .catch(e => {
                console.log(e)
                return []
            });
        },
        fetchUserLoginRestaurant(){
            Api.fetchAll('Restaurant').then(response => {
                if(response.status === 200){

                    let restaurants = response.data
                    let myRestaurants = this.$store.state.user.AllRestaurant

                    restaurants.forEach(restaurant => {
                        if (myRestaurants.indexOf(restaurant._id) != -1)
                            this.backRestaurants.push(restaurant)
                    });

                    console.log("Todos Restaurantes")
                    console.log(this.backRestaurants)
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
            // this.spinner = true
            let userLogin = this.$store.state.user
            userLogin.RestaurantId = this.restaurantId

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
                    this.$router.push({
                        name: 'ControlPanel'
                    })
                    // this.init();
            })
            .catch(e => {
                console.log(e)
                // this.spinner = false
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
    }

}

</script>