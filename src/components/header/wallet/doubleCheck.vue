<template>
  <div :class="['w-check', mode]">
    <div class="flex-start text-20px tg-wallet-list_title">
      <el-icon size="24" class="clickable" @click="back">
        <Back />
      </el-icon>
      <span class="ml-5">{{ $t('withdraw') }}</span>
    </div>
    <div class="w-content">
      <div class="m-content">
        <ul v-if="step === 0" class="checkType">
          <h4>{{ $t('DbCheckTitle1') }}</h4>
          <li @click="(step = 1) && (checkType = 'google')">
              <span><img src="@/assets/images/checkLogo2.svg" alt="" width="14" lazy>{{ $t('DbCheckGg') }}</span>
              <el-icon size="24" class="clickable">
                  <Right />
              </el-icon>
          </li>
          <li @click="(step = 1) && (checkType = 'email')">
            <!-- mode === 'light' -->
            <span>
              <img v-if="!isDark" src="@/assets/images/checkLogo11.svg" alt="" width="14">
              <img v-else src="@/assets/images/checkLogo1.svg" alt="" width="14">{{ $t('DbCheckEmail') }}
            </span>
            <el-icon size="24" class="clickable">
              <Right />
            </el-icon>
          </li>
        </ul>
        <div v-show="step === 1" v-loading="loading3" :element-loading-background="isDark ? 'rgba(19, 23, 34 0.2)' : 'rgba(255, 255, 255, 0.2)'" class="checkType-content">
          <!-- <loading
            v-model:active="loading3" :can-cancel="false" loader="dots" :opacity="0.2"
            :backgroundColor="!isDark ? '#fff' : '#131722'" color="var(--custom-primary-color)"
            :is-full-page="false" /> -->
          <div v-show="(checkType === 'google') && (googleAuth.authSetting === false)">
            <ul>
              <li>
                <label>{{ $t('DbCheckContentTitle1') }}</label>
                <div>
                  <div class="mb-6px">{{ $t('DbCheckContentContent11') }}</div>
                  <a
                    class="decoration-underline"
                    href="https://doc.ave.ai/cn/ave.ai-jiao-cheng/gu-ge-yan-zheng-qi-an-zhuang-jiao-cheng"
                    target="_blank">{{ $t('DbCheckContentContent12') }}</a>
                </div>
              </li>
              <li>
                <label>{{ $t('DbCheckContentTitle2') }}</label>
                <div>
                  <div class="mb-6px">{{ $t('DbCheckContentContent2') }}</div>
                  <el-skeleton :loading="loading4" animated :throttle="500">
                    <template #template>
                      <el-skeleton-item variant="h1" class="w-[100%] h-48px mb-6px" />
                      <el-skeleton-item variant="image" class="w-120px h-120px mb-5px" />
                    </template>
                    <template #default />
                  </el-skeleton>
                  <div v-show="!loading4">
                    <el-input v-model="googleAuth.secret" disabled>
                      <template #suffix>
                        <a
                          v-copy="googleAuth.secret" href="javascript:void(0)"
                          class="text-14px font-400 lh-20px text-left text-from-font decoration-none text-#3F80F7">Copy</a>
                      </template>
                    </el-input>
                    <canvas id="qr-google-canvas" />
                  </div>
                </div>
              </li>
              <li>
                <label>{{ $t('DbCheckContentTitle3') }}</label>
                <div>{{ $t('DbCheckContentContent3') }}</div>
              </li>
            </ul>
            <el-button
              :color="isDark ? '#f5f5f5' : '#333333'" size="large" type="primary"
              class="w-[100%] mt-30px" @click="googleAuth.authSetting = 'pending'">{{
                $t('confirm')
              }}</el-button>
          </div>
          <div
            v-show="(checkType === 'google') && (googleAuth.authSetting === true || googleAuth.authSetting === 'pending')">
            <el-form
              ref="googleAuthRef" :model="googleAuth" :rules="rules" label-width="0" autocomplete="off"
              size="large" @submit.prevent>
              <div class="tip">{{ $t('DbCheckTitle2') }}</div>
              <el-form-item label="" prop="authCode">
                <el-input
                  v-model="googleAuth.authCode" :autocomplete="'new-authCode' + Math.random()"
                  :placeholder="$t('authCode')" name="authCodeField" />
              </el-form-item>
              <el-form-item class="absolute bottom-20px left-20px w-320px">
                <el-button
                  :color="isDark ? '#f5f5f5' : '#333333'" size="large" class="w-[100%]" type="primary"
                  @click="confirmAuth">{{
                    $t('confirm')
                  }}</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div v-if="checkType === 'email'">
            <!-- 通过email 判断是否需要绑定 -->
            <el-form
              v-if="!email" ref="formRef" :model="form" :rules="rules" label-width="0" autocomplete="off"
              size="large" @submit.prevent>
              <el-form-item label="" prop="email">
                <el-input
                  v-model="form.email" :autocomplete="'new-email' + Math.random()"
                  :placeholder="$t('startEmail')" name="emailField" />
              </el-form-item>
              <el-form-item label="" prop="verificationCode">
                <el-input
                  v-model="form.verificationCode" :autocomplete="'new-verificationCode' + Math.random()"
                  :placeholder="$t('startVerificationCode')" name="new-verificationCode">
                  <template #suffix>
                    <el-button
                      class="countdownBtn" link :disabled="disabledCountdownBtn" :loading="loading2" :style="{
                      color: isDark ? '#f5f5f5' : '#333333',
                    }" @click="sendVerificationCode">
                      {{
                        isCounting ? `${count}${$t("SS")}` : $t("startCountDown")
                      }}</el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="" prop="password">
                <el-input
                  v-model="form.password" type="password" name="password_field"
                  :autocomplete="'new-password' + Math.random()" :placeholder="$t('startPassword')" show-password />
              </el-form-item>
              <el-form-item label="" prop="confirmPassword">
                <el-input
                  v-model="form.confirmPassword" type="password" name="confirm_password_field"
                  :placeholder="$t('startConfirmPassword')" :autocomplete="'new-password2' + Math.random()"
                  show-password />
              </el-form-item>
              <el-form-item size="small" class="h-20px lh-20px">
                <el-checkbox v-model="form.agree" class="text-[#999] w-[100%]">
                  {{ $t("startFooter1") }}&nbsp;
                  <el-link
                    type="primary" :href="!lang?.includes?.('zh')
                    ? 'https://doc.ave.ai/cn/yong-hu-xie-yi'
                    : 'https://doc.ave.ai/ave.ai-user-agreement'
                    " target="_blank">&nbsp;{{ $t("startFooter2") }}</el-link>
                  &nbsp;{{ $t("startFooter3") }}
                  <el-link type="primary" href="https://ave.ai/privacy" target="_blank">
                    &nbsp;{{ $t("startFooter4") }}</el-link>
                </el-checkbox>
              </el-form-item>
              <el-form-item>
                <el-button
                  :color="isDark ? '#f5f5f5' : '#333333'" :class="['btn']" size="large" type="primary"
                  :loading="loading" :disabled="!form.agree" style="width: 100%;--el-button-disabled-text-color:#000000"
                  @click="submitForm">{{
                    $t('confirm')
                  }}</el-button>
              </el-form-item>
            </el-form>
            <el-form
              v-else ref="formRef2" :model="form2" :rules="rules" label-width="0" autocomplete="off" size="large"
              @submit.prevent>
              <div class="tip">{{ $t('enterEmailCodeTips', { email: showEmail }) }}</div>
              <el-form-item label="" prop="verificationCode">
                <el-input
                  v-model="form2.verificationCode" :autocomplete="'new-verificationCode2' + Math.random()"
                  :placeholder="$t('startVerificationCode')" name="new-verificationCode2">
                  <template #suffix>
                    <el-button
                      class="countdownBtn" link :disabled="disabledCountdownBtn" :loading="loading2" :style="{
                      color: isDark ? '#f5f5f5' : '#333333',
                    }" @click="sendVerificationCode">
                      {{
                        isCounting ? `${count}${$t("SS")}` : $t("startCountDown")
                      }}</el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item class="absolute bottom-20px w-320px">
                <el-button
                  :color="isDark ? '#f5f5f5' : '#333333'" :class="['btn']" size="large" type="primary"
                  :loading="loading" style="width: 100%" @click="submitForm2">{{ $t('withdraw')
                  }}</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { Back, Right } from '@element-plus/icons-vue'
