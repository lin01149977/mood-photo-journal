<script setup lang="ts">
import type { Journal } from '../types'

defineProps<{
  entry: Journal
}>()

defineEmits<{
  (e: 'remove', entry: Journal): void
}>()

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
}
</script>

<template>
  <article class="journal-card" :style="{ '--mood-color': entry.moodColor }">
    <div class="journal-card__photos" :class="`is-count-${entry.photos.length}`">
      <img v-for="photo in entry.photos" :key="photo" :src="photo" alt="" />
    </div>
    <div class="journal-card__body">
      <div class="journal-card__meta">
        <span class="journal-card__date">{{ formatDate(entry.entryDate) }}</span>
        <span class="journal-card__mood">{{ entry.mood }}</span>
      </div>
      <p v-if="entry.note" class="journal-card__note">{{ entry.note }}</p>
      <p v-else class="journal-card__note is-muted">这一天被照片记住了。</p>
      <button class="journal-card__remove" type="button" @click="$emit('remove', entry)">
        删除
      </button>
    </div>
  </article>
</template>

<style lang="less" scoped>
.journal-card {
  --mood-color: #68a7ad;
  display: grid;
  grid-template-columns: minmax(220px, 42%) 1fr;
  overflow: hidden;
  border: 1px solid rgba(31, 41, 55, 0.1);
  border-left: 8px solid var(--mood-color);
  border-radius: @radius-lg;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 18px 40px rgba(53, 70, 62, 0.1);
  animation: card-in 420ms ease both;

  &__photos {
    min-height: 210px;
    display: grid;
    gap: 3px;
    background: #d9ddd2;

    img {
      width: 100%;
      height: 100%;
      min-height: 0;
      object-fit: cover;
    }

    &.is-count-2,
    &.is-count-3 {
      grid-template-columns: repeat(2, 1fr);
    }

    &.is-count-3 img:first-child {
      grid-row: span 2;
    }
  }

  &__body {
    min-width: 0;
    padding: @space-xl;
    display: flex;
    flex-direction: column;
    gap: @space-lg;
  }

  &__meta {
    display: flex;
    flex-wrap: wrap;
    gap: @space-sm;
    align-items: center;
  }

  &__date {
    font-size: @font-size-lg;
    font-weight: 700;
    color: #25312b;
  }

  &__mood {
    padding: 4px 9px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--mood-color) 22%, white);
    color: #25312b;
    font-size: @font-size-sm;
  }

  &__note {
    margin: 0;
    color: #425248;
    line-height: 1.8;
    white-space: pre-wrap;

    &.is-muted {
      color: #8a948e;
    }
  }

  &__remove {
    margin-top: auto;
    align-self: flex-start;
    border: 0;
    background: transparent;
    color: #9d4b45;
    cursor: pointer;
    padding: 0;
  }
}

@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 760px) {
  .journal-card {
    grid-template-columns: 1fr;

    &__photos {
      min-height: 260px;
    }
  }
}
</style>
