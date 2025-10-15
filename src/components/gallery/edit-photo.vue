<script setup lang="ts">
import { onMounted, ref, getCurrentInstance } from 'vue'
import { mphotos } from '../../mock/data'

interface Photo {
  id: number;
  url: string;
}
const photos = ref<Photo[]>([])
const uploadurl = '';
const coverIndex = ref<number>(0);
const proxy: any = getCurrentInstance()?.proxy
const getphotos = () => {
  photos.value = mphotos.data;
  console.log(photos.value);
}
const changeCover = (id: number) => {
  coverIndex.value = id;
}
const deleteImage = (id: number) => {
  if (coverIndex.value === id) {
    photos.value = photos.value.filter(item => item.id !== id)
    if (photos.value.length >= 0) {
      coverIndex.value = photos.value[0]?.id || 0;
    }
    coverIndex.value = -1;
  } else {
    photos.value = photos.value.filter(item => item.id !== id)
  }
  proxy.$message({ type: 'success', message: '删除成功' })
}
onMounted(() => {
  getphotos()
})
</script>

<template>
  <div class="edit-photo">
    <yk-upload @handleSuccess="" :upload-url="uploadurl" :draggable="true"></yk-upload>
    <div class="waterfall">
      <div class="waterfall-item" v-for="item in photos" :key="item.id">
        <img :src="'./src/assets/image/' + item.url" alt="" />
        <IconStarFill class="waterfall-item-covericon" v-if="coverIndex === item.id" />
        <yk-space size="ss">
          <p class="waterfall-item-tool" v-if="coverIndex !== item.id" @click="changeCover(item.id)">设为封面</p>
          <IconDeleteOutline class="waterfall-item-delete" @click="deleteImage(item.id)" />
        </yk-space>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.edit-photo {
  background-color: @bg-color-l;
  border-radius: @radius-m;
  padding: @space-xl;
  width: 100%;
}

.waterfall {
  width: 100%;
  column-count: 3;
  column-gap: @space-xl;
  padding-top: 32px;

  &-item {
    margin-bottom: @space-xl;
    border-radius: @radius-m;
    overflow: hidden;
    line-height: 0%;

    img {
      width: 100%;
    }

    .yk-space {
      position: absolute;
      top: @space-l;
      right: @space-l;
    }

    &-covericon {
      position: absolute;
      top: @space-l;
      left: @space-l;
      width: 24px;
      height: 24px;
      color: @wcolor;
    }

    &-tool {
      color: @pcolor;
      line-height: 32px;
      padding: 0 @space-m;
      border-radius: @radius-m;
      background: rgba(255, 255, 255, .56);
      cursor: pointer;
      transition: all @animatb;
      opacity: 0;

      &:hover {
        background: rgba(255, 255, 255, .8);
        backdrop-filter: blur(2px);
      }
    }

    &-delete {
      width: 32px;
      height: 32px;
      padding: 9px;
      color: @gray;
      cursor: pointer;
      background: rgba(255, 255, 255, .56);
      border-radius: @radius-m;
      transition: all @animatb;
      opacity: 0;

      &:hover {
        color: @ecolor;
        background: rgba(255, 255, 255, .8);
        backdrop-filter: blur(2px);
      }
    }

    &:hover {

      .waterfall-item-tool,
      .waterfall-item-delete {
        opacity: 1;
        transition: all 0.3s;
      }
    }
  }
}
</style>