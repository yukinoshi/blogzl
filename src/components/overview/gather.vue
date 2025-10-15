<script setup lang="ts">
import { overLink } from '../../utils/menu';
import { overview } from '../../mock/data';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const gathers = ref(overLink)
const drawGatherData = () => {
  let data = overview.data;
  gathers.value[0].total = data.file;
  gathers.value[1].total = data.article;
  gathers.value[2].total = data.gallery;
  gathers.value[3].total = data.diary;
}
const router = useRouter()

const editPage = (path: string) => {
  router.push(path)
}

onMounted(() => {
  drawGatherData();
})
</script>


<template>
  <yk-space class="gather">
    <div class="gather_list" v-for="(item, index) in gathers" :key="index"
      :style="{ background: 'linear-gradient(' + item.bgColor + ')' }">
      <yk-space dir="vertical" size="s">
        <yk-text type="secondary">{{ item.name }}</yk-text>
        <yk-title level="2">{{ item.total }}</yk-title>
      </yk-space>
      <yk-button @click="editPage(item.path)" shape="square" v-if="index > 0" size="xl" type="secondary">
        <IconPlusOutline />
      </yk-button>
    </div>
  </yk-space>
</template>

<style lang="less" scoped>
.gather {
  width: 100%;

  .gather_list {
    width: 25%;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: @space-xl;
    border-radius: @radius-m;

    &:first-child {

      .yk-title,
      .yk-text {
        color: @white;
      }
    }
  }
}
</style>