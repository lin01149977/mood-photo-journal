<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import BaseButton from '@/components/BaseButton/index.vue'
import BaseEmpty from '@/components/BaseEmpty/index.vue'
import JournalEntryCard from '../components/JournalEntryCard.vue'
import { useJournalList } from '../composables/useJournalList'
import type { Journal } from '../types'

const { items, loading, error, monthDays, photoCount, moods, fetchAll, create, remove } = useJournalList()

const today = new Date().toISOString().slice(0, 10)
const entryDate = ref(today)
const selectedMood = ref(moods[0].id)
const note = ref('')
const photos = ref<string[]>([])
const submitting = ref(false)

const activeMood = computed(() => moods.find((mood) => mood.id === selectedMood.value) ?? moods[0])
const canSubmit = computed(() => photos.value.length > 0 && photos.value.length <= 3 && !submitting.value)
const isBackfill = computed(() => entryDate.value < today)
const monthPreviewDays = computed(() => monthDays.value.slice(0, 14))

onMounted(() => fetchAll())

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}

async function compressPhoto(file: File) {
  const source = await fileToDataUrl(file)
  const image = await loadImage(source)
  const maxEdge = 980
  const scale = Math.min(1, maxEdge / Math.max(image.width, image.height))
  const width = Math.max(1, Math.round(image.width * scale))
  const height = Math.max(1, Math.round(image.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) return source
  context.drawImage(image, 0, 0, width, height)
  return canvas.toDataURL('image/jpeg', 0.72)
}

async function onPickPhotos(event: Event) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files ?? []).slice(0, 3)
  photos.value = await Promise.all(files.map(compressPhoto))
  input.value = ''
}

async function onSubmit() {
  if (!canSubmit.value) return
  submitting.value = true
  try {
    await create({
      entryDate: entryDate.value,
      mood: `${activeMood.value.emoji} ${activeMood.value.label}`,
      moodColor: activeMood.value.color,
      note: note.value.trim(),
      photos: photos.value,
    })
    entryDate.value = today
    selectedMood.value = moods[0].id
    note.value = ''
    photos.value = []
  } finally {
    submitting.value = false
  }
}

function onRemove(entry: Journal) {
  void remove(entry.id)
}
</script>

<template>
  <section class="journal-page">
    <header class="journal-page__hero">
      <div class="journal-page__hero-copy">
        <p class="journal-page__eyebrow">visual diary</p>
        <h1>把今天贴成一页彩色手账</h1>
        <p class="journal-page__copy">
          用 1-3 张照片、一种心情颜色和一句小注脚，把生活里容易流走的片刻轻轻留下。
        </p>
        <div class="journal-page__stickers" aria-hidden="true">
          <span>sunny</span>
          <span>memory</span>
          <span>little day</span>
        </div>
      </div>
      <RouterLink class="journal-page__review-link" to="/journal/review">翻看本月回忆</RouterLink>
    </header>

    <section class="journal-page__month-strip" aria-label="本月记录预览">
      <div
        v-for="day in monthPreviewDays"
        :key="day.key"
        class="journal-page__month-day"
        :class="{ 'has-entry': day.entry }"
        :style="{ '--day-color': day.color }"
      >
        <span>{{ day.weekday }}</span>
        <strong>{{ day.day }}</strong>
      </div>
    </section>

    <section class="composer" :style="{ '--active-mood': activeMood.color }">
      <div class="composer__intro">
        <span class="composer__tag">new page</span>
        <h2>今天发生了什么？</h2>
        <p>先放照片，再选颜色。像给这一天贴一枚小小的标签。</p>
      </div>

      <div class="composer__photos">
        <label class="composer__picker">
          <input type="file" accept="image/*" multiple @change="onPickPhotos" />
          <span>选择照片</span>
          <small>{{ photos.length }}/3</small>
        </label>
        <div v-for="photo in photos" :key="photo" class="composer__preview">
          <img :src="photo" alt="" />
        </div>
      </div>

      <div class="composer__fields">
        <label class="composer__date-label">
          <span>{{ isBackfill ? '正在补记过去的一天' : '记录日期' }}</span>
          <input v-model="entryDate" class="composer__date" type="date" :max="today" />
        </label>
        <div class="composer__moods" aria-label="选择情绪">
          <button
            v-for="mood in moods"
            :key="mood.id"
            class="composer__mood"
            :class="{ 'is-active': selectedMood === mood.id }"
            :style="{ '--mood-color': mood.color }"
            type="button"
            @click="selectedMood = mood.id"
          >
            <span class="composer__emoji">{{ mood.emoji }}</span>
            {{ mood.label }}
          </button>
        </div>
        <textarea
          v-model="note"
          class="composer__note"
          maxlength="500"
          placeholder="写一句那天想留下的话，比如：午后的风很好，路边的花也很好。"
        />
        <BaseButton :loading="submitting" :disabled="!canSubmit" @click="onSubmit">
          {{ isBackfill ? '保存补记' : '保存今天' }}
        </BaseButton>
      </div>
    </section>

    <div class="journal-page__stats">
      <span>{{ items.length }} 篇日记</span>
      <span>{{ photoCount }} 张照片</span>
      <span v-if="error">{{ error }}</span>
    </div>

    <div class="journal-page__list">
      <div v-if="loading && items.length === 0" class="journal-page__loading">正在整理回忆...</div>
      <BaseEmpty v-else-if="items.length === 0" description="还没有日记。先选几张照片开始吧。" />
      <JournalEntryCard
        v-for="entry in items"
        v-else
        :key="entry.id"
        :entry="entry"
        @remove="onRemove"
      />
    </div>
  </section>
