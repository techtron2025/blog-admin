//路由鉴权:鉴权,项目当中路由能不能被的权限的设置(某一个路由什么条件下可以访问、什么条件下不可以访问)
import router from '@/router'

import nprogress from 'nprogress'
//引入进度条样式
import 'nprogress/nprogress.css'
nprogress.configure({showSpinner: false})

//获取用户相关的小仓库内部token数据,去判断用户是否登录成功
import useUserStore from '@/stores/modules/user'

//全局前置守卫
router.beforeEach(async (to, from, next) => {
    nprogress.start()
    const userStore = useUserStore()
    try {
        //获取用户信息
        await userStore.getUserInfo()
        //放行
        //万一:刷新的时候是异步路由,有可能获取到用户信息、异步路由还没有加载完毕,出现空白的效果
        next()
    } catch (error) {
        //token过期:获取不到用户信息了
        //用户手动修改本地存储token
        //退出登录->用户相关的数据清空
        next({path: '/login'})
    }
    //获取token,去判断用户登录、还是未登录
    // let token = userStore.token
    // let username = userStore.userInfo.username

    //用户登录判断
    // if (token) {
    //     //登录成功
    //     if (to.path == '/login') {
    //         userStore.logout()
    //         next()
    //     } else {
    //         //有用户信息
    //         if (username) {
    //             //放行
    //             next()
    //         } else {
    //             //如果没有用户信息,在守卫这里发请求获取到了用户信息再放行
    //             try {
    //                 //获取用户信息
    //                 await userStore.getUserInfo()
    //                 //放行
    //                 //万一:刷新的时候是异步路由,有可能获取到用户信息、异步路由还没有加载完毕,出现空白的效果
    //                 next({...to})
    //             } catch (error) {
    //                 //token过期:获取不到用户信息了
    //                 //用户手动修改本地存储token
    //                 //退出登录->用户相关的数据清空
    //                 next({path: '/login'})
    //             }
    //         }
    //     }
    // } else {
    //     let white = ['/login', '/forget']
    //     //用户未登录判断
    //     if (white.includes(to.path)) {
    //         next()
    //     } else {
    //         //默认根路径进来，没有token时，去登录页面
    //         next({path: '/login'})
    //     }
    // }
})
//全局后置守卫
router.afterEach((to, from) => {
    nprogress.done()
})
