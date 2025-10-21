<script setup lang="ts">
import { onMounted, ref, getCurrentInstance } from 'vue';
import type { labelData, ReqAddLabel } from "../../utils/interface";
import labelManage from "./label-manage.vue";
import { addLabelApi, getLabelApi } from '../../api/label';
import { momentm } from '../../utils/moment';
const proxy: any = getCurrentInstance()?.proxy

const visible = ref(false)

const emits = defineEmits(['nowlabel'])

const inpultValue = ref<number | string>('')

const cancel = () => {
  inpultValue.value = ''
}

let obj = ref<ReqAddLabel>({
  value: {
    label_name: '',
    moment: ''
  }
});

const confirm = async () => {
  if (inpultValue.value) {
    obj.value.value.label_name = inpultValue.value
    obj.value.value.moment = momentm(new Date())
    const res = await addLabelApi(obj.value)
    if (res.code == 200) {
      let newLabel: labelData = {
        id: res.data,
        label_name: inpultValue.value,
        moment: obj.value.value.moment
      }
      labels.value.push(newLabel)
      inpultValue.value = ''
      proxy.$message({ type: 'primary', message: '创建成功' })
    }
  } else {
    proxy.$message({ type: 'warning', message: '输入不能为空' })
  }
}

const showmodel = () => {
  visible.value = !visible.value
}
const labels = ref<labelData[]>([])
const rawlabel = async () => {
  const res = await getLabelApi()
  labels.value = res.data
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
      <yk-tag v-for="item in labels" :key="item.id">
        {{ item.label_name }}
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