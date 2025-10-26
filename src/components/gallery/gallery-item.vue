<script setup lang="ts">
import { computed, onMounted } from 'vue';
import router from '../../router';
import type { galleryData } from '../../utils/interface'
import { baseImgUrl } from '../../utils/env';
const emits = defineEmits(['delete', 'state'])
type galleryItemProps = {
  data: galleryData
}

const props = withDefaults(defineProps<galleryItemProps>(), {})
const cover = computed(() => {
  return props.data.cover ? baseImgUrl + props.data.cover : ''
})
const deletegallery = () => {
  emits('delete', props.data.id)
}

const cleanCoverInContent = () => {// 如果封面图在内容中，则将其移除
  if (props.data.content && props.data.content.length > 0) {
    props.data.content = props.data.content.filter(item => item.url !== props.data.cover);
  }
}

const editGallery = (id: number) => {
    //跳转到编辑页面
  router.push({ path: '/editgallery', query: { id: id.toString() } })
}

onMounted(() => {
  cleanCoverInContent();
})


</script>

<template>
  <div class="gallery-item">
    <yk-space size="s" dir="vertical">
      <div class="gallery-item-image">
        <div class="gallery-item-cover">
          <yk-image :src="cover" fit="cover" width="238px" height="120px" :preview="false" :is-lazy="true" />
        </div>
        <yk-space :size="2">
          <div class="gallery-item-image-left image-div">
            <yk-image v-if="props.data.content && props.data.content[0]"
              :src="baseImgUrl + props.data.content[0].url" fit="cover" width="78" height="78" :preview="false"
              :is-lazy="true" />
          </div>
          <div class="gallery-item-image-center image-div">
            <yk-image v-if="props.data.content && props.data.content[1]"
              :src="baseImgUrl + props.data.content[1].url" fit="cover" width="78" height="78" :preview="false"
              :is-lazy="true" />
          </div>
          <div class="gallery-item-image-right image-div">
            <yk-image v-if="props.data.content && props.data.content[2]"
              :src="baseImgUrl + props.data.content[2].url" fit="cover" width="78" height="78" :preview="false"
              :is-lazy="true" />
          </div>
        </yk-space>
        <yk-space :size="4" class="gallery-item-type-action">
          <IconFillOutline @click="editGallery(props.data.id)" />
          <yk-popconfirm content="删除后不可回复" trigger="click" placement="topRight" title="删除后不可恢复"
            @confirm="deletegallery()">
            <IconDeleteOutline />
          </yk-popconfirm>
        </yk-space>
      </div>
      <div style="width: 100%;">
        <p class="gallery-item-title">{{ props.data.title }}</p>
        <div class="gallery-item-type">
          <yk-space size="xl">
            <yk-space>
              <yk-text type="third">
                查看
                {{ props.data.views }}
              </yk-text>
              <yk-text type="third">
                喜欢
                {{ props.data.praise }}
              </yk-text>
            </yk-space>
          </yk-space>
          <yk-text type="third">{{ props.data.moment }}</yk-text>

        </div>
      </div>
    </yk-space>
  </div>
</template>

<style lang="less" scoped>
.gallery-item {
  width: 238px;
  background-color: @bg-color-l;
  border-radius: @radius-m;

  &-cover {
    position: relative;
    border-radius: @radius-m @radius-m 0 0;
    overflow: hidden;
    flex: none;
    padding-bottom: 2px;
  }

  .gallery-item-image-left {
    border-radius: 0 0 0 @radius-m;
    overflow: hidden;
  }

  .gallery-item-image-right {
    border-radius: 0 0 @radius-m 0;
    overflow: hidden;
  }

  .image-div {
    width: 78px;
    height: 78px;
    background: @gray-2;
  }

  &-title {
    .font-l();
    font-weight: 600;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
  }

  &-introduce {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    margin-bottom: @space-m;
  }

  &-type {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &-action {
      position: absolute;
      right: @space-l;
      top: @space-l;
      background: rgba(255, 255, 255, 0.56);
      border-radius: @radius-m;
      padding: @space-ss;
      opacity: 0;

      &:hover {
        background: rgba(255, 255, 255, 0.64);
        backdrop-filter: blur(2px);
      }

      .yk-icon {
        cursor: pointer;
        width: 24px;
        height: 24px;
        padding: 5px;
        color: @gray;

        &:hover {
          color: @pcolor;
        }
      }
    }
  }
  &:hover {
    .gallery-item-type-action {
      opacity: 1;
      transition: all 0.3s;
    }
  }
}
</style>

<style lang="less">
.yk-image__img {
  border-radius: 0;
}
</style>