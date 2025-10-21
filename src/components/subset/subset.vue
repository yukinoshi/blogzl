<script setup lang="ts">
import { useSubsetStore } from '../../store/subset';
import { onMounted, ref, getCurrentInstance } from 'vue';
import SubSetManage from './subset-manage.vue';
import { addSubsetApi, GetSubsetApi } from '../../api/subset';
import type { ReqAddSubset, SubsetData } from '../../utils/interface';
import { momentm } from '../../utils/moment';
import { useArticleStore } from '../../store/article';
import { getArticleApi } from '../../api/article';
const proxy: any = getCurrentInstance()?.proxy

const visible = ref(false)

//获取父组件传过来的type
const props = defineProps({
  type: {
    type: Number,
    default: 2
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

const subsetStore = useSubsetStore();

const articleStore = useArticleStore();

const actived = ref<string>('-1all')

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
  if (res.code != 200){
    proxy.$message({ type: 'warning', message: '获取分组失败' })
    return
  }
  subsetStore.data = res.data.list
  if (props.type == 2) {
    console.log("获取文件");
  } else if (props.type == 0) {
    const articleStore = useArticleStore();
    subsetStore.count = articleStore.count
  } else {
    const res = await getArticleApi({
      pageSize: 1,
      nowPage: 1,
      state: -1,
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

const changeOption = (id: number | string, type: string) => {
  if (id + type != actived.value) {
    actived.value = id + type
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