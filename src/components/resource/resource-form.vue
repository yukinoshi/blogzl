<script setup lang="ts">
import { getCurrentInstance, onMounted, reactive, ref, useTemplateRef, watch } from 'vue';
import type { ResFileData, SubsetData } from '../../utils/interface';
import { uploadUrl } from '../../hooks/article';
import { Format } from '../../utils/menu';
import { useSubsetStore } from '../../store/subset';
import { addSubsetApi, GetSubsetApi } from '../../api/subset';
import { momentm } from '../../utils/moment';
import type { FormInstance } from '@yike-design/ui/es/components/form';
import { deleteFileApi } from '../../api/files';
import { getResourceByIdApi } from '../../api/resource';
import { baseImgUrl } from '../../utils/env';

const proxy: any = getCurrentInstance()?.proxy

const rulesMap = {
  title: [
    {
      required: true,
      message: '请输入标题',
      trigger: ['change', 'blur', 'input'],
    },
    {
      minLength: 4,
      trigger: ['change', 'blur', 'input'],
      message: '请输入标题',
    },
  ],
  subset_id: [
    {
      required: true,
      message: '请选择分类',
      trigger: ['change', 'blur', 'input'],
    },
  ],
  url: [
    {
      required: true,
      message: '请输入资源地址',
      trigger: ['change', 'blur', 'input'],
    },
  ],
  password: [
    {
      required: true,
      message: '请输入提取码',
      trigger: ['change', 'blur', 'input'],
    },
  ],
  format: [
    {
      required: true,
      message: '请选择资源格式',
      trigger: ['change', 'blur', 'input'],
    },
  ],
}
const form = reactive({
  title: '',
  subset_id: -2,
  url: '',
  password: '',
  introduce: '',
  format: '',
  cover: '',
})

const emits = defineEmits(['formData'])

const fileUrl = ref<{ name: string, url: string }[]>([])

const coverId = ref<number>(-1)

const subsetStore = useSubsetStore();

const inpultValue = ref<number | string>('')

const formRef = useTemplateRef<FormInstance>('formRef')

const props = defineProps<{
  isEdit: boolean
}>()

watch(form, async (newVal) => {
  if (!formRef.value) {
    return
  }
  const res = await formRef.value.validate()
  if (res) {
    console.log('校验失败')
    emits('formData', { isSubmit: false, newVal })
  } else {
    console.log('校验成功')
    emits('formData', { isSubmit: true, newVal })
  }
}, { deep: true })

const getResourceDataById = async (id: number) => {
  const res = await getResourceByIdApi(id);
  if (Number(res.code) !== 200) {
    proxy?.$message?.({ type: 'warning', message: '获取资源数据失败' })
    return;
  }
  form.title = res.data.title;
  form.subset_id = res.data.subset_id || -2;
  form.url = res.data.url;
  form.password = res.data.password;
  form.introduce = res.data.introduce || '';
  console.log(res.data.format);
  
  form.format = res.data.format;
  if (res.data.cover) {
    coverId.value = res.data.coverId || -1;
    form.cover = res.data.cover || '';
    fileUrl.value = [{ name: '封面', url: baseImgUrl + res.data.cover }]
  }
};

watch(() => props.isEdit, () => {
  if (props.isEdit) {
    getResourceDataById(Number(proxy.$route.query.id));
  }
})

//图片提交成功
const handleSuccess = (e: ResFileData) => {
  form.cover = e.data?.url;
  coverId.value = e.data?.id || -1
}

//删除文件回调
const handleDelete = async () => {
  if (coverId.value === -1) {
    form.cover = '';
    fileUrl.value = []
    return
  }
  const res = await deleteFileApi(coverId.value);
  if (res.code !== 200) {
    proxy?.$message?.({ type: 'warning', message: '删除文件失败' })
    return
  }
  form.cover = '';
  fileUrl.value = []
  coverId.value = -1
}

const fetchSubset = async () => {
  const res = await GetSubsetApi(3)
  subsetStore.data = res.data.list
}
//新建分类对象
let obj = ref<{
  value: {
    classify: number;
    subset_name: string;
    moment: string;
  };
}>({
  value: {
    classify: 3,//3是资源分类
    subset_name: '',
    moment: ''
  }
});

//确认新建分类
const confirm = async () => {
  if (inpultValue.value) {
    obj.value.value.subset_name = String(inpultValue.value)
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
const cancel = () => {
  inpultValue.value = ''
}

onMounted(() => {
  fetchSubset()
})
</script>

<template>
  <div class="resource-form">
    <yk-form ref="formRef" :model="form" layout="vertical" :rules="rulesMap">
      <yk-form-item label="资源标题" field="title" :rules="rulesMap.title">
        <yk-input v-model="form.title"></yk-input>
      </yk-form-item>
      <yk-form-item label="资源分类" field="subset_id" :rules="rulesMap.subset_id">
        <yk-radio-group v-model="form.subset_id">
          <yk-radio v-for="item in subsetStore.data" :key="item.id" :value="item.id">{{ item.subset_name }}</yk-radio>
          <yk-popconfirm title="新建分类" @cancel="cancel" @confirm="confirm" placement="bottom" trigger="click">
            <yk-text type="primary" style="cursor: pointer;">
              新建分类
            </yk-text>
            <template #content>
              <div style="margin: 8px 4px 16px;">
                <yk-input placeholder="请输入..." style="width: 208px;" show-counter :limit="6" v-model="inpultValue" />
              </div>
            </template>
          </yk-popconfirm>
        </yk-radio-group>
      </yk-form-item>
      <yk-form-item label="资源地址" field="url" :rules="rulesMap.url">
        <yk-input v-model="form.url"></yk-input>
      </yk-form-item>
      <yk-form-item label="提取码" field="password" :rules="rulesMap.password">
        <yk-input v-model="form.password"></yk-input>
      </yk-form-item>
      <yk-form-item label="说明" field="introduce">
        <yk-input v-model="form.introduce"></yk-input>
      </yk-form-item>
      <yk-form-item label="资源格式" field="format" :rules="rulesMap.format">
        <yk-radio-group v-model="form.format">
          <yk-radio v-for="value in Format" :key="value.value" :value="value.value">{{ value.label }}</yk-radio>
        </yk-radio-group>
      </yk-form-item>
      <yk-form-item size="s" label="封面" field="cover">
        <yk-upload @handleDelete="handleDelete" @handleSuccess="handleSuccess" :limit="1" accept="image/*"
          :upload-url="uploadUrl" :file-list="fileUrl"></yk-upload>
      </yk-form-item>
    </yk-form>
  </div>
</template>

<style lang="less" scoped>
.resource-form {
  background-color: @bg-color-l;
  border-radius: 12px;
  padding: 24px;
  width: 100%;

}
</style>