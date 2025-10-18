import { createWebHistory, createRouter } from 'vue-router'
import IndexView from '../views/IndexView.vue';
import OverView from '../views/OverView.vue';
import FileView from '../views/FileView.vue';
import ArticleView from '../views/ArticleView.vue';
import GalleryView from '../views/GalleryView.vue'
import DiaryView from '../views/DiaryView.vue'
import EditGalleryView from '../views/EditGalleryView.vue'
import EditArticleView from '../views/EditArticleView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import NotFound from '../views/404.vue'
import { verifyApi } from '../api/login';
import { YkMessage } from '@yike-design/ui';
import { isTokenExpired } from "../utils/auth";
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
    ]
  },
  { path: '/editgallery', component: EditGalleryView },
  { path: '/editarticle', component: EditArticleView },
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

router.beforeEach(async (to, _from, next) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isWhite = whiteList.includes(to.path)
  // 未登录 第一次登录
  if (!user) {
    return isWhite ? next() : next('/login')
  }

  // 本地判定过期
  if (isTokenExpired(user.token)) {
    localStorage.removeItem('user')
    if (isWhite) return next()
    YkMessage({ type: 'warning', message: '登录已过期，请重新登录' })
    return next('/login')
  }

  // 有 token 且未过期
  // 在登录/注册页面，若 token 有效则自动跳首页
  if (isWhite) {
    try {      
      await verifyApi()
      return next('/')
    } catch {
      // token 无效则清除并留在登录/注册页
      localStorage.removeItem('user')
      return next()
    }
  }


  // 访问受限页面：向后端校验 token
  try {
    await verifyApi()
    return next()
  } catch {
    localStorage.removeItem('user')
    YkMessage({ type: 'warning', message: '登录已过期，请重新登录' })
    return next('/login')
  }
})

export default router;