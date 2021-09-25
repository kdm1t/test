<template>
    <div class="smileList">
        <div>Люди</div>
        <span
                v-for="smile in smiles"
                :key="smile.id"
                @click="sendSmile(smile)"
        >{{smile}}</span>
    </div>
</template>

<script>
    export default {
        name: "smiles",
        data(){
            return{
                smiles:["✌","😂","😝","😁","😱","👉","🙌","🍻","🔥","🌈","☀","🎈","🌹","💄","🎀","⚽","🎾","🏁","😡","👿","🐻","🐶","🐬","🐟","🍀","👀","🚗","🍎","💝","💙","👌","❤","😍","😉","😓","😳","💪","💩","🍸","🔑","💖","🌟","🎉","🌺","🎶","👠","🏈","⚾","🏆","👽","💀","🐵","🐮","🐩","🐎","💣","👃","👂","🍓","💘","💜","👊","💋","😘","😜","😵","🙏","👋","🚽","💃","💎","🚀","🌙","🎁","⛄","🌊","⛵","🏀","🎱","💰","👶","👸","🐰","🐷","🐍","🐫","🔫","👄","🚲","🍉","💛","💚"]
            }
        },
        methods:{
            sendSmile(smile){
                this.$emit("sendSmile", smile)
            }
        }
    }
</script>

<style scoped>
    .smileList{
        margin-left: -230px;
        margin-top: -6px;
        position: absolute;
        z-index: 10;
        width: 252px;
        background-color: #F9F9F9;
        border-radius: 4px;
        display: none;
        flex-direction: row;
        flex-flow: row wrap;
        padding: 6px;
        height: 100px;
        overflow-x: auto;
        box-shadow:0px 0px 10px 0px rgba(50, 50, 50, 0.25);
    }
    .smileList::-webkit-scrollbar {
        width: 12px;
    }
    .smileList::-webkit-scrollbar-thumb {
        background-color: #959595;    /* цвет плашки */
        border-radius: 20px;       /* закругления плашки */
        border: 3px solid #F9F9F9;  /* padding вокруг плашки */
    }
    .smileList span{
        display: block;
        padding: 1px 2px 2px 2px;
        font-size: 14px;
        width: 20px;
        height: 20px;
        text-align: center;
    }
    .smileList span:hover{
        background-color: #e5e5e5;
        border-radius: 3px;
        cursor: pointer;
    }
    .smileList div{
        width: 100%;
        font-family: "PT sans";
        font-size: 14px;
        margin-left: 6px;
        padding-bottom: 5px;
    }
</style>