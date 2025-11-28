import { createWebHistory, createRouter } from 'vue-router'
import IndexView from '../views/IndexView.vue';
import OverView from '../views/OverView.vue';
import FileView from '../views/FileView.vue';
import ArticleView from '../views/ArticleView.vue';
import GalleryView from '../views/GalleryView.vue'
import DiaryView from '../views/DiaryView.vue'
import EditGalleryView from '../views/EditGalleryView.vue'
import EditArticleView from '../views/EditArticleView.vue'
import EditResourceView from '../views/EditResourceView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import SettingView from '../views/SettingView.vue'
import ResourceView from '../views/ResourceView.vue';
import NotFound from '../views/404.vue'
import { verifyApi } from '../api/login';
import { YkMessage } from '@yike-design/ui';
import pinia from '../store'
import { useUserStore } from '../store/user'
const routes = [
  {
    path: '/',
    component: IndexView,
    redirect: '/overview',
    children: [
      { path: '/overview', component: OverView },
      { path: '/localfile', component: FileView },
      { path: '/article', component: ArticleView },
      { path: '/gallery', component: GalleryView },
      { path: '/diary', component: DiaryView },
      { path: '/resource', component: ResourceView },
      { path: '/setting', component: SettingView },
    ]
  },
  { path: '/editgallery', component: EditGalleryView },
  { path: '/editarticle', component: EditArticleView },
  { path: '/editresource', component: EditResourceView },
  { path: '/login', component: LoginView, meta: { hideHeader: true } },
  { path: '/register', component: RegisterView, meta: { hideHeader: true } },
  // 404 捕获路由
  { path: '/:pathMatch(.*)*', component: NotFound, meta: { hideHeader: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 白名单：无需登录
const whiteList = ['/login', '/register']
const userStore = useUserStore(pinia)

router.beforeEach(async (to, _from, next) => {
  const hasToken = Boolean(userStore.token)
  const isWhite = whiteList.includes(to.path)

  if (isWhite) {
    if (!hasToken) return next()
    try {
      await verifyApi()
      return next('/')
    } catch {
      userStore.clearUser()
      return next()
    }
  }

  if (!hasToken) {
    return next('/login')
  }

  try {
    await verifyApi()
    return next()
  } catch {
    userStore.clearUser()
    YkMessage({ type: 'warning', message: '登录已过期，请重新登录' })
    return next('/login')
  }
})

export default router;