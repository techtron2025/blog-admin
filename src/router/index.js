import {createRouter, createWebHistory, createWebHashHistory} from 'vue-router'
import {staticRouter, asyncRouter, anyRouter} from './routes'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [...staticRouter, ...asyncRouter, ...anyRouter],
    //滚动行为
    scrollBehavior() {
        return {
            left: 0,
            top: 0,
        }
    },
})

router.afterEach((to, from) => {
    document.title = to.meta.title
})

export default router
