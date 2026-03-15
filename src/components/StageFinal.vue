<template>
  <div class="final-stage">
    <!-- Particles -->
    <canvas ref="canvas" class="particles-canvas"></canvas>

    <div class="stage-inner" style="position:relative; z-index:1">
      <div class="term-win final-win">
        <div class="term-win-header">
          <span class="dot dot-r"/><span class="dot dot-y"/><span class="dot dot-g"/>
          <span class="term-win-title">mission_complete.exe — РАСШИФРОВАНО</span>
        </div>
        <div class="term-win-body">

          <!-- Boot sequence -->
          <div v-if="phase === 0" class="boot-seq">
            <p v-for="(l, i) in shownBoot" :key="i" :class="l.cls">{{ l.text }}</p>
            <span class="cursor" v-if="phase === 0"/>
          </div>

          <!-- Main content -->
          <transition name="reveal">
            <div v-if="phase === 1">

              <div class="ascii-art">
                <pre>
 ██████╗     ██████╗  ███╗  ██╗ ██╗
 ██╔══██╗   ██╔═══██╗ ████╗ ██║ ██║
 ██████╔╝   ██║   ██║ ██╔██╗██║ ██║
 ██╔══██╗   ██║   ██║ ██║╚████║ ╚═╝
 ██║  ██║ █ ╚██████╔╝ ██║ ╚███║ ██╗
 ╚═╝  ╚═╝ █  ╚═════╝  ╚═╝  ╚══╝ ╚═╝</pre>
              </div>

              <div class="congrats-name">Роман Сергеевич</div>

              <div class="message-block">
                <p class="cmt" style="margin-bottom:16px">// Ты прошёл весь путь. Расшифровал каждый уровень.</p>
                <p style="line-height:1.8; font-size:15px">
                  Сегодня ты получаешь нечто, что соединяет всё то,<br>
                  с чем ты работаешь каждый день:<br>
                  <span class="kw">криптографию</span>, <span class="kw">безопасность</span>, <span class="kw">приватность</span>.<br><br>

                  Это устройство — твой персональный <span class="val">vault</span>.<br>
                  Оно работает offline. У него нет IP-адреса.<br>
                  Никакой attack surface. Никаких горутин.<br>
                  Только ты, <span class="val">secp256k1</span> и твои ключи.<br>
                </p>
              </div>

              <div class="gift-reveal">
                <div class="gift-icon">🎁</div>
                <div class="gift-label">
                  <span class="cmt">// Твой подарок:</span><br>
                  <span class="gift-name">ХОЛОДНЫЙ КОШЕЛЁК</span>
                  <p class="gift-sub">Аппаратное хранение криптовалюты.<br>Ключи никогда не покидают устройство.</p>
                </div>
              </div>

              <div class="spec-block code-block" style="margin-top:24px">
<span class="cmt"># Характеристики твоего нового девайса:</span>

device.type       = <span class="val">"hardware_wallet"</span>
device.storage    = <span class="val">"offline / air-gapped"</span>
device.crypto     = <span class="val">"secp256k1 + ed25519"</span>
device.interface  = <span class="val">"USB / Bluetooth"</span>
device.owner      = <span class="ok">"Роман Сергеевич"</span>
device.from       = <span class="val">"от тех, кто знает тебя"</span>

security_level    = <span class="kw">MAXIMUM</span>   <span class="cmt">// как и должно быть</span></div>

              <div class="final-footer">
                <p style="color:var(--text-dim); font-size:13px; margin-bottom:8px">
                  С Днём Рождения! 🎉
                </p>
                <p style="color:var(--text-dim); font-size:12px">
                  <span class="prompt">mission status: </span><span class="ok">COMPLETE</span>
                </p>
              </div>

            </div>
          </transition>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const canvas = ref(null)
const phase = ref(0)
const shownBoot = ref([])

