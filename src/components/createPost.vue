<template>
    <div v-show="auth" v-click-outside="formClose" class="form" :class="{openForm:isOpen}">


        <form @submit.prevent="submitHandler">
<!--LAYER 1-->
        <div class="firstLayer">
            <img style="border-radius: 50%; object-fit: cover; " v-if="$store.getters.getUser.avatar" :src=$store.getters.getUser.avatar alt="">
            <img v-else src="../../public/img/userLogo.png" alt="">
            <input
                    type="text"
                    :placeholder="[!isOpen ? 'Create Post...' : 'Heading...']"
                    @click="formOpen"
                    v-model="heading"
            >

            <input
                    accept="image/x-png,image/jpeg"
                    type="file" ref="chooseImage"
                    style="display: none"
                    @change="imageSelected"
            >
            <i @click="$modal.show('library')" class="musicIcon Large material-icons">library_music</i>

            <modal name="library" :width="550" :height="700" :styles="'background-color: #F9F9F9;'">
                <attachTrack @attach="addAttach" @close="closeModal" />
            </modal>
        </div>
<!--LAYER 2-->
        <div class="secondLayer" v-show="isOpen" >
            <contenteditable
                    tag="div"
                    class="descForm"
                    :noNL="false"
                    :noHTML="true"
                    placeholder="Description..."
                    v-model="desc"
            ></contenteditable>
            <div>

                <div class="showEmoji">
                <i class="musicIcon Large material-icons">sentiment_satisfied_alt</i>
                <div><smiles @sendSmile="addSmile" /></div>
                </div>

                <input
                        accept="image/x-png,image/jpeg"
                        type="file" ref="chooseImage"
                        style="display: none"
                        @change="imageSelected"
                >
                <i @click="$refs.chooseImage.click()" class="musicIcon Large material-icons">photo_library</i>

            </div>
        </div>
<!--LAYER 3-->
            <div v-show="isOpen && imagePreview" class="imageLayer">
                <img v-bind:src="imagePreview">
                <i @click="clearImage" class="deleteImage Large material-icons">clear</i>
            </div>
<!--LAYER 4-->
            <div v-show="isOpen && attachTracks.length > 0" class="trackLayer">
                <postTrack
                        v-for="(track, index) in attachTracks"
                        :key="track.id"
                        :id="track._id"
                        :listen=track.listen
                        :logo=track.logo
                        :title=track.title
                        :url=track.url
                        :user=track.user
                        :attachable="true"
                        @remove="removeTrack(index)"
                />
            </div>
<!--LAYER 5-->
        <div class="thirdLayer" v-show="isOpen">
            <div style="display: flex; flex-direction: column" v-show="!type">
                <i @click="$refs.openTags.click()" class="musicIcon Large material-icons">local_offer</i>
                <i
                        @click="showTags = !showTags"
                        class="tagsButton musicIcon Large material-icons"
                        :class="{tagsOpen:showTags}"
                        ref="openTags"
                >add_circle_outline</i>

                <div v-show="showTags" class="tagList tagPopup">
                    <button
                            type="button"
                            v-for="tag in tagArr"
                            v-bind:key="tag.id"
                            @click="tag.state = !tag.state"
                            :class="{activeTag : tag.state}"
                    >{{tagNames[tag.id]}}</button>
                </div>

            </div>
            <div class="tagsForm" v-show="!type">
                <span
                        class="inputTags"
                        v-for="tag in activeTags"
                        v-bind:key="tag.id"
                >{{ tagNames[tag.id] }}</span>
            </div>

            <div class="privacy" v-show="type">
                <button type="button" :class="{privacyDis : postType === 0}" @click="postType === 0 ? postType = 1 : postType = 0">For All</button>
                <button type="button" :class="{privacyDis : postType <= 1}" @click="postType === 1 ? postType = 2 : postType = 1">For Followers</button>
                <button type="button" :class="{privacyDis : postType <= 2}" @click="postType = 2">For Subscribers</button>
            </div>

            <button class="submit"
                    type="submit"
                    :class="{disableButton: !$v.heading.required || $v.heading.$dirty}"
                    :disabled="!$v.heading.required || $v.heading.$dirty"
            >Create Post</button>
        </div>

        </form>

    </div>

</template>

