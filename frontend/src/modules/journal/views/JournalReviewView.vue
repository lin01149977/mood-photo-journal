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
        <h1>{{ monthTitle }}</h1>
        <p>每一天都在这里。被照片记住的日子有颜色，空白的日子也安静地占有一格。</p>
      </div>
      <RouterLink class="review-page__back" to="/journal">返回日记</RouterLink>
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
        <div v-else class="month-calendar__empty" />
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
      <p v-if="monthPhotos.length === 0" class="review-page__hint">这个月还没有照片，先从某一天开始补记。</p>
    </section>
  </section>
</template>

<style lang="less" scoped>
.review-page {
  max-width: 1120px;
  margin: 0 auto;
  color: #25312b;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: @space-xl;
    padding: @space-xxl 0 @space-xl;

    h1 {
      margin: 0;
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 42px;
      line-height: 1.1;
    }

    p {
      max-width: 620px;
      margin: @space-md 0 0;
      color: #66736b;
      font-size: @font-size-lg;
    }
  }

  &__eyebrow {
    margin: 0 0 @space-sm;
    color: #e06f37;
    font-weight: 700;
    text-transform: uppercase;
  }

  &__back {
    flex: 0 0 auto;
    padding: 10px 16px;
    border-radius: @radius-md;
    border: 1px solid #c9d1c7;
    color: #25312b;
    background: rgba(255, 255, 255, 0.72);
  }

  &__summary {
    display: flex;
    flex-wrap: wrap;
    gap: @space-md;
    margin-bottom: @space-xl;
    color: #66736b;
  }

  &__hint {
    color: #66736b;
  }
}

.month-calendar {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: @space-sm;
  margin-bottom: @space-xl;

  &__day {
    --mood-color: #d9ded6;
    min-height: 190px;
    padding: @space-md;
    border-radius: @radius-lg;
    background: rgba(255, 255, 255, 0.58);
    border: 1px solid rgba(37, 49, 43, 0.09);
    display: flex;
    flex-direction: column;
    gap: @space-sm;
    backdrop-filter: blur(8px);

    &.has-entry {
      background: color-mix(in srgb, var(--mood-color) 18%, white);
      box-shadow: inset 0 -6px 0 var(--mood-color), 0 10px 26px rgba(53, 70, 62, 0.08);
    }

    img,
    .month-calendar__empty {
      width: 100%;
      aspect-ratio: 1;
      border-radius: @radius-md;
    }

    img {
      object-fit: cover;
    }

    p {
      margin: auto 0 0;
      color: #5c6a61;
      font-size: @font-size-sm;
    }
  }

  &__date {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: @space-sm;

    span {
      color: #7b867d;
      font-size: @font-size-sm;
    }

    strong {
      font-size: @font-size-xl;
    }
  }

  &__empty {
    border: 1px dashed rgba(37, 49, 43, 0.14);
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.34), rgba(217, 222, 214, 0.34)),
      rgba(255, 255, 255, 0.34);
  }
}

.mood-rhythm {
  display: flex;
  min-height: 18px;
  overflow: hidden;
  border-radius: 999px;
  background: #edf0e9;
  margin-bottom: @space-xl;

  span {
    flex: 1;
    min-width: 12px;

    &.is-empty {
      opacity: 0.32;
    }
  }
}

.photo-mosaic {
  columns: 4 190px;
  column-gap: @space-md;

  figure {
    --mood-color: #68a7ad;
    break-inside: avoid;
    margin: 0 0 @space-md;
    border-radius: @radius-lg;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.82);
    border: 1px solid rgba(37, 49, 43, 0.1);
    box-shadow: 0 14px 34px rgba(53, 70, 62, 0.1);
  }

  img {
    width: 100%;
    display: block;
  }

  figcaption {
    display: flex;
    justify-content: space-between;
    gap: @space-sm;
    border-top: 5px solid var(--mood-color);
    padding: @space-sm @space-md @space-md;
    color: #425248;
    font-size: @font-size-sm;
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
