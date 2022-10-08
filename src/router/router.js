import { createMemoryHistory, createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: {
            title: 'Zoom Native Room Controls Preview',
        },
    },
    {
        path: '/about',
        name: 'about',
        component: AboutView,
        meta: {
            title: 'ZNRCP | About',
        },
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

router.beforeEach((toRoute, fromRoute, next) => {
    window.document.title =
        toRoute.meta && toRoute.meta.title ? toRoute.meta.title : 'Zoom Native Room Controls Preview';

    next();
});

export default router;
