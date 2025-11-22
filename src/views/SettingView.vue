<script setup lang="ts">
import { getCurrentInstance, reactive, ref, useTemplateRef } from 'vue';
import { avatarList } from '../utils/avatar';
import { useUserStore } from '../store/user';
import { changePasswordApi, changeUserNameApi } from '../api/login';
import type { FormInstance } from '@yike-design/ui/es/components/form';

//获取存储的用户信息
const userInfo = JSON.parse(localStorage.getItem('user') || '{}');

const userStore = useUserStore();

const form = reactive({
  username: userInfo.name || '',
  newPassword: '',
  oldPassword: '',
})

const formName = useTemplateRef<FormInstance>('formName')
const formPassword = useTemplateRef<FormInstance>('formPassword')

const currentAvatarIndex = ref(0);
const proxy: any = getCurrentInstance()?.proxy

const handleAvatarClick = (index: number) => {
  currentAvatarIndex.value = index;
  userStore.avatarIndex = index;
}

const rulesMap = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: ['change', 'blur', 'input'],
    },
    {
      minLength: 4,
      trigger: ['change', 'blur', 'input'],
      message: '请输入用户名',
    },
  ],
  newPassword: [
    {
      required: true,
      message: '请输入新密码',
      trigger: ['change', 'blur', 'input'],
    },
    {
      minLength: 6,
      trigger: ['change', 'blur', 'input'],
      message: '密码长度不能少于6位',
    },
  ],
  oldPassword: [
    {
      required: true,
      message: '请输入旧密码',
      trigger: ['change', 'blur', 'input'],
    },
  ],
}

const changeusername = async () => {
  if (!formName.value) {
    return
  }
  const result = await formName.value.validate()
  if (result || form.username === userInfo.name) {
    proxy.$message({ type: 'warning', message: '请填写正确的用户名' });
    return
  }
  const res = await changeUserNameApi({
    newName: form.username,
    id: userInfo.id
  });
  if (res.code === 200) {
    proxy.$message({ type: 'warning', message: '用户名修改成功，请重新登录' });
    localStorage.removeItem('user');
    proxy.$router.push('/login');
  } else {
    proxy.$message('用户名修改失败 code:' + res.code)
  }
}

const changepassword = async () => {
  if (!formPassword.value) {
    return
  }
  const result = await formPassword.value.validate()
  if (result) {
    proxy.$message({ type: 'warning', message: '请填写正确的密码' });
    return
  }
  const res = await changePasswordApi({
    newPassword: form.newPassword,
    oldPassword: form.oldPassword,
    id: userInfo.id
  });
  if (res.code === 200) {
    proxy.$message({ type: 'warning', message: '密码修改成功，请重新登录' });
    localStorage.removeItem('user');
    proxy.$router.push('/login');
  } else {
    proxy.$message({ type: 'warning', message: '密码修改失败 code:' + res.code });
  }
}
</script>

<template>
  <div class="setting-container">
    <!-- 头像设置区域 -->
    <div class="section-card avatar-section">
      <div class="section-header">
        <h3 class="title">头像设置</h3>
        <p class="subtitle">选择一个你喜欢的默认头像</p>
      </div>
      <div class="avatar-list">
        <div class="avatar-item" v-for="(url, index) in avatarList" :key="index"
          :class="{ active: currentAvatarIndex === index }" @click="handleAvatarClick(index)">
          <yk-avatar :img-url="url" size="xl" shape="circle"></yk-avatar>
          <div class="check-mark" v-if="currentAvatarIndex === index">
          </div>
        </div>
      </div>
    </div>

    <div class="forms-grid">
      <div class="section-card form-card">
        <div class="section-header">
          <h3 class="title">基本信息</h3>
          <p class="subtitle">修改您的账户名称</p>
        </div>
        <yk-form ref="formName" :model="form" layout="vertical" :rules="rulesMap">
          <yk-form-item label="用户名" field="username" :rules="rulesMap.username">
            <yk-input v-model="form.username" placeholder="请输入新的用户名" size="xl" style="width: 100%"></yk-input>
          </yk-form-item>
          <div class="form-footer">
            <yk-button @click="changeusername" size="l" style="width: 100%">保存修改</yk-button>
          </div>
        </yk-form>
      </div>

      <!-- 修改密码 -->
      <div class="section-card form-card">
        <div class="section-header">
          <h3 class="title">安全设置</h3>
          <p class="subtitle">定期修改密码以保护账户安全</p>
        </div>
        <yk-form ref="formPassword" :model="form" layout="vertical" :rules="rulesMap">
          <yk-form-item label="旧密码" field="oldPassword" :rules="rulesMap.oldPassword">
            <yk-input v-model="form.oldPassword" type="password" placeholder="请输入当前密码" style="width: 100%"
              size="xl"></yk-input>
          </yk-form-item>
          <yk-form-item label="新密码" field="newPassword" :rules="rulesMap.newPassword">
            <yk-input v-model="form.newPassword" type="password" placeholder="请输入新密码" style="width: 100%"
              size="xl"></yk-input>
          </yk-form-item>
          <div class="form-footer">
            <yk-button status="danger" @click="changepassword" size="l" style="width: 100%">修改密码</yk-button>
          </div>
        </yk-form>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.setting-container {
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  gap: @space-l;

  .section-card {
    background: @bg-color-l;
    border-radius: @radius-m;
    padding: @space-xl;

    .section-header {
      margin-bottom: @space-xl;

      .title {
        font-size: 18px;
        font-weight: 600;
        color: @font-color-l;
        margin-bottom: 8px;
      }

      .subtitle {
        font-size: 14px;
        color: @font-color-s;
      }
    }
  }

  .avatar-section {
    .avatar-list {
      display: flex;
      flex-wrap: wrap;
      gap: @space-xl;

      .avatar-item {
        position: relative;
        cursor: pointer;
        border-radius: 50%;
        padding: 4px;
        border: 2px solid transparent;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
        }

        &.active {
          border-color: @pcolor; // 使用主题色
          background-color: @lcolor;
        }
      }
    }
  }

  .forms-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
    gap: @space-l;
    align-items: start;

    .form-card {
      display: flex;
      flex-direction: column;

      .form-footer {
        padding-top: @space-xl;
      }
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .setting-container {
    padding: @space-m;

    .forms-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>