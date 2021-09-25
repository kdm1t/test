<template>
    <div class="comment">

<!--        <div class="userRating">-->
<!--            <i class="material-icons">expand_less</i>-->
<!--            <span>{{votes}}</span>-->
<!--            <i class="material-icons">expand_more</i>-->
<!--        </div>-->

        <div class="userLogo">
            <img style="border-radius: 50%; object-fit: cover; " v-if="avatar" :src=avatar alt="">
            <img v-else src="../../../public/img/userLogo.png" alt="">
        </div>

        <div class="userSection">
            <span class="userName" @click="$router.push({ name: 'user', params: { userId: userId } })">{{username}}<Verified_icon style="font-size: 15px;margin-left: 3px;" :role = userRole /></span>
            <span class="userComment">{{comment}}</span>
            <div><span class="userTime">{{ date | moment("from", "now") }}</span><span @click="reply(username)" class="replyButton" style="font-size: 13px">Reply</span></div>
        </div>

    </div>
</template>

<script>
    import Verified_icon from "./Verified_icon";

    export default {
        components:{Verified_icon},
        name: "singleComment",
        props: {
            username: String,
            date: String,
            comment: String,
            votes: Number,
            userId: String,
            userRole: Array,
            avatar: String
        },
        methods:{
            reply(userReply){
                this.$emit("userReply", userReply)
            }
        }
    }
</script>

<style scoped>
    .comment{
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        min-height: 50px;
        padding: 5px 0px;
    }
    .userRating{
        display: flex;
        flex-direction: column;
        align-items: center;
        line-height: 0px;

        font-family: "PT sans";
        font-size: 16px;
        font-weight: 700;
        color: #4D4D4D;
        margin-top: -3px;
    }
    .userRating i{
        font-size: 32px;
        opacity: 0.5;
        line-height: 22px;
    }
    .userLogo img{
        width: 36px;
        height: 36px;
    }
    .userSection{
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        font-family: "Open Sans";
        font-size: 14px;
        user-select: auto;
    }
    .userName{
        color:#131313;
        font-weight: 600;
        font-size: 13px;
        line-height: 14px;
    }
    .userComment{
        color:#161616;
        font-weight: 400;
        font-size: 14px;
        word-break: break-word;
    }
    .userTime{
        color: #8A8A8A;
        font-size: 13px;
        margin-right: 5px;
    }
    .replyButton:hover, .userName:hover{
        text-decoration: underline;
        cursor: pointer;
    }
</style>