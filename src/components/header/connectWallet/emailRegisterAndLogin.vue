<template>
  <div  v-loading="loading3" :element-loading-background="isDark ? 'rgba(19, 23, 34 0.2)' : 'rgba(255, 255, 255, 0.2)'" :class="['w-emailRegister', mode]">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="0"
      autocomplete="off"
      size="large"
      @submit.prevent
    >
      <el-form-item label="" prop="email">
        <el-input
          v-model="form.email"
          :autocomplete="'new-email' + Math.random()"
          :placeholder="$t('startEmail')"
          class="color-[--d-333-l-F2F2F2]"
          name="emailField"
        />
      </el-form-item>

      <el-form-item
        v-if="cType == 'register' || (cType == 'login' && loginType == 'email')"
        label=""
        prop="verificationCode"
      >
        <el-input
          v-model="form.verificationCode"
          :autocomplete="'new-verificationCode' + Math.random()"
          :placeholder="$t('startVerificationCode')"
          name="new-verificationCode"
        >
          <template #suffix>
            <el-button
              class="countdownBtn"
              link
              :disabled="isCounting"
              :loading="loading2"
              :style="{
                color: mode == 'dark' ? '#3F80F7' : '#3F80F7',
              }"
              @click="sendVerificationCode"
            >
              {{
                isCounting ? `${count}${$t("SS")}` : $t("startCountDown")
              }}</el-button
            >
          </template>
        </el-input>
      </el-form-item>

      <el-form-item
        v-if="
          cType == 'register' || (cType == 'login' && loginType == 'password')
        "
        label=""
        prop="password"
      >
        <el-input
          v-model="form.password"
          type="password"
          name="password_field"
          :autocomplete="'new-password' + Math.random()"
          :placeholder="$t('startPassword')"
          show-password
        />
      </el-form-item>

      <el-form-item v-if="cType == 'register'" label="" prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          type="password"
          name="confirm_password_field"
          :placeholder="$t('startConfirmPassword')"
          :autocomplete="'new-password2' + Math.random()"
          show-password
        />
      </el-form-item>
      <el-form-item
        v-if="cType == 'register'"
        label-position="top"
        prop="refCode"
      >
        <label
          class="el-form-item__label icon"
          :style="{ marginBottom: showRefCode ? '10px' : '0' }"
          @click="showRefCode = !showRefCode"
        >
          <div
            class="gap-8px flex items-center cursor-pointer w-100%"
          >
            {{ $t("startInvitationCode") }}
            <el-icon class="h-5.5px w-9.5px">
              <ArrowUp v-if="showRefCode" />
              <ArrowDown v-else />
            </el-icon>
          </div>
        </label>
        <el-input
          v-if="showRefCode"
          v-model="form.refCode"
          autocomplete="off"
          :placeholder="$t('startInvitationCode')"
          :disabled="!!refCode"
        />
      </el-form-item>
      <el-form-item v-if="cType == 'login'" class="mb-10px">
        <label
          class="el-form-item__label icon mb-0 justify-between!"
        >
          <a
            class="gap-8px flex items-center clickable underline! color-[--d-F5F5F5-l-333]"
            @click="loginType = loginType === 'password' ? 'email' : 'password'"
          >
            {{
              loginType !== "email"
                ? $t("startVcodeLogin")
                : $t("startPwdLogin")
            }}
            <!-- <el-icon class="h-11.33px w-13.33px">
              <Switch />
            </el-icon> -->
          </a>
          <a
            class="gap-8px flex items-center clickable underline! color-[--d-F5F5F5-l-333]"
            @click.prevent="emit('update:c-type', 'reset')"
          >
            {{ $t("startForgetPassword") }}
          </a>
        </label>
      </el-form-item>
      <el-form-item class="mb-10px!">
        <el-button
          class="h-48px!"
          :color="'#3F80F7'"
          size="large"
          :disabled="cType == 'register' && !form.agree"
          :loading="loading"
          style="width: 100%;"
          @click="submitForm"
          >{{ $t("startSubmit") }}</el-button
        >
      </el-form-item>
      <p class="botFooter">
        <span :style="lang == 'en' ? { 'margin-right': '10px' } : ''">{{
          cType == "register" ? $t("startBotFooter11") : $t("startBotFooter21")
        }}</span>
        <a
          v-if="cType == 'register'"
          href="javascript:void(0)"
          class="color-[#3F80F7]"
          @click.prevent="emit('update:c-type', 'login')"
        >
          {{ $t("startBotFooter12") }}</a
        >
        <a
          v-else
          href="javascript:void(0)"
          class="color-[#3F80F7]"
          @click.prevent="emit('update:c-type', 'register')"
        >
          {{ $t("register") }}</a
        >
      </p>
      <el-form-item
        v-if="cType == 'register'"
        size="small"
        class="h-20px lh-20px mt-20px mb-0px!"
      >
        <el-checkbox v-model="form.agree" class="text-[#999] mx-auto! my-0">
          {{ $t("startFooter1") }}&nbsp;
          <el-link
            type="primary"
            underline="never"
            class="decoration-underline!"
            :href="
              !lang?.includes?.('zh-')
                ? 'https://doc.ave.ai/cn/yong-hu-xie-yi'
                : 'https://doc.ave.ai/ave.ai-user-agreement'
            "
            target="_blank"
            >&nbsp;{{ $t("startFooter2") }}</el-link
          >
          &nbsp;{{ $t("startFooter3") }}
          <el-link type="primary" underline="never" href="https://ave.ai/privacy" target="_blank" class="decoration-underline!">
            &nbsp;{{ $t("startFooter4") }}</el-link
          >
        </el-checkbox>
      </el-form-item>
    </el-form>
    <el-divider v-if="cType === 'login'" class="w-divider">
      <span class="font-400">
        {{ $t("startTg") }}
      </span>
    </el-divider>
    <ul v-show="cType === 'login'" class="w-loginByThird">
      <li class="relative">
        <el-button class="w-[100%]" :color="isDark ? '#333' : '#F2F2F2'" :loading="loading4" :disabled="disabled4">
          <div id="g_id_onload" :class="[loading4 ? 'loading' : '']" />
        </el-button>
      </li>
      <li>
        <el-button class="inline-block w-[100%]" :color="isDark ? '#333' : '#F2F2F2'" @click.stop="botStore.tgLogin()"
          ><img src="@/assets/images/tgIcon.svg" width="20" height="20" >
        </el-button>
      </li>
    </ul>
    <!-- <slot v-if="cType == 'login'" name="nav" /> -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import sha256 from 'crypto-js/sha256'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import Cookies from 'js-cookie'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

