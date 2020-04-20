import Vue from 'vue';
import App from './app.vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';

Vue.use(VueRouter);
Vue.use(Vuex);

const Routers = [
    {
        name: 'details',
        path: '/details/:id',
        component: (resolve) => require(['./views/details.vue'], resolve)
    },
    {
        path: '/index',
        component: (resolve) => require(['./views/index.vue'], resolve)
    },
    {
        path: '*',
        redirect: '/index'
    }
];
const RouterConfig = {
    mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);



new Vue({
    el: '#app',
    router: router,
    render: h => {
        return h(App)
    }
});



