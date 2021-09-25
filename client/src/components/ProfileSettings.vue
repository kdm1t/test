<template>
    <div class="modal">
        <form @submit.prevent="save">
        <h1>Edit your Profile</h1>
        <hr>
        <div class="mainInfo">
            <div :style="{'background-image' : 'url(' + avatarImage + ')'}" class="avatar">
                <div @click="$refs.chooseImage.click()">
                    <i class="material-icons">photo_camera</i>
                    <span>Update image</span>
                </div>
            </div>
            <input
                    accept="image/x-png,image/jpeg"
                    type="file" ref="chooseImage"
                    style="display: none"
                    @change="imageSelected"
            >

            <div class="inputs">

                <label>Background</label>
                <div class="background" :style="{'background': backgrounds[currentBG]}">
                    <span @click="openBg = !openBg">change</span>
                </div>
                <div class="backgroundDrop">
                    <div @click="currentBG = index, openBg = !openBg" v-show="openBg" v-for="(bg, index) in backgrounds" :key="bg.id" :style="{'background': bg}"></div>
                </div>

                <label for="username">Username <span style="color: red">*</span></label>
                <input
                        style="margin-bottom: 20px"
                        id="username"
                        type="text"
                        v-model="username"
                        :class="{inputError: !$v.username.required || $v.username.$dirty}"
                        maxlength="30"
                >

                <label for="link">Profile URL</label>
                <div class="url"><span>musicamp.com/user/</span><input id="link" type="text" v-model="id"></div>
            </div>

        </div>

        <div class="secondInfo">
            <div class="row" style="margin-bottom: 15px">
                <div style="margin-right: 20px">
                    <label for="firstName">First Name</label>
                    <input id="firstName" type="text" maxlength="30" v-model="firstName">
                </div>
                <div style="margin-left: 20px">
                    <label for="lastName">Last Name</label>
                    <input id="lastName" type="text" maxlength="30" v-model="lastName">
                </div>
            </div>

            <div class="row" style="margin-bottom: 15px">
                <div style="margin-right: 20px">
                    <label for="city">City</label>
                    <input id="city" type="text" maxlength="30" v-model="city">
                </div>
                <div style="margin-left: 20px">
                    <label for="country">Country</label>
                    <input id="country" type="text" maxlength="30" v-model="country">
                </div>
            </div>

            <div class="row">
                <div>
                    <label for="bio">Bio</label>
                    <textarea
                            class="bioForm"
                            id="bio"
                            cols="30"
                            rows="4"
                            v-model="bio"
                            :maxlength="300"
                            ref="bio"
                    >
                    </textarea>
                    <label style="margin-bottom: 15px">{{ 300 - bio.length}} characters left </label>
                </div>
            </div>

        </div>

<!--LINKS-->
        <div class="links">
            <label>Your links</label>
            <hr>
            <div v-for="(link, index) in $v.links.$each.$iter" :key="link.id" class="Onelink">
                <input
                        style="flex-grow: 1"
                        type="text"
                        placeholder="http://"
                        v-model.trim="link.url.$model"
                        :class="{inputError: !link.url.required || !link.url.url}"
                >
                <input style="margin-left: 10px" type="text" placeholder="short title" maxlength="26" v-model.trim="link.title.$model">
                <i @click="deleteLink(index)" class="material-icons">delete</i>
            </div>
            <button type="button" @click="addLink" class="addlink">Add link</button>
        </div>

        <hr>
        <div class="endButtons">
            <b class="error">{{error}}</b>
            <span @click="$emit('close')">Cancel</span>
            <button
                    type="submit"
                    class="save"
                    :class="{disableButton: $v.$invalid}"
                    :disabled="$v.$invalid"
            >Save changes</button>
        </div>
        </form>
    </div>
</template>