type RuleForm = {
  email: string;
  verificationCode: string;
  password: string;
  confirmPassword: string;
  refCode?: string;
  agree: boolean;
};

const userStore = useUserStore()
const botStore = useBotStore()
const {mode,lang,isDark} = storeToRefs(useGlobalStore())
const { t } = useI18n()
const props = defineProps({
  cType: {
    type: String,
    required: true,
    validator: (value: string) => {
      return ['login', 'register', 'reset'].includes(value)
    },
  },
})

const emit = defineEmits<{
  (e: 'update:c-type', cType: 'login' | 'register'| 'reset'): void
}>()
const count = ref(60)
const isCounting = ref(false)
const loading = ref(false)
const loading2 = ref(false)
const loading3 = ref(false)
const loading4 = ref(true)
const disabled4 = ref(true)
const timer = ref<ReturnType<typeof setInterval> | undefined>(undefined)
const loginType = ref('password')
const showRefCode = ref(false)
const formRef = useTemplateRef<FormInstance>('formRef')

const form = reactive<RuleForm>({
  email: '',
  verificationCode: '',
  password: '',
  confirmPassword: '',
  refCode: Cookies.get('refCode'),
  agree: false,
})

const refCode = ref(Cookies.get('refCode'))

const rules = computed<FormRules<RuleForm>>(() => {
  return {
    email: [
      {
        required: true,
        message: t('startEmailRequiredMsg'),
        trigger: 'blur',
      },
      {
        type: 'email',
        message: t('startEmailError'),
        trigger: ['blur', 'change'],
      },
    ],
    verificationCode: [
      {
        required: true,
        message: t('startVerificationCodeRequiredMsg'),
        trigger: 'blur',
      },
    ],
    password: [
      {
        required: true,
        message: t('startPasswordRequiredMsg'),
        trigger: 'blur',
      },
      {
        pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@#$%^&*!]{8,20}$/,
        message: t('startPasswordError'),
        trigger: 'blur',
      },
    ],
    confirmPassword: [
      {
        required: true,
        message: t('startConfirmPasswordRequiredMsg'),
        trigger: 'blur',
      },
      { validator: validatePassword, trigger: 'blur' },
    ],
  }
})

function validatePassword(
  rule: any,
  value: string,
  callback: (error?: Error) => void
) {
  if (value !== form.password) {
    callback(new Error(t('startConfirmPasswordError')))
  } else {
    callback()
  }
}

function startCountdown() {
  formRef?.value?.validateField('email', (valid) => {
    if (valid) {
      userStore
        .sendEmailCode({
          email: form.email,
          language: lang.value == 'zh-cn' || lang.value == 'zh-tw' ? 'cn' : 'en',
          emailType: props.cType == 'register' ? 'register' : 'login',
          refCode: form.refCode || refCode.value,
        })
        .then(() => {
          initCountdown()
          console.log(`验证码已发送到 ${form.email}`)
          loading2.value = false
        })
        .catch((err) => {
          ElMessage.error(String(err))
          loading2.value = false
        })
    } else {
      console.log('邮箱格式不正确，无法发送验证码')
      loading2.value = false
    }
  })
}

