import { type RouteRecordRaw } from 'vue-router'

export const constantRouter: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/index/index.vue'),
    meta: {
      hidden: true,
    },
  },
]
