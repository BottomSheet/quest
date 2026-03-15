<template>
  <div>
    <div class="term-win anim-pulse">
      <div class="term-win-header">
        <span class="dot dot-r"/><span class="dot dot-y"/><span class="dot dot-g"/>
        <span class="term-win-title">vpn_config_analysis.conf — УРОВЕНЬ 3/5</span>
      </div>
      <div class="term-win-body">

        <p class="cmt">// Перехвачен частичный конфиг. Данные повреждены.</p>
        <p class="cmt">// Восстанови недостающую информацию.</p>
        <br>

        <div class="code-block">$ cat /etc/wireguard/wg0.conf

[Interface]
PrivateKey = <span class="val">qH8mK2nP...REDACTED...xZ1vL9==</span>
Address    = 10.0.0.1/24
<span class="kw">ListenPort = ?????</span>     <span class="cmt"># ← ЭТО НАМ НУЖНО</span>
DNS        = 1.1.1.1

[Peer]
PublicKey  = <span class="val">Xy7rN4kQ...REDACTED...bA3wE6==</span>
AllowedIPs = 0.0.0.0/0
Endpoint   = 185.220.101.x:<span class="kw">?????</span></div>
        <br>

        <p class="cmt">// Смотрим что говорит systemd:</p>
        <div class="code-block" style="margin-top:8px">$ systemctl status wg-quick@wg0

● wg-quick@wg0.service - WireGuard via wg-quick(8)
   Loaded: loaded (/lib/systemd/system/wg-quick@.service)
   Active: <span class="ok">active (running)</span>

$ ss -tulpn | grep wireguard

udp  UNCONN  0  0  0.0.0.0:<span class="warn">█████</span>  0.0.0.0:*
     users:(("wireguard",pid=1337,fd=7))</div>
        <br>

        <p class="cmt">// Из официальной документации WireGuard (фрагмент):</p>
        <div class="code-block" style="margin-top:8px"><span class="cmt">"""
WireGuard does not enforce a specific port,
but the convention and default port used in
most deployments and documentation examples is:

UDP/<span class="val">?????</span>

This port is also registered with IANA for
WireGuard use. It was chosen to be memorable —
look at the digits.
"""</span></div>
        <br>
        <p class="cmt">// Подсказка из iptables на том же сервере:</p>
        <div class="code-block" style="margin-top:8px">$ iptables -L INPUT -n | grep udp

ACCEPT  udp  --  0.0.0.0/0  0.0.0.0/0  udp dpt:<span class="warn">?????</span>
<span class="cmt"># Цифры красивые. Почти как 1337, но другие.</span></div>
        <br>

        <hr class="divider">
        <p style="font-size:13px; color:var(--text-dim); margin-bottom:14px">
          <span class="kw">&gt;</span> Введи стандартный порт WireGuard:
        </p>

        <div class="unlock-row">
          <input
            v-model="answer"
            class="unlock-input"
            :class="{ error: shakeError, success: solved }"
            placeholder="port number..."
            @keydown.enter="check"
            @input="shakeError = false"
            :disabled="solved"
            autocomplete="off"
            spellcheck="false"
          />
          <button class="btn" @click="check" :disabled="solved">CONNECT →</button>
        </div>
        <p v-if="shakeError" class="err-msg">⚠ CONNECTION REFUSED — неверный порт</p>
        <p v-if="solved" class="ok-msg">✓ TUNNEL ESTABLISHED — уровень 4 разблокирован</p>

        <div style="margin-top:16px">
          <span class="hint-toggle" @click="showHint = !showHint">
            {{ showHint ? '▼' : '▶' }} показать подсказку
          </span>
          <div v-if="showHint" class="hint-box">
            <span class="cmt">// WireGuard по умолчанию слушает на UDP порту 51820.</span><br>
            <span class="cmt">// Его легко запомнить: 5-1-8-2-0. Красивое число для тех, кто пишет конфиги.</span>
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
