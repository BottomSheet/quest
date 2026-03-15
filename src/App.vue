<template>
  <div id="quest-app">
    <div class="scanlines"/>
    <div class="crt-vignette"/>

    <!-- WELCOME -->
    <WelcomeScreen v-if="screen === 'welcome'" @start="startQuest" />

    <!-- QUEST STAGES -->
    <template v-else-if="screen === 'quest'">
      <div class="stage">
        <div class="stage-inner">

          <!-- Progress bar -->
          <div class="progress-bar-wrap">
            <div class="progress-bar-labels">
              <span>ПРОГРЕСС МИССИИ</span>
              <span>{{ stagesDone }}/5 УРОВНЕЙ</span>
            </div>
            <div class="progress-bar-track">
              <div class="progress-bar-fill" :style="{ width: progressPct + '%' }"/>
            </div>
          </div>

          <!-- Stage badge -->
          <div class="stage-badge" v-if="currentStage <= 5">
            <span class="stage-badge-dot"/>
            {{ STAGES[currentStage - 1].subtitle }}
          </div>

          <!-- Stage components -->
          <transition name="stage-transition" mode="out-in">

            <Stage1
              v-if="currentStage === 1"
              key="s1"
              :correctAnswer="STAGES[0].answer"
              @solved="onSolved(1)"
            />
            <Stage2
              v-else-if="currentStage === 2"
              key="s2"
              :correctAnswer="STAGES[1].answer"
              @solved="onSolved(2)"
            />
            <Stage3
              v-else-if="currentStage === 3"
              key="s3"
              :correctAnswer="STAGES[2].answer"
              @solved="onSolved(3)"
            />
            <Stage4
              v-else-if="currentStage === 4"
              key="s4"
              :correctAnswer="STAGES[3].answer"
              @solved="onSolved(4)"
            />
            <Stage5
              v-else-if="currentStage === 5"
              key="s5"
              :correctAnswer="STAGES[4].answer"
              @solved="onSolved(5)"
            />

            <!-- Waiting room or final -->
            <WaitingRoom
              v-else-if="currentStage === 6 && !finalUnlocked"
              key="wait"
              :targetDate="FINAL_DATETIME"
              @unlocked="finalUnlocked = true"
            />
            <StageFinal
              v-else-if="currentStage === 6 && finalUnlocked"
              key="final"
            />

          </transition>

          <!-- Nav: solved stage with next button -->
          <transition name="fade">
            <div v-if="showNextBtn" class="next-btn-row">
              <div class="code-block" style="text-align:center; padding:16px; margin-top:20px;">
                <p class="ok" style="margin-bottom:12px">✓ Уровень {{ solvedStageNum }} пройден!</p>
                <button class="btn" @click="goNext" style="min-width:200px;">
                  СЛЕДУЮЩИЙ УРОВЕНЬ →
                </button>
              </div>
            </div>
          </transition>

        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { STAGES, FINAL_DATETIME, TOTAL_QUEST_STAGES } from './questConfig.js'

import WelcomeScreen from './components/WelcomeScreen.vue'
import Stage1 from './components/Stage1.vue'
import Stage2 from './components/Stage2.vue'
import Stage3 from './components/Stage3.vue'
import Stage4 from './components/Stage4.vue'
import Stage5 from './components/Stage5.vue'
import WaitingRoom from './components/WaitingRoom.vue'
import StageFinal from './components/StageFinal.vue'

// ─── State ───────────────────────────────────────────────
const screen = ref('welcome')                 // 'welcome' | 'quest'
const currentStage = ref(1)                   // 1-6
const finalUnlocked = ref(false)

const showNextBtn = ref(false)
const solvedStageNum = ref(0)

// ─── Persistence ─────────────────────────────────────────
const SAVE_KEY = 'roman_quest_progress'

function saveProgress() {
  localStorage.setItem(SAVE_KEY, JSON.stringify({
    screen: screen.value,
    currentStage: currentStage.value,
    finalUnlocked: finalUnlocked.value,
  }))
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return
    const data = JSON.parse(raw)
    screen.value = data.screen ?? 'welcome'
    currentStage.value = data.currentStage ?? 1

    // Auto-check if final time already passed
    if (new Date() >= FINAL_DATETIME) {
      finalUnlocked.value = true
    } else {
      finalUnlocked.value = data.finalUnlocked ?? false
    }
  } catch { /* ignore */ }
}

onMounted(() => {
  loadProgress()
  // Also check time on mount
  if (new Date() >= FINAL_DATETIME) {
    finalUnlocked.value = true
  }
})

// ─── Computed ─────────────────────────────────────────────
const stagesDone = computed(() =>
  Math.min(currentStage.value - 1, TOTAL_QUEST_STAGES)
)
const progressPct = computed(() =>
  (stagesDone.value / TOTAL_QUEST_STAGES) * 100
)

// ─── Actions ─────────────────────────────────────────────
function startQuest() {
  screen.value = 'quest'
  saveProgress()
}

function onSolved(stageNum) {
  solvedStageNum.value = stageNum
  showNextBtn.value = true
}

function goNext() {
  showNextBtn.value = false
  currentStage.value++
  saveProgress()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style>
/* Stage transition */
.stage-transition-enter-active { animation: fadeInUp 0.5s ease forwards; }
.stage-transition-leave-active { animation: fadeOutDown 0.3s ease forwards; }
@keyframes fadeOutDown {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(10px); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.4s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.next-btn-row { margin-top: 0; }
</style>
