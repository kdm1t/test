<template>
    <div class="post">

        <div class="header">
            <img style="border-radius: 50%; object-fit: cover; " v-if="userData.settings" :src=userData.settings.avatar alt="">
            <img v-else src="../../public/img/userLogo.png" alt="">
            <div class="info">
                <div>
                    <router-link class="username" :to="{ name: 'user', params: { userId: userData._id } }">
                    <span class="username">{{userData.username}}</span><Verified_icon style="margin-left: 4px; font-size: 17px" :role = userData.roles />
                    </router-link>
                </div>
                <span>{{ date | moment("from", "now") }}</span>
            </div>
            <Settings style="margin-left: auto" @reload="$emit('reload')" :postId=post_id :userId="userData._id" :type=1 />
        </div>

        <div class="main">
            <h1>{{heading}}</h1>
            <p>{{desc}}</p>
        </div>

        <div class="imageBlock" style="justify-content: center">
            <a :href="img" target="_blank">
                <img class="image" v-bind:src="img" alt="">
            </a>
        </div>

        <div class="tracks">
            <postTrack
                    v-for="track in attachTracks"
                    :key="track.id"
                    :id="track._id"
                    :listen=track.listen
                    :logo=track.logo
                    :title=track.title
                    :url=track.url
                    :user=userData
            />
        </div>

        <hr/>
        <comments
            :comments=comments
            :postId=post_id
        />

    </div>
</template>

<script>

    import Settings from "./modals/Settings";
    import comments from "./modals/comments"
    import Verified_icon from "./modals/Verified_icon";
    import postTrack from "./modals/postTrack";

    export default {
        name: "UserPost",
        components:{Settings, comments, Verified_icon, postTrack},
        props: {
            heading: String,
            desc: String,
            userData: Object,
            date: String,
            post_id:String,
            comments:Array,
            img: String,
            attachTracks: Array
        }
    }
</script>

<style scoped>
    .post{
        width: 720px;
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
        flex-grow: 1;
    }
    .header img{
        width: 40px;
        height: 40px;
        border-radius: 50px;
        margin-right: 10px;
    }
    .header .info{
        display: flex;
        flex-direction: column;
        font-family: "Open Sans";
    }
    .username{
        font-size: 15px;
        text-decoration: none;
        color: black;
    }
    .header .info span:last-child{
        font-size: 13px;
        color: #8A8A8A;
    }
    .main h1{
        font-family: "Open Sans";
        font-weight: 600;
        font-size: 30px;
        margin: 8px 0px;
        word-break: break-word;
    }
    .main p{
        font-family: "Open Sans";
        font-size: 14px;
        word-break: break-word;
    }
    hr{
        border: none;
        border-top: 1px solid #E2E2E2;
        width: 100%;
        margin: 4px 0px;
    }
    .imageBlock{
        display: flex;
        flex-direction: row;
    }
    img{
        max-height: 600px;
        max-width: 600px;
    }
    .username:hover{
        cursor: pointer;
        text-decoration: underline;
    }
</style>