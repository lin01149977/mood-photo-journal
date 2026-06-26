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
      mood: activeMood.value.label,
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
      <div>
        <p class="journal-page__eyebrow">visual diary</p>
        <h1>把日子补成一片有颜色的风景</h1>
        <p class="journal-page__copy">
          可以记录今天，也可以补记过去某一天。选 1-3 张照片、一种情绪颜色和一句话，让回忆有地方停靠。
        </p>
      </div>
      <RouterLink class="journal-page__review-link" to="/journal/review">查看月回顾</RouterLink>
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
            <span />
            {{ mood.label }}
          </button>
        </div>
        <textarea
          v-model="note"
          class="composer__note"
          maxlength="500"
          placeholder="写一句那天想留下的话"
        />
        <BaseButton :loading="submitting" :disabled="!canSubmit" @click="onSubmit">
          {{ isBackfill ? '保存补记' : '保存今天' }}
        </BaseButton>
      </div>
    </section>

    <div class="journal-page__stats">
      <span>{{ items.length }} 篇记录</span>
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
  color: #25312b;

  &__hero {
    display: flex;
    justify-content: space-between;
    gap: @space-xl;
    align-items: flex-end;
    padding: @space-xxl 0;

    h1 {
      margin: 0;
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 44px;
      line-height: 1.08;
      color: #20372f;
    }
  }

  &__eyebrow {
    margin: 0 0 @space-sm;
    color: #e06f37;
    font-weight: 700;
    text-transform: uppercase;
  }

  &__copy {
    max-width: 620px;
    margin: @space-md 0 0;
    color: #66736b;
    font-size: @font-size-lg;
  }

  &__review-link {
    flex: 0 0 auto;
    padding: 10px 16px;
    border: 1px solid #c9d1c7;
    border-radius: @radius-md;
    color: #25312b;
    background: rgba(255, 255, 255, 0.72);
  }

  &__month-strip {
    display: grid;
    grid-template-columns: repeat(14, minmax(0, 1fr));
    gap: @space-xs;
    margin-bottom: @space-xl;
  }

  &__month-day {
    --day-color: #d9ded6;
    min-height: 64px;
    padding: @space-xs @space-sm;
    border-radius: @radius-md;
    background: rgba(255, 255, 255, 0.64);
    border: 1px solid rgba(37, 49, 43, 0.08);
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    span {
      color: #768178;
      font-size: 11px;
    }

    strong {
      color: #2d3c34;
      font-size: @font-size-lg;
    }

    &.has-entry {
      background: color-mix(in srgb, var(--day-color) 22%, white);
      box-shadow: inset 0 -5px 0 var(--day-color);
    }
  }

  &__stats {
    display: flex;
    flex-wrap: wrap;
    gap: @space-md;
    margin: @space-xl 0 @space-lg;
    color: #66736b;
  }

  &__list {
    display: grid;
    gap: @space-xl;
  }

  &__loading {
    padding: @space-xxl;
    text-align: center;
    color: #66736b;
  }
}

.composer {
  --active-mood: #f4b942;
  display: grid;
  grid-template-columns: minmax(300px, 0.9fr) 1.1fr;
  gap: @space-xl;
  padding: @space-xl;
  border-radius: @radius-lg;
  background:
    linear-gradient(135deg, rgba(244, 185, 66, 0.16), rgba(104, 167, 173, 0.18)),
    rgba(251, 250, 245, 0.88);
  border: 1px solid rgba(37, 49, 43, 0.1);
  backdrop-filter: blur(10px);

  &__photos {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: @space-sm;
  }

  &__picker,
  &__preview {
    aspect-ratio: 1;
    border-radius: @radius-md;
    overflow: hidden;
  }

  &__picker {
    border: 1px dashed #8b9a8c;
    background: rgba(255, 255, 255, 0.62);
    color: #425248;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    input {
      display: none;
    }
  }

  &__preview img {
    width: 100%;
    height: 100%;
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
    color: #5e6c63;
    font-size: @font-size-sm;
  }

  &__date,
  &__note {
    width: 100%;
    border: 1px solid #c9d1c7;
    border-radius: @radius-md;
    background: rgba(255, 255, 255, 0.82);
    color: #25312b;
  }

  &__date {
    padding: 10px 12px;
  }

  &__note {
    min-height: 96px;
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
    --mood-color: #f4b942;
    display: inline-flex;
    align-items: center;
    gap: @space-xs;
    border: 1px solid transparent;
    border-radius: 999px;
    padding: 7px 11px;
    background: rgba(255, 255, 255, 0.7);
    color: #25312b;
    cursor: pointer;

    span {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--mood-color);
    }

    &.is-active {
      border-color: var(--mood-color);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--mood-color) 26%, transparent);
    }
  }
}

@media (max-width: 920px) {
  .journal-page__month-strip {
    grid-template-columns: repeat(7, minmax(42px, 1fr));
  }
}

@media (max-width: 820px) {
  .journal-page {
    &__hero {
      display: block;

      h1 {
        font-size: 34px;
      }
    }

    &__review-link {
      display: inline-block;
      margin-top: @space-lg;
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
