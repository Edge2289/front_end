// /** When your routing table is too long, you can split it into small modules **/

// import Layout from '@/layout'

// const logMethod = {
//   path: '/log',
//   component: Layout,
//   redirect: '',
//   name: 'Log',
//   meta: {
//     title: '日志列表',
//     icon: 'log'
//   },
//   children: [
//     {
//       path: 'login_log',
//       component: () => import('@/views/system/secretkeylist/index'),
//       name: 'LoginLog',
//       meta: { title: '登录日志' }
//     },
//     {
//       path: 'operation_log',
//       component: () => import('@/views/system/configuration/index'),
//       name: 'OperationLog',
//       meta: { title: '操作日志' }
//     }
//   ]
// }
// export default logMethod
