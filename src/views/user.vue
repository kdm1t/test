<template>
    <main>

        <Header />

        <div class="userHeader" :style="{'background': getBackground }">

            <img v-if="!userInfo.settings" src="../../public/img/userLogo.png" alt="">

            <div v-if="userInfo.settings">
                <img v-if="userInfo.settings.avatar" :src=userInfo.settings.avatar alt="">
                <img v-else src="../../public/img/userLogo.png" alt="">
            </div>

            <div class="userInfo">
                <span class="username">{{userInfo.username}} <Verified_icon :role=userInfo.roles /></span>
                <span v-if="names" class="name">{{names}}</span>
                <div v-if="loc" class="country">
                    <span>{{loc}}</span>
                </div>
                <div class="buttons">
                    <i v-show="$route.params.userId !== $store.getters.getUser.id" style="margin-right: 5px" class="icon material-icons">favorite</i>
                    <div v-show="$route.params.userId !== $store.getters.getUser.id" style="margin-right: 5px" class="subscribe"><i class="material-icons">star_border</i><span>Subscribe</span></div>
                    <i style="margin-right: 5px" class="icon material-icons">reply</i>
                    <i class="icon material-icons">report_gmailerrorred</i>
                    <div v-show="$store.getters.getUser.id === $route.params.userId" @click="$modal.show('ProfileSettings')" class="edit"><i style="margin-left: auto" class="material-icons">edit</i><span>Edit</span></div>
                    <modal name="ProfileSettings"  :width="780" height=auto :styles="'background-color: #F9F9F9;'">
                        <ProfileSettings
                                :backgrounds = backgrounds
                                :prop_bio = "userInfo.settings ? userInfo.settings.bio : ''"
                                :prop_currentBG = "userInfo.settings ? userInfo.settings.background : 0"
                                :prop_links = "userInfo.settings ? userInfo.settings.links : [] "
                                :prop_firstName = "userInfo.settings ? userInfo.settings.firstName : ''"
                                :prop_lastName = "userInfo.settings ? userInfo.settings.lastName : ''"
                                :prop_city = "userInfo.settings ? userInfo.settings.city : ''"
                                :prop_country = "userInfo.settings ? userInfo.settings.country : ''"
                                :prop_avatar = "userInfo.settings ? userInfo.settings.avatar : ''"
                                @reset="reload"
                                @close="$modal.hide('ProfileSettings')"
                        />
                    </modal>
                </div>
            </div>

        </div>

        <div class="main">

            <div class="leftSide" :key="mainComponent">
                <div class="mainHeader">
                    <router-link class="link" :to="{ name: 'user', params: { userId: $route.params.userId}, query : {tab: 'feed'} }">
                    <span :class="{linkActive: $route.query.tab === 'feed' || !$route.query.tab}">Feed</span>
                    </router-link>
                    <router-link class="link" :to="{ name: 'user', params: { userId: $route.params.userId}, query : {tab: 'tracks'} }">
                    <span :class="{linkActive: $route.query.tab === 'tracks'}">Tracks</span>
                    </router-link>
                    <router-link class="link" :to="{ name: 'user', params: { userId: $route.params.userId}, query : {tab: 'albums'} }">
                    <span :class="{linkActive: $route.query.tab === 'albums'}">Albums</span>
                    </router-link>
                    <router-link class="link" :to="{ name: 'user', params: { userId: $route.params.userId}, query : {tab: 'favorite'} }">
                    <span :class="{linkActive: $route.query.tab === 'favorite'}">Favorite</span>
                    </router-link>
                </div>

                <feed  v-if="$route.query.tab === 'feed' || !$route.query.tab" />
                <tracks v-if="$route.query.tab === 'tracks'" />
                <albums v-if="$route.query.tab === 'albums'"  />
            </div>


            <div class="rightSide">
                <div class="userBar">

                    <div class="info">
                        <div>
                            <span>Followers</span>
                            <span>190</span>
                        </div>

                        <div>
                            <span>Tracks</span>
                            <span>{{userInfo.tracks}}</span>
                        </div>

                        <div>
                            <span>Subscribers</span>
                            <span>15</span>
                        </div>
                    </div>

                    <p v-if="userInfo.settings">{{userInfo.settings.bio}}</p>

                    <div class="links" v-if="userInfo.settings">
                        <div @click="openLink(link.url)" v-for="link in userInfo.settings.links" :key="link.id">
                            <i class="material-icons">public</i><span>{{link.title ? link.title : link.url}}</span>
                        </div>
                    </div>

                </div>
                <RightBar/>
            </div>

        </div>

    </main>
