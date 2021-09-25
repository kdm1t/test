<template>
    <div>
    <div :class="{activeLogo : isActive || !hover}" class="track" @mouseover="isHover = true" @mouseleave="isHover = false" @click="$emit('active')">
        <div class="logo"
             :class="{activeTrack : isActive || !hover}"
             v-bind:style="{'backgroundImage': trackImage ? 'url('+ trackImage +')' : '', 'background-size': trackImage ? 'cover' : '24px'}"
        >

            <img v-show="isHover && !isActive" src="../../../public/img/PlayButton.png" alt="">

            <img v-show="isHover && isActive" src="../../../public/img/PauseButton.png" alt="">

            <img v-show="isActive && !isHover" src="https://res.cloudinary.com/dmf10fesn/image/upload/v1548886976/audio/assets/animated-sound-bars.gif" alt="">

        </div>

        <div class="info">
            <span class="userLink" @click.stop.prevent="$router.push({ name: 'user', params: { userId: user._id } }).catch(()=>{})" >{{user.username}}</span>
            <span>{{title}}</span>
        </div>

        <div v-show="!attach && !isHover" class="endInfo">
            <span v-show="!isActive">{{this.$moment("2015-01-01").startOf('day').seconds(duration).format('m:ss')}}</span>
            <span v-show="isActive">{{this.$moment("2015-01-01").startOf('day').seconds(getTime).format('m:ss')}}</span>
            <div><i class="material-icons">play_arrow</i><span>{{listen}}</span></div>
        </div>

        <div v-show="showDelete" class="addition">
            <i @click.prevent.stop="deleteTrack(id)" class="material-icons">clear</i>
        </div>

        <div v-show="attach" class="attach">
            <span v-if="attached.includes(id)" @click.stop.prevent="$emit('attach', id)">Remove</span>
            <span v-else @click.stop.prevent="$emit('attach', id)">Attach</span>
        </div>
    </div>
        <hr>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: "singleTrack",
        data(){
            return{
                isHover:false,
                music: new Audio(this.url),
                duration : 0
            }
        },
        props:{
            id : String,
            listen : Number,
            logo : String,
            title : String,
            url : String,
            user : Object,
            isActive : {type:Boolean, default: false},
            hover: {type:Boolean, default: true},
            attach : {type:Boolean, default: false},
            attached : {type:Array, default: function () { return [] }}
        },
        methods:{
            musicTime(){
                this.music.onloadedmetadata = () => {
                    this.duration = this.music.duration
                }
            },
            async deleteTrack(data){
                const createData = {
                    id : data,
                    type : "Track"
                }
                try {
                    await axios.post("http://musicamp.std-263.ist.mospolytech.ru/music/deleteTrack", createData, {headers:{ authorization : 'Bearer ' + localStorage.getItem('token')}})
                    this.$emit('reload')
                } catch (e) {
                    this.error = e.response.data.message
                    console.log(e)
                }
            }
        },
        mounted(){
            this.musicTime()
        },
        computed:{
            showDelete(){
                if(localStorage.getItem('token')){
                    if(!this.attach && this.isHover){
                        if( this.user.username === this.$store.getters.getUser.username || this.$store.getters.getUser.roles.includes('ADMIN') ){
                            return true
                        }
                    }
                }
                return false
            },
            trackImage(){
                if(this.getReady === false){
                    return false
                }
                if(this.logo === ""){
                    return false
                } else{
                    return this.logo.replace(/\/|\\/g, "/")
                }
            },
            getTime(){
                return this.$store.getters.currentTime
            }
        }
    }
</script>

<style scoped>
    .track{
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 6px 10px;
        border-radius: 2px;
        user-select: none;
    }
    .track:hover{
        background-color: #efefef;
        cursor: pointer;
    }
    .track:hover .logo{
        transition: 0.2s;
        box-shadow: inset 0px 0px 0px 50px rgba(50, 50, 50, 0.5);
    }
    .activeLogo{
        background-color: #efefef;
    }
    .activeTrack{
        box-shadow: inset 0px 0px 0px 50px rgba(50, 50, 50, 0.5);
    }
    .info{
        display: flex;
        flex-direction: column;
        margin-left: 18px;
        font-family: "Source Sans Pro";
        align-items: flex-start;
    }
    .info span:first-child{
        font-weight: 300;
        font-size: 16px;
        color: #9D9D9D;
    }
    .info span:last-child{
        font-weight: normal;
        font-size: 17px;
        color: #3E3E3E;
    }
    .endInfo{
        display: flex;
        flex-direction: column;
        margin-left: auto;
        align-items: flex-end;
        justify-content: space-between;
        color: #A4A4A4;
        height: 50px;
    }
    .endInfo span{
        font-family: "Open Sans";
        font-weight: lighter;
        font-size: 14px;
    }
    .endInfo i{
        font-size: 14px;
    }
    .endInfo div{
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .logo{
        background-image: url("../../../public/img/musicPlaceholder.png");
        background-repeat: no-repeat;
        background-position: center;
        background-size: 28px;
        background-color: #e8e8e8;
        width: 50px;
        height: 50px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
    }
    .logo img{
        width: 31px;
        height: 31px;
    }
    hr{
        border: none;
        border-top: 1px solid #E2E2E2;
        width: 100%;
        margin: 0px;
    }
    .userLink:hover{
        cursor: pointer;
        text-decoration: underline;
    }
    .attach{
        margin-left: auto;
        display: flex;
        flex-direction: row;
        align-items: center;
        font-family: "Open Sans";
        font-size: 15px;
        color: #6c6c6c;
    }
    .attach:hover{
        cursor: pointer;
        text-decoration: underline;
    }
    .addition{
        margin-left: auto;
        display: flex;
        align-items: center;
        flex-direction: row;
    }
    .addition i{
        color: red;
    }
</style>