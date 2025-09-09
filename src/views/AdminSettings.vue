<template>
  <div class="p-2">
    <el-card shadow="never">
      <template #header>
        <div class="font-semibold">设置</div>
      </template>
      <el-form label-width="80px" class="max-w-[480px]">
        <el-form-item label="站点名称">
          <el-input v-model="siteName" placeholder="请输入站点名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'AdminSettings' })
const siteName = ref('Thresh Blog')
</script>

<style scoped></style>
