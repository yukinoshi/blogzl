<script lang="ts" setup>
import { onMounted, getCurrentInstance, ref, watch } from 'vue';
import type { FileData, ReqFileData } from '../../utils/interface';
import FilesItem from './files-item.vue';
import { useSubsetStore } from '../../store/subset';
import './files.less'
import { changeFileSubsetApi, deleteFileApi, getFileApi } from '../../api/files';

const subsetStore = useSubsetStore();

const proxy: any = getCurrentInstance()?.proxy

function cancel() {
  selectedFilesId.value = []
  subsetSelectedId.value = undefined
  proxy.$message({ type: 'warning', message: '你点击了取消按钮' })
}
async function confirm() {
  for (let i = 0; i < selectedFilesId.value.length; i++) {
    const res = await changeFileSubsetApi({
      id: selectedFilesId.value[i],
      subsetId: subsetSelectedId.value!
    })
    if (res.code !== 200) {
      proxy.$message({ type: 'warning', message: '分组修改失败' })
      return
    }
  }
  emit('CRUDSuccess');
  proxy.$message({ type: 'primary', message: '分组修改成功' })
}
const emit = defineEmits(['CRUDSuccess']);
const files = ref<FileData[]>([])

const props = defineProps({
  pageSize: {
    type: Number,
    default: 14
  },
  subsetId: {
    type: Number,
    default: -2
  },
  FileSubset: {
    type: [Number, String],
    default: ''
  }
})

const count = ref<Number>(0);
const nowPage = ref<number>(1);
const Request: ReqFileData = {
  pageSize: props.pageSize,
  nowPage: nowPage.value,
  subsetId: props.subsetId,
  count: true
}

const getFiles = async () => {
  const res = await getFileApi(Request)
  if (res.code != 200) {
    proxy.$message({ type: 'error', message: '获取文件失败' })
    return
  }
  count.value = res.data.count;
  files.value = res.data.list;
  for (let i = 0; i < files.value.length; i++) {
    files.value[i].selected = false
  }
}
defineExpose({
  getFiles,
})
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

const deleteFile = async (e: number) => {
  const res = await deleteFileApi(e)
  if (res.code !== 200) {
    proxy.$message({ type: 'warning', message: '删除失败' })
    return
  }
  proxy.$message({ type: 'success', message: '删除成功' })
  emit('CRUDSuccess');
  getFiles()
}

const deleteFiles = async () => {
  if (selectedFilesId.value.length > 0) {
    for (let i = 0; i < selectedFilesId.value.length; i++) {
      const res = await deleteFileApi(selectedFilesId.value[i])
      if (res.code !== 200) {
        proxy.$message({ type: 'warning', message: '删除失败' })
        return
      }
    }
    files.value = files.value.filter(item => !selectedFilesId.value.includes(item.id))
    selectedFilesId.value = []
    checkedAll.value = false
    indeterminate.value = false
  }
  emit('CRUDSuccess');
  getFiles()
  proxy.$message({ type: 'success', message: '删除成功' })
}

const changeSubset = async (e: { id: number, subset_id: number }) => {
  const res = await changeFileSubsetApi({
    id: e.id,
    subsetId: e.subset_id
  })
  if (res.code !== 200) {
    proxy.$message({ type: 'warning', message: '分组修改失败' })
    return
  }
  emit('CRUDSuccess');
  proxy.$message({ type: 'primary', message: '分组修改成功' })
  getFiles()
}

const changePage = (e: number) => {
  Request.nowPage = e
  getFiles()
}

const subsetSelectedId = ref<number>();
const changeOption = (e: number) => {
  subsetSelectedId.value = e
}

onMounted(() => {
  getFiles()
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
//当点击分类变化时，重新获取数据
watch(() => props.FileSubset, async (newVal) => {
  Request.subsetId = -2;
  nowPage.value = 1;
  Request.nowPage = nowPage.value;
  if (typeof newVal === 'number') {
    if (newVal !== -1) {
      Request.subsetId = newVal;
      count.value = subsetStore.data.filter(item => item.id === newVal).length;
    } else {//全部
      Request.subsetId = -2;
      nowPage.value = 1;
      Request.nowPage = nowPage.value;
    }
    getFiles();
  } else if (typeof newVal === 'string') {
    Request.subsetId = -1;
  }
  getFiles();
})
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
                {{ item.subset_name }} {{ item.value }}
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
    <div v-if="files.length > 0" class="files_pagination">
      <yk-pagination v-model:current="nowPage" @change="changePage" :total="count" :default-page-size="Request.pageSize"
        size="m" />
    </div>
    <yk-empty description="暂无文件" style="margin: 0 auto;" v-else />
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