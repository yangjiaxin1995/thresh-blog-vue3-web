import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const token = useLocalStorage('token', '')
  const userInfo = useLocalStorage<{
    username: string;
    realname: string
  } | null>('userInfo', null)

  const clearUserInfo = () => {
    token.value = ''
    userInfo.value = null
  }

  return { token, userInfo, clearUserInfo }
})
