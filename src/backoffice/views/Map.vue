<template>
    <div v-if="isTravel">
        <!-- <h1>Your coordinates:</h1>
        <p>{{coordinates.lat}} Latitude, {{coordinates.lng}} Longitude</p> -->
        <GmapMap
            :center="coordinates"
            :zoom="16"
            style="width:100%; height: 300px; margin:20px auto"
            ref="mapRef">
            <Gmap-marker v-for="(coords, index) in travel" :key="index"
                :title="title"
                :position="coords"
            /> 
        </GmapMap>
    </div>
    <div v-else>
    <GmapMap
        :center="coordinates"
        :zoom="16"
        style="width:100%; height: 300px; margin:20px auto"
        ref="mapRef">
        <Gmap-marker
            :title="title"
            :position="coordinates"
            /> 
    </GmapMap>
    </div>
</template>

<script>
// import { Geolocation } from '@ionic-native/geolocation/'
// import Vue from 'vue'
// import * as VueGoogleMaps from 'vue2-google-maps'

// Vue.use(VueGoogleMaps, {
//   load: {
//     key: 'AIzaSyATqn9NEXjO84wIQKcw4i6_1fgb18Bz4TM'
//   }
// })

export default {
    data(){
        return{
            // coordinates: {
            //     lat: 0,
            //     lng: 0
            // }
            center: {lat: this.lat, lng: this.lng},
            markers: [{
                position: {lat: this.lat, lng: this.lng},
                title: ""
            }]
        }
    },
    props: {
        coordinates: {
            lat: 0,
            lng: 0
        },
        title : {type: String, default: 'Chofer' },
        travel: {type: Array, default: new Array()},
        isTravel: {type: Boolean, default: false}
    },
    created(){
        console.log(this.coordinates)
        console.log(this.isTravel)
        console.log(this.travel)
    // Geolocation.getCurrentPosition({   
        //         timeout: 3000      
        //     }).then(response => {
        //         this.coordinates.lat = response.coords.latitude
        //         this.coordinates.lng = response.coords.longitude
        //         console.log(response)
        //     }).catch(e => {
        //         console.log(e);
        // });

        // navigator.geolocation.getCurrentPosition(function(position) {

        //     var latitude = position.coords.latitude;
        //     var longitude = position.coords.longitude;
        //     // var altitude = position.coords.altitude;
        //     // var accuracy = position.coords.accuracy;
        //     // var altitudeAccuracy = position.coords.altitudeAccuracy;
        //     // var heading = position.coords.height;
        //     // var speed = position.coords.speed;
        //     // var timestamp = position.timestamp;

        //     // work with this information however you'd like!
        //     console.log("Latitude: " + latitude + "Longitude: " + longitude);
        // });
    },
    // mounted(){
    //     this.$refs.mapRef.$mapPromise.then(map => this.map = map)
    // }
}
</script>