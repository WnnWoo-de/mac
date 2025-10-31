<template>
  <section class="container">
    <h2 v-reveal>成就</h2>
    <p class="desc" v-reveal>参与环保行动、积累积分，解锁你的绿色成就。</p>
    <div class="grid">
      <article v-for="a in achievements.all" :key="a.id" class="card" v-reveal>
        <h3 class="title">{{ a.name }}</h3>
        <p class="muted">{{ a.desc }}</p>
        <p v-if="has(a.id)" class="ok">已解锁｜{{ awardTime(a.id) }}</p>
        <p v-else class="muted">未解锁</p>
      </article>
    </div>

    <div class="card" v-reveal>
      <h3 class="title">成就体系说明</h3>
      <p class="desc">参与打卡、报名活动与兑换商品将逐步解锁成就，激励持续的绿色行动。</p>
      <p class="desc">提示：达成里程碑积分后会自动授予对应成就，并在个人中心展示解锁时间。</p>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useAchievementsStore } from '@/stores/achievements'
import { useAuthStore } from '@/stores/auth'

const achievements = useAchievementsStore()
const auth = useAuthStore()

const username = computed(() => auth.user?.username ?? '')
const myAwards = computed(() => achievements.userAwards(username.value))

function has(id) {
  return myAwards.value.some(a => a.id === id)
}

function awardTime(id) {
  const item = myAwards.value.find(a => a.id === id)
  return item ? formatTime(item.at) : ''
}

function formatTime(ts) {
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${day} ${hh}:${mm}`
}
</script>

<style scoped>
.container { max-width: 960px; margin: 80px auto 40px; padding: 0 20px; }
h2 { font-size: 1.6rem; margin-bottom: 8px; }
.desc { color: #666; margin-bottom: 16px; }
.grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
.card { 
  border: 1px solid rgba(238, 238, 238, 0.5); 
  border-radius: 8px; 
  padding: 16px; 
  display: grid; 
  gap: 8px; 
  background: transparent;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: rgba(102, 166, 255, 0.3);
}
.title { margin: 0; font-size: 1.1rem; }
.muted { color: #666; }
.ok { color: #2e7d32; }
</style>