function initCountdown() {
  isCounting.value = true
  timer.value = setInterval(() => {
    if (count.value > 0) {
      count.value--
    } else {
      if (timer.value !== undefined) {
        clearInterval(timer.value)
        timer.value = undefined
      }
      resetCountdown()
    }
  }, 1000)
}

function resetCountdown() {
  isCounting.value = false
  count.value = 60
}

function sendVerificationCode() {
  loading2.value = true
  startCountdown()
}

function login() {
  formRef?.value?.validate((valid) => {
    if (valid) {
      // const lang = localStorage.language || Cookies.get("language") || "en";
      const req =
        loginType.value === 'password'
          ? userStore.loginEmail({
              email: form.email,
              password: sha256(form.password).toString(),
              // language: lang == "zh-cn" || lang == "zh-tw" ? "cn" : "en",
            })
          : userStore.emailCodeLogin({
              email: form.email,
              code: form.verificationCode,
              refCode: form.refCode || refCode.value,
              // language: lang == "zh-cn" || lang == "zh-tw" ? "cn" : "en",
            })
      req
        .then(() => {
          loading.value = false
          // store.commit("changeConnectVisible", false);
          botStore.changeConnectVisible(false)
        })
        .catch((err) => {
          // store.commit('showMessage', { type: 'error', text: err });
          ElMessage.error(String(err))
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      console.log('登录失败')
      loading.value = false
    }
  })
}

function register() {
  formRef?.value?.validate((valid) => {
    if (valid) {
      const lang = localStorage.language || Cookies.get('language') || 'en'
      const language = lang == 'zh-cn' || lang == 'zh-tw' ? 'cn' : 'en'
      userStore
        .registerEmail({
          email: form.email,
          password: sha256(form.password).toString(),
          code: form.verificationCode,
          language,
          refCode: form.refCode || refCode.value,
        })
        .then(() => {
          loading.value = false
          ElMessage.success(
            language === 'cn'
              ? '注册成功,去登录'
              : 'Registration successful, go to log in'
          )
          setTimeout(() => {
            emit('update:c-type', 'login')
          }, 1500)
        })
        .catch((err) => {
          ElMessage.error(String(err))
          // store.commit('showMessage', { type: 'error', text: err })
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      console.log('注册失败')
      loading.value = false
    }
  })
}
function submitForm() {
  loading.value = true
  if (props.cType == 'login') {
    login()
  } else {
    register()
  }
}

function handleCredentialResponse(response: any) {
  console.log('Encoded JWT ID Token: ' + response.credential)
  const language = lang.value == 'zh-cn' || lang.value == 'zh-tw' ? 'cn' : 'en'
  loading3.value = true
  userStore
    .loginGoogle({
      idToken: response.credential || '',
      refCode: form.refCode || refCode.value,
    })
    .then(() => {
      ElMessage.success(language === 'cn' ? '登录成功' : 'Log in successful')
      // store.commit('showMessage', {
      //   type: 'success',
      //   text: language === 'cn' ? '登录成功' : 'Log in successful'
      // })
      loading3.value = false
      botStore.changeConnectVisible(false)
    })
    .catch((err) => {
      ElMessage.error(String(err))
    })
    .finally(() => {
      loading3.value = false
    })
}

// Add this type declaration at the top of your <script setup lang="ts"> section

function initGoogleLogin() {
  if (!window.google) return
  const google = window.google as any
  google.accounts.id.initialize({
    client_id:
      '631329100197-b57e5f06avvas9cdojmlp9d7imst26u2.apps.googleusercontent.com',
    callback: handleCredentialResponse,
  })
  google.accounts.id.renderButton(document.getElementById('g_id_onload'), {
    type: 'standard',
    shape: 'rectangular',
    theme: 'outline',
    text: 'signin_with',
    size: 'large',
    width: 205,
  })
  const iframe = document.querySelector('#g_id_onload iframe') as HTMLElement
  const button = document.querySelector(
    '#g_id_onload div[role="button"]'
  ) as HTMLElement
  if (button) {
    button.style = 'display: none;'
  }
  if (!iframe) return
  iframe.style = 'display: none;'
  iframe.onload = () => {
    iframe.style = `
      position: absolute;
      top: -6px;
      left: -91px;
      width: 205px;
      height: 32px;
      opacity: 0;
      pointer-events: auto;
      z-index: 1;
    `
    loading4.value = false
  }
}

onMounted(() => {
  formRef.value?.resetFields()
  loading4.value = true
  const gsiClientEl = document.querySelector('#gsiClient')
  if (!gsiClientEl) {
    const script = document.createElement('script')
    script.id = 'gsiClient'
    script.src = 'https://accounts.google.com/gsi/client'
    document.body.appendChild(script)
    script.onload = () => {
      disabled4.value = false
      initGoogleLogin()
    }
    // 设置一个延时，确保 Google 登录按钮加载完成
    setTimeout(() => {
      if(disabled4.value ){
        loading4.value = false
        disabled4.value = true
      }
    }, 5000)
  } else {
    initGoogleLogin()
  }
})

watch(
  () => form.email,
  (newEmail) => {
    userStore.email = newEmail
  },
  { immediate: true }
)

watch(
  () => botStore.connectVisible,
  () => {
    formRef.value?.resetFields()
    form.agree = false
  }
)

onBeforeUnmount(() => {
  clearInterval(timer.value)
})
</script>

<style lang='scss' scoped>
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.w-divider {
  border-color: #333;
  margin: 50px 0 40px 0;
  --el-bg-color: #222222;
  --el-text-color-primary: var(--d-666-l-CCC);
}

.w-emailRegister {
  :deep() .el-form-item {
    font-size: 14px;
    font-weight: 400;
  }

  :deep() .el-input {
    height: 48px;
  }

  :deep() .el-button.is-link {
    color: #f5f5f5;
  }

  .el-form-item {
    margin-bottom: 20px;
  }

  .el-form-item__label.icon {
    color: #f5f5f5;
    display: flex;
    width: 100%;
    height: 20px;
    line-height: 20px;
    font-style: 14px;
    padding-right: 0;
    margin-bottom: 0;
  }

  .el-link.el-link--primary {
    --el-link-text-color: #f5f5f5;
    --el-link-hover-text-color: #f5f5f5;
    font-size: 12px !important;
    line-height: 12px !important;
  }

  :deep(.el-checkbox__label) {
    font-size: 12px !important;
    line-height: 12px !important;
    display: flex;
    align-items: center;
  }

  :deep() .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #999;
  }

  :deep() .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #333;
    border-color: #999;
  }

  :deep() .el-checkbox__inner:hover {
    border-color: #f5f5f5;
  }

  .countdownBtn {
    &.el-button.is-link {
      font-weight: 400;
      color: #f5f5f5;

      &.is-disabled {
        color: #f5f5f5;

        &:hover {
          color: #f5f5f5;
        }
      }
    }
  }

  ul.w-loginByThird {
    display: flex;
    justify-content: center;
    gap: 20px;
    align-items: flex-start;
    flex-wrap: nowrap;
    >li{
      flex: 1;
    }
    .googleLoading {
      display: inline-block;
      width: 36px;
      height: 36px;
      position: absolute;
      color: transparent;
      top: 0;
      transform-origin: center center;
      animation: rotate 1s linear infinite;
    }
  }

  .botFooter {
    color: #999999;
    display: flex;
    font-size: 14px;
    height: 20px;
    margin: 0;
    margin-bottom: 10px;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    font-weight: 400;

    a {
      /* color: #f5f5f5; */
      display: inline-block;
      line-height: 16.8px;
    }
  }

  .loginByOther {
    color: #999999;
    font-size: 12px;
    font-weight: 400;
    display: flex;
    margin: 0;
    padding: 0;
    margin-top: 20px;
    justify-content: center;
    align-items: center;

    a {
      color: #999999;
      font-size: 12px;
      font-weight: 400;
      display: flex;
      margin: 0;
      justify-content: center;
    }
  }
}

.light {
  &.w-emailRegister {
    .el-link.el-link--primary {
      --el-link-text-color: #333333;
      --el-link-hover-text-color: #333333;
    }

    :deep() .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #999;

      &::hover {
        color: #999;
      }
    }

    :deep() .el-checkbox__input.is-checked .el-checkbox__inner {
      background-color: #333;
      border-color: #999;
    }

    :deep() .el-checkbox__inner {
      border-color: var(--d-EAECEF-l-333);
    }

    :deep() .el-checkbox__inner:hover {
      border-color: var(--d-EAECEF-l-333);
    }

    .countdownBtn {
      &.el-button.is-link {
        color: #333333;
        font-weight: 400;

        &.is-disabled {
          color: #333333;

          &:hover {
            color: #333333;
          }
        }
      }
    }

    .w-divider {
      color: #ffffff;
      border-color: #d8d8dc;
      --el-bg-color: #ffffff;
    }

    .botFooter {
      a {
        /* color: #222222; */
        display: inline-block;
      }
    }

    .el-form-item__label.icon {
      color: #333333;
    }
  }
}

:deep() #g_id_onload {
  width: 20px;
  height: 20px;
  background: url("@/assets/images/ggIcon.svg") center no-repeat;
  background-size: cover;
}
</style>
