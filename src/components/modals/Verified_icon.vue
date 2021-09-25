<template>
    <i
            style=";font-size: 18px; user-select: none;"
            class="material-icons"
            :class="{admin: verifiedColor === 'admin', composer: verifiedColor === 'composer', user: verifiedColor === 'user'}"
    >verified</i>
</template>

<script>
    export default {
        name: "Verified_icon",
        props:{
            role:{
                type: Array,
                default: () => ['user']
            }
        },
        computed:{
            verifiedColor(){
                if (this.role.includes('ADMIN')){
                    return 'admin'
                }
                if (this.role.includes('COMPOSER')){
                    return 'composer'
                }
                return 'user'
            }
        }
    }
</script>

<style scoped>
    .admin{
        color: #d40505;
    }
    .composer{
        color:#12ADDE
    }
    .user{
        display: none;
    }
</style>