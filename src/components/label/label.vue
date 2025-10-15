<script setup lang="ts">
import { label } from '../../mock/data';
import { onMounted, ref, getCurrentInstance } from 'vue';
import type { labelData } from "../../utils/interface";
import labelManage from "./label-manage.vue";
const proxy: any = getCurrentInstance()?.proxy

const visible = ref(false)

const emits = defineEmits(['nowlabel'])

const inpultValue = ref<number | string>('')

const actived = ref<string>('-1all')

const cancel = () => {
  inpultValue.value = ''
}

const confirm = () => {
  if (inpultValue.value) {
    let obj = {
      id: -2,
      name: inpultValue.value,
      value: 0
    }
    labels.value.push(obj)
    inpultValue.value = ''
    proxy.$message({ type: 'primary', message: '创建成功' })
  } else {
    proxy.$message({ type: 'warning', message: '输入不能为空' })
  }
}

const showmodel = () => {
  visible.value = !visible.value
}
const labels = ref<labelData[]>([])
const rawlabel = (newVal?: labelData[]) => {
  if (newVal && Array.isArray(newVal)) {
    labels.value = newVal
  } else {
    labels.value = label.list
  }
}

const changeOption = (id: number | string, type: string) => {
  if (id + type != actived.value) {
    actived.value = id + type
    emits('nowlabel', { id, type })
  }
}

onMounted(() => {
  rawlabel()
})

</script>

<template>
  <div class="label">
    <div class="label_title">
      <yk-title :level="4" style="margin: 0;">标签</yk-title>
      <yk-space style="flex: none;">
        <yk-popconfirm title="新建标签" @cancel="cancel" @confirm="confirm" placement="bottom" trigger="click">
          <yk-text type="primary">
            <IconPlusCircleOutline style="margin-right: 4px;" />
            新建
          </yk-text>
          <template #content>
            <div style="margin: 8px 4px 16px;">
              <yk-input placeholder="请输入..." style="width: 208px;" show-counter :limit="6" v-model="inpultValue" />
            </div>
          </template>
        </yk-popconfirm>
        <yk-text type="primary" @click="showmodel">
          <IconSettingsOutline style="margin-right: 4px;" />
          管理标签
        </yk-text>
      </yk-space>
    </div>
    <yk-space wrap size="s">

      <yk-tag @click="changeOption(item.id, 'label')" v-for="item in labels" :key="item.id"
        :class="{ 'label_menu_actived': actived == item.id + 'label' }">
        {{ item.name }}
      </yk-tag>
    </yk-space>
  </div>
  <yk-modal v-model="visible" title="管理分组">
    <labelManage :label="labels" @update:label="rawlabel"></labelManage>
    <template #footer>
      <yk-button @click="showmodel">确定</yk-button>
    </template>
  </yk-modal>
</template>

<style lang="less" scoped>
.label {
  padding: @space-l @space-xl;
  border-radius: @radius-m;
  background-color: @bg-color-l;
  flex: none;
  width: 280px;
  &_title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: @space-l;
  }
  .yk-text {
    cursor: pointer;
  }

}
</style>