<template>
  <div class="w-safe bg-[--secondary-bg] flex-1 w-100% px-200px pt-40px overflow-y-auto" style="height: calc(100vh - 92px)">
    <div v-if="step !== 0" class="flex-start text-20px mb-22px">
      <el-icon size="12" class="clickable" @click="step=0">
        <Back />
      </el-icon>
      <span class="ml-10px font-400 text-12px lh-16px tracking-0px color-[--secondary-text]">{{ t('returnSafeCenter') }}</span>
    </div>
    <h2 class="font-500 text-24px lh-36px tracking-0px mb-10px color-[--main-text]">{{ title }}</h2>
    <div class="font-400 text-12px lh-16px tracking-0px mb-30px color-[--secondary-text]">{{ desc }}</div>
    <template v-if="step === 0">
      <h3 class="font-500 text-16px lh-22px tracking-0px mb-30px color-[--main-text]">{{ t('2fa') }}</h3>
      <ul class="flex flex-col gap-30px">
        <li class="flex items-center h-40px justify-between">
          <div class="flex items-center gap-8px">
            <div class="flex items-center justify-center bg-[--border] border-rd-[50%] w-40px h-40px h-40px">
              <Icon name="custom:email" class="color-[--main-text]"/>
            </div>
            <div class="flex flex-col gap-2px">
              <span class="font-500 text-14px lh-22px tracking-0px color-[--main-text]">{{ t('emailVerification') }}</span>
              <span class="font-400 text-12px lh-16px tracking-0px color-[--secondary-text]">{{ t('emailVerificationDsc') }}</span>
            </div>
          </div>
          <div class="flex items-center gap-8px">
            <div v-if="JSON.stringify(authInfo)==='{}'"/>
            <el-button v-else-if="!authInfo.emailAddress" type="primary" class="h-36px w-151px" @click="(step = 1) && (checkType = 'email')">{{ t('bindNow') }}</el-button>
            <template v-else>
              <Icon name="mingcute:check-circle-fill" class="text-17px color-#12B886 mt-1px"/>
              <span class="font-400 text-15px lh-22px tracking-0px">{{ desensitizeEmail(authInfo.emailAddress) }}</span>
            </template>
          </div>
        </li>
        <li class="flex items-center h-40px justify-between">
          <div class="flex items-center gap-8px">
            <div class="flex items-center justify-center bg-[--border] border-rd-[50%] w-40px h-40px h-40px">
              <Icon name="custom:auth" class="color-[--main-text] text-20px"/>
            </div>
            <div class="flex flex-col gap-2px">
              <span class="font-500 text-14px lh-22px tracking-0px color-[--main-text]">{{ t('DbCheckTitle2') }}</span>
              <span class="font-400 text-12px lh-16px tracking-0px color-[--secondary-text]">{{ t('googleVerificationDsc') }}</span>
            </div>
          </div>
          <div class="flex items-center gap-8px">
            <div v-if="JSON.stringify(authInfo)==='{}'"/>
            <el-button v-else-if="!authInfo.authSetting" type="primary" class="h-36px w-151px" @click="(step = 1) && (checkType = 'google')">{{ t('bindNow') }}</el-button>
            <template v-else>
              <Icon name="mingcute:check-circle-fill" class="text-17px color-#12B886 mt-1px"/>
              <span class="font-400 text-15px lh-22px tracking-0px">{{ t('bounded') }}</span>
              <span class="font-400 text-15px lh-22px tracking-0px color-[--secondary-text] ml-8px decoration-underline clickable" @click="dialogVisible=true">{{ t('reset') }}</span>
            </template>
          </div>
        </li>
      </ul>
    </template>
    <template v-else-if="step !== 0 && checkType === 'google'">
      <div class="flex justify-center gap-40px">
        <div :class="lang?.includes?.('zh') ? 'w-420px' : 'w-500px'" style="flex-shrink: 0">
          <Steps class="mb-40px" :active="bindGoogleAuthStep" :dataSource="[t('bindGoogleAuthStep1'), t('bindGoogleAuthStep2'), t('bindGoogleAuthStep3')]"/>
          <template v-if="step === 1">
            <div class="color-[--main-text] font-400 text-14px mb-40px">
              <div class="mb-8px">{{ t('bindGoogleAuthStep1P1') }}</div>
              <div class="lh-20px">{{ t('bindGoogleAuthStep1P2') }}</div>
            </div>
            <img src="@/assets/images/googleAuth.svg" alt="" class="mx-auto w-100px h-100px block mb-40px">
            <div class="flex justify-between w-100% mb-40px">
              <el-popover width="200px" popper-class="h-200px flex items-center justify-center" placement="bottom">
                  <template #reference>
                    <div class="flex items-center justify-center gap-4px w-200px h-48px border-rd-8px bg-[--border] clickable">
                      <Icon name="custom:google-play" class="text-24px"/>
                      <span class="color-[--main-text] font-500 text-14px">Google Play</span>
                    </div>
                  </template>
                  <img src="@/assets/images/2faGoogleQRCode.png" alt="" class="mx-auto w-188px h-188px block">
              </el-popover>
              <el-popover width="200px" popper-class="h-200px flex items-center justify-center" placement="bottom">
                  <template #reference>
                    <div class="flex items-center justify-center gap-4px w-200px h-48px border-rd-8px bg-[--border] clickable">
                      <Icon name="custom:apple" class="text-30px color-[--main-text]"/>
                      <span class="color-[--main-text] font-500 text-14px">App Store</span>
                    </div>
                  </template>
                  <img src="@/assets/images/2faAppleQRCode.png" alt="" class="mx-auto w-188px h-188px block">
              </el-popover>
            </div>
            <el-button type="primary" class="w-full" size="large" @click="step = 1.1">{{ t('next') }}</el-button>
          </template>
          <div v-show="step === 1.1" :element-loading-background="isDark ? 'rgba(19, 23, 34 0.2)' : 'rgba(255, 255, 255, 0.2)'">
            <div class="color-[--main-text] font-400 text-14px  mb-40px lh-20px">{{ t('bindGoogleAuthStep2P1') }}</div>
            <el-skeleton :loading="loading3" animated :throttle="500">
              <template #template>
                <el-skeleton-item variant="image" class="w-120px h-120px mb-40px mx-auto" />
                <el-skeleton-item variant="h1" class="w-[100%] h-48px mb-20px" />
                <el-skeleton-item variant="h1" class="w-[100%] h-48px mb-20px" />
                <el-skeleton-item variant="h1" class="w-[100%] h-40px mb-20px" />
              </template>
              <template #default />
            </el-skeleton>
            <div v-show="!loading3">
              <canvas id="qr-google-canvas" class="mx-auto w-120px h-120px block mb-40px"/>
              <el-input v-model="googleAuthName" disabled size="large" class="h-48px font-500 text-16px mb-20px">
                <template #suffix>
                  <a
                    v-copy="googleAuth.secret" href="javascript:void(0)"
                    style="pointer-events: auto"
                    class="text-14px font-400 lh-20px text-left text-from-font decoration-none text-#3F80F7 cursor-pointer">{{ t('copy') }}</a>
                </template>
              </el-input>
              <el-input v-model="googleAuth.secret" disabled size="large" class="h-48px font-500 text-16px mb-20px">
                <template #suffix>
                  <a
                    v-copy="googleAuth.secret" href="javascript:void(0)"
                    style="pointer-events: auto"
                    class="text-14px font-400 lh-20px text-left text-from-font decoration-none text-#3F80F7 cursor-pointe">{{ t('copy') }}</a>
                </template>
              </el-input>
               <el-button type="primary" class="w-full" size="large" @click="step = 1.2">{{ t('next') }}</el-button>
            </div>
          </div>
          <template v-if="step === 1.2">
            <el-form
              ref="googleAuthRef" :model="googleAuth" :rules="rules" label-width="0" autocomplete="off"
              size="large" @submit.prevent>
              <div class="mb-40px text-14px font-400 color-[--main-text] lh-20px">{{ t('bindGoogleAuthStep3P1') }}</div>
              <el-form-item label="" prop="authCode" class="mb-40px!">
                <el-input
                  v-model="googleAuth.authCode" class="h-48px font-500 text-16px" :autocomplete="'new-authCode' + Math.random()"
                  :placeholder="t('authCode')" name="authCodeField" />
              </el-form-item>
              <el-form-item >
                <el-button size="large" class="w-full" type="primary" @click="confirmAuth">{{ t('confirm') }}</el-button>
              </el-form-item>
            </el-form>
          </template>
        </div>
        <div class="w-1px bg-[--border]"/>
        <div class="w-437px pb-48px">
          <div class="google-authenticator-readme">
            <div class="font-500 text-14px lh-20px color-[--main-text]">{{ t('bindGoogleAuthReadmeT1') }}</div>
            <div class="font-400 text-14px lh-20px color-[--third-text] mb-23px">{{ t('bindGoogleAuthReadmeP1') }}</div>
            <div class="font-500 text-14px lh-20px color-[--main-text]">{{ t('bindGoogleAuthReadmeT2') }}</div>
            <div class="font-400 text-14px lh-20px color-[--third-text] mb-23px">{{ t('bindGoogleAuthReadmeP2') }}</div>
            <div class="font-500 text-14px lh-20px color-[--main-text]">{{ t('more2FAApps') }}</div>
          </div>
          <ul class="mb-15px mt-4px color-[--third-text]">
            <li
              v-for="item, index in otherChecks"
              :key="item.name"
              class="lh-22px text-13px cursor-pointer hover:color-[--main-text] list-disc list-inside"
              style="padding-left: 0.25rem; --list-disc-size: 0.15rem;"
              :class="otherChecksIndex === index ? 'color-[--main-text]' : ''"
              @mouseover="otherChecksIndex = index"
              @mouseout="otherChecksIndex = null"
            >
              <span class="-ml-8px text-14px">{{ item.name }}</span>
            </li>
          </ul>
          <div v-if="otherChecksIndex !== null" class="flex justify-between w-100% mb-23px" >
            <div>
              <div class="flex items-center w-150px  justify-center gap-4px h-48px mb-10px">
                <Icon name="custom:google-play" class="text-24px"/>
                <span class="color-[--main-text] font-500 text-14px">Google Play</span>
              </div>
              <div>
                <canvas ref="googleQrCodeRef" class="w-150px h-150px block"></canvas>
              </div>
            </div>
            <div v-if="otherChecks[otherChecksIndex]?.apple">
              <div class="flex items-center w-150px  justify-center gap-4px h-48px mb-10px">
                <Icon name="custom:apple" class="text-30px color-[--main-text]"/>
                <span class="color-[--main-text] font-500 text-14px">App Store</span>
              </div>
              <div>
                <canvas ref="appleQrCodeRef" class="w-150px h-150px block"></canvas>
              </div>
            </div>
          </div>

          <a
            class="decoration-underline font-500 text-14px lh-20px color-[--main-text]"
            href="https://doc.ave.ai/cn/ave.ai-jiao-cheng/gu-ge-yan-zheng-qi-an-zhuang-jiao-cheng"
            target="_blank">{{ t('DbCheckContentContent12') }}
          </a>
        </div>
      </div>
    </template>
    <template v-else-if="step === 1 && checkType === 'email'">
      <el-form
        ref="formRef" class="w-420px mx-auto" :model="form" :rules="rules" label-width="0" autocomplete="off"
        size="large" label-position="top" hide-required-asterisk @submit.prevent="submitForm">
        <el-form-item :label="t('startEmail')" prop="email">
          <el-input
            v-model="form.email"
            class="h-48px font-500 text-16px" :autocomplete="'new-email' + Math.random()"
            :placeholder="t('startEmail')" name="emailField" />
        </el-form-item>
        <el-form-item :label="t('startVerificationCode')" prop="verificationCode">
          <el-input
            v-model="form.verificationCode" class="h-48px font-500 text-16px" :autocomplete="'new-verificationCode' + Math.random()"
            :placeholder="t('startVerificationCode')" name="new-verificationCode">
            <template #suffix>
              <el-button
                class="countdownBtn" link :disabled="disabledCountdownBtn" :loading="loading2" :style="{
                color: '#3F80F7'
              }" @click.stop.prevent="sendVerificationCode">
                {{
                  isCounting ? `${count}${t("SS")}` : t("startCountDown")
                }}</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item :label="t('startPassword')" prop="password">
          <el-input
            v-model="form.password" class="h-48px font-500 text-16px" type="password" name="password_field"
            :autocomplete="'new-password' + Math.random()" :placeholder="t('startPassword')" show-password />
        </el-form-item>
        <el-form-item :label="t('startConfirmPassword')" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword" class="h-48px font-500 text-16px" type="password" name="confirm_password_field"
            :placeholder="t('startConfirmPassword')" :autocomplete="'new-password2' + Math.random()"
            show-password />
        </el-form-item>
        <el-form-item size="small" class="h-20px lh-20px">
          <el-checkbox v-model="form.agree" class="color-[--secondary-text] w-[100%] [&&]:[--el-checkbox-checked-text-color:--secondary-text]">
            <div class="flex items-center font-400 text-12px color-[--secondary-text]">
              {{ t("startFooter1") }}&nbsp;
              <a
                class="color-#3F80F7"
                type="primary" :href="!lang?.includes?.('zh')
                ? 'https://doc.ave.ai/cn/yong-hu-xie-yi'
                : 'https://doc.ave.ai/ave.ai-user-agreement'
                " target="_blank">&nbsp;{{ t("startFooter2") }}</a>
              &nbsp;{{ t("startFooter3") }}
              <a class="color-#3F80F7" type="primary" href="https://ave.ai/privacy" target="_blank">
                &nbsp;{{ t("startFooter4") }}</a>
            </div>
          </el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button class="w-full" size="large" type="primary" :loading="loading" :disabled="!form.agree" native-type="submit">{{ t('confirm') }}</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-dialog
      v-if="dialogVisible" v-model="dialogVisible"
      width="480px" append-to-body class="text-[--main-text]" destroy-on-close
    >
      <template #header>
        <span class="font-500 text-20px lh-28px tracking-0px" >{{ t('resetGoogleAuthTitle') }}</span>
      </template>
      <div class="pt-20px font-400 text-16px lh-24px tracking-0px flex  gap-8px">
        <Icon name="uiw:warning" class="text-17px w-17px mt-4px color-[--secondary-text]"/>
        <div class="w-398px">
          {{ t('resetGoogleAuthDsc') }}
        </div>
      </div>
      <template #footer>
        <el-button
          type="primary"
          class="w-full"
          size="large"
          @click.stop="goToTg"
        >{{ t('goToTg') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Back } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { setGoogleAuth as setAuth, bot_getUserInfoByGuid as getUserInfoByGuid, confirmAuthSetting } from '@/api/bot'
import Cookies from 'js-cookie'
import sha256 from 'crypto-js/sha256'
import QrCodeWithLogo from 'qr-code-with-logo'
import Steps from './components/steps.vue'
import { ElMessage } from 'element-plus'

const { t } = useI18n()
const { authInfo } =storeToRefs(useUserStore())
const dialogVisible=ref(false)
const { lang } = storeToRefs(useGlobalStore())
const { isDark } = useThemeStore()
const userStore = useUserStore()
const {evmAddress} = storeToRefs(useBotStore())
const googleAuthName=ref('Ave.ai')
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
const timer = ref<any | null>(null)
const router = useRouter()
//其他验证方式
const otherChecksIndex = ref(null)
const otherChecks = [
  {
    name: 'Microsoft Authenticator',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.azure.authenticator',
    apple: 'https://apps.apple.com/us/app/microsoft-authenticator/id983156458'
  },{
    name: '2FA Authenticator (2FAS)',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.twofasapp',
    apple: 'https://apps.apple.com/us/app/2fa-authenticator-2fas/id1217793794'
  },{
    name: 'Bitwarden Password Manager',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.x8bit.bitwarden',
    apple: 'https://apps.apple.com/us/app/bitwarden-password-manager/id1137397744'
  },{
    name: 'Aegis Authenticator - 2FA App',
    googlePlay: 'https://play.google.com/store/apps/details?id=com.beemdevelopment.aegis'
  }
]

const bindGoogleAuthStep=computed(()=>{
  if(checkType.value!=='google') return 1
  if (step.value === 1) {
    return 1
  }
  if (step.value === 1.1) {
    return 2
  }
  if (step.value === 1.2) {
    return 3
  }
  return 1
})
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

const title = computed(() => {
  return step.value === 0
    ? t('safeCenter')
    : checkType.value === 'email'
      ? t('bindEmail')
      : t('bindGoogleAuth')
})
const desc = computed(() => {
  if (step.value === 0) {
    return t('safeDsc')
  }
  if (checkType.value === 'email' && (step.value === 1 || step.value === 1.1)) {
    return t('emailVerificationDsc')
  }
  if (checkType.value === 'google' && (step.value === 1 || step.value === 1.1 || step.value === 1.2)) {
    return t('googleVerificationDsc')
  }
  return ''
})
const googleAuthRef = ref<FormInstance>()
const formRef = ref<FormInstance>()
const formRef2 = ref<FormInstance>()

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
  googleAuthRef?.value?.validate((valid: boolean) => {
    if (valid) {
      getUserInfoByGuid(googleAuth.value.tgUid).then(res => {
        if (!res?.authSetting) {
          confirmAuthSetting({
            tgUid: googleAuth.value.tgUid,
            authCode: googleAuth.value.authCode
          }).then(res => {
            if (res) {
              ElMessage.success(currentLanguage === 'cn'
                  ? '绑定成功'
                  : 'Binding Successful')
              step.value = 0
              authInfo.value.authSetting = true
              authInfo.value.transferStatus = false
              googleAuth.value.authSetting = true
              // emit('update:authCode', googleAuth.value.authCode)
              // emit('action')
              googleAuth.value.authCode = ''
            }
          }).catch((err: any) => {
            ElMessage.error(String(err))
            // ElNotification({ title: 'Error', type: 'error', message: err })
          })
        } else {
          // emit('update:authCode', googleAuth.value.authCode)
          // emit('action')
          googleAuth.value.authCode = ''
        }
      }).catch((err: any) => {
        ElMessage.error(String(err))
        // ElNotification({ title: 'Error', type: 'error', message: err })
      })
    }
  })
}

