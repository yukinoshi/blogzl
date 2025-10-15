<script setup lang="ts">
import Reply from "./reply.vue";
import { onMounted, ref, getCurrentInstance } from 'vue';
import { comment } from '../../mock/data';
import type { CommentProps } from './reply.ts'
const comments = ref([])
const proxy:any = getCurrentInstance()?.proxy
const props = withDefaults(defineProps<CommentProps>(), {
  pageSize: 8,
  height: "516px"
})
type request = {
  token?: string;
  pageSize: number;//单页条数；
  nowPage: number;//当前页
}
const Comment: request = {
  pageSize: props.pageSize,
  nowPage: 1,
}
const count = ref<Number>(0);
const getComment = () => {
  let data = comment.data
  count.value = data.count
  comments.value = data.list.slice(
    (Comment.nowPage - 1) * Comment.pageSize,
    Comment.nowPage * Comment.pageSize
  )
}

onMounted(() => {
  getComment()
})


const deleteComment = (e: number) => {
  comments.value = comments.value.filter((item: any) => item.user.id !== e)
  count.value = Number(count.value) - 1
  proxy.$message.success('删除成功')
}

const changePage = (e: number) => {
  Comment.nowPage = e
  getComment()
}
</script>

<template>
  <div class="card comment" style="width: 50%;">
    <div class="card_title">
      <p class="card_title-name">评论{{ count }}</p>
    </div>
    <yk-scrollbar style="padding-right: 10px;" ref="scrollbar" :height="height">
      <yk-space dir="vertical">
        <Reply @delete="deleteComment" v-for="item, index in comments" :key="index" :content="item" :isComment="true">
        </Reply>
      </yk-space>
    </yk-scrollbar>
    <div class="comment_pagination">
      <yk-pagination @change="changePage" :total="count" size="m" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.comment {
  &_pagination {
    padding: @space-l @space-xl;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    border-top: 1px solid @line-color-s;
  }
}
</style>