<template>
  <!-- Hero -->

  <section class="hero">
    <div class="container hero-inner">
      <div class="hero-content">
        <h1 class="brand animate-in">绿我同行 GreenSight AI</h1>
        <div class="typewriter-container animate-in delay-1">
          <TextType 
            :text="['让环保成为一种生活习惯', '用AI识别垃圾分类', '参与绿色公益活动', '兑换环保好物奖励']" 
            :typingSpeed="75" 
            :pauseDuration="2000" 
            :showCursor="true" 
            cursorCharacter="|"
            :textColors="['#ffffff', '#e8f5e8', '#f0f8ff', '#f5f5dc']"
            className="typewriter-text"
            :loop="true"
          />
        </div>
        <div class="cta animate-in delay-2">
          <router-link to="/checkin" class="btn btn-primary">每日打卡</router-link>
          <router-link to="/activity" class="btn">参与活动</router-link>
          <router-link to="/store" class="btn btn-outline">积分商城</router-link>
        </div>
        <p v-if="auth.isLoggedIn" class="muted animate-in delay-3">
          欢迎，{{ auth.user?.username }}｜当前积分：{{ auth.points }}
          <span v-if="checkedToday" class="ok">｜今日已打卡</span>
        </p>
      </div>
      <div class="hero-art">
        <img src="@/assets/images/logo.svg" alt="绿我同行 GreenSight" />
      </div>
    </div>
  </section>

  <!-- 功能一览 -->
  <section class="container">
    <h2>功能一览</h2>
    <div class="grid">
      <ImageCard class="reveal"
        img="@/assets/images/logo.svg"
        alt="AI 识别"
        title="AI 识别"
        subtitle="识别垃圾类型，学习环保知识。"
        link="/ai-recognition"
        linkText="前往体验"
        :revealOptions="{ duration: 0.6, distance: 10 }"
      />
      <ImageCard class="reveal"
        img="@/assets/images/logo.svg"
        alt="公益活动"
        title="公益活动"
        subtitle="报名本地环保活动，参与社区行动。"
        link="/activity"
        linkText="查看活动"
        :revealOptions="{ duration: 0.6, distance: 10, delay: 0.08 }"
      />
      <ImageCard class="reveal"
        img="@/assets/images/logo.svg"
        alt="积分商城"
        title="积分商城"
        subtitle="用绿色积分兑换环保好物。"
        link="/store"
        linkText="去兑换"
        :revealOptions="{ duration: 0.6, distance: 10, delay: 0.16 }"
      />
    </div>
  </section>

  <!-- 参与步骤 -->
  <section class="container">
    <h2>如何参与</h2>
    <ul class="steps">
      <li class="step reveal"><strong>1. 打卡</strong> 每日打卡，积累绿色积分。</li>
      <li class="step reveal"><strong>2. 参与</strong> 报名活动，实践环保行动。</li>
      <li class="step reveal"><strong>3. 兑换</strong> 用积分兑换环保商品。</li>
    </ul>
  </section>

  <!-- 最新活动 -->
  <section class="container">
    <div class="section-header">
      <h2>最新活动</h2>
      <router-link to="/activity" class="link">查看全部</router-link>
    </div>
    <div class="grid">
      <ImageCard
        v-for="a in latestActivities"
        :key="a.id"
        img="@/assets/images/logo.svg"
        :alt="a.title"
        :title="a.title"
        :subtitle="'时间：' + a.date"
        :meta="'地点：' + a.location"
        link="/activity"
        linkText="报名参加"
        :revealOptions="{ duration: 0.6, distance: 10 }"
      />
    </div>
  </section>

  <!-- 人气兑换 -->
  <section class="container">
    <div class="section-header">
      <h2>人气兑换</h2>
      <router-link to="/store" class="link">去商城</router-link>
    </div>
    <div class="grid">
      <ImageCard
        v-for="p in popularProducts"
        :key="p.id"
        img="@/assets/images/logo.svg"
        :alt="p.name"
        :title="p.name"
        :subtitle="p.desc || '环保商品'"
        :meta="'所需积分：' + p.price"
        link="/store"
        linkText="立即兑换"
        :revealOptions="{ duration: 0.6, distance: 10 }"
      />
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCheckinStore } from '@/stores/checkin'
import { useActivityStore } from '@/stores/activity'
import { useShopStore } from '@/stores/shop'
import ImageCard from '@/components/ui/ImageCard.vue'
import TextType from '@/components/ui/TextType.vue'

const auth = useAuthStore()
const checkin = useCheckinStore()
const activity = useActivityStore()
const shop = useShopStore()
const username = computed(() => auth.user?.username ?? '')
const checkedToday = computed(() => checkin.isChecked(username.value))

let io
onMounted(() => {
  try {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          io?.unobserve(e.target)
        }
      })
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })

    const els = Array.from(document.querySelectorAll('.reveal'))
    els.forEach((el, i) => {
      const delay = Math.min(i * 0.08, 0.24)
      el.style.transitionDelay = `${delay}s`
      io.observe(el)
    })
  } catch {}
})

onBeforeUnmount(() => { if (io) io.disconnect() })

function parseDate(str) {
  const [y, m, d] = (str || '').split('-').map(n => parseInt(n, 10))
  return new Date(y, (m || 1) - 1, d || 1)
}

