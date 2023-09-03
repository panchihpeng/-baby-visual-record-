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
    <Dot class="title evaluate-title" :style="{ marginTop: '32rpx' }"
      >互动环节质量评价</Dot
    >
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
import qualityItem from "./quality-item/index.vue";
import { getPresetsDetailListByTeacherCode } from "@/services/quality";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";
import { useDidShow, usePullDownRefresh } from "@tarojs/taro";
import Dot from "@/components/dot/index.vue";
import dayjs from "dayjs";

const presetList = ref<any>([]);
const recordList = ref<any[]>([]);
const evaluateList = ref<any[]>([]);
const userStore = useUserStore();
const { userInfo, currRole } = storeToRefs(userStore);

const handleGetPresetsDetailListByTeacherCode = () => {
  if (userInfo.value.code) {
    getPresetsDetailListByTeacherCode({
      teacherCode: userInfo.value.code,
      role: currRole.value,
    })
      .then((res: any) => {
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
                // stage: el.status === 1 ? "开始" : el.status === 2 ? "结束" : "",
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
      })
      .catch((e) => {
        presetList.value = [];
        recordList.value = [];
        evaluateList.value = [];
        console.log(e);
      });
  }
};

useDidShow(() => {
  handleGetPresetsDetailListByTeacherCode();
});

usePullDownRefresh(() => {
  handleGetPresetsDetailListByTeacherCode();
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
  font-size: 30rpx;
  color: #333333;
  padding: 0 0 24rpx;
}
</style>
