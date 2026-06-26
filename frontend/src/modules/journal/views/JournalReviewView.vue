<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useJournalList } from '../composables/useJournalList'

const { items, monthDays, monthEntries, fetchAll } = useJournalList()

onMounted(() => fetchAll())

const monthTitle = computed(() => new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' }))
const monthPhotos = computed(() =>
  monthEntries.value.flatMap((entry) => entry.photos.map((photo) => ({ photo, entry }))),
)
const recordedDays = computed(() => monthDays.value.filter((day) => day.entry).length)

const moodEmojiByColor: Record<string, string> = {
  '#ffbf3f': '😊',
  '#f4b942': '😊',
  '#6dc6c9': '😌',
  '#68a7ad': '😌',
  '#7aa7e8': '😢',
  '#78a7ff': '😢',
  '#8f95a8': '☁️',
  '#8b8f71': '☁️',
  '#ff7a45': '🤩',
  '#e06f37': '🤩',
  '#f05a4f': '😡',
}

function moodEmoji(mood?: string, moodColor?: string) {
  const fromMood = mood?.match(/\p{Extended_Pictographic}|\p{Emoji_Presentation}/u)?.[0]
  if (fromMood) return fromMood

  const normalizedColor = moodColor?.toLowerCase()
  if (normalizedColor && moodEmojiByColor[normalizedColor]) return moodEmojiByColor[normalizedColor]

  if (mood?.includes('开心') || mood?.includes('明亮')) return '😊'
  if (mood?.includes('平静')) return '😌'
  if (mood?.includes('伤心') || mood?.includes('柔软')) return '😢'
  if (mood?.includes('低落') || mood?.includes('疲惫')) return '☁️'
  if (mood?.includes('期待')) return '🤩'
  if (mood?.includes('愤怒')) return '😡'
  return '·'
}
</script>

<template>
  <section class="review-page">
    <header class="review-page__header">
      <div>
        <p class="review-page__eyebrow">monthly review</p>
        <h1>{{ monthTitle }} 的回忆拼贴</h1>
        <p>
          每一天都在这里。被照片记住的日子有颜色，空白的日子也安静地占有一格。
        </p>
      </div>
      <RouterLink class="review-page__back" to="/journal">回到今日手账</RouterLink>
    </header>

    <div class="review-page__summary">
      <span>{{ recordedDays }} 天有记录</span>
      <span>{{ monthPhotos.length }} 张照片</span>
      <span>{{ items.length }} 篇全部日记</span>
    </div>

    <section class="month-calendar" aria-label="当月日历">
      <article
        v-for="day in monthDays"
        :key="day.key"
        class="month-calendar__day"
        :class="{ 'has-entry': day.entry }"
        :style="{ '--mood-color': day.color }"
      >
        <div class="month-calendar__date">
          <span>{{ day.weekday }}</span>
          <strong>{{ day.day }}</strong>
        </div>
        <div class="month-calendar__photo">
          <img v-if="day.entry?.photos[0]" :src="day.entry.photos[0]" alt="" />
          <span v-if="day.entry" class="month-calendar__mood">
            {{ moodEmoji(day.entry.mood, day.entry.moodColor) }}
          </span>
          <p v-if="day.entry?.note" class="month-calendar__hover-note">{{ day.entry.note }}</p>
          <div v-else class="month-calendar__empty" />
        </div>
      </article>
    </section>

    <section class="mood-rhythm" aria-label="情绪颜色节奏">
      <span
        v-for="day in monthDays"
        :key="day.key"
        :class="{ 'is-empty': !day.entry }"
        :style="{ backgroundColor: day.color }"
      />
    </section>

    <section class="photo-mosaic" aria-label="本月照片墙">
      <figure
        v-for="{ photo, entry } in monthPhotos"
        :key="photo"
        :style="{ '--mood-color': entry.moodColor }"
      >
        <div class="photo-mosaic__photo">
          <img :src="photo" alt="" />
          <p v-if="entry.note" class="photo-mosaic__hover-note">{{ entry.note }}</p>
        </div>
        <figcaption>
          <span>{{ entry.entryDate }}</span>
          <strong>{{ moodEmoji(entry.mood, entry.moodColor) }}</strong>
        </figcaption>
      </figure>
      <p v-if="monthPhotos.length === 0" class="review-page__hint">
        这个月还没有照片。先从某一天开始补记吧。
      </p>
    </section>
  </section>
</template>

<style lang="less" scoped>
.review-page {
  max-width: 1120px;
  margin: 0 auto;
  color: #3d3328;

  &__header {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: @space-xl;
    margin: 54px 0 @space-xl;
    padding: 34px;
    border: 2px solid rgba(61, 51, 40, 0.1);
    border-radius: 36px;
    background:
      radial-gradient(circle at 88% 20%, rgba(255, 143, 163, 0.26) 0 70px, transparent 72px),
      radial-gradient(circle at 12% 90%, rgba(109, 198, 201, 0.24) 0 84px, transparent 86px),
      rgba(255, 252, 241, 0.82);
    box-shadow: 0 24px 60px rgba(124, 83, 45, 0.15);
    backdrop-filter: blur(10px);
  }

  &__header::before {
    content: '';
    position: absolute;
    top: -12px;
    right: 88px;
    width: 130px;
    height: 28px;
    border-radius: 5px;
    background: rgba(255, 207, 107, 0.66);
    transform: rotate(4deg);
  }

  &__header h1 {
    max-width: 720px;
    margin: 0;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(38px, 5.8vw, 64px);
    line-height: 1;
    letter-spacing: -0.04em;
  }

  &__header p {
    max-width: 620px;
    margin: @space-md 0 0;
    color: #765f4a;
    font-size: @font-size-lg;
    line-height: 1.85;
  }

  &__eyebrow {
    margin: 0 0 @space-sm;
    color: #ff7a45;
    font-weight: 900;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  &__back {
    flex: 0 0 auto;
    padding: 14px 18px;
    border: 2px solid rgba(61, 51, 40, 0.16);
    border-radius: 20px;
    color: #3d3328;
    background: #bfeee9;
    box-shadow: 5px 6px 0 #ffcf6b;
    font-weight: 900;
    transform: rotate(2deg);
  }

  &__summary {
    display: flex;
    flex-wrap: wrap;
    gap: @space-md;
    margin-bottom: @space-xl;
  }

  &__summary span {
    padding: 10px 15px;
    border: 1px solid rgba(61, 51, 40, 0.12);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.64);
    color: #6f5b46;
    font-weight: 900;
  }

  &__hint {
    color: #765f4a;
  }
}

.month-calendar {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: @space-sm;
  margin-bottom: @space-xl;
  padding: @space-md;
  border: 2px solid rgba(61, 51, 40, 0.1);
  border-radius: 32px;
  background: rgba(255, 252, 241, 0.72);
  box-shadow: 0 18px 44px rgba(124, 83, 45, 0.1);

  &__day {
    --mood-color: #f0dcc9;
    aspect-ratio: 3 / 4;
    min-height: 0;
    padding: 9px 9px 18px;
    border: 1px solid rgba(61, 51, 40, 0.13);
    border-radius: 12px;
    background: #fffaf0;
    display: flex;
    flex-direction: column;
    gap: 6px;
    box-shadow: 0 12px 26px rgba(118, 78, 42, 0.1);
  }

  &__day.has-entry {
    background:
      linear-gradient(180deg, #fffaf0, color-mix(in srgb, var(--mood-color) 14%, white));
    border-style: solid;
    box-shadow: inset 0 -6px 0 var(--mood-color), 0 12px 24px rgba(78, 52, 31, 0.12);
  }

  &__photo {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 8px;
  }

  &__photo {
    overflow: hidden;
    position: relative;
    z-index: 1;
    flex: 0 0 auto;
    max-height: none;
    margin-top: -2px;
  }

  &__photo img {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    display: block;
    object-fit: cover;
    box-shadow: 0 8px 18px rgba(70, 48, 31, 0.12);
    transition:
      transform 220ms ease,
      box-shadow 220ms ease;
  }

  &__photo:hover {
    overflow: visible;
    z-index: 8;
  }

  &__photo:hover img {
    transform: scale(1.72);
    box-shadow: 0 24px 58px rgba(70, 48, 31, 0.28);
  }

  &__photo:hover &__mood {
    transform: scale(1.42) translate(2px, 2px);
  }

  &__hover-note {
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: -42px;
    z-index: 2;
    max-height: 68%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    color: #fffaf0;
    font-size: 13px;
    font-weight: 900;
    line-height: 1.42;
    text-shadow:
      0 2px 10px rgba(35, 24, 16, 0.78),
      0 0 2px #3d3328;
    opacity: 0;
    transform: translateY(8px);
    transition:
      opacity 180ms ease,
      transform 180ms ease;
  }

  &__photo:hover &__hover-note {
    opacity: 1;
    transform: translateY(0);
  }

  &__mood {
    position: absolute;
    right: -8px;
    bottom: -8px;
    z-index: 3;
    width: 34px;
    height: 34px;
    border: 2px solid rgba(255, 250, 240, 0.9);
    border-radius: 50%;
    background: color-mix(in srgb, var(--mood-color) 58%, white);
    display: grid;
    place-items: center;
    color: #3d3328;
    font-size: 21px;
    font-weight: 900;
    line-height: 1.15;
    box-shadow: 0 8px 16px rgba(70, 48, 31, 0.2);
    transform-origin: center;
    transition:
      transform 220ms ease,
      box-shadow 220ms ease;
  }

  &__note {
    display: -webkit-box;
    margin: -2px 0 0;
    overflow: hidden;
    color: #7d6650;
    font-size: 11px;
    line-height: 1.35;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  &__date {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: @space-sm;
  }

  &__date span {
    color: #9b8065;
    font-size: 11px;
    font-weight: 800;
  }

  &__date strong {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 18px;
  }

  &__empty {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 8px;
    border: 1px dashed rgba(61, 51, 40, 0.16);
    background:
      radial-gradient(circle at 70% 28%, rgba(255, 191, 63, 0.16) 0 22px, transparent 24px),
      rgba(255, 255, 255, 0.42);
    display: grid;
    place-items: center;
    color: rgba(111, 91, 70, 0.48);
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.12em;
  }
}

.mood-rhythm {
  display: flex;
  min-height: 22px;
  overflow: hidden;
  border: 5px solid rgba(255, 252, 241, 0.8);
  border-radius: 999px;
  background: #fff4d4;
  margin-bottom: @space-xl;
  box-shadow: 0 10px 24px rgba(124, 83, 45, 0.12);

  span {
    flex: 1;
    min-width: 12px;
  }

  span.is-empty {
    opacity: 0.32;
  }
}

.photo-mosaic {
  columns: 4 190px;
  column-gap: @space-md;

  figure {
    --mood-color: #6dc6c9;
    break-inside: avoid;
    margin: 0 0 @space-md;
    padding: 9px 9px 0;
    border-radius: 24px;
    overflow: visible;
    background: #fffaf0;
    border: 1px solid rgba(61, 51, 40, 0.12);
    box-shadow: 0 16px 36px rgba(118, 78, 42, 0.14);
  }

  &__photo {
    overflow: visible;
    position: relative;
    z-index: 1;
  }

  &__photo img {
    width: 100%;
    border-radius: 17px;
    display: block;
    transition:
      transform 220ms ease,
      box-shadow 220ms ease;
  }

  &__photo:hover {
    z-index: 8;
  }

  &__photo:hover img {
    transform: scale(1.3);
    box-shadow: 0 24px 58px rgba(70, 48, 31, 0.28);
  }

  &__hover-note {
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: -34px;
    z-index: 2;
    margin: 0;
    padding: 0;
    color: #fffaf0;
    font-size: 14px;
    font-weight: 900;
    line-height: 1.55;
    text-shadow:
      0 2px 12px rgba(35, 24, 16, 0.82),
      0 0 2px #3d3328;
    opacity: 0;
    transform: translateY(10px);
    transition:
      opacity 180ms ease,
      transform 180ms ease;
  }

  &__photo:hover &__hover-note {
    opacity: 1;
    transform: translateY(0);
  }

  figcaption {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 4px;
    border-top: 7px solid var(--mood-color);
    padding: @space-sm @space-xs @space-md;
    color: #5a4634;
    font-size: @font-size-sm;
    font-weight: 800;
  }

  figcaption strong {
    font-size: 24px;
    line-height: 1;
  }
}

@media (max-width: 980px) {
  .month-calendar {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .review-page__header {
    display: block;

    h1 {
      font-size: 34px;
    }
  }

  .review-page__back {
    display: inline-block;
    margin-top: @space-lg;
  }

  .month-calendar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .month-calendar__photo:hover img,
  .photo-mosaic__photo:hover img {
    transform: scale(1.08);
  }
}
</style>
