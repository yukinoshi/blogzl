<script setup lang="ts">
import { onMounted, ref, getCurrentInstance, watch } from 'vue';
import ResourceItem from './resource-item.vue';
import type { ReqResourcePage, ResourceData } from '../../utils/interface';
import { deleteResourceByIdApi, getResourcePageApi } from '../../api/resource';
import { useResourceStore } from '../../store/resource';

const nowpage = ref<number>(1);

const resourceStore = useResourceStore()

const proxy: any = getCurrentInstance()?.proxy

const resourceList = ref<ResourceData[]>([]);

const count = ref<number>(0);

const props = defineProps({
  pagesize: {
    type: Number,
    default: 8
  },
  subsetId: {
    type: [Number, String],
    default: -2
  },
  serchTerm: String,
})

const request: ReqResourcePage = {
  pageSize: props.pagesize,
  nowPage: nowpage.value,
  subsetId: props.subsetId,
  serchTerm: props.serchTerm,
  count: true,
}

const getResourceData = async (includeCount: boolean, reset: boolean) => {
  const res = await getResourcePageApi(request);
  if (res.code !== 200) {
    proxy.$message({ type: 'warning', message: '操作失败' })
    resourceList.value = [];
    return
  }
  if (request.subsetId == -2) { // 全部
    if (reset) {
      resourceStore.data = res.data.list;
    } else {
      resourceStore.data = [...resourceStore.data, ...res.data.list];
    }
    resourceList.value = res.data.list;
    if (includeCount) {
      resourceStore.count = res.data.count || 0;
      count.value = res.data.count || 0;
    } else {
      count.value = resourceStore.count;
    }
  } else {
    resourceList.value = res.data.list;
    if (includeCount) {
      count.value = res.data.count;
    }
  }
}

const deleteresource = async (id: number) => {
  // 删除资源后刷新列表
  const res = await deleteResourceByIdApi(id);
  if (res.code !== 200) {
    proxy.$message({ type: 'warning', message: '删除失败' })
    return
  } else {
    proxy.$message({ type: 'success', message: '删除成功' })
    getResourceData(true, true);
  }
}

const changePage = async (page: number) => {
  nowpage.value = page;
  request.nowPage = nowpage.value;
  getResourceData(false, false);
}

watch(() => props.subsetId, (newVal) => {
  if (typeof newVal === 'number') {
    if (newVal != -1) {
      request.subsetId = newVal;
    } else {
      request.subsetId = -2;
    }
  } else {
    request.subsetId = -1;
  }
  nowpage.value = 1;
  request.nowPage = nowpage.value;
  getResourceData(true, true);
}, { immediate: true }
)

//当搜索词变化时，重新获取数据
watch(() => props.serchTerm, async (newVal) => {
  request.serchTerm = newVal;
  nowpage.value = 1;
  request.nowPage = nowpage.value;
  getResourceData(true, true);
})

onMounted(() => {
  getResourceData(true, true);
})
</script>

<template>
  <div class="resource">
    <div class="resource-content">
      <ResourceItem v-for="item in resourceList" @delete="deleteresource" :data="item" :key="item.id" />
    </div>
    <div v-if="resourceList.length > 0" class="resource_pagination">
      <yk-pagination @change="changePage" :default-page-size="pagesize" v-model:current="nowpage" :total="count"
        size="m" />
    </div>
    <yk-empty description="暂无文章" v-else />
  </div>
</template>

<style lang="less" scoped>
.resource {
  &-content {
    display: grid;
    grid-template-columns: minmax(480px, 1000px) minmax(480px, 1000px);
    gap: 24px;
    justify-content: center;
  }

  .resource_pagination {
    width: 100%;
    padding-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 32px;
  }
}
</style>