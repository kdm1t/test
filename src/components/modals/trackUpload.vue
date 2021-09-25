<template>
    <div class="modal">
        <div class="heading">
            <span>Загрузка аудиозаписи</span>
            <i @click="closeModal" class="close material-icons">close</i>
        </div>
        <hr>

        <div style="text-align: center" class="firstStage" id="start" v-show="!windowType">
        <div class="validate">
            <div><i class="material-icons">fitness_center</i><span>Аудиофайл не должен превышать 20 МБ</span></div>
            <div style=" margin: 0px 20px;"><i class="material-icons">headphones</i><span>Аудиофайл должен быть в формате MP3</span></div>
            <div><i class="material-icons">description</i><span>Аудиофайл не должен нарушать авторские и смежные права.</span></div>
        </div>
            <div style="display: flex;flex-direction: row;align-items: center;">
                <span class="error">{{sizeError}}</span>
                <button style="margin-left: auto" @click="$refs.chooseTrack.click()">Выбрать файл</button>
            </div>
        <input
                accept="audio/mp3"
                type="file" ref="chooseTrack"
                style="display: none"
                @change="trackFile"
        >
        </div>

        <div class="secondStage" id="end" v-show="windowType">
            <form action="" @submit.prevent="submitHandler">
            <div class="preview">

                <input
                        accept="image/x-png, image/jpeg"
                        type="file" ref="chooseImage"
                        style="display: none"
                        @change="imageSelected"
                >
                <div class="audioLogo" v-show="imagePreview" :style="{ backgroundImage: 'url(' + imagePreview + ')' }" ></div>
                <i v-show="!imagePreview" class="material-icons" @click="$refs.chooseImage.click()">upload_file</i>
                <div class="info">
                    <audio ref="audio" preload="metadata" :src=trackInfo.url />
                    <input style="font-size: 13px; color: #9D9D9D" type="text" readonly :value="trackInfo.author" />
                    <input style="font-size: 15px; color: #3E3E3E" type="text"
                           v-model="trackInfo.name"
                           v-bind:class="{invalidInput: !$v.trackInfo.name.required }"
                    />
                </div>

                <span class="time">
                    {{ this.$moment("2015-01-01").startOf('day').seconds(trackInfo.time).format('mm:ss') }}
                </span>
            </div>
            <p>Внимание! Настоящим вы подтверждаете, что несёте полную ответственность за размещаемый контент, который должен соответствовать международному законодательству по защите авторских и смежных прав. Предупреждаем, что аккаунт будет заблокирован без возможности восстановления за любое нарушение авторских или смежных прав. Мы имеем полное право передать обладателю авторских или смежных прав имеющиеся в нашем распоряжении ваши личные данные с целью урегулирования всех юридических вопросов между ним и вами.</p>
            <button type="submit" style="float: right">Загрузить</button>

            </form>
        </div>


    </div>
</template>

<script>

    import {required} from 'vuelidate/lib/validators'
    import axios from "axios";

    export default {
        name: "trackUpload",
        validations: {
            trackInfo:{
                name: {required}
            }
        },
        data(){
            return{
                windowType:false,
                trackInfo:{
                    author:this.$store.getters.getUser.username,
                    name:"",
                    time:0,
                    url:""
                },
                imagePreview:"",
                sizeError:"",
                track:"",
                imgFile:""
            }
        },
        methods:{
            closeModal(){
                this.$emit('close')
            },
            trackFile(event){
                if(event.target.files[0].size > (1024 * 1024 * 20)){
                    this.sizeError = "Размер файла слишком большой"
                    return false
                }
                this.track = event.target.files[0]
                this.trackInfo.name = event.target.files[0].name.substr(0, event.target.files[0].name.length - 4)
                this.trackInfo.url = URL.createObjectURL(event.target.files[0])
                this.$refs.audio.onloadedmetadata = () => {
                    this.trackInfo.time = this.$refs.audio.duration
                }
                this.windowType = true
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
                    return
                }

                this.$v.$touch()

                const fd = new FormData()

                fd.append('title', this.trackInfo.name)
                fd.append('url', this.track)
                if(this.imgFile){
                    fd.append('logo', this.imgFile)
                }
                this.createTrack(fd)
            },
            async createTrack(trackData){
                try {
                    await axios.post("http://musicamp.std-263.ist.mospolytech.ru/music/trackUpload", trackData, {headers:
                            { authorization : 'Bearer ' + localStorage.getItem('token')}
                    })
                    this.$emit('reload')
                    const res = this.$store.dispatch('loadLast', this.$store.getters.getUser._id)
                    res.then( () => {
                        this.closeModal()
                    })

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
    .validate{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        margin-bottom: 30px;
    }
    .validate div{
        text-align: center;
        padding: 15px;
        border-radius: 8px;
        width: 25%;
        height: 130px;
        display: flex;
        flex-direction: column;
        font-family: "Open Sans";
        font-size: 13px;
        color: #1c1c1c;
        box-shadow:         0px 5px 12px 0px rgba(50, 50, 50, 0.15);
    }
    .validate div i{
        font-size: 30px;
        margin-bottom: 10px;
        color: #282828;
        user-select: none;
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
    }
    .preview i{
        border: 1px solid #9c9c9c;
        padding: 20px;
        font-size: 34px;
        color: #9c9c9c;
    }
    .preview i:hover{
        cursor: pointer;
    }
    .preview .info{
        display: flex;
        flex-direction: column;
        margin-left: 12px;
    }
    .preview .info input{
        border:none;
        background: none;
        border-bottom: 1px solid #e7e7e7;
        font-family: "Open Sans";
        margin: 4px 0px;
        width: 300px;
    }
    .invalidInput{
        border-bottom: 1px solid #e20505 !important;
    }
    .preview .time{
        margin-left: auto;
        color: #A4A4A4;
        font-family: "Open Sans";
        font-size: 14px;
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
    .secondStage, .firstStage{
        padding: 0px 20px;
    }
    .error{
        font-family: "Open Sans";
        font-size: 14px;
        color: #ea0505;
    }
</style>
