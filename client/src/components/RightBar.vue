<template>
    <div class="bar">

        <div v-show="history.length > 0" class="history">

            <div class="historyImg">
                <span>Listening History</span>
            </div>

            <div class="historyTrack" v-for="track in history" :key="track.id" @click="chooseManual(track._id)">
                <img v-if="track.logo" :src="track.logo" alt="">
                <img v-else src="../../public/img/musicPlaceholder.png" class="placeholder" alt="">
                <div class="trackInfo">
                    <router-link style="width: auto" class="link" :to="{ name: 'user', params: { userId: track.user._id } }">
                        <span style="color:#898888; font-size: 12px">{{track.user.username}}</span>
                    </router-link>
                    <span style="color:#2D2D2D; font-size: 14px">{{track.title}}</span>
                </div>
                <div class="trackPlays">
                    <i class="material-icons">play_arrow</i>
                    <span>{{track.listen}}</span>
                </div>
            </div>

        </div>

        <div class="topAlbums">

            <div class="albumImg">
                <span>Recommend albums</span>
            </div>

            <div class="albumTrack" v-for="(album,index) in albums" :key="album.id">
                <span>{{index + 1}}</span>
                <i class="material-icons">circle</i>
                <img v-if="album.logo" :src="album.logo" alt="">
                <img v-else src="../../public/img/musicPlaceholder.png" alt="">
                <span class="link" @click="openAlbum(album._id)" style="margin-left: 10px">{{album.title}}</span>
            </div>

        </div>

        <div class="topAuthors">

            <div class="authorImg">
                <span>Recommend Authors</span>
            </div>

            <div class="authorTrack" v-for="author in authors" :key="author.id">
                <i style="margin: 0px 10px 0px 0px;" class="material-icons">circle</i>
                <img style="border-radius: 50%; object-fit: cover; " v-if="author.settings" :src=author.settings.avatar alt="">
                <img v-else src="../../public/img/userLogo.png" alt="">
                <router-link class="link" :to="{ name: 'user', params: { userId: author._id } }">
                    <span style="margin-left: 10px">{{author.username}}</span>
                </router-link>
                    <Verified_icon :role=author.roles style="margin-left: 2px;font-size: 16px" />
            </div>

        </div>

        <div class="footer">

            <div>
                <span>Help</span> -
                <span>Copyrights</span> -
                <router-link class="downLink" :to="{name: 'terms'}">
                <span>Terms</span>
                </router-link> -
                <span>Contacts</span> -
                <span>News Feed</span> -
                <span>Albums</span> -
                <span>Favorite</span> -
                <span>Profile settings</span>
            </div>

            <span style="margin: 8px 0px; text-decoration: underline;">musicamp@gmail.com</span>

            <span>Musicamp © 2021. All rights reserved</span>

        </div>

    </div>
</template>

<script>
    import axios from "axios";
    import Verified_icon from "./modals/Verified_icon";

    export default {
        components:{
            Verified_icon
        },
        name: "RightBar",
        data(){
            return{
                albums : [],
                authors : [],
                history : [],
            }
        },
        methods:{
            chooseManual(id){
                if( id !== this.$store.getters.getСurrentPlaylist ){
                    const res = this.$store.dispatch('loadLast', id)
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
            },
            openAlbum(payload){
                this.$router.push({query : {playlist : payload}})
                this.$modal.show('showAlbum')
            },
            async getAlbums(){
                try{
                    const res = await axios.get("http://musicamp.std-263.ist.mospolytech.ru/music/getAlbum", { params: {type : "randomAlbum"}})
                    this.albums = res.data
                }catch (e) {
                    this.errorPost = "Ошибка подключения к сети"
                }
            },
            async getAuthors(){
                try{
                    const res = await axios.get("http://musicamp.std-263.ist.mospolytech.ru/auth/getAuthors", { params: {type : "randomUsers"}})
                    this.authors = res.data
                }catch (e) {
                    this.errorPost = "Ошибка подключения к сети"
                }
            },
            async findHistory(){
                try{
                    const res = await axios.get("http://musicamp.std-263.ist.mospolytech.ru/music/getUserTracks", { params: {type : "history", arr: JSON.stringify(this.$store.getters.getHistory) }})
                    this.history = res.data.reverse()
                }catch (e) {
                    this.errorPost = "Ошибка подключения к сети"
                }
            },
        },
        mounted() {
            this.getAlbums()
            this.getAuthors()
            if( !localStorage.getItem('token') ){
                return
            }
            if(localStorage.history){
                const hlc = localStorage.getItem('history')
                this.$store.commit("addHistory", JSON.parse(hlc))
            }
            this.findHistory()
        },
    }
</script>

<style scoped>
    .bar{
        width: 330px;
        background-color: #F9F9F9;
        border: 1px solid #D7D7D7;
        display: flex;
        flex-direction: column;

    }
    .historyImg{
        background-image: url("../../public/img/historyImg.png");
        background-size: cover;
        height: 100px;
        display: flex;
        flex-direction: row;
        align-items: flex-end;
    }
    .historyImg span, .albumImg span, .authorImg span{
        margin: 10px;
        color:#F6F6F6;
        font-family: "PT sans";
        font-size: 16px;
    }
    .historyTrack, .albumTrack, .authorTrack{
        border-top: 1px solid #D7D7D7;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 8px 12px;
    }
    .historyTrack img, .albumTrack img, .authorTrack img{
        width: 40px;
        height: 40px;
        border-radius: 10px;
    }
    .authorTrack img{
        border-radius: 30px;
    }
    .historyTrack .trackInfo{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-left: 10px;
        font-family: "Open Sans";
    }
    .historyTrack:hover{
        background-color: #efefef;
        cursor: pointer;
    }
    .historyTrack .trackPlays{
        display: flex;
        flex-direction: row;
        align-items: center;
        color: #A4A4A4;
        font-family: "Open Sans";
        font-weight: lighter;
        font-size: 14px;
        margin-left: auto;
        align-self: flex-end;
    }
    .historyTrack .trackPlays i{
        font-size: 14px;
    }
    .albumImg{
        background-image: url("../../public/img/AlbumImg.png");
        background-size: cover;
        height:100px;
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        border-top: 1px solid #D7D7D7;
    }
    .albumTrack span, .authorTrack span{
        font-family: "Open Sans";
        color:#2D2D2D;
        font-size: 14px
    }
    .albumTrack i, .authorTrack i:first-child{
        font-size: 10px;
        color:#53D218;
        margin: 0px 10px;
    }
    .authorImg{
        background-image: url("../../public/img/authorImg.png");
        background-size: cover;
        height: 100px;
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        border-top: 1px solid #D7D7D7;
    }
    .footer{
        border-top: 1px solid #D7D7D7;
        display: flex;
        flex-direction: column;
        padding: 10px;
        font-family: "PT sans";
        font-size: 14px;
    }
    .footer div{
        color:#767676;
    }
    .footer div span:hover{
        text-decoration: underline;
        cursor: pointer;
    }
    .link{
        color:#2D2D2D;
        text-decoration: none;
    }
    .link:hover{
        text-decoration: underline;
        cursor: pointer;
    }
    .placeholder{
        background-color: #e8e8e8;
        width: 24px !important;
        height: 24px !important;
        padding: 8px;
    }
    .downLink{
        text-decoration: none;
        color:#767676;
    }
</style>