<script>

    import {required, url} from 'vuelidate/lib/validators'
    import axios from "axios";

    export default {
        validations: {
            username: {required},
            links: {
                $each: {
                    url: {
                        required,
                        url
                    },
                    title:{
                    }
                }
            }
        },
        name: "ProfileSettings",
        data(){
            return{
                username: this.$store.getters.getUser.username,
                id: this.$store.getters.getUser.id,
                bio: this.prop_bio,
                currentBG: this.prop_currentBG,
                openBg: false,
                links: this.prop_links,
                imgFile:"",
                imagePreview:"",
                error: "",
                firstName: this.prop_firstName,
                lastName: this.prop_lastName,
                city: this.prop_city,
                country: this.prop_country
            }
        },
        methods:{
            imageSelected(event){
                if(event.target.files[0].size > (1024 * 1024 * 3)){
                    this.error = "Размер файла слишком большой"
                    return false
                }
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
            deleteLink(index){
                this.links.splice(index, 1);
            },
            addLink(){
                if(this.links.length > 4){
                    return
                }
                const data = {
                    url:"",
                    title:""
                }
                this.links.push(data)
            },
            save(){
                if (this.$v.$invalid){
                    return
                }

                const fd = new FormData()

                fd.append('username', this.username)

                fd.append('firstName', this.firstName)
                fd.append('lastName', this.lastName)
                fd.append('city', this.city)
                fd.append('country', this.country)
                fd.append('bio', this.bio)
                fd.append('background', this.currentBG)

                const linkArr = JSON.stringify(this.links);
                fd.append('links', linkArr)

                if(this.imgFile) {
                    fd.append('image', this.imgFile)
                }

                this.updateSettings(fd)
            },
            async updateSettings(postData) {
                try {
                    await axios.post("http://musicamp.std-263.ist.mospolytech.ru/auth/updateSettings", postData, {headers:
                            { authorization : 'Bearer ' + localStorage.getItem('token')}
                    })
                    this.$emit("reset")
                } catch (e) {
                    this.error = e.response.data.message
                }
            },
        },
        props:{
            backgrounds: {type:Array, default: () => ['linear-gradient(135deg, rgba(175,193,194,1) 0%, rgba(50,146,158,1) 100%)"']},
            prop_bio: {type:String, default:''},
            prop_currentBG: {type:Number, default:0},
            prop_links: {type:Array, default: () => []},
            prop_firstName: {type:String, default:''},
            prop_lastName: {type:String, default:''},
            prop_city: {type:String, default:''},
            prop_country: {type:String, default:''},
            prop_avatar: {type:String, default:''}
        },
        computed:{
            avatarImage(){
                if(this.imgFile){
                    return this.imagePreview
                }
                if(this.prop_avatar === ""){
                    return '../../img/userLogo.png'
                }
                return this.prop_avatar.replace(/\/|\\/g, "/")
            },
        }
    }
</script>

<style scoped>
    .modal{
        display: flex;
        flex-direction: column;
    }
    h1{
        padding: 10px 30px 0px 30px;
        font-family: "Open Sans";
        font-size: 20px;
        font-weight: 600;
        color: black;
    }
    hr{
        border: none;
        border-top: 2px solid #12ADDE;
        width: 100%;
    }
    .mainInfo{
        padding: 10px 30px 0px 30px;
        display: flex;
        flex-direction: row;
        align-items: center;

    }
    .avatar{
        background-image: url("../../public/img/userLogo.png");
        background-size: cover;
        background-position: center;
        width: 220px;
        height: 220px;
        background-color: #DEDEDE;
        border-radius: 999px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    .avatar div{
        display: flex;
        flex-direction: row;
        align-items: center;
        background-color: rgba(255, 255, 255, 0.7);
        font-size: 13px;
        padding: 2px 6px;
        color: black;
        font-family: "Source Sans Pro";
        border-radius: 3px;
        border: 1px solid #909090;
        margin-right: 10px;
        user-select: none;
        margin-top: 50%;
    }
    .avatar div i{
        font-size: 20px;
        margin-right: 6px;
    }
    .inputs{
        margin-left: 20px;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }
    .backgroundDrop{
        position: absolute;
        width: 480px;
        display: flex;
        flex-direction: column;
        margin-top: 61px;
    }
    .backgroundDrop div{
        background: linear-gradient(135deg, rgba(175,193,194,1) 0%, rgba(50,146,158,1) 100%);
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    .backgroundDrop div:hover{
        cursor: pointer;
        box-shadow: 0px 0px 0px 2px rgba(71, 67, 67, 0.75) inset;
    }
    .background{
        background: linear-gradient(135deg, rgba(175,193,194,1) 0%, rgba(50,146,158,1) 100%);
        width: 100%;
        height: 40px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    .background span{
        background-color: rgba(255, 255, 255, 0.8);
        font-size: 13px;
        padding: 2px 10px;
        color: black;
        font-family: "Source Sans Pro";
        border-radius: 3px;
        border: 1px solid #909090;
        margin-right: 10px;
        user-select: none;
    }
    .addlink:hover, .background span:hover, .Onelink i:hover, .avatar div:hover{
        cursor: pointer;
        border: 1px solid #5c5c5c;
    }
    .inputError{
        border: 1px solid red !important;
    }
    .inputs input{
        border-radius: 4px;
        border: 1px solid #bdbdbd;
        height: 30px;
        padding-left: 10px;
        font-family: "Source Sans Pro";
        font-size: 18px;
    }
    .secondInfo input:focus, .mainInfo input:focus, .bioForm:focus{
        border: 1px solid #494949;
    }
    label{
        font-family: "Source Sans Pro";
        font-size: 13px;
        color: black;
        margin-bottom: 4px;
        user-select: none;
        align-self: flex-start;
    }
    .url{
        font-family: "Source Sans Pro";
        color: #8e8e8e;
        font-size: 15px;
        display: flex;
        align-items: center;
        flex-direction: row;
    }
    .url input{
        height: 20px;
        padding-left: 2px;
        border: 1px solid rgba(189,189,189, 0);
        font-size: 15px;
        width: 100%;
        background-color: #F9F9F9;
    }
    .url input:focus{
        border: 1px solid rgba(189,189,189, 1);
        background-color: white;
    }
    .secondInfo{
        padding: 0px 30px;
        display: flex;
        flex-direction: column;
        margin-top: 20px;
    }
    .secondInfo .row{
        display: flex;
        flex-direction: row;
    }
    .secondInfo input, .links input{
        height: 20px;
        padding: 2px 10px;
        border: 1px solid #bdbdbd;
        border-radius: 4px;
        font-size: 16px;
        font-family: "Source Sans Pro";
    }
    .row div{
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }
    .bioForm{
        color: black;
        border: 1px solid #bdbdbd;
        background-color: white;
        padding: 4px 10px;
        border-radius: 4px;
        word-break: break-word;
        font-family: "Source Sans Pro";
        font-size: 16px;
        resize: none;
    }
    .endButtons{
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 10px 30px 20px 30px;
        justify-content: flex-end;
    }
    .endButtons span{
        color: black;
        font-family: "Source Sans Pro";
        margin-right: 20px;
    }
    .endButtons span:hover{
        text-decoration: underline;
        cursor: pointer;
    }
    .error{
        margin-right: auto;
        font-size: 18px;
        font-weight: 600;
        color: red;
        font-family: "Source Sans Pro";
    }
    .save{
        background-color: #12ADDE;
        border: 0px;
        font-family: "Open Sans";
        font-size: 14px;
        color: #F3F3F3;
        border-radius: 5px;
        padding: 8px 20px;
        transition: 0.5s;
    }
    .save:hover:enabled{
        background: #35cbf6;
        transition: 0.5s;
        cursor: pointer;
    }
    .disableButton{
        background: #94b3c1;
    }
    .links{
        padding: 0px 30px;
    }
    .links hr{
        border: none;
        border-top: 1px solid #d9d9d9;
        width: 100%;
    }
    .Onelink{
        display: flex;
        align-items: center;
        flex-direction: row;
        color: black;
        margin-bottom: 10px;
    }
    .Onelink i{
        border: 1px solid #bababa;
        border-radius: 4px;
        font-size: 16px;
        padding: 4px;
        margin-left: 10px;
        user-select: none;
    }
    .addlink{
        background-color: rgba(255, 255, 255, 0.8);
        font-size: 13px;
        padding: 2px 10px;
        color: black;
        font-family: "Source Sans Pro";
        border-radius: 3px;
        border: 1px solid #909090;
        margin-right: 10px;
        user-select: none;
    }
</style>