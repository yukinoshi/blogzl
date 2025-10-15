<script setup lang="ts">
import { computed, ref, } from "vue";
import type { FileData } from "../../utils/interface";

import { useSubsetStore } from '../../store/subset';
import './files.less'

const subsetStore = useSubsetStore();
const emits = defineEmits(['changeSubsetId','delete','selected']);

const confirm = () => {
  if (subsetSelectedId.value !== props.data.subsetId) {
    let data = {
      id: props.data.id,
      subsetId: subsetSelectedId.value
    }
    emits('changeSubsetId', data)
  }
}

const deleteFile = (e:number) => {
  emits('delete', e)
}

const checkFile = (e:FileData) => {
  emits('selected', e.id)
}

type FileItemProps = {
  data: FileData;
}

const props = withDefaults(defineProps<FileItemProps>(), {
})

const url = computed(() => {
  return "/src/assets/image/" + props.data?.url
})

const subsetSelectedId = ref<number | string>(props.data.subsetId);

const changeOption = (e: number | string) => {
  subsetSelectedId.value = e
}

</script>

<template>
  <div class="file-item">
    <div class="file-item-img" :class="{ 'file-item-selected': props.data.selected }">
      <yk-image fit="contain" :src="url" width="200" height="200" :is-lazy="true"></yk-image>
      <yk-space class="file-item-img-tool" size="s">
        <IconDeleteOutline @click="deleteFile(props.data.id)" class="files_tool-delete" />
        <yk-popconfirm title="选择分组" placement="bottomRight" @confirm="confirm">
          <IconSwitchOutline class="files_tool-switch" />
          <template #content>
            <yk-scrollbar ref="scrollbar" height="148px" class="subset">
              <div :class="{ 'subset-selected': subsetSelectedId == item.id }" @click="changeOption(item.id)"
                v-for="item in subsetStore.data" class="subset-item" :key="item.id">
                {{ item.name }} {{ item.value }}
              </div>
            </yk-scrollbar>
          </template>
        </yk-popconfirm>

      </yk-space>
      <div class="file-item-img-check" @click="checkFile(props.data)">
        <IconTickMinOutline style="color: #fff; font-size: 24px;" />
      </div>
    </div>
    <p class="file-item-name">{{ props.data.fileName }}.{{ props.data.format }}</p>
  </div>
</template>

<style lang="less" scoped>
.file-item {
  &-img {
    position: relative;
    border-radius: @radius-s;
    border: 2px solid @bg-color-l;

    &-tool {
      position: absolute;
      right: @space-s;
      bottom: @space-s;
      opacity: 0;

      .yk-icon {
        width: 32px;
        height: 32px;
        cursor: pointer;
        padding: 8px;
        background: rgba(255, 255, 255, 0.56);
        border-radius: @radius-m;
        transition: all @animatb;

        &:hover {
          background: rgba(255, 255, 255, 0.72);
          color: @pcolor;
          backdrop-filter: blur(2px);
        }
      }
    }

    &-check {
      position: absolute;
      top: @space-s;
      left: @space-s;
      width: 26px;
      height: 26px;
      background: @gray-4;
      border-radius: @radius-s;
      cursor: pointer;
      border: 1px solid rgba(255, 255, 255, 0.56);
      opacity: 0;

      .yk-icon {
        opacity: 0;
      }
    }

    &:hover {
      background: @pcolor-1;

      .file-item-img-check {
        opacity: 1;
      }

      .file-item-img-tool {
        opacity: 1;
      }
    }
  }

  &-selected {
    background: @pcolor-1;
    border: 2px solid @pcolor-3;

    .file-item-img-check {
      opacity: 1;
      background: @pcolor;

      .yk-icon {
        opacity: 1;
      }
    }

    .file-item-img-tool {
      opacity: 0;
    }

    .file-item-img-check {
      opacity: 1;
    }

    &:hover {
      .file-item-img-tool {
        opacity: 0;
      }
    }
  }

  &-name {
    padding-top: @space-l;
    text-align: center;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
  }

}
</style>