const bootLines = [
  { text: '[OK] Верификация всех ключей...', cls: 'ok' },
  { text: '[OK] Расшифровка финального файла...', cls: 'ok' },
  { text: '[OK] Подтверждение личности: Роман Сергеевич...', cls: 'ok' },
  { text: '[OK] Загрузка поздравительного протокола...', cls: 'ok' },
  { text: '[!!] МИССИЯ ВЫПОЛНЕНА. Открываю финал...', cls: 'warn' },
]

async function runBoot() {
  for (const line of bootLines) {
    await new Promise(r => setTimeout(r, 500))
    shownBoot.value.push(line)
  }
  await new Promise(r => setTimeout(r, 700))
  phase.value = 1
  initParticles()
}

function initParticles() {
  const c = canvas.value
  if (!c) return
  const ctx = c.getContext('2d')
  c.width = window.innerWidth
  c.height = window.innerHeight

  const particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * c.width,
    y: Math.random() * c.height,
    vy: -(Math.random() * 1.5 + 0.5),
    vx: (Math.random() - 0.5) * 0.5,
    size: Math.random() * 3 + 1,
    alpha: Math.random(),
    char: ['0', '1', 'A', 'F', '$', '#', '>', '*'][Math.floor(Math.random() * 8)],
  }))

  function draw() {
    ctx.clearRect(0, 0, c.width, c.height)
    particles.forEach(p => {
      ctx.globalAlpha = p.alpha * 0.6
      ctx.fillStyle = '#00ff9d'
      ctx.font = `${p.size * 5}px 'Share Tech Mono'`
      ctx.fillText(p.char, p.x, p.y)
      p.y += p.vy
      p.x += p.vx
      p.alpha -= 0.002
      if (p.y < -20 || p.alpha <= 0) {
        p.y = c.height + 10
        p.x = Math.random() * c.width
        p.alpha = Math.random()
      }
    })
    requestAnimationFrame(draw)
  }
  draw()
}

onMounted(runBoot)
</script>

<style scoped>
.final-stage {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  position: relative;
  overflow: hidden;
}
.particles-canvas {
  position: fixed; top: 0; left: 0;
  pointer-events: none; z-index: 0;
}
.final-win {
  border-color: var(--green-dim);
  box-shadow: 0 0 60px rgba(0,255,157,0.15), 0 0 120px rgba(0,255,157,0.05);
}
.ascii-art {
  text-align: center;
  color: var(--green);
  font-size: clamp(6px, 1.5vw, 12px);
  text-shadow: 0 0 10px rgba(0,255,157,0.5);
  margin-bottom: 8px;
  overflow-x: auto;
}
.ascii-art pre { display: inline-block; text-align: left; }
.congrats-name {
  text-align: center;
  font-family: var(--font-display);
  font-size: clamp(20px, 5vw, 36px);
  color: var(--green);
  letter-spacing: 0.1em;
  text-shadow: 0 0 20px rgba(0,255,157,0.4);
  margin-bottom: 24px;
  animation: glitch 4s ease-in-out infinite;
}
.message-block {
  background: #020a06;
  border: 1px solid var(--border);
  border-left: 3px solid var(--green-dim);
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 24px;
  line-height: 1.8;
}
.gift-reveal {
  display: flex;
  align-items: center;
  gap: 24px;
  background: linear-gradient(135deg, var(--bg2), var(--bg3));
  border: 1px solid var(--border-bright);
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 0 30px rgba(0,255,157,0.08);
}
.gift-icon { font-size: 56px; animation: float 3s ease-in-out infinite; }
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
.gift-name {
  font-family: var(--font-display);
  font-size: clamp(16px, 3.5vw, 24px);
  color: var(--green);
  letter-spacing: 0.08em;
  display: block;
  margin: 8px 0;
  text-shadow: 0 0 14px rgba(0,255,157,0.4);
}
.gift-sub { font-size: 13px; color: var(--text-dim); line-height: 1.6; margin-top: 6px; }
.final-footer { text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--border); }
.boot-seq { font-size: 14px; line-height: 2; }
.boot-seq .ok { color: var(--green); }
.boot-seq .warn { color: var(--yellow); }
.reveal-enter-active { animation: fadeInUp 0.8s ease forwards; }
</style>
