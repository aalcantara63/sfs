<template>
    
    <div class="screen">

        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                <ion-back-button default-href="/controlPanel" @click="$router.push({ name: 'ControlPanel'})"></ion-back-button>
                </ion-buttons>
                <ion-label style="padding: 20px 100px;">
                <h1>{{$t('backoffice.titles.clockinClockout')}}</h1>            
                </ion-label>
            </ion-toolbar>
        </ion-header>

        <div style="margin-top: 20px">
            <ion-card style="padding:20px">
                <ion-label>{{$t('backoffice.titles.timecard')}}</ion-label>
                <br />
                <ion-button color="success" :disabled="nextAction == 'Clockout'" @click="clockin()"><span class="iconify" data-icon="mdi:clock-in" data-inline="false"></span> {{$t('backoffice.titles.clockin')}}</ion-button>
                <ion-button color="danger" :disabled="nextAction == 'Clockin'" @click="clockout()">{{$t('backoffice.titles.clockout')}} <span class="iconify" data-icon="mdi:clock-out" data-inline="false"></span></ion-button>
            </ion-card>

            <ion-card style="margin-top: 50px; padding:20px">
                <ion-label>{{$t('backoffice.titles.timesheet')}}</ion-label>
                <ion-list>
                    <ion-item :color="assist.Type == 'Clockin' ? 'success' : 'danger'" v-for="assist in attendanceDay" :key="attendanceDay.indexOf(assist)">
                            <ion-label>{{ getFormatDate(assist.DateTime)}}</ion-label>
                            <ion-item-group side="end">
                                <ion-label>{{assist.Type}}</ion-label>
                            </ion-item-group>
                    </ion-item>
                </ion-list>
            </ion-card>

        </div>

    </div>

</template>

<script>
import { Api } from '../api/api.js';
import moment from 'moment';
import { EventBus } from '../../frontend/event-bus';

export default {

    data(){

        return{
            StaffId: this.$store.state.user._id,
            nextAction: 'Clockin',

            attendanceDay: [],
        }
        
    },
    created(){
        this.getNextAction()
    },
    methods:{
        getFormatDate(date){
            return moment(date).format('LLL')
        },
        async getAttendanceDay(){
            try{
                const Attendance = await Api.fetchAll('Attendance')
                this.attendanceDay = Attendance.data
                //Los registro del staff en cuestion
                this.attendanceDay = this.attendanceDay.filter(att => att.StaffId == this.StaffId)
                //Sean del mismo día
                this.attendanceDay = this.attendanceDay.filter(att => moment(att.DateTime).format('YYYYMMDD') == moment().format('YYYYMMDD'))
            }
            catch(e){
                console.log(e)
            }
        },
        async getNextAction(){
            await this.getAttendanceDay()
        
            if (this.attendanceDay.length > 0){
                if (this.attendanceDay[this.attendanceDay.length - 1].Type == 'Clockin'){
                    console.log("CLOCKOUT")
                    this.nextAction = 'Clockout'
                }   
                else{
                    console.log("CLOCKIN")
                    this.nextAction = 'Clockin'
                }
            }
            else{
                this.nextAction = 'Clockin'
            }
            
                
        },
        clockin(){
            let item = {
                "StaffId": this.StaffId,
                "Type": "Clockin"
            }
            Api.postIn('Attendance', item)
            .then(() => {
                this.getNextAction()
                EventBus.$emit('clockIn', true);
            })
            .catch(e => {
                console.log(e)
            })
        },
        clockout(){
            let item = {
                "StaffId": this.StaffId,
                "Type": "Clockout"
            }
            Api.postIn('Attendance', item)
            .then(() => {
                this.getNextAction()
            })
            .catch(e => {
                console.log(e)
            })
        }
    },
    
}
</script>