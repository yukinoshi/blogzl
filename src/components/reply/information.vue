<script setup lang="ts">
import { toRefs } from 'vue';
import { onMounted, ref, getCurrentInstance } from 'vue';
import type { InformationProps } from './reply';
import type { ReqMessageData } from '../../utils/interface';
import { deleteMessageApi, getMessageData } from '../../api/overview';

const comments = ref<any[]>([])
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
  pageSize: number;//单页条数；
  nowPage: number;//当前页
}
const Comment: request = {
  pageSize: props.pageSize,
  nowPage: 1,
}
const getComment = async () => {
  const req: ReqMessageData = {
    count: true,
    ...Comment
  }
  const res = await getMessageData(req)
  count.value = res.data.count || 0
  comments.value = res.data.list
}

onMounted(() => {
  getComment()
})

const count = ref<Number>(123);

const deleteMessage = async (e: number) => {
  const { code } = await deleteMessageApi(e);
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
  <yk-drawer :title="'私信 ' + count" placement="right" :show="active" @close="closes">
    <yk-space dir="vertical">
      <Reply @delete="deleteMessage" :isComment="false" v-for="item, index in comments" :key="index" :item="item">
      </Reply>
    </yk-space>
    <template #footer>
      <yk-pagination @change="changePage" :total="count" simple />
    </template>
  </yk-drawer>
</template>

<style lang="less" scoped></style>