function initGoogleAuth() {
  loading3.value = true
  googleAuth.value.authSetting = null
  getUserInfoByGuid(googleAuth.value.tgUid).then(res => {
    // loading3.value = false
    if (!res?.authSetting) {
      // loading3.value = true
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
        }
        loading3.value = false
      }).catch(() => {
        loading3.value = false
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
    ElMessage.error(String(err))
    // ElNotification({ title: 'Error', type: 'error', message: err })
    loading4.value = false
  })
}


function submitForm() {
  const currentLanguage = lang.value.indexOf('zh') > -1 ? 'cn' : 'en'
  formRef?.value?.validate((valid: boolean) => {
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
          ElMessage.success(currentLanguage === 'cn'
              ? '绑定成功'
              : 'Binding Successful')
          // ElNotification({
          //   title: 'Success',
          //   type: 'success',
          //   message: currentLanguage === 'cn'
          //     ? '绑定成功'
          //     : 'Binding Success'
          // })
          // store.commit('setEmail', res.emailAddress)
          userStore.email = res.emailAddress
          authInfo.value.emailAddress = res.emailAddress
          resetFields()
          resetCountdown()
          step.value = 0
        }).catch((err: any) => {
          ElMessage.error(String(err))
          // ElNotification({ title: 'Error', type: 'error', message: err })
        })
      }).catch((err: any) => {
        ElMessage.error(String(err))
        // ElNotification({ title: 'Error', type: 'error', message: err })
        loading.value = false
      })
    }
  })
}

