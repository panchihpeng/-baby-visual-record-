<template>
  <Container hidden-header>
    <Dot class="title">预设互动环节</Dot>
    <view class="interactive-wrapper">
      <InteractiveSessionSteps :interactive-list="presetList" />
    </view>
    <Dot class="title" :style="{ marginTop: '32rpx' }">过程实录者</Dot>
    <view class="interactive-wrapper">
      <InteractiveSessionSteps :interactive-list="recordList" />
    </view>
    <view class="title evaluate-title" :style="{ marginTop: '32rpx' }">
      <Dot class="title evaluate-title" :style="{ marginTop: '32rpx' }"
        >互动环节质量评价</Dot
      >
    </view>
    <view v-for="evaluateItem in evaluateList" v-if="!!evaluateList.length">
      <quality-item
        :evaluate-content-list="evaluateItem.evaluateContent"
        :evaluator="evaluateItem.evaluator"
      />
    </view>
    <view v-else class="interactive-wrapper__empty">
      暂无互动环节质量评价
    </view>
  </Container>
</template>

<script lang="ts" setup>
import InteractiveSessionSteps from "@/components/interactive-session-steps/index.vue";
import Container from "@/components/container/index.vue";
import qualityItem from "../../pages/quality-feedback/quality-item/index.vue";
import { getPresetsDetailListByPresetsCode } from "@/services/quality";
import { ref, onMounted } from "vue";
import { getCurrentInstance, usePullDownRefresh } from "@tarojs/taro";
import dayjs from "dayjs";

const presetList = ref<any>([]);
const recordList = ref<any[]>([]);
const evaluateList = ref<any[]>([]);

const handleGetPresetsDetailListByPresetsCode = () => {
  const queryParams = getCurrentInstance().router?.params || {};
  if (queryParams.presetsCode) {
    getPresetsDetailListByPresetsCode(queryParams.presetsCode).then(
      (res: any) => {
        if (res.data) {
          if (res.data.class) {
            presetList.value = [
              {
                linkName: "开始",
              },
              ...res.data?.class?.map((el: any) => ({
                linkName: el.linkName,
                actionName: el.actionName,
                duration: el.duration,
              })),
            ];
          }

          if (res.data.record) {
            recordList.value = [
              {
                linkName: "开始",
              },
              ...res.data?.record?.map((el: any) => ({
                linkName: el.linkName || el.link,
                actionName: el.actionName || el.action,
                duration: el.duration,
                time: dayjs(el.createTime).format("HH:mm:ss"),
              })),
            ];
          }

          if (res.data.evaluate) {
            const values = Object.entries(res.data.evaluate || {});
            evaluateList.value = values.map(([evaluator, evaluateContent]) => ({
              evaluator,
              evaluateContent,
            }));
          }
        }
      }
    );
  }
};

onMounted(() => {
  handleGetPresetsDetailListByPresetsCode();
});

usePullDownRefresh(() => {
  handleGetPresetsDetailListByPresetsCode();
});
</script>
<style lang="scss">
.interactive-wrapper {
  background-color: #fff;
  border-radius: 12rpx;

  &__empty {
    padding: 24rpx 0;
    background-color: #fff;
    text-align: center;
    border-radius: 12rpx;
  }
}

.title {
  font-size: 32rpx;
  color: #333333;
  padding: 0 0 24rpx;
}

.evaluate-title {
  display: flex;
  justify-content: space-between;

  .more-icon {
    font-size: 28rpx;
    color: #999;
    display: flex;
    align-items: center;
    font-weight: 400;
  }
}
</style>
