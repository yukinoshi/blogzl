<script setup lang="ts">
import Reply from "./reply.vue";
import { onMounted, ref, getCurrentInstance } from 'vue';
import type { ReqCommentData } from '../../utils/interface.ts';
import type { CommentProps } from './reply.ts'
import { getCommentData, deleteCommentApi } from '../../api/overview.ts'
let comments = ref<any[]>([])
const proxy: any = getCurrentInstance()?.proxy
const props = withDefaults(defineProps<CommentProps>(), {
  pageSize: 8,
  height: "516px"
})
type request = {
  pageSize: number;//单页条数；
  nowPage: number;//当前页
}
const Comment: request = {
  pageSize: props.pageSize,
  nowPage: 1,
}
const count = ref<number>(0);
const getComment = async () => {
  const req: ReqCommentData = {
    count: true,
    ...Comment
  }
  const res = await getCommentData(req)
  count.value = res.data.count || 0
  comments.value = res.data.list
}

onMounted(() => {
  getComment()
})


const deleteComment = async (e: number) => {
  const { code } = await deleteCommentApi(e);
  if (code === 200) {
    comments.value = comments.value.filter((item: any) => item.id !== e)
    count.value = Number(count.value) - 1
    proxy.$message.success('删除成功')
  } else {
    proxy.$message.error('删除失败 code:' + code)
  }
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
        <Reply @delete="deleteComment" v-for="item, index in comments" :key="index" :item="item" :isComment="true">
        </Reply>
      </yk-space>
    </yk-scrollbar>
    <div class="comment_pagination">
      <yk-pagination @change="changePage" :page-size="props.pageSize" :total="count" size="m" />
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