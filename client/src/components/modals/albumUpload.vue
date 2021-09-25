<template>
    <div class="modal">
        <div class="heading">
            <span>Создание альбома</span>
            <i @click="closeModal" class="close material-icons">close</i>
        </div>
        <hr>

        <div v-show="windowType" class="secondStage" id="end">
            <form action="" @submit.prevent="submitHandler">
                <div class="preview">
                    <input
                            accept="image/x-png,image/jpeg"
                            type="file" ref="chooseImage"
                            style="display: none"
                            @change="imageSelected"
                    >
                    <div class="audioLogo" v-show="imagePreview" :style="{ backgroundImage: 'url(' + imagePreview + ')' }" ></div>

                    <div v-show="!imagePreview" @click="$refs.chooseImage.click()" class="cover">
                        <i class="material-icons">upload_file</i>
                        <span>обложка</span>
                    </div>

                    <div class="info">
                        <input style="font-size: 13px; color: #9D9D9D" type="text" readonly :value="albumInfo.author" />
                        <input style="font-size: 15px; color: #3E3E3E" type="text" placeholder="Название плейлиста"
                               v-model="albumInfo.name"
                               v-bind:class="{invalidInput: !$v.albumInfo.name.required && $v.albumInfo.$dirty }"
                        />
                    </div>
                </div>

                <div class="shortInfo">
                    <span>{{"tracks :  " + albumTracks.length}}</span>
                    <span style="margin:0px 8px; user-select: none">·</span>
                    <span>{{"duration :  " + this.$moment("2015-01-01").startOf('day').seconds(albumInfo.time).format('m:ss')}}</span>
                    <label for="readonly">
                        <input type="checkbox" id="readonly">
                        <span>Убрать из общего поиска</span>
                    </label>
                </div>

                <hr class="toTracks">

                <div class="newTracks" @click="windowType = !windowType">
                    <div>
                        <i class="material-icons">add</i>
                        <span style="margin-left: 4px;">Добавить аудиозаписи</span>
                        <i style="margin-left: auto;" class="material-icons">keyboard_arrow_right</i>
                    </div>
                </div>

                <div class="attachTracks" style="padding: 0px 20px; overflow-x: auto; height: 410px">
                    <postTrack
                            v-for="track in albumTracks"
                            :key="track.id"
                            :id="track._id"
                            :listen=track.listen
                            :logo=track.logo
                            :title=track.title
                            :url=track.url
                            :user=track.user
                            :attachable="true"
                            @remove="removeTrack(track._id)"
                            @duration="addDur"
                    />
                </div>

                <button type="submit" style="float: right">Создать</button>

            </form>
        </div>

        <div  style="overflow-x: auto; height: 560px">
        <tracks
                :getTrackId=$store.getters.getUser.id
                :attached="this.albumTracks.map(t => t._id)"
                @attach="getAttach"
                v-show="!windowType"
                style="margin-top: -20px"
        />
        </div>
        <button v-show="!windowType" @click="windowType = !windowType" type="submit" style="float: right">Добавить</button>

    </div>
</template>

