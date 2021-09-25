<template>
  <main>
    <Header/>
    <div class="main" style="margin-top: 60px">
      <div class="wrapperLeft">

      <createPost @reload="reloadAll()" />

      <h1 v-show="errorPost" class="errorPost">{{errorPost}}</h1>

      <div
              v-infinite-scroll="loadMore"
              infinite-scroll-disabled="true"
              infinite-scroll-distance="2"
              style="margin-bottom: 80px"
      >
          <Post
                  v-for="post in allPosts"
                  :key="post.id"

                  :heading=post.title
                  :desc=post.description
                  :tags=post.tags
                  :user=post.user
                  :date=post.created
                  :post_id=post._id
                  :comments=post.comments
                  :votes = post.votes
                  :img = post.images
                  :attachTracks = post.tracks
                  @reload="reloadAll()"
          />
      </div>
      </div>

      <div style="margin-left:20px" class="wrapperRight">
        <div ref="sidebarContent" :class="sidebarStyles">
        <div class="filter">

          <div class="button">
            <div><i class="material-icons">local_fire_department</i><span>Hot</span></div>
            <div><i class="material-icons">star</i><span>New</span></div>
          </div>

          <span class="tags" >Choose Tags</span>

        </div>
        <RightBar @ready="calculateSidebar" />
        </div>
      </div>


    </div>
  </main>
</template>

<script>
  import createPost from "../components/createPost";
  import Post from "../components/Post";
  import axios from "axios";
  import RightBar from "../components/RightBar";
  import _ from 'lodash';
  import Header from '../components/Header'

  export default {
    name: 'Home',

    data(){
      return{
        allPosts: [],
        errorPost: "",
        busy: false,
        scroll:0,
        end:false,
        sidebar:{
          height:0,
          windowHeight:0,
          windowScrollTop:0
        }
      }
    },
    created() {
      window.addEventListener('resize', this.handleResize)
      window.addEventListener('scroll', this.handleScroll)
    },
    destroyed(){
      window.removeEventListener('resize', this.handleResize)
      window.removeEventListener('scroll', this.handleScroll)
    },
    components: {
      createPost,
      Post,
      RightBar,
      Header
    },
    computed:{
      sidebarStyles(){
          if(this.sidebar.height <= this.sidebar.windowHeight){
            return {'fixed-top': true}
          }
          if((this.sidebar.windowScrollTop + this.sidebar.windowHeight) > this.sidebar.height){
            return {'fixed-bottom': true}
          }
          return false
      },
    },
    methods:{
      handleResize: _.throttle(function () {
        this.calculateSidebar()
      }, 10),
      handleScroll: _.throttle(function () {
        this.calculateSidebar()
        this.sidebar.windowScrollTop = window.pageYOffset || document.documentElement.scrollTop
      }, 10),
      calculateSidebar(){
        if(this.sidebar.height === this.$refs.sidebarContent.clientHeight){
          return
        }

        this.sidebar.height = this.$refs.sidebarContent.clientHeight

        this.sidebar.windowHeight = window.innerHeight - 160
      },

      reloadAll(){
        Object.assign(this.$data, this.$options.data.apply(this))
        this.loadMore()
      },
      async getPosts(){
        try{
          const res = await axios.get("http://musicamp.std-263.ist.mospolytech.ru/upload/posts", { params: {page: this.scroll}})
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

  .main{
    display: flex;
    flex-direction: row;
    width: 1100px;
    margin: auto;
  }
  .errorPost{
    font-family: "Open Sans";
    text-align: center;
  }
  .fixed-top{
    position: fixed;
    top:60px;
  }
  .fixed-bottom{
    position: fixed;
    bottom:100px;
  }
  .filter{
    display: flex;
    flex-direction: column;
    background-color: #F9F9F9;
    border: 1px solid #D7D7D7;
    border-bottom: 0px;
  }
  .filter .button{
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .filter .button div{
    padding: 5px 10px;
    font-family: "Open Sans";
    font-size: 14px;
    border: 1px solid #8B8B8B;
    color: #8B8B8B;
    border-radius: 4px;
    justify-content: center;
    margin: 10px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .filter i{
    font-size: 16px;
    margin-right: 5px;
  }
  .tags{
    margin: 0px 10px 10px 10px;
    font-family: "Open Sans";
    font-size: 14px;
    background-color: #c6c6c6;
    color: #ffffff;
    padding: 2px 5px;
    border-radius: 8px;
    text-align: center;
  }
</style>
