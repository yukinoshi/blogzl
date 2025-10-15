<script setup lang="ts">
import { toRefs } from 'vue';
import { onMounted, ref, getCurrentInstance } from 'vue';
import { comment } from '../../mock/data';
import type { InformationProps } from './reply';

const comments = ref([])
const proxy: any = getCurrentInstance()?.proxy
const props = withDefaults(defineProps<InformationProps>(), {
  active: false,
  pageSize: 8,
})

const { active } = toRefs(props)
const emits = defineEmits(['close'])
const closes = () => {
  emits('close', false)
}
type request = {
  token?: string;
  pageSize: number;//单页条数；
  nowPage: number;//当前页
}
const Comment: request = {
  pageSize: props.pageSize,
  nowPage: 1,
}
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

const count = ref<Number>(123);

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
  <yk-drawer :title="'私信 ' + count" placement="right" :show="active" @close="closes">
    <yk-space dir="vertical">
      <Reply @delete="deleteComment" :isComment="false" v-for="item, index in comments" :key="index" :content="item">
      </Reply>
    </yk-space>
    <template #footer>
      <yk-pagination @change="changePage" :total="count" simple />
    </template>
  </yk-drawer>
</template>

<style lang="less" scoped></style>