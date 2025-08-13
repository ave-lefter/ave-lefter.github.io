<template>
    <div class="arrow-container">
      <div
        v-for="i in 3"
        :key="i"
        class="arrow"
        :style="{ animationDelay: `${(i - 1) * 0.3}s` }"
      ></div>
    </div>
  </template>

  <style scoped>
  .arrow-container {
    display: flex;
    flex-direction: row; /* 横向排列 */
    align-items: center;
    gap: 8px; /* 箭头间距 */
  }

  .arrow {
    width: 0;
    height: 0;
    border-top: 7px solid transparent;    /* 上透明 */
    border-bottom: 7px solid transparent; /* 下透明 */
    border-left: 7px solid;               /* 左边是箭头颜色 */
    border-left-color: transparent;        /* 初始透明 */
    animation: fadeMove 1.5s infinite;
  }

  @keyframes fadeMove {
    0% {
      opacity: 0;
      border-left-color: transparent;
      transform: translateX(-4px);
    }
    50% {
      opacity: 1;
      border-left-color: #3F80F780; /* 渐变起点色 */
    }
    60% {
      border-left-color: #3F80F7; /* 渐变终点色 */
    }
    100% {
      opacity: 0;
      border-left-color: transparent;
      transform: translateX(4px);
    }
  }
  </style>
