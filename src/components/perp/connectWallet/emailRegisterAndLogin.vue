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
              type="primary"
              @click="sendVerificationCode"
            >
              {{
                isCounting ? `${count}${$t("SS")}` : $t("startCountDown")
              }}</el-button
            >
          </template>
        </el-input>
      </el-form-item>
      <el-form-item class="mb-10px!">
        <el-button
          v-show="!(cType === 'login' && loginType === 'password')"
          class="h-48px!"
          type="primary"
          size="large"
          :disabled="cType == 'register' && !form.agree"
          :loading="loading"
          style="width: 100%;margin-left: 0;"
          @click="submitForm"
          >{{ $t("startSubmit") }}</el-button
        >
      </el-form-item>
      <div class="text-align mb-52px">
        <button type="button" class="h-48px bg-transparent text-14px border-none clickable color-[--secondary-text]" @click.stop="emit('close')">{{ $t("later") }}</button>
      </div>
      <div class="text-12px flex items-center justify-center color-[--main-text] font-400 flex-wrap lh-24px">
        <span>{{ $t('bindBenefitsTitle') }}</span>
        <img src="@/assets/images/ref.svg" class="h-14px mr-8px ml-20px" alt="" srcset="">
        <span>{{ $t('highCommission') }}</span>
        <img src="@/assets/images/perp-p.svg" class="h-14px mr-8px ml-16px" alt="" srcset="">
        <span>{{ $t('multiPlatformSync') }}</span>
        <img src="@/assets/images/perp-c.svg" class="h-14px mr-8px ml-16px" alt="" srcset="">
        <span>{{ $t('multiBotWallet') }}</span>
      </div>
      <div class="mt-12px text-12px color-[--secondary-text] font-400 text-12px">{{ $t('bindEmailDescription') }}</div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import sha256 from 'crypto-js/sha256'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import Cookies from 'js-cookie'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { emailCodeLogin } from '~/api/bot'
import { usePerpStore } from '~/stores/perp'

type RuleForm = {
  email: string;
  verificationCode: string;
  password: string;
  confirmPassword: string;
  refCode?: string;
  agree: boolean;
};

const userStore = useUserStore()
const perpStore = usePerpStore()
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
const emit = defineEmits(['update:c-type', 'close'])
const count = ref(60)
const isCounting = ref(false)
const loading = ref(false)
const loading2 = ref(false)
const loading3 = ref(false)
const loading4 = ref(true)
const timer = ref<ReturnType<typeof setInterval> | undefined>(undefined)
const loginType = ref('email')
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
      if (loginType.value === 'password') {
        loading.value = true
        return
      }
      _login()
    } else {
      loading.value = false
    }
  })
}

function _login() {
  loading.value = true
    emailCodeLogin({
      email: form.email,
      code: form.verificationCode,
      refCode: form.refCode || refCode.value,
    }).then((res) => {
      loading.value = false
      // localStorage.setItem('perp_accessToken', res.accessToken)
      perpStore.perpAcc = res.accessToken
      emit('close')
    })
    .catch((err) => {
      ElMessage.error(String(err))
    })
    .finally(() => {
      loading.value = false
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


onMounted(() => {
  form.email = ''
  form.verificationCode = ''
  form.password = ''
  form.confirmPassword = ''
  formRef.value?.resetFields()
  loading4.value = true
  // initCaptcha()
})

watch(
  () => form.email,
  (newEmail) => {
    userStore.email = newEmail
  },
  { immediate: true }
)


onBeforeUnmount(() => {
  clearInterval(timer.value)
})
</script>

<style lang="scss" scoped>
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
  --el-bg-color: var(--dialog-bg);
  --el-text-color-primary: var(--third-text);
}

.w-emailRegister {
  :deep() .el-form-item {
    font-size: 14px;
    font-weight: 400;
  }

  :deep() .el-input {
    height: 48px;
  }

  // :deep() .el-button.is-link {
  //   color: #f5f5f5;
  // }

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
      background: transparent;
      --el-mask-color-extra-light: transparent;

      &.is-disabled {
        color: var(--main-text);

        &:hover {
           color: var(--main-text);
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
    :deep() .el-button.is-loading:before {
      background-color: transparent;
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

    // .countdownBtn {
    //   &.el-button.is-link {
    //     color: #333333;
    //     font-weight: 400;

    //     &.is-disabled {
    //       color: #333333;

    //       &:hover {
    //         color: #333333;
    //       }
    //     }
    //   }
    // }

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
