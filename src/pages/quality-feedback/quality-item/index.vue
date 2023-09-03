<template>
  <view class="quality-item-wrapper">
    <view class="author-title">质量评价者：{{ evaluator }}</view>
    <view class="quality-content">
      <nut-steps
        progress-dot
        :current="99"
        direction="horizontal"
        style="overflow: auto"
      >
        <nut-step v-for="item in evaluateContentList" :title="item.linkName">
          <template #content>
            <view class="evaluate-content" v-if="item.showContent ?? true">
              <view class="evaluate-text">
                <view class="evaluate-text-title">评价时间：</view>
                <view :style="{ color: '#333' }" class="evaluate-text-right">{{
                  dayjs(item.createTime).format("HH:mm:ss")
                }}</view>
              </view>
              <view class="evaluate-rate">
                <view class="evaluate-text-title">评价星级：</view>
                <view class="evaluate-text-right">
                  <nut-rate
                    :model-value="item.qualityLevel"
                    :count="item.qualityLevel"
                    spacing="0"
                  />
                </view>
              </view>
              <view class="evaluate-text">
                <view class="evaluate-text-title">评价文字：</view>
                <view :style="{ color: '#333' }" class="evaluate-text-right">
                  {{ item.qualityDescription }}
                </view>
              </view>
              <view class="evaluate-media">
                <view class="evaluate-text-title">照片视频：</view>
                <view class="evaluate-text-right">
                  <!-- style="display: flex; justify-content: center" -->
                  <image
                    class="media"
                    v-if="getShowImage(item?.file)"
                    :src="item?.file!"
                    style="width: 300rpx"
                  ></image>
                  <video
                    class="media"
                    v-if="getShowVideo(item?.file)"
                    :src="item?.file!"
                    style="width: 300rpx"
                  />
                </view>
              </view>
            </view>
          </template>
        </nut-step>
      </nut-steps>
    </view>
  </view>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";
import { PropType } from "vue";
export type evaluateItem = {
  linkName: string;
  showContent?: false;
  qualityLevel?: number;
  qualityDescription?: string;
  file?: string;
  createTime?: string;
};
const { evaluateContentList, evaluator } = defineProps({
  evaluateContentList: {
    type: Array as PropType<evaluateItem[]>,
    default: [],
  },
  evaluator: {
    type: String,
  },
});

const getShowImage = (filePath?: string) => {
  if (!filePath) return false;
  return ["jpg", "jpeg", "png", "webp"].some((suffix) =>
    filePath.toLocaleLowerCase().endsWith(suffix)
  );
};

const getShowVideo = (filePath?: string) => {
  if (!filePath) return false;
  return ["webm", "mp4", "wmv", "flv", "avi", "mov"].some((suffix) =>
    filePath.toLocaleLowerCase().endsWith(suffix)
  );
};
</script>

<style lang="scss">
.author-title {
  font-size: 24rpx;
  padding: 24rpx 24px;
  color: #333;
}

.quality-item-wrapper {
  background-color: #fff;
  border-radius: 12rpx;
}

.quality-content {
  // width: 100%;
  display: flex;
  padding-left: 24rpx;

  .nut-step-main {
    padding-bottom: 20rpx;
  }

  .nut-steps {
    flex: 1;
  }
}

.evaluate {
  &-content {
    display: flex;
    flex-direction: column;
    gap: 12rpx;
  }

  &-rate {
    display: flex;
  }

  &-text {
    display: flex;
    &-title {
      width: 200rpx;
    }
    &-right {
      width: 300rpx;
      text-align: left;
      overflow: auto;
    }
  }

  &-media {
    display: flex;
    gap: 12rpx;
  }
}
</style>
