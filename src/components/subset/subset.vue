<script setup lang="ts">
import { subset, state } from '../../mock/data';
import { useSubsetStore } from '../../store/subset';
import { onMounted, ref, getCurrentInstance } from 'vue';
import SubSetManage from './subset-manage.vue';
const proxy: any = getCurrentInstance()?.proxy

const visible = ref(false)

const emits = defineEmits(['nowSubset'])

const inpultValue = ref<number | string>('')

const subsetStore = useSubsetStore();

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
    subsetStore.data.push(obj)
    inpultValue.value = ''
    proxy.$message({ type: 'primary', message: '创建成功' })
  } else {
    proxy.$message({ type: 'warning', message: '输入不能为空' })
  }
}

const showmodel = () => {
  visible.value = !visible.value
}

const rawSubset = () => {
  subsetStore.data = subset.data.list
  subsetStore.count = subset.data.count
}

const changeOption = (id: number | string, type: string) => {
  if (id + type != actived.value) {
    actived.value = id + type
    emits('nowSubset', { id, type })
  }
}

onMounted(() => {
  rawSubset()
})

</script>

<template>
  <div class="subset">
    <yk-space wrap>
      <div class="subset_menu" @click="changeOption('-1', 'all')"
        :class="{ 'subset_menu_actived': actived == '-1all' }">
        全部{{ subsetStore.count }}
      </div>
      <div class="subset_menu" @click="changeOption(item.id, 'state')" v-for="item in state.data" :key="item.id"
        :class="{ 'subset_menu_actived': actived == item.id + 'state' }">
        {{ item.name }}{{ item.value }}
      </div>
      <div class="subset_menu" @click="changeOption(subsetStore.exclude.id, 'exclude')"
        :class="{ 'subset_menu_actived': actived == subsetStore.exclude.id + 'exclude' }">
        {{ subsetStore.exclude.name }}{{ subsetStore.exclude.value }}
      </div>
      <div class="subset_menu" @click="changeOption(item.id, 'subset')" v-for="item in subsetStore.data" :key="item.id"
        :class="{ 'subset_menu_actived': actived == item.id + 'subset' }">
        {{ item.name }}{{ item.value }}
      </div>
    </yk-space>
    <yk-space style="flex: none;">
      <yk-popconfirm title="新建分组" @cancel="cancel" @confirm="confirm" placement="bottom" trigger="click">
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
          管理分组
        </yk-text>
    </yk-space>
    <yk-modal v-model="visible" title="管理分组">
      <SubSetManage></SubSetManage>
      <template #footer>
        <yk-button @click="showmodel">确定</yk-button>
      </template>
    </yk-modal>
  </div>
</template>

<style lang="less" scoped>
.subset {
  padding: @space-l @space-xl;
  border-radius: @radius-m;
  background-color: @bg-color-l;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .yk-text {
    cursor: pointer;
  }

  &_menu {
    padding: 0 @space-l;
    background: @bg-color-s;
    border-radius: @radius-r;
    line-height: 32px;
    user-select: none;
    cursor: pointer;

    &_actived {
      background-color: @pcolor-1;
      color: @pcolor;
      font-weight: 500;
    }
  }
}
</style>