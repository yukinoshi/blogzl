<script setup lang="ts">
import type { diaryData, Photo } from '../../utils/interface'
import { weathers } from '../../utils/weather'
import { onMounted, ref } from 'vue'
import { baseImgUrl } from '../../utils/env'
const emits = defineEmits(['delete'])
type diaryItemProps = {
  data: diaryData
}

const props = withDefaults(defineProps<diaryItemProps>(), {})

const deletediary = () => {
  emits('delete', props.data.id)
}
const imageList = ref<string[]>([]);
const images = (() => {
  if (props.data.picture) {
    let arr = JSON.parse(props.data.picture) as Photo[]
    imageList.value = arr.map(item => { return baseImgUrl + item.url })
  }
})
onMounted(() => {
  images()
})


</script>

<template>
  <div class="diary-item">
    <yk-space dir="vertical">
      <div class="diary-item-top">
        <yk-space dir="vertical" :size="4">
          <p class="diary-item-title">
            {{ props.data.title }}
            <img :src="'/src/assets/' + weathers[props.data.weather_id].icon" alt="" srcset="">
          </p>
          <yk-text type="third">{{ props.data.moment }}</yk-text>
        </yk-space>
        <yk-popconfirm content="删除后不可恢复" trigger="click" placement="topRight" title="删除后不可恢复" @confirm="deletediary()">
          <IconDeleteOutline class="diary-item-delete" />
        </yk-popconfirm>
      </div>
      <yk-text>
        {{ props.data.content }}
      </yk-text>
      <div class="images">
        <yk-image-preview-group :src-list="imageList" width="80" height="80" fit="cover"></yk-image-preview-group>
      </div>
    </yk-space>
  </div>
</template>

<style lang="less" scoped>
.diary-item {
  width: 100%;
  background-color: @bg-color-l;
  border-radius: @radius-m;
  padding: @space-xl;

  &-top {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  &-title {
    display: flex;
    align-items: center;
    font-size: 20px;
    font-weight: 600;

    img {
      margin-left: @space-s;
    }
  }

  &-delete {
    width: 20px;
    height: 20px;
    padding: 2px;
    position: absolute;
    color: @font-color-s;
    transform: all @animatb;
    display: none;

    &:hover {
      color: @font-color-l;
    }
  }

  &:hover {
    .diary-item-delete {
      display: block;
    }
  }
}
</style>

<style lang="less">
.images {
  .yk-space {
    gap: 8px;
  }
  .yk-image__img {
    border-radius: 8px;
  }
}
</style>
