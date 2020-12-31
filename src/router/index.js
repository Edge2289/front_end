import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import systemRouter from './modules/system'
// import logMethod from './modules/logMethod'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

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
    redirect: '/dashboard',
    meta: {
      title: 'Dashboard',
      icon: 'dashboard'
    },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '分析页', icon: 'druid', affix: true }
      },
      {
        path: 'monitor',
        component: () => import('@/views/dashboard/monitor'),
        name: 'Monitor',
        meta: { title: '监控页', icon: 'international' }
      },
      {
        path: 'workplace',
        component: () => import('@/views/dashboard/workplace'),
        name: 'Workplace',
        meta: { title: '工作台', icon: 'people' }
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

  {
    path: '/blogService',
    component: Layout,
    redirect: '',
    name: 'blog',
    meta: {
      title: '博客内容',
      icon: 'job'
    },
    children: [
      {
        path: '/common',
        component: () => import('@/views/blogService/common/index'),
        name: 'BlogSeo',
        redirect: '/blogService/common/index',
        meta: { title: '基础信息' },
        children: [
          {
            path: 'homeTab',
            component: () => import('@/views/blogService/common/navList/index'),
            name: 'BaiduSeo',
            meta: { title: '首页标签', icon: 'list' }
          },
          {
            path: 'basicInfo',
            component: () => import('@/views/blogService/common/basicInfo/index'),
            name: 'XiongZhangSeo',
            meta: { title: '基础信息', icon: 'list' }
          }
        ]
      },
      {
        path: '/subject',
        component: () => import('@/views/blogService/subject/index'),
        name: 'BlogSeo',
        redirect: '/blogService/subject/index',
        meta: { title: '主体信息' },
        children: [
          {
            path: 'tabList',
            component: () => import('@/views/blogService/subject/tabList/index'),
            name: 'tabList',
            meta: { title: '文章标签', icon: 'tab' }
          },
          {
            path: 'category',
            component: () => import('@/views/blogService/subject/cateList/index'),
            name: 'ArticleCategory',
            meta: { title: '文章分类', icon: 'time-range' }
          },
          {
            path: 'articleEdit',
            component: () => import('@/views/blogService/subject/articleEdit/index'),
            hidden: true,
            name: 'CreateArticle',
            meta: { title: '文章编辑', icon: 'edit' }
          },
          {
            path: 'articleList',
            component: () => import('@/views/blogService/subject/articleList/index'),
            name: 'ArticleList',
            meta: { title: '文章列表', icon: 'list' }
          }
        ]
      }
    ]
  },
  {
    path: '/seo',
    component: Layout,
    redirect: '',
    name: 'SEO',
    meta: {
      title: 'SEO',
      icon: 'nested'
    },
    children: [
      {
        path: '/blog_seo',
        component: () => import('@/views/seo/blog_seo/index'),
        name: 'BlogSeo',
        redirect: '/seo/blog_seo/index',
        meta: { title: '博客SEO' },
        children: [
          {
            path: 'baidu_seo',
            component: () => import('@/views/seo/blog_seo/baidu_seo/index'),
            name: 'BaiduSeo',
            meta: { title: '百度SEO', icon: 'list' }
          },
          {
            path: 'xiongzhang_seo',
            component: () => import('@/views/seo/blog_seo/xiongzhang_seo/index'),
            name: 'XiongZhangSeo',
            meta: { title: '熊掌SEO', icon: 'list' }
          }
        ]
      }
    ]
  },
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
