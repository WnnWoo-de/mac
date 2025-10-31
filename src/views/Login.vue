<template>
  <section class="container">
    <h2 v-reveal>登录</h2>
    <form class="form" @submit.prevent="onSubmit" v-reveal>
      <label>
        用户名
        <input v-model="username" type="text" placeholder="请输入用户名" required />
      </label>
      <label>
        密码
        <input v-model="password" type="password" placeholder="请输入密码" required />
      </label>
      <button class="btn" type="submit">登录</button>
      <p class="hint">没有账号？<router-link to="/register">去注册</router-link></p>
    </form>
  </section>
  </template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const username = ref('')
const password = ref('')

function onSubmit() {
  if (!username.value || !password.value) return
  auth.login({ username: username.value })
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/profile'
  router.push(redirect)
}
</script>

<style scoped>
.container { max-width: 480px; margin: 80px auto 40px; padding: 0 20px; }
h2 { font-size: 1.6rem; margin-bottom: 16px; }
.form { display: grid; gap: 12px; }
label { display: grid; gap: 6px; }
input { padding: 10px 12px; border: 1px solid #ddd; border-radius: 6px; }
.btn { padding: 10px 14px; border: none; border-radius: 6px; background: #6fcf97; color: #fff; cursor: pointer; }
.hint { color: #666; }
.hint a { color: #66a6ff; text-decoration: none; }
</style>