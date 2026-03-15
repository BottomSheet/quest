// Конфигурация всех этапов квеста
// Ответы хранятся в нижнем регистре для сравнения

export const FINAL_DATETIME = new Date('2026-03-16T00:00:00') // Финал строго в 00:00 16 марта

export const STAGES = [
  {
    id: 1,
    unlocksAt: null, // Доступен сразу
    title: 'ИНИЦИАЛИЗАЦИЯ',
    subtitle: 'Уровень 1 — Кодировка',
    answer: 'entropy', // Ответ в нижнем регистре
    answerHint: 'Одно английское слово, строчными буквами',
  },
  {
    id: 2,
    unlocksAt: null, // Разблокируется ответом на этап 1
    title: 'КОНТЕЙНЕР',
    subtitle: 'Уровень 2 — Оркестрация',
    answer: 'alpine',
    answerHint: 'Одно слово — название дистрибутива',
  },
  {
    id: 3,
    unlocksAt: null,
    title: 'ТУННЕЛЬ',
    subtitle: 'Уровень 3 — Сетевой стек',
    answer: '51820',
    answerHint: 'Число — номер порта',
  },
  {
    id: 4,
    unlocksAt: null,
    title: 'ГОРУТИНА',
    subtitle: 'Уровень 4 — Go Runtime',
    answer: 'goroutine',
    answerHint: 'Одно слово из мира Go',
  },
  {
    id: 5,
    unlocksAt: null,
    title: 'КЛЮЧ',
    subtitle: 'Уровень 5 — Криптография',
    answer: 'secp256k1',
    answerHint: 'Название кривой, без пробелов',
  },
  {
    id: 6, // Финальный — открывается по времени
    unlocksAt: FINAL_DATETIME,
    title: 'ФИНАЛ',
    subtitle: 'Миссия выполнена',
    answer: null,
    answerHint: null,
  },
]

export const TOTAL_QUEST_STAGES = 5 // Не считая финал
