<template>
  <div>
    <div class="term-win anim-pulse">
      <div class="term-win-header">
        <span class="dot dot-r"/><span class="dot dot-y"/><span class="dot dot-g"/>
        <span class="term-win-title">docker_forensics.log — УРОВЕНЬ 2/5</span>
      </div>
      <div class="term-win-body">

        <p class="cmt">// Обнаружен подозрительный контейнер на prod-сервере.</p>
        <p class="cmt">// Проведи расследование. Что внутри?</p>
        <br>

        <div class="code-block">$ docker ps -a

CONTAINER ID   IMAGE          COMMAND        STATUS
a3f9c1d2e4b5   <span class="val">???:latest</span>    "/entrypoint.sh"   Up 2 hours
8b7e2a1f9c3d   nginx:1.25     "nginx -g..."  Up 5 hours

$ docker inspect a3f9c1d2e4b5 | jq '.[] | .Config'

{
  "Image": "<span class="val">???:latest</span>",
  "Env": [
    "WALLET_MODE=cold",
    "SEED_ENTROPY=256",
    "BASE_OS=<span class="kw">REDACTED</span>"
  ],
  "Labels": {
    "maintainer": "roman-s",
    "size":        "<span class="val">~5MB</span>",
    "description": "smallest production-ready linux"
  }
}</div>
        <br>

        <p class="cmt">// Попробуем восстановить образ через слои:</p>
        <div class="code-block" style="margin-top:8px">$ docker history a3f9c1d2e4b5 --no-trunc

IMAGE       CREATED BY                    SIZE
sha256:a1   <span class="kw">CMD</span> ["/bin/sh" "-c" "..."]   0B
sha256:b2   <span class="kw">RUN</span> apk add --no-cache ...    1.2MB
sha256:c3   <span class="kw">FROM</span> <span class="val">_______:3.19</span>           <span class="ok">4.8MB</span>

# apk — это пакетный менеджер какого дистрибутива?</div>
        <br>

        <p class="cmt">// Из Dockerfile найденного в репозитории:</p>
        <div class="code-block" style="margin-top:8px"><span class="kw">FROM</span> <span class="val">_______</span>          <span class="cmt"># минималистичный, как хороший конфиг</span>
<span class="kw">RUN</span>  apk add --no-cache ca-certificates tzdata
<span class="kw">COPY</span> wallet-service /app/wallet-service
<span class="kw">USER</span> nobody
<span class="kw">ENTRYPOINT</span> [<span class="val">"/app/wallet-service"</span>]

<span class="cmt"># Этот образ — выбор каждого Go-разработчика,</span>
<span class="cmt"># когда нужно собрать scratch-like контейнер</span>
<span class="cmt"># с минимальной attack surface.</span></div>
        <br>

        <hr class="divider">
        <p style="font-size:13px; color:var(--text-dim); margin-bottom:14px">
          <span class="kw">&gt;</span> Назови базовый образ. Только имя, без тега:
        </p>

        <div class="unlock-row">
          <input
            v-model="answer"
            class="unlock-input"
            :class="{ error: shakeError, success: solved }"
            placeholder="image name..."
            @keydown.enter="check"
            @input="shakeError = false"
            :disabled="solved"
            autocomplete="off"
            spellcheck="false"
          />
          <button class="btn" @click="check" :disabled="solved">PULL →</button>
        </div>
        <p v-if="shakeError" class="err-msg">⚠ IMAGE NOT FOUND — попробуй ещё</p>
        <p v-if="solved" class="ok-msg">✓ CONTAINER IDENTIFIED — уровень 3 разблокирован</p>

        <div style="margin-top:16px">
          <span class="hint-toggle" @click="showHint = !showHint">
            {{ showHint ? '▼' : '▶' }} показать подсказку
          </span>
          <div v-if="showHint" class="hint-box">
            <span class="cmt">// Любимый базовый образ всех Go-девов. Размер ~5MB.</span><br>
            <span class="cmt">// Использует apk вместо apt. Назван в честь горного массива.</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({ correctAnswer: String })
const emit = defineEmits(['solved'])

const answer = ref('')
const shakeError = ref(false)
const solved = ref(false)
const showHint = ref(false)

function check() {
  if (solved.value) return
  if (answer.value.trim().toLowerCase() === props.correctAnswer.toLowerCase()) {
    solved.value = true
    setTimeout(() => emit('solved'), 900)
  } else {
    shakeError.value = true
    setTimeout(() => shakeError.value = false, 500)
  }
}
</script>
