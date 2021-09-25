<template>
    <div class="main">
        <div class="header">
            <span>Attach track</span>
            <i @click="closeModal" class="material-icons">close</i>
        </div>

        <hr>
        <div style="overflow-x: auto; height: 630px" class="tracks">
            <tracks
                    :getTrackId=$store.getters.getUser.id
                    @attach="getAttach"
            />
        </div>
    </div>
</template>

<script>
    import tracks from "../User/tracks"

    export default {
        name: "attachTrack",
        components:{tracks},
        methods:{
            getAttach(event){
                this.$emit('attach', event)
                this.closeModal()
            },
            closeModal(){
                this.$emit('close')
            }
        }
    }
</script>

<style scoped>
    .tracks{
        overflow-y: auto;
    }
    .header{
        font-family: "Open Sans";
        font-size: 20px;
        font-weight: 600;
        padding: 20px 20px 10px 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .header i{
        margin-left: auto;
        user-select: none;
    }
    .header i:hover{
        cursor: pointer;
    }
    hr{
        border: none;
        border-top: 2px solid #12ADDE;
        width: 100%;
        margin-bottom: -10px;
    }
</style>