</template>

<script>

    import Header from '../components/Header'
    import RightBar from "../components/RightBar";
    import feed from "../components/User/feed"
    import tracks from "../components/User/tracks";
    import axios from "axios";
    import Verified_icon from "../components/modals/Verified_icon";
    import albums from "../components/User/albums"
    import ProfileSettings from "../components/ProfileSettings";

    export default {
        name: "user",
        components:{ProfileSettings, Header, RightBar, feed, Verified_icon, tracks, albums},
        data(){
            return{
                userInfo:{},
                mainComponent : 0,
                backgrounds: [
                    "linear-gradient(135deg, rgba(175,193,194,1) 0%, rgba(50,146,158,1) 100%)",
                    "linear-gradient(135deg, rgba(175,193,194,1) 0%, rgba(150,146,158,1) 100%)",
                    "linear-gradient(135deg, rgba(115,193,144,1) 0%, rgba(50,146,158,1) 100%)",
                    "linear-gradient(135deg, rgba(75,193,224,1) 0%, rgba(220,146,158,1) 100%)"
                ]
            }
        },
        watch:{
            '$route.params.userId'() {
                this.created()
                this.mainComponent += 1
            },
        },
        mounted() {
            this.created()
        },
        methods:{
            openLink(url){
                window.open(url)
            },
            async created(){
                try{
                    const res = await axios.get("http://musicamp.std-263.ist.mospolytech.ru/auth/userPage",  {params: {id: this.$route.params.userId}})
                    this.userInfo = res.data.user
                }catch (e) {
                    await this.$router.push("/")
                }
            },
            reload(){
                this.$modal.hide('ProfileSettings')
                Object.assign(this.$data, this.$options.data.call(this))
                this.created()
            }
        },
        computed:{
            names(){
                if (!this.userInfo.settings){
                    return false
                }
                if (!this.userInfo.settings.firstName){
                    return false
                }
                return this.userInfo.settings.firstName
            },
            loc(){
                if (!this.userInfo.settings){
                    return false
                }
                if (!this.userInfo.settings.country && this.userInfo.settings.city){
                    return false
                }
                if (!this.userInfo.settings.city){
                    return this.userInfo.settings.country
                }
                if (!this.userInfo.settings.country){
                    return this.userInfo.settings.city
                }
                return this.userInfo.settings.city + ', ' + this.userInfo.settings.country
            },
            getBackground(){
                if (!this.userInfo.settings){
                    return this.backgrounds[0]
                }
                return this.backgrounds[this.userInfo.settings.background]
            }
        }
    }
</script>

