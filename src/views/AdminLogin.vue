<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
defineOptions({ name: 'AdminLogin' })

interface ApiResp {
  errno: number
  data?: {
    username: string
    realname: string
  }
  message?: string
}

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formRef = ref<FormInstance>()
const submitting = ref(false)
const form = reactive({ username: '', password: '' })

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const login = (params: {
  username: string
  password: string
}): Promise<Response> => {
  return fetch('/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })
}

const onSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      const res = await login({
        username: form.username,
        password: form.password,
      })
      const data = (await res.json()) as ApiResp
      if (data.errno === 0) {
        userStore.token = `${new Date().getTime()}`
        userStore.userInfo = data.data ?? null
        const redirect = (route.query.redirect as string) || '/admin/posts'
        router.push(redirect)
      } else {
        ElMessage.error(data.message)
      }
    } catch (error) {
      ElMessage.error(error instanceof Error ? error.message : '登录失败')
    } finally {
      submitting.value = false
    }
  })
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-[var(--el-bg-color-page)]"
  >
    <el-card class="w-[360px]">
      <template #header>
        <div class="text-center font-semibold">后台登录</div>
      </template>
      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        label-width="0"
        @submit.prevent="onSubmit"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="用户名"
            autofocus
            @keyup.enter="onSubmit"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            show-password
            @keyup.enter="onSubmit"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="submitting"
            @click="onSubmit"
            class="w-full"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped></style>
