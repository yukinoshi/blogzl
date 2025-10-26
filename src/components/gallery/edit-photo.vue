<script setup lang="ts">
import { ref, getCurrentInstance, computed, watch, type PropType } from 'vue'
import type { articleData, Photo, ResFileData } from '../../utils/interface';
import { baseImgUrl } from '../../utils/env';
import { deleteFileApi } from '../../api/files';

const props = defineProps({
  classify: {
    default: 0,
    type: Number
  },
  editcontent: {
    type: Object as PropType<articleData>
  },
  editcover: {
    type: String as PropType<string>
  }
})
const emits = defineEmits(['editors'])

const photos = ref<Photo[]>([])
const uploadUrl = computed(() => {
  const token = JSON.parse(localStorage.getItem('user') || '{}').token
  return token ? `/api/upload?token=${encodeURIComponent(token)}` : `/api/upload`
})
// 仅在切换到“不同的编辑对象”时初始化一次，避免编辑表单其它字段变化时把本地新增图片覆盖掉
const initializedId = ref<number | null>(null)
watch(
  () => props.editcontent?.id,
  (newId) => {
    if (!newId) return
    if (initializedId.value === newId) return
    const ec = props.editcontent
    try {
      const c: any = ec?.content
      let parsed: Photo[] = []
      if (typeof c === 'string') {
        parsed = c ? (JSON.parse(c) as Photo[]) : []
      } else if (Array.isArray(c)) {
        if (c.length && typeof c[0] === 'string') {
          // 兼容字符串数组形式
          parsed = (c as string[]).map((url: string, idx: number) => ({ id: idx + 1, url }))
        } else {
          parsed = c as Photo[]
        }
      } else {
        parsed = []
      }
      photos.value = parsed
    } catch {
      photos.value = []
    }
    coverIndex.value = photos.value.find(item => item.url === ec?.cover)?.id || 0
    initializedId.value = newId
  },
  { immediate: true }
)

const coverIndex = ref<number>(0);
const proxy: any = getCurrentInstance()?.proxy

const changeCover = (id: number) => {
  coverIndex.value = id;
}
const deleteImage = async (id: number) => {
  const res = await deleteFileApi(id)
  if (res.code !== 200) {
    proxy.$message({ type: 'warning', message: '删除失败' })
    return
  }
  if (coverIndex.value === id) {
    photos.value = photos.value.filter(item => item.id !== id)
    if (photos.value.length >= 0) {
      coverIndex.value = photos.value[0]?.id || 0;
    }
  } else {
    photos.value = photos.value.filter(item => item.id !== id)
  }
  proxy.$message({ type: 'success', message: '删除成功' })
}
//图片提交成功
const handleSuccess = (e: ResFileData) => {
  if (e.code !== 200) {
    proxy.$message({ type: 'warning', message: '上传失败' })
    return
  }
  photos.value.push({
    id: e.data.id,
    url: e.data.url
  })
  coverIndex.value = photos.value[0].id
  emits('editors', photos.value, coverIndex.value)
}
watch([photos, coverIndex], ([newPhotos, newCover]) => {
  emits('editors', newPhotos, newCover)
}, { deep: true })

</script>

<template>
  <div class="edit-photo">
    <yk-upload @handleSuccess="handleSuccess" :upload-url="uploadUrl" :draggable="true"></yk-upload>
    <div class="waterfall">
      <div class="waterfall-item" v-for="item in photos" :key="item.id">
        <img :src="baseImgUrl + item.url" alt="" />
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

<style lang="less">
.edit-photo {
  .yk-upload__file-list {
    display: none;
  }
}
</style>