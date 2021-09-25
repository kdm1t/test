<template>
    <div class="player">
        <div class="main" v-click-outside="closePlaylist">

            <div class="trackInfo" >
                <div class="img" v-bind:style="{'backgroundImage': trackImage ? 'url('+ trackImage +')' : '', 'background-size': trackImage ? 'cover' : '24px'}" ></div>
                <div v-if="$store.getters.getReady">
                    <span @click="$router.push({ name: 'user', params: { userId: trackArray[index].user._id } }).catch(()=>{})" >{{trackArray.length !== 0 ? trackArray[index].user.username : ""}}</span>
                    <span>{{ trackTitle }}</span>
                </div>
            </div>

            <div class="control">
                <i class="material-icons" @click="prev">skip_previous</i>
                <i style="font-size: 36px; color: #d5d5d5;" class="material-icons" v-if="!musicActive" @click="playButton" >play_arrow</i>
                <i style="font-size: 36px; color: #d5d5d5;" class="material-icons" v-else @click="pauseButton">pause</i>
                <i class="material-icons" @click="next">skip_next</i>
            </div>

            <div class="timeBlock" @mousedown="timeChange = true" @click="setTime($event, true)">
                <div ref="time" class="timeline">
                    <div class="timeFill" :style="{ width : trackTime + '%' }"></div>
                    <div class="timeDot" :style="{ display: timeChange ? 'block' : '' }"></div>
                </div>
            </div>
            <span v-show="!timeType" class="timer" @click="timeType = !timeType">
                {{this.$moment("2015-01-01").startOf('day').seconds(currentTime).format('m:ss')}}
            </span>
            <span v-show="timeType" class="timer" @click="timeType = !timeType">
                {{"-" + this.$moment("2015-01-01").startOf('day').seconds(musicTime - currentTime).format('m:ss')}}
            </span>

            <div class="volume">
                <i v-if="volume >= 40" class="material-icons" @click="changeVolumeButton" >volume_up</i>
                <i v-else-if="volume < 40 && volume > 0" class="material-icons" @click="changeVolumeButton" >volume_down</i>
                <i v-else-if="volume <= 0" class="material-icons" @click="changeVolumeButton" >volume_off</i>
                <div class="volumeBlock"
                     @mousedown="volumeChange = true"
                     @click="setVolume($event, true)"
                >
                    <div ref="volume" class="volumeLine">
                            <div :style="{ width : volume + '%' }" class="volumeFill"></div>
                            <div :style="{ display: volumeChange ? 'block' : '' }" class="volumeDot">
                                <div class="bubble">{{volume + '%'}}</div>
                            </div>
                    </div>
                </div>
            </div>
            <div style="margin-left: 20px" class="settings">
                <i class="material-icons">add</i>
                <i  @click="replay = 1" v-if="replay === 0" class="material-icons">replay</i>
                <i @click="replay = 2" v-else-if="replay === 1" class="activeButton material-icons">replay</i>
                <i @click="replay = 0" v-else class="activeButton material-icons">restart_alt</i>
                <i :class="{activeButton : random}" @click="shuffleArray()" class="material-icons">shuffle</i>
                <i :class="{activeButton : playlist}" class="material-icons" @click="playlist = !playlist">queue_music</i>

                <transition name="height">
                <div  class="playlist" :style="[trackArray.length > 8 ?  {'height' : '200px'} : {'height' : trackArray.length * 26 + 'px'}]" v-show="playlist && trackArray.length > 1">
                    <div class="row"
                         v-for="(track, id) in trackArray"
                         :key="track.id"
                         :class="{activePlaylist: trackArray[index] === track}"
                         @click="chooseManual(id)"
                    >
                        <i v-if="trackArray[index] === track && musicActive" class="material-icons">pause</i>
                        <i v-else class="material-icons">play_arrow</i>
                        <span>{{track.title.length > 40 ? track.title.slice(0, 40) + "..." : track.title}}</span>
                        <div>
                            <span>{{track.user.username}}</span>
                        </div>
                    </div>
                </div>
                </transition>

            </div>
        </div>
    </div>
</template>

