<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { subset, label } from '../../mock/data';
import type { labelData } from '../../utils/interface';

const props = defineProps({
  classify: {
    default: 0,
    type: Number
  }
})

const raws = computed(() => {
  return props.classify === 1 ? { minRows: 24, maxRows: 30 } : { minRows: 4, maxRows: 10 }
})

const emits = defineEmits(['formData'])



//渲染选择数据
const formData = ref({
  title: '',
  subsetId: null as number | string | null,
  label: [] as string[],
  introduce: '',
  cover: '',
})

const subsetList = ref()

const subsetName = ref<string>('')
//存在的标签数组数据
const labelDate = ref<labelData[]>([])
//渲染的标签数组
const labelArr = ref<string[]>([])

const inputLabel = ref<string>('')

const addLabel = () => {
  if (inputLabel.value && !formData.value.label.includes(inputLabel.value) && formData.value.label.length < 3) {
    formData.value.label.push(inputLabel.value)
    inputLabel.value = ''
  }
}

const rawLabel = () => {
  labelDate.value = label.list
  labelArr.value = labelDate.value.map(item => String(item.name))
}

const subsetSelect = (e: number) => {
  formData.value.subsetId = e;
  subsetName.value = subsetList.value.find((item: { id: number; }) => item.id === e)?.name || '';
}

const selectLabel = (tag: string) => {
  if (!formData.value.label.includes(tag) && formData.value.label.length < 3) {
    formData.value.label.push(tag)
  }
}

const deleteTag = (tag: string) => {
  formData.value.label = formData.value.label.filter(item => item !== tag)
}

const getSubset = () => {
  subsetList.value = subset.data.list
}

const visible = ref<boolean>(false)
const showModal = () => {
  visible.value = true
}

const uploadUrl = "";
const fileUrl = ref([])

watch(formData, (newVal) => {
  emits('formData', newVal)
}, { deep: true })

onMounted(() => {
  getSubset()
  rawLabel()
})
</script>

<template>
  <div class="form">
    <yk-space dir="vertical" size="xl">
      <input v-model="formData.title" type="text" class="form-title" placeholder="请输入标题" />
      <yk-space align="center">
        <div class="subset">
          <input style="width: 110px; line-height: 28px;" type="text" placeholder="请选择分类" disabled
            v-model="subsetName" />
          <IconDownOutline />
          <yk-dropdown @selected="subsetSelect">
            <yk-dropdown-item v-for="item in subsetList" :key="item.id" :value="item.id">
              {{ item.name }}
            </yk-dropdown-item>
          </yk-dropdown>
        </div>
        <yk-space align="center">
          <yk-tag @close="deleteTag(tag)" v-for="tag, index in formData.label" :key="index" closeable shape="round">
            {{ tag }}
          </yk-tag>
          <yk-text v-show="formData.label.length < 3" style="cursor: pointer; white-space: nowrap;" @click="showModal"
            type="third">
            插入标签
          </yk-text>
        </yk-space>
      </yk-space>
      <div :class="{introduce: props.classify === 0}">
        <yk-text-area v-model="formData.introduce" placeholder="请输入简介" :max-length="800" :auto-size="raws"></yk-text-area>
      </div>
    </yk-space>
    <div class="form-cover" v-if="props.classify === 0">
      <yk-upload :limit="1" accept="image/*" desc="封面800X600" :upload-url="uploadUrl"
        :file-list="fileUrl"></yk-upload>
    </div>
    <yk-modal :show-footer="false" v-model="visible" title="标签" size="s">
      <yk-space dir="vertical" size="l">
        <yk-input v-model="inputLabel" placeholder="请输入标签" style="width: 280px;" @submit="addLabel" />
        <yk-space size="s">
          <yk-tag @close="deleteTag(tag)" v-for="tag, index in formData.label" :key="index" closeable shape="round">
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