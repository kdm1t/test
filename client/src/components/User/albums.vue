<template>
    <div class="background">
        <div class="header">
            <span>Upload album</span>
            <i v-show="this.$route.params.userId === $store.getters.getUser.id" @click="$modal.show('albumUpload')" class="material-icons">file_upload</i>
        </div>
        <modal name="albumUpload"  :width="550" :height="700" :styles="'background-color: #F9F9F9;'">
            <albumUpload @close="closeModal" />
        </modal>

        <div class="albums" v-if="allAlbums.length > 0">

            <div v-show="(allAlbums.length > 5)" style="display: flex;flex-direction: row;align-items: center; position: relative; top:140px; margin-top: -80px">
                <div @click="slidePrev" v-show="currentSlide > 0" class="arrow"><i style="transform: rotate(-180deg);" class="material-icons">play_arrow</i></div>
                <div @click="slideNext" v-show="currentSlide + 5 < allAlbums.length" style="margin-left: auto" class="arrow"><i class="material-icons">play_arrow</i></div>
            </div>

            <div :style="[(allAlbums > 5) ? {'margin': '0px 10px 0px 20px'} : {'margin':'0px' }]">
                <hooper :transition="200" :itemsToShow="5" :mouseDrag="false"  ref="carousel" @slide="updateCarousel" >
                    <slide v-for="album in allAlbums" :key="album.id">
                        <div class="albumBlock">
                            <div class="albumLogo"
                                 @click="openAlbum(album._id)"
                                 v-bind:style="{'backgroundImage': albumImage(album.logo) ? 'url('+ albumImage(album.logo) +')' : '', 'background-size': albumImage(album.logo) ? 'cover' : '60px'}"
                            >

                                <div @click.stop.prevent="playAlbum(album._id)" class="controller">
                                    <i  style="border-radius: 99px; background-color: #12ADDE"
                                       class="material-icons">{{$store.getters.getСurrentPlaylist === album._id && $store.getters.isPlaying ? "pause" : "play_arrow"}}
                                    </i>
                                </div>

                                <div class="logoInfo">
                                    <div><i class="material-icons">queue_music</i><span>{{album.tracks.length}}</span></div>
                                    <div><i class="material-icons">play_arrow</i><span>{{album.tracks.map(listen => listen.listen).reduce((a, b) => a + b, 0)}}</span></div>
                                </div>
                                
                            </div>

                            <div class="albumInfo">
                                <span>{{album.title}}</span>
                                <span class="userLink" @click.stop.prevent="$router.push({ name: 'user', params: { userId: album.user._id } }).catch(()=>{})">{{album.user.username}}</span>
                            </div>
                        </div>
                    </slide>
                </hooper>
            </div>

        </div>
    </div>
</template>

<script>
    import albumUpload from "../modals/albumUpload"
    import axios from "axios";

    import { Hooper, Slide} from 'hooper';
    import 'hooper/dist/hooper.css';

    export default {
        name: "albums",
        components:{albumUpload, Hooper, Slide},
        data(){
            return{
                allAlbums : [],
                currentSlide : 0
            }
        },
        methods:{
            playAlbum(payload){
                if( payload !== this.$store.getters.getСurrentPlaylist ){
                    const res = this.$store.dispatch('loadLast', payload)

                    this.$store.commit("setIndex", 0)
                    res.then( () => {
                        this.$root.$emit('musicStart')
                    })
                    return
                }
                if ( payload === this.$store.getters.getСurrentPlaylist && this.$store.getters.isPlaying === true){
                    this.$root.$emit('musicPause')
                    return
                }
                if ( payload === this.$store.getters.getСurrentPlaylist && this.$store.getters.isPlaying === false){
                    this.$root.$emit('musicPlay')
                    return
                }
            },
            openAlbum(payload){
                this.$router.push({name: 'user', params: { userId: this.$route.params.userId}, query : {tab: 'albums', playlist : payload}})
                this.$modal.show('showAlbum')
            },
            updateCarousel(payload){
                this.currentSlide = payload.currentSlide
                if( this.currentSlide + 5 > this.allAlbums.length ){
                    setTimeout(() => {   this.slidePrev() }, 200);
                }
            },
            slidePrev() {
                this.$refs.carousel.slidePrev();
            },
            slideNext() {
                this.$refs.carousel.slideNext();
            },
            closeModal(){
                this.$modal.hide('albumUpload')
            },
            async getTracks(){
                try{
                    const res = await axios.get("http://localhost:5000/music/getAlbum", { params: {id: this.$route.params.userId }})
                    this.allAlbums = res.data
                    this.$refs.carousel.restart()
                }catch (e) {
                    this.errorPost = "Ошибка подключения к сети"
                }
            },
            albumImage(logo){
                if(logo === false){
                    return false
                }
                if(logo === ""){
                    return false
                } else{
                    return logo.replace(/\/|\\/g, "/")
                }
            },
        },
        mounted() {
            this.getTracks()
        }
    }