// function submitForm2() {
//   formRef2?.value?.validate((valid) => {
//     if (valid) {
//       emit('update:emailCode', form2.value.verificationCode)
//       emit('action')
//       resetFields()
//     }
//   })
// }

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
    ElMessage.error(String(err))
    // ElNotification({ title: 'Error', type: 'error', message: err })
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
  if (newStep === 1.1 && checkType.value === 'google') {
    initGoogleAuth()
  }

})

watch(() => userStore.email, (newVal) => {
  email.value = newVal
  if (step.value === 1 && checkType.value === 'email' && !!email.value) {
    sendVerificationCode()
  }
})

watch(() => evmAddress.value, (val) => {
  if(!val){
    router.push('/')
  }
},{immediate: true})

const googleQrCodeRef = ref(null)
const appleQrCodeRef = ref(null)

// 生成二维码的方法
const generateQrCode = async (content: string, canvasRef: HTMLCanvasElement) => {
  if (!canvasRef || !content) return

  try {
    // 清空 canvas 内容，确保重新绘制
    const ctx = canvasRef.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.width, canvasRef.height)
    }

    await QrCodeWithLogo.toCanvas({
      canvas: canvasRef,
      content: content,
      width: 150,
      nodeQrCodeOptions: {
        margin: 1,
      },
      logo: ''
    })
  } catch (err) {
    console.error('生成二维码失败:', err)
    ElMessage.error(String(err))
  }
}

