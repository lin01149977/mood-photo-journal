<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="layout">
    <header class="layout__header">
      <RouterLink to="/" class="layout__brand">
        <span class="layout__brand-mark">日</span>
        <span>
          Mood Journal
          <small>把日子贴进相册里</small>
        </span>
      </RouterLink>
      <nav class="layout__nav">
        <RouterLink to="/journal" active-class="is-active">今日手账</RouterLink>
        <RouterLink to="/journal/review" active-class="is-active">月度回望</RouterLink>
      </nav>
    </header>
    <main class="layout__main">
      <RouterView />
    </main>
  </div>
</template>

<style lang="less" scoped>
.layout {
  min-height: 100%;
  display: flex;
  flex-direction: column;

  &__header {
    position: sticky;
    top: @space-md;
    z-index: 20;
    min-height: 78px;
    margin: @space-md auto 0;
    width: min(1120px, calc(100% - 32px));
    padding: 12px 16px;
    border: 2px solid rgba(80, 63, 42, 0.12);
    border-radius: 28px;
    background:
      linear-gradient(100deg, rgba(255, 255, 255, 0.84), rgba(255, 245, 213, 0.82)),
      repeating-linear-gradient(135deg, rgba(255, 198, 97, 0.18) 0 8px, transparent 8px 16px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: @space-lg;
    box-shadow: 0 16px 44px rgba(132, 91, 52, 0.14);
    backdrop-filter: blur(14px);
  }

  &__brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-weight: 800;
    font-size: @font-size-lg;
    color: #3d3328;
  }

  &__brand small {
    display: block;
    margin-top: 2px;
    color: #9b7652;
    font-size: 12px;
    font-weight: 600;
  }

  &__brand-mark {
    width: 42px;
    height: 42px;
    border: 2px solid #3d3328;
    border-radius: 14px 18px 12px 20px;
    background: #ffcf6b;
    display: grid;
    place-items: center;
    box-shadow: 4px 5px 0 #f08f73;
    transform: rotate(-5deg);
  }

  &__nav {
    display: flex;
    gap: @space-sm;
  }

  &__nav a {
    color: #6f5b46;
    padding: 10px 14px;
    border: 1px solid transparent;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.48);
    font-weight: 700;
  }

  &__nav a.is-active {
    color: #3d3328;
    border-color: rgba(255, 122, 69, 0.36);
    background: #ffe09a;
    box-shadow: inset 0 -3px 0 rgba(255, 122, 69, 0.32);
  }

  &__main {
    flex: 1;
    padding: 0 @space-xl @space-xxl;
  }
}

@media (max-width: 680px) {
  .layout {
    &__header {
      align-items: flex-start;
      flex-direction: column;
      top: 8px;
    }

    &__nav {
      width: 100%;
    }

    &__nav a {
      flex: 1;
      text-align: center;
    }
  }
}
</style>
