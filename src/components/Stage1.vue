<template>
  <div>
    <div class="term-win anim-pulse">
      <div class="term-win-header">
        <span class="dot dot-r"/><span class="dot dot-y"/><span class="dot dot-g"/>
        <span class="term-win-title">mission_briefing.enc — УРОВЕНЬ 1/5</span>
      </div>
      <div class="term-win-body">

        <p class="cmt">// Перехваченное сообщение. Источник неизвестен.</p>
        <br>
        <div class="code-block">$ cat intercepted.b64

Um9tYW4sIHR5IHpuYWVzaCBjaHRvIHRha29lIGVudHJvcHk/
INCt0YLQviBQoNC80LXRgNGC0LrQuNC5INGB0LjRgdGC0LXQ
vdGLLCDQv9C+0LvRg9GH0LXQvdC90YvQuSDQuNC3INGA0LDQ
tdC90LTQvtC8INGB0LvRg9GH0LDQudC90YvRhdGB0L7QsdGL
0YLQuNC5LiBPdmVyLg==</div>
        <br>

        <p class="cmt">// Хм. Это выглядит знакомо. Попробуй декодировать.</p>
        <br>
        <p class="cmt">// Подсказка из системного лога:</p>
        <div class="code-block" style="margin-top:8px">$ openssl enc -base64 -d <<< "[вставь строку]"

# Или в Go:
encoding/<span class="kw">base64</span>.StdEncoding.DecodeString(<span class="val">"..."</span>)

# Или прямо в браузере:
atob(<span class="val">"Um9tYW4sIHR5..."</span>)</div>
        <br>

        <p class="cmt">// После декодирования — найди ключевое слово из области теории информации.</p>
        <p class="cmt">// Это слово измеряет степень неопределённости или случайности системы.</p>
        <br>

        <div class="second-clue">
          <p><span class="warn">ДОПОЛНИТЕЛЬНЫЙ СИГНАЛ:</span></p>
          <br>
          <div class="code-block">$ grep -i "randomness" /var/log/crypto/theory.log

[INFO]  Shannon (1948): H = -Σ p(x) · log₂(p(x))
[INFO]  Это фундамент криптографии и... холодного хранения.
[INFO]  Без высокого значения этой метрики — ключ небезопасен.
[WARN]  Keyword identified: <span class="val">_______</span> (7 букв, англ.)</div>
        </div>
        <br>

        <hr class="divider">
        <p style="font-size:13px; color:var(--text-dim); margin-bottom:14px">
          <span class="kw">&gt;</span> Введи ключевое слово чтобы разблокировать следующий уровень:
        </p>

        <div class="unlock-row">
          <input
            v-model="answer"
            class="unlock-input"
            :class="{ error: shakeError, success: solved }"
            placeholder="keyword..."
            @keydown.enter="check"
            @input="shakeError = false"
            :disabled="solved"
            autocomplete="off"
            spellcheck="false"
          />
          <button class="btn" @click="check" :disabled="solved">DECODE →</button>
        </div>
        <p v-if="shakeError" class="err-msg">⚠ ACCESS DENIED — неверный ответ</p>
        <p v-if="solved" class="ok-msg">✓ ВЕРНО — уровень 2 разблокирован</p>

        <div style="margin-top:16px">
          <span class="hint-toggle" @click="showHint = !showHint">
            {{ showHint ? '▼' : '▶' }} показать подсказку
          </span>
          <div v-if="showHint" class="hint-box">
            <span class="cmt">// Энтропия. Слово из термодинамики, которое Шеннон позаимствовал для теории информации.</span><br>
            <span class="cmt">// В контексте криптографии: чем выше энтропия — тем случайнее и надёжнее ключ.</span>
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
