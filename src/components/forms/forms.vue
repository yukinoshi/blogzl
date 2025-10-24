<script setup lang="ts">
import { computed, getCurrentInstance, onMounted, ref, watch, type PropType } from 'vue';
import type { labelData, ReqArticle, ResFileData, SubsetData } from '../../utils/interface';
import { useSubsetStore } from '../../store/subset';
import { GetSubsetApi } from '../../api/subset';
import { getLabelApi } from '../../api/label';
import { deleteFileApi } from '../../api/files';
import type { articleData } from '../../utils/interface';
import { baseImgUrl } from '../../utils/env';

const props = defineProps({
  classify: {
    default: 0,
    type: Number
  },
  editInfo: {
    default: () => ({} as articleData),
    type: Object as PropType<articleData>
  }
})

const proxy: any = getCurrentInstance()?.proxy


const raws = computed(() => {
  return props.classify === 1 ? { minRows: 24, maxRows: 30 } : { minRows: 4, maxRows: 10 }
})
let coverId = ref<number>()

const emits = defineEmits(['formData'])
const subsetStore = useSubsetStore()
//渲染选择数据
const formData = ref<ReqArticle>({
  value: {
    title: '',
    subset_id: undefined,
    label: [] as string[],
    introduce: '',
    cover: '',
    moment: '',
    classify: props.classify
  }
})

const subsetList = ref<SubsetData[]>([])

const subsetName = ref<string | number>('')
// —— 回显辅助：规范 id 并根据 id 查找名称 ——
const normalizeId = (v: unknown): number | undefined => {
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}
const updateSubsetNameById = (rawId: unknown) => {
  const id = normalizeId(rawId)
  if (id == null) return
  const hit = subsetList.value.find(it => normalizeId((it as any).id) === id)
  subsetName.value = (hit as any)?.subset_name ?? ''
}
//存在的标签数组数据
const labelDate = ref<labelData[]>([])
//渲染的标签数组
const labelArr = ref<string[]>([])

const inputLabel = ref<string>('')

//上传成功回调
const handleSuccess = (e: ResFileData) => {
  formData.value.value.cover = e.data?.url;
  coverId.value = e.data?.id;
}
//删除文件回调
const handleDelete = async () => {
  if (coverId.value) {
    const res = await deleteFileApi(coverId.value);
    if (res.code !== 200) {
      proxy?.$message?.({ type: 'warning', message: '删除文件失败' })
      return
    }
    formData.value.value.cover = '';
    coverId.value = undefined;
    fileUrl.value = []
  }
}

//添加标签
const addLabel = () => {
  if (!inputLabel.value) return
  // 确保 label 为数组
  const labels = formData.value.value.label ?? (formData.value.value.label = [])
  if (!labels.includes(inputLabel.value) && labels.length < 3) {
    labels.push(inputLabel.value)
    inputLabel.value = ''
  }
}
//获取标签数据
const rawLabel = async () => {
  try {
    const res = await getLabelApi();
    if (res.code != 200) {
      proxy?.$message?.({ type: 'warning', message: '获取标签失败' })
      return
    }
    // 安全兜底：data 可能为 undefined
    labelDate.value = (res.data ?? []) as labelData[]
    labelArr.value = (labelDate.value ?? []).map(item => String((item as any)?.label_name ?? ''))
  } catch (e) {
    proxy?.$message?.({ type: 'warning', message: '获取标签异常' })
  }
}

//选择标签
const selectLabel = (tag: string) => {
  const labels = formData.value.value.label ?? (formData.value.value.label = [])
  if (!labels.includes(tag) && labels.length < 3) {
    labels.push(tag)
  }
}
//删除标签
const deleteTag = (tag: string) => {
  const labels = formData.value.value.label ?? []
  formData.value.value.label = labels.filter(item => item !== tag)
}

//获取分类数据
const getSubset = async () => {
  try {
    const res = await GetSubsetApi(props.classify)
    if (res.code != 200) {
      proxy?.$message?.({ type: 'warning', message: '获取分组失败' })
      return
    }
    // 安全兜底：data 或 list 可能为 undefined
    subsetStore.data = (res.data?.list ?? []) as SubsetData[]
    subsetList.value = subsetStore.data
    const idFromProps = (props.editInfo as any)?.subsetId ?? (props.editInfo as any)?.subset_id
    updateSubsetNameById(formData.value.value.subset_id ?? idFromProps)
  } catch (e) {
    proxy?.$message?.({ type: 'warning', message: '获取分组异常' })
  }
}

//选择分类
const subsetSelect = (e: number) => {
  formData.value.value.subset_id = e;
  subsetName.value = subsetList.value.find((item: { id: number; }) => item.id === e)?.subset_name || '';
}

const visible = ref<boolean>(false)
const showModal = () => {
  visible.value = true
}

