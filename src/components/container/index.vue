<template>
  <view class="page-container" v-if="isMounted">
    <view v-if="!hiddenHeader">
      <Header :hiddenRoleSelect="hiddenRoleSelect" />
    </view>
    <view class="page-content">
      <slot></slot>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useDidHide, useDidShow } from "@tarojs/taro";
import Header from "../header/index.vue";

const { hiddenHeader, hiddenRoleSelect } = defineProps({
  hiddenHeader: {
    type: Boolean,
  },
  hiddenRoleSelect: {
    type: Boolean,
  },
});

const isMounted = ref(false);

useDidShow(() => {
  isMounted.value = true;
});

useDidHide(() => {
  isMounted.value = false;
});
</script>

<style lang="scss">
.page-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #ffffff 0%, #fff7ed 100%);
}

.page-content {
  padding: 16rpx 32rpx;
}
</style>
