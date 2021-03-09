import Layout from '@/layout'

const adminMethod = 
{
    path: '/admin',
    component: Layout,
    redirect: '',
    name: 'admin',
    meta: {
      title: '管理中心',
      icon: 'job'
    },
    children: [
        {
          path: '/adminList',
          component: () => import('@/views/admin/index'),
          name: 'adminList',
          meta: { title: '管理员列表' },
        },
        {
          path: '/role',
          component: () => import('@/views/admin/role'),
          name: 'role',
          meta: { title: '角色列表' },
        },
        {
          path: '/menu',
          component: () => import('@/views/menu/index'),
          name: 'menu',
          meta: { title: '菜单列表' },
        }
    ]
  }


export default adminMethod