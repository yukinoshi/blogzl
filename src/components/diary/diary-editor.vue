<script setup lang="ts">
import { ref } from 'vue';
import { weathers } from '../../utils/weather'

const uploadUrl = 'https://www.huohuo90.com:3005/upload'
const inputValue = ref<string>('');

type DiaryForm = {
  title?: string;
  content?: string;
  picture?: string[];
  weatherId: number;
}

const diaryform = ref<DiaryForm>({
  weatherId: 0
})

const selectWeather = (id: number) => {
  diaryform.value.weatherId = id
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
                :class="{ selected: diaryform.weatherId === item.id }" :key="item.id" @click="selectWeather(item.id)">
                <img :src="'/src/assets/' + item.icon" />
              </div>
            </yk-space>
          </template>
          <img :src="'/src/assets/' + weathers[diaryform.weatherId].icon" alt="" srcset="">
        </yk-popover>
      </div>
      <yk-text-area clearable v-model="diaryform.content" :max-lenght="1600" placeholder="请输入内容" :auto-size="{
        minRows: 24,
        maxRows: 24,
      }"></yk-text-area>
      <div class="diary-editor-picture">
        <yk-upload :upload-url="uploadUrl" :file-list="diaryform.picture" accept="image/*"></yk-upload>
      </div>
    </div>

    <div class="diary-editor-foot">
      <yk-space size="s">
        <yk-button type="secondary">取消</yk-button>
        <yk-button>新建笔记</yk-button>
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