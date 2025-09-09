import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: { name: 'blog-list' } },

    // 博客前台
    {
      path: '/blog',
      name: 'blog-list',
      component: () => import('@/views/BlogList.vue'),
      meta: { title: '博客' },
    },
    {
      path: '/blog/:id',
      name: 'blog-detail',
      component: () => import('@/views/BlogDetail.vue'),
      meta: { title: '文章详情' },
    },

    // 后台登录
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/AdminLogin.vue'),
      meta: { title: '登录' },
    },

    // 后台管理
    {
      path: '/admin',
      component: () => import('@/layout/AdminLayout.vue'),
      redirect: '/admin/posts',
      children: [
        {
          path: 'posts',
          name: 'admin-posts',
          component: () => import('@/views/AdminPosts.vue'),
          meta: { title: '文章管理', requiresAuth: true },
        },
        {
          path: 'settings',
          name: 'admin-settings',
          component: () => import('@/views/AdminSettings.vue'),
          meta: { title: '设置', requiresAuth: true },
        },
        // 可在此追加更多后台子路由
      ],
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const requiresAuth = to.matched.some(
    (r) => r.meta && (r.meta as Record<string, unknown>).requiresAuth,
  )
  const isAdminArea = to.path.startsWith('/admin')
  const token = localStorage.getItem('token')
  if ((requiresAuth || isAdminArea) && to.name !== 'admin-login' && !token) {
    next({ name: 'admin-login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
