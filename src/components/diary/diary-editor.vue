<script setup lang="ts">
import { computed, ref, getCurrentInstance } from 'vue';
import { weathers } from '../../utils/weather'
import type { Photo, ReqAddDiary, ResFileData } from '../../utils/interface';
import { deleteFileApi } from '../../api/files';
import { addDiaryApi } from '../../api/diary';
import { momentm } from '../../utils/moment';
const proxy: any = getCurrentInstance()?.proxy

const uploadUrl = computed(() => {
  const token = JSON.parse(localStorage.getItem('user') || '{}').token
  return token ? `/api/upload?token=${encodeURIComponent(token)}` : `/api/upload`
})
const emit = defineEmits(['refreshDiary'])
const diaryform = ref<ReqAddDiary>({
  title: '',
  content: '',
  picture: [],
  weather_id: 0,
  moment: ''
})
const photos = ref<Photo[]>([]);
//上传成功回调
const handleSuccess = (e: ResFileData) => {
  if (e.code !== 200) {
    proxy.$message({ type: 'warning', message: '上传失败' })
    return
  }
  photos.value.push({
    id: e.data.id,
    url: e.data.url
  })
}
//删除文件回调
const deleteImage = async (index: any) => {
  const id = photos.value[index[0]].id
  const res = await deleteFileApi(id)
  if (res.code !== 200) {
    proxy.$message({ type: 'warning', message: '删除失败' })
    return
  }
  photos.value = photos.value.filter(item => item.id !== id)
  proxy.$message({ type: 'success', message: '删除成功' })
}

const selectWeather = (id: number) => {
  diaryform.value.weather_id = id
}

const cancel = () => {
  diaryform.value = {
    title: '',
    content: '',
    picture: [],
    weather_id: 0,
    moment: ''
  }
  photos.value = []
}

const createDiary = async () => {
  diaryform.value.moment = momentm(new Date())
  diaryform.value.picture = JSON.stringify(photos.value)
  const request = {
    value: {
      ...diaryform.value
    }
  }
  const res = await addDiaryApi(request)
  if (res.code !== 200) {
    proxy.$message({ type: 'warning', message: '新建失败' })
    return
  }
  proxy.$message({ type: 'success', message: '新建成功' })
  cancel()
  //重新加载日记列表
  emit('refreshDiary')
}

</script>

<template>
  <div class="diary-editor">
    <div class="diary-editor-form">
      <div class="diary-editor-top">
        <input class="diary-editor-title" v-model="diaryform.title" placeholder="请输入标题" />
        <yk-popover style="cursor: pointer;" placement="bottomRight" title="选择天气">
          <template #content>
            <yk-space wrap :size="[32, 20]" style="padding: 16px 0 16px 14px;">
              <div class="diary-editor-weather" v-for="item in weathers"
                :class="{ selected: diaryform.weather_id === item.id }" :key="item.id" @click="selectWeather(item.id)">
                <img :src="'/src/assets/' + item.icon" />
              </div>
            </yk-space>
          </template>
          <img :src="'/src/assets/' + weathers[diaryform.weather_id].icon" alt="" srcset="">
        </yk-popover>
      </div>
      <yk-text-area clearable v-model="diaryform.content" :max-lenght="1600" placeholder="请输入内容" :auto-size="{
        minRows: 24,
        maxRows: 24,
      }"></yk-text-area>
      <div class="diary-editor-picture">
        <yk-upload @handleSuccess="handleSuccess" @handleDelete="deleteImage" :upload-url="uploadUrl"
          :file-list="photos" accept="image/*"></yk-upload>
      </div>
    </div>

    <div class="diary-editor-foot">
      <yk-space size="s">
        <yk-button type="secondary" @click="cancel">取消</yk-button>
        <yk-button @click="createDiary">新建日记</yk-button>
      </yk-space>
    </div>
  </div>
</template>

<style lang="less" scoped>
.diary-editor {
  background: @bg-color-l;
  border-radius: @radius-m;
  width: 100%;

  &-form {
    padding: @space-xl;
  }

  &-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &-title {
    font-size: @size-xl;
    font-weight: bold;
    color: @font-color-l;
    padding-bottom: @space-m;
  }

  &-picture {
    padding-top: @space-xl;
  }

  &-weather {
    cursor: pointer;
  }

  .selected {
    &::before {
      position: absolute;
      bottom: -6px;
      left: 9px;
      content: "";
      display: block;
      width: 6px;
      height: 6px;
      border-radius: 4px;
      background-color: @pcolor;
    }
  }

  input {
    border: none;
    outline: none;
    background-color: transparent;

    &::placeholder {
      color: @gray-3;
    }
  }

  &-foot {
    display: flex;
    justify-content: end;
    padding: @space-m;
    border-top: 1px solid @line-color-s;
  }
}
</style>

<style lang="less">
.diary-editor {
  .yk-text-area {
    background-color: transparent;
    border: none;
    border-radius: 0;
    padding: 0;
  }

  .yk-text-area__inner {
    font-style: @size-m;
    line-height: 1.5;

    &::placeholder {
      color: @gray-5;
    }
  }
}
</style>