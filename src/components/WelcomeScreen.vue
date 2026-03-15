<template>
  <div class="stage">
    <div class="stage-inner">
      <div class="term-win">
        <div class="term-win-header">
          <span class="dot dot-r"/><span class="dot dot-y"/><span class="dot dot-g"/>
          <span class="term-win-title">SYSTEM_INIT — secure_boot.sh</span>
        </div>
        <div class="term-win-body">

          <div class="boot-lines">
            <p v-for="(l, i) in shown" :key="i" :class="l.cls" style="line-height:1.9; font-size:14px">
              {{ l.text }}
            </p>
            <span class="cursor" v-if="!done"/>
          </div>

          <transition name="reveal">
            <div v-if="done" class="welcome-content">
              <hr class="divider">
              <div class="welcome-ascii">
                <pre>
 ██████╗  ██████╗ ███╗   ███╗ █████╗ ███╗   ██╗
 ██╔══██╗██╔═══██╗████╗ ████║██╔══██╗████╗  ██║
 ██████╔╝██║   ██║██╔████╔██║███████║██╔██╗ ██║
 ██╔══██╗██║   ██║██║╚██╔╝██║██╔══██║██║╚██╗██║
 ██║  ██║╚██████╔╝██║ ╚═╝ ██║██║  ██║██║ ╚████║
 ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝</pre>
              </div>

              <p class="agent-line">Агент <span class="val">RS-1337</span> — это ты.</p>

              <div class="briefing-box code-block">
<span class="cmt">// БРИФИНГ МИССИИ</span>

<span class="kw">subject</span>  : Роман Сергеевич
<span class="kw">mission</span>  : Найти и опознать засекреченный артефакт
<span class="kw">method</span>   : 5 уровней логических загадок
<span class="kw">domain</span>   : Криптография / DevOps / Go / Сети
<span class="kw">reward</span>   : <span class="val">ЗАСЕКРЕЧЕНО</span>

<span class="cmt">// Каждый уровень открывается только правильным ответом.</span>
<span class="cmt">// Финал — строго в назначенное время.</span>
<span class="cmt">// Прогресс сохраняется. Браузер можно закрывать.</span></div>

              <button class="btn btn-large" @click="$emit('start')" style="margin-top:24px; width:100%; font-size:15px; padding:14px;">
                &gt;&gt; НАЧАТЬ МИССИЮ
              </button>
            </div>
          </transition>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
defineEmits(['start'])

const bootLines = [
  { text: '[OK]   Загрузка ядра безопасности...', cls: 'ok' },
  { text: '[OK]   Инициализация SHA-256 / AES-256-GCM...', cls: 'ok' },
  { text: '[OK]   Проверка TLS-сертификатов...', cls: 'ok' },
  { text: '[SCAN] Поиск агента в базе данных...', cls: 'warn' },
  { text: '[OK]   Агент RS-1337 найден. Биометрия подтверждена.', cls: 'ok' },
  { text: '[OK]   Загрузка секретного досье ROMAN_S.enc...', cls: 'ok' },
  { text: '[!!]   Обнаружен засекреченный артефакт. Требуется расследование.', cls: 'err' },
  { text: '[OK]   Доступ предоставлен. Добро пожаловать, агент.', cls: 'ok' },
]

const shown = ref([])
const done = ref(false)

onMounted(async () => {
  for (const line of bootLines) {
    await new Promise(r => setTimeout(r, 350))
    shown.value.push(line)
  }
  await new Promise(r => setTimeout(r, 500))
  done.value = true
})
</script>

<style scoped>
.ok  { color: var(--green); }
.warn { color: var(--yellow); }
.err  { color: var(--red); }
.welcome-ascii {
  text-align: center;
  color: var(--green);
  font-size: clamp(5px, 1.3vw, 10px);
  text-shadow: 0 0 10px rgba(0,255,157,0.4);
  margin: 16px 0;
  overflow-x: auto;
}
.welcome-ascii pre { display: inline-block; text-align: left; }
.agent-line {
  text-align: center;
  font-family: var(--font-display);
  font-size: clamp(14px, 3vw, 20px);
  color: var(--text);
  letter-spacing: 0.08em;
  margin-bottom: 20px;
}
.btn-large { letter-spacing: 0.15em; }
.reveal-enter-active { animation: fadeInUp 0.6s ease forwards; }
</style>
