<template>
    <div class="track">


        <div class="trackInfo" @click="chooseManual" :class="{active : isActive}">


                <img v-if="!isActive" src="../../../public/img/PlayButton.png" alt="">

                <img v-else src="../../../public/img/PauseButton.png" alt="">

                <img v-show="false" src="../../../public/img/PauseButton.png" alt="">

                <div class="trackPlay">
                    <span style="color:#727272;font-size: 14px;" @click.stop.prevent="$router.push({ name: 'user', params: { userId: user._id } }).catch(()=>{})" >{{user.username}}</span>
                    <span style="margin:0px 5px; user-select: none">-</span>
                    <span>{{title}}</span>
                </div>

                <div class="trackMore">
<!--                    <div><i style="font-size: 16px;margin-right: 3px;" class="material-icons">favorite_border</i><span>0</span></div>-->
                    <div v-if="!isActive" style="margin-right: 12px"><span>{{this.$moment("2015-01-01").startOf('day').seconds(duration).format('m:ss')}}</span></div>
                    <div v-else style="margin-right: 12px"><span>{{this.$moment("2015-01-01").startOf('day').seconds(getTime).format('m:ss')}}</span></div>
                    <div><i style="font-size: 14px" class="material-icons">play_arrow</i><span>{{listen}}</span></div>
                </div>


        </div>

        <div style="user-select: none" v-show="attachable" class="attachable">
            <i class="material-icons" @click="$emit('remove')">close</i>
        </div>

    </div>
</template>

<script>
    export default {
        name: "postTrack",
        data(){
            return{
                duration : 0,
                music: new Audio(this.url)
            }
        },
        props:{
            id : String,
            listen : Number,
            logo : String,
            title : String,
            url : String,
            user : Object,
            attachable : {type:Boolean, default: false}
        },
        computed:{
            trackImage(){
                if(this.logo === ""){
                    return false
                } else{
                    return this.logo.replace(/\/|\\/g, "/")
                }
            },
            getTime(){
                return this.$store.getters.currentTime
            },
            isActive(){
                if(this.$store.getters.getСurrentPlaylist === this.id && this.$store.getters.isPlaying === true){
                    return true
                }
                return false
            }
        },
        methods:{
            musicTime(){
                this.music.onloadedmetadata = () => {
                    this.duration = this.music.duration
                    this.$emit('duration', this.duration)
                }
            },
            chooseManual(){
                if( this.id !== this.$store.getters.getСurrentPlaylist ){
                    const res = this.$store.dispatch('loadLast', this.id)
                    this.$store.commit("setIndex", 0)
                    res.then( () => {
                        this.$root.$emit('musicStart')
                    })
                    return
                }
                if ( this.$store.getters.getСurrentPlaylist === this.id && this.$store.getters.isPlaying === true){
                    this.$root.$emit('musicPause')
                    return
                }
                if ( this.$store.getters.getСurrentPlaylist === this.id && this.$store.getters.isPlaying === false){
                    this.$root.$emit('musicPlay')
                    return
                }
                this.$root.$emit('musicStart')
            }
        },
        mounted(){
            this.musicTime()
        }
    }
</script>

<style scoped>
    .track{
        display: flex;
        height: 40px;
        flex-direction: row;
        flex-grow: 1;
        margin: 4px 0px;
    }
    .trackInfo:hover{
        cursor: pointer;
    }
    .albumLogo{
        background-image: url("../../../public/img/musicPlaceholder.png");
        background-repeat: no-repeat;
        background-position: center;
        background-size: 20px;
        background-color: #e8e8e8;
        width: 40px;
    }
    .trackInfo{
        display: flex;
        flex-direction: row;
        border-radius: 4px;
        height: 40px;
        flex-grow: 1;
        align-items: center;
    }
    .trackInfo:hover{
        background-color: #EFEFEF;
    }
    .active{
        background-color: #EFEFEF;
    }
    .trackPlay{
        display: flex;
        margin-left: 6px;
        font-size: 15px;
        font-family: "Open Sans";
        font-weight: 500;
        flex-direction: row;
        line-height: 16px;
        flex-grow: 1;
    }
    .trackMore{
        display: flex;
        margin-left: 6px;
        font-family: "Open Sans";
        font-weight: 100;
        flex-direction: row;
        line-height: 30px;
        margin-right: 10px;
        color: #9c9c9c;
        font-size: 14px;
        user-select: none;
    }
    .trackMore div{
        align-items: center;
        display: flex;
    }
    .trackInfo img{
        width: 24px;
        height: 24px;
        margin-left: 12px;
        margin-right: 6px;
        user-select: none;
    }
    .trackPlay span:first-child:hover{
        cursor: pointer;
        text-decoration: underline;
    }
    .trackPlay span:last-child{
        user-select: text;
    }
    .attachable{
        display: flex;
        align-items: center;
        margin: 0px 5px;
        color: #898989;
    }
    .attachable i:hover{
        color: #2f2f2f;
        cursor: pointer;
    }
</style>