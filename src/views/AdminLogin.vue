<template>
  <div
    class="min-h-screen flex items-center justify-center bg-[var(--el-bg-color-page)]"
  >
    <el-card class="w-[360px]">
      <template #header>
        <div class="text-center font-semibold">后台登录</div>
      </template>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="0">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名" autofocus />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            show-password
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

<script setup lang="ts">
defineOptions({ name: 'AdminLogin' })

import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const route = useRoute()

const formRef = ref<FormInstance>()
const submitting = ref(false)
const form = reactive({ username: '', password: '' })

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

function fakeLogin(): Promise<string> {
  return new Promise((resolve) => setTimeout(() => resolve('mock-token'), 500))
}

async function onSubmit() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      const token = await fakeLogin()
      localStorage.setItem('token', token)
      const redirect = (route.query.redirect as string) || '/admin/posts'
      router.replace(redirect)
    } finally {
      submitting.value = false
    }
  })
}
</script>

<style scoped></style>