import { ref, computed, watch, onMounted } from 'vue'
import { ElNotification, type FormInstance, type FormRules } from 'element-plus'
import { setGoogleAuth as setAuth, bot_getUserInfoByGuid as getUserInfoByGuid, confirmAuthSetting } from '@/api/bot'
import Cookies from 'js-cookie'
import sha256 from 'crypto-js/sha256'
import QrCodeWithLogo from 'qr-code-with-logo'

const props = defineProps({
  action: {
    type: Function,
    required: false,
    default: () => { }
  },
  visible: {
    type: Boolean,
    required: true
  },
  showVisible: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['update:showVisible', 'update:authCode', 'update:emailCode', 'action'])
const { mode, lang } = storeToRefs(useGlobalStore())
const { isDark } = useThemeStore()
const { t } = useI18n()
const userStore = useUserStore()


const email = ref(localStorage.email)
const tgUid = ref(localStorage.userInfo?.tgUid)
const step = ref(0)
const checkType = ref('')
const isCounting = ref(false)
const disabledCountdownBtn = ref(false)
const loading = ref(false)
const loading2 = ref(false)
const loading3 = ref(false)
const loading4 = ref(false)
const count = ref(60)
const timer = ref<NodeJS.Timeout | null>(null)

const googleAuth = ref<{
  tgUid: string
  secret: string
  url: string
  authSetting: boolean | null | 'pending'
  authCode: string
}>({
  tgUid: tgUid.value,
  secret: '',
  url: '',
  authSetting: null,
  authCode: ''
})

const form = ref({
  email: '',
  verificationCode: '',
  password: '',
  confirmPassword: '',
  agree: false
})

const form2 = ref({
  verificationCode: '',
})

const googleAuthRef = ref<FormInstance>()
const formRef = ref<FormInstance>()
const formRef2 = ref<FormInstance>()

const showEmail = computed(() => {
  return email.value && desensitizeEmail(email.value)
})

// function desensitizeEmail(email) {
//     // Implement your email desensitization logic here
//     return email // Placeholder, replace with actual implementation
// }

const rules = computed<FormRules>(() => {
  return {
    email: [
      { required: true, message: t('startEmailRequiredMsg'), trigger: 'blur' },
      { type: 'email', message: t('startEmailError'), trigger: ['blur', 'change'] },
    ],
    verificationCode: [
      { required: true, message: t('startVerificationCodeRequiredMsg'), trigger: 'blur' },
    ],
    password: [
      { required: true, message: t('startPasswordRequiredMsg'), trigger: 'blur' },
      {
        pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@#$%^&*!]{8,20}$/,
        message: t('startPasswordError'),
        trigger: 'blur',
      },
    ],
    confirmPassword: [
      { required: true, message: t('startConfirmPasswordRequiredMsg'), trigger: 'blur' },
      { validator: validatePassword, trigger: 'blur' },
    ],
    authCode: [
      { required: true, max: 6, message: t('authCodeError'), trigger: 'blur' },
    ],
  }
})

function validatePassword(rule: any, value: string, callback: (error?: Error) => void) {
  if (value !== form.value.password) {
    callback(new Error(t('startConfirmPasswordError')))
  } else {
    callback()
  }
}

function confirmAuth() {
  const currentLanguage = lang.value.indexOf('zh') > -1 ? 'cn' : 'en'

  googleAuthRef?.value?.validate((valid) => {
    if (valid) {
      getUserInfoByGuid(googleAuth.value.tgUid).then(res => {
        if (!res?.authSetting) {
          confirmAuthSetting({
            tgUid: googleAuth.value.tgUid,
            authCode: googleAuth.value.authCode
          }).then(res => {
            if (res) {
              ElNotification({
                title: 'Success',
                type: 'success',
                message: currentLanguage === 'cn'
                  ? '绑定谷歌验证器成功'
                  : 'Google Authenticator Binding Successful'
              })
              googleAuth.value.authSetting = true
              emit('update:authCode', googleAuth.value.authCode)
              emit('action')
              googleAuth.value.authCode = ''
            }
          }).catch(err => {
            ElNotification({ title: 'Error', type: 'error', message: err })
          })
        } else {
          emit('update:authCode', googleAuth.value.authCode)
          emit('action')
          googleAuth.value.authCode = ''
        }
      }).catch(err => {
        ElNotification({ title: 'Error', type: 'error', message: err })
      })
    }
  })
}

function initGoogleAuth() {
  loading3.value = true
  googleAuth.value.authSetting = null
  getUserInfoByGuid(googleAuth.value.tgUid).then(res => {
    loading3.value = false
    if (!res?.authSetting) {
      loading4.value = true
      googleAuth.value.authSetting = false
      setAuth(googleAuth.value.tgUid).then(res => {
        if (res) {
          googleAuth.value = {
            ...googleAuth.value,
            ...{
              secret: res.secret,
              url: res.url
            }
          }
          setChainQr()
        } else {
          loading4.value = false
        }
      }).catch(() => {
        loading4.value = false
      })
    } else {
      googleAuth.value.authSetting = true
    }
  }).catch(() => {
    loading3.value = false
  })
}

async function setChainQr() {
  const canvas = document.getElementById('qr-google-canvas') as Element
  if (!canvas) {
    loading4.value = false
    return
  }
  QrCodeWithLogo.toCanvas({
    canvas: canvas,
    content: googleAuth.value.url,
    width: 120,
    nodeQrCodeOptions: {
      margin: 2,
    },
    logo: ''
  }).then(() => {
    loading4.value = false
  }).catch(err => {
    ElNotification({ title: 'Error', type: 'error', message: err })
    loading4.value = false
  })
}

function back() {
  if (step.value === 0) {
    emit('update:showVisible', 3)
  } else if (step.value === 1) {
    if (timer.value && !email.value) {
      resetCountdown()
    }
    step.value = 0
  }
  resetFields()
}

function submitForm() {
  const currentLanguage = lang.value.indexOf('zh') > -1 ? 'cn' : 'en'
  formRef?.value?.validate((valid) => {
    if (valid) {
      loading.value = true
      userStore.bindEmailAccount({
        email: form.value.email,
        code: form.value.verificationCode,
        password: sha256(form.value.password).toString(),
        refCode: Cookies.get('refCode'),
      }).then(() => {
        getUserInfoByGuid(googleAuth.value.tgUid).then(res => {
          loading.value = false
          ElNotification({
            title: 'Success',
            type: 'success',
            message: currentLanguage === 'cn'
              ? '邮箱绑定成功'
              : 'Mailbox Binding Success'
          })
          // store.commit('setEmail', res.emailAddress)
          userStore.email = res.emailAddress
          resetFields()
          resetCountdown()
        }).catch(err => {
          ElNotification({ title: 'Error', type: 'error', message: err })
        })
      }).catch(err => {
        ElNotification({ title: 'Error', type: 'error', message: err })
        loading.value = false
      })
    }
  })
}

function submitForm2() {
  formRef2?.value?.validate((valid) => {
    if (valid) {
      emit('update:emailCode', form2.value.verificationCode)
      emit('action')
      resetFields()
    }
  })
}

function startCountdown() {
  let currentEmail, emailType
  const currentLanguage = lang.value.indexOf('zh') > -1 ? 'cn' : 'en'

  disabledCountdownBtn.value = true
  if (email.value) {
    currentEmail = email.value
    emailType = 'transfer'
  } else {
    currentEmail = form.value.email
    emailType = 'bind'
  }

  userStore.sendEmailCode({
    email: currentEmail,
    language: currentLanguage,
    emailType,
  }).then(() => {
    isCounting.value = true
    loading2.value = false
    initCountdown()
  }).catch(err => {
    if (!timer.value) disabledCountdownBtn.value = false
    ElNotification({ title: 'Error', type: 'error', message: err })
    loading2.value = false
  })
}

function sendVerificationCode() {
  if (timer.value) return
  loading2.value = true
  startCountdown()
}

function initCountdown() {
  timer.value = setInterval(() => {
    if (count.value > 0) {
      count.value--
    } else {
      resetCountdown()
    }
  }, 1000)
}

function resetCountdown() {
  if (timer.value) {
    clearInterval(timer.value)
  }
  timer.value = null
  disabledCountdownBtn.value = false
  isCounting.value = false
  count.value = 60
}

function resetFields() {
  googleAuthRef.value?.resetFields?.()
  formRef.value?.resetFields?.()
  formRef2.value?.resetFields?.()
}

watch(step, (newStep) => {
  if (newStep === 1 && checkType.value === 'email' && !!email.value) {
    sendVerificationCode()
  }
  if (newStep === 1 && checkType.value === 'google') {
    initGoogleAuth()
  }
})

watch(() => props.visible, (newVal) => {
  if (!newVal) {
    step.value = 0
  }
})

watch(() => userStore.email, (newVal) => {
  email.value = newVal
  if (step.value === 1 && checkType.value === 'email' && !!email.value) {
    sendVerificationCode()
  }
})

onMounted(() => {
  // Initialization code if needed
})
</script>

<style scoped lang='scss'>
.w-check {
  min-height: 488px;
  color: var(--d-E9E9E9-l-222);
  display: flex;
  flex-direction: column;

  .tg-wallet-list_title {
    padding: 20px;
    border-bottom: 0.5px solid var(--d-33353D-l-F5F5F5);
  }

  .w-content {
    padding: 20px;
    min-height: 408px;
    position: relative;

    h4 {
      font-size: 14px;
      font-weight: 400;
      line-height: 18.2px;
      color: #F5F5F5;
      margin-bottom: 22px;
    }

    .m-content {
      ul.checkType {
        li {
          display: flex;
          height: 48px;
          font-size: 14px;
          font-weight: 500;
          line-height: 20px;
          text-align: left;
          align-items: center;
          justify-content: space-between;
          padding: 0 12px;
          border: 1px solid #444;
          border-radius: 8px;

          &:hover {
            border: 1px solid transparent;
            box-shadow: 0 0 0 1px #c0c4cc inset;
            cursor: pointer;
          }

          &:nth-child(2) {
            margin-bottom: 20px;
          }

          span {
            display: flex;
            align-items: center;
            gap: 6px;
          }
        }
      }

      .checkType-content {
        ul {
          display: flex;
          flex-direction: column;
          gap: 15px;
          font-family: PingFang SC;
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          text-underline-position: from-font;
          text-decoration-skip-ink: none;

          li {
            display: flex;

            label {
              width: 56px;
            }

            &>div {
              flex: 1;
              width: calc(100% - 56px);
            }

            .el-input {
              background: var(--d-333-l-F2F2F2);
              --el-input-bg-color: var(--d-333-l-F2F2F2);
              --el-input-border-color: var(--d-333-l-F2F2F2);
              border-radius: 8px;
              --el-input-height: 48px;
              margin-bottom: 10px;

              :deep() &.el-input.is-disabled .el-input__inner {
                cursor: text;
              }
            }
          }
        }
      }

      .el-input {
        background: var(--d-333-l-F2F2F2);
        --el-input-bg-color: var(--d-333-l-F2F2F2);
        --el-input-border-color: var(--d-333-l-F2F2F2);
        border-radius: 8px;
        --el-input-height: 48px;
      }

      .el-link.el-link--primary {
        --el-link-text-color: #f5f5f5;
        --el-link-hover-text-color: #f5f5f5;
        font-size: 12px !important;
        line-height: 12px !important;
      }

      .el-checkbox {
        align-items: flex-start;
      }

      :deep(.el-checkbox__label) {
        font-size: 12px !important;
        line-height: 12px !important;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
      }

      :deep() .el-checkbox__input.is-checked+.el-checkbox__label {
        color: #999;
      }

      :deep() .el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #333;
        border-color: #999;
      }

      :deep() .el-checkbox__inner:hover {
        border-color: #f5f5f5;
      }
    }
  }

  .tip {
    font-size: 14px;
    font-weight: 400;
    line-height: 18.2px;
    text-align: left;
    color: #999999;
    margin-bottom: 5px;
  }

  &.light {
    .w-content {
      h4 {
        color: #999999;
      }

      .m-content {
        ul.checkType {
          li {
            border-color: #999999;
          }
        }

        .el-link.el-link--primary {
          --el-link-text-color: #333333;
          --el-link-hover-text-color: #333333;
        }

        :deep() .el-checkbox__input.is-checked+.el-checkbox__label {
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
      }
    }
  }
}
</style>
