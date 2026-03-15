<template>
  <div>
    <div class="term-win">
      <div class="term-win-header">
        <span class="dot dot-r"/><span class="dot dot-y"/><span class="dot dot-g"/>
        <span class="term-win-title">awaiting_final_transmission.sh</span>
      </div>
      <div class="term-win-body" style="text-align:center; padding: 40px 24px;">

        <p class="cmt" style="margin-bottom:24px">// Все уровни пройдены. Ключи собраны. Система ждёт.</p>

        <div class="lock-anim">🔐</div>
        <br>

        <p style="font-size:13px; color:var(--text-dim); margin-bottom:8px; letter-spacing:0.1em">
          ФИНАЛЬНАЯ ПЕРЕДАЧА ОТКРОЕТСЯ В
        </p>
        <p style="font-size:13px; color:var(--yellow); margin-bottom:24px; letter-spacing:0.15em">
          {{ targetDateStr }}
        </p>

        <div class="timer-display">{{ countdown }}</div>
        <p class="timer-label">ОСТАЛОСЬ ДО ОТКРЫТИЯ ФИНАЛА</p>
        <br>

        <div class="code-block" style="text-align:left; margin-top:24px">$ tail -f /var/log/mission/final.log

[{{ nowStr }}] Waiting for scheduled execution...
[INFO] All 5 keys validated ✓
[INFO] Entropy check passed ✓
[INFO] Signature chain verified ✓
[WAIT] Final payload locked until: <span class="val">{{ targetDateStr }}</span>
<span class="cursor"/> </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({ targetDate: Date })
const emit = defineEmits(['unlocked'])

const now = ref(new Date())
let timer = null

const targetDateStr = computed(() => {
  return props.targetDate.toLocaleString('ru-RU', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
})

const nowStr = computed(() => now.value.toLocaleTimeString('ru-RU'))

const countdown = computed(() => {
  const diff = props.targetDate - now.value
  if (diff <= 0) return '00:00:00'
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
})

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date()
    if (now.value >= props.targetDate) {
      clearInterval(timer)
      emit('unlocked')
    }
  }, 1000)
})

onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.lock-anim {
  font-size: 64px;
  animation: float 3s ease-in-out infinite;
  display: inline-block;
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>
