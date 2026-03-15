<template>
  <div>
    <div class="term-win anim-pulse">
      <div class="term-win-header">
        <span class="dot dot-r"/><span class="dot dot-y"/><span class="dot dot-g"/>
        <span class="term-win-title">key_generation.go — УРОВЕНЬ 5/5 — ФИНАЛЬНЫЙ ЗАМОК</span>
      </div>
      <div class="term-win-body">

        <p class="cmt">// Последний уровень. Ты добрался до сердца системы.</p>
        <p class="cmt">// Здесь хранится всё. Ключи. Подписи. Защита активов.</p>
        <br>

        <div class="code-block">$ cat generate_keypair.go

<span class="kw">package</span> main

<span class="kw">import</span> (
    <span class="val">"crypto/elliptic"</span>
    <span class="val">"fmt"</span>
    btcec <span class="val">"github.com/btcsuite/btcd/btcec/v2"</span>
)

<span class="kw">func</span> generateColdWalletKey() {
    <span class="cmt">// Выбираем кривую. Именно она используется</span>
    <span class="cmt">// в Bitcoin и большинстве холодных кошельков.</span>
    curve := btcec.<span class="val">??????????()</span>
    
    privKey, _ := btcec.NewPrivateKey()
    pubKey     := privKey.PubKey()
    
    fmt.Printf(<span class="val">"Curve:   %s\n"</span>, curve.Params().Name)
    fmt.Printf(<span class="val">"PrivKey: %x\n"</span>, privKey.Serialize())
    fmt.Printf(<span class="val">"PubKey:  %x\n"</span>, pubKey.SerializeCompressed())
}

<span class="cmt">// Вывод программы:</span>
$ ./generate_keypair

Curve:   <span class="kw">?????????</span>
PrivKey: 3a7f2b...e94c1d (32 bytes)
PubKey:  02a1b9...f38e2c (33 bytes, compressed)</div>
        <br>

        <p class="cmt">// Из стандарта (RFC / ANSI X9.62):</p>
        <div class="code-block" style="margin-top:8px">Curve parameters:
  Name    : <span class="val">?????????</span>
  Field   : p = 2²⁵⁶ − 2³² − 977  (256-bit prime)
  Order   : n = FFFFFFFF...BAAEDCE6 AF48A03B BFD25E8C D0364141
  Generator G: (79BE667E...B10D4B8, ...)
  
  <span class="cmt">-- Это не NIST кривая.</span>
  <span class="cmt">-- Была выбрана за предсказуемость параметров.</span>
  <span class="cmt">-- Имя: "sec" + "p" + битность + тип + номер.</span>
  <span class="cmt">-- Используется: Bitcoin, Ethereum, большинство cold wallets.</span></div>
        <br>

        <p class="cmt">// Финальная подсказка из openssl:</p>
        <div class="code-block" style="margin-top:8px">$ openssl ecparam -list_curves | grep -i "bitcoin\|256k"

  <span class="val">?????????</span> : SECG curve over a 256 bit prime field
  <span class="cmt"># это оно</span></div>
        <br>

        <hr class="divider">
        <p style="font-size:13px; color:var(--text-dim); margin-bottom:14px">
          <span class="kw">&gt;</span> Назови эллиптическую кривую. Формат: secp???k?
        </p>

        <div class="unlock-row">
          <input
            v-model="answer"
            class="unlock-input"
            :class="{ error: shakeError, success: solved }"
            placeholder="secp???k?"
            @keydown.enter="check"
            @input="shakeError = false"
            :disabled="solved"
            autocomplete="off"
            spellcheck="false"
          />
          <button class="btn" @click="check" :disabled="solved">UNLOCK VAULT →</button>
        </div>
        <p v-if="shakeError" class="err-msg">⚠ INVALID CURVE — ключ не подходит</p>
        <p v-if="solved" class="ok-msg">✓ VAULT OPENED — миссия почти завершена...</p>

        <div style="margin-top:16px">
          <span class="hint-toggle" @click="showHint = !showHint">
            {{ showHint ? '▼' : '▶' }} показать подсказку
          </span>
          <div v-if="showHint" class="hint-box">
            <span class="cmt">// secp256k1 — кривая Коблица над 256-битным простым полем.</span><br>
            <span class="cmt">// Используется в Bitcoin с самого начала. Не случайный выбор Сатоши.</span>
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
