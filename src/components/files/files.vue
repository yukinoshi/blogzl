<script lang="ts" setup>
import { onMounted, getCurrentInstance, ref } from 'vue';
import { mkfiles } from '../../mock/data';
import type { FileData } from '../../utils/interface';
import FilesItem from './files-item.vue';
import { useSubsetStore } from '../../store/subset';
import './files.less'

const subsetStore = useSubsetStore();

const proxy: any = getCurrentInstance()?.proxy
function cancel() {
  proxy.$message({ type: 'warning', message: '你点击了取消按钮' })
}
function confirm() {
  proxy.$message({ type: 'primary', message: '你点击了确认按钮' })
}

const files = ref<FileData[]>([])
type FileProps = {
  pageSize: number;
  subsetId: number | string;
}

const props = withDefaults(defineProps<FileProps>(), {
  pageSize: 12,
  subsetId: -1,
})

const count = ref<Number>(0);
type request = {
  token?: string;
  pageSize: number;//单页条数；
  nowPage: number;//当前页
}
const Request: request = {
  pageSize: props.pageSize,
  nowPage: 1,
}

const getFiles = (e: boolean) => {
  const data = mkfiles
  if (e) {
    count.value = data.count
  }
  files.value = data.list.slice(
    (Request.nowPage - 1) * Request.pageSize,
    Request.nowPage * Request.pageSize
  )
  for (let i = 0; i < files.value.length; i++) {
    files.value[i].selected = false
  }
}

//被选择ID图片数组
const selectedFilesId = ref<number[]>([])
const selectFile = (e: number) => {
  for (let i = 0; i < files.value.length; i++) {
    if (files.value[i].id === e) {
      files.value[i].selected = !files.value[i].selected
      if (files.value[i].selected) {
        selectedFilesId.value.push(e)
      } else {
        selectedFilesId.value = selectedFilesId.value.filter(item => item !== e)
      }
      if (selectedFilesId.value.length === 0) {
        indeterminate.value = false
        checkedAll.value = false
      } else if (selectedFilesId.value.length === files.value.length) {
        indeterminate.value = false
        checkedAll.value = true
      } else {
        indeterminate.value = true
        checkedAll.value = false
      }
    }
  }
}

const deleteFile = (e: number) => {
  files.value = files.value.filter(item => item.id !== e)
}

const deleteFiles = () => {
  if (selectedFilesId.value.length > 0) {
    files.value = files.value.filter(item => !selectedFilesId.value.includes(item.id))
    selectedFilesId.value = []
    checkedAll.value = false
    indeterminate.value = false
  }
}

const changeSubset = (e: { subsetId: number | string }) => {
  proxy.$message({ type: 'primary', message: e.subsetId + '分组修改成功' })
  
}


const changePage = (e: number) => {
  Request.nowPage = e
  getFiles(false)
}

const subsetSelectedId = ref<number | string>();
const changeOption = (e: number | string) => {
  subsetSelectedId.value = e
}

onMounted(() => {
  getFiles(true)
})

const checkedAll = ref(false)
const indeterminate = ref(false)
const handleChangeAll = (value: boolean) => {
  indeterminate.value = false
  selectedFilesId.value = []
  if (value) {
    checkedAll.value = true
    for (let i = 0; i < files.value.length; i++) {
      files.value[i].selected = true
      if (!selectedFilesId.value.includes(files.value[i].id)) {
        selectedFilesId.value.push(files.value[i].id)
      }
    }
  } else {
    checkedAll.value = false
    for (let i = 0; i < files.value.length; i++) {
      files.value[i].selected = false
    }
  }
}
const removeAll = () => {
  checkedAll.value = false
  indeterminate.value = false
  selectedFilesId.value = []
  for (let i = 0; i < files.value.length; i++) {
    files.value[i].selected = false
  }
}
</script>

<template>
  <div class="files">
    <div class="files_tool" v-show="selectedFilesId.length > 0">
      <yk-space>
        <yk-checkbox :checked="checkedAll" :indeterminate="indeterminate" @change="handleChangeAll">
          全选
        </yk-checkbox>
        <yk-text>已选择 {{ selectedFilesId.length }} 项内容</yk-text>
        <yk-text type="primary" style="cursor: pointer;" @click="removeAll">取消选择</yk-text>
      </yk-space>

      <yk-space>
        <IconDeleteOutline class="files_tool-delete" @click="deleteFiles" />
        <yk-popconfirm trigger="click" title="选择分组" placement="bottomRight" @cancel="cancel" @confirm="confirm">
          <IconSwitchOutline class="files_tool-switch" />
          <template #content>
            <yk-scrollbar ref="scrollbar" height="148px" class="subset">
              <div :class="{ 'subset-selected': subsetSelectedId == item.id }" @click="changeOption(item.id)"
                v-for="item in subsetStore.data" class="subset-item" :key="item.id">
                {{ item.name }} {{ item.value }}
              </div>
            </yk-scrollbar>
          </template>
        </yk-popconfirm>
      </yk-space>
    </div>
    <div class="files_main">
      <FilesItem @selected="selectFile" @delete="deleteFile" @changeSubsetId="changeSubset" v-for="item in files"
        :key="item.id" :data="item" />
    </div>
    <div class="files_pagination">
      <yk-pagination @change="changePage" :total="count" :default-page-size="Request.pageSize" size="m" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.files {
  padding: @space-xl;
  border-radius: @radius-m;
  background: @bg-color-l;
  width: 100%;

  &_tool {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: @space-l;
    border-radius: @radius-m;
    background: @bg-color-m;

    &-delete,
    &-switch {
      width: 20px;
      height: 20px;
      color: @font-color-s;
      cursor: pointer;

      &:hover {
        color: @font-color-l;
      }
    }
  }

  &_main {
    padding: 24px 0 32px;
    display: grid;
    grid-template-columns: repeat(auto-fill, 200px);
    row-gap: 32px;
    column-gap: 24px;
    justify-content: center;
  }

  &_pagination {
    padding: @space-l 0 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>