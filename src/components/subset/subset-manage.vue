<script setup lang="ts">
import { getCurrentInstance } from 'vue';
import { useSubsetStore } from '../../store/subset';

const proxy: any = getCurrentInstance()?.proxy

const subsetStore = useSubsetStore();

let nowName:string|number 

const focusSubset = (id: string | number) => {
  let result = subsetStore.data.find((item: {id: number|string }) => item.id === id);
  if (result) {
    nowName = result.name
  }
}

const blurSubset = (id: string | number) => {
  let result = subsetStore.data.find((item: {id: number|string }) => item.id === id);
  if (result && nowName !== result.name) {
    proxy.$message({ type: 'primary', message: '修改成功' })
  }
}

const deleteSubset = (id: string | number) => {
  let index = subsetStore.data.findIndex((item: {id: number|string }) => item.id === id);
  if (index !== -1) {
    subsetStore.data.splice(index, 1)
    proxy.$message({ type: 'primary', message: '删除成功' })
  }
}
</script>

<template>
  <yk-table>
    <yk-table-column property="name" label="名称"></yk-table-column>
    <yk-table-column property="value" label="关联文章数"></yk-table-column>
    <yk-table-column property="monment" label="创建日期"></yk-table-column>
    <yk-table-column property="manage" label="操作" align="right"></yk-table-column>
    <template #tbody>
      <tr v-for="(item, index) in subsetStore.data" :key="index" class="yk-table__row">
        <td class="yk-table__cell">
          <yk-input v-model="item.name" @focus="focusSubset(item.id)" @blur="blurSubset(item.id)" />
        </td>
        <td class="yk-table__cell">
          {{ item.value }}
        </td>
        <td class="yk-table__cell">
          {{ item.moment }}
        </td>
        <td class="yk-table__cell text-right">
          <yk-text type="primary" @click="deleteSubset(item.id)" style="cursor: pointer">删除</yk-text>
        </td>
      </tr>
    </template>
  </yk-table>
</template>

<style lang="less" scoped></style>