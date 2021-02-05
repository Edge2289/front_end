/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const blogMethod =
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
          path: 'banner',
          component: () => import('@/views/blogService/common/banner/index'),
          name: 'banner',
          meta: { title: '首页导航图', icon: 'list' }
        },
        {
          path: 'link',
          component: () => import('@/views/blogService/common/link/index'),
          name: 'link',
          meta: { title: '友情链接', icon: 'list' }
        },
        {
          path: 'basicInfo',
          component: () => import('@/views/blogService/common/basicInfo/index'),
          name: 'XiongZhangSeo',
          meta: { title: '博客站点配置', icon: 'list' }
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
}

export default blogMethod
