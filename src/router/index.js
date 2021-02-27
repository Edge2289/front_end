import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import systemRouter from './modules/system'
// import logMethod from './modules/logMethod'
import blogMethod from './modules/blogMethod'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Layout,
    redirect: '/workplace',
    meta: {
      title: 'Dashboard',
      icon: 'dashboard'
    },
    children: [
      {
        path: 'workplace',
        component: () => import('@/views/dashboard/workplace'),
        name: 'Workplace',
        meta: { title: '工作台', icon: 'people', affix: true }
      },
      {
        path: 'analysis',
        component: () => import('@/views/dashboard/index'),
        name: 'Analysis',
        meta: { title: '分析页', icon: 'druid' }
      },
      {
        path: 'monitor',
        component: () => import('@/views/dashboard/monitor'),
        name: 'Monitor',
        meta: { title: '监控页', icon: 'international' }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/icon',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index'),
        name: 'Icons',
        meta: { title: 'Icons', icon: 'icon', noCache: true }
      }
    ]
  },
  /** 博客的模块路由 */
  blogMethod,

  // {
  //   path: '/blogService',
  //   component: Layout,
  //   redirect: '',
  //   name: 'blog',
  //   meta: {
  //     title: '博客内容',
  //     icon: 'job'
  //   },
  //   children: [
  //     {
  //       path: '/common',
  //       component: () => import('@/views/blogService/common/index'),
  //       name: 'BlogSeo',
  //       redirect: '/blogService/common/index',
  //       meta: { title: '基础信息' },
  //       children: [
  //         {
  //           path: 'homeTab',
  //           component: () => import('@/views/blogService/common/navList/index'),
  //           name: 'BaiduSeo',
  //           meta: { title: '首页标签', icon: 'list' }
  //         },
  //         {
  //           path: 'basicInfo',
  //           component: () => import('@/views/blogService/common/basicInfo/index'),
  //           name: 'XiongZhangSeo',
  //           meta: { title: '基础信息', icon: 'list' }
  //         }
  //       ]
  //     },
  //     {
  //       path: '/subject',
  //       component: () => import('@/views/blogService/subject/index'),
  //       name: 'BlogSeo',
  //       redirect: '/blogService/subject/index',
  //       meta: { title: '主体信息' },
  //       children: [
  //         {
  //           path: 'tabList',
  //           component: () => import('@/views/blogService/subject/tabList/index'),
  //           name: 'tabList',
  //           meta: { title: '文章标签', icon: 'tab' }
  //         },
  //         {
  //           path: 'category',
  //           component: () => import('@/views/blogService/subject/cateList/index'),
  //           name: 'ArticleCategory',
  //           meta: { title: '文章分类', icon: 'time-range' }
  //         },
  //         {
  //           path: 'articleEdit',
  //           component: () => import('@/views/blogService/subject/articleEdit/index'),
  //           hidden: true,
  //           name: 'CreateArticle',
  //           meta: { title: '文章编辑', icon: 'edit' }
  //         },
  //         {
  //           path: 'articleList',
  //           component: () => import('@/views/blogService/subject/articleList/index'),
  //           name: 'ArticleList',
  //           meta: { title: '文章列表', icon: 'list' }
  //         }
  //       ]
  //     }
  //   ]
  // },
  // 日志列表 ---START
  // logMethod,
  // 日志列表 ---END
  {
    path: '/server',
    component: Layout,
    redirect: '',
    name: 'Server',
    meta: {
      title: '系统监控',
      icon: 'server'
    },
    children: [
      {
        path: 'monitor',
        component: () => import('@/views/server/monitor/index'),
        name: 'monitor',
        meta: { title: '服务监控', icon: 'server' }
      },
      {
        path: 'apimonitor',
        component: () => import('@/views/server/monitor/index'),
        name: 'apimonitor',
        meta: { title: 'api监控', icon: 'server' }
      }
    ]
  },
  /** 系统模块 **/
  systemRouter,

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
