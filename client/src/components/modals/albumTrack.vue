<template>
    <div class="outer" :class="{activeTrack : isActive || !hover}" @mouseover="isHover = true" @mouseleave="isHover = false" @click="$emit('active')">
        <div class="track">

            <div class="logo"
                 :class="{activeLogo: isActive || !hover}"
                 v-bind:style="{'backgroundImage': trackImage ? 'url('+ trackImage +')' : '', 'background-size': trackImage ? 'cover' : '14px'}"
            >

                <img v-show="isHover && !isActive" src="../../../public/img/PlayButton.png" alt="">

                <img v-show="isHover && isActive" src="../../../public/img/PauseButton.png" alt="">

                <img v-show="isActive && !isHover" src="https://res.cloudinary.com/dmf10fesn/image/upload/v1548886976/audio/assets/animated-sound-bars.gif" alt="">

            </div>

            <div class="row">
                <span class="userLink" @click.stop.prevent="$router.push({ name: 'user', params: { userId: track.user._id } }).catch(()=>{})">{{track.user.username}}</span>
                <span style="margin: 0px 5px; user-select: none;">—</span>
                <span style="color:#3E3E3E">{{trackTitle}}</span>
            </div>
            <div class="endInfo" style="margin-left: auto">
                <span style="margin-right: 12px" v-show="!isActive">{{this.$moment("2015-01-01").startOf('day').seconds(duration).format('m:ss')}}</span>
                <span style="margin-right: 12px" v-show="isActive">{{this.$moment("2015-01-01").startOf('day').seconds(getTime).format('m:ss')}}</span>
                <i class="material-icons">play_arrow</i>
                <span>0</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "albumTrack",
        data(){
            return{
                isHover:false,
                duration : 0,
                music: new Audio(this.track.url),
            }
        },
        props:{
            track : Object,
            isActive : {type:Boolean, default: false},
            hover: {type:Boolean, default: true}
        },
        methods:{
            musicTime(){
                this.music.onloadedmetadata = () => {
                    this.duration = this.music.duration
                }
            }
        },
        mounted(){
            this.musicTime()
        },
        computed: {
            trackImage() {
                if (this.track.logo === "") {
                    return false
                } else {
                    return this.track.logo.replace(/\/|\\/g, "/")
                }
            },
            trackTitle(){
                if(this.track.title.length >= 45){
                    return this.track.title.slice(0, 45) + "..."
                }
                return this.track.title
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
        padding: 8px 0px;
        border-bottom: 1px solid #eeeeee;
        margin: 0px 20px;
    }
    .outer:hover{
        background-color: #efefef;
        cursor: pointer;
    }
    .outer:hover .logo{
        transition: 0.2s;
        box-shadow: inset 0px 0px 0px 50px rgba(50, 50, 50, 0.5);
    }
    .row{
        display: flex;
        align-items: center;
        flex-direction: row;
        font-family: "Source Sans Pro";
        font-size: 16px;
        margin-left:20px;
        color:#9D9D9D
    }
    .endInfo{
        display: flex;
        align-items: center;
        flex-direction: row;
        user-select: none;
    }
    .endInfo i{
        font-size: 16px;
        color: #A4A4A4;
    }
    .endInfo span{
        font-family: "Open Sans";
        font-size: 14px;
        margin-left: 2px;
        color: #9c9c9c;
        font-size: 14px;
        font-weight: 100;
    }
    .logo{
        background-image: url("../../../public/img/musicPlaceholder.png");
        background-repeat: no-repeat;
        background-position: center;
        background-color: #e8e8e8;
        width: 24px;
        height: 24px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    .logo img{
        width: 16px;
        height: 16px;
    }
    .userLink:hover{
        cursor: pointer;
        text-decoration: underline;
    }
    .activeTrack{
        background-color: #efefef;
    }
    .activeLogo{
        box-shadow: inset 0px 0px 0px 50px rgba(50, 50, 50, 0.5);
    }
</style>