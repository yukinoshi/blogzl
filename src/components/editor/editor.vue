<script lang="ts" setup>
import './index.less' // 引入 css
import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { IToolbarConfig, IEditorConfig } from '@wangeditor/editor';
import { colors } from "./colors.js";

const top = ref<boolean>(false)
const toolbarTop = (e: boolean) => {
  top.value = e
}

const emits = defineEmits(['editors'])

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('<p>hello</p>')

const toolbarConfig: Partial<IToolbarConfig> = {
  toolbarKeys: [
    // 菜单 key
    "blockquote",
    'headerSelect',
    // 分割线
    '|',
    // 菜单 key
    'bold',
    'underline',
    'through',
    'italic',
    'color',
    'bgColor',
    'clearStyle',
    // 分割线
    '|',
    "bulletedList",
    "numberedList",
    "todo",
    // 菜单组，包含多个菜单
    {
      key: 'group-justify', // 必填，要以 group 开头
      title: '对齐', // 必填
      iconSvg: '<svg viewBox="0 0 1024 1024" class="w-e-icon"><path d="M128 192h768v64H128zm0 192h768v64H128zm0 192h768v64H128zm0 192h768v64H128z"></path></svg>', // 可选，菜单图标，svg 格式
      menuKeys: [
        'justifyLeft',
        'justifyRight',
        'justifyCenter',
        'justifyJustify'
      ], // 下级菜单 key ，必填
    },
    {
      key: 'group-indent', // 必填，要以 group 开头
      title: '缩进', // 必填
      iconSvg: '<svg viewBox="0 0 1024 1024" class="w-e-icon"><path d="M128 192h768v64H128zm0 192h768v64H128zm0 192h768v64H128zm0 192h768v64H128zM128 384v256l96-128z"></path></svg>', // 可选，菜单图标，svg 格式
      menuKeys: [
        'indent',
        'delIndent'
      ],
    },
    // 继续配置其他菜单...
    '|',
    'emotion',
    'insertLink',
    'uploadImage',
    'insertVideo',
    'insertTable',
    "|",
    "code",
    "codeBlock",
  ]
}
const editorConfig: Partial<IEditorConfig> = {
  MENU_CONF: {
    color: {
      colors,
    },
    bgColor: {
      colors,
    },
    uploadImage: {
      customInsert(res: any, insertFn: InsertFnType) {
        // insertFn(url,alt, href)
      }
    }
  },
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor: any) => {
  // console.log(editor.getAllMenuKeys());
  editorRef.value = editor // 记录 editor 实例，重要！
}

const onChange = () => {
  emits('editors', valueHtml.value)
}




</script>


<template>
  <yk-affix :offset="60" @change="toolbarTop">
    <Toolbar :class="{ istop: top }" class="toolbar" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
  </yk-affix>
  <div class="editor-main">
    <slot>
    </slot>
    <Editor style="min-height: 500px; width: 820px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig"
      :mode="mode" @onCreated="handleCreated" @onChange="onChange" />
  </div>
</template>

<style lang="less" scoped>
.toolbar {
  // overflow: hidden;
  border-radius: @radius-s;
  width: 1200px;
  background-color: @bg-color-l;
}

.editor-main {
  padding-top: @space-xl;
  margin-top: @space-s;
  border-radius: @radius-m;
  background-color: @bg-color-l;
  width: 1200px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.istop {
  box-shadow: @shadow-m;
}
</style>