<template>
      <div id="app">
            <router-view/>
            <musicPlayer v-show="$route.path !== '/login' && $route.path !== '/register' " />

            <modal name="showAlbum"  width="600" height="auto" :styles="'background-color: #F9F9F9;'">
                  <SingleAlbum />
            </modal>
      </div>

</template>

<script>

      import musicPlayer from "./components/modals/musicPlayer";
      import SingleAlbum from "./components/SingleAlbum";

export default {
      components:{
            musicPlayer, SingleAlbum
      },
      name: 'App',
      mounted() {
            if(localStorage.getItem('token')){
                  this.$store.dispatch("mounted")
            }
            if(this.$route.query.playlist){
                  this.$modal.show('showAlbum')
            }
      },
};
</script>

<style>
      html{
            overflow: auto !important;
            scrollbar-width: none;
      }
      body{
            padding:0px;
            margin:0;
            background-color: #D2DFE1;
      }
      @import '../public/fonts/fontstylesheet.css';
</style>
