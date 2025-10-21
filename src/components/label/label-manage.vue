<script setup lang="ts">
import { getCurrentInstance, ref, watch } from 'vue';
import type { labelData } from "../../utils/interface";
import { deleteLabelApi } from '../../api/label';
type labelProps = {
  label: labelData[]
}
const proxy: any = getCurrentInstance()?.proxy
const props = withDefaults(defineProps<labelProps>(), {})
const labelData = ref<labelData[]>([])

const emit = defineEmits(['update:label'])

const deletelabel = async (label_id: number) => {
  const res = await deleteLabelApi(label_id)
  if (res.code == 200) {
    let index = labelData.value.findIndex((item: { id: number }) => item.id === label_id);
    if (index !== -1) {
      labelData.value.splice(index, 1)
      proxy.$message({ type: 'primary', message: '删除成功' })
      // notify parent with updated labels
      emit('update:label', labelData.value)
    }
  } else {
    proxy.$message({ type: 'warning', message: '删除失败' })
  }
}

watch(
  () => props.label,
  (newVal) => {
    labelData.value = [...newVal]
  },
  { immediate: true }
)
</script>

<template>
  <yk-table>
    <yk-table-column property="name" label="标签名称"></yk-table-column>
    <yk-table-column property="monment" label="创建日期"></yk-table-column>
    <yk-table-column property="manage" label="操作" align="right"></yk-table-column>
    <template #tbody>
      <tr v-for="(item, index) in labelData" :key="index" class="yk-table__row">
        <td class="yk-table__cell">
          {{ item.label_name }}
        </td>

        <td class="yk-table__cell">
          {{ item.moment }}
        </td>
        <td class="yk-table__cell text-right">
          <yk-text type="primary" @click="deletelabel(item.id)" style="cursor: pointer">删除</yk-text>
        </td>
      </tr>
    </template>
  </yk-table>
</template>

<style lang="less" scoped></style>