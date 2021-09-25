<template>
    <div class="commentsPart">

            <singleComment
                    v-for="n in sortComments"
                    :key="n.id"
                    @userReply="addReply"
                    :username=n.user.username
                    :date=n.created
                    :comment=n.title
                    :votes=n.rating
                    :userId=n.user._id
                    :userRole=n.user.roles
                    :avatar= "n.user.settings ?  n.user.settings.avatar : ''"
            />

        <div class="showMore" v-show="comments.length > 1">
            <span @click="showComments = !showComments" v-if="!showComments">show all {{allComments.length}} comments</span>
            <span @click="showComments = !showComments" v-else-if="showComments">hide all comments</span>
        </div>

            <form v-show="auth" class="commentForm" @submit.prevent="submitHandler">

<!--            <div class="userRating">-->
<!--                <i class="material-icons">expand_less</i>-->
<!--                <span>0</span>-->
<!--                <i class="material-icons">expand_more</i>-->
<!--            </div>-->

            <div class="userLogo">
                <img style="border-radius: 50%; object-fit: cover; " v-if="$store.getters.getUser.avatar" :src=$store.getters.getUser.avatar alt="">
                <img v-else src="../../../public/img/userLogo.png" alt="">
            </div>

            <input
                    tag="div"
                    class="commentInput"
                    :noNL="true"
                    :noHTML="true"
                    placeholder="write a comment..."
                    v-model="comment"
                    ref="commentInput"

            />
            <div class="showEmoji">
                <i class="musicIcon Large material-icons">sentiment_satisfied_alt</i>
                <div><smiles @sendSmile="addSmile" style="margin-top: -136px;" /></div>
            </div>

            <button :disabled="!$v.comment.required || $v.comment.$dirty"  class="sendButton"><i type="submit" class="material-icons">send</i></button>

            </form>

    </div>
</template>

<script>
    import singleComment from "./singleComment";
    import smiles from "./smiles";
    import {required} from 'vuelidate/lib/validators'
    import axios from "axios";

    export default {
        components:{singleComment, smiles},
        validations: {
            comment: {required}
        },
        props: {
            postId: String,
            comments:{
                type: Array,
                default: () => []
            }
        },
        name: "comments",
        data(){
            return{
                auth: localStorage.getItem('token'),
                showComments:false,
                comment:"",
                sortedComments:[],
                allComments: this.comments
            }
        },
        computed:{
            sortComments(){
                if (this.showComments) return this.allComments
                    return this.allComments.slice(0, 1)
                }
        },
        methods:{
            addSmile(smile){
                this.comment = this.comment + smile
            },
            addReply(reply){
                if(this.comment === ''){
                    this.comment = this.comment + reply + ", "
                    this.$refs.commentInput.focus()
                }
            },
            submitHandler(){
                if (this.$v.$invalid){
                    return
                }

                this.$v.$touch()

                const commentData = {
                    title: this.comment,
                    postId: this.postId
                }

                this.error = "Подождите, загрузка"
                this.createComment(commentData)
            },
            async createComment(commentData) {
                try {
                    const res = await axios.post("http://musicamp.std-263.ist.mospolytech.ru/upload/commentUpload", commentData, {headers:{ authorization : 'Bearer ' + localStorage.getItem('token')}})
                    this.allComments = res.data.comments
                    this.$v.$reset()
                    this.comment = ""
                    this.showComments = true
                } catch (e) {
                    this.error = e.response.data.message
                }
            }
        }
    }
</script>

<style scoped>
    .commentsPart{
        display: flex;
        flex-direction: column;
    }
    .commentForm{
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        margin: 10px 0px;
        flex-grow: 1;
    }
    .userRating{
        display: flex;
        flex-direction: column;
        align-items: center;
        line-height: 0px;
        font-family: "PT sans";
        font-size: 16px;
        font-weight: 700;
        margin-top: -3px;
        color: #DEDEDE;
    }
    .userRating i{
        font-size: 32px;
        line-height: 22px;
    }
    .userLogo img{
        width: 36px;
        height: 36px;
    }
    .commentInput{
        background-color: #E9E9E9;
        border: 1px solid #E5E5E5;
        margin: 3px 10px 0px 10px;
        font-size: 14px;
        font-family: "Open Sans";
        border-radius: 4px;
        padding: 4px 8px 4px 8px;
        word-break: break-word;
        width: 100%
    }
    .commentInput{
        cursor: text;
    }
    [contenteditable]:empty:before {
        display: block;
        color: #6c6c6c;
        content: attr(placeholder);
    }
    .showEmoji:hover div{
        display: flex;
    }
    .showEmoji{
        margin-top: 7px;
        display: block;
        width: 24px;
    }
    .showEmoji i{
        margin: 0px;
        padding: 0px;
        font-size: 21px;
        color: #9c9c9c;
    }
    .showMore{
        font-family: "Open Sans";
        font-size: 14px;
        font-weight: 500;
        color: #8A8A8A;
        margin: 4px 0px;
    }
    .showMore span:hover{
        cursor: pointer;
        text-decoration: underline;
    }
    .sendButton{
        color:#E9E9E9;
        align-self:flex-start;
        margin: 4px 4px 0px 0px;
        background: none;
        border: none;
    }
    .sendButton:enabled{
        color: #acacac;
    }
    .sendButton i{
        margin: 0;
        padding: 0;
    }
    .sendButton:enabled:hover{
        cursor: pointer;
    }
</style>