<script setup lang="ts">
import { onMounted, ref, getCurrentInstance } from 'vue';
import GalleryItem from './gallery-item.vue';
import { gallery } from '../../mock/data';
import type { galleryData } from '../../utils/interface';

const proxy: any = getCurrentInstance()?.proxy

const nowpage = ref<number>(1);

const galleryList = ref<galleryData[]>([]);

const count = ref<number>(0);

type changeState = {
  id: number,
  state: number
}

const props = defineProps({
  pagesize: {
    type: Number,
    default: 6
  },
  subsetId: {
    type: Number,
    default: -1
  },
  state: {
    type: Number,
    default: 0
  },
  serchTerm: {
    type: String,
    default: ''
  },
})

const request = {
  pageSize: props.pagesize,
  nowPage: nowpage.value,
  state: props.state,
  subsetId: props.subsetId,
  serchTerm: props.serchTerm,
  count: true,
}

const getData = (e: boolean) => {
  if (e) {
    count.value = gallery.count
  }
  let arr = gallery.list.slice(
    (request.nowPage - 1) * request.pageSize,
    request.nowPage * request.pageSize
  )
  galleryList.value = arr
}

const deleteArticle = (id: number) => {
  galleryList.value = galleryList.value.filter(item => item.id !== id)
  proxy.$message({ type: 'success', message: '删除成功' })
}

const updateState = (obj: changeState) => {
  galleryList.value.filter(item => {
    if (item.id === obj.id) {
      item.state = obj.state
    }
  })
  let submittext = obj.state === 0 ? '撤回成功' : '发布成功';
  proxy.$message({ type: 'success', message: submittext })
}

const changePage = (e: number) => {
  request.nowPage = e
  getData(false)
}

onMounted(() => {
  getData(true)
})

</script>

<template>
  <div class="gallery">
    <div class="gallery-content">
      <div class="gallery-content-files">
        <GalleryItem @state="updateState" @delete="deleteArticle" v-for="item in galleryList" :key="item.id"
          :data="item" />
      </div>
    </div>
    <div class="gallery_pagination">
      <yk-pagination @change="changePage" :default-page-size="request.pageSize" :total="count" size="m" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.gallery {
  width: 100%;
  background-color: @bg-color-l;
  padding: 32px 24px 24px;
  border-radius: @radius-m;

  &_pagination {
    padding: @space-s 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
  }

  &-content {
    display: inline;
    &-files {
      display: grid;
      grid-template-columns: repeat(auto-fill, 238px);
      row-gap: 32px;
      column-gap: 24px;
      justify-content: center;
    }
  }
}
</style>