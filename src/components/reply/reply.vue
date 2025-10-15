<script setup lang="ts">
import type { ReplyProps } from './reply.ts'

const props = withDefaults(defineProps<ReplyProps>(), {
  content: undefined,
  isComment: true
})

const emits = defineEmits(['delete'])

const deleteReply = (e:number) => {
  emits('delete', e)
}
</script>
<template>
  <yk-space class="reply" size="m">
    <yk-avatar v-if="isComment" img-url="https://www.huohuo90.com:3003/user/6353b034dd4b583975e77fbe.png" alt=""></yk-avatar>
    <yk-space dir="vertical" size="s" class="reply_main">
      <div class="reply_name">
        <yk-text strong>{{content.user.name}}</yk-text>
        <yk-text type="third" style="font-size: 12px;">{{ content.moment }}</yk-text>
      </div>
      <yk-text type="secondary">{{ content.comment }}</yk-text>
      <yk-space size="s" align="center" v-if="isComment">
        <yk-tag type="primary">
          {{ content?.article?.title }}
        </yk-tag>
        <yk-text type="danger" v-show="content?.complaint! > 0">举报 {{ content?.complaint }}</yk-text>
      </yk-space>
      <IconDeleteOutline @click="deleteReply(props!.content!.user!.id)" class="reply_main-delete"/>
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
}
</style>