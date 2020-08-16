/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const systemRouter = {
  path: '/system',
  component: Layout,
  redirect: '',
  name: 'System',
  meta: {
    title: '系统模块',
    icon: 'system'
  },
  children: [
    // {
    //   path: 'system-commonParameter',
    //   component: () => import('@/views/system/commonParameter/index'),
    //   name: 'CommonParameter',
    //   meta: { title: '公共参数配置' }
    // },
    {
      path: 'system-secretKeyList',
      component: () => import('@/views/system/secretkeylist/index'),
      name: 'secretKeyList',
      meta: { title: '秘钥列表' }
    },
    {
      path: 'system-configuration',
      component: () => import('@/views/system/configuration/index'),
      name: 'configuration',
      meta: { title: '第三方配置' }
    },
    {
      path: 'system-website',
      component: () => import('@/views/system/website/index'),
      name: 'website',
      meta: { title: '网站设置' }
    }
  ]
}
export default systemRouter
