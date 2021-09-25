<template>

    <div class="showSettings">
        <i class="material-icons">more_horiz</i>
        <div>
            <div v-show="admin" class="settingList">
                <span @click="del">Удалить</span>
            </div>

        </div>
    </div>

</template>

<script>
    import axios from "axios";

    export default {
        name: "Settings",
        props:{
            postId:String,
            type:{type:Number, default:0},
            userId:String
        },
        data(){
            return{
                auth: localStorage.getItem('token')
            }
        },
        computed:{
            admin() {
                if(!this.auth){
                    return
                }
                if (this.$store.getters.getUser.roles.includes("ADMIN")) {
                    return true
                }
                if( this.$store.getters.getUser.id === this.userId){
                    return true
                }
                return false
            }
        },
        methods:{
            del(){
                const data = {
                    postId: this.postId
                }
                this.deleteComponent(data)
            },
            async deleteComponent(data){
                try {
                    await axios.post("http://musicamp.std-263.ist.mospolytech.ru/upload/postDelete", data , {headers:{ authorization : 'Bearer ' + localStorage.getItem('token')}})
                    this.$emit('reload')
                } catch (e) {
                    this.error = e.response.data.message
                    console.log(e)
                }
            }
        }
    }
</script>

<style scoped>
    .settingList{
        margin-left: -80px;
        margin-top: -6px;
        position: absolute;
        z-index: 10;
        width: 120px;
        background-color: #F9F9F9;
        border-radius: 4px;
        display: none;
        flex-direction: column;
        box-shadow:0px 0px 10px 0px rgba(50, 50, 50, 0.25);
    }
    .settingList::-webkit-scrollbar {
        width: 12px;
    }
    .settingList::-webkit-scrollbar-thumb {
        background-color: #959595;    /* цвет плашки */
        border-radius: 20px;       /* закругления плашки */
        border: 3px solid #F9F9F9;  /* padding вокруг плашки */
    }
    .settingList span{
        text-align: center;
        font-family: "Open Sans";
        font-size: 12px;
        padding: 4px 0px;
    }
    .settingList span:hover{
        cursor: pointer;
        background-color: #eaeaea;
    }

    .showSettings:hover div{
        display: flex;
    }
    .showSettings{
        margin-left: 18px;
        display: block;
        width: 24px;
    }
    .showSettings i{
        margin: 0px;
        padding: 0px;
        user-select: none;
    }
    .showSettings i:hover{
        cursor: pointer;
    }
</style>