// 监听 otherChecksIndex 变化，生成对应的二维码
watch(otherChecksIndex, (newIndex: number) => {
  // 使用 setTimeout 确保 DOM 更新后再生成二维码
  setTimeout(() => {
    const item = otherChecks[newIndex]
    if (item && googleQrCodeRef.value) {
      generateQrCode(item.googlePlay, googleQrCodeRef.value)
    }
    // 只有当 item.apple 存在且 appleQrCodeRef.value 存在时才生成二维码
    if (item && item.apple && appleQrCodeRef.value) {
      generateQrCode(item.apple, appleQrCodeRef.value)
    }
  }, 50)
})

function goToTg() {
  const url = lang.value.includes('zh') ?'https://t.me/ave_community_cn':'https://t.me/aveai_english'
  window.open(url, '_blank')
}
onBeforeUnmount(() => {
  resetCountdown()
})
</script>
<style lang="scss" scoped>
:deep() .el-input {
  // --el-input-border-color: #444444;
  --el-input-placeholder-color: var(--third-text);
  --el-text-color-placeholder: var(--third-text);
  // --el-disabled-bg-color: var(--border);
  --el-disabled-border-color: transparent;
  // --el-input-bg-color: var(--d-333-l-F2F2F2)
}

:deep() .el-input__wrapper {
  border: none;
  border-radius: 6px;
  box-shadow: none;

  // &:hover {
  //   box-shadow: 0 0 0 1px #3F80F7 inset;
  // }
}
:deep() .el-form-item__label {
  color: var(--secondary-text);
}
</style>
