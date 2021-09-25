<template>
    <header>
        <router-link class="headerName" to="/" >
            <h1 style="font-size: 26px;" >musicamp</h1>
        </router-link>

        <router-link to="/">
        <div :style="`background: url(${require('../../public/img/threadLogo.png')})`" class="tooltip">
        <span class="tooltiptext">Форум</span>
        </div>
        </router-link>

        <div :style="`background: url(${require('../../public/img/albumsLogo.png')})`" class="tooltip">
            <span class="tooltiptext">Альбомы</span>
        </div>

        <div :style="`background: url(${require('../../public/img/favoriteLogo.png')})`" class="tooltip">
            <span class="tooltiptext">Избранное</span>
        </div>

        <div :style="`background: url(${require('../../public/img/infoLogo.png')})`" class="tooltip">
            <span class="tooltiptext">Помощь</span>
        </div>

        <nav v-if="auth" class="userBar" v-click-outside="menuClose" @click="isOpen = !isOpen" :class="{userBarActive:isOpen}">

                <img style="border-radius: 50%; object-fit: cover; " v-if="$store.getters.getUser.avatar" :src=$store.getters.getUser.avatar alt="">
                <img v-else src="../../public/img/userLogo.png" alt="">

            <span>{{ this.$store.getters.getUser.username }}</span>
            <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 9L13.0622 0.75H0.937822L7 9Z" fill="#C4C4C4"/>
            </svg>
            <ul class="submenu" :class="{submenuOpen:isOpen}">
                <li>
                    <router-link  style="text-decoration: none;" :to="{ name: 'user', params: { userId: $store.getters.getUser.id } }">
                        <span>
                        <i class="Large material-icons">person</i>Profile
                        </span>
                    </router-link>
                </li>
                <li>
                    <span>
                        <i class="Large material-icons">settings</i>Settings
                    </span>
                </li>
                <li>
                    <span @click="$store.dispatch('logout')">
                    <i class="Large material-icons">logout</i>Log out
                    </span>
                </li>
            </ul>
        </nav>
        <nav class="newUserBar" v-if="!auth">
            <span @click="$router.replace('/login')">log in</span>
            <span @click="$router.replace('/register')">sign up</span>
        </nav>


    </header>


</template>

<script>
    import ClickOutside from 'vue-click-outside'

    export default {
        name: "Header",
        data(){
            return{
                auth: localStorage.getItem('token'),
                username: this.$store.getters.getUser.username,
                isOpen:false
            }
        },
        methods: {
            menuOpen() {
                this.isOpen = true
            },
            menuClose() {
                this.isOpen = false
            }
        },
        directives: {
            ClickOutside
        }
    }
</script>

<style scoped>
    header{
        user-select: none;
        width: 100%;
        background-color: #F9F9F9;
        height: 48px;
        display: flex;
        flex-direction: row;
        align-items: center;
        box-shadow: 0px 4px 3px -2px rgba(0, 0, 0, 0.1);
        position: fixed;
        top:0px;
        z-index: 99;
    }
    .headerName{
        cursor: pointer;
        font-family: Arimo;
        color: #12ADDE;
        margin-left: 8%;
        margin-right: auto;
        text-decoration: none;
    }
    header img{
        margin: 0px 10px;
    }
    header img:hover{
        cursor: pointer;
    }
    .newUserBar{
        display: flex;
        flex-direction: row;
        align-items: center;
        font-family: "Open Sans";
        margin-right: 8%;
        font-size: 18px;
        font-weight: bold;
        color: #393939;
    }
    .newUserBar span{
        padding: 0px 10px;
    }
    .newUserBar span:hover{
        cursor: pointer;
        text-decoration: underline;
    }
    .newUserBar span:first-child{
        color: #44c3ec;
    }
    .userBar{
        border: 1px solid #ECECEC;
        border-radius: 3px;
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 38px;
        width: 220px;
        font-family: "Open Sans";
        font-weight: lighter;
        font-size: 14px;
        margin-left: 10px;
        margin-right: 8%;
    }
    .userBar img{
        width: 30px;
        height: 30px;
        margin: 0px 7px 0px 13px;
    }
    .userBar svg{
        margin-left: auto;
        padding-right: 18px;
    }
    .userBar:hover{
        border: 1px solid #a0a0a0;
        cursor: pointer;
    }
    .userBarActive{
        border: 1px solid #a0a0a0;
    }

    .tooltip{
        position: relative;
        width: 30px;
        height: 30px;
        margin: 0px 10px;
    }
    .tooltip:hover{
        cursor: pointer;
    }
    .tooltip .tooltiptext {
        visibility: hidden;
        width: 80px;
        background-color: rgba(0, 0, 0, 0.85);
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 5px 0;
        position: absolute;
        z-index: 1;
        top: 150%;
        left: 50%;
        margin-left: -40px;
        opacity: 0;
        font-family: "Open Sans";
        font-weight: lighter;
        font-size:12px;
        transition: 0.1s;
    }
    .tooltip .tooltiptext::after {
        content: "";
        position: absolute;
        bottom: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: transparent transparent black transparent;
    }
    .tooltip:hover .tooltiptext {
        visibility: visible;
        opacity: 1;
        transition: .3s ease-in-out .5s;
    }

    .submenu {
        width: 220px;
        position: absolute;
        z-index: 10;
        display: none;
        background:  #F9F9F9;
        list-style: none;
        margin-top: 182px;
        margin-left: -1px;
        padding: 0px;
        border: 1px solid #a0a0a0;
        border-radius: 0px 0px 3px 3px;
        border-top: 0px;
    }
    .submenuOpen {
        display: block;
    }
    .submenu span {
        display: flex;
        padding: 10px 15px;
        font-family: Roboto;
        font-weight: 300;
        font-size: 14px;
        flex-direction: row;
        align-items: center;
        color: black;
    }
    .submenu span i{
        padding-right: 10px;
        opacity: 0.5;
    }
    .submenu span:hover {
        background: #b0e9fc;
    }
</style>