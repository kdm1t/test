import axios from "axios";
import router from '../../router'

export default({
    actions:{

        async mounted(ctx){
            try{
                const res = await axios.get('http://musicamp.std-263.ist.mospolytech.ru/auth/user', {headers:{ authorization : 'Bearer ' + localStorage.getItem('token')}})
                ctx.commit("updateUser", res.data.user)
                ctx.dispatch("created")
            }catch (e) {
                localStorage.clear()
            }
        },

        created(ctx){
            if (localStorage.getItem('token')){
                ctx.commit("updateAuth", true)
            }else{
                ctx.commit("updateAuth", false)
            }
        },

        logout(ctx){
            localStorage.clear()
            ctx.commit("updateAuth", false)
            ctx.commit("updateUser", {})
            ctx.dispatch("created")
            router.go("/")
        },

    },
    state: {
        auth:false,
        user:{},
        posts:[]
    },
    mutations: {
        updateUser(state, user){
            state.user = user
        },
        updateAuth(state, auth){
            state.auth = auth
        },
        updatePosts(state, posts){
            state.posts = posts
        }
    },
    getters: {
        getUser(state){
            return state.user
        }
    }
})