<template>
  <div class="p-4">
    <div class="flex gap-3 justify-between mb-3">
      <el-button type="primary" @click="openEdit()">新建文章</el-button>
      <el-input
        v-model="keyword"
        placeholder="搜索标题"
        clearable
        class="w-[280px]"
      />
    </div>
    <el-table :data="filtered" border>
      <el-table-column prop="title" label="标题" min-width="240" />
      <el-table-column prop="createdAt" label="创建时间" width="140" />
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button size="small" @click="openEdit(row)">编辑</el-button>
          <el-popconfirm title="确定删除该文章吗？" @confirm="onDelete(row.id)">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
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
      <el-form :model="form" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="摘要">
          <el-input v-model="form.excerpt" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="form.content" type="textarea" :rows="8" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'AdminPosts' })

type Post = {
  id: string
  title: string
  excerpt: string
  content: string
  createdAt: string
}
const rows = ref<Post[]>([
  {
    id: '1',
    title: 'Vue 3 组件通信最佳实践',
    excerpt: '父子、跨层级通信...',
    content: '正文...',
    createdAt: '2025-01-01',
  },
  {
    id: '2',
    title: 'Pinia 状态管理入门',
    excerpt: '核心用法与心智模型...',
    content: '正文...',
    createdAt: '2025-01-05',
  },
])

const keyword = ref('')
const filtered = computed(() => {
  const k = keyword.value.trim().toLowerCase()
  if (!k) return rows.value
  return rows.value.filter((p) => p.title.toLowerCase().includes(k))
})

const dialogVisible = ref(false)
const editing = ref(false)
const form = reactive<Post>({
  id: '',
  title: '',
  excerpt: '',
  content: '',
  createdAt: '',
})

function openEdit(row?: Post) {
  if (row) {
    Object.assign(form, row)
    editing.value = true
  } else {
    Object.assign(form, {
      id: '',
      title: '',
      excerpt: '',
      content: '',
      createdAt: new Date().toISOString().slice(0, 10),
    })
    editing.value = false
  }
  dialogVisible.value = true
}

function onSave() {
  if (editing.value) {
    const idx = rows.value.findIndex((x) => x.id === form.id)
    if (idx !== -1) rows.value[idx] = { ...form }
  } else {
    const newId = String(
      Math.max(0, ...rows.value.map((x) => Number(x.id))) + 1,
    )
    rows.value.unshift({ ...form, id: newId })
  }
  dialogVisible.value = false
}

function onDelete(id: string) {
  rows.value = rows.value.filter((x) => x.id !== id)
}
</script>

<style scoped></style>
