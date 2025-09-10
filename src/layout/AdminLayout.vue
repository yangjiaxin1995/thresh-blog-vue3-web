<template>
  <el-container class="h-screen">
    <el-aside
      style="width: 200px"
      class="border-r border-[var(--el-border-color)]"
    >
      <div
        class="h-14 flex items-center justify-center font-semibold text-[var(--el-text-color-primary)]"
      >
        <span>后台管理</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        router
        unique-opened
        class="h-[calc(100vh-56px)] border-r-0"
      >
        <el-menu-item index="/admin/posts">
          <el-icon><Document /></el-icon>
          <span>文章管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/settings">
          <el-icon><Setting /></el-icon>
          <span>设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header
        class="flex items-center gap-2 border-b border-[var(--el-border-color)]"
      >
        <el-breadcrumb class="ml-2" separator="/">
          <el-breadcrumb-item :to="{ path: '/admin/posts' }">
            后台
          </el-breadcrumb-item>
          <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
            <RouterLink
              v-if="item.to && index < breadcrumbs.length - 1"
              :to="item.to"
            >
              {{ item.title }}
            </RouterLink>
            <span v-else>{{ item.title }}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="flex-1" />
        <RouterLink to="/" class="text-[var(--el-color-primary)]">
          返回博客列表
        </RouterLink>
      </el-header>

      <el-main class="bg-[var(--el-bg-color-page)]">
        <RouterView />
      </el-main>

      <el-footer class="flex items-center justify-center">
        <div class="text-[var(--el-text-color-secondary)]">
          © 2025 Thresh Blog
        </div>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { Document, Setting } from '@element-plus/icons-vue'
import type { RouteRecordName } from 'vue-router'

defineOptions({ name: 'AdminLayout' })

const route = useRoute()

const activeMenu = computed(() =>
  route.path.startsWith('/admin') ? route.path : '/admin/posts',
)

interface Breadcrumb {
  title: string
  to?: { name: RouteRecordName }
}

const breadcrumbs = computed<Breadcrumb[]>(() => {
  return route.matched
    .map((r) => {
      const rawTitle =
        r.meta && 'title' in r.meta
          ? (r.meta as Record<string, unknown>).title
          : undefined
      const title = typeof rawTitle === 'string' ? rawTitle : ''
      const name = r.name as RouteRecordName | undefined
      return name ? { title, to: { name } } : { title }
    })
    .filter((c) => Boolean(c.title))
})
</script>

<style scoped></style>