</template>

<style lang="less" scoped>
.journal-page {
  max-width: 1120px;
  margin: 0 auto;
  color: #3d3328;

  &__hero {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: @space-xl;
    align-items: end;
    padding: 56px 0 30px;
  }

  &__hero-copy {
    position: relative;
    padding: 34px;
    border: 2px solid rgba(68, 50, 34, 0.1);
    border-radius: 36px;
    background:
      radial-gradient(circle at 88% 18%, rgba(255, 191, 63, 0.28) 0 64px, transparent 66px),
      radial-gradient(circle at 14% 86%, rgba(109, 198, 201, 0.24) 0 78px, transparent 80px),
      rgba(255, 252, 241, 0.82);
    box-shadow: 0 24px 60px rgba(124, 83, 45, 0.15);
    backdrop-filter: blur(10px);
  }

  &__hero-copy::before {
    content: '';
    position: absolute;
    top: -13px;
    left: 42px;
    width: 118px;
    height: 28px;
    border-radius: 5px;
    background: rgba(255, 143, 163, 0.54);
    transform: rotate(-4deg);
  }

  &__hero h1 {
    max-width: 720px;
    margin: 0;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(38px, 6.3vw, 68px);
    line-height: 0.98;
    color: #382b20;
    letter-spacing: -0.04em;
  }

  &__eyebrow {
    margin: 0 0 @space-sm;
    color: #ff7a45;
    font-weight: 900;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  &__copy {
    max-width: 620px;
    margin: @space-lg 0 0;
    color: #765f4a;
    font-size: @font-size-lg;
    line-height: 1.9;
  }

  &__stickers {
    display: flex;
    flex-wrap: wrap;
    gap: @space-sm;
    margin-top: @space-xl;
  }

  &__stickers span {
    padding: 7px 12px;
    border: 1px solid rgba(61, 51, 40, 0.12);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.62);
    color: #8b6d4d;
    font-size: 12px;
    font-weight: 800;
  }

  &__review-link {
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

  &__month-strip {
    display: grid;
    grid-template-columns: repeat(14, minmax(0, 1fr));
    gap: @space-xs;
    margin-bottom: @space-xl;
    padding: @space-md;
    border-radius: 26px;
    background: rgba(255, 252, 241, 0.68);
    border: 1px solid rgba(61, 51, 40, 0.08);
  }

  &__month-day {
    --day-color: #f0dcc9;
    min-height: 68px;
    padding: @space-xs @space-sm;
    border: 1px dashed rgba(61, 51, 40, 0.15);
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.54);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__month-day span {
    color: #9b8065;
    font-size: 11px;
    font-weight: 700;
  }

  &__month-day strong {
    color: #3d3328;
    font-size: @font-size-lg;
  }

  &__month-day.has-entry {
    background: color-mix(in srgb, var(--day-color) 28%, white);
    box-shadow: inset 0 -6px 0 var(--day-color);
  }

  &__stats {
    display: flex;
    flex-wrap: wrap;
    gap: @space-md;
    margin: @space-xl 0 @space-lg;
  }

  &__stats span {
    padding: 9px 14px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.62);
    color: #6f5b46;
    font-weight: 800;
  }

  &__list {
    display: grid;
    gap: @space-xl;
  }

  &__loading {
    padding: @space-xxl;
    text-align: center;
    color: #765f4a;
  }
}