<script>
    import _ from "lodash";
    import { mapGetters } from 'vuex';
    import ClickOutside from 'vue-click-outside'

    export default {
        name: "musicPlayer",
        directives: {
            ClickOutside
        },
        data(){
            return{
                volume:20,
                volumeChange:false,
                musicTime: 0,
                currentTime: 0,
                timeChange: false,
                timeType: false,
                music: new Audio(),
                musicActive: false,
                timer: 0,
                replay: 0,
                random : false,
                trackArray:[],
                playlist:false
            }
        },
        watch:{
            getReady(newVal){
                if(!newVal){
                    return
                }
                if(localStorage.lastAlbum){
                    if(localStorage.musicIndex){
                        this.$store.commit("setIndex", localStorage.musicIndex)
                    }
                    if(localStorage.musicTime){
                        this.$store.commit("setTime", localStorage.musicTime)
                        this.music.currentTime = localStorage.musicTime
                        this.currentTime = localStorage.musicTime
                    }
                    if(localStorage.musicVolume){
                        this.volume = localStorage.musicVolume
                    }
                }
                this.startArray()
             },
            musicActive(){
                this.$store.commit("setPlaying", this.musicActive)
            }
        },
        created() {
            window.addEventListener('mousemove', this.setVolume)
            window.addEventListener('mouseup', this.changeVolumeEnd)

            window.addEventListener('mousemove', this.setTime)
            window.addEventListener('mouseup', this.changeTimeEnd)

            this.$root.$on('musicStart', () => {
                this.startTrack()
                this.playButton()
            })

            this.$root.$on('musicPause', () => {
                this.pauseButton()
            })

            this.$root.$on('musicPlay', () => {
                this.playButton()
            })

            if(localStorage.lastAlbum){
                this.$store.dispatch('loadLast', localStorage.lastAlbum)
            }
        },
        computed:{
            ...mapGetters(['getReady', 'getLengthQueue', 'getAllTracks', 'index']),
            trackTime(){
                return Math.abs( (this.currentTime / this.musicTime * 100) )
            },
            trackTitle(){
                if(this.trackArray.length === 0){
                    return "trackTitle"
                }
                if(this.trackArray[this.index].title.length > 20){
                    return this.trackArray[this.index].title.slice(0, 20) + "..."
                }
                return this.trackArray[this.index].title
            },
            trackImage(){
                if(this.getReady === false){
                    return false
                }
                if(this.trackArray[this.index].logo === ""){
                    return false
                } else{
                    return this.trackArray[this.index].logo.replace(/\/|\\/g, "/")
                }
            }
        },
        methods:{
            closePlaylist(){
                if(this.playlist){
                    this.playlist = false
                }
            },
            shuffleArray(){
                if(this.trackArray.length === 0){
                    return
                }
                this.random = !this.random
                if(this.random){
                    const shuffle = function(array) {
                        for (let i = array.length - 1; i > 0; i--) {
                            let j = Math.floor(Math.random() * (i + 1));
                            [array[i], array[j]] = [array[j], array[i]];
                        }
                    }
                    this.allTracks = shuffle(this.getAllTracks)
                    this.playButton()
                }else{
                    this.startArray()
                }
            },
            setVolume: _.throttle(function (event, clickEvent){
                if(!this.volumeChange && !clickEvent){
                    return false
                }
                let portion = (this.$refs.volume.offsetLeft) - event.clientX
                if(portion > 0){
                    portion = 0
                }
                if(portion < -80){
                    portion = -80
                }
                this.volume = Math.abs(Math.round((portion / 80) * 100))
                this.music.volume = (this.volume / 100)
                localStorage.musicVolume = this.volume
            }, 50),
            changeVolumeEnd(){
                if(this.volumeChange){
                    this.volumeChange = false
                }
            },
            changeVolumeButton(){
                if(this.volume <= 0){
                    this.volume = 40
                    this.music.volume = (this.volume / 100)
                } else{
                    this.volume = 0
                    this.music.volume = (this.volume / 100)
                }
            },
            setTime: _.throttle(function (event, clickEvent){
                if(!this.timeChange && !clickEvent){
                    return false
                }
                let portion = (this.$refs.time.offsetLeft) - event.clientX
                if(portion > 0){
                    portion = 0
                }
                if(portion < (-1 * this.$refs.time.clientWidth) ){
                    portion = (-1 * this.$refs.time.clientWidth)
                }
                const percent = Math.abs(Math.round((portion / this.$refs.time.clientWidth) * 100))

                this.currentTime = this.musicTime * (percent / 100)
                if(clickEvent){
                    this.changeTimeEnd('',true)
                }
            }, 50),
            changeTimeEnd(event, clickEvent){
                if(this.timeChange || clickEvent){
                    this.timeChange = false
                    this.music.currentTime = this.currentTime
                    this.$store.commit("setTime", this.currentTime)
                }
            },
            getMusicTime(){
                this.music.onloadedmetadata = () => {
                    this.musicTime = this.music.duration
                }
            },
            watchTime(){
                if(!this.timeChange){
                    this.currentTime = this.music.currentTime
                    this.$store.commit("setTime", this.currentTime)
                }
            },
            startArray(){
                this.trackArray = this.getAllTracks
                this.startTrack()
            },
            startTrack(){
                this.music.volume = (this.volume / 100)
                this.music.src = this.trackArray[this.index].url
                this.getMusicTime()
            },
            playButton(){
                this.$store.commit("addToHistory", this.$store.getters.getCurrentTrack._id)

                if(this.trackArray.length === 0){
                    return
                }
                this.music.play()

                this.timer = setInterval(this.watchTime, 100);
                this.music.addEventListener("ended", this.trackEnd)
                this.musicActive = true
            },
            pauseButton(){
                this.music.pause()
                this.musicActive = false
            },
            trackEnd(){
                if(this.replay === 1){
                    this.playButton()
                    return
                }
                if(this.index >= (this.getLengthQueue - 1) ){
                    this.$store.commit("setIndex", 0)
                    this.startTrack()
                    if(this.replay === 2){
                        this.playButton()
                        return
                    }
                    this.currentTime = 0
                    this.musicActive = false
                    return
                }
                this.next()
            },
            next(){
                if(this.trackArray.length === 0){
                    return
                }
                this.music.removeEventListener('ended', this.trackEnd)
                this.$store.commit("setIndex", this.index + 1 )
                if(this.index > this.getLengthQueue - 1){
                    this.$store.commit("setIndex", 0)
                }
                this.startTrack()
                this.playButton()
            },
            prev(){
                if(this.trackArray.length === 0){
                    return
                }
                if(this.currentTime >= 10){
                    this.startTrack()
                    this.playButton()
                    return
                }
                this.$store.commit("setIndex", this.index - 1 )
                if(this.index < 0){
                    this.$store.commit("setIndex", this.getLengthQueue - 1)
                }
                this.startTrack()
                this.playButton()
            },
            chooseManual(id){
                if(this.musicActive && this.index === id){
                    this.pauseButton()
                    return
                }
                if(!this.musicActive && this.index === id){
                    this.playButton()
                    return
                }
                this.$store.commit("setIndex", id)
                this.startTrack()
                this.playButton()
            }
        }
    }
