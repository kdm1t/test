<template>
    <div class="background">
        <div v-show="!getTrackId" class="header">
            <span>Upload tracks</span>
            <i v-show="this.$route.params.userId === $store.getters.getUser.id" @click="$modal.show('trackUpload')" class="material-icons">file_upload</i>
        </div>
        <modal name="trackUpload"  :width="480" :height="340" :styles="'background-color: #F9F9F9;'">
            <trackUpload @close="closeModal" @reload="reloadAll" />
        </modal>
        <div v-if="allTracks.length > 0">
            <singleTrack
                    v-for="(track, id) in allTracks"
                    :key="track.id"

                    :id="track._id"
                    :listen=track.listen
                    :logo=track.logo
                    :title=track.title
                    :url=track.url
                    :user=track.user
                    @active="chooseManual(id)"
                    @attach="getAttach"
                    :attach="!!getTrackId"
                    :attached="attached"
                    @reload="reloadAll"

                    :isActive="track._id === $store.getters.getCurrentTrack._id ? $store.getters.isPlaying : false"
                    :hover="track._id === $store.getters.getCurrentTrack._id ? $store.getters.isPlaying : true"
            />
        </div>

        <span v-show="!getTrackId" class="footer">@musicamp</span>
    </div>
</template>

<script>
    import trackUpload from "../modals/trackUpload";
    import singleTrack from "../modals/singleTrack";
    import axios from "axios";

    export default {
        name: "tracks",
        data(){
            return{
                allTracks: []
            }
        },
        components:{trackUpload, singleTrack},
        computed:{
            index(){
                if(this.allTracks.length > 0){
                    if( this.allTracks[0].user._id === this.$store.getters.getСurrentPlaylist ){
                        return this.$store.getters.index
                    }
                }
                return -1
            }
        },
        props:{
            getTrackId: String,
            attached : Array
        },
        methods:{
            reloadAll(){
                Object.assign(this.$data, this.$options.data.call(this))
                this.getTracks()
            },
            getAttach(event){
                this.$emit('attach', event)
            },
            closeModal(){
                this.$modal.hide('trackUpload')
            },
            async getTracks(){
                try{
                    let newId = this.$route.params.userId
                    if(this.getTrackId){
                        newId = this.getTrackId
                    }
                    const res = await axios.get("http://localhost:5000/music/getUserTracks", { params: {id: newId, type: "userPage" }})
                    this.allTracks = res.data
                }catch (e) {
                    this.errorPost = "Ошибка подключения к сети"
                }
            },
            chooseManual(id){
                if( this.allTracks[0].user._id !== this.$store.getters.getСurrentPlaylist ){
                    const res = this.$store.dispatch('loadLast', this.allTracks[0].user._id)
                    this.$store.commit("setIndex", id)
                    res.then( () => {
                        this.$root.$emit('musicStart')
                    })
                    return
                }
                if ( this.index === id && this.$store.getters.isPlaying === true){
                    this.$root.$emit('musicPause')
                    return
                }
                if ( this.index === id && this.$store.getters.isPlaying === false){
                    this.$root.$emit('musicPlay')
                    return
                }
                this.$store.commit("setIndex", id)
                this.$root.$emit('musicStart')
            }
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
    .footer{
        font-family: "Open Sans";
        color: #adadad;
        font-size: 12px;
        margin: 30px 0px;
    }
</style>