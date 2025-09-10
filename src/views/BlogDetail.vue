<script setup lang="ts">
import { useFetch, useDateFormat } from '@vueuse/core'
import { ElMessage } from 'element-plus'
defineOptions({ name: 'BlogDetail' })

interface Post {
  id: string
  author: string
  title: string
  content: string
  createtime: number
}

interface ApiResp {
  errno: number
  data?: Post
  message?: string
}

const route = useRoute()
const router = useRouter()

const { execute, data, isFetching } = useFetch(
  `/api/blog/detail?id=${route.params.id}`,
  {
    immediate: false,
    updateDataOnError: true,
    onFetchError(ctx) {
      ElMessage.error(ctx.error.message || '加载失败')
      return ctx
    },
  },
)
  .get()
  .json<ApiResp>()

const goBack = () => {
  if (history.length > 1) router.back()
  else router.push({ name: 'blog-list' })
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
    <el-page-header @back="goBack" content="博客详情" />
    <el-card class="mt-2" shadow="never">
      <template #header>
        <div class="font-bold text-lg">
          <template v-if="isFetching">
            <el-skeleton :loading="isFetching" animated>
              <template #template>
                <el-skeleton-item variant="h3" />
              </template>
            </el-skeleton>
          </template>
          <template v-else>
            {{ data?.data?.title || '未找到文章' }}
          </template>
        </div>
      </template>
      <el-skeleton :loading="isFetching" animated>
        <template #template>
          <el-skeleton-item variant="text" />
          <el-skeleton-item variant="text" />
        </template>
        <template #default>
          <div v-if="data?.data">
            <div class="text-gray-400 mb-3">
              {{ data?.data.author }} 发布于
              {{ formatDate(data?.data.createtime) }}
            </div>
            <div class="leading-7 whitespace-pre-wrap">
              {{ data?.data.content }}
            </div>
          </div>
          <el-empty v-else description="该文章不存在或已删除" />
        </template>
      </el-skeleton>
    </el-card>
  </div>
</template>

<style scoped></style>
