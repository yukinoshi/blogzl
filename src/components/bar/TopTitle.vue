<script setup lang="ts">
import { ref } from 'vue';


const SearchData = ref('')
type titleProps = {
  name: string;
  isSearch: boolean;
}

const props = withDefaults(defineProps<titleProps>(), {
  name: '总览',
  isSearch: true,
})

const emit = defineEmits(['search'])

const search = () => {
  emit('search', SearchData.value)
}

const canclesearch = () => {
  emit('search', '')
  SearchData.value = ''
}

const submit = () => {
  emit('search', SearchData.value)
}

</script>

<template>
  <div class="top_title">
    <yk-title style="margin: 0;line-height: 36px;" :level="3">{{ props.name }}</yk-title>
    <slot name="custom"></slot>
    <yk-space size="m" v-if="isSearch">
      <yk-button type="secondary" @click="canclesearch" v-show="SearchData">取消搜索</yk-button>
      <yk-input-search v-model="SearchData" style="width: 320px" placeholder="请输入..." @search="search">
        <template #suffix>
          <yk-button @click="submit" type="secondary">
            <IconSearchOutline />
          </yk-button>
        </template>
      </yk-input-search>
    </yk-space>
  </div>
</template>

<style lang="less" scoped>
.top_title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>