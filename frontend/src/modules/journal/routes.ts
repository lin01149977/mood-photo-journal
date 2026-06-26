import type { RouteRecordRaw } from 'vue-router'

export const journalRoutes: RouteRecordRaw[] = [
  {
    path: 'journal',
    name: 'journal-list',
    component: () => import('./views/JournalListView.vue'),
  },
  {
    path: 'journal/review',
    name: 'journal-review',
    component: () => import('./views/JournalReviewView.vue'),
  },
]
