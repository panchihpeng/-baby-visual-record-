<template>
  <Container hidden-header>
    <view class="recorder-wrapper">
      <view class="location-icon-wrapper">
        <image src="../../resource/location.png" class="location-icon"></image>
      </view>
      <Dot>请选择记录场所</Dot>
      <view
        style="
          width: 90%;
          margin: 30rpx auto 80rpx auto;
          padding: 10rpx 5rpx;
          background-color: #f7f7f7;
        "
      >
        <Select
          title="请选择记录场所"
          :options="locationsList"
          placeholder="请选择场所"
          v-model:value="locationInfo.deviceCode"
        />
      </view>
    </view>

    <view class="button-wrapper">
      <nut-button
        size="large"
        color="linear-gradient(to right, #FF983D, #FFAC63)"
        type="info"
        @click="handleDeviceLogin"
        :style="{ margin: 'auto' }"
        >设备登录</nut-button
      >
    </view>
  </Container>
</template>

<script lang="ts" setup>
import Dot from "../../components/dot/index.vue";
import { ref, reactive, onMounted } from "vue";
import { storeToRefs } from "pinia";
import Container from "@/components/container/index.vue";

import { getLocationsList, bindLoginDevice } from "@/services/record";
import { useUserStore } from "@/stores/user";

import Taro from "@tarojs/taro";

const locationsList = ref([]);
const locationInfo = reactive({
  deviceCode: "",
});

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

onMounted(() => {
  handleGetLocationsList();
});

const handleGetLocationsList = () => {
  getLocationsList(userInfo.value.kgCode).then((res: any) => {
    if (res.data) {
      locationsList.value = res.data?.map((el) => ({
        text: el.remark,
        value: el.code,
      }));
    }
  });
};

const handleDeviceLogin = () => {
  if (!locationInfo.deviceCode) {
    Taro.showToast({
      title: "请选择记录场所",
      icon: "error",
    });
    return;
  }

  if (locationInfo.deviceCode) {
    bindLoginDevice({
      teacherCode: userInfo.value.code,
      deviceCode: locationInfo.deviceCode,
    }).then(() => {
      Taro.navigateTo({
        url: `/pages/take-notes/index?deviceCode=${locationInfo.deviceCode}`,
      });
    });
  }
};
</script>

<style lang="scss">
.recorder-wrapper {
  padding: 0 60rpx;
  .location-icon-wrapper {
    display: flex;
    justify-content: center;
    margin: 40rpx 0rpx;
    .location-icon {
      width: 274rpx;
      height: 274rpx;
    }
  }
}
</style>
