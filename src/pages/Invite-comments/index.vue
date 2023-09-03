<template>
  <Container hidden-header>
    <CommentsForm v-if="!!presetsCode" :presets-code="presetsCode" />
  </Container>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import Container from "@/components/container/index.vue";
import { getCurrentInstance, useDidShow } from "@tarojs/taro";
import CommentsForm from "./comments-form.vue";
import Taro from "@tarojs/taro";

import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
const presetsCode = ref();

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

useDidShow(() => {
  Taro.setNavigationBarTitle({
    title: `${userInfo.value.className} ${userInfo.value.name}`,
  });
});

onMounted(() => {
  const presetsCodeByQuery = getCurrentInstance().router?.params?.presetsCode;
  presetsCode.value = presetsCodeByQuery;
});
</script>

<style lang="scss">
.invite-page-wrapper {
  .nut-cell-group__wrap {
    margin: 0 !important;
  }
}
.invite {
  &__title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333333;
    padding: 16rpx 0rpx;
  }

  &__bottom {
    margin-top: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.activities-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