</script>

<style scoped>
    .player{
        height: 60px;
        background-color: #505050;
        width: 100%;
        position: fixed;
        bottom: 0px;
        border-top: 1px solid #24596c;
        box-shadow: inset 0 25px 40px -5px rgba(212, 214, 215, 0.1);
    }
    .main{
        width: 1100px;
        margin: auto;
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 100%;
    }
    .control i{
        font-size: 24px;
        color: #acacac;
    }
    .control i:hover{
        color: #bababa;
        cursor: pointer;
    }
    .control, .settings{
        display: flex;
        flex-direction: row;
        align-items: center;
        user-select: none;
    }
    .settings i:hover, .volume i:hover{
        color: #bababa;
        cursor: pointer;
    }
    .timeline{
        background-color: #898989;
        height: 2px;
        border-radius: 2px;
        margin-left: 14px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .timeBlock{
        width: 50%;
        padding: 8px 2px;
    }
    .timeFill{
        background-color: #c9e2ea;
        width: 90%;
        height: 2px;
        border-radius: 2px;
        margin: 0px;
    }
    .timeDot{
        background-color: #12ADDE;
        height: 8px;
        width: 8px;
        border-radius: 40px;
        position: relative;
        display: none;
        margin-left: -4px;
    }
    .timer{
        font-family: "Open Sans";
        font-weight: lighter;
        font-size: 14px;
        margin-left: 14px;
        color: #a1a1a1;
        user-select: none;
    }
    .timer:hover{
        cursor: pointer;
    }
    .trackInfo{
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-right: 14px;
        font-family: "Source Sans Pro";
        border: 1px solid #5f5f5f;
        border-radius: 4px;
    }
    .trackInfo div{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-left: 10px;
        width: 160px;
    }
    .trackInfo .img{
        width: 46px;
        height: 46px;
        background-color: #e8e8e8;
        background-image: url("../../../public/img/musicPlaceholder.png");
        background-repeat: no-repeat;
        background-position: center;

        border-radius: 4px;
        border-right: 1px solid #5f5f5f;
        user-select: none;
        margin: 0px;
    }
    .trackInfo div span:first-child{
        font-weight: 300;
        font-size: 14px;
        color: #bdbdbd;
        user-select: none;
    }
    .trackInfo div span:first-child:hover{
        cursor: pointer;
        text-decoration: underline;
    }
    .trackInfo div span:last-child{
        font-weight: normal;
        font-size: 14px;
        color: #e0e0e0;
    }
    .settings i{
        font-size: 21px;
        color: #909090;
        margin: 0px 6px;
    }
    .activeButton{
        color: #e5e5e5 !important
    }
    .volume{
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-left: 26px;
    }
    .volume i{
        font-size: 21px;
        color: #acacac;
        margin-right: 6px;
        user-select: none;
    }
    .volumeLine{
        background-color: #898989;
        width: 80px;
        height: 2px;
        border-radius: 2px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .volumeBlock{
        padding: 8px 2px;
    }
    .volumeFill{
        background-color: #c9e2ea;
        width: 50%;
        height: 2px;
        border-radius: 2px;
        margin: 0px;
    }
    .volumeDot{
        background-color: #12ADDE;
        height: 8px;
        width: 8px;
        border-radius: 40px;
        position: relative;
        display: none;
        margin-left: -4px;
    }
    .volumeBlock:hover .volumeDot, .timeBlock:hover .timeDot{
        display: block;
    }
    .volumeBlock:hover, .timeBlock:hover{
        cursor: pointer;
    }
    .bubble{
        background-color: rgba(28, 28, 28, 0.8);
        color: #f5f5f5;
        font-family: "Open Sans";
        font-size: 12px;
        padding: 4px 8px;
        border-radius: 4px;
        position:fixed;
        margin-top: -28px;
        margin-left: -16px;
        user-select: none;
    }
    .playlist{
        position: fixed;
        bottom: 61px;
        display: flex;
        flex-direction: column;
        background-color: #5d7d87;
        width: 380px;
        margin-left: -248px;
        height: 200px;
        overflow-y: auto;
    }
    .playlist .row{
        display: flex;
        flex-direction: row;
        align-items: center;
        color: #e0e0e0;
        padding: 2px 10px 2px 2px;
        font-family: "Open Sans";
        font-weight: lighter;
        font-size: 14px;
        border-bottom: 1px solid #24596c;
    }
    .playlist .row:hover{
        background-color: rgba(255, 255, 255, 0.25);
        cursor: pointer;
    }
    .activePlaylist{
        background-color: rgba(255, 255, 255, 0.15);
    }
    .playlist .row:last-child {
        border:none
    }
    .playlist .row div {
        margin-left: auto;
        display: flex;
        flex-direction: row;
        align-items: center;
        color: #bdbdbd;
    }
    .playlist .row i {
        color: #e0e0e0;
    }
    .playlist::-webkit-scrollbar {
        width: 12px;
    }
    .playlist::-webkit-scrollbar-thumb {
        background-color: #e0e0e0;    /* цвет плашки */
        border-radius: 20px;       /* закругления плашки */
        border: 3px solid #5d7d87;  /* padding вокруг плашки */
    }
    .height-enter-active {
        animation: bounce-in .4s;
    }

    .height-leave-active {
        animation: bounce-in .4s reverse;
    }
    @keyframes bounce-in {
        0% {
            max-height: 0;
        }
        100% {
            max-height: 200px;

        }
    }
</style>