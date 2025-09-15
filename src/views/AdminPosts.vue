<script setup lang="ts">
import { useFetch, useDateFormat } from '@vueuse/core'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
defineOptions({ name: 'AdminPosts' })

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
const router = useRouter()
const userStore = useUserStore()
const keyword = ref('')
const dialogVisible = ref(false)
const editing = ref(false)
const saving = ref(false)
const deleting = ref(false)
const formRef = ref<FormInstance>()
const form = reactive<Omit<Post, 'createtime'>>({
  id: '',
  title: '',
  content: '',
  author: userStore.userInfo?.username ?? '',
})
const url = computed(() => {
  if (keyword.value) {
    return `/api/blog/list?isadmin=1&keyword=${keyword.value}`
  }
  return `/api/blog/list?isadmin=1`
})

const rules: FormRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
}

const {
  execute: getList,
  data,
  isFetching,
} = useFetch(url, {
  immediate: false,
  afterFetch(ctx) {
    if (ctx.data.errno === -1) {
      ElMessage.error(ctx.data.message)
      router.push('/admin/login')
    }
    return ctx
  },
  updateDataOnError: true,
  onFetchError(ctx) {
    ElMessage.error(ctx.error.message || '加载失败')
    return ctx
  },
})
  .get()
  .json<ApiResp>()

const newPost = (params: {
  title: string
  content: string
}): Promise<Response> => {
  return fetch('/api/blog/new', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })
}

const updatePost = (params: {
  id: string
  title: string
  content: string
}): Promise<Response> => {
  return fetch(`/api/blog/update?id=${params.id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })
}

const deletePost = (id: string): Promise<Response> => {
  return fetch(`/api/blog/del?id=${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

const onSearch = () => {
  getList()
}

const handleEdit = (row?: Post) => {
  if (row) {
    form.id = row.id
    form.title = row.title
    form.content = row.content
    editing.value = true
  } else {
    editing.value = false
  }
  dialogVisible.value = true
}

const formatDate = (timeStamp: string | number) => {
  return useDateFormat(timeStamp, 'YYYY-MM-DD HH:mm:ss').value
}

const onDelete = async (id: string) => {
  deleting.value = true
  try {
    const res = await deletePost(id)
    const data = (await res.json()) as ApiResp
    if (data.errno === 0) {
      ElMessage.success('删除成功')
      getList()
    } else {
      ElMessage.error(data.message)
    }
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '删除失败')
  } finally {
    deleting.value = false
  }
}

const onSave = () => {
  if (!formRef.value) return
  formRef.value.validate(async (valid) => {
    if (!valid) return
    saving.value = true
    try {
      const res = await (editing.value ? updatePost(form) : newPost(form))
      const data = (await res.json()) as ApiResp
      if (data.errno === 0) {
        dialogVisible.value = false
        ElMessage.success('保存成功')
        getList()
      } else {
        ElMessage.error(data.message)
      }
    } catch (error) {
      ElMessage.error(error instanceof Error ? error.message : '保存失败')
    } finally {
      saving.value = false
      formRef.value?.resetFields()
    }
  })
}

onMounted(() => {
  getList()
})
</script>

<template>
  <div class="p-4">
    <div class="flex gap-3 mb-3">
      <el-button type="primary" @click="handleEdit()">新建文章</el-button>
      <el-input
        v-model="keyword"
        placeholder="按关键词搜索"
        clearable
        style="width: 280px"
        @keyup.enter="onSearch"
        @clear="onSearch"
      />
    </div>
    <el-table v-loading="isFetching" :data="data?.data" border>
      <el-table-column prop="title" label="标题" min-width="240" />
      <el-table-column
        prop="createtime"
        label="创建时间"
        width="240"
        :formatter="(row) => formatDate(row.createtime)"
      />
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-popconfirm
            width="200"
            title="确定删除该文章吗？"
            @confirm="onDelete(row.id)"
          >
            <template #reference>
              <el-button size="small" type="danger" :loading="deleting">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogVisible"
      :title="editing ? '编辑文章' : '新建文章'"
      width="640px"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        label-width="80px"
        @submit.prevent="onSave"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="8" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="onSave">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped></style>