</script>

<style scoped>
    .background{
        background-color: #F9F9F9;
        border-radius: 2px;
        margin: 12px 0px;
        display: flex;
        flex-direction:column;
        height: auto;
        padding: 14px 14px 0px 14px;
    }
    .header{
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 20px;
    }
    .header span{
        font-family: "Open Sans";
        font-size: 16px;
    }
    .header i{
        margin-left: auto;
        color: #848484;
        font-size: 26px;
    }
    .header i:hover{
        cursor: pointer;
        color: #5f5f5f;
    }
    .albums{
        margin-bottom: 20px
    }
    .albumBlock{
        width: 130px;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        text-decoration: none;
    }
    .albumLogo{
        background-image: url("../../../public/img/musicPlaceholder.png");
        background-repeat: no-repeat;
        background-position: center;
        background-size: 60px;
        width: 130px;
        height: 130px;
        background-color: #eeeeee;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-direction: column;
    }
    .albumLogo .controller, .albumLogo .logoInfo{
        display: none;
    }
    .albumLogo .controller i{
        font-size: 36px;
        z-index: 99;
        color: white;
        padding: 5px;
        margin-bottom: 10px;
    }
    .albumLogo:hover .controller{
        display: block;
    }
    .albumLogo .logoInfo{
        align-items: center;
        flex-direction: row;
        color: #f5f5f5;
        font-family: "Open Sans";
        font-size: 13px;
        justify-content: space-around;
        width: 50%;
        margin-bottom: 14px;
    }
    .albumLogo .logoInfo div{
        display: flex;
        align-items: center;
    }
    .albumLogo .logoInfo div i{
        font-size: 15px;
    }
    .albumLogo:hover .logoInfo{
        display: flex;
    }
    .albumLogo:hover{
        cursor: pointer;
        transition: 0.2s;
        box-shadow: inset 0px 0px 0px 250px rgba(50, 50, 50, 0.5);
    }
    .albumBlock .albumInfo{
        display: flex;
        flex-direction: column;
        font-family: "Open Sans";
    }
    .albumBlock .albumInfo span:first-child{
        font-size: 15px;
        color: #2D2D2D;
        word-break: break-word;
    }
    .albumBlock .albumInfo span:last-child{
        font-size: 13px;
        color: #898888;
    }
    .arrow{
        border-radius: 4px;
        border: 1px solid #D8D8D8;
        background-color: #F4F4F4;
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #757575;
        z-index: 99 !important;
        margin-bottom: 50px;
        position: relative;
        user-select: none;
    }
    .arrow i{
        font-size: 24px;
    }
    .arrow:hover{
        color: #585858;
        border: 1px solid #a0a0a0;
        cursor: pointer;
    }
    .userLink:hover{
        cursor: pointer;
        text-decoration: underline;
    }
</style>