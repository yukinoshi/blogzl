<script setup lang="ts">
import { useSubsetStore } from '../../store/subset';
import { onMounted, onActivated, ref, getCurrentInstance, watch } from 'vue';
import SubSetManage from './subset-manage.vue';
import { addSubsetApi, GetSubsetApi, getSubsetByIdApi } from '../../api/subset';
import type { ReqAddSubset, ReqSubsetbyId, SubsetData } from '../../utils/interface';
import { momentm } from '../../utils/moment';
import { useArticleStore } from '../../store/article';
import { getArticleApi } from '../../api/article';
import { getFileApi } from '../../api/files';
import { getResourcePageApi } from '../../api/resource';
const proxy: any = getCurrentInstance()?.proxy
const visible = ref(false)

//获取父组件传过来的type
const props = defineProps({
  type: {
    type: Number,
    default: 2
  },
  search: {
    type: Boolean,
    default: false
  }
})

const inpultValue = ref<number | string>('')

let obj = ref<ReqAddSubset>({
  value: {
    classify: props.type,//2是文件资源
    subset_name: '',
    moment: ''
  }
});

const emit = defineEmits(['setSubsetId'])


const subsetStore = useSubsetStore();

const articleStore = useArticleStore();

const actived = ref<string>('-1all')

const ReqSubsetId = ref<ReqSubsetbyId>({
  value: []
})

const cancel = () => {
  inpultValue.value = ''
}

const confirm = async () => {
  if (inpultValue.value) {
    obj.value.value.subset_name = inpultValue.value
    obj.value.value.moment = momentm(new Date())
    const res = await addSubsetApi(obj.value)
    if (res.code == 200) {
      let newSubset: SubsetData = {
        id: res.data,
        subset_name: inpultValue.value,
        value: 0,
        moment: obj.value.value.moment
      }
      subsetStore.data.push(newSubset)
      inpultValue.value = ''
      obj.value.value.subset_name = ''
      obj.value.value.moment = ''
      proxy.$message({ type: 'primary', message: '创建成功' })
    }
  } else {
    proxy.$message({ type: 'warning', message: '输入不能为空' })
  }
}

const showmodel = () => {
  visible.value = !visible.value
}

const rawSubset = async () => {
  const res = await GetSubsetApi(props.type)
  if (res.code != 200) {
    proxy.$message({ type: 'warning', message: '获取分组失败' })
    return
  }
  subsetStore.data = res.data.list
  if (props.type == 2) {
    const res = await getFileApi({
      subsetId: -2,
      pageSize: 14,
      nowPage: 1,
      count: true,
    })
    subsetStore.count = res.data.count
  } else if (props.type == 0) {
    subsetStore.count = articleStore.tempcount
  } else if (props.type == 3) {//修改这里，资源分享
    const res = await getResourcePageApi({
      subsetId: -2,
      pageSize: 8,
      nowPage: 1,
      count: true,
    })
    subsetStore.count = res.data.count
  } else {
    const res = await getArticleApi({
      pageSize: 12,
      nowPage: 1,
      state: -2,
      subsetId: -1,
      serchTerm: '',
      count: true,
      classify: 1 //图库
    })
    if (res.code == 200) {
      subsetStore.count = res.data.count
    }
  }
}
defineExpose({
  rawSubset,
})
//切换分类
const changeOption = (id: number | string, type: string) => {
  if (id + type != actived.value) {
    actived.value = id + type
  }
  emit('setSubsetId', id)
}
//搜索状态根据搜索的东西重新获取分类数据
const watchSearch = async () => {
  // 空数组或未初始化都直接清空并返回
  if (!articleStore.data || articleStore.data.length === 0) {
    subsetStore.data = []
    subsetStore.count = 0
    return
  }
  // 重置构造请求体，避免多次调用叠加
  ReqSubsetId.value.value = []
  //获取文章的分类id 然后放到数组 获取到一个就value值+1
  for (const item of articleStore.data) {
    const subsetId = item.subset_id
    if (typeof subsetId === 'number') {
      const exist = ReqSubsetId.value.value.find((obj) => obj.id === subsetId)
      if (exist) {
        exist.count += 1
        continue
      }
      const temp = {
        id: subsetId,
        count: 1
      }
      ReqSubsetId.value.value.push(temp)
    }
  }
  const res = await getSubsetByIdApi(ReqSubsetId.value)
  if (res.code != 200) {
    proxy.$message({ type: 'warning', message: '获取分组失败' })
    return
  }
  // 重置数据，防止重复累加
  subsetStore.data = []
  subsetStore.count = 0
  subsetStore.data = res.data.list
  subsetStore.count = articleStore.data.length
}

onMounted(() => {
  // 只调用一种数据来源，避免并发覆盖
  if (props.search) {
    watchSearch()
  } else {
    rawSubset()
  }
})

// 如果页面使用了 keep-alive，组件被重新激活时也刷新一次，保证无需手动刷新
onActivated(() => {
  if (props.search) {
    watchSearch()
  } else {
    rawSubset()
  }
})

// 当文章列表增减（新增/删除）时，自动刷新分组数据（按原有逻辑重新拉取）
watch(
  () => articleStore.data.length,
  () => {
    if (props.search) {
      watchSearch()
    } else {
      rawSubset()
    }
  }
)

// 当总计数变化（例如列表页重新统计）时，也刷新一次
watch(
  () => articleStore.tempcount,
  () => {
    if (props.search) {
      watchSearch()
    } else {
      rawSubset()
    }
  }
)

</script>

<template>
  <div class="subset">
    <yk-space wrap>
      <div class="subset_menu" @click="changeOption(-1, 'all')" :class="{ 'subset_menu_actived': actived == '-1all' }">
        全部{{ props.type == 0 ? articleStore.tempcount : subsetStore.count }}
      </div>
      <div v-if="props.type === 0" class="subset_menu" @click="changeOption(articleStore.exclude[0].id, 'publish')"
        :class="{ 'subset_menu_actived': actived == articleStore.exclude[0].id + 'publish' }">
        {{ articleStore.exclude[0].name }}{{ articleStore.exclude[0].value }}
      </div>
      <div v-if="props.type === 0" class="subset_menu" @click="changeOption(articleStore.exclude[1].id, 'unpublish')"
        :class="{ 'subset_menu_actived': actived == articleStore.exclude[1].id + 'unpublish' }">
        {{ articleStore.exclude[1].name }}{{ articleStore.exclude[1].value }}
      </div>
      <div class="subset_menu" @click="changeOption(subsetStore.exclude.id, 'exclude')"
        :class="{ 'subset_menu_actived': actived == subsetStore.exclude.id + 'exclude' }">
        {{ subsetStore.exclude.name }}{{ subsetStore.exclude.value }}
      </div>
      <div class="subset_menu" @click="changeOption(item.id, 'subset')" v-for="item in subsetStore.data" :key="item.id"
        :class="{ 'subset_menu_actived': actived == item.id + 'subset' }">
        {{ item.subset_name }} {{ item.value }}
      </div>
    </yk-space>
    <yk-space style="flex: none;">
      <yk-popconfirm title="新建分类" @cancel="cancel" @confirm="confirm" placement="bottom" trigger="click">
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