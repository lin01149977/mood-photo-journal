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
    <div class="journal-card__tape">memory</div>
    <div class="journal-card__photos" :class="`is-count-${entry.photos.length}`">
      <img v-for="photo in entry.photos" :key="photo" :src="photo" alt="" />
    </div>
    <div class="journal-card__body">
      <div class="journal-card__meta">
        <span class="journal-card__date">{{ formatDate(entry.entryDate) }}</span>
        <span class="journal-card__mood">{{ entry.mood }}</span>
      </div>
      <p v-if="entry.note" class="journal-card__note">{{ entry.note }}</p>
      <p v-else class="journal-card__note is-muted">这一天被照片轻轻夹进了相册。</p>
      <button class="journal-card__remove" type="button" @click="$emit('remove', entry)">
        删除这页
      </button>
    </div>
  </article>
</template>

<style lang="less" scoped>
.journal-card {
  --mood-color: #6dc6c9;
  position: relative;
  display: grid;
  grid-template-columns: minmax(240px, 43%) 1fr;
  gap: @space-lg;
  padding: @space-lg;
  border: 2px solid rgba(66, 49, 35, 0.12);
  border-radius: 30px;
  background:
    radial-gradient(circle at 96% 14%, color-mix(in srgb, var(--mood-color) 20%, transparent) 0 58px, transparent 60px),
    linear-gradient(145deg, rgba(255, 255, 255, 0.92), rgba(255, 247, 224, 0.88));
  box-shadow: 0 20px 44px rgba(118, 78, 42, 0.14);
  animation: card-in 420ms ease both;

  &::after {
    content: '✦';
    position: absolute;
    right: 22px;
    bottom: 14px;
    color: color-mix(in srgb, var(--mood-color) 74%, #ff7a45);
    font-size: 28px;
    transform: rotate(12deg);
  }

  &__tape {
    position: absolute;
    top: -12px;
    left: 34px;
    z-index: 2;
    padding: 5px 20px;
    border-radius: 4px;
    background: rgba(255, 207, 107, 0.78);
    color: rgba(61, 51, 40, 0.72);
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    transform: rotate(-3deg);
  }

  &__photos {
    min-height: 230px;
    padding: 10px 10px 24px;
    display: grid;
    gap: 8px;
    border-radius: 22px;
    background: #fffaf0;
    box-shadow: inset 0 -10px 0 rgba(61, 51, 40, 0.05);
    transform: rotate(-1.2deg);

    img {
      width: 100%;
      height: 100%;
      min-height: 0;
      border-radius: 14px;
      object-fit: cover;
      box-shadow: 0 8px 18px rgba(70, 48, 31, 0.12);
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
    padding: @space-md @space-md @space-sm;
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
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 24px;
    font-weight: 800;
    color: #3d3328;
  }

  &__mood {
    padding: 6px 12px;
    border: 1px solid color-mix(in srgb, var(--mood-color) 62%, #ffffff);
    border-radius: 999px;
    background: color-mix(in srgb, var(--mood-color) 26%, white);
    color: #3d3328;
    font-size: @font-size-sm;
    font-weight: 800;
  }

  &__note {
    position: relative;
    margin: 0;
    padding: @space-md;
    border-radius: 18px;
    background:
      linear-gradient(rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.72)),
      repeating-linear-gradient(0deg, transparent 0 27px, rgba(255, 191, 63, 0.16) 28px 29px);
    color: #5a4634;
    line-height: 1.85;
    white-space: pre-wrap;

    &.is-muted {
      color: #9a846d;
    }
  }

  &__remove {
    margin-top: auto;
    align-self: flex-start;
    border: 0;
    border-bottom: 2px solid rgba(255, 122, 69, 0.36);
    background: transparent;
    color: #ba5b4f;
    cursor: pointer;
    padding: 0 0 2px;
    font-weight: 700;
  }
}

@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(12px) rotate(-0.4deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotate(0);
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
