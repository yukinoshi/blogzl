<script setup lang="ts">
import { computed } from 'vue';
import { useSubsetStore } from '../../store/subset';
import type { articleData } from '../../utils/interface'
import { momentm } from '../../utils/moment'
const emits = defineEmits(['delete', 'state'])
const subsetStore = useSubsetStore();
type ArticleItemProps = {
  data: articleData
}

const props = withDefaults(defineProps<ArticleItemProps>(), {})
const cover = computed(() => {
  return './src/assets/image/' + props.data.cover
})
const deleteArticle = () => {
  emits('delete', props.data.id)
}

const updateState = (state: number) => {
  emits('state', { id: props.data.id, state: state })
}

</script>

<template>
  <div class="article-item">
    <yk-space size="xl">
      <div class="article-item-cover">
        <yk-image :src="cover" fit="cover" width="160px" height="120px" :preview="false" :is-lazy="true" />
        <p class="article-item-unpublish" v-if="props.data.state === 0">未发布</p>
      </div>
      <div style="width: 100%;">
        <p class="article-item-title">{{ props.data.title }}</p>
        <p class="article-item-introduce">{{ props.data.introduce }}</p>
        <div class="article-item-type">
          <yk-space size="xl">
            <yk-text type="secondary">
              {{ subsetStore.subsetName(props.data.subsetId) }}
              <yk-text type="secondary" v-if="props.data!.label!.length > 0">
                /
                <span v-for="item in props.data.label" style="padding-right: 4px;">{{ item }}</span>
              </yk-text>
            </yk-text>
            <yk-text type="third">{{ props.data.moment }}</yk-text>
            <yk-space>
              <yk-text type="third">
                <IconEyeOutline />
                {{ props.data.views }}
              </yk-text>
              <yk-text type="third">
                <IconLikeOutline />
                {{ props.data.praise }}
              </yk-text>
              <yk-text type="third">
                <IconCommentOutline />
                {{ props.data.comment }}
              </yk-text>
            </yk-space>
          </yk-space>
          <yk-space class="article-item-type-action">
            <yk-tooltip v-if="props.data.state === 0" title="发布" placement="top">
              <IconSendOutline @click="updateState(1)" />
            </yk-tooltip>
            <yk-tooltip v-else title="撤回" placement="top">
              <IconBackOutline @click="updateState(0)" />
            </yk-tooltip>
            <yk-tooltip title="编辑" placement="top">
              <IconFillOutline />
            </yk-tooltip>
            <yk-popconfirm content="删除后不可回复" trigger="click" placement="topRight" title="删除后不可恢复" @confirm="deleteArticle()">
                <IconDeleteOutline />
            </yk-popconfirm>
          </yk-space>
        </div>
      </div>
    </yk-space>
  </div>
</template>

<style lang="less" scoped>
.article-item {
  width: 100%;
  background-color: @bg-color-l;
  border-radius: @radius-m;
  padding: @space-xl;
  height: 168px;

  &-cover {
    position: relative;
    border-radius: @radius-m;
    overflow: hidden;
    width: 160px;
    flex: none;
  }

  &-unpublish {
    position: absolute;
    bottom: 0;
    width: 100%;
    line-height: 36px;
    text-align: center;
    background: rgba(43, 90, 237, .8);
    color: @white
  }

  &-title {
    font-size: 20px;
    font-weight: 600;
    padding-bottom: @space-s;
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
      .yk-icon {
        cursor: pointer;
        width: 20px;
        height: 20px;
        color: @font-color-s;

        &:hover {
          color: @pcolor;
        }
      }
    }
  }
}
</style>