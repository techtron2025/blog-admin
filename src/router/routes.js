// 静态路由
export const staticRouter = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index.vue'),
        meta: {
            title: '登录',
            hidden: true,
        },
    },
    {
        path: '/forget',
        name: 'forget',
        component: () => import('@/views/forget/index.vue'),
        meta: {
            title: '忘记密码',
            hidden: true,
        },
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/404/index.vue'),
        meta: {
            title: '不存在的页面',
            hidden: true,
        },
    },
]

// 异步路由
export const asyncRouter = [
    {
        path: '/',
        name: 'layout',
        component: () => import('@/views/layout/index.vue'),
        redirect: '/article',
        meta: {
            title: '仪表盘',
            hidden: false,
            icon: 'House',
        },
        children: [
            {
                path: '/home',
                name: 'home',
                component: () => import('@/views/home/index.vue'),
                meta: {
                    title: '首页',
                    hidden: false,
                    icon: 'House',
                    path: '/home',
                },
            },
        ],
    },
    // {
    //     path: '/screen',
    //     name: 'screen',
    //     component: () => import('@/views/screen/index.vue'),
    //     meta: {
    //         title: '数据大屏',
    //         hidden: false,
    //         icon: 'Monitor',
    //         path: '/screen',
    //     },
    // },
    // {
    //     path: '/sys',
    //     name: 'sys',
    //     component: () => import('@/views/layout/index.vue'),
    //     meta: {
    //         title: '系统管理',
    //         hidden: false,
    //         icon: 'User',
    //         path: '/sys',
    //     },
    //     redirect: '/user',
    //     children: [
    //         {
    //             path: '/user',
    //             name: 'user',
    //             component: () => import('@/views/sys/user/index.vue'),
    //             meta: {
    //                 title: '用户列表',
    //                 hidden: false,
    //                 path: '/user',
    //             },
    //         },
    //         {
    //             path: '/user/add',
    //             name: 'userAdd',
    //             component: () => import('@/views/sys/user/add.vue'),
    //             meta: {
    //                 title: '新增用户',
    //                 hidden: true,
    //                 path: '/user',
    //             },
    //         },
    //         {
    //             path: '/user/edit',
    //             name: 'userEdit',
    //             component: () => import('@/views/sys/user/edit.vue'),
    //             meta: {
    //                 title: '编辑用户',
    //                 hidden: true,
    //                 path: '/user',
    //             },
    //         },
    //         {
    //             path: '/role',
    //             name: 'role',
    //             component: () => import('@/views/sys/role/index.vue'),
    //             meta: {
    //                 title: '角色列表',
    //                 hidden: false,
    //                 path: '/role',
    //             },
    //         },
    //         {
    //             path: '/role/add',
    //             name: 'roleAdd',
    //             component: () => import('@/views/sys/role/add.vue'),
    //             meta: {
    //                 title: '新增角色',
    //                 hidden: true,
    //                 path: '/role',
    //             },
    //         },
    //         {
    //             path: '/role/edit',
    //             name: 'roleEdit',
    //             component: () => import('@/views/sys/role/edit.vue'),
    //             meta: {
    //                 title: '编辑角色',
    //                 hidden: true,
    //                 path: '/role',
    //             },
    //         },
    //     ],
    // },
    {
        path: '/client',
        name: 'client',
        component: () => import('@/views/layout/index.vue'),
        meta: {
            title: '客户端管理',
            hidden: false,
            icon: 'Tickets',
            path: '/client',
        },
        redirect: '/article',
        children: [
            // {
            //     path: '/classify',
            //     name: 'classify',
            //     component: () => import('@/views/client/classify/index.vue'),
            //     meta: {
            //         title: '分类管理',
            //         hidden: false,
            //         path: '/classify',
            //     },
            // },
            // {
            //     path: '/label',
            //     name: 'label',
            //     component: () => import('@/views/client/label/index.vue'),
            //     meta: {
            //         title: '标签管理',
            //         hidden: false,
            //         path: '/label',
            //     },
            // },
            {
                path: '/acticle',
                name: 'acticle',
                component: () => import('@/views/client/article/index.vue'),
                meta: {
                    title: '博文管理',
                    hidden: false,
                    path: '/acticle',
                },
            },
            {
                path: '/acticle/add',
                name: 'acticle/add',
                component: () => import('@/views/client/article/add.vue'),
                meta: {
                    title: '新增博文',
                    hidden: true,
                    path: '/acticle',
                },
            },
            {
                path: '/acticle/edit',
                name: 'acticle/edit',
                component: () => import('@/views/client/article/edit.vue'),
                meta: {
                    title: '编辑博文',
                    hidden: true,
                    path: '/acticle',
                },
            },
            {
                path: '/acticle/detail',
                name: 'acticle/detail',
                component: () => import('@/views/client/article/detail.vue'),
                meta: {
                    title: '博文详情',
                    hidden: true,
                    path: '/acticle',
                },
            },
            // {
            //     path: '/album',
            //     name: 'album',
            //     component: () => import('@/views/client/album/index.vue'),
            //     meta: {
            //         title: '相册管理',
            //         hidden: false,
            //         path: '/album',
            //     },
            // },
            // {
            //     path: '/visitor',
            //     name: 'visitor',
            //     component: () => import('@/views/client/visitor/index.vue'),
            //     meta: {
            //         title: '访客管理',
            //         hidden: false,
            //         path: '/visitor',
            //     },
            // },
            // {
            //     path: '/message',
            //     name: 'message',
            //     component: () => import('@/views/client/message/index.vue'),
            //     meta: {
            //         title: '留言管理',
            //         hidden: false,
            //         path: '/message',
            //     },
            // },
            // {
            //     path: '/hole',
            //     name: 'hole',
            //     component: () => import('@/views/client/hole/index.vue'),
            //     meta: {
            //         title: '树洞管理',
            //         hidden: false,
            //         path: '/hole',
            //     },
            // },
            // {
            //     path: '/music',
            //     name: 'music',
            //     component: () => import('@/views/client/music/index.vue'),
            //     meta: {
            //         title: '音乐管理',
            //         hidden: false,
            //         path: '/music',
            //     },
            // },
            // {
            //     path: '/blogger',
            //     name: 'blogger',
            //     component: () => import('@/views/client/blogger/index.vue'),
            //     meta: {
            //         title: '博主管理',
            //         hidden: false,
            //         path: '/blogger',
            //     },
            // },
            // {
            //     path: '/setting',
            //     name: 'setting',
            //     component: () => import('@/views/client/setting/index.vue'),
            //     meta: {
            //         title: '系统管理',
            //         hidden: false,
            //         path: '/setting',
            //     },
            // },
        ],
    },
]

// 任意路由
export const anyRouter = [
    {
        path: '/:pathMatch(.*)*',
        redirect: '/404',
        name: 'any',
        meta: {
            title: '任意路由',
            hidden: true,
        },
    },
]
