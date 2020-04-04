import Vue from "vue";
import VueRouter from "vue-router";
import firebase from 'firebase'

import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  { path: '*', redirect: '/' },
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/channel",
    name: "channel",
    component: () => import('../views/Channel'),
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Login.vue")
  },
  {
    path: "/logout",
    name: "Logout",
    component: () =>
      import('../views/Logout')
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  // const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  const currentUser = firebase.auth().currentUser
  console.log(currentUser)
  if(currentUser) localStorage.setItem('uid', currentUser.uid)
  if (to.name !== 'Login' && !currentUser) {
    next('/login')
  } else if (to.name !== 'Login' && currentUser) {
    next()
  } else {
    next()
  }
})

export default router;
