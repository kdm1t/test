<template>
    <div class="album" v-if="ready">

        <div class="header">
            <img v-if="!album.logo" src="../../public/img/musicPlaceholder.png" class="logo"  alt="">
            <img v-else :src="album.logo" style="object-fit: cover; padding: 0px;  width: 180px; height: 180px;"  class="logo"  alt="">
            <div class="info">
                <span class="heading">{{album.title}}</span>
                <div class="infoRow moreInfo">
                    <span>{{album.user.username}}</span>
                    <span style="margin: 0px 5px; user-select: none;">•</span>
                    <span>{{ this.$moment(album.created).format('YYYY') }}</span>
                    <span style="margin: 0px 5px; user-select: none;">•</span>
                    <span>{{this.$moment("2015-01-01").startOf('day').seconds(album.duration).format('m:ss')}}</span>
                </div>
                <div class="infoRow" style="user-select: none">
                    <img @click="chooseManual(0)" src="../../public/img/PlayButton.png" alt="">
                    <i style="margin: 0px 14px" class="material-icons">favorite_border</i>
                    <i class="material-icons">file_download</i>
                    <div class="tags">
                        <span>retrowave</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="tracks">

            <albumTrack v-for="(track, id) in album.tracks "
                        :key="track.id"
                        :track=track
                        @active="chooseManual(id)"
                        :isActive="track._id === $store.getters.getCurrentTrack._id ? $store.getters.isPlaying : false"
                        :hover="track._id === $store.getters.getCurrentTrack._id ? $store.getters.isPlaying : true"
            />

        </div>

        <div class="footer">
            <hr>
            <span @click="deleteAlbum">Delete Album</span>
        </div>

    </div>
</template>

<script>

    import albumTrack from  './modals/albumTrack'
    import axios from "axios";

    export default {
        components:{
            albumTrack
        },
        data(){
            return{
                album: {},
                ready:false
            }
        },
        name: "SingleAlbum",
        async created() {
            try{
                const res = await axios.get("http://musicamp.std-263.ist.mospolytech.ru/music/getAlbum", { params: {id: this.$route.query.playlist , type : "album"}})
                this.album = res.data
                this.ready = true
            }catch (e) {
                this.errorPost = "Ошибка подключения к сети"
            }
        },
        destroyed() {
            let query = Object.assign({}, this.$route.query);
            delete query.playlist;
            this.$router.replace({ query });
        },
        computed:{
            index(){
                if(this.album){
                    if( this.album._id === this.$store.getters.getСurrentPlaylist ){
                        return this.$store.getters.index
                    }
                }
                return -1
            }
        },
        methods:{
            async deleteAlbum(){
                const createData = {
                    id : this.album._id,
                    type : "Album"
                }
                try {
                    await axios.post("http://musicamp.std-263.ist.mospolytech.ru/music/deleteTrack", createData, {headers:{ authorization : 'Bearer ' + localStorage.getItem('token')}})
                    this.$emit('reload')
                    this.$modal.hide('showAlbum')
                } catch (e) {
                    this.error = e.response.data.message
                    console.log(e)
                }
            },
            chooseManual(id){
                if( this.album._id !== this.$store.getters.getСurrentPlaylist ){
                    const res = this.$store.dispatch('loadLast', this.album._id)
                    this.$store.commit("setIndex", id)
                    res.then( () => {
                        this.$root.$emit('musicStart')
                    })
                    return
                }
                if ( this.$store.getters.getCurrentTrack._id === this.album.tracks[id]._id && this.$store.getters.isPlaying === true){
                    this.$root.$emit('musicPause')
                    return
                }
                if ( this.$store.getters.getCurrentTrack._id === this.album.tracks[id]._id && this.$store.getters.isPlaying === false){
                    this.$root.$emit('musicPlay')
                    return
                }
                this.$store.commit("setIndex", id)
                this.$root.$emit('musicStart')
            }
        }
    }
</script>

<style scoped>
    .logo{
        width: 100px;
        height: 100px;
        padding: 40px;
        background-color: #eeeeee;
    }
    .header{
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .info{
        display: flex;
        flex-direction: column;
        margin-left: 20px;
        width: 100%;
    }
    .info .infoRow{
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .info .infoRow:last-child img{
        width: 50px;
        height: 50px;
    }
    .info .infoRow:last-child i{
        font-size: 30px;
        color: #878787;
    }
    .infoRow img:hover{
        cursor: pointer;
        opacity: 0.8;
    }
    .infoRow img:active{
        width: 40px !important;
        height: 40px !important;
        padding: 5px;
    }
    .info .heading{
        font-family: "Open Sans";
        font-weight: 700;
        font-size: 26px;
        word-break: break-word;
    }
    .info .moreInfo{
        color: #898888;
        font-family: "Open Sans";
        margin-bottom: 10px;
        font-size: 15px;
    }
    .tags{
        display: flex;
        flex-direction: row;
        margin-left: auto;
        align-self: flex-end;
        margin-right: 20px;
    }
    .tags span{
        font-family: "Open Sans";
        color: white;
        background-color: #5F74E5;
        border-radius: 40px;
        font-size: 13px;
        padding: 2px 6px;
    }
    .footer hr{
        border: 1px solid #12ADDE;
    }
    .footer{
        margin-bottom: 10px;
    }
    .footer span{
        margin: 20px;
        font-family: "Open Sans";
        font-size: 13px;
        color: #848484;
    }
    .footer span:hover{
        text-decoration: underline;
        cursor: pointer;
    }
</style>