<script>

    import {required} from 'vuelidate/lib/validators'
    import axios from "axios";
    import tracks from "../User/tracks"
    import postTrack from "./postTrack";

    export default {
        name: "albumUpload",
        components:{tracks, postTrack},
        validations: {
            albumInfo:{
                name: {required}
            }
        },
        data(){
            return{
                windowType:true,
                albumInfo:{
                    author:this.$store.getters.getUser.username,
                    name:"",
                    time:0,
                },
                imagePreview:"",
                imgFile:"",
                albumTracks: []
            }
        },
        methods:{
            addDur(event){
               this.albumInfo.time = this.albumInfo.time + event
            },
            removeTrack(id){
                const removeId = this.albumTracks.map(t => t._id).indexOf(id)
                this.albumTracks.splice(removeId, 1)
            },
            async getAttach(event){
                if( this.albumTracks.map(t => t._id).includes(event) ){
                    this.removeTrack(event)
                    return
                }
                try{
                    const res = await axios.get("http://musicamp.std-263.ist.mospolytech.ru/music/getOneTrack", { params: {id: event }})
                    this.albumTracks.push(res.data[0])
                }catch (e) {
                    this.errorPost = "Ошибка подключения к сети"
                }
            },
            closeModal(){
                this.$emit('close')
            },
            imageSelected(event){
                this.file = event.target.files[0];
                this.imgFile = event.target.files[0];
                let reader  = new FileReader();
                reader.addEventListener("load", function () {
                    this.imagePreview = reader.result;
                }.bind(this), false)
                if( this.file ){
                    if ( /\.(jpe?g|png)$/i.test( this.file.name ) ) {
                        reader.readAsDataURL( this.file );
                    }
                }
            },
            submitHandler(){
                if (this.$v.$invalid){
                    this.$v.$touch()
                    return
                }

                this.$v.$touch()

                const fd = new FormData()

                fd.append('title', this.albumInfo.name)
                fd.append('duration', this.albumInfo.time)

                const musicArr = this.albumTracks.map(t => t._id)
                for (let i = 0; i < musicArr.length; i++) {
                    fd.append('tracks[]', musicArr[i]);
                }

                if(this.imgFile){
                    fd.append('logo', this.imgFile)
                }
                this.createTrack(fd)
            },
            async createTrack(trackData){
                try {
                    await axios.post("http://musicamp.std-263.ist.mospolytech.ru/music/albumUpload", trackData, {headers:
                            { authorization : 'Bearer ' + localStorage.getItem('token')}
                    })
                    this.$router.go()
                } catch (e) {
                    this.$v.$reset()
                    this.error = e.response.data.message
                }
            }
        }
    }
</script>

<style scoped>
    .modal{
        display: flex;
        flex-direction: column;
    }
    .heading{
        font-family: "Open Sans";
        font-size: 16px;
        font-weight: 600;
        padding: 20px 20px 10px 20px;
        display: flex;
        flex-direction: row;
    }
    .heading i{
        margin-left: auto;
        user-select: none;
    }
    hr{
        border: none;
        border-top: 2px solid #12ADDE;
        width: 100%;
        margin-bottom: 20px;
    }
    .toTracks{
        border: none;
        border-top: 1px solid #c4c4c4;
        width: 100%;
        margin-bottom: 0px;
    }
    button{
        background-color: #12ADDE;
        border: 0px;
        font-family: "Open Sans";
        font-size: 14px;
        color: #F3F3F3;
        border-radius: 5px;
        padding: 8px 30px;
        transition: 0.5s;
        margin: 0px 20px;
    }
    button:hover:enabled{
        background: #35cbf6;
        transition: 0.5s;
        cursor: pointer;
    }
    .close:hover{
        cursor: pointer;
    }
    .preview{
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0px 20px;
    }
    .preview .cover{
        display: flex;
        flex-direction: column;
        text-align: center;
        justify-content: center;
        border: 1px solid #9c9c9c;
        font-family: "Open Sans";
        font-size: 12px;
        color: #9c9c9c;
        height: 74px;
        width: 74px;
    }
    .cover i{
        font-size: 34px;
        color: #9c9c9c;
    }
    .preview .cover:hover{
        cursor: pointer;
    }
    .preview .info{
        display: flex;
        flex-direction: column;
        margin-left: 12px;
        flex-grow: 1;
    }
    .preview .info input{
        border:none;
        background: none;
        border-bottom: 1px solid #e7e7e7;
        font-family: "Open Sans";
        margin: 4px 0px;
        width: 100%;
    }
    .invalidInput{
        border-bottom: 1px solid #e20505 !important;
    }
    .audioLogo{
        width: 76px;
        height: 76px;
        background-position: center;
        background-size: cover;
    }
    p{
        font-size: 10px;
        font-family: "Open Sans";
        color: #6c6c6c;
        text-align: justify;
    }
    .error{
        font-family: "Open Sans";
        font-size: 14px;
        color: #ea0505;
    }
    .shortInfo{
        margin: 10px 0px;
        font-family: "Open Sans";
        font-size: 13px;
        color: #4b4b4b;
        padding: 0px 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    label{
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-left: auto;
    }
    .newTracks{
        padding: 6px 0px;
        border-bottom: 1px solid #c4c4c4;
    }
    .newTracks div{
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0px 20px;
        font-family: "Open Sans";
        font-size: 13px;
    }
    .newTracks div i{
        color: #797979;
    }
    .newTracks:hover{
        background-color: #eaeaea;
        cursor: pointer;
    }
</style>
