<template>
    <main>
        <header><h1 @click="$router.push('/')">musicamp</h1></header>

        <div class="form">
            <form action="" @submit.prevent="submitHandler">

            <span class="name">Sign up</span>

                <div class="email">
                    <label for="email">email</label>
                    <br>
                    <input
                            id="email"
                            type="text"
                            v-model.trim="email"
                            v-bind:class="{invalidInput: ($v.email.$dirty && !$v.email.required) || ($v.email.$dirty && !$v.email.email)}"
                    >
                    <transition name="bounce">
                    <span
                            class="inputError"
                            v-if="$v.email.$dirty && !$v.email.required"
                    >Поле email не должно быть пустым</span>
                    <span
                            class="inputError"
                            v-else-if="$v.email.$dirty && !$v.email.email"
                    >Некорректный email</span>
                    </transition>
                </div>
                <div class="password">
                    <label for="password">password</label>
                    <br>
                    <input
                            id="password"
                            type="password"
                            v-model.trim="password"
                            v-bind:class="{invalidInput: ($v.password.$dirty && !$v.password.required) || ($v.password.$dirty && !$v.password.minLength)}"
                    >
                    <transition name="bounce">
                    <span
                            class="inputError"
                            v-if="$v.password.$dirty && !$v.password.required || !$v.password.minLength"
                    >Минимальная длина 6 символов</span></transition>
                </div>
                <div class="username">
                    <label for="username">username</label>
                    <br>
                    <input
                            id="username"
                            type="text"
                            v-model="username"
                            v-bind:class="{invalidInput: $v.username.$dirty && !$v.password.required}"
                    >
                    <transition name="bounce">
                    <span
                            class="inputError"
                            v-if="$v.username.$dirty && !$v.username.required"
                    >Поле username не должно быть пустым</span></transition>
                </div>
            <br>
            <span class="error">{{error}}</span>
            <br>
                <span class="terms">Регистрируясь на портале вы принимаете
                    <router-link class="link" to="terms">
                        условия пользования
                    </router-link>
                </span>
            <button
                    class="button"
                    type="submit"
                    :class="{disableButton: submitStyle}"
                    :disabled="submitStyle"
            >sign up</button>
            <br>
            <span class="hint" @click="$router.push('/login')">Already have an account?</span>

            </form>
        </div>

        <footer></footer>
        <div class="bg"></div>
    </main>
</template>

<script>

    import {email, required, minLength} from 'vuelidate/lib/validators'
    import axios from "axios";

    export default {

        validations: {
            email: {email,required},
            password: {minLength:minLength(6), required},
            username: {required}
        },
        name: "register",
        data(){
            return {
                email: "",
                password:"",
                username:"",
                error:""
            }
        },
        methods:{
            submitHandler(){
                if (this.$v.$invalid){
                    this.$v.$touch()
                    return
                }
                const regData={
                    email: this.email,
                    password: this.password,
                    username: this.username
                }
                this.register(regData)
            },
            async register(regData) {
                try {
                    await axios.post("http://musicamp.std-263.ist.mospolytech.ru/auth/registration", regData)
                    const loginData = {
                        email: this.email,
                        password: this.password
                    }
                    this.login(loginData).catch(() => {})
                } catch (e) {
                    this.error = e.response.data.message
                }
            },
            async login(loginData) {
                try {
                    const res = await axios.post("http://musicamp.std-263.ist.mospolytech.ru/auth/login", loginData)
                    localStorage.setItem("token", res.data.token)
                    this.$store.dispatch('mounted').catch(() => {})
                    this.$router.push("/").catch(() => {})
                } catch (e) {
                    this.error = e.response.data.message
                }
            }
        },
        computed:{
            submitStyle(){
                return !(this.$v.email.required && this.$v.email.email) || !(this.$v.password.required && this.$v.password.minLength) || !this.$v.username.required
            }
        },
        created() {
            this.$store.dispatch('created')
        }
    }
</script>

<style scoped>
    header{
        width: 100%;
        margin: 0;
        padding: 0px;
        background-color: #DEDEDE;
        height: 120px;
        display: flex;
        align-items: center;
        z-index: 5;
    }
    h1{
        cursor: pointer;
        margin-left: 10%;
        font-family: Arimo;
        font-size: 30px;
    }
    footer{
        position: absolute;
        bottom:0px;
        width: 100%;
        height: 70px;
        background-color: #8AA9B3;
    }
    .bg{
        background: url("../../public/img/loginBG.png") no-repeat;
        background-size: cover;
        position: absolute;
        top:0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: 0;
        z-index: -1;
    }
    .form{
        width: 370px;
        background-color: #efefef;
        border-radius: 2px;
        margin: 140px auto auto auto;
        box-shadow:  0px 0px 30px 0px rgba(0, 0, 0, 0.4);
        padding: 30px 12px 20px 12px ;
        font-family: "Open Sans";
    }
    form{
        display: flex;
        flex-direction: column;
    }
    .name{
        font-weight: bold;
        font-size: 30px;
        text-align: center;
    }
    .email{
        margin-top: 28px;
        margin-bottom: 20px;
    }
    .password{
        margin-bottom: 20px;
    }
    .email label, .password label, .username label{
        color: #535353;
        font-size: 14px;
        font-weight: 400;
    }
    .invalidInput{
        border: 1px solid #ec1414 !important
    }
    .email input, .password input, .username input{
        height: 35px;
        width: 354px;
        border: 1px solid #939393;
        font-size: 16px;
        text-align: left;
        margin: 2px 0px;
        padding-left: 12px;
    }
    .hint{
        font-size: 14px;
        color: #0390BC;
        cursor: pointer;
        text-align: center;
    }
    .hint:hover{
        text-decoration: underline;
    }
    .button{
        height: 45px;
        width: 100%;
        background: #0390BC;
        color: #EFEFEF;
        font-size: 22px;
        margin: 0px auto -10px auto;
        font-weight: bold;
        line-height: 40px;
        transition: 0.5s;
        border: 0px;
    }
    .button:hover:enabled{
        background: #03a7d7;
        transition: 0.5s;
        cursor: pointer;
    }
    .button:active:enabled{
        background: #007293;
    }
    .disableButton{
        background: #94b3c1;
    }
    .error{
        color: #ec1414;
        font-size: 16px;
        margin-top: 6px;
        text-align: center;
    }
    .inputError{
        color: #ec1414;
        font-size: 14px;
        text-align: left;
    }
    .terms{
        font-family: "Open Sans";
        font-size: 11px;
        text-align: center;
        margin-bottom: 4px;
    }
    .link{
        color: #656565;
    }
    .bounce-enter-active {
        animation: bounce-in .5s;
    }
    .bounce-leave-active {
        animation: bounce-in .5s reverse;
    }
    @keyframes bounce-in {
        0% {
            transform: translateX(50px);
            opacity: 0;
        }
        80% {
            transform: translateX(-10px);
        }
        100% {
            transform: translateX(0px);
        }
    }
</style>