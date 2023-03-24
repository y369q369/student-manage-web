import { RouteRecordRaw, createRouter, createWebHashHistory, createWebHistory } from "vue-router"

const Layout = () => import("@/layout/index.vue")

/** 常驻路由 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layout,
    meta: {
      hidden: true
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue")
      }
    ]
  },
  {
    path: "/403",
    component: () => import("@/views/error-page/403.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: {
      hidden: true
    },
    alias: "/:pathMatch(.*)*"
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/",
    component: Layout,
    redirect: "/info",
    children: [
      {
        path: "info",
        component: () => import("@/views/info/index.vue"),
        name: "Info",
        meta: {
          title: "信息",
          svgIcon: "info",
          affix: true
        }
      }
    ]
  },
  {
    path: "/workCompletion",
    component: Layout,
    redirect: "/workCompletion/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/work-completion/index.vue"),
        name: "WorkCompletion",
        meta: {
          title: "作业",
          svgIcon: "work-completion"
        }
      }
    ]
  },
  {
    path: "/examinationResult",
    component: Layout,
    redirect: "/examinationResult/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/examination-result/index.vue"),
        name: "ExaminationResult",
        meta: {
          title: "考试",
          svgIcon: "examination-result"
        }
      }
    ]
  }
]

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: "/user",
    component: Layout,
    redirect: "/user/index",
    meta: {
      roles: ["admin", "editor"]
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/user/index.vue"),
        name: "work",
        meta: {
          title: "用户",
          svgIcon: "user",
          }
      }
    ]
  },
  {
    path: "/class",
    component: Layout,
    redirect: "/class/index",
    meta: {
      roles: ["admin", "editor"]
    },
    children: [
      {
        path: "index",
        component: () => import("@/views/class/index.vue"),
        name: "class",
        meta: {
          title: "班级",
          svgIcon: "class",
        }
      }
    ]
  },
  {
    path: "/:pathMatch(.*)*", // Must put the 'ErrorPage' route at the end, 必须将 'ErrorPage' 路由放在最后
    redirect: "/404",
    name: "ErrorPage",
    meta: {
      hidden: true
    }
  }
]

const router = createRouter({
  history:
    import.meta.env.VITE_ROUTER_HISTORY === "hash"
      ? createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH)
      : createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: constantRoutes
})

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch (error) {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}

export default router
