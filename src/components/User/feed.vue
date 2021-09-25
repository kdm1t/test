<template>
    <div>

        <createPost :type=1 @reload="reloadAll" v-show="this.$route.params.userId === $store.getters.getUser.id"/>

        <div
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="true"
                infinite-scroll-distance="2"
        >
        <UserPost
                v-for="post in allPosts"
                :key="post.id"

                :heading=post.title
                :desc=post.description
                :userData=post.user
                :date=post.created
                :post_id=post._id
                :comments=post.comments
                :img=post.images
                :attachTracks=post.tracks
                @reload="reloadAll"
        />
        </div>

    </div>
</template>

<script>
    import createPost from "../createPost";
    import UserPost from "../UserPost"
    import axios from "axios";
    export default {
        name: "feed",
        components:{createPost, UserPost},
        data(){
            return{
                allPosts: [],
                errorPost: "",
                busy: false,
                scroll:0,
                end:false
            }
        },
        methods:{
            reloadAll(){
                Object.assign(this.$data, this.$options.data.apply(this))
                this.loadMore()
            },
            async getPosts(){
                try{
                    const res = await axios.get("http://localhost:5000/upload/userPosts", { params: {page: this.scroll, id: this.$route.params.userId}})
                    this.allPosts = this.allPosts.concat(res.data)
                    this.busy = false;
                    if (res.data.length === 0){
                        this.end = true
                    }
                }catch (e) {
                    this.errorPost = "Ошибка подключения к сети"
                }
            },
            loadMore(){
                if (!this.end){
                    this.busy = true
                    this.scroll++
                    this.getPosts()
                }
            }
        }
    }
</script>


<style scoped>

</style>