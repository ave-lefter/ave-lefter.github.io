// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  // Your custom configs here
  files: ['src/**/*.{ts,js,vue}'],
  ignores: [
    '**/*.d.ts'
  ],
  rules: {
    quotes: ['warn', 'single'],
    semi: ['error', 'never'],
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/attribute-hyphenation': 'off',
    'vue/no-v-html': 'off',
    'vue/v-on-event-hyphenation': 'off',
    'vue/first-attribute-linebreak': 'off'
  }
})

