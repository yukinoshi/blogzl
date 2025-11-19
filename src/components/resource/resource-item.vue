<script setup lang="ts">
import { computed } from 'vue';
import { baseImgUrl } from '../../utils/env';
import type { ResourceData } from '../../utils/interface';
import { useSubsetStore } from '../../store/subset';
import router from '../../router';

const emits = defineEmits(['delete'])

const props = defineProps({
  data: {
    type: Object as () => ResourceData,
    required: true
  }
})

const deleteresource = () => {
  emits('delete', props.data.id)
}

const editResource = () => {
  //跳转到编辑页面
  router.push({ path: '/editresource', query: { id: props.data.id.toString() } })
}

const subsetStore = useSubsetStore();

const cover = computed(() => {
  return props.data.cover ? baseImgUrl + props.data.cover : ''
})
</script>

<template>
  <div class="resource-item">
    <yk-space size="xl">
      <yk-image class="resource-item-cover" style="width: 240px; height: 160px; flex: 0 0 auto;" width="100%"
        :src="cover"></yk-image>
      <div class="resource-item-main">
        <yk-space size="ss" dir="vertical">
          <p class="resource-name">{{ data.title }}</p>
          <yk-text type="secondry">{{ subsetStore.subsetName(props.data.subset_id) }} / {{ data.introduce }}</yk-text>
          <yk-text type="third">{{ data.format }}</yk-text>
        </yk-space>
        <div class="resource-item-main-foot">
          <yk-space size="xl" align="center">
            <yk-text type="secondry">{{ data.password }}</yk-text>
            <yk-tag class="tag" shape="round" size="m">
              <IconDownloadOutline /> {{ data.downloads }}
            </yk-tag>
          </yk-space>
          <yk-space :size="4" class="resource-item-tool">
            <IconFillOutline @click="editResource" style="fill: currentcolor;font-size: 32px;padding: 6px;" />
            <yk-popconfirm content="删除后不可回复" trigger="click" placement="topRight" title="删除后不可恢复" @confirm="deleteresource()">
              <IconDeleteOutline style="fill: currentcolor;font-size: 32px;padding: 6px;" />
            </yk-popconfirm>
          </yk-space>
        </div>
      </div>
    </yk-space>
  </div>
</template>

<style lang="less" scoped>
.resource-item {
  padding: 24px;
  border-radius: 8px;
  background: @bg-color-l;
  width: 100%;
  position: relative;


  &-cover {
    overflow: hidden;
    border-radius: 12px;
  }

  &-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 160px;

    .resource-name {
      font-size: 20px;
      font-weight: 600;
    }

    &-foot {
      display: flex;
      justify-content: space-between;

      .resource-item-tool {
        transition: all .2s;
        opacity: 0;

        .yk-icon {
          cursor: pointer;
          color: @gray;

          &:hover {
            color: @pcolor;
          }
        }
      }
    }
  }


  &:hover {
    .resource-item-tool {
      opacity: 1;
    }
  }
}
</style>