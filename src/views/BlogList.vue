<script setup lang="ts">
import { useFetch, useDateFormat } from '@vueuse/core'
import { ElMessage } from 'element-plus'
defineOptions({ name: 'BlogList' })

interface Post {
  id: string
  author: string
  title: string
  content: string
  createtime: number
}

interface ApiResp {
  errno: number
  data?: Post[]
  message?: string
}

const keyword = ref('')
const author = ref('')
const url = computed(() => {
  if (keyword.value && author.value) {
    return `/api/blog/list?keyword=${keyword.value}&author=${author.value}`
  } else if (keyword.value) {
    return `/api/blog/list?keyword=${keyword.value}`
  } else if (author.value) {
    return `/api/blog/list?author=${author.value}`
  }
  return `/api/blog/list`
})
const { execute, data, isFetching } = useFetch(url, {
  immediate: false,
  updateDataOnError: true,
  onFetchError(ctx) {
    ElMessage.error(ctx.error.message || '加载失败')
    return ctx
  },
})
  .get()
  .json<ApiResp>()

const onSearch = () => {
  execute()
}

const formatDate = (timeStamp: string | number) => {
  return useDateFormat(timeStamp, 'YYYY-MM-DD HH:mm:ss').value
}

onMounted(() => {
  execute()
})
</script>

<template>
  <div class="p-4">
    <div class="flex justify-between mb-3">
      <div class="text-lg font-bold">
        博客列表
        <el-link href="/admin" target="_blank" :underline="false">
          进入管理后台
        </el-link>
      </div>
      <el-space>
        <el-input
          style="width: 200px"
          v-model="keyword"
          placeholder="按关键词搜索"
          clearable
          class="w-[320px]"
        />
        <el-input
          style="width: 200px"
          v-model="author"
          placeholder="按作者搜索"
          clearable
          class="w-[320px]"
        />
        <el-button type="primary" @click="onSearch">搜索</el-button>
      </el-space>
    </div>
    <div>
      <el-skeleton :loading="isFetching" animated :count="6">
        <template #template>
          <div class="p-4 border-b last:border-b-0">
            <el-skeleton-item variant="h3" />
            <el-skeleton-item variant="text" />
            <el-skeleton-item variant="text" />
            <el-skeleton-item variant="text" />
          </div>
        </template>
        <template #default>
          <el-empty
            v-if="!data || data?.data?.length === 0"
            description="暂无文章"
          />
          <div v-else class="bg-white border rounded divide-y">
            <div
              v-for="post in data?.data"
              :key="post.id"
              class="p-4 hover:bg-gray-50"
            >
              <RouterLink
                :to="{ name: 'blog-detail', params: { id: post.id } }"
                class="block"
              >
                <div
                  class="mb-1 font-semibold text-gray-800 hover:text-blue-600"
                >
                  {{ post.title }}
                </div>
                <div class="text-gray-600 mb-2">{{ post.content }}</div>
                <div class="text-gray-600 mb-2">{{ post.author }}</div>
                <div class="text-gray-400 text-xs">
                  {{ formatDate(post.createtime) }}
                </div>
              </RouterLink>
            </div>
          </div>
        </template>
      </el-skeleton>
    </div>
  </div>
</template>

<style scoped></style>
