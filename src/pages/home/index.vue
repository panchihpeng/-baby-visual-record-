<template>
  <view class="index">
    <Container>
      <view>
        <view class="card-wrapper teachers-with-kids">
          <view>我的师幼互动</view>
          <view @click="() => (state.isVisible = true)" class="my-date-picker">
            <view class="date-text">{{ state.date[0] }}</view>
            至
            <view class="date-text">{{ state.date[1] }}</view>
            <IconFont name="rect-down" color="#ffffff" />
          </view>
          <nut-calendar
            v-model:visible="state.isVisible"
            :default-value="state.date"
            :start-date="`2020-01-01`"
            :end-date="`2100-12-31`"
            type="range"
            @close="handleClose"
            @choose="setChooseValue"
            :is-auto-back-fill="true"
          >
          </nut-calendar>
        </view>
        <view class="card-wrapper" v-if="currPageRole === EnumRole.Recorder">
          <view>我作为记录者的师幼互动活动</view>
          <view>
            <view v-for="item in recorderActionList">
              <view class="evaluator-item">
                <view>
                  <view>{{ item.subject }}</view>
                  <view class="evaluator-item__time">{{
                    item.updateTime
                  }}</view>
                </view>
                <nut-button
                  plain
                  size="small"
                  color="#ff9e4c"
                  @click="handleGoQualityFeedback(item.code)"
                  >点击查看点评记录</nut-button
                >
              </view>
            </view>
          </view>
          <view style="margin: 20rpx 0" v-if="totalRecordItems > 10">
            <nut-pagination
              style="display: flex; justify-content: center"
              v-model="currentRecordPage"
              :total-items="totalRecordItems"
              :items-per-page="10"
              @change="pageRecordChange"
            />
          </view>
        </view>
        <view class="card-wrapper" v-if="currPageRole === EnumRole.Evaluator">
          <view>我作为观察评价者的师幼互动活动</view>
          <view>
            <view v-for="item in evaluatorActionList">
              <view class="evaluator-item">
                <view>
                  <view>{{ item.subject }}</view>
                  <view class="evaluator-item__time">{{
                    item.updateTime
                  }}</view>
                </view>
                <nut-button
                  plain
                  size="small"
                  color="#ff9e4c"
                  @click="handleGoQualityFeedback(item.code)"
                  >点击查看点评记录</nut-button
                >
              </view>
            </view>
          </view>
          <view style="margin: 20rpx 0" v-if="totalEvaluatorItems > 10">
            <nut-pagination
              style="display: flex; justify-content: center"
              v-model="currentEvaluatorPage"
              :total-items="totalEvaluatorItems"
              :items-per-page="10"
              @change="pageEvaluatorChange"
            />
          </view>
        </view>
        <view class="card-wrapper" v-if="currPageRole === EnumRole.Student">
          <view>我作为被观察者的师幼互动活动</view>
          <view>
            <view v-for="item in studentActionList">
              <view class="evaluator-item">
                <view>
                  <view>{{ item.subject }}</view>
                  <view class="evaluator-item__time">{{
                    item.updateTime
                  }}</view>
                </view>
                <nut-button
                  plain
                  color="#ff9e4c"
                  size="small"
                  @click="handleGoQualityFeedback(item.code)"
                  >点击查看点评记录</nut-button
                >
              </view>
            </view>
          </view>
          <view style="margin: 20rpx 0" v-if="totalItems > 10">
            <nut-pagination
              style="display: flex; justify-content: center"
              v-model="currentPage"
              :total-items="totalItems"
              :items-per-page="10"
              @change="pageChange"
            />
          </view>
        </view>
      </view>
      <view class="card-wrapper" v-if="currPageRole === EnumRole.Evaluator">
        <view>我的观察评价工作</view>
        <e-chart
          ref="evaluatorChartRef"
          canvas-id="bar-canvas"
          class="chart-box"
        />
      </view>
      <view class="card-wrapper" v-if="currPageRole === EnumRole.Student">
        <view>我的专业发展轨迹</view>
        <e-chart
          ref="studentChartRef"
          canvas-id="line-canvas"
          class="chart-box"
        />
      </view>
      <view class="card-wrapper" v-if="currPageRole === EnumRole.Recorder">
        <view>互动儿童数据统计</view>
        <e-chart
          ref="recorderChartRef"
          canvas-id="bar-canvas-1"
          class="chart-box"
        />
      </view>
    </Container>
  </view>
</template>

<script lang="ts" setup>
import { ref, watch, reactive } from "vue";
import Container from "@/components/container/index.vue";
import { EChart } from "echarts4taro3";
import Taro, { useDidHide, useDidShow, usePullDownRefresh } from "@tarojs/taro";
import { IconFont } from "@nutui/icons-vue-taro";
import dayjs from "dayjs";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { EnumRole } from "@/constants";
import {
  getQualityListByEvaluator,
  getQualityListByRecorder,
  getQualityListByStudent,
  getPresetsChartChildren,
  getPresetsChartDevelop,
  getPresetsChartEvaluate,
} from "@/services/home";
import { getBarOption, getLineOption } from "./cfg";
import { Pagination } from "@nutui/nutui-taro";

const userStore = useUserStore();
const { userInfo, currPageRole } = storeToRefs(userStore);

