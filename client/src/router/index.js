import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login.vue'
import Register from '../views/register.vue'
import Home from '../views/Home.vue'
import user from '../views/user.vue'
import Terms from '../views/Terms'


Vue.use(VueRouter)

const routes = [
  { path: '/', component: Home  },
  { path: '/user/:userId', name: 'user', component: user },
  { path: '/login',  component: Login },
  { path: '/register',  component: Register },
  { path: '/terms', name: 'terms', component: Terms},
  { path: '*',  component: Home }
]

const router = new VueRouter({
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


export default router