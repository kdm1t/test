import axios from "axios";

export default({
    actions:{

        async loadLast(ctx, payload){
            try{
                ctx.commit("setReady", false)
                if(!this.state.currentPlaylist){
                    if(!payload){
                        return false
                    }
                }
                ctx.commit("setPlaylist", payload)
                const res = await axios.get("http://musicamp.std-263.ist.mospolytech.ru/music/getUserTracks", { params: {id:  payload}})
                ctx.commit("addQueue", res.data)
                ctx.commit("setReady", true)
                return true
            }catch (e) {
                console.log(e)
                ctx.commit("setPlaylist", '')
                return false
            }
        }
    },
    state: {
        songs:[],
        ready : false,
        currentPlaylist : "",
        currentIndex : 0,
        currentTime : 0,
        isPlaying: false,
        history : []
    },
    mutations: {
        addToHistory(state, index){
            if (state.history[state.history.length - 1] === index){
                return
            }

            state.history.push(index)

            if(state.history.length > 3){
                state.history.splice(0, 1)
            }

            localStorage.setItem('history', JSON.stringify(state.history));
        },
        addHistory(state, tracks){
            state.history = tracks
        },
        addQueue(state, tracks){
            state.songs = tracks
        },
        setReady(state, ready){
            state.ready = ready
        },
        setPlaylist(state, playlist){
            state.currentPlaylist = playlist
            localStorage.lastAlbum = playlist
        },
        setIndex(state, index){
            state.currentIndex = Number(index)
            localStorage.musicIndex = Number(index)
        },
        setTime(state, time){
            state.currentTime = time
            localStorage.musicTime = time
        },
        setPlaying(state, play){
            state.isPlaying = play
        }
    },
    getters: {
        getCurrentTrack(state){
            if(state.songs.length > 0){
                return state.songs[state.currentIndex]
            }
            return false
        },
        getLengthQueue(state){
            return state.songs.length
        },
        getReady(state){
            return state.ready
        },
        getAllTracks(state){
            return state.songs
        },
        getСurrentPlaylist(state){
            return state.currentPlaylist
        },
        index(state){
            return state.currentIndex
        },
        currentTime(state){
            return state.currentTime
        },
        isPlaying(state){
            return state.isPlaying
        },
        getHistory(state){
            return state.history
        }
    }
})