<style scoped>
    .userHeader{
        background: linear-gradient(135deg, rgba(175,193,194,1) 0%, rgba(50,146,158,1) 100%);
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 240px;
        z-index: 99;
        margin: 48px auto auto auto;
        width: 1100px;
        user-select: none;
    }
    .userHeader img{
        width: 180px;
        height: 180px;
        border-radius: 100px;
        margin: 0px 25px 0px 70px;
        object-fit: cover;
    }
    .userInfo{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        margin-right: 20px;
    }
    .userInfo .username{
        background-color: rgba(19,19,19,0.8);
        color: #F6F6F6;
        font-family: "Open Sans";
        font-weight: 600;
        font-size: 22px;
        padding: 6px;
        margin-bottom: 4px;
    }
    .userInfo .name{
        background-color: rgba(19,19,19,0.8);
        color: #F6F6F6;
        font-family: "Open Sans";
        font-weight: 600;
        font-size: 16px;
        padding: 3px 6px;
        margin-bottom: 4px;
    }
    .userInfo .country{
        background-color: rgba(19,19,19,0.8);
        color: #F6F6F6;
        font-family: "Open Sans";
        font-weight: 400;
        font-size: 14px;
        padding: 3px 6px;
    }
    .userInfo .buttons{
        margin-top: 30px;
        display: flex;
        flex-direction: row;
        color: #f3f3f3;
        align-items: center;
        width: 100%;
    }
    .subscribe{
        display: flex;
        flex-direction: row;
        align-items: center;
        background-color: rgba(18,173,222,0.8);
        border-radius: 5px;
        font-family: "Open Sans";
        font-weight: 600;
        padding: 5px 10px;
    }
    .subscribe i{
        font-size: 26px;
    }
    .userInfo .buttons .icon{
        background-color: rgba(19,19,19,0.8);
        border-radius: 5px;
        font-size: 26px;
        padding: 5px 10px;
    }
    .userInfo .buttons .icon:hover, .subscribe:hover{
        cursor: pointer;
    }
    .edit{
        background-color: rgba(255, 255, 255, 0.7);
        font-size: 16px;
        padding: 2px 10px;
        color: black;
        display: flex;
        align-items: center;
        font-family: "Source Sans Pro";
        align-self: flex-end;
        margin-left: auto;
        border-radius: 3px;
        border: 1px solid #909090;
    }
    .edit i{
        font-size: 18px;
        margin-right: 3px;
    }
    .edit:hover{
        cursor: pointer;
        border: 1px solid #616161;
    }
    .main{
        margin: auto;
        display: flex;
        flex-direction: row;
        width: 1100px;
    }
    .mainHeader{
        display: flex;
        flex-direction: row;
        margin-bottom: 10px;
        background-color: #F9F9F9;
        padding: 0px 26px;
        border-radius: 0px 0px 2px 2px;
        justify-content: stretch;
        align-items: center;
        height: 46px;
        user-select: none;
    }
    .mainHeader .link{
        font-family: "Open Sans";
        margin: 0px 12px;
        text-decoration: none;
        color: black;
    }
    .mainHeader .link span{
        font-size: 16px;
        font-weight: 500;
        padding: 10px 0px;
    }
    .linkActive{
        border-bottom: 2px solid #12ADDE;
        color: #12ADDE;
    }
    .mainHeader span:hover{
        cursor: pointer;
    }
    .mainHeader span:first-child{
        margin-left: 0px;
    }
    .leftSide{
        padding-bottom: 26px;
        width: 750px;
    }
    .rightSide{
        margin-left: 20px;
        width: 330px;
    }
    .userBar{
        border-right: 1px solid #D7D7D7;
        border-left: 1px solid #D7D7D7;
        padding: 22px;
        background-color: #F9F9F9;
    }
    .userBar .info{
        display: flex;
        flex-direction: row;
        font-family: "Open Sans";
        justify-content: space-between;
    }
    .userBar .info div{
        display: flex;
        flex-direction: column;
    }
    .userBar .info div span:first-child{
        color: #A0A0A0;
        font-weight: 300;
        font-size: 16px;
    }
    .userBar .info div span:last-child{
        color: #272727;
        font-weight: 300;
        font-size: 20px;
    }
    .userBar .info div:nth-child(2){
        border-right: 1px solid #c9c9c9;
        border-left: 1px solid #c9c9c9;
        padding: 0px 14px;
    }
    .userBar p{
        font-family: "Open Sans";
        font-weight: 300;
        color: #272727;
        font-size: 14px;
    }
    .links{
        font-family: "Open Sans";
        font-weight: 300;
        color: #A0A0A0;
        font-size: 14px;
        margin-top: 40px;
    }
    .links div{
        display: flex;
        align-items: center;
        margin: 5px 0px;
    }
    .links div i{
        font-size: 20px;
        margin-right: 4px;
        user-select: none;
    }
    .links div:hover{
        cursor: pointer;
    }
    .links div:hover span{
        text-decoration: underline;
    }
</style>