const uploadUrl = computed(() => {
  const token = JSON.parse(localStorage.getItem('user') || '{}').token
  return token ? `/api/upload?token=${encodeURIComponent(token)}` : `/api/upload`
})
const fileUrl = ref<{ name: string; url: string }[]>([])

watch(formData, (newVal) => {
  emits('formData', newVal)
}, { deep: true })

onMounted(() => {
  getSubset()
  rawLabel()

})
// 当分类列表异步返回后，再根据已有的 subset_id 补一次名称回显
watch(
  () => subsetList.value,
  (list) => {
    if (!list || list.length === 0) return
    const rawId = formData.value.value.subset_id ?? (props.editInfo as any)?.subsetId ?? (props.editInfo as any)?.subset_id
    updateSubsetNameById(rawId)
  },
  { deep: false, immediate: true }
)

watch(() => props.editInfo, (newVal) => {
  if (newVal && newVal.id) {
    formData.value.value.title = newVal.title
    formData.value.value.subset_id = (newVal as any).subsetId ?? (newVal as any).subset_id
    // 列表可能尚未就绪，这里也先行回显一次，列表到达后 watch(subsetList) 会再次兜底
    updateSubsetNameById(formData.value.value.subset_id)
    formData.value.value.label = newVal.label || []
    formData.value.value.introduce = newVal.introduce
    formData.value.value.cover = newVal.cover
    if (formData.value.value.cover) {
      fileUrl.value =[{ name: '封面', url:  baseImgUrl + formData.value.value.cover }]
    }
  }
}, { deep: true })
</script>

<template>
  <div class="form">
    <yk-space dir="vertical" size="xl">
      <input v-model="formData.value.title" type="text" class="form-title" placeholder="请输入标题" />
      <yk-space align="center">
        <div class="subset">
          <input style="width: 110px; line-height: 28px;" type="text" placeholder="请选择分类" disabled
            v-model="subsetName" />
          <IconDownOutline />
          <yk-dropdown @selected="subsetSelect">
            <yk-dropdown-item v-for="item in subsetList" :key="item.id" :value="item.id">
              {{ item.subset_name }}
            </yk-dropdown-item>
          </yk-dropdown>
        </div>
        <yk-space align="center">
          <yk-tag @close="deleteTag(tag)" v-for="tag, index in (formData.value.label || [])" :key="index" closeable
            shape="round">
            {{ tag }}
          </yk-tag>
          <yk-text v-show="(formData.value.label?.length ?? 0) < 3" style="cursor: pointer; white-space: nowrap;"
            @click="showModal" type="third">
            插入标签
          </yk-text>
        </yk-space>
      </yk-space>
      <div :class="{ introduce: props.classify === 0 }">
        <yk-text-area v-model="formData.value.introduce" placeholder="请输入简介" :max-length="800"
          :auto-size="raws"></yk-text-area>
      </div>
    </yk-space>
    <div class="form-cover" v-if="props.classify === 0">
      <yk-upload @handleDelete="handleDelete" @handleSuccess="handleSuccess" :limit="1" accept="image/*"
        desc="封面800X600" :upload-url="uploadUrl" :file-list="fileUrl"></yk-upload>
    </div>
    <yk-modal :show-footer="false" v-model="visible" title="标签" size="s">
      <yk-space dir="vertical" size="l">
        <yk-input v-model="inputLabel" placeholder="请输入标签" style="width: 280px;" @submit="addLabel" />
        <yk-space size="s">
          <yk-tag @close="deleteTag(tag)" v-for="tag, index in (formData.value.label || [])" :key="index" closeable
            shape="round">
            {{ tag }}
          </yk-tag>
        </yk-space>
        <yk-space wrap size="s">
          <yk-tag style="cursor: pointer;" @click="selectLabel(tag)" v-for="tag, index in labelArr" :key="index"
            shape="round">
            {{ tag }}
          </yk-tag>
        </yk-space>
      </yk-space>
    </yk-modal>
  </div>
</template>

<style lang="less" scoped>
.form {
  position: relative;
  padding-top: @space-xl;

  input {
    border: none;
    outline: none;
    background: transparent;

    &::placeholder {
      color: @gray-4;
    }
  }

  &-title {
    font-size: @size-xl;
    font-weight: 600;
  }

  .yk-dropdown {
    position: absolute;
    top: 0;
  }

  .yk-text-area {
    border: 0;
    background-color: transparent;
    padding: 0;
  }

  .introduce {
    width: 100%;
    border-bottom: 1px solid @gray-2;
  }

  &-cover {
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>

<style lang="less">
.form {
  .yk-dropdown__title {
    width: 120px;
    height: 24px;
  }

  .yk-upload__picture-button {
    width: 160px;
    height: 120px;
  }

  .yk-upload-picture {
    width: 160px;
    height: 120px;
  }
}
</style>