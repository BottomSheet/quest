<template>
  <div>
    <div class="term-win anim-pulse">
      <div class="term-win-header">
        <span class="dot dot-r"/><span class="dot dot-y"/><span class="dot dot-g"/>
        <span class="term-win-title">runtime_trace.go — УРОВЕНЬ 4/5</span>
      </div>
      <div class="term-win-body">

        <p class="cmt">// Что-то странное творится с Go-процессом.</p>
        <p class="cmt">// Анализируй trace. Найди примитив.</p>
        <br>

        <div class="code-block">$ go tool trace -http=:8080 trace.out

<span class="ok">Parsing trace...</span>
<span class="ok">Splitting trace...</span>

<span class="warn">ANOMALY DETECTED:</span>
  Scheduler latency  : 847µs (p99)
  GC pause           : 1.2ms
  Heap allocated     : 128MB
  <span class="kw">??? count           : 100,000</span>   ← что это?
  OS thread count    : 8</div>
        <br>

        <p class="cmt">// В pprof нашли кое-что интересное:</p>
        <div class="code-block" style="margin-top:8px">$ curl http://localhost:6060/debug/pprof/

/debug/pprof/

Types of profiles available:
  allocs        : memory allocation
  block         : blocking operations
  cmdline
  heap          : heap memory
  mutex         : contended mutexes
  <span class="val">?????????</span>    : <span class="kw">all current ????????? in the program</span>
  threadcreate  : OS thread creation
  trace

<span class="cmt"># Пустое место — не поток, не процесс.</span>
<span class="cmt"># Легковесная единица конкурентности Go.</span>
<span class="cmt"># Их можно запустить миллионы — стек начинается с 2KB.</span></div>
        <br>

        <p class="cmt">// Из исходника найденного сервиса:</p>
        <div class="code-block" style="margin-top:8px"><span class="kw">func</span> processTransactions(txs []Transaction) {
    var wg sync.WaitGroup
    
    <span class="kw">for</span> _, tx := range txs {
        wg.Add(1)
        <span class="kw">go</span> <span class="val">?????????</span>() {  <span class="cmt">// ← ключевое слово здесь</span>
            defer wg.Done()
            sign(tx)
        }()
    }
    wg.Wait()
}

<span class="cmt">// Что стоит после ключевого слова `go`?</span>
<span class="cmt">// Это и есть название этой абстракции.</span></div>
        <br>

        <hr class="divider">
        <p style="font-size:13px; color:var(--text-dim); margin-bottom:14px">
          <span class="kw">&gt;</span> Назови лёгковесную единицу конкурентности в Go:
        </p>

        <div class="unlock-row">
          <input
            v-model="answer"
            class="unlock-input"
            :class="{ error: shakeError, success: solved }"
            placeholder="go primitive..."
            @keydown.enter="check"
            @input="shakeError = false"
            :disabled="solved"
            autocomplete="off"
            spellcheck="false"
          />
          <button class="btn" @click="check" :disabled="solved">RUN →</button>
        </div>
        <p v-if="shakeError" class="err-msg">⚠ RUNTIME ERROR — deadlock detected</p>
        <p v-if="solved" class="ok-msg">✓ GOROUTINE SPAWNED — уровень 5 разблокирован</p>

        <div style="margin-top:16px">
          <span class="hint-toggle" @click="showHint = !showHint">
            {{ showHint ? '▼' : '▶' }} показать подсказку
          </span>
          <div v-if="showHint" class="hint-box">
            <span class="cmt">// Это слово появляется сразу после ключевого слова `go` в коде.</span><br>
            <span class="cmt">// В отличие от потоков ОС — занимают минимум памяти и управляются рантаймом Go.</span>
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
