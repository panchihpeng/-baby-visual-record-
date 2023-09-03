<template>
  <view class="interactive-steps">
    <nut-steps
      :progress-dot="progressDot"
      :current="99"
      :direction="verticalLayout ? 'vertical' : 'horizontal'"
      v-if="!!interactiveList.length"
    >
      <nut-step
        v-for="presetItem in interactiveList"
        :title="presetItem.linkName"
        :content="getStepContent(presetItem)"
      ></nut-step>
    </nut-steps>
    <view v-else class="interactive-steps__empty"> 暂无互动环节 </view>
  </view>
</template>

<script lang="ts" setup>
import { PropType } from "vue";

type interactiveItem = {
  linkName: string;
  actionName?: string;
  duration?: number;
};

const {
  interactiveList,
  inlineDuration,
  progressDot = false,
  verticalLayout,
} = defineProps({
  interactiveList: {
    type: Array as PropType<interactiveItem[]>,
    required: true,
  },
  inlineDuration: {
    type: Boolean,
  },
  progressDot: {
    type: Boolean,
  },
  verticalLayout: {
    type: Boolean,
  },
});

type presetItem = {
  linkName: string;
  actionName?: string;
  duration?: number;
  stage?: string;
  time?: string;
};

const getStepContent = (item: presetItem) => {
  let res = "";
  if (inlineDuration) {
    const actionName = item.actionName;
    const durationText = item.duration ? `${item.duration}分钟` : undefined;
    return `<view>${[actionName, durationText]
      .filter(Boolean)
      .join("：")}</view>`;
  }
  if (item.actionName) {
    res += `<view  class="base-color" >${item.actionName}</view>`;
  }

  if (item.duration) {
    res += `<view>${item.duration}分钟</view>`;
  }
  if (item.time) {
    res += `<view>${item.time}</view>`;
  }
  return res;
};
</script>

<style lang="scss">
.interactive-steps {
  .nut-steps {
    overflow: auto;
    padding: 24rpx 0;
    background-color: #fff;
    border-radius: 12rpx;

    .nut-step {
      min-width: 200rpx;
    }
  }

  &__empty {
    padding: 24rpx 0;
    background-color: #fff;
    text-align: center;
    border-radius: 12rpx;
  }

  .nut-step-icon-inner {
    color: #fff;
  }
  .nut-step-icon.is-icon {
    border-width: 0;
    background-color: #ff983d;
  }
  .nut-step.nut-step-finish .nut-step-icon.is-icon {
    background-color: #ff983d;
  }
  .nut-step.nut-step-finish .nut-step-title,
  .base-color {
    color: #ff983d;
  }
  .nut-step.nut-step-finish .nut-step-line {
    background: #ff983d;
  }
}
</style>