const latestActivities = computed(() => {
  const today = new Date()
  const items = activity.activities.slice().sort((a, b) => parseDate(a.date) - parseDate(b.date))
  const upcoming = items.filter(a => parseDate(a.date) >= today)
  return (upcoming.length ? upcoming : items).slice(0, 3)
})

const popularProducts = computed(() => {
  const counts = new Map()
  const data = shop.redemptionsByUser || {}
  for (const k of Object.keys(data)) {
    (data[k] || []).forEach(id => counts.set(id, (counts.get(id) || 0) + 1))
  }
  const sorted = shop.products.slice().sort((a, b) => (counts.get(b.id) || 0) - (counts.get(a.id) || 0))
  return (sorted.length ? sorted : shop.products).slice(0, 3)
})
</script>

<style scoped>
 .hero {
  background: transparent;
  color: #fff;
  position: relative;
  overflow: visible;
 }
.hero-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 0;
}
.hero-content h1 { font-size: 2.2rem; margin: 0 0 8px; }
.subtitle { opacity: 0.95; margin-bottom: 16px; }
.typewriter-container { 
  min-height: 32px; 
  margin-bottom: 16px; 
  display: flex; 
  align-items: center; 
}
.typewriter-text { 
  font-size: 1.1rem; 
  opacity: 0.95; 
  font-weight: 400;
  text-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.cta { display: flex; gap: 10px; margin-bottom: 8px; }
.hero-art img { width: 120px; height: auto; opacity: 0.95; }

/* Hero 背景柔性动效与内容入场：移除遮挡，改为透明 */
.hero::before { content: none; }

.brand {
  letter-spacing: 0.5px;
  text-shadow: 0 2px 12px rgba(0,0,0,0.15);
}

.animate-in { opacity: 0; transform: translateY(10px); animation: fadeInUp .7s ease forwards; }
.delay-1 { animation-delay: .08s; }
.delay-2 { animation-delay: .16s; }
.delay-3 { animation-delay: .24s; }

@keyframes fadeInUp {
  to { opacity: 1; transform: translateY(0); }
}

.hero-art img { animation: float 9s ease-in-out infinite; }
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

/* 首页按钮风格（仅 hero 内可见） */
.btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 16px; border-radius: 10px; background: rgba(255,255,255,0.18); color: #fff; text-decoration: none; border: 1px solid rgba(255,255,255,0.25); backdrop-filter: blur(4px); transition: transform .2s ease, box-shadow .2s ease, background .2s ease; }
.btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.12); }
.btn:active { transform: translateY(0); box-shadow: none; }
.btn-primary { background: #66a6ff; border-color: rgba(255,255,255,0.35); }
.btn-primary:hover { background: #5b9af0; }
.btn-outline { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.35); }

@keyframes drift {
  0% { transform: translate(0,0) rotate(0deg); }
  50% { transform: translate(-3%, 2%) rotate(10deg); }
  100% { transform: translate(0,0) rotate(0deg); }
}

.container { max-width: 960px; margin: 80px auto 40px; padding: 0 20px; }
h2 { font-size: 1.6rem; margin-bottom: 12px; }
.grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
.feature .title { margin: 0; font-size: 1.1rem; }
.muted { color: #666; }
.steps { display: grid; gap: 10px; padding-left: 18px; }
.step { color: #333; }
.ok { color: #2e7d32; }
.section-header { display: flex; align-items: center; justify-content: space-between; }
.section-header .link { color: #66a6ff; text-decoration: none; }
/* Reveal animation */
.reveal { opacity: 0; transform: translateY(12px); transition: opacity 0.6s ease, transform 0.6s ease; }
.reveal.visible { opacity: 1; transform: translateY(0); }
.feature:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); transition: box-shadow 0.3s ease; }

/* 仅首页：让 ImageCard 框体透明，露出全局 LightRays 背景 */
:deep(.image-card) { 
  background: transparent !important; 
  border-color: rgba(255,255,255,0.28);
  box-shadow: none;
}
:deep(.image-card:hover) {
  box-shadow: 0 8px 16px rgba(0,0,0,0.10);
}
:deep(.image-card .media) { 
  background: transparent !important;
}
:deep(.image-card .title) { color: #fff; }
:deep(.image-card .subtitle),
:deep(.image-card .meta) { color: rgba(255,255,255,0.88); }
:deep(.image-card .card-link) { 
  color: #fff; 
  border-color: rgba(255,255,255,0.35);
}
:deep(.image-card .card-link:hover) { 
  background: rgba(255,255,255,0.12);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-inner { flex-direction: column; gap: 18px; text-align: center; }
  .hero-art img { width: 96px; }
  .cta { justify-content: center; flex-wrap: wrap; }
  .grid { grid-template-columns: 1fr; }
  .container { margin: 60px auto 32px; }
  .typewriter-container { justify-content: center; }
  .typewriter-text { font-size: 1rem; }
}

@media (max-width: 480px) {
  .hero-inner { padding: 40px 0; }
  .hero-content h1 { font-size: 1.8rem; }
  .grid { gap: 12px; }
  .typewriter-text { font-size: 0.9rem; }
  .typewriter-container { min-height: 28px; }
}

@media (prefers-reduced-motion: reduce) {
  .reveal { transition: none !important; opacity: 1; transform: none; }
  .animate-in { animation: none !important; opacity: 1; transform: none; }
  .hero::before { animation: none !important; }
  .hero-art img { animation: none !important; }
}
</style>