.composer {
  --active-mood: #ffbf3f;
  position: relative;
  display: grid;
  grid-template-columns: 0.72fr 1fr 1.1fr;
  gap: @space-xl;
  padding: @space-xl;
  border: 2px solid rgba(61, 51, 40, 0.12);
  border-radius: 34px;
  background:
    radial-gradient(circle at 4% 12%, color-mix(in srgb, var(--active-mood) 34%, transparent) 0 86px, transparent 88px),
    linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(255, 244, 210, 0.9));
  box-shadow: 0 22px 56px rgba(124, 83, 45, 0.14);
  backdrop-filter: blur(12px);

  &__intro {
    padding: @space-lg;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.46);
  }

  &__tag {
    display: inline-block;
    padding: 6px 11px;
    border-radius: 999px;
    background: #ffcf6b;
    color: #3d3328;
    font-size: 12px;
    font-weight: 900;
    text-transform: uppercase;
    transform: rotate(-4deg);
  }

  &__intro h2 {
    margin: @space-md 0 @space-sm;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 32px;
    line-height: 1.05;
  }

  &__intro p {
    margin: 0;
    color: #765f4a;
    line-height: 1.8;
  }

  &__photos {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: @space-sm;
  }

  &__picker,
  &__preview {
    aspect-ratio: 1;
    border-radius: 22px;
    overflow: hidden;
  }

  &__picker {
    border: 2px dashed rgba(61, 51, 40, 0.22);
    background: rgba(255, 255, 255, 0.62);
    color: #6f5b46;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-weight: 900;
  }

  &__picker input {
    display: none;
  }

  &__picker small {
    margin-top: 4px;
    color: #ff7a45;
  }

  &__preview {
    padding: 7px;
    background: #fffaf0;
    box-shadow: 0 10px 24px rgba(70, 48, 31, 0.12);
  }

  &__preview img {
    width: 100%;
    height: 100%;
    border-radius: 16px;
    object-fit: cover;
    display: block;
  }

  &__fields {
    display: grid;
    gap: @space-md;
  }

  &__date-label {
    display: grid;
    gap: @space-xs;
    color: #765f4a;
    font-size: @font-size-sm;
    font-weight: 800;
  }

  &__date,
  &__note {
    width: 100%;
    border: 2px solid rgba(61, 51, 40, 0.12);
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.78);
    color: #3d3328;
  }

  &__date {
    padding: 11px 13px;
  }

  &__note {
    min-height: 108px;
    padding: @space-md;
    resize: vertical;
    line-height: 1.7;
  }

  &__moods {
    display: flex;
    flex-wrap: wrap;
    gap: @space-sm;
  }

  &__mood {
    --mood-color: #ffbf3f;
    display: inline-flex;
    align-items: center;
    gap: @space-xs;
    border: 2px solid transparent;
    border-radius: 999px;
    padding: 7px 12px 7px 8px;
    background: rgba(255, 255, 255, 0.7);
    color: #3d3328;
    cursor: pointer;
    font-weight: 800;
  }

  &__emoji {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--mood-color) 28%, white);
    display: grid;
    place-items: center;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--mood-color) 18%, transparent);
    font-size: 16px;
  }

  &__mood.is-active {
    border-color: var(--mood-color);
    background: color-mix(in srgb, var(--mood-color) 22%, white);
    transform: translateY(-1px) rotate(-1deg);
  }
}

@media (max-width: 980px) {
  .journal-page__month-strip {
    grid-template-columns: repeat(7, minmax(42px, 1fr));
  }

  .composer {
    grid-template-columns: 1fr 1fr;

    &__intro {
      grid-column: 1 / -1;
    }
  }
}

@media (max-width: 760px) {
  .journal-page {
    &__hero {
      grid-template-columns: 1fr;
      padding-top: @space-xl;
    }

    &__review-link {
      justify-self: start;
    }
  }

  .composer {
    grid-template-columns: 1fr;

    &__photos {
      grid-template-columns: repeat(3, minmax(82px, 1fr));
    }
  }
}
</style>
