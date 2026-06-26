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
        <img v-if="day.entry?.photos[0]" :src="day.entry.photos[0]" alt="" />
        <div v-else class="month-calendar__empty">
          <span>blank</span>
        </div>
        <p>{{ day.entry?.mood ?? '未记录' }}</p>
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
        <img :src="photo" alt="" />
        <figcaption>
          <span>{{ entry.entryDate }}</span>
          <strong>{{ entry.mood }}</strong>
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
    min-height: 196px;
    padding: @space-sm;
    border: 1px dashed rgba(61, 51, 40, 0.18);
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.52);
    display: flex;
    flex-direction: column;
    gap: @space-sm;
  }

  &__day.has-entry {
    background:
      linear-gradient(180deg, color-mix(in srgb, var(--mood-color) 24%, white), rgba(255, 255, 255, 0.76));
    border-style: solid;
    box-shadow: inset 0 -7px 0 var(--mood-color), 0 12px 24px rgba(78, 52, 31, 0.1);
  }

  &__day img,
  &__empty {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 18px;
  }

  &__day img {
    object-fit: cover;
    box-shadow: 0 8px 18px rgba(70, 48, 31, 0.12);
  }

  &__day p {
    margin: auto 0 0;
    color: #6f5b46;
    font-size: @font-size-sm;
    font-weight: 800;
  }

  &__date {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: @space-sm;
  }

  &__date span {
    color: #9b8065;
    font-size: @font-size-sm;
    font-weight: 800;
  }

  &__date strong {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: @font-size-xl;
  }

  &__empty {
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
    overflow: hidden;
    background: #fffaf0;
    border: 1px solid rgba(61, 51, 40, 0.12);
    box-shadow: 0 16px 36px rgba(118, 78, 42, 0.14);
  }

  img {
    width: 100%;
    border-radius: 17px;
    display: block;
  }

  figcaption {
    display: flex;
    justify-content: space-between;
    gap: @space-sm;
    border-top: 7px solid var(--mood-color);
    padding: @space-sm @space-xs @space-md;
    color: #5a4634;
    font-size: @font-size-sm;
    font-weight: 800;
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
}
</style>
