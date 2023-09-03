<template>
  <div style="width: 100%">
    <nut-popup position="bottom" v-model:visible="visible" class="camera-operate__block">
      <nut-button type="success" @click="handleShowCamera('photo')">拍照</nut-button>
      <nut-button type="success" @click="handleShowCamera('video')">录像</nut-button>
      <nut-button @click="handleCancel">取消</nut-button>
    </nut-popup>
    <nut-popup
      v-model:visible="showDialog"
      class="camera-play__wrapper"
      :style="{
        width: `${cameraInfo.width}px`,
        height: `${cameraInfo.height}px`,
      }"
    >
      <camera
        v-if="showCamera"
        class="camera__block"
        device-position="back"
        :flash="mediaType === 'video' ? 'on' : 'off'"
        binderror="error"
      >
      </camera>
      <view>
        <nut-progress
          v-if="mediaType === 'video'"
          class="progress"
          :percentage="progress"
          :show-text="false"
          stroke-height="24"
        />
        <view class="play-btn">
          <view @click="handleCancel">
            <IconFont name="rect-left" />
          </view>
          <view v-if="videoLoading" class="video-loading">
            <IconFont name="loading" />
            <view> 正在录像中 </view>
          </view>
          <nut-button class="play-btn__outer" @click="handlePlay"></nut-button>
        </view>
      </view>
    </nut-popup>
    <image class="media" v-if="value?.photoSrc" :src="value?.photoSrc"></image>
    <video class="media" v-if="value?.videoSrc" :src="value?.videoSrc" />
  </div>
</template>

<script lang="ts" setup>
import Taro from "@tarojs/taro";
import { PropType, reactive, ref, toRefs } from "vue";
import { IconFont } from "@nutui/icons-vue-taro";

const props = defineProps({
  value: Object as PropType<{
    videoSrc: string;
    photoSrc: string;
  }>,
  visible: Boolean,
});

const { visible } = toRefs(props);

const emit = defineEmits(["update:visible", "update:value"]);

const photoSrc = ref("");
const videoSrc = ref("");
const showDialog = ref(false);
const showCamera = ref(false);
const cameraInfo = reactive({
  height: 100,
  width: 50,
});
const mediaType = ref<"photo" | "video">();
const startInVideo = ref(false);
const progress = ref(0);
const intervalTimer = ref();
const videoLoading = ref(false);

const handleCancel = () => {
  showDialog.value = false;
  emit("update:visible", false);
  photoSrc.value = "";
  videoSrc.value = "";
};

const handleShowCamera = (type: "photo" | "video") => {
  mediaType.value = type;
  emit("update:visible", false);
  showDialog.value = true;
  setTimeout(() => {
    showCamera.value = true;
    const res = Taro.getSystemInfoSync();
    cameraInfo.width = res.windowWidth;
    cameraInfo.height = res.windowHeight;
  });
};

const handlePlay = () => {
  console.log("play");
  if (mediaType.value === "photo") {
    handleTakePhoto();
  }
  if (mediaType.value === "video") {
    if (startInVideo.value) {
      handleStopRecord();
    } else {
      handleTakeRecord();
    }
    startInVideo.value = !startInVideo.value;
  }
};

const handleTakePhoto = async () => {
  const ctx = Taro.createCameraContext();
  ctx.takePhoto({
    quality: "high",
    success: (res) => {
      showDialog.value = false;
      showCamera.value = false;
      videoSrc.value = "";
      photoSrc.value = res.tempImagePath;
      emit("update:value", { photoSrc: res.tempImagePath, videoSrc: "" });
    },
  });
};

const handleTakeRecord = async () => {
  const ctx = Taro.createCameraContext();
  ctx.startRecord({
    success: () => {
      intervalTimer.value = setInterval(() => {
        progress.value = progress.value + Math.floor(100 / 30);
        console.log("progress.value", progress.value);
        if (progress.value >= 100) {
          clearInterval(intervalTimer.value);
          handleStopRecord();
        }
      }, 1000);

      videoLoading.value = true;
    },
    fail: console.log,
  });
};

const handleStopRecord = () => {
  const ctx = Taro.createCameraContext();
  ctx.stopRecord({
    success: (res) => {
      showDialog.value = false;
      showCamera.value = false;
      progress.value = 0;
      clearInterval(intervalTimer.value);
      videoLoading.value = false;
      videoSrc.value = res.tempVideoPath;
      emit("update:value", {
        videoSrc: res.tempVideoPath,
        photoSrc: "",
      });
    },
  });
};
</script>

<style lang="scss">
.camera-operate__block {
  .nut-popup--bottom {
    display: flex;
    flex-direction: column;
    gap: 36rpx;
    padding: 36rpx;
    box-sizing: border-box;
    align-items: center;

    width: 100%;
    height: 400rpx;

    .nut-button {
      width: 80%;
    }
  }
}

.camera-play__wrapper {
  .camera__block {
    height: 80%;
  }

  .play-btn {
    width: 100%;
    position: fixed;
    bottom: 100rpx;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 84rpx;
    box-sizing: border-box;

    .video-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24rpx;
    }

    .nut-icon-rect-left {
      font-size: 86rpx;
      z-index: 999990000;
    }

    .nut-icon-loading {
      font-size: 64rpx;
    }

    &__outer {
      width: 130rpx;
      height: 130rpx;
      border-radius: 100%;
      background-color: red;
      z-index: 999990000;
    }
  }
  .progress {
    z-index: 999999;

    .nut-progress-outer.nut-progress-base {
      border-radius: none;
    }
  }
}

.media {
  padding-top: 24rpx;
  width: 100%;
  height: 300px;
}
</style>
