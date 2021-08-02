import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

const routes = [{
        path: "/login",
        name: "login",
        component: () =>
            import ("@/views/login/index.vue")
    },
    {
        path: "/",
        // name: "layout",//若父路由有默认子路由，那name没有它的意义
        component: () =>
            import ("@/views/layout/index.vue"),
        children: [{
                path: "", //默认子路由
                name: "home",
                component: () =>
                    import ("@/views/home/index.vue")
            },
            {
                path: "/qa",
                name: "qa",
                component: () =>
                    import ("@/views/qa/index.vue")
            },
            {
                path: "/video",
                name: "video",
                component: () =>
                    import ("@/views/video/index.vue")
            },
            {
                path: "/my",
                name: "my",
                component: () =>
                    import ("@/views/my/index.vue")
            }
        ]
    },
    {
        path: "/search",
        name: "search",
        component: () =>
            import ("@/views/search/index.vue")
    },
    {
        path: "/article/:articleId",
        name: "article",
        component: () =>
            import ("@/views/article/index.vue"),
        props: true //开启prps传参，说白了就是把路由参数映射到组件的props组件中
    },
    {
        path: "/user/profile",
        name: "user-profile",
        component: () =>
            import ("@/views/user-profile/index.vue")
    }
]

const router = new VueRouter({
    routes
})

export default router