<template>
  <Container hidden-header>
    <view class="recorder-wrapper" v-if="currRole === EnumRole.Recorder">
      <view style="display: flex; justify-content: center">
        <image
          src="../../resource/camera.png"
          style="width: 274rpx; height: 274rpx"
        ></image>
      </view>

      <Dot>选择录像模式</Dot>

      <TabItem
        class="tab-item"
        :tabsList="tabsList"
        :selected="selected"
        @change="changeSelected"
      ></TabItem>

      <view class="button-wrapper" style="margin: 80rpx 0 40rpx 0">
        <nut-button
          size="large"
          color="linear-gradient(to right, #FF983D, #FFAC63)"
          type="info"
          @click="handleFileUpload"
          :style="{ margin: 'auto' }"
          >文件上传</nut-button
        >
      </view>

      <view class="button-wrapper">
        <nut-button
          size="large"
          color="linear-gradient(to right, #FF983D, #FFAC63)"
          type="info"
          @click="switchCamera"
          :style="{ margin: 'auto' }"
          >{{ isRecording ? "关闭摄像头" : "开启摄像头" }}</nut-button
        >
      </view>
    </view>

    <view class="button-wrapper" style="margin-top: 80rpx">
      <nut-button
        size="large"
        type="info"
        @click="handleLogOut"
        :style="{ margin: 'auto' }"
        >退出登录</nut-button
      >
    </view>
  </Container>
</template>

<script lang="ts" setup>
import Taro from "@tarojs/taro";
import TabItem from "@/components/tab-item/index.vue";
import Dot from "@/components/dot/index.vue";
import { ref, watch, reactive, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import Container from "@/components/container/index.vue";
import { getRecordInfosList, deviceSentCommand } from "@/services/record";
import { useUserStore } from "@/stores/user";
import { useDidShow, usePullDownRefresh } from "@tarojs/taro";
import { EnumRole } from "@/constants";

const tabsList = ref([]);
const selected = ref("");

const isRecording = ref(true);

const userStore = useUserStore();
const { currRole, currDeviceCode } = storeToRefs(userStore);

useDidShow(() => {
  if (!currDeviceCode.value && currRole.value === EnumRole.Recorder) {
    Taro.switchTab({
      url: "/pages/preset/index",
    });
    return;
  }
  if (currRole.value === EnumRole.Recorder) {
    Taro.setNavigationBarTitle({
      title: "记录设置",
    });
  } else {
    Taro.setNavigationBarTitle({
      title: "退出",
    });
  }
  handleGetRecordInfosList();
});

const handleGetRecordInfosList = () => {
  getRecordInfosList().then((res: any) => {
    if (res.data) {
      tabsList.value = res.data?.map((el) => ({
        text: el.name,
        value: el.value,
      }));
    }
  });
};

const changeSelected = (value) => {
  selected.value = value.value;
  deviceSentCommand({
    code: currDeviceCode.value,
    command: selected.value,
  })
    .then(() => {
      Taro.showToast({
        title: "选择成功",
        icon: "success",
      });
    })
    .catch(() => {
      Taro.showToast({
        title: "选择失败",
        icon: "success",
      });
    });
};

const handleFileUpload = () => {
  deviceSentCommand({
    code: currDeviceCode.value,
    command: "5C",
  })
    .then(() => {
      Taro.showToast({
        title: "上传成功",
        icon: "success",
      });
    })
    .catch(() => {
      Taro.showToast({
        title: "上传失败",
        icon: "success",
      });
    });
};

const switchCamera = () => {
  deviceSentCommand({
    code: currDeviceCode.value,
    command: isRecording.value ? "cameraOff" : "cameraOn",
  })
    .then(() => {
      Taro.showToast({
        title: "切换成功",
        icon: "success",
      });
      isRecording.value = !isRecording.value;
    })
    .catch(() => {
      Taro.showToast({
        title: "切换失败",
        icon: "success",
      });
    });
};

const handleLogOut = () => {
  userStore.setCurrDeviceCode("");
  Taro.removeStorageSync("accessToken");
  Taro.navigateTo({
    url: "/pages/login/index",
  });
};
</script>

<style lang="scss">
.tab-item {
  margin: 20rpx 0;
}
</style>