const isMounted = ref(false);
const evaluatorChartRef = ref<any>(null);
const studentChartRef = ref<any>(null);
const recorderChartRef = ref<any>(null);

const studentActionList = ref<any[]>([]);
const evaluatorActionList = ref<any[]>([]);
const recorderActionList = ref<any[]>([]);
const state = reactive({
  date: [
    dayjs().add(-1, "M").format("YYYY-MM-DD"),
    dayjs().format("YYYY-MM-DD"),
  ],
  isVisible: false,
});

// 分页
const totalItems = ref<number>(0);
const currentPage = ref<number>(1);

//  分页record

const totalRecordItems = ref<number>(0);
const currentRecordPage = ref<number>(1);

// 分页evaluator
const totalEvaluatorItems = ref<number>(0);
const currentEvaluatorPage = ref<number>(1);

watch([currPageRole, isMounted], () => {
  if (isMounted.value) {
    handleLoadData();
  }
});

usePullDownRefresh(() => {
  handleLoadData();
});

const setChooseValue = (param) => {
  state.date = [...[param[0][3], param[1][3]]];
  handleLoadData();
};

const handleClose = () => {
  state.isVisible = false;
};

const handleLoadData = () => {
  Taro.nextTick(() => {
    setTimeout(() => {
      switch (currPageRole.value) {
        case EnumRole.Evaluator:
          handleEvaluator();
          pageEvaluatorChange(currentPage.value);
          break;
        case EnumRole.Student:
          handleStudent();
          pageChange(currentPage.value);
          break;
        case EnumRole.Recorder:
          handleRecorder();
          pageRecordChange(currentPage.value);
          break;
        default:
          break;
      }
    }, 200);
  });
};

// Evaluator 分页
const pageEvaluatorChange = (value: number) => {
  getQualityListByEvaluatorWrapper(value - 1);
};

const getQualityListByEvaluatorWrapper = (offset) => {
  getQualityListByEvaluator({
    teacherCode: userInfo.value.code,
    startDate: state.date[0],
    endDate: state.date[1],
    offset,
    limit: 10,
  }).then((res: any) => {
    evaluatorActionList.value = res?.data?.rows;
    totalEvaluatorItems.value = res?.data?.total;
  });
};

const handleEvaluator = () => {
  getPresetsChartEvaluate(userInfo.value.code).then((res: any) => {
    if (res.data) {
      evaluatorChartRef.value
        .refresh(getBarOption(res.data || {}))
        .then((myChart) => {
          setTimeout(() => {
            myChart.setOption(getBarOption(res.data || {}));
          });
        });
    }
  });
};

const pageChange = (value: number) => {
  getQualityListByStudentWrapper(value - 1);
};

const getQualityListByStudentWrapper = (offset) => {
  getQualityListByStudent({
    teacherCode: userInfo.value.code,
    startDate: state.date[0],
    endDate: state.date[1],
    offset,
    limit: 10,
  }).then((res: any) => {
    totalItems.value = res?.data?.total;
    studentActionList.value = res?.data?.rows;
  });
};

const handleStudent = () => {
  getPresetsChartDevelop(userInfo.value.code).then((res: any) => {
    if (res.data) {
      studentChartRef.value
        .refresh(getLineOption(res.data || {}))
        .then((myChart) => {
          setTimeout(() => {
            myChart.setOption(getLineOption(res.data || {}));
          });
        });
    }
  });
};

const pageRecordChange = (value: number) => {
  getQualityListByRecorderWrapper(value - 1);
};

const getQualityListByRecorderWrapper = (offset) => {
  getQualityListByRecorder({
    classCode: userInfo.value.classCode,
    startDate: state.date[0],
    endDate: state.date[1],
    offset,
    limit: 10,
  }).then((res: any) => {
    totalRecordItems.value = res?.data?.total;
    recorderActionList.value = res?.data?.rows;
  });
};

const handleRecorder = () => {
  getPresetsChartChildren(userInfo.value.code).then((res: any) => {
    if (res.data) {
      recorderChartRef.value
        .refresh(getLineOption(res.data || {}))
        .then((myChart) => {
          setTimeout(() => {
            myChart.setOption(getLineOption(res.data || {}));
          });
        });
    }
  });
};

const handleGoQualityFeedback = (presetsCode: string) => {
  if (presetsCode) {
    Taro.navigateTo({
      url: `/pages/my-quality-feedback/index?presetsCode=${presetsCode}`,
    });
  }
};

useDidShow(() => (isMounted.value = true));

useDidHide(() => (isMounted.value = false));
</script>

<style lang="scss">
.card-wrapper {
  background-color: #fff;
  border: 2rpx solid #ff9e4c;
  border-radius: 12rpx;
  margin-bottom: 24rpx;
  padding: 24rpx;

  .evaluator-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24rpx 0;

    &__time {
      color: #666;
    }
  }
}
.teachers-with-kids {
  background-color: #ff9e4c !important;
  color: #fff !important;
}
.chart-box {
  height: 650rpx;
  margin-top: 30rpx;
}

.my-date-picker {
  display: flex;
  gap: 12px;
  margin-top: 6px;

  .date-text {
    color: #fff;
  }
}

.nut-pagination {
  color: #666;
}
.nut-pagination .active {
  background: #ff9e4c !important;
}
</style>