<script>
    import ClickOutside from 'vue-click-outside'
    import {required} from 'vuelidate/lib/validators'
    import smiles from "./modals/smiles";
    import axios from "axios";
    import attachTrack from "./modals/attachTrack";
    import postTrack from "./modals/postTrack";

    export default {
        components:{
            smiles, attachTrack, postTrack
        },
        validations: {
            heading: {required}
        },

        props:{
          type:{
              type:Number,
              default: 0
          }
        },

        name: "createPost",
        data(){
            return{
                error:"s",
                heading: "",
                desc: "",
                isOpen:false,
                auth: localStorage.getItem('token'),
                showTags:false,
                tagNames:["новинки","битмейкинг","оригинальное","релиз"],
                tagArr:[
                    { id:0, state:false },
                    { id:1, state:false },
                    { id:2, state:false },
                    { id:3, state:false }
                ],
                imgFile:"",
                imagePreview:"",
                postType:0,
                attachTracks : []
            }
        },
        methods: {
            removeTrack(event){
                this.attachTracks.splice(event, 1);
            },
            async addAttach(event){
                try{
                    const res = await axios.get("http://localhost:5000/music/getOneTrack", { params: {id: event }})
                    this.attachTracks.push(res.data[0])
                    this.isOpen = true
                }catch (e) {
                    this.errorPost = "Ошибка подключения к сети"
                }
            },
            closeModal(){
                this.$modal.hide('library')
            },
            formOpen() {
                this.isOpen = true
            },
            formClose() {
                this.isOpen = false
            },
            addSmile(x){
                this.desc = this.desc + x
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
            clearImage(){
                this.imgFile = ""
                this.imagePreview = ""
            },
            submitHandler(){
                if (this.$v.$invalid){
                    return
                }

                this.$v.$touch()

                const tags = this.tagArr.filter(t => t.state)

                const new_tags = tags.map(t => t.id)

                const musicArr = this.attachTracks.map(t => t._id)

                const fd = new FormData()

                if(musicArr.length > 0){
                    for (let i = 0; i < musicArr.length; i++) {
                        fd.append('tracks[]', musicArr[i]);
                    }
                }

                if(this.type > 0){
                    fd.append('title', this.heading)
                    fd.append('description', this.desc)
                    fd.append('privacy', this.postType)

                    if(this.imgFile) {
                        fd.append('image', this.imgFile)
                    }

                    this.createUserPost(fd)
                    this.error = "Подождите, загрузка"
                    return
                }

                for (let i = 0; i < new_tags.length; i++) {
                    fd.append('tags[]', new_tags[i]);
                }

                fd.append('title', this.heading)
                fd.append('description', this.desc)

                if(this.imgFile) {
                    fd.append('image', this.imgFile)
                }

                this.error = "Подождите, загрузка"
                this.createPost(fd)
            },
            async createPost(postData) {
                try {
                    await axios.post("http://musicamp.std-263.ist.mospolytech.ru/upload/postUpload", postData, {headers:
                            { authorization : 'Bearer ' + localStorage.getItem('token')}
                    })
                    Object.assign(this.$data, this.$options.data.apply(this))
                    this.$emit("reload")
                    this.$v.$reset()
                } catch (e) {
                    this.$v.$reset()
                    this.error = e.response.data.message
                }
            },
            async createUserPost(postData) {
                try {
                    await axios.post("http://musicamp.std-263.ist.mospolytech.ru/upload/userPostUpload", postData, {headers:
                            { authorization : 'Bearer ' + localStorage.getItem('token')}
                    })
                    Object.assign(this.$data, this.$options.data.apply(this))
                    this.$emit("reload")
                    this.$v.$reset()
                } catch (e) {
                    this.$v.$reset()
                    this.error = e.response.data.message
                }
            }
        },
        directives: {
            ClickOutside
        },
        computed:{
            activeTags(){
                return this.tagArr.filter(tag => tag.state)
            }
        }
    }
</script>

<style scoped>
    .form{
        user-select: none;
        width: 748px;
        height: 58px;
        background-color: #F9F9F9;
        border-radius: 2px;
        display: flex;
        flex-direction:column;
        justify-content: center;
        margin-bottom: 20px;
    }
    .firstLayer, .secondLayer, .thirdLayer{
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .firstLayer img{
        width: 30px;
        height: 30px;
        margin: 0px 16px;
    }
    .firstLayer input{
        background-color: #E9E9E9;
        border: 1px solid #D2D2D2;
        height: 36px;
        width: 606px;
        border-radius: 4px;
        font-size: 14px;
        font-family: "Open Sans";
        padding-left: 16px;
    }
    .thirdLayer{
        margin-top: 8px;
    }
    .musicIcon{
        opacity: 0.6;
        margin-left: 17px;
        font-size: 24px;
    }
    .openForm{
        height: auto;
        padding: 9px 0px;
    }
    .descForm{
        background-color: #E9E9E9;
        border: 1px solid #D2D2D2;
        width: 592px;
        min-height: 58px;
        border-radius: 4px;
        font-size: 14px;
        font-family: "Open Sans";
        margin-left: 62px;
        margin-top: 4px;
        padding: 8px 16px;
    }
    [contenteditable]:empty:before {
        display: block;
        color: #6c6c6c;
        content: attr(placeholder);
    }
    .tagsForm{
        background-color: #f1f1f1;
        width: 498px;
        height: 28px;
        border-radius: 40px;
        font-size: 14px;
        font-family: "Open Sans";
        margin-left:20px ;
        display: flex;
        align-items: center;
        align-self: flex-end;
    }
    .inputTags{
        display: block;
        padding: 0px 10px 3px 10px;
        margin: 2px;
        background-color: #6c6c6c;
        border-radius: 40px;
        font-size: 13px;
        font-family: PT sans;
        color: white;
        font-weight: 400;
        opacity: 0.4;
        border: none;
    }
    .submit{
        background-color: #12ADDE;
        border: 0px;
        font-family: "Open Sans";
        font-size: 16px;
        color: #F3F3F3;
        border-radius: 5px;
        padding: 8px 12px;
        margin-left: auto;
        margin-right: 60px;
        transition: 0.5s;
        align-self: flex-end;
    }
    .submit:hover:enabled{
        background: #35cbf6;
        transition: 0.5s;
        cursor: pointer;
    }
    .submit:active:enabled{
        background: #007293;
    }
    .disableButton{
        background: #94b3c1;
    }
    .tagPopup{
        position: absolute;
        z-index: 10;
        margin-top: 68px;
        margin-left: -1px;
        box-shadow:0px 0px 10px 0px rgba(50, 50, 50, 0.25);
    }
    .tagsButton{
        opacity: 0.2;
    }
    .tagsOpen{
        opacity: 0.6;
    }
    .tagList{
        width: 250px;
        background-color: #F9F9F9;
        border-radius: 4px;
        display: flex;
        flex-direction: row;
        flex-flow: row wrap;
        padding: 10px;
    }
    .tagList button{
        display: block;
        padding: 0px 10px 3px 10px;
        margin: 2px;
        background-color: #6c6c6c;
        border-radius: 40px;
        font-size: 13px;
        font-family: PT sans;
        color: #ffffff;
        font-weight: 400;
        opacity: 0.4;
        border: none;
    }
    .tagList button:hover, .deleteImage:hover, .musicIcon:hover{
        cursor: pointer;
    }
    .activeTag{
        opacity: 1 !important;
    }
    .imageLayer{
        display: flex;
        flex-direction: row;
        margin: 10px 60px 10px 62px;
    }
    .imageLayer img{
        border-radius: 2px;
        background-position: center;
        background-size: cover;
        max-height: 300px;
        max-width: 400px;
        transition: 0.4s;
    }
    .imageLayer img:hover{
        opacity: 0.6;
        transition: 0.4s;
    }
    .trackLayer{
        display: flex;
        flex-direction: column;
        margin: 6px 60px 10px 62px;
    }
    .deleteImage{
        color: #eaeaea;
        margin-left: -20px;
        z-index: 10;
        height: 15px;
        background-color: rgba(0, 0, 0, 0.2);
        font-size: 16px;
        padding: 2px;
    }
    .showEmoji:hover div{
        display: flex;
    }
    .showEmoji{
        margin-left: 18px;
        display: block;
        width: 24px;
    }
    .showEmoji i{
        margin: 0px;
        padding: 0px;
    }
    .privacy button{
        font-family: "Open Sans";
        font-size: 15px;
        border-radius: 3px;
        background: #94b3c1;
        padding: 4px 6px;
        margin: 0px 6px;
        border: 0px;
        color: white;
        background: #94b3c1;
    }
    .privacy{
        margin-left: 56px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .privacy button:hover{
        cursor: pointer;
    }
    .privacyDis{
        background: #007293 !important;
    }
</style>