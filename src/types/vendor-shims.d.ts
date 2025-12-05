declare module '@wangeditor/editor-for-vue' {
  import type { DefineComponent } from 'vue'

  export const Editor: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>
  export const Toolbar: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>
  export default Editor
}

declare module '@yike-design/resolver' {
  import type { ComponentResolver } from 'unplugin-vue-components'

  export function YikeResolver(): ComponentResolver | ComponentResolver[]
}
