<script setup lang="ts">
import { computed } from 'vue';
import type { ReplyProps } from './reply.ts'
import { useUserStore } from '../../store/user.ts';
import { avatarList } from '../../utils/avatar.ts';

const props = withDefaults(defineProps<ReplyProps>(), {
  item: undefined,
  isComment: true
})

const emits = defineEmits(['delete'])

const deleteReply = (e:number) => {
  emits('delete', e)
}

const userStore = useUserStore();

//获取头像
const avatarUrl = computed(() => {
  return avatarList[userStore.avatarIndex] || '../../assets/image/avatar.png';
})

</script>
<template>
  <yk-space class="reply" size="m">
    <img class="avatar" v-if="isComment" :src="avatarUrl" alt=""></img>
    <yk-space dir="vertical" size="s" class="reply_main">
      <div class="reply_name">
        <yk-text strong>{{item.user_name}}</yk-text>
        <yk-text type="third" style="font-size: 12px;">{{ item.moment }}</yk-text>
      </div>
      <yk-text type="secondary">{{ item.content }}</yk-text>
      <yk-space size="s" align="center" v-if="isComment">
        <yk-tag type="primary" v-if="item.article">
          {{ item?.article?.title }}
        </yk-tag>
        <yk-tag v-else>
          文章已删除
        </yk-tag>
        <yk-text type="danger" v-show="item?.complaint! > 0">举报 {{ item?.complaint }}</yk-text>
      </yk-space>
      <IconDeleteOutline @click="deleteReply(props!.item!.id)" class="reply_main-delete"/>
    </yk-space>
  </yk-space>
</template>

<style lang="less" scoped>
.reply {
  width: 100%;
  &_main {
    border-bottom: 1px solid @line-color-s;
    width: 100%;
    padding-bottom: @space-l;
    flex: 1;
    position: relative;
    &-delete {
      position: absolute;
      top: 0;
      right: 0;
      width: 16px;
      height: 16px;
      cursor: pointer;
      color: @font-color-s;
      display: none;
    }
  }
  &_name {
    display: flex;
    flex-direction: column;
  }
  &:hover {
    .reply_main {
      &-delete {
        display: block;
      }
    }
  }
  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
  }
}
</style>