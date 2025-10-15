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
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router;