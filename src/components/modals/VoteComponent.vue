<template>
    <div class="vote">
        <i @click="addVote" :class="{upVote: currentVote === 1}" class="material-icons">expand_less</i>
        <span :class="{upVote: currentVote === 1, downVote: currentVote === -1}" >{{ SumVotes + currentVote}}</span>
        <i @click="removeVote" :class="{downVote: currentVote === -1}" class="material-icons">expand_more</i>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: "VoteComponent",
        data(){
            return{
                getVote:null,
                auth: localStorage.getItem('token'),
                allVotes:this.Votes
            }
        },
        props:{
            Votes:{
                type: Array,
                default: () => [0]
            },
            componentId: String
        },
        computed:{
            currentVote(){
                if(!this.auth){
                    return 0
                }
                if(this.getVote){
                    return this.getVote
                }
                const s = this.allVotes.find(vote => vote.user === this.$store.getters.getUser.id)
                if(s){
                    return s.vote
                }
                return 0
            },
            SumVotes(){
                function sum (x){
                    let s = 0;
                    for (let i = 0; i < x.length; i++){
                        s += x[i]
                    }
                    return s
                }

                return (sum(this.allVotes.map(votes => votes.vote)) - this.currentVote)
            },
        },
        methods:{
            addVote(){
                if(!this.auth){
                    return
                }
                if (this.currentVote === 1){
                    this.getVote = 0
                }else{
                    this.getVote = 1
                }
                const voteData = {
                    postId: this.componentId,
                    vote: this.getVote
                }
                this.sendVote(voteData)
            },
            removeVote(){
                if(!this.auth){
                    return
                }
                if (this.currentVote === -1){
                    this.getVote = 0
                }else{
                    this.getVote = -1
                }
                const voteData = {
                    postId: this.componentId,
                    vote: this.getVote
                }
                this.sendVote(voteData)

            },
            async sendVote(voteData) {
                try {
                    const res = await axios.post("http://musicamp.std-263.ist.mospolytech.ru/upload/postUpdate", voteData, {headers:{ authorization : 'Bearer ' + localStorage.getItem('token')}})
                    this.allVotes = res.data.votes
                } catch (e) {
                    this.error = e.response.data.message
                }
            }
        }
    }
</script>

<style scoped>
    .vote span{
        font-family: "PT sans";
        font-size: 16px;
        font-weight: 700;
        margin: -10px 0px;
        color: #4D4D4D;
    }
    .vote i{
        font-size: 32px;
        user-select: none;
        color: #acacac;
    }
    .vote i:hover{
        cursor:pointer;
    }
    .vote{
        display: flex;
        flex-direction:column;
        align-items: center;
    }
    .upVote{
        color: #53D218 !important;
    }
    .downVote{
        color: #D21818 !